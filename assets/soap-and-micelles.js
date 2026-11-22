(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var clock = 0;

  function $(id) {
    return document.getElementById(id);
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function smooth(t) {
    return t * t * (3 - 2 * t);
  }

  function traceRoundRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function fitCanvas(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(1, rect.width);
    var h = Math.max(1, rect.height);
    var bw = Math.round(w * dpr);
    var bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h };
  }

  function pill(ctx, text, x, y, anchor) {
    ctx.save();
    ctx.font = "800 13px Nunito, Segoe UI, sans-serif";
    var tw = ctx.measureText(text).width;
    var bw = tw + 16;
    var bh = 24;
    var left = x;
    if (anchor === "middle") left = x - bw / 2;
    if (anchor === "end") left = x - bw;
    var top = y - bh / 2;
    ctx.fillStyle = "rgba(255,255,255,0.94)";
    traceRoundRect(ctx, left, top, bw, bh, 8);
    ctx.fill();
    ctx.strokeStyle = "#d5e0eb";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#142033";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, left + bw / 2, top + bh / 2 + 0.5);
    ctx.restore();
  }

  function leader(ctx, x1, y1, x2, y2) {
    ctx.save();
    ctx.strokeStyle = "#1e3a8a";
    ctx.fillStyle = "#1e3a8a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x2, y2, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  /* ---------- molecule explorer ---------- */

  var moleculeCopy = {
    none: {
      title: "Two opposite ends",
      text: "Sodium stearate has a long nonpolar tail and a charged head. Select either end. The lollipop model shows the idea quickly. The structural formula shows the atoms. Both pictures are enlarged: a real molecule is much smaller, and the tail can bend."
    },
    tail: {
      title: "Hydrophobic tail",
      text: "This is the hydrophobic tail. Hydrophobic means water-fearing. It is a nonpolar chain of carbon and hydrogen, 17 carbons long in sodium stearate. Electrons are shared evenly along the chain, so water has no charged end to hold. The tail mixes with nonpolar oil and grease instead."
    },
    head: {
      title: "Hydrophilic head",
      text: "This is the hydrophilic head. Hydrophilic means water-loving. It is a carboxylate group, COO⁻, so it is ionic and polar. The negative charge is shared by the two oxygen atoms; drawings often place the minus sign on one oxygen. In solid soap a sodium ion, Na⁺, sits nearby. In water that sodium ion drifts away. The charged head is attracted to polar water."
    }
  };

  var pinnedPart = null;
  var hoverPart = null;

  function activePart() {
    return hoverPart || pinnedPart;
  }

  function renderPart(announce) {
    var part = activePart();
    var section = $("molecule");
    section.classList.toggle("is-tail", part === "tail");
    section.classList.toggle("is-head", part === "head");
    $("btn-tail").setAttribute("aria-pressed", pinnedPart === "tail" ? "true" : "false");
    $("btn-head").setAttribute("aria-pressed", pinnedPart === "head" ? "true" : "false");
    var info = moleculeCopy[part || "none"];
    $("molecule-kicker").textContent = info.title;
    $("molecule-copy").textContent = info.text;
    if (announce) $("molecule-live").textContent = info.title + ". " + info.text;
  }

  function pinPart(part) {
    pinnedPart = part;
    hoverPart = null;
    renderPart(true);
  }

  function setModel(name) {
    var lollipop = name !== "structural";
    $("model-lollipop").hidden = !lollipop;
    $("model-structural").hidden = lollipop;
    $("model-lollipop-btn").setAttribute("aria-checked", lollipop ? "true" : "false");
    $("model-structural-btn").setAttribute("aria-checked", lollipop ? "false" : "true");
  }

  function bindMolecule() {
    document.querySelectorAll("#molecule [data-part]").forEach(function (el) {
      el.addEventListener("pointerenter", function (event) {
        if (event.pointerType !== "mouse") return;
        hoverPart = el.getAttribute("data-part");
        renderPart(false);
      });
      el.addEventListener("pointerleave", function (event) {
        if (event.pointerType !== "mouse") return;
        if (hoverPart === el.getAttribute("data-part")) hoverPart = null;
        renderPart(false);
      });
      el.addEventListener("click", function () {
        pinPart(el.getAttribute("data-part"));
      });
    });

    $("btn-tail").addEventListener("click", function () { pinPart("tail"); });
    $("btn-head").addEventListener("click", function () { pinPart("head"); });

    var modelButtons = [
      $("model-lollipop-btn"),
      $("model-structural-btn")
    ];
    modelButtons.forEach(function (btn, index) {
      btn.addEventListener("click", function () {
        setModel(btn.getAttribute("data-model"));
      });
      btn.addEventListener("keydown", function (event) {
        var key = event.key;
        if (key !== "ArrowRight" && key !== "ArrowLeft" && key !== "ArrowDown" && key !== "ArrowUp") return;
        event.preventDefault();
        var dir = key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
        var next = modelButtons[(index + dir + modelButtons.length) % modelButtons.length];
        next.focus();
        setModel(next.getAttribute("data-model"));
      });
    });

    document.querySelectorAll("[data-jump-part]").forEach(function (link) {
      link.addEventListener("click", function () {
        pinPart(link.getAttribute("data-jump-part"));
      });
    });
  }

  /* ---------- dissolve lab ---------- */

  var MIX = {
    salt: {
      pill: "Soluble",
      pillClass: "pill-yes",
      title: "Table salt in water",
      log: "Salt (NaCl): soluble · ionic",
      text: "Salt dissolves, so it is soluble. Sodium chloride is ionic. It splits into Na⁺ and Cl⁻ ions, and those ions spread through the water. In the close-up, water's partly negative oxygen (δ−) points toward Na⁺, and the partly positive hydrogens (δ+) point toward Cl⁻. Polar water dissolves ionic salt. Like dissolves like."
    },
    sugar: {
      pill: "Soluble",
      pillClass: "pill-yes",
      title: "Sugar in water",
      log: "Sugar: soluble · polar",
      text: "Sugar dissolves, so it is soluble. A sugar molecule stays whole. It does not split into ions the way salt does. Sugar is polar because it has many O–H groups, and those groups are attracted to polar water. The molecules spread through the beaker."
    },
    oil: {
      pill: "Insoluble",
      pillClass: "pill-no",
      title: "Oil and grease in water",
      log: "Oil / grease: insoluble · nonpolar",
      text: "Oil and grease do not dissolve, so they are insoluble. They are nonpolar and hydrophobic: charge is spread evenly, with no δ+ or δ− ends for water to hold. The oil stays as its own layer. The liquids touch and still separate. Like dissolves like, and these two are not alike."
    },
    water: {
      pill: "Mixes",
      pillClass: "pill-yes",
      title: "More water",
      log: "Water: mixes · polar",
      text: "The added water mixes straight in. Water is polar, so it dissolves in water. Every molecule has the same partial charges, δ− on oxygen and δ+ on hydrogen, so the new water does not form a separate layer."
    }
  };

  var mixId = null;
  var mixStart = 0;
  var mixCanvas = $("mix-canvas");
  var beakerFrame = $("beaker-frame");

  function mixProgress(now) {
    if (!mixId) return 1;
    if (reduceMotion) return 1;
    return clamp((now - mixStart) / 700, 0, 1);
  }

  function setMix(id) {
    if (!MIX[id]) return;
    mixId = id;
    mixStart = performance.now();
    document.querySelectorAll(".substance").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-mix") === id ? "true" : "false");
    });
    var info = MIX[id];
    var pillEl = $("mix-pill");
    pillEl.className = "pill " + info.pillClass;
    pillEl.textContent = info.pill;
    $("mix-title").textContent = info.title;
    $("mix-copy").textContent = info.text;
    var log = $("mix-log");
    var item = log.querySelector('[data-mix="' + id + '"]');
    if (!item) {
      item = document.createElement("li");
      item.setAttribute("data-mix", id);
      log.appendChild(item);
    }
    item.textContent = info.log;
  }

  function clearMix() {
    mixId = null;
    document.querySelectorAll(".substance").forEach(function (btn) {
      btn.setAttribute("aria-pressed", "false");
    });
    var pillEl = $("mix-pill");
    pillEl.className = "pill";
    pillEl.textContent = "Not tested";
    $("mix-title").textContent = "Nothing added yet";
    $("mix-copy").textContent = "The beaker is water again. The list below keeps what you already tried. Add another substance to compare.";
  }

  function drawWaterMol(ctx, x, y, face, scale, labeled) {
    var bond = 18 * scale;
    var half = (104.5 * Math.PI / 180) / 2;
    var back = face + Math.PI;
    var h1a = back - half;
    var h2a = back + half;
    var h1 = [x + Math.cos(h1a) * bond, y + Math.sin(h1a) * bond];
    var h2 = [x + Math.cos(h2a) * bond, y + Math.sin(h2a) * bond];
    var or = 8 * scale;
    var hr = 5.5 * scale;
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0c4a6e";
    ctx.lineWidth = Math.max(1.4, 2 * scale);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(h1[0], h1[1]);
    ctx.moveTo(x, y);
    ctx.lineTo(h2[0], h2[1]);
    ctx.stroke();
    [h1, h2].forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p[0], p[1], hr, 0, Math.PI * 2);
      ctx.fillStyle = "#f8fafc";
      ctx.fill();
      ctx.strokeStyle = "#0c4a6e";
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.arc(x, y, or, 0, Math.PI * 2);
    ctx.fillStyle = "#0284c7";
    ctx.fill();
    ctx.lineWidth = Math.max(1, 1.5 * scale);
    ctx.strokeStyle = "#0c4a6e";
    ctx.stroke();
    if (labeled) {
      ctx.fillStyle = "#0c4a6e";
      ctx.font = "800 " + Math.round(12 * scale) + "px Nunito, Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var lx = x + Math.cos(face) * (or + 12 * scale);
      var ly = y + Math.sin(face) * (or + 12 * scale);
      ctx.fillText("δ−", lx, ly);
      ctx.fillStyle = "#1e3a8a";
      [h1, h2].forEach(function (p) {
        var ang = Math.atan2(p[1] - y, p[0] - x);
        ctx.fillText("δ+", p[0] + Math.cos(ang) * (hr + 11 * scale), p[1] + Math.sin(ang) * (hr + 11 * scale));
      });
    }
    ctx.restore();
  }

  function drawIon(ctx, x, y, kind, r) {
    ctx.save();
    if (kind === "na") {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "#dbeafe";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#1d4ed8";
      ctx.stroke();
    } else {
      traceRoundRect(ctx, x - r, y - r, r * 2, r * 2, 4);
      ctx.fillStyle = "#ede9fe";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#5b21b6";
      ctx.stroke();
    }
    ctx.fillStyle = "#142033";
    ctx.font = "800 " + Math.max(11, Math.round(r * 0.72)) + "px Nunito, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(kind === "na" ? "Na⁺" : "Cl⁻", x, y + 0.5);
    ctx.restore();
  }

  function drawSugar(ctx, x, y, scale, withLabels) {
    var R = 15 * scale;
    ctx.save();
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = -Math.PI / 2 + i * (Math.PI / 3);
      var px = x + Math.cos(a) * R;
      var py = y + Math.sin(a) * R;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = "#fbcfe8";
    ctx.strokeStyle = "#9d174d";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    [1, 3, 5].forEach(function (idx) {
      var ang = -Math.PI / 2 + idx * (Math.PI / 3);
      var x1 = x + Math.cos(ang) * R;
      var y1 = y + Math.sin(ang) * R;
      var x2 = x + Math.cos(ang) * (R + 11 * scale);
      var y2 = y + Math.sin(ang) * (R + 11 * scale);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      if (withLabels) {
        ctx.fillStyle = "#9d174d";
        ctx.font = "800 " + Math.round(11 * scale) + "px Nunito, Segoe UI, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("OH", x2 + Math.cos(ang) * 12 * scale, y2 + Math.sin(ang) * 10 * scale);
      }
    });
    ctx.restore();
  }

  function beakerEdge(b, y) {
    var t = clamp((y - b.top) / (b.bot - b.top), 0, 1);
    var left = b.tl + (b.bl - b.tl) * t;
    var right = b.tr + (b.br - b.tr) * t;
    return { left: left, right: right, mid: (left + right) / 2, half: (right - left) / 2 };
  }

  function traceBeaker(ctx, b) {
    ctx.beginPath();
    ctx.moveTo(b.tl, b.top);
    ctx.lineTo(b.bl, b.bot);
    ctx.quadraticCurveTo(b.cx, b.bot + b.curve, b.br, b.bot);
    ctx.lineTo(b.tr, b.top);
  }

  var saltSpots = [
    ["na", 0.22, 0.3], ["cl", 0.55, 0.24], ["na", 0.78, 0.38],
    ["cl", 0.32, 0.58], ["na", 0.62, 0.66], ["cl", 0.42, 0.86]
  ];
  var sugarSpots = [
    [0.28, 0.28], [0.62, 0.32], [0.42, 0.52], [0.74, 0.6], [0.34, 0.78]
  ];
  var waterSpots = [
    [0.3, 0.35, 0.2], [0.62, 0.42, 1.4], [0.4, 0.62, 2.2],
    [0.72, 0.7, 0.6], [0.28, 0.82, 1.7], [0.55, 0.55, 2.8]
  ];

  function drawCloseup(ctx, box, id, u) {
    ctx.save();
    traceRoundRect(ctx, box.x, box.y, box.w, box.h, 14);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#d5e0eb";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.clip();

    var title = "Close-up";
    if (id === "salt") title = "Close-up · soluble";
    if (id === "sugar") title = "Close-up · soluble";
    if (id === "oil") title = "Close-up · insoluble";
    if (id === "water") title = "Close-up · mixes";
    pill(ctx, title, box.x + 12, box.y + 18, "start");

    var cx = box.x + box.w / 2;
    var cy = box.y + box.h / 2 + 8;
    var sc = clamp(Math.min(box.w / 230, box.h / 170), 0.62, 1.25);

    if (!id) {
      drawWaterMol(ctx, cx, cy, -Math.PI / 2, sc * 1.35, true);
      ctx.restore();
      return;
    }

    if (id === "salt") {
      var na = { x: cx - 8 * sc, y: cy - 28 * sc };
      var cl = { x: cx + 6 * sc, y: cy + 42 * sc };
      drawWaterMol(ctx, na.x - 48 * sc, na.y, 0, sc, true);
      drawWaterMol(ctx, na.x + 50 * sc, na.y - 6 * sc, Math.PI, sc, false);
      drawIon(ctx, na.x, na.y, "na", 16 * sc);
      drawWaterMol(ctx, cl.x - 52 * sc, cl.y, Math.PI, sc, false);
      drawWaterMol(ctx, cl.x + 54 * sc, cl.y + 2 * sc, 0, sc, false);
      drawIon(ctx, cl.x, cl.y, "cl", 16 * sc);
      ctx.restore();
      return;
    }

    if (id === "sugar") {
      drawSugar(ctx, cx - 36 * sc, cy, sc * 1.15, true);
      drawWaterMol(ctx, cx + 48 * sc, cy - 6 * sc, Math.PI, sc * 1.15, true);
      ctx.save();
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = "#1d4ed8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 8 * sc, cy - 10 * sc);
      ctx.lineTo(cx + 28 * sc, cy - 8 * sc);
      ctx.stroke();
      ctx.restore();
      pill(ctx, "attraction", cx, box.y + box.h - 18, "middle");
      ctx.restore();
      return;
    }

    if (id === "oil") {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx + 42 * sc, cy, 36 * sc, 26 * sc, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#78350f";
      ctx.font = "800 " + Math.round(13 * sc) + "px Nunito, Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("oil", cx + 42 * sc, cy);
      ctx.restore();
      drawWaterMol(ctx, cx - 58 * sc, cy - 16 * sc, 0.4, sc, true);
      drawWaterMol(ctx, cx - 48 * sc, cy + 28 * sc, -0.5, sc * 0.9, false);
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = "#9a3412";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 18 * sc, cy);
      ctx.lineTo(cx + 8 * sc, cy);
      ctx.stroke();
      ctx.restore();
      pill(ctx, "no attraction", cx - 46 * sc, box.y + box.h - 18, "middle");
      ctx.restore();
      return;
    }

    drawWaterMol(ctx, cx - 42 * sc, cy, -1.2, sc * 1.2, true);
    drawWaterMol(ctx, cx + 42 * sc, cy + 8 * sc, 0.8, sc * 1.15, true);
    pill(ctx, "same molecule", cx, box.y + box.h - 18, "middle");
    ctx.restore();
  }

  function drawMix(now) {
    if (!mixCanvas) return;
    var fit = fitCanvas(mixCanvas);
    var ctx = fit.ctx;
    var w = fit.w;
    var h = fit.h;
    var u = smooth(mixProgress(now));
    var stacked = h > w * 0.95;
    var beakerBox;
    var zoom;
    if (stacked) {
      beakerBox = { x: 16, y: 8, w: w - 32, h: h * 0.56 };
      zoom = { x: 16, y: beakerBox.y + beakerBox.h + 8, w: w - 32, h: h - beakerBox.h - 24 };
    } else {
      zoom = { x: 12, y: 12, w: Math.min(250, w * 0.36), h: h - 24 };
      beakerBox = { x: zoom.x + zoom.w + 8, y: 8, w: w - zoom.w - 32, h: h - 16 };
    }

    var b = {
      top: beakerBox.y + 16,
      bot: beakerBox.y + beakerBox.h - 28,
      tl: beakerBox.x + beakerBox.w * 0.14,
      tr: beakerBox.x + beakerBox.w * 0.86,
      bl: beakerBox.x + beakerBox.w * 0.24,
      br: beakerBox.x + beakerBox.w * 0.76,
      cx: beakerBox.x + beakerBox.w / 2,
      curve: 16
    };

    var lift = mixId === "water" ? 16 * u : 0;
    var fillTop = b.top + (b.bot - b.top) * 0.2 - lift;

    ctx.fillStyle = "#e7f0f7";
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    traceBeaker(ctx, b);
    ctx.clip();
    var water = ctx.createLinearGradient(0, fillTop, 0, b.bot);
    water.addColorStop(0, "#d7eefe");
    water.addColorStop(1, "#7eb6e6");
    ctx.fillStyle = water;
    ctx.fillRect(b.tl - 40, fillTop, (b.tr - b.tl) + 90, b.bot - fillTop + 40);

    if (mixId === "oil") {
      var layer = 8 + 26 * u;
      ctx.fillStyle = "#f6c453";
      ctx.fillRect(b.tl - 10, fillTop, (b.tr - b.tl) + 40, layer);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(b.tl, fillTop, (b.tr - b.tl), 5);
    }

    waterSpots.forEach(function (spot, i) {
      var yy = fillTop + 18 + spot[1] * (b.bot - fillTop - 28);
      if (mixId === "oil" && yy < fillTop + 36) yy = fillTop + 40 + spot[1] * 20;
      var edge = beakerEdge(b, yy);
      var xx = edge.left + 16 + spot[0] * (edge.right - edge.left - 32);
      var bob = reduceMotion ? 0 : Math.sin(now / 520 + spot[2]) * 2.2;
      drawWaterMol(ctx, xx, yy + bob, spot[2], 0.72, false);
    });

    if (mixId === "water") {
      [[0.4, 0.22], [0.66, 0.3]].forEach(function (spot, i) {
        var yy = fillTop + 14 + spot[1] * 30;
        var edge = beakerEdge(b, yy);
        var xx = edge.left + 16 + spot[0] * (edge.right - edge.left - 32);
        var drop = (1 - u) * -30;
        ctx.globalAlpha = 0.35 + 0.65 * u;
        drawWaterMol(ctx, xx, yy + drop, i, 0.8, false);
        ctx.globalAlpha = 1;
      });
    }

    if (mixId === "salt") {
      saltSpots.forEach(function (spot) {
        var homeY = fillTop + 24 + spot[2] * (b.bot - fillTop - 36);
        var edge = beakerEdge(b, homeY);
        var homeX = edge.left + 18 + spot[1] * (edge.right - edge.left - 36);
        var x = b.cx + (homeX - b.cx) * u;
        var y = fillTop + (homeY - fillTop) * u;
        drawIon(ctx, x, y, spot[0], 13);
      });
    }

    if (mixId === "sugar") {
      sugarSpots.forEach(function (spot) {
        var homeY = fillTop + 28 + spot[1] * (b.bot - fillTop - 40);
        var edge = beakerEdge(b, homeY);
        var homeX = edge.left + 22 + spot[0] * (edge.right - edge.left - 44);
        var x = b.cx + (homeX - b.cx) * u;
        var y = fillTop + (homeY - fillTop) * u;
        drawSugar(ctx, x, y, 0.85, false);
      });
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 2;
    var lip = beakerEdge(b, fillTop);
    ctx.beginPath();
    ctx.ellipse(lip.mid, fillTop, lip.half - 2, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#64748b";
    ctx.lineJoin = "round";
    traceBeaker(ctx, b);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(b.tl - 8, b.top);
    ctx.lineTo(b.tr + 8, b.top);
    ctx.stroke();
    ctx.restore();

    if (!mixId) {
      pill(ctx, "Add a substance", b.cx, (fillTop + b.bot) / 2, "middle");
    } else if (mixId === "oil") {
      pill(ctx, "oil layer · stays separate", b.cx, fillTop + 16, "middle");
    } else if (mixId === "salt") {
      pill(ctx, "ions spread out", b.cx, fillTop + 24, "middle");
    } else if (mixId === "sugar") {
      pill(ctx, "sugar spreads out", b.cx, fillTop + 24, "middle");
    } else {
      pill(ctx, "water mixes in", b.cx, fillTop + 24, "middle");
    }

    drawCloseup(ctx, zoom, mixId, u);
  }

  function bindMix() {
    var ghost = $("drag-ghost");
    var drag = null;

    function overBeaker(event) {
      var rect = mixCanvas.getBoundingClientRect();
      return event.clientX >= rect.left && event.clientX <= rect.right &&
        event.clientY >= rect.top && event.clientY <= rect.bottom;
    }

    document.querySelectorAll(".substance").forEach(function (btn) {
      btn.addEventListener("pointerdown", function (event) {
        drag = {
          id: btn.getAttribute("data-mix"),
          x: event.clientX,
          y: event.clientY,
          moved: false,
          pointerId: event.pointerId,
          name: btn.querySelector(".sub-name").textContent
        };
        btn.setPointerCapture(event.pointerId);
      });
      btn.addEventListener("pointermove", function (event) {
        if (!drag || drag.pointerId !== event.pointerId) return;
        if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 8) {
          drag.moved = true;
          ghost.hidden = false;
          ghost.textContent = drag.name;
          ghost.style.left = event.clientX + 12 + "px";
          ghost.style.top = event.clientY + 12 + "px";
          beakerFrame.classList.toggle("is-drop", overBeaker(event));
        }
      });
      btn.addEventListener("pointerup", function (event) {
        if (!drag || drag.pointerId !== event.pointerId) return;
        ghost.hidden = true;
        beakerFrame.classList.remove("is-drop");
        if (!drag.moved || overBeaker(event)) setMix(drag.id);
        btn.dataset.handled = "1";
        drag = null;
      });
      btn.addEventListener("pointercancel", function () {
        ghost.hidden = true;
        beakerFrame.classList.remove("is-drop");
        drag = null;
      });
      btn.addEventListener("click", function () {
        if (btn.dataset.handled === "1") {
          btn.dataset.handled = "";
          return;
        }
        setMix(btn.getAttribute("data-mix"));
      });
    });

    $("btn-empty").addEventListener("click", clearMix);

    document.querySelectorAll("[data-jump-mix]").forEach(function (link) {
      link.addEventListener("click", function () {
        setMix(link.getAttribute("data-jump-mix"));
      });
    });
  }

  /* ---------- washing / micelles ---------- */

  var SNAP = {
    dirty: { ring: 0, free: 0, oil: 1, mic: 0, rinse: 0 },
    soapy: { ring: 1, free: 1, oil: 1, mic: 0, rinse: 0 },
    micelles: { ring: 0, free: 0, oil: 0, mic: 1, rinse: 0 },
    clean: { ring: 0, free: 0, oil: 0, mic: 1, rinse: 1 }
  };

  var WASH_TEXT = {
    dirty: "Water alone is in the basin, and the grease is still on the cloth. Grease is nonpolar and hydrophobic. Water is polar. Nothing in plain water can grab the grease, so the spot stays. Next: add soap.",
    soapyDuring: "Soap is entering the water. Watch the tails turn toward the grease. The heads stay out in the water.",
    soapy: "Soap is at the edge of the grease. Each hydrophobic tail sticks into the nonpolar grease, and each hydrophilic head stays in the water. Soap is a surfactant: it can touch oil and water at the same time. A few soap ions also float in the water. Next: stir or scrub.",
    micellesDuring: "Scrubbing breaks the grease into smaller drops. Soap surrounds each drop and lifts it off the cloth.",
    micelles: "Micelles have lifted off the cloth. Hydrophobic tails point inward and trap the grease. Hydrophilic heads point outward, toward the water. Grease is still insoluble. It is packaged so water can carry it. That package is a micelle. Next: rinse.",
    cleanDuring: "Rinse water is carrying the micelles away. The grease rides inside them.",
    clean: "The cloth is clean. The micelles left with the rinse water, and the grease went with them. Reset to run water alone again and compare."
  };

  var washName = "dirty";
  var washFrom = Object.assign({}, SNAP.dirty);
  var washTo = Object.assign({}, SNAP.dirty);
  var washU = 1;
  var speed = 1;
  var washCanvas = $("wash-canvas");

  function washValues() {
    if (washU >= 1) return Object.assign({}, washTo);
    var e = smooth(washU);
    var out = {};
    Object.keys(washTo).forEach(function (key) {
      out[key] = washFrom[key] + (washTo[key] - washFrom[key]) * e;
    });
    return out;
  }

  function washMessage() {
    if (washU < 1) {
      if (washName === "soapy") return WASH_TEXT.soapyDuring;
      if (washName === "micelles") return WASH_TEXT.micellesDuring;
      if (washName === "clean") return WASH_TEXT.cleanDuring;
    }
    return WASH_TEXT[washName] || WASH_TEXT.dirty;
  }

  function syncWash() {
    var busy = washU < 1;
    var settled = busy ? "" : washName;
    $("btn-add").disabled = settled !== "dirty";
    $("btn-stir").disabled = settled !== "soapy";
    $("btn-rinse").disabled = settled !== "micelles";
    ["btn-add", "btn-stir", "btn-rinse", "btn-reset"].forEach(function (id) {
      $(id).classList.remove("is-primary");
    });
    if (settled === "dirty") $("btn-add").classList.add("is-primary");
    else if (settled === "soapy") $("btn-stir").classList.add("is-primary");
    else if (settled === "micelles") $("btn-rinse").classList.add("is-primary");
    else if (settled === "clean") $("btn-reset").classList.add("is-primary");

    var order = ["dirty", "soapy", "micelles", "clean"];
    var activeIndex = order.indexOf(washName);
    order.forEach(function (name, index) {
      var el = $("step-" + name);
      el.classList.remove("is-now", "is-done");
      if (index < activeIndex || (index === activeIndex && name === "clean" && washU >= 1 && washName === "clean")) {
        el.classList.add(index === activeIndex ? "is-now" : "is-done");
      } else if (index === activeIndex) {
        el.classList.add("is-now");
      }
      if (el.classList.contains("is-now")) el.setAttribute("aria-current", "step");
      else el.removeAttribute("aria-current");
    });
    if (washName === "clean" && washU >= 1) {
      order.forEach(function (name) {
        var el = $("step-" + name);
        el.classList.remove("is-now");
        el.classList.add("is-done");
        el.removeAttribute("aria-current");
      });
      $("step-clean").classList.add("is-now");
      $("step-clean").classList.remove("is-done");
      $("step-clean").setAttribute("aria-current", "step");
    }
    $("wash-status").textContent = washMessage();
  }

  function startWash(name) {
    if (washU < 1) return;
    washFrom = washValues();
    washTo = Object.assign({}, SNAP[name]);
    washName = name;
    washU = reduceMotion ? 1 : 0;
    syncWash();
  }

  function snapWash(name) {
    washName = name;
    washFrom = Object.assign({}, SNAP[name]);
    washTo = Object.assign({}, SNAP[name]);
    washU = 1;
    syncWash();
  }

  function drawSoap(ctx, x, y, angle, alpha, tailLen) {
    if (alpha < 0.02) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha *= alpha;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(tailLen, 0);
    ctx.stroke();
    ctx.lineWidth = 2;
    for (var p = 12; p < tailLen - 2; p += 8) {
      ctx.beginPath();
      ctx.moveTo(p, -4);
      ctx.lineTo(p, 4);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#0f766e";
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#134e4a";
    ctx.stroke();
    ctx.restore();
  }

  function drawMicelle(ctx, x, y, radius, alpha, spin) {
    if (alpha < 0.02 || radius < 4) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    var core = radius * 0.42;
    ctx.beginPath();
    ctx.arc(x, y, core, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#92400e";
    ctx.stroke();
    var n = 10;
    for (var i = 0; i < n; i++) {
      var a = spin + (i / n) * Math.PI * 2;
      var hx = x + Math.cos(a) * radius * 0.82;
      var hy = y + Math.sin(a) * radius * 0.82;
      var tx = x + Math.cos(a) * (core + 1);
      var ty = y + Math.sin(a) * (core + 1);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hx, hy, Math.max(4, radius * 0.15), 0, Math.PI * 2);
      ctx.fillStyle = "#0f766e";
      ctx.fill();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "#134e4a";
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawWash(now) {
    if (!washCanvas) return;
    var fit = fitCanvas(washCanvas);
    var ctx = fit.ctx;
    var w = fit.w;
    var h = fit.h;
    var v = washValues();
    var pad = 26;
    var left = pad;
    var right = w - pad;
    var clothTop = h * 0.73;
    var clothBot = h - 14;
    var oilR = clamp(w * 0.105, 34, 58);
    var oil = { x: w * 0.5, y: clothTop - oilR * 0.35, r: oilR };
    var homes = [
      { x: w * 0.28, y: h * 0.34, r: clamp(w * 0.09, 32, 54) },
      { x: w * 0.52, y: h * 0.26, r: clamp(w * 0.11, 38, 64) },
      { x: w * 0.75, y: h * 0.38, r: clamp(w * 0.08, 30, 48) }
    ];
    var micFade = 1 - clamp((v.rinse - 0.55) / 0.45, 0, 1);

    function nearMicelle(x, y) {
      if (v.mic < 0.35 || micFade < 0.2) return false;
      for (var i = 0; i < homes.length; i++) {
        var home = homes[i];
        var mx = oil.x + (home.x - oil.x) * v.mic + v.rinse * w * 0.9;
        var my = oil.y + (home.y - oil.y) * v.mic;
        var mr = home.r * (0.28 + 0.72 * v.mic) + 18;
        var dx = x - mx;
        var dy = y - my;
        if (dx * dx + dy * dy < mr * mr) return true;
      }
      return false;
    }

    ctx.fillStyle = "#e7f0f7";
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    traceRoundRect(ctx, left, 16, right - left, clothTop - 16, 8);
    ctx.clip();
    var g = ctx.createLinearGradient(0, 16, 0, clothTop);
    g.addColorStop(0, "#e8f5fd");
    g.addColorStop(1, "#8ec4ea");
    ctx.fillStyle = g;
    ctx.fillRect(left, 16, right - left, clothTop - 16);
    if (v.rinse > 0.05) {
      ctx.globalAlpha = 0.45 + 0.4 * Math.min(1, v.rinse);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      for (var i = 0; i < 3; i++) {
        var y = 54 + i * ((clothTop - 90) / 3);
        var shift = reduceMotion ? 0 : (clock * 36 * speed + i * 36) % 48;
        var x0 = left + (right - left) * 0.3 + shift;
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x0 + 42, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x0 + 42, y);
        ctx.lineTo(x0 + 33, y - 4);
        ctx.lineTo(x0 + 33, y + 4);
        ctx.closePath();
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    var waters = [
      [0.1, 0.16, 0.4], [0.1, 0.42, 1.6],
      [0.9, 0.18, 0.9], [0.9, 0.46, 2.2]
    ];
    waters.forEach(function (spot) {
      var bob = reduceMotion ? 0 : Math.sin(now / 600 + spot[2]) * 3;
      var wx = left + spot[0] * (right - left);
      var wy = 36 + spot[1] * (clothTop - 70) + bob;
      if (nearMicelle(wx, wy)) return;
      drawWaterMol(ctx, wx, wy, spot[2], w < 480 ? 0.62 : 0.75, false);
    });
    ctx.restore();

    var cleanT = clamp(1 - v.oil, 0, 1);
    ctx.save();
    traceRoundRect(ctx, left, clothTop, right - left, clothBot - clothTop, 8);
    ctx.clip();
    ctx.fillStyle = cleanT > 0.85 ? "#f8fafc" : "#e4d2b8";
    ctx.fillRect(left, clothTop, right - left, clothBot - clothTop);
    ctx.strokeStyle = "rgba(120, 90, 55, 0.28)";
    ctx.lineWidth = 1.4;
    for (var x = left + 6; x < right; x += 11) {
      ctx.beginPath();
      ctx.moveTo(x, clothTop);
      ctx.bezierCurveTo(x + 3, clothTop + 18, x - 3, clothBot - 16, x, clothBot);
      ctx.stroke();
    }
    if (v.oil > 0.03) {
      ctx.globalAlpha = v.oil * 0.9;
      ctx.fillStyle = "#92400e";
      ctx.beginPath();
      ctx.ellipse(oil.x, clothTop + 14, oil.r * 0.95, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    if (v.oil > 0.03) {
      ctx.save();
      ctx.globalAlpha = v.oil;
      ctx.beginPath();
      ctx.ellipse(oil.x, oil.y, oil.r * 1.12, oil.r * 0.86, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#f6c453";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#92400e";
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(oil.x - oil.r * 0.28, oil.y - oil.r * 0.22, oil.r * 0.28, oil.r * 0.16, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fill();
      ctx.restore();
    }

    var approach = Math.max(v.ring, v.mic);
    var tailLen = 8 + oil.r * 0.62;
    var count = w < 460 ? 6 : 8;
    for (var s = 0; s < count; s++) {
      var t = count === 1 ? 0.5 : s / (count - 1);
      var a = -Math.PI + 0.5 + t * (Math.PI - 1.0);
      var dist = (oil.r + 8) + (1 - approach) * 64;
      var hx = oil.x + Math.cos(a) * dist;
      var hy = oil.y + Math.sin(a) * dist - (1 - approach) * 24;
      var wobble = (1 - approach) * Math.sin(s + now / 280) * 0.4;
      drawSoap(ctx, hx, hy, a + Math.PI + wobble, v.ring, tailLen);
    }

    var freeSpots = [
      [0.2, 0.28, 0.6], [0.32, 0.46, 2.1], [0.78, 0.24, 1.2], [0.7, 0.48, 2.6]
    ];
    freeSpots.forEach(function (spot, index) {
      if (w < 460 && index > 2) return;
      var bob = reduceMotion ? 0 : Math.sin(now / 500 + spot[2]) * 4;
      drawSoap(
        ctx,
        left + spot[0] * (right - left),
        30 + spot[1] * (clothTop * 0.55) + bob,
        spot[2],
        v.free,
        26
      );
    });

    var fade = 1 - clamp((v.rinse - 0.55) / 0.45, 0, 1);
    var shift = v.rinse * w * 0.9;
    homes.forEach(function (home, index) {
      var grow = v.mic;
      var x = oil.x + (home.x - oil.x) * grow + shift;
      var y = oil.y + (home.y - oil.y) * grow;
      var radius = home.r * (0.28 + 0.72 * grow);
      var spin = reduceMotion ? index : now / 1800 + index;
      drawMicelle(ctx, x, y, radius, v.mic * fade, spin);
    });

    ctx.save();
    ctx.strokeStyle = "rgba(71,85,105,0.65)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(left, 16);
    ctx.lineTo(left, clothBot);
    ctx.lineTo(right, clothBot);
    ctx.lineTo(right, 16);
    ctx.stroke();
    ctx.restore();

    var narrow = w < 520;
    pill(ctx, "water", left + 8, 32, "start");
    pill(ctx, cleanT > 0.85 ? "clean cloth" : "cloth", w / 2, (clothTop + clothBot) / 2, "middle");
    if (v.oil > 0.5 && v.ring < 0.45) {
      pill(ctx, narrow ? "grease stays" : "grease stays put", oil.x, oil.y - oil.r - 16, "middle");
    }
    if (v.ring > 0.62 && v.mic < 0.3) {
      var headLabelY = Math.max(18, oil.y - oil.r - 48);
      pill(ctx, narrow ? "heads in water" : "heads in water", oil.x, headLabelY, "middle");
      leader(ctx, oil.x, headLabelY + 14, oil.x, oil.y - oil.r - 16);
      pill(ctx, narrow ? "tails in grease" : "tails in grease", oil.x, oil.y + 2, "middle");
    }
    if (v.mic > 0.62 && v.rinse < 0.4) {
      pill(ctx, narrow ? "micelle" : "micelle · heads out, tails in", homes[1].x, homes[1].y - homes[1].r - 16, "middle");
    }
    if (v.rinse > 0.72) {
      pill(ctx, narrow ? "rinsed away" : "micelles rinsed away", w * 0.62, h * 0.22, "middle");
    }
  }

  function bindWash() {
    $("btn-add").addEventListener("click", function () { startWash("soapy"); });
    $("btn-stir").addEventListener("click", function () { startWash("micelles"); });
    $("btn-rinse").addEventListener("click", function () { startWash("clean"); });
    $("btn-reset").addEventListener("click", function () { snapWash("dirty"); });
    var range = $("speed");
    function readSpeed() {
      speed = parseFloat(range.value) || 1;
      range.setAttribute("aria-valuenow", String(speed));
      range.setAttribute("aria-valuetext", speed + " times");
      $("speed-readout").textContent = speed + "×";
    }
    range.addEventListener("input", readSpeed);
    readSpeed();
    document.querySelectorAll("[data-jump-wash]").forEach(function (link) {
      link.addEventListener("click", function () {
        snapWash(link.getAttribute("data-jump-wash"));
      });
    });
    syncWash();
  }

  function applyQuery() {
    var params = new URLSearchParams(window.location.search);
    var model = params.get("model");
    if (model === "structural" || model === "lollipop") setModel(model);
    var part = params.get("part");
    if (part === "head" || part === "tail") pinPart(part);
    var mix = params.get("mix");
    if (MIX[mix]) setMix(mix);
    var wash = params.get("wash");
    if (SNAP[wash]) snapWash(wash);
  }

  function tick(dt) {
    if (washU < 1) {
      var dur = washName === "micelles" ? 2400 : 2000;
      washU = clamp(washU + (dt * speed) / dur, 0, 1);
      if (washU >= 1) syncWash();
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    var dt = Math.min(40, now - (frame.last || now));
    frame.last = now;
    clock += dt / 1000;
    tick(dt);
    drawMix(now);
    drawWash(now);
  }

  bindMolecule();
  bindMix();
  bindWash();
  applyQuery();
  renderPart(false);
  requestAnimationFrame(frame);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      drawMix(performance.now());
      drawWash(performance.now());
    });
  }
})();
