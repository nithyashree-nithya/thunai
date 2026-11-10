"use strict";

const path = require("path");
const crypto = require("crypto");
const express = require("express");
const QRCode = require("qrcode");
const catalog = require("./catalog");
const { createStore } = require("./store");
const { createPayments } = require("./paypal");
const { seedDemo } = require("./seed");

const { PRODUCTS, NGOS, RATE, MEAL_INR, HttpError, priceOrder, round2, ngoEmail } = catalog;

function createApp(options) {
  options = options || {};
  const env = options.env || process.env;
  const store = options.store || createStore(env.DATA_FILE || path.join(__dirname, "..", "data", "db.json"));
  const pay = options.payments || createPayments(env);
  if (env.SEED_DEMO !== "false") seedDemo(store);
  const db = store.db;

  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(express.json({ limit: "10kb" }));
  app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Referrer-Policy", "no-referrer");
    next();
  });

  const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
  const baseUrl = (req) => env.BASE_URL || env.RENDER_EXTERNAL_URL || req.protocol + "://" + req.get("host");
  const rand6 = () => crypto.randomBytes(3).toString("hex").toUpperCase();

  function requireAdmin(req, res, next) {
    const token = env.ADMIN_TOKEN;
    if (!token) {
      if (pay.mode === "mock") return next();
      return next(new HttpError(403, "Set ADMIN_TOKEN to use this endpoint."));
    }
    const given = Buffer.from(String(req.get("x-admin-token") || ""));
    const wanted = Buffer.from(token);
    if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) {
      return next(new HttpError(401, "Admin token required."));
    }
    next();
  }

  /* ---------- read models ---------- */
  function ngosView() {
    return NGOS.map((n) => {
      const given = db.ledger.filter((r) => r.ngoId === n.id).reduce((s, r) => s + r.gift + r.match, 0);
      return { id: n.id, name: n.name, kind: n.kind, need: n.need, goal: n.goal, raised: round2(n.baseRaised + given) };
    });
  }

  function pendingPayouts() {
    const groups = {};
    for (const r of db.ledger) {
      if (r.demo || r.payoutStatus !== "pending" || !r.ngoId) continue;
      const g = groups[r.ngoId] || (groups[r.ngoId] = { ngoId: r.ngoId, rows: 0, inr: 0 });
      g.rows += 1;
      g.inr += r.gift + r.match;
    }
    return Object.values(groups)
      .map((g) => {
        const ngo = NGOS.find((n) => n.id === g.ngoId);
        const inr = round2(g.inr);
        return { ngoId: g.ngoId, name: ngo.name, rows: g.rows, inr, usd: round2(inr / RATE) };
      })
      .filter((g) => g.usd >= 0.01);
  }

  function stats() {
    let sales = 0;
    let gifts = 0;
    let match = 0;
    for (const r of db.ledger) {
      sales += r.sub;
      gifts += r.gift;
      match += r.match;
    }
    const given = gifts + match;
    return {
      mode: pay.mode,
      rate: RATE,
      orders: db.ledger.length,
      salesInr: round2(sales),
      giftsInr: round2(gifts),
      matchInr: round2(match),
      totalGivenInr: round2(given),
      meals: Math.floor(given / MEAL_INR),
      pendingInr: round2(pendingPayouts().reduce((s, i) => s + i.inr, 0))
    };
  }

  function buildBatch() {
    const items = pendingPayouts();
    const now = new Date();
    const stamp = now.getUTCFullYear() + "-" + String(now.getUTCMonth() + 1).padStart(2, "0");
    const batchId = "thunai-" + stamp + "-" + Date.now();
    const payload = {
      sender_batch_header: {
        sender_batch_id: batchId,
        email_subject: "Your Thunai round-up gifts",
        email_message: "Gifts from vending machine customers, plus the sponsor match."
      },
      items: items.map((i) => ({
        recipient_type: "EMAIL",
        receiver: ngoEmail(NGOS.find((n) => n.id === i.ngoId)),
        amount: { value: i.usd.toFixed(2), currency: "USD" },
        note: "Round-up gifts and sponsor match, " + stamp,
        sender_item_id: i.ngoId + "-" + stamp
      }))
    };
    return { batchId, items, payload };
  }

  /* ---------- API ---------- */
  app.get("/healthz", (req, res) => res.type("text").send("ok"));

  app.get("/api/config", (req, res) => {
    res.json({ mode: pay.mode, rate: RATE, currency: "USD", products: PRODUCTS, mealInr: MEAL_INR });
  });

  app.get("/api/ngos", (req, res) => res.json(ngosView()));
  app.get("/api/stats", (req, res) => res.json(stats()));

  app.get("/api/ledger", (req, res) => {
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    res.json(db.ledger.slice(0, limit));
  });

  app.post("/api/orders", h(async (req, res) => {
    const body = req.body || {};
    const price = priceOrder(body.items, { roundup: body.roundup, intl: body.intl });
    let ngo = null;
    if (price.gift > 0) {
      ngo = NGOS.find((n) => n.id === body.ngoId);
      if (!ngo) throw new HttpError(400, "Choose a partner for the round-up.");
    }
    const ref = "TH-" + rand6();
    const created = await pay.createOrder({
      ref,
      usd: price.usd,
      description: "Thunai vending purchase " + ref,
      baseUrl: baseUrl(req)
    });
    db.orders[created.id] = {
      id: created.id,
      ref,
      status: "CREATED",
      ngoId: ngo ? ngo.id : null,
      intl: body.intl !== false,
      price,
      createdAt: new Date().toISOString()
    };
    store.save();
    res.status(201).json({ id: created.id, ref, approveUrl: created.approveUrl, mode: pay.mode, price });
  }));

  app.get("/api/orders/:id", h(async (req, res) => {
    const order = db.orders[req.params.id];
    if (!order) throw new HttpError(404, "Order not found.");
    if (order.status !== "COMPLETED") {
      const status = await pay.orderStatus(order.id);
      if (status === "CREATED" || status === "APPROVED") order.status = status;
    }
    res.json({ id: order.id, status: order.status, receipt: order.receipt || null });
  }));

  app.post("/api/orders/:id/capture", h(async (req, res) => {
    const order = db.orders[req.params.id];
    if (!order) throw new HttpError(404, "Order not found.");
    if (order.status === "COMPLETED") return res.json({ receipt: order.receipt });
    if (order.capturing) throw new HttpError(409, "Capture already in progress.");
    order.capturing = true;
    try {
      const status = await pay.orderStatus(order.id);
      if (status !== "APPROVED") throw new HttpError(409, "The payment has not been approved in PayPal yet.");
      const cap = await pay.capture(order.id);
      const ngo = order.ngoId ? NGOS.find((n) => n.id === order.ngoId) : null;
      const p = order.price;
      const receipt = {
        id: order.ref,
        orderId: order.id,
        captureId: cap.captureId,
        time: new Date().toISOString(),
        sub: p.sub,
        gift: p.gift,
        match: p.match,
        saved: p.saved,
        usd: p.usd,
        ngo: ngo ? ngo.name : null
      };
      order.status = "COMPLETED";
      order.receipt = receipt;
      db.ledger.unshift({
        id: order.ref,
        orderId: order.id,
        captureId: cap.captureId,
        time: receipt.time,
        ngoId: ngo ? ngo.id : null,
        ngoName: ngo ? ngo.name : null,
        sub: p.sub,
        gift: p.gift,
        match: p.match,
        usd: p.usd,
        intl: order.intl,
        payoutStatus: ngo ? "pending" : "none"
      });
      store.save();
      res.json({ receipt });
    } finally {
      order.capturing = false;
    }
  }));

  /* Demo mode only: lets the page and a phone "approve" without PayPal. */
  app.post("/api/mock/approve/:id", (req, res, next) => {
    if (pay.mode !== "mock" || !db.orders[req.params.id]) return next(new HttpError(404, "Not found."));
    pay.mockApprove(req.params.id);
    res.json({ ok: true });
  });
  app.get("/mock/approve/:id", (req, res, next) => {
    if (pay.mode !== "mock" || !db.orders[req.params.id]) return next(new HttpError(404, "Not found."));
    pay.mockApprove(req.params.id);
    res.type("html").send("<!doctype html><meta name=viewport content='width=device-width,initial-scale=1'><title>Approved</title><body style='font-family:system-ui;padding:2rem'><h1>Approved (demo)</h1><p>This simulates approving the payment in PayPal. Go back to the machine screen.</p>");
  });

  app.get("/api/payouts/pending", (req, res) => res.json(pendingPayouts()));

  app.get("/api/payouts/preview", requireAdmin, (req, res) => res.json(buildBatch()));

  app.post("/api/payouts/send", requireAdmin, h(async (req, res) => {
    const batch = buildBatch();
    if (batch.items.length === 0) throw new HttpError(409, "Nothing is waiting for payout.");
    const sent = await pay.payout(batch.payload);
    const ngoIds = new Set(batch.items.map((i) => i.ngoId));
    for (const r of db.ledger) {
      if (!r.demo && r.payoutStatus === "pending" && ngoIds.has(r.ngoId)) {
        r.payoutStatus = "sent";
        r.payoutBatchId = sent.batchId;
      }
    }
    db.payoutBatches.unshift({ id: sent.batchId, senderBatchId: batch.batchId, time: new Date().toISOString(), items: batch.items });
    store.save();
    res.json({ batchId: sent.batchId, items: batch.items });
  }));

  app.get("/api/qr", h(async (req, res) => {
    const text = String(req.query.text || "");
    if (!/^https?:\/\//i.test(text) || text.length > 1000) throw new HttpError(400, "Provide an http(s) link.");
    const svg = await QRCode.toString(text, { type: "svg", margin: 1, errorCorrectionLevel: "M" });
    res.type("image/svg+xml").set("Cache-Control", "no-store").send(svg);
  }));

  /* ---------- static files ---------- */
  app.use("/vendor/ag-grid", express.static(path.join(__dirname, "..", "node_modules", "ag-grid-community", "dist")));
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use("/api", (req, res, next) => next(new HttpError(404, "Not found.")));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status >= 500 && !err.status ? "Something went wrong." : err.message });
  });

  return app;
}

module.exports = { createApp };
