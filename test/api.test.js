"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const os = require("os");
const path = require("path");
const fs = require("fs");
const { createApp } = require("../server/app");

function startServer() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "thunai-"));
  const app = createApp({ env: { DATA_FILE: path.join(dir, "db.json"), SEED_DEMO: "false" } });
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve({ server, base: "http://127.0.0.1:" + server.address().port }));
  });
}

async function json(base, p, init) {
  const res = await fetch(base + p, Object.assign({ headers: { "Content-Type": "application/json" } }, init));
  return { status: res.status, body: await res.json() };
}

test("thunai API", async (t) => {
  const { server, base } = await startServer();
  t.after(() => server.close());

  await t.test("runs in demo mode without PayPal keys", async () => {
    const r = await json(base, "/api/config");
    assert.equal(r.status, 200);
    assert.equal(r.body.mode, "mock");
    assert.equal(r.body.products.length, 4);
  });

  await t.test("rejects invalid items", async () => {
    const r = await json(base, "/api/orders", { method: "POST", body: JSON.stringify({ items: [{ id: "ZZ", qty: 1 }] }) });
    assert.equal(r.status, 400);
  });

  await t.test("requires a partner when rounding up", async () => {
    const r = await json(base, "/api/orders", { method: "POST", body: JSON.stringify({ items: [{ id: "A1", qty: 1 }], roundup: true }) });
    assert.equal(r.status, 400);
  });

  let orderId;
  await t.test("prices an order on the server", async () => {
    const r = await json(base, "/api/orders", {
      method: "POST",
      body: JSON.stringify({ items: [{ id: "A1", qty: 1 }, { id: "A2", qty: 1 }], roundup: true, ngoId: "n1", intl: true })
    });
    assert.equal(r.status, 201);
    assert.equal(r.body.price.sub, 75);
    assert.equal(r.body.price.gift, 5);
    assert.equal(r.body.price.match, 2.5);
    assert.equal(r.body.price.totalInr, 80);
    assert.equal(r.body.price.usd, 0.89);
    assert.match(r.body.approveUrl, /^http/);
    orderId = r.body.id;
  });

  await t.test("will not capture before approval", async () => {
    const r = await json(base, "/api/orders/" + orderId + "/capture", { method: "POST" });
    assert.equal(r.status, 409);
  });

  await t.test("captures after approval and records the gift", async () => {
    assert.equal((await json(base, "/api/mock/approve/" + orderId, { method: "POST" })).status, 200);
    const status = await json(base, "/api/orders/" + orderId);
    assert.equal(status.body.status, "APPROVED");
    const cap = await json(base, "/api/orders/" + orderId + "/capture", { method: "POST" });
    assert.equal(cap.status, 200);
    assert.equal(cap.body.receipt.gift, 5);
    const again = await json(base, "/api/orders/" + orderId + "/capture", { method: "POST" });
    assert.equal(again.body.receipt.id, cap.body.receipt.id);
    const ledger = await json(base, "/api/ledger");
    assert.equal(ledger.body.length, 1);
  });

  await t.test("collects gifts into a payout batch and sends it once", async () => {
    const pending = await json(base, "/api/payouts/pending");
    assert.equal(pending.body.length, 1);
    assert.equal(pending.body[0].ngoId, "n1");
    assert.equal(pending.body[0].inr, 7.5);
    assert.equal(pending.body[0].usd, 0.08);
    const preview = await json(base, "/api/payouts/preview");
    assert.equal(preview.body.payload.items[0].amount.currency, "USD");
    const sent = await json(base, "/api/payouts/send", { method: "POST" });
    assert.equal(sent.status, 200);
    assert.match(sent.body.batchId, /^MOCKBATCH-/);
    const after = await json(base, "/api/payouts/pending");
    assert.equal(after.body.length, 0);
    const second = await json(base, "/api/payouts/send", { method: "POST" });
    assert.equal(second.status, 409);
  });

  await t.test("serves a QR code only for http links", async () => {
    const ok = await fetch(base + "/api/qr?text=" + encodeURIComponent("https://example.com/x"));
    assert.equal(ok.status, 200);
    assert.match(ok.headers.get("content-type"), /svg/);
    const bad = await fetch(base + "/api/qr?text=javascript:alert(1)");
    assert.equal(bad.status, 400);
  });
});
