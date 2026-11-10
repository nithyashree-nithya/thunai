"use strict";

/* Sends the pending monthly payout batch by calling the running server.
   Use it from a scheduler (for example a Render cron job).
   Needs BASE_URL and ADMIN_TOKEN in the environment. */

require("dotenv").config();

const base = process.env.BASE_URL || "http://localhost:" + (process.env.PORT || 3000);
const token = process.env.ADMIN_TOKEN || "";

fetch(base + "/api/payouts/send", { method: "POST", headers: { "x-admin-token": token } })
  .then(async (res) => {
    const body = await res.json().catch(() => ({}));
    if (res.status === 409) {
      console.log("Nothing waiting for payout.");
      return;
    }
    if (!res.ok) throw new Error("HTTP " + res.status + ": " + (body.error || "request failed"));
    console.log("Payout batch sent:", body.batchId, "to", body.items.length, "partner(s).");
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
