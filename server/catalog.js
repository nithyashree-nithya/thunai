"use strict";

/* Products, partner organisations and the pricing rules.
   The server is the only place prices are decided. The browser shows the same
   numbers for display, but never sends an amount to PayPal. */

const RATE = Number(process.env.FX_RATE_INR_PER_USD) || 90; // example rate; use a live rate in production
const MARKUP = 0.035; // typical card currency markup used to show savings
const MEAL_INR = 25; // assumption: one school meal costs about 25 rupees

const PRODUCTS = [
  { id: "A1", name: "Filter coffee", price: 30 },
  { id: "A2", name: "Millet bar", price: 45 },
  { id: "B1", name: "Drinking water 1L", price: 20 },
  { id: "B2", name: "Buttermilk", price: 25 }
];

/* Sample partners. Replace with verified organisations before launch.
   Receiver emails are placeholders. For sandbox payouts, set NGO_EMAIL_N1 etc.
   to the email of a PayPal sandbox personal account. */
const NGOS = [
  { id: "n1", name: "Anbu Illam Children's Home", kind: "Orphanage", need: "School fees and uniforms for 28 children", goal: 60000, baseRaised: 4200, email: "accounts@anbu-illam.example" },
  { id: "n2", name: "Kalvi Vizhuthugal Trust", kind: "Education NGO", need: "Evening tuition for 40 children", goal: 90000, baseRaised: 3750, email: "accounts@kalvi-trust.example" },
  { id: "n3", name: "Nalam Girls' Hostel", kind: "Orphanage", need: "Nutrition and a health camp", goal: 45000, baseRaised: 3600, email: "accounts@nalam-hostel.example" }
];

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const round2 = (x) => Math.round(x * 100) / 100;

function ngoEmail(ngo) {
  return process.env["NGO_EMAIL_" + ngo.id.toUpperCase()] || ngo.email;
}

/* items: [{ id: "A1", qty: 2 }], opts: { roundup: boolean, intl: boolean } */
function priceOrder(items, opts) {
  if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, "Add at least one item.");
  const merged = new Map();
  for (const it of items) {
    const qty = Number(it && it.qty);
    const product = PRODUCTS.find((p) => p.id === (it && it.id));
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 10) throw new HttpError(400, "Invalid item.");
    merged.set(product.id, (merged.get(product.id) || 0) + qty);
  }
  let sub = 0;
  let count = 0;
  const lines = [];
  for (const [id, qty] of merged) {
    const p = PRODUCTS.find((x) => x.id === id);
    lines.push({ id, name: p.name, qty, price: p.price });
    sub += p.price * qty;
    count += qty;
  }
  if (count > 20) throw new HttpError(400, "Too many items in one order.");

  const roundup = Boolean(opts && opts.roundup);
  const intl = !opts || opts.intl !== false;
  let gift = 0;
  if (roundup) {
    gift = Math.ceil(sub / 10) * 10 - sub;
    if (gift === 0) gift = 10;
  }
  const match = gift / 2; // sponsor pledge, not charged to the customer
  const markup = (sub + gift) * MARKUP;
  const fee = intl ? 0 : round2(markup); // first-purchases offer waives the markup
  const saved = intl ? round2(markup) : 0;
  const totalInr = round2(sub + gift + fee);
  const usd = Math.max(0.01, round2(totalInr / RATE));
  return { lines, sub, gift, match, fee, saved, totalInr, usd };
}

module.exports = { RATE, MARKUP, MEAL_INR, PRODUCTS, NGOS, HttpError, round2, ngoEmail, priceOrder };
