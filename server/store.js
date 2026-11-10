"use strict";

/* A very small JSON-file store. Good enough for a demo and a hackathon.
   For production, replace it with a real database (for example Render Postgres). */

const fs = require("fs");
const path = require("path");

function createStore(file) {
  let db = {};
  try {
    db = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    db = {};
  }
  db.orders = db.orders || {};
  db.ledger = db.ledger || [];
  db.payoutBatches = db.payoutBatches || [];

  function save() {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const tmp = file + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    fs.renameSync(tmp, file);
  }

  return { db, save, file };
}

module.exports = { createStore };
