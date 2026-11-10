"use strict";

/* Sample history so the dashboard is not empty on first run.
   Rows are marked demo: true and are never included in payouts.
   Turn off with SEED_DEMO=false. */

const { NGOS } = require("./catalog");

function seedDemo(store) {
  const { db } = store;
  if (db.ledger.length > 0) return;
  const sales = [30, 45, 75, 50, 20, 65, 95, 25, 55, 70, 35, 60];
  const now = Date.now();
  sales.forEach((sub, i) => {
    let gift = Math.ceil(sub / 10) * 10 - sub;
    if (gift === 0) gift = 10;
    const ngo = NGOS[i % NGOS.length];
    db.ledger.push({
      id: "TH-DEMO" + String(i + 1).padStart(2, "0"),
      orderId: "DEMO-" + (i + 1),
      time: new Date(now - i * 14 * 3600 * 1000).toISOString(),
      ngoId: ngo.id,
      ngoName: ngo.name,
      sub,
      gift,
      match: gift / 2,
      usd: Math.round(((sub + gift) / 90) * 100) / 100,
      intl: true,
      payoutStatus: "sent",
      payoutBatchId: "demo-batch",
      demo: true
    });
  });
  store.save();
}

module.exports = { seedDemo };
