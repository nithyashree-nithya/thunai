"use strict";

/* One interface, two implementations.
   - Real: calls PayPal REST APIs (Orders v2 and Payouts) with your sandbox or live keys.
   - Mock: used automatically when no keys are set, so the app runs with no setup.

   Both return the same shapes:
     createOrder({ ref, usd, description, baseUrl }) -> { id, approveUrl }
     orderStatus(id)                                 -> "CREATED" | "APPROVED" | "COMPLETED" | "FAILED"
     capture(id)                                     -> { captureId }
     payout(payload)                                 -> { batchId }
*/

const crypto = require("crypto");

const BASES = { sandbox: "https://api-m.sandbox.paypal.com", live: "https://api-m.paypal.com" };

function providerError(res, body) {
  const detail = (body && (body.message || body.error_description || body.name)) || "request failed";
  const debug = body && body.debug_id ? " (debug id " + body.debug_id + ")" : "";
  const err = new Error("PayPal error " + res.status + ": " + detail + debug);
  err.status = 502;
  return err;
}

function createPayments(env) {
  env = env || process.env;
  const clientId = env.PAYPAL_CLIENT_ID;
  const secret = env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) return createMock();

  const mode = env.PAYPAL_ENV === "live" ? "live" : "sandbox";
  const base = env.PAYPAL_BASE_URL || BASES[mode]; // PAYPAL_BASE_URL is only for tests with a fake PayPal
  let token = null;
  let tokenExpires = 0;

  async function accessToken() {
    if (token && Date.now() < tokenExpires - 30000) return token;
    const res = await fetch(base + "/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(clientId + ":" + secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw providerError(res, body);
    token = body.access_token;
    tokenExpires = Date.now() + body.expires_in * 1000;
    return token;
  }

  async function call(method, path, body) {
    const headers = { Authorization: "Bearer " + (await accessToken()), "Content-Type": "application/json" };
    if (method === "POST") headers["PayPal-Request-Id"] = crypto.randomUUID();
    const res = await fetch(base + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await res.text();
    let json = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch (err) {
      json = { message: text.slice(0, 200) };
    }
    if (!res.ok) throw providerError(res, json);
    return json;
  }

  return {
    mode,

    async createOrder({ ref, usd, description, baseUrl }) {
      const json = await call("POST", "/v2/checkout/orders", {
        intent: "CAPTURE",
        purchase_units: [
          { reference_id: ref, custom_id: ref, description, amount: { currency_code: "USD", value: usd.toFixed(2) } }
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: "Thunai",
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
              return_url: baseUrl + "/thanks.html",
              cancel_url: baseUrl + "/thanks.html?cancelled=1"
            }
          }
        }
      });
      const links = json.links || [];
      const link = links.find((l) => l.rel === "payer-action") || links.find((l) => l.rel === "approve");
      if (!link) throw new Error("PayPal did not return an approval link.");
      return { id: json.id, approveUrl: link.href };
    },

    async orderStatus(id) {
      const json = await call("GET", "/v2/checkout/orders/" + encodeURIComponent(id));
      if (json.status === "APPROVED") return "APPROVED";
      if (json.status === "COMPLETED") return "COMPLETED";
      if (json.status === "VOIDED") return "FAILED";
      return "CREATED";
    },

    async capture(id) {
      const json = await call("POST", "/v2/checkout/orders/" + encodeURIComponent(id) + "/capture", {});
      if (json.status !== "COMPLETED") throw new Error("PayPal did not complete the capture (status " + json.status + ").");
      const unit = (json.purchase_units || [])[0] || {};
      const cap = ((unit.payments || {}).captures || [])[0] || {};
      return { captureId: cap.id || null };
    },

    async payout(payload) {
      const json = await call("POST", "/v1/payments/payouts", payload);
      return { batchId: (json.batch_header || {}).payout_batch_id || null };
    }
  };
}

function createMock() {
  const approved = new Set();
  const completed = new Set();
  const hex = (n) => crypto.randomBytes(n).toString("hex").toUpperCase();
  return {
    mode: "mock",
    async createOrder({ baseUrl }) {
      const id = "MOCK-" + hex(6);
      return { id, approveUrl: baseUrl + "/mock/approve/" + id };
    },
    async orderStatus(id) {
      return completed.has(id) ? "COMPLETED" : approved.has(id) ? "APPROVED" : "CREATED";
    },
    async capture(id) {
      if (!approved.has(id)) throw new Error("Order is not approved.");
      completed.add(id);
      return { captureId: "MOCKCAP-" + hex(5) };
    },
    async payout() {
      return { batchId: "MOCKBATCH-" + hex(5) };
    },
    mockApprove(id) {
      approved.add(id);
    }
  };
}

module.exports = { createPayments };
