(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var fmtI = function (n) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
  };
  var fmtU = function (n) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); };
  function say(m) { var l = $("live"); l.textContent = ""; setTimeout(function () { l.textContent = m; }, 30); }

  /* ----- AG Grid theme: brand colours, follows the system light/dark setting ----- */
  var theme = agGrid.themeQuartz
    .withPart(agGrid.colorSchemeVariable)
    .withParams({ accentColor: "#E89B00", fontFamily: "Noto Sans, system-ui, sans-serif", headerFontWeight: 600, borderRadius: 8, wrapperBorderRadius: 12, spacing: 8 });
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  function setMode() { document.body.dataset.agThemeMode = mq.matches ? "dark" : "light"; }
  setMode();
  if (mq.addEventListener) mq.addEventListener("change", setMode);

  /* ----- custom cell renderers ----- */
  function pill(params) {
    var span = document.createElement("span");
    var status = params.value || "none";
    span.className = "pill " + status;
    span.textContent = status === "none" ? "no gift" : status;
    if (params.data && params.data.demo) {
      var d = document.createElement("span");
      d.className = "muted"; d.style.marginLeft = "0.4rem"; d.style.fontSize = "0.75rem"; d.textContent = "demo";
      var wrap = document.createElement("span"); wrap.appendChild(span); wrap.appendChild(d); return wrap;
    }
    return span;
  }
  function progress(params) {
    var pct = Math.min(100, Math.round(params.data.raised / params.data.goal * 100));
    var box = document.createElement("div");
    box.style.cssText = "display:flex;align-items:center;gap:0.5rem;height:100%";
    var meter = document.createElement("div");
    meter.className = "meter"; meter.style.cssText = "flex:1;margin:0";
    meter.setAttribute("role", "progressbar"); meter.setAttribute("aria-valuemin", "0"); meter.setAttribute("aria-valuemax", "100"); meter.setAttribute("aria-valuenow", String(pct));
    meter.setAttribute("aria-label", params.data.name + " funding");
    var fill = document.createElement("i"); fill.style.width = pct + "%"; meter.appendChild(fill);
    var label = document.createElement("span"); label.textContent = pct + "%"; label.style.fontVariantNumeric = "tabular-nums";
    box.appendChild(meter); box.appendChild(label);
    return box;
  }
  var inr = function (p) { return p.value == null ? "" : fmtI(p.value); };
  var usd = function (p) { return p.value == null ? "" : fmtU(p.value); };
  var when = function (p) { return p.value ? new Date(p.value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : ""; };

  var base = { theme: theme, autoSizeStrategy: { type: "fitGridWidth" }, suppressCellFocus: false, defaultColDef: { resizable: true, minWidth: 110 } };

  var gPartners = agGrid.createGrid($("g-partners"), Object.assign({}, base, {
    domLayout: "autoHeight",
    columnDefs: [
      { field: "name", headerName: "Partner", minWidth: 200 },
      { field: "kind", headerName: "Type" },
      { field: "need", headerName: "Need", minWidth: 240 },
      { field: "raised", headerName: "Raised", valueFormatter: inr, type: "rightAligned" },
      { field: "goal", headerName: "Goal", valueFormatter: inr, type: "rightAligned" },
      { headerName: "Progress", cellRenderer: progress, minWidth: 160, sortable: false }
    ],
    rowData: []
  }));

  var gPending = agGrid.createGrid($("g-pending"), Object.assign({}, base, {
    domLayout: "autoHeight",
    overlayNoRowsTemplate: "No gifts waiting for payout.",
    columnDefs: [
      { field: "name", headerName: "Partner", minWidth: 200 },
      { field: "rows", headerName: "Gifts", type: "rightAligned" },
      { field: "inr", headerName: "Amount", valueFormatter: inr, type: "rightAligned" },
      { field: "usd", headerName: "Sent as", valueFormatter: usd, type: "rightAligned" }
    ],
    rowData: []
  }));

  var gLedger = agGrid.createGrid($("g-ledger"), Object.assign({}, base, {
    domLayout: "normal",
    pagination: true, paginationPageSize: 10, paginationPageSizeSelector: [10, 25, 50],
    columnDefs: [
      { field: "time", headerName: "Time", valueFormatter: when, minWidth: 170, sort: "desc" },
      { field: "id", headerName: "Receipt", minWidth: 130, cellStyle: { fontFamily: "ui-monospace, Menlo, Consolas, monospace" } },
      { field: "ngoName", headerName: "Partner", minWidth: 190, valueFormatter: function (p) { return p.value || "–"; } },
      { field: "sub", headerName: "Sale", valueFormatter: inr, type: "rightAligned" },
      { field: "gift", headerName: "Round-up", valueFormatter: inr, type: "rightAligned" },
      { field: "match", headerName: "Sponsor", valueFormatter: inr, type: "rightAligned" },
      { field: "usd", headerName: "Charged", valueFormatter: usd, type: "rightAligned" },
      { field: "payoutStatus", headerName: "Payout", cellRenderer: pill, minWidth: 140 }
    ],
    rowData: []
  }));
  $("g-ledger").style.height = "26rem";

  /* ----- data ----- */
  function token() { return $("token").value; }
  try { $("token").value = sessionStorage.getItem("thunai-admin") || ""; } catch (e) {}
  $("token").addEventListener("input", function () { try { sessionStorage.setItem("thunai-admin", token()); } catch (e) {} });

  function api(path, opts) {
    opts = opts || {};
    var headers = { "Content-Type": "application/json" };
    if (token()) headers["x-admin-token"] = token();
    return fetch(path, { method: opts.method || "GET", headers: headers }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error(j.error || "Request failed (" + r.status + ")"); e.status = r.status; throw e; }
        return j;
      });
    });
  }

  function tiles(s) {
    var items = [
      ["Sales", fmtI(s.salesInr), ""], ["Round-up gifts", fmtI(s.giftsInr), "good"], ["Sponsor match", fmtI(s.matchInr), "good"],
      ["Meals funded", String(s.meals), "good"], ["Waiting for payout", fmtI(s.pendingInr), ""]
    ];
    $("tiles").innerHTML = items.map(function (i) { return '<div class="tile ' + i[2] + '"><span>' + i[0] + "</span><b>" + i[1] + "</b></div>"; }).join("");
    $("mode").textContent = (s.mode === "mock" ? "Demo mode (no PayPal keys)" : "PayPal " + s.mode) + " · example rate ₹" + s.rate + " per US dollar";
  }

  var pendingCount = 0;
  function refresh() {
    return Promise.all([api("/api/stats"), api("/api/ngos"), api("/api/payouts/pending"), api("/api/ledger?limit=200")])
      .then(function (r) {
        tiles(r[0]);
        gPartners.setGridOption("rowData", r[1]);
        gPending.setGridOption("rowData", r[2]);
        gLedger.setGridOption("rowData", r[3]);
        pendingCount = r[2].length;
        $("send").disabled = pendingCount === 0;
      })
      .catch(function (e) { $("batch-note").textContent = "Could not load data: " + e.message; $("batch-note").className = "notice err"; });
  }

  var confirming = false;
  function resetSend() { confirming = false; $("send").textContent = "Send payouts"; }

  $("refresh").addEventListener("click", function () { refresh().then(function () { say("Refreshed"); }); });

  $("preview").addEventListener("click", function () {
    api("/api/payouts/preview").then(function (b) {
      $("batch").hidden = false;
      $("batch").textContent = "POST /v1/payments/payouts\n" + JSON.stringify(b.payload, null, 2);
      $("batch-note").className = "notice";
      $("batch-note").textContent = b.items.length ? "Batch ready for " + b.items.length + " partner(s). Check the amounts, then send." : "Nothing is waiting for payout.";
      say("Batch preview shown");
    }).catch(function (e) { $("batch-note").className = "notice err"; $("batch-note").textContent = e.message; });
  });

  $("send").addEventListener("click", function () {
    if (!confirming) {
      confirming = true;
      $("send").textContent = "Confirm: send now";
      setTimeout(resetSend, 6000);
      return;
    }
    resetSend();
    $("send").disabled = true;
    api("/api/payouts/send", { method: "POST" }).then(function (r) {
      $("batch-note").className = "notice";
      $("batch-note").textContent = "Sent batch " + r.batchId + " to " + r.items.length + " partner(s).";
      $("batch").hidden = true;
      say("Payouts sent");
      return refresh();
    }).catch(function (e) {
      $("batch-note").className = "notice err"; $("batch-note").textContent = e.message; $("send").disabled = pendingCount === 0;
    });
  });

  refresh();
})();
