(function () {
  "use strict";

  /* ---------- translations (English, Tamil, Hindi) ---------- */
  var I18N = {
    en: {
      tagline: "Pay the world's way. Give back locally.", language: "Language", size: "Text size",
      proto_mock: "Demo mode: no PayPal keys found, so payments are simulated. Offers, rates and partner names are examples.",
      proto_sandbox: "PayPal sandbox: test accounts only, no real money moves. Offers, rates and partner names are examples.",
      proto_live: "Live mode: real PayPal payments.",
      tab_vending: "Vending checkout", tab_offers: "Offers", tab_giving: "Giving", tab_vendors: "Vendors",
      h_vending: "Pick a snack. Pay with PayPal. Give the change.",
      lede_vending: "A traveller with a PayPal account pays at a local vending machine. The small change from rounding up goes to a nearby children's home, and the machine's sponsor adds half again.",
      h_offers: "Offers for paying across borders", h_giving: "Where the round-ups go", h_vendors: "Bring your machines on",
      impact: "Raised through this machine this month", meals: "school meals",
      screen_idle: "ARRIVALS HALL · UNIT 014", screen_pick: "CHOOSE ITEMS",
      p_coffee: "Filter coffee", p_millet: "Millet bar", p_water: "Drinking water 1L", p_butter: "Buttermilk",
      cart: "Your order", empty: "Nothing yet. Choose a snack from the machine.", add: "Add", remove: "Remove",
      intl: "My PayPal account is outside India", roundup: "Round up to the next ₹10 and give the difference",
      ngo_pick: "Send the round-up to", snacks: "Snacks", gift: "Round-up gift", fx: "Currency fee", waived: "Waived (first 3 purchases)",
      match: "Sponsor adds on top", total: "Total", charged: "Charged to PayPal", pay: "Pay with PayPal",
      scan_h: "Scan to pay", scan_note: "Scan with your phone to approve in PayPal.", scan_demo: "Demo mode: this code opens a page that simulates approval.",
      approve: "Approve in PayPal (simulated)", open_link: "Open the PayPal approval page", waiting: "Waiting for approval in PayPal…",
      back: "Back", receipt: "Receipt", paid: "Payment approved. Thank you.",
      new_order: "Start a new order", saved: "You avoided", to: "Gift sent to", qty: "quantity", working: "Working…"
    },
    ta: {
      tagline: "உலகம் போல் செலுத்துங்கள். உள்ளூரில் திருப்பிக் கொடுங்கள்.", language: "மொழி", size: "எழுத்து அளவு",
      proto_mock: "டெமோ பயன்முறை: PayPal விசைகள் இல்லை, எனவே கட்டணங்கள் மாதிரியாக நடக்கின்றன. சலுகைகள், மாற்று விகிதம், கூட்டாளர் பெயர்கள் எடுத்துக்காட்டுகள்.",
      proto_sandbox: "PayPal சாண்ட்பாக்ஸ்: சோதனைக் கணக்குகள் மட்டும், உண்மைப் பணம் நகராது. சலுகைகள், மாற்று விகிதம், கூட்டாளர் பெயர்கள் எடுத்துக்காட்டுகள்.",
      proto_live: "நேரடி பயன்முறை: உண்மையான PayPal கட்டணங்கள்.",
      tab_vending: "வெண்டிங் கட்டணம்", tab_offers: "சலுகைகள்", tab_giving: "நன்கொடை", tab_vendors: "விற்பனையாளர்கள்",
      h_vending: "சிற்றுண்டி தேர்வு செய்யுங்கள். PayPal மூலம் செலுத்துங்கள். மீதிச் சில்லறையை வழங்குங்கள்.",
      lede_vending: "PayPal கணக்குள்ள பயணி உள்ளூர் வெண்டிங் இயந்திரத்தில் செலுத்துகிறார். மேல்நோக்கி உயர்த்திய சிறு தொகை அருகிலுள்ள குழந்தைகள் இல்லத்துக்குச் செல்கிறது; இயந்திர ஆதரவாளர் அதில் பாதியைச் சேர்க்கிறார்.",
      h_offers: "எல்லை கடந்த கட்டணங்களுக்கான சலுகைகள்", h_giving: "மீதித் தொகை எங்கே செல்கிறது", h_vendors: "உங்கள் இயந்திரங்களை இணையுங்கள்",
      impact: "இந்த மாதம் இந்த இயந்திரம் மூலம் திரட்டியது", meals: "பள்ளி உணவுகள்",
      screen_idle: "வருகை அரங்கம் · எண் 014", screen_pick: "பொருட்களைத் தேர்வு செய்க",
      p_coffee: "ஃபில்டர் காபி", p_millet: "சிறுதானிய பார்", p_water: "குடிநீர் 1 லி", p_butter: "மோர்",
      cart: "உங்கள் ஆர்டர்", empty: "இன்னும் எதுவும் இல்லை. இயந்திரத்தில் ஒரு சிற்றுண்டியைத் தேர்வு செய்யுங்கள்.", add: "சேர்", remove: "நீக்கு",
      intl: "என் PayPal கணக்கு இந்தியாவுக்கு வெளியே உள்ளது", roundup: "அடுத்த ₹10-க்கு உயர்த்தி வித்தியாசத்தை வழங்கு",
      ngo_pick: "மீதித் தொகையை வழங்க", snacks: "சிற்றுண்டிகள்", gift: "மீதித் தொகை நன்கொடை", fx: "நாணயக் கட்டணம்", waived: "தள்ளுபடி (முதல் 3 வாங்குதல்கள்)",
      match: "ஆதரவாளர் கூடுதலாகச் சேர்ப்பது", total: "மொத்தம்", charged: "PayPal-ல் வசூலிப்பது", pay: "PayPal மூலம் செலுத்து",
      scan_h: "ஸ்கேன் செய்து செலுத்துங்கள்", scan_note: "PayPal-ல் ஒப்புதல் அளிக்க உங்கள் தொலைபேசியில் ஸ்கேன் செய்யுங்கள்.", scan_demo: "டெமோ பயன்முறை: இந்தக் குறியீடு ஒப்புதலை மாதிரியாகச் செய்யும் பக்கத்தைத் திறக்கும்.",
      approve: "PayPal-ல் ஒப்புதல் (மாதிரி)", open_link: "PayPal ஒப்புதல் பக்கத்தைத் திற", waiting: "PayPal-ல் ஒப்புதலுக்காகக் காத்திருக்கிறது…",
      back: "பின்செல்", receipt: "ரசீது", paid: "கட்டணம் ஏற்கப்பட்டது. நன்றி.",
      new_order: "புதிய ஆர்டர் தொடங்கு", saved: "நீங்கள் தவிர்த்தது", to: "நன்கொடை அனுப்பப்பட்டது", qty: "எண்ணிக்கை", working: "செயல்படுகிறது…"
    },
    hi: {
      tagline: "दुनिया की तरह भुगतान करें। स्थानीय स्तर पर लौटाएँ।", language: "भाषा", size: "अक्षर आकार",
      proto_mock: "डेमो मोड: PayPal कुंजियाँ नहीं मिलीं, इसलिए भुगतान नकली हैं। ऑफ़र, दरें और साझेदारों के नाम उदाहरण हैं।",
      proto_sandbox: "PayPal सैंडबॉक्स: केवल टेस्ट खाते, कोई असली पैसा नहीं जाता। ऑफ़र, दरें और साझेदारों के नाम उदाहरण हैं।",
      proto_live: "लाइव मोड: असली PayPal भुगतान।",
      tab_vending: "वेंडिंग भुगतान", tab_offers: "ऑफ़र", tab_giving: "दान", tab_vendors: "विक्रेता",
      h_vending: "नाश्ता चुनें। PayPal से भुगतान करें। बचे पैसे दान करें।",
      lede_vending: "PayPal खाते वाला यात्री स्थानीय वेंडिंग मशीन पर भुगतान करता है। राउंड-अप की छोटी राशि पास के बाल गृह को जाती है, और मशीन का प्रायोजक उसका आधा और जोड़ता है।",
      h_offers: "सीमा-पार भुगतान के ऑफ़र", h_giving: "राउंड-अप कहाँ जाते हैं", h_vendors: "अपनी मशीनें जोड़ें",
      impact: "इस महीने इस मशीन से जुटाया", meals: "स्कूल भोजन",
      screen_idle: "आगमन हॉल · यूनिट 014", screen_pick: "वस्तुएँ चुनें",
      p_coffee: "फ़िल्टर कॉफ़ी", p_millet: "बाजरा बार", p_water: "पीने का पानी 1 ली", p_butter: "छाछ",
      cart: "आपका ऑर्डर", empty: "अभी कुछ नहीं। मशीन से कोई नाश्ता चुनें।", add: "जोड़ें", remove: "हटाएँ",
      intl: "मेरा PayPal खाता भारत के बाहर है", roundup: "अगले ₹10 तक राउंड अप करें और अंतर दान करें",
      ngo_pick: "राउंड-अप भेजें", snacks: "नाश्ता", gift: "राउंड-अप दान", fx: "मुद्रा शुल्क", waived: "माफ़ (पहली 3 खरीद)",
      match: "प्रायोजक अतिरिक्त जोड़ते हैं", total: "कुल", charged: "PayPal पर चार्ज", pay: "PayPal से भुगतान करें",
      scan_h: "स्कैन करके भुगतान करें", scan_note: "PayPal में स्वीकृत करने के लिए अपने फ़ोन से स्कैन करें।", scan_demo: "डेमो मोड: यह कोड एक ऐसा पेज खोलता है जो स्वीकृति का नकली रूप दिखाता है।",
      approve: "PayPal में स्वीकृत करें (नकली)", open_link: "PayPal स्वीकृति पृष्ठ खोलें", waiting: "PayPal में स्वीकृति की प्रतीक्षा…",
      back: "वापस", receipt: "रसीद", paid: "भुगतान स्वीकृत। धन्यवाद।",
      new_order: "नया ऑर्डर शुरू करें", saved: "आपने बचाया", to: "दान भेजा गया", qty: "मात्रा", working: "काम हो रहा है…"
    }
  };
  var NAME_KEYS = { A1: "p_coffee", A2: "p_millet", B1: "p_water", B2: "p_butter" };
  var lang = "en";
  function t(k) { return (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k; }

  /* ---------- state ---------- */
  var CFG = { mode: "mock", rate: 90, products: [], mealInr: 25 };
  var MARKUP = 0.035;
  var S = {
    cart: {}, intl: true, roundup: true, ngo: "n1", step: "select",
    order: null, receipt: null, busy: false, error: "", timer: null,
    ngos: [], stats: null, ledger: [], pending: []
  };
  var focusKey = null;

  function el(id) { return document.getElementById(id); }
  function fmtI(n) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n);
  }
  function fmtU(n) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function say(msg) { var l = el("live"); l.textContent = ""; setTimeout(function () { l.textContent = msg; }, 30); }
  function productName(p) { return t(NAME_KEYS[p.id] || "snacks") || p.name; }

  function api(path, opts) {
    opts = opts || {};
    var init = { method: opts.method || "GET", headers: { "Content-Type": "application/json" } };
    if (opts.body !== undefined) init.body = JSON.stringify(opts.body);
    return fetch(path, init).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error(j.error || "Request failed (" + r.status + ")"); e.status = r.status; throw e; }
        return j;
      });
    });
  }

  /* the server decides the real amounts; this mirrors the rules for display only */
  function calc() {
    var sub = 0, count = 0;
    CFG.products.forEach(function (p) { var q = S.cart[p.id] || 0; sub += q * p.price; count += q; });
    var gift = 0;
    if (S.roundup && sub > 0) { gift = Math.ceil(sub / 10) * 10 - sub; if (gift === 0) gift = 10; }
    var base = (sub + gift) * MARKUP;
    var fee = S.intl ? 0 : Math.round(base * 100) / 100;
    var total = sub + gift + fee;
    return { sub: sub, count: count, gift: gift, match: gift / 2, fee: fee, saved: S.intl ? base : 0, total: total, usd: Math.max(0.01, total / CFG.rate) };
  }

  /* ---------- vending ---------- */
  function renderMachine() {
    var c = calc();
    el("screen").textContent = c.count ? c.count + " · " + fmtI(c.sub) : t("screen_idle") + " · " + t("screen_pick");
    el("slots").innerHTML = CFG.products.map(function (p) {
      return '<button type="button" class="slot" data-add="' + p.id + '" aria-label="' + esc(t("add") + " " + productName(p) + ", " + fmtI(p.price)) + '">' +
        '<span class="code">' + p.id + '</span><span class="nm">' + esc(productName(p)) + '</span><span class="pr">' + fmtI(p.price) + '</span></button>';
    }).join("");
  }

  function renderOrder() {
    var c = calc(), box = el("order"), h = "";
    var err = S.error ? '<p class="err" role="alert">' + esc(S.error) + '</p>' : "";
    if (S.step === "select") {
      h += '<h3 id="order-h" tabindex="-1">' + t("cart") + '</h3><div class="stack mt">';
      var lines = CFG.products.filter(function (p) { return S.cart[p.id]; });
      if (!lines.length) h += '<p class="muted">' + t("empty") + '</p>';
      else h += '<div>' + lines.map(function (p) {
        var q = S.cart[p.id];
        return '<div class="line"><span>' + esc(productName(p)) + '</span><span class="qty">' +
          '<button type="button" data-dec="' + p.id + '" data-focus="dec' + p.id + '" aria-label="' + esc(t("remove") + " " + productName(p)) + '">−</button>' +
          '<span class="num" aria-label="' + t("qty") + '">' + q + '</span>' +
          '<button type="button" data-inc="' + p.id + '" data-focus="inc' + p.id + '" aria-label="' + esc(t("add") + " " + productName(p)) + '">+</button></span>' +
          '<span class="num">' + fmtI(q * p.price) + '</span></div>';
      }).join("") + '</div>';
      h += '<label class="switch"><input type="checkbox" id="intl"' + (S.intl ? " checked" : "") + '><span>' + t("intl") + '</span></label>';
      h += '<label class="switch"><input type="checkbox" id="roundup"' + (S.roundup ? " checked" : "") + '><span>' + t("roundup") + '</span></label>';
      h += '<div><label for="ngo" class="muted" style="display:block;font-size:0.85rem">' + t("ngo_pick") + '</label><select id="ngo">' +
        S.ngos.map(function (n) { return '<option value="' + n.id + '"' + (S.ngo === n.id ? " selected" : "") + '>' + esc(n.name) + '</option>'; }).join("") + '</select></div>';
      h += '<dl class="sum"><div><dt>' + t("snacks") + '</dt><dd>' + fmtI(c.sub) + '</dd></div>' +
        '<div><dt>' + t("gift") + '</dt><dd>' + fmtI(c.gift) + '</dd></div>' +
        '<div><dt>' + t("fx") + '</dt><dd>' + (S.intl ? t("waived") : fmtI(c.fee)) + '</dd></div>' +
        (c.gift ? '<div class="good"><dt>' + t("match") + '</dt><dd>+' + fmtI(c.match) + '</dd></div>' : '') +
        '<div class="big"><dt style="color:inherit">' + t("total") + '</dt><dd>' + fmtI(c.total) + '</dd></div>' +
        '<div><dt>' + t("charged") + '</dt><dd>≈ ' + fmtU(c.usd) + '</dd></div></dl>' + err;
      h += '<button type="button" class="btn primary" id="pay"' + (c.count && !S.busy ? "" : " disabled") + '>' + (S.busy ? t("working") : t("pay")) + '</button></div>';
    } else if (S.step === "scan") {
      var o = S.order, mock = CFG.mode === "mock";
      h += '<h3 id="order-h" tabindex="-1">' + t("scan_h") + '</h3><div class="stack mt">' +
        '<div class="qr"><img src="/api/qr?text=' + encodeURIComponent(o.approveUrl) + '" alt="Payment code. Scan it with your phone to approve in PayPal."></div>' +
        '<p class="muted">' + t("scan_note") + (mock ? " " + t("scan_demo") : "") + '</p>' +
        '<p><b class="num">' + fmtI(o.price.totalInr) + '</b> <span class="muted">≈ ' + fmtU(o.price.usd) + ' · ' + esc(o.ref) + '</span></p>' +
        '<p class="muted" role="status">' + t("waiting") + '</p>' + err +
        '<div class="row">' +
        (mock ? '<button type="button" class="btn primary" id="approve"' + (S.busy ? " disabled" : "") + '>' + t("approve") + '</button>'
              : '<a class="btn primary" href="' + esc(o.approveUrl) + '" target="_blank" rel="noopener" style="text-decoration:none;display:inline-flex;align-items:center">' + t("open_link") + '</a>') +
        '<button type="button" class="btn" id="back">' + t("back") + '</button></div></div>';
    } else {
      var r = S.receipt;
      h += '<h3 id="order-h" tabindex="-1">' + t("paid") + '</h3><div class="stack mt"><div class="receipt">' +
        '<p class="mono muted">' + t("receipt") + ' ' + esc(r.id) + '</p><dl class="sum mt">' +
        '<div><dt>' + t("snacks") + '</dt><dd>' + fmtI(r.sub) + '</dd></div>' +
        '<div><dt>' + t("gift") + '</dt><dd>' + fmtI(r.gift) + '</dd></div>' +
        (r.gift ? '<div class="good"><dt>' + t("match") + '</dt><dd>+' + fmtI(r.match) + '</dd></div>' : '') +
        '<div class="big"><dt style="color:inherit">' + t("charged") + '</dt><dd>' + fmtU(r.usd) + '</dd></div>' +
        (r.saved ? '<div class="good"><dt>' + t("saved") + '</dt><dd>' + fmtI(r.saved) + '</dd></div>' : '') +
        '</dl>' + (r.gift && r.ngo ? '<p class="mt">' + t("to") + ': <b>' + esc(r.ngo) + '</b> (' + fmtI(r.gift + r.match) + ')</p>' : '') +
        '</div><button type="button" class="btn primary" id="newo">' + t("new_order") + '</button></div>';
    }
    box.innerHTML = h;
    if (focusKey) {
      var f = box.querySelector('[data-focus="' + focusKey + '"]');
      if (f) f.focus();
      focusKey = null;
    }
  }

  function renderImpact() {
    var total = S.stats ? S.stats.totalGivenInr : 0;
    el("impact-amt").textContent = fmtI(total);
    el("impact-meals").textContent = "≈ " + Math.floor(total / CFG.mealInr) + " " + t("meals");
  }

  function focusHeading() { var h = el("order-h"); if (h) h.focus(); }
  function stopPolling() { if (S.timer) { clearInterval(S.timer); S.timer = null; } }

  /* ---------- order flow ---------- */
  function startOrder() {
    var items = CFG.products.filter(function (p) { return S.cart[p.id]; }).map(function (p) { return { id: p.id, qty: S.cart[p.id] }; });
    S.busy = true; S.error = ""; renderOrder();
    api("/api/orders", { method: "POST", body: { items: items, roundup: S.roundup, ngoId: S.ngo, intl: S.intl } })
      .then(function (o) {
        S.order = o; S.step = "scan"; S.busy = false; renderOrder(); focusHeading(); say(t("scan_h"));
        stopPolling(); S.timer = setInterval(checkOrder, 2500);
      })
      .catch(function (e) { S.busy = false; S.error = e.message; renderOrder(); });
  }

  function checkOrder() {
    if (!S.order || S.step !== "scan" || S.busy) return;
    api("/api/orders/" + encodeURIComponent(S.order.id)).then(function (o) {
      if (o.status === "APPROVED") capture();
    }).catch(function () { /* keep polling */ });
  }

  function capture() {
    if (S.busy || !S.order) return;
    S.busy = true; stopPolling();
    api("/api/orders/" + encodeURIComponent(S.order.id) + "/capture", { method: "POST" })
      .then(function (r) {
        S.receipt = r.receipt; S.step = "done"; S.busy = false; S.error = "";
        renderOrder(); focusHeading(); say(t("paid")); loadGiving();
      })
      .catch(function (e) {
        S.busy = false; S.error = e.message; renderOrder();
        if (S.step === "scan") S.timer = setInterval(checkOrder, 2500);
      });
  }

  function approveMock() {
    S.busy = true; renderOrder();
    api("/api/mock/approve/" + encodeURIComponent(S.order.id), { method: "POST" })
      .then(function () { S.busy = false; capture(); })
      .catch(function (e) { S.busy = false; S.error = e.message; renderOrder(); });
  }

  /* ---------- giving ---------- */
  function loadGiving() {
    return Promise.all([api("/api/ngos"), api("/api/stats"), api("/api/ledger?limit=25"), api("/api/payouts/pending")])
      .then(function (r) { S.ngos = r[0]; S.stats = r[1]; S.ledger = r[2]; S.pending = r[3]; renderGiving(); renderImpact(); if (S.step === "select") renderOrder(); })
      .catch(function () { /* the page still works; try again on the next order */ });
  }

  function renderGiving() {
    el("ngos").innerHTML = S.ngos.map(function (n) {
      var pct = Math.min(100, Math.round(n.raised / n.goal * 100));
      return '<article class="card"><span class="tag sample">Sample partner</span><h3 class="mt">' + esc(n.name) + '</h3>' +
        '<p class="muted">' + esc(n.kind) + ' · within 10 km of this machine</p><p class="mt">' + esc(n.need) + '</p>' +
        '<div class="bar" role="progressbar" aria-label="' + esc(n.name) + ' funding" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><i style="width:' + pct + '%"></i></div>' +
        '<p class="num"><b>' + fmtI(n.raised) + '</b> <span class="muted">of ' + fmtI(n.goal) + ' · ' + pct + '%</span></p></article>';
    }).join("");

    if (!S.pending.length) el("payout").innerHTML = '<p class="muted">No gifts waiting. Finish a checkout with round-up on and it shows up here.</p>';
    else el("payout").innerHTML = '<table><thead><tr><th>Partner</th><th class="r">Gifts</th><th class="r">Amount</th><th class="r">Sent as</th></tr></thead><tbody>' +
      S.pending.map(function (p) { return '<tr><td>' + esc(p.name) + '</td><td class="r">' + p.rows + '</td><td class="r">' + fmtI(p.inr) + '</td><td class="r">' + fmtU(p.usd) + '</td></tr>'; }).join("") + '</tbody></table>';

    if (!S.ledger.length) el("ledger").innerHTML = '<p class="muted">Gifts appear here after each checkout, with the vendor and partner shares.</p>';
    else el("ledger").innerHTML = '<table><thead><tr><th>Receipt</th><th>Partner</th><th class="r">Round-up</th><th class="r">Sponsor</th><th class="r">Sale</th></tr></thead><tbody>' +
      S.ledger.map(function (r) {
        return '<tr><td class="mono">' + esc(r.id) + (r.demo ? ' <span class="tag sample">demo</span>' : '') + '</td><td>' + esc(r.ngoName || "–") + '</td><td class="r">' + fmtI(r.gift) + '</td><td class="r">' + fmtI(r.match) + '</td><td class="r">' + fmtI(r.sub) + '</td></tr>';
      }).join("") + '</tbody></table>';
  }

  /* ---------- offers + vendors calculators ---------- */
  function num(id) { var v = parseFloat(el(id).value); return isNaN(v) || v < 0 ? 0 : v; }
  function calcOffer() {
    var cov = Math.min(Math.floor(num("c-cnt")), 3);
    el("r-cov").textContent = cov;
    el("r-save").textContent = fmtU(num("c-amt") * cov * num("c-mk") / 100);
  }
  function calcVendor() {
    var tx = num("v-m") * num("v-t") * 30 * num("v-s") / 100;
    el("e-sales").textContent = fmtI(Math.round(tx * num("v-a")));
    el("e-give").textContent = fmtI(Math.round(tx * num("v-o") / 100 * num("v-r") * 1.5));
  }

  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (n) { n.textContent = t(n.getAttribute("data-i18n")); });
    renderMachine(); renderOrder(); renderImpact(); renderGiving();
  }

  /* ---------- events ---------- */
  el("slots").addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]"); if (!b) return;
    var id = b.getAttribute("data-add");
    if (S.step !== "select") { stopPolling(); S.step = "select"; S.order = null; S.error = ""; }
    S.cart[id] = (S.cart[id] || 0) + 1;
    renderMachine(); renderOrder();
    var p = CFG.products.filter(function (x) { return x.id === id; })[0];
    say(productName(p) + " ×" + S.cart[id] + ", " + fmtI(calc().total));
    var slot = el("slots").querySelector('[data-add="' + id + '"]'); if (slot) slot.focus();
  });

  el("order").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-inc")) { S.cart[b.getAttribute("data-inc")]++; focusKey = b.getAttribute("data-focus"); renderMachine(); renderOrder(); say(fmtI(calc().total)); }
    else if (b.hasAttribute("data-dec")) {
      var id = b.getAttribute("data-dec"); S.cart[id]--; if (S.cart[id] <= 0) delete S.cart[id];
      focusKey = S.cart[id] ? b.getAttribute("data-focus") : null; renderMachine(); renderOrder(); say(fmtI(calc().total));
      if (!S.cart[id]) focusHeading();
    }
    else if (b.id === "pay") startOrder();
    else if (b.id === "approve") approveMock();
    else if (b.id === "back") { stopPolling(); S.step = "select"; S.order = null; S.error = ""; renderOrder(); focusHeading(); }
    else if (b.id === "newo") { S.cart = {}; S.step = "select"; S.order = null; S.receipt = null; S.error = ""; renderMachine(); renderOrder(); focusHeading(); }
  });

  el("order").addEventListener("change", function (e) {
    if (e.target.id === "intl") S.intl = e.target.checked;
    else if (e.target.id === "roundup") S.roundup = e.target.checked;
    else if (e.target.id === "ngo") S.ngo = e.target.value;
    else return;
    var id = e.target.id; renderOrder(); var n = el(id); if (n) n.focus();
  });

  function copyText(text, btn) {
    var done = function (ok) { var o = btn.getAttribute("data-label") || btn.textContent; btn.setAttribute("data-label", o); btn.textContent = ok ? "Copied" : "Press Ctrl+C"; setTimeout(function () { btn.textContent = o; }, 1800); };
    try { navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); }
    catch (err) { done(false); }
  }
  el("copy-order").addEventListener("click", function () { copyText(el("order-code").textContent, this); });

  ["c-amt", "c-cnt", "c-mk"].forEach(function (i) { el(i).addEventListener("input", calcOffer); });
  ["v-m", "v-t", "v-a", "v-s", "v-o", "v-r"].forEach(function (i) { el(i).addEventListener("input", calcVendor); });

  el("lang").addEventListener("change", function () {
    lang = this.value; try { localStorage.setItem("thunai-lang", lang); } catch (e) {} applyI18n();
  });
  document.querySelectorAll("[data-size]").forEach(function (b) {
    b.addEventListener("click", function () {
      var s = b.getAttribute("data-size");
      document.documentElement.setAttribute("data-size", s);
      document.querySelectorAll("[data-size]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      try { localStorage.setItem("thunai-size", s); } catch (e) {}
    });
  });

  /* tabs */
  var TABS = ["vending", "offers", "giving", "vendors"];
  function showTab(name, move) {
    if (TABS.indexOf(name) < 0) name = "vending";
    TABS.forEach(function (n) {
      var on = n === name, tb = el("tab-" + n);
      tb.setAttribute("aria-selected", on ? "true" : "false"); tb.tabIndex = on ? 0 : -1;
      el("panel-" + n).hidden = !on;
    });
    if (move) el("tab-" + name).focus();
  }
  document.querySelector(".tabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-tab]"); if (!b) return;
    location.hash = b.getAttribute("data-tab"); showTab(b.getAttribute("data-tab"), false);
  });
  document.querySelector(".tabs").addEventListener("keydown", function (e) {
    var i = TABS.indexOf(document.activeElement && document.activeElement.getAttribute("data-tab"));
    if (i < 0) return;
    var k = e.key, n = null;
    if (k === "ArrowRight") n = TABS[(i + 1) % TABS.length];
    else if (k === "ArrowLeft") n = TABS[(i + TABS.length - 1) % TABS.length];
    else if (k === "Home") n = TABS[0]; else if (k === "End") n = TABS[TABS.length - 1];
    if (n) { e.preventDefault(); location.hash = n; showTab(n, true); }
  });
  window.addEventListener("hashchange", function () { showTab(location.hash.replace("#", ""), false); });

  try {
    var sl = localStorage.getItem("thunai-lang"); if (sl && I18N[sl]) { lang = sl; el("lang").value = sl; }
    var ss = localStorage.getItem("thunai-size");
    if (ss) { document.documentElement.setAttribute("data-size", ss); document.querySelectorAll("[data-size]").forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-size") === ss ? "true" : "false"); }); }
  } catch (e) {}

  /* ---------- start ---------- */
  showTab(location.hash.replace("#", ""), false);
  calcOffer(); calcVendor();
  api("/api/config").then(function (cfg) {
    CFG = cfg;
    el("mode-note").setAttribute("data-i18n", cfg.mode === "live" ? "proto_live" : cfg.mode === "sandbox" ? "proto_sandbox" : "proto_mock");
    S.cart = {}; if (cfg.products[0]) S.cart[cfg.products[0].id] = 1; if (cfg.products[1]) S.cart[cfg.products[1].id] = 1;
    return loadGiving();
  }).then(applyI18n).catch(function () {
    el("mode-note").textContent = "Could not reach the server. Start it with npm start and reload.";
  });
})();
