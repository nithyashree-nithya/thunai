"use strict";

/* Runs the real PayPal client against a small fake PayPal server,
   to check the exact requests Thunai sends. No network, no keys needed. */

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("http");
const os = require("os");
const path = require("path");
const fs = require("fs");
const { createApp } = require("../server/app");

function fakePayPal() {
  const seen = [];
  let approved = false;
  const server = http.createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      const body = raw && req.headers["content-type"] && req.headers["content-type"].includes("json") ? JSON.parse(raw) : raw;
      seen.push({ method: req.method, url: req.url, auth: req.headers.authorization, requestId: req.headers["paypal-request-id"], body });
      const send = (code, obj) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(obj)); };
      if (req.url === "/v1/oauth2/token") return send(200, { access_token: "tok123", expires_in: 3600 });
      if (req.method === "POST" && req.url === "/v2/checkout/orders") {
        return send(201, { id: "ORD1", status: "PAYER_ACTION_REQUIRED", links: [{ rel: "payer-action", href: "https://paypal.test/approve/ORD1" }] });
      }
      if (req.method === "GET" && req.url === "/v2/checkout/orders/ORD1") return send(200, { status: approved ? "APPROVED" : "PAYER_ACTION_REQUIRED" });
      if (req.method === "POST" && req.url === "/v2/checkout/orders/ORD1/capture") {
        return send(201, { status: "COMPLETED", purchase_units: [{ payments: { captures: [{ id: "CAP1" }] } }] });
      }
      if (req.method === "POST" && req.url === "/v1/payments/payouts") return send(201, { batch_header: { payout_batch_id: "PB1" } });
      send(404, { name: "NOT_FOUND", message: "no route" });
    });
  });
  return new Promise((resolve) =>
    server.listen(0, () => resolve({ server, seen, approve: () => { approved = true; }, url: "http://127.0.0.1:" + server.address().port }))
  );
}

test("real PayPal client sends the right requests", async (t) => {
  const fake = await fakePayPal();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "thunai-pp-"));
  const app = createApp({
    env: {
      DATA_FILE: path.join(dir, "db.json"), SEED_DEMO: "false", ADMIN_TOKEN: "secret-token",
      PAYPAL_CLIENT_ID: "cid", PAYPAL_CLIENT_SECRET: "csecret", PAYPAL_ENV: "sandbox", PAYPAL_BASE_URL: fake.url,
      BASE_URL: "https://thunai.example"
    }
  });
  const server = await new Promise((resolve) => { const s = app.listen(0, () => resolve(s)); });
  const base = "http://127.0.0.1:" + server.address().port;
  t.after(() => { server.close(); fake.server.close(); });

  const call = async (p, init) => {
    const res = await fetch(base + p, Object.assign({ headers: { "Content-Type": "application/json" } }, init));
    return { status: res.status, body: await res.json() };
  };

  const created = await call("/api/orders", { method: "POST", body: JSON.stringify({ items: [{ id: "A1", qty: 1 }], roundup: true, ngoId: "n2" }) });
  assert.equal(created.status, 201);
  assert.equal(created.body.mode, "sandbox");
  assert.equal(created.body.approveUrl, "https://paypal.test/approve/ORD1");

  const tokenReq = fake.seen.find((r) => r.url === "/v1/oauth2/token");
  assert.equal(tokenReq.auth, "Basic " + Buffer.from("cid:csecret").toString("base64"));
  const orderReq = fake.seen.find((r) => r.url === "/v2/checkout/orders");
  assert.equal(orderReq.auth, "Bearer tok123");
  assert.ok(orderReq.requestId, "idempotency header is sent");
  assert.equal(orderReq.body.intent, "CAPTURE");
  assert.deepEqual(orderReq.body.purchase_units[0].amount, { currency_code: "USD", value: "0.44" });
  assert.equal(orderReq.body.payment_source.paypal.experience_context.return_url, "https://thunai.example/thanks.html");

  const early = await call("/api/orders/ORD1/capture", { method: "POST" });
  assert.equal(early.status, 409);

  fake.approve();
  const cap = await call("/api/orders/ORD1/capture", { method: "POST" });
  assert.equal(cap.status, 200);
  assert.equal(cap.body.receipt.captureId, "CAP1");

  const noToken = await call("/api/payouts/send", { method: "POST" });
  assert.equal(noToken.status, 401);
  const sent = await call("/api/payouts/send", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-token": "secret-token" } });
  assert.equal(sent.status, 200);
  assert.equal(sent.body.batchId, "PB1");
  const payoutReq = fake.seen.find((r) => r.url === "/v1/payments/payouts");
  assert.equal(payoutReq.body.items[0].recipient_type, "EMAIL");
  assert.equal(payoutReq.body.items[0].amount.currency, "USD");
  assert.equal(payoutReq.body.items[0].sender_item_id.startsWith("n2-"), true);
});
