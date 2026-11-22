(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var OILS = {
    olive: {
      name: "Olive oil",
      fatName: "glyceryl trioleate",
      model: "a simple model of olive oil, mostly oleic acid",
      formula: "C<sub>57</sub>H<sub>104</sub>O<sub>6</sub>",
      soapStem: "C<sub>17</sub>H<sub>33</sub>COO",
      soapNa: "sodium oleate",
      soapK: "potassium oleate",
      tail: "Olive oil is mostly oleic acid, an 18-carbon chain with one double bond. The bond bends the tail, so the soap packs loosely and the bar is milder and softer.",
      kink: true,
      chain: 0.92
    },
    coconut: {
      name: "Coconut oil",
      fatName: "glyceryl trilaurate",
      model: "a simple model of coconut oil, rich in lauric acid",
      formula: "C<sub>39</sub>H<sub>74</sub>O<sub>6</sub>",
      soapStem: "C<sub>11</sub>H<sub>23</sub>COO",
      soapNa: "sodium laurate",
      soapK: "potassium laurate",
      tail: "Coconut oil has lots of lauric acid, a shorter 12-carbon chain. Shorter tails dissolve more easily, so the soap lathers quickly. The bar is hard, and it can feel more drying.",
      kink: false,
      chain: 0.62
    },
    tallow: {
      name: "Animal fat",
      fatName: "glyceryl tristearate",
      model: "a simple model of tallow, rich in stearic acid",
      formula: "C<sub>57</sub>H<sub>110</sub>O<sub>6</sub>",
      soapStem: "C<sub>17</sub>H<sub>35</sub>COO",
      soapNa: "sodium stearate",
      soapK: "potassium stearate",
      tail: "Animal fat has long, straight, saturated chains such as stearic acid. It makes a hard, long-lasting bar. With NaOH the soap is sodium stearate, the same molecule as in How Soap Works.",
      kink: false,
      chain: 1
    }
  };

  var BASES = {
    naoh: {
      symbol: "NaOH",
      ion: "Na⁺",
      metal: "Na",
      product: "a firm bar",
      note: "Sodium hydroxide makes sodium salts of the fatty acids. Those salts pack into a firm bar."
    },
    koh: {
      symbol: "KOH",
      ion: "K⁺",
      metal: "K",
      product: "a soft or liquid soap",
      note: "Potassium hydroxide makes potassium salts. They dissolve more easily, so the soap stays soft or liquid."
    }
  };

  var LYES = {
    low: {
      count: 2,
      break: 2,
      name: "Too little lye",
      result: "Two ester links break, and one fatty-acid chain stays attached. Leftover oil makes greasy soap. A tiny bit of extra oil is sometimes left on purpose to make a milder bar. Too much leftover oil stays greasy."
    },
    ok: {
      count: 3,
      break: 3,
      name: "Balanced lye",
      result: "Each triglyceride meets three hydroxide ions, one for each ester. The fat becomes three soap molecules and glycerol. Each soap molecule has a polar head and a nonpolar tail, the same pattern that lifts grease in How Soap Works."
    },
    high: {
      count: 5,
      break: 3,
      name: "Too much lye",
      result: "All three esters break, and hydroxide is left over. Leftover lye is caustic. It can burn skin. Real recipes weigh the lye so this does not happen."
    }
  };

  var HEATS = {
    none: { label: "No extra heat", rate: 0.07, temp: "about room temperature" },
    warm: { label: "Warm", rate: 0.28, temp: "about 45°C" },
    hot: { label: "Hot", rate: 0.55, temp: "hot process, near boiling" }
  };

  var state = {
    oil: "tallow",
    base: "naoh",
    lye: "ok",
    heat: "warm",
    stage: "empty",
    mix: 0,
    progress: 0,
    playing: false
  };

  function $(id) { return document.getElementById(id); }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function oil() { return OILS[state.oil]; }
  function base() { return BASES[state.base]; }
  function lye() { return LYES[state.lye]; }

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

  function chainBreaks() {
    var n = lye().break;
    var out = [0, 0, 0];
    var running = state.stage === "reacting" || state.stage === "done" || state.stage === "cured";
    if (!running) return out;
    var p = state.progress * n;
    for (var i = 0; i < n; i++) out[i] = clamp(p - i, 0, 1);
    return out;
  }

  function brokenCount() {
    var parts = chainBreaks();
    var sum = 0;
    for (var i = 0; i < 3; i++) sum += parts[i];
    return sum;
  }

  function setChecks(group, attr, value) {
    group.querySelectorAll("[role='radio']").forEach(function (btn) {
      var on = btn.getAttribute(attr) === value;
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });
  }

  function lockChoices(locked) {
    ["oil-group", "base-group", "lye-group"].forEach(function (id) {
      $(id).querySelectorAll("button").forEach(function (btn) {
        btn.disabled = locked;
      });
    });
    $("lock-note").hidden = !locked;
  }

  function soapName() {
    return state.base === "naoh" ? oil().soapNa : oil().soapK;
  }

  function renderText() {
    var o = oil();
    var b = base();
    var L = lye();
    $("choice-note").textContent = o.name + " is " + o.model + ". " + o.tail + " " + b.note;
    $("eq-words").textContent = "triglyceride + 3 " + b.symbol + " → glycerol + 3 " + soapName();
    $("eq-symbols").innerHTML = o.formula + " + 3 " + b.symbol + " → C<sub>3</sub>H<sub>5</sub>(OH)<sub>3</sub> + 3 " + o.soapStem + b.metal;
    var note = "The balanced equation uses 3 " + b.symbol + " for each " + o.fatName + ", one hydroxide for each ester.";
    if (state.lye === "low") note += " This pot has only 2, so one ester cannot break.";
    if (state.lye === "high") note += " This pot has 5, so hydroxide is left over after the three esters break.";
    $("eq-note").textContent = note;

    var whole = Math.floor(brokenCount() + 0.001);
    var label = whole + " of 3 ester links broken";
    if (state.lye === "low" && whole >= 2 && state.stage !== "empty") {
      label = "2 of 3 ester links broken · one chain still attached";
    }
    $("meter-label").textContent = label;
    $("meter-fill").style.width = (brokenCount() / 3 * 100) + "%";
    $("meter").setAttribute("aria-valuenow", String(Math.round(brokenCount() * 10) / 10));
    $("meter").setAttribute("aria-valuetext", label);

    var title = "Empty pot";
    var text = "Choose a fat, a base, and how much lye, then add them. Animal fat with a balanced amount of NaOH makes sodium stearate, the soap molecule from How Soap Works.";
    if (state.stage === "layered") {
      title = "Ingredients added";
      text = "The fat floats on the lye water. Hydroxide has to reach the ester links, and the two layers barely touch. Stir them together. The water holds " + L.count + " OH⁻ ions and " + L.count + " " + b.ion + " ions for each fat molecule in this model.";
    } else if (state.stage === "mixing") {
      title = "Stirring";
      text = "Stirring mixes the fat into the lye water. Hydroxide can break an ester only where the fat and the lye water meet.";
    } else if (state.stage === "mixed") {
      title = "Ready to heat";
      text = "The fat and the lye water are mixed, so hydroxide can reach the ester links. Heat speeds the attack. With no extra heat, cold-process soap still reacts slowly and finishes while the bar cures. Temperature now: " + HEATS[state.heat].temp + ".";
    } else if (state.stage === "reacting") {
      title = "Hydroxide is breaking esters";
      text = "The hydroxide ion attacks an ester link and that link breaks. The fatty-acid chain leaves as a carboxylate, the soap, with " + b.ion + " nearby. The glycerol keeps an OH where the chain was attached. Heat is " + HEATS[state.heat].label.toLowerCase() + ", " + HEATS[state.heat].temp + ".";
    } else if (state.stage === "done") {
      title = L.name;
      text = L.result + " The base was " + b.symbol + ", which makes " + b.product + ".";
    } else if (state.stage === "cured") {
      title = state.base === "naoh" ? "Curing the bar" : "Liquid soap";
      text = state.base === "naoh"
        ? "The soap has been separated and the bar is curing. Water evaporates, the bar hardens, and the last bit of reaction can finish. Many bars cure for several weeks. Adding salt makes soap less soluble so it separates from the glycerol water. That step is called salting out."
        : "Potassium soap stays soft. It is dissolved in more water to make liquid soap instead of cured into a hard bar. Salt can still separate the soap from the glycerol water. That step is called salting out.";
    }
    $("status-title").textContent = title;
    $("make-status").textContent = text;

    $("btn-add").disabled = state.stage !== "empty";
    $("btn-mix").disabled = state.stage !== "layered";
    $("btn-heat").disabled = state.stage !== "mixed" && state.stage !== "reacting";
    $("btn-cure").disabled = state.stage !== "done";
    ["btn-add", "btn-mix", "btn-heat", "btn-cure", "btn-reset"].forEach(function (id) {
      $(id).classList.remove("is-primary");
    });
    if (state.stage === "empty") $("btn-add").classList.add("is-primary");
    else if (state.stage === "layered") $("btn-mix").classList.add("is-primary");
    else if (state.stage === "mixed") $("btn-heat").classList.add("is-primary");
    else if (state.stage === "done") $("btn-cure").classList.add("is-primary");
    else if (state.stage === "cured") $("btn-reset").classList.add("is-primary");
    lockChoices(state.stage !== "empty");
  }

  function tracePot(ctx, p) {
    ctx.beginPath();
    ctx.moveTo(p.tl, p.top);
    ctx.lineTo(p.bl, p.bot);
    ctx.quadraticCurveTo(p.cx, p.bot + p.curve, p.br, p.bot);
    ctx.lineTo(p.tr, p.top);
  }

  function potBox(w, h) {
    var cx = w * 0.52;
    var top = 28;
    var bot = h - 26;
    var halfTop = Math.min(w * 0.36, 250);
    var halfBot = halfTop * 0.72;
    return {
      cx: cx, top: top, bot: bot,
      tl: cx - halfTop, tr: cx + halfTop,
      bl: cx - halfBot, br: cx + halfBot,
      curve: 18
    };
  }

  function drawTail(ctx, x, y, angle, length, kink) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = "#c2410c";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    if (kink) {
      ctx.quadraticCurveTo(length * 0.32, -12, length * 0.5, 0);
      ctx.quadraticCurveTo(length * 0.68, 14, length, 2);
    } else {
      ctx.quadraticCurveTo(length * 0.3, 9, length * 0.58, -7);
      ctx.quadraticCurveTo(length * 0.78, -12, length, 0);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawHead(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#0f766e";
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "#134e4a";
    ctx.stroke();
  }

  function drawOH(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#dbeafe";
    ctx.fill();
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (r > 11) {
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "800 " + Math.max(10, Math.round(r * 0.7)) + "px Nunito, Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("OH⁻", x, y + 0.5);
    }
  }

  function drawCation(ctx, x, y, label) {
    traceRoundRect(ctx, x - 14, y - 11, 28, 22, 5);
    ctx.fillStyle = "#fef9c3";
    ctx.fill();
    ctx.strokeStyle = "#a16207";
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.fillStyle = "#713f12";
    ctx.font = "800 12px Nunito, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + 0.5);
  }

function drawFat(ctx, x, y, scale, parts, info, targets) {
  var gap = 32 * scale;
  var tailLen = 86 * scale * info.chain;
  var soaps = [];
    ctx.save();
    ctx.strokeStyle = "#0f766e";
    ctx.lineWidth = 7 * scale;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y - gap);
    ctx.lineTo(x, y + gap);
    ctx.stroke();
    for (var i = 0; i < 3; i++) {
      var py = y + (i - 1) * gap;
      var b = parts[i];
      var esterX = x - 18 * scale;
      ctx.strokeStyle = "#0f766e";
      ctx.lineWidth = 3 * scale;
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(esterX, py);
      ctx.stroke();
      if (b < 0.7) {
        ctx.beginPath();
        ctx.arc(esterX, py, 5.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#9a3412";
        ctx.stroke();
        drawTail(ctx, esterX - 6 * scale, py, Math.PI, tailLen, info.kink);
        if (b > 0.08) {
          var t = b / 0.7;
          drawOH(ctx, esterX + 8 * scale, py + (1 - t) * 26 * scale + 8, 12 * scale);
        }
      } else {
        ctx.beginPath();
        ctx.arc(esterX, py, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = "#99f6e4";
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#0f766e";
        ctx.stroke();
        var glide = (b - 0.7) / 0.3;
        var fromX = esterX - 6 * scale;
        var to = targets[i];
        soaps.push({
          x: fromX + (to.x - fromX) * glide,
          y: py + (to.y - py) * glide,
          len: Math.min(tailLen, 50 * scale)
        });
      }
    }
    ctx.restore();
    soaps.forEach(function (soap) {
      drawTail(ctx, soap.x, soap.y, Math.PI, soap.len, info.kink);
      drawHead(ctx, soap.x, soap.y);
      drawCation(ctx, soap.x, soap.y - 22, base().ion);
    });
    return { spineX: x, spineY: y, gap: gap };
  }

  function drawIdleIons(ctx, p, parts) {
    var used = 0;
    for (var i = 0; i < 3; i++) if (parts[i] >= 0.7) used += 1;
    var attacking = 0;
    for (var j = 0; j < 3; j++) if (parts[j] > 0.08 && parts[j] < 0.7) attacking = 1;
    var left = Math.max(0, lye().count - used - attacking);
    if (!left) return;
    var mixed = mixShown() >= 0.45;
    var span = mixed ? 46 : Math.max(52, Math.min(68, (p.tr - p.tl - 70) / left));
    var start = mixed ? p.tl + 42 : p.cx - ((left - 1) * span) / 2;
    var y = p.top + (p.bot - p.top) * (mixed ? 0.56 : 0.64);
    for (var n = 0; n < left; n++) {
      drawOH(ctx, start + n * span, y, 15);
      drawCation(ctx, start + n * span, y + 34, base().ion);
    }
  }

  function mixShown() {
    if (state.stage === "empty" || state.stage === "layered") return 0;
    if (state.stage === "mixing") return state.mix;
    return 1;
  }

  function drawPot(ctx, w, h, now) {
    var p = potBox(w, h);
    var mix = mixShown();
    ctx.save();
    tracePot(ctx, p);
    ctx.clip();
    var g = ctx.createLinearGradient(0, p.top, 0, p.bot);
    if (state.heat === "hot" && (state.stage === "reacting" || state.stage === "done")) {
      g.addColorStop(0, "#fde68a");
      g.addColorStop(1, "#fb923c");
    } else {
      g.addColorStop(0, "#e0f2fe");
      g.addColorStop(1, "#7dd3fc");
    }
    ctx.fillStyle = g;
    ctx.fillRect(p.bl - 20, p.top, (p.br - p.bl) + 80, p.bot - p.top + 30);

    if (state.stage !== "empty") {
      ctx.globalAlpha = 1 - mix;
      ctx.fillStyle = "#f6c453";
      var band = (p.bot - p.top) * 0.34;
      ctx.fillRect(p.tl - 20, p.top + 8, (p.tr - p.tl) + 50, band);
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    if (state.stage !== "empty") {
      var info = oil();
      var parts = chainBreaks();
      var oilY = p.top + (p.bot - p.top) * 0.3;
      var midY = p.top + (p.bot - p.top) * 0.46;
      var wob = state.stage === "mixing" && !reduceMotion ? Math.sin(now / 180) * 6 : 0;
      var scale = w < 520 ? 0.72 : 1;
      var targets = [0, 1, 2].map(function (i) {
        return { x: p.cx - 100 * scale + i * 100 * scale, y: p.bot - 64 };
      });
      var fat = drawFat(ctx, p.cx + 36 + wob, oilY + (midY - oilY) * mix, scale, parts, info, targets);
      drawIdleIons(ctx, p, parts);

      var narrow = w < 560;
      if (mix < 0.4) {
        pill(ctx, narrow ? "fat" : "fat / triglyceride", p.cx - 20, p.top + 46, "middle");
        pill(ctx, narrow ? "lye water" : "lye water · OH⁻", p.cx, p.bot - 36, "middle");
      }
      var active = -1;
      for (var i = 0; i < 3; i++) if (parts[i] > 0.08 && parts[i] < 0.7) active = i;
      if (active >= 0) {
        pill(ctx, narrow ? "OH⁻ attacks" : "hydroxide attacks the ester", p.tl + 8, p.top + 18, "start");
      }
      if (parts[0] + parts[1] + parts[2] > 2.2) {
        pill(ctx, "glycerol", fat.spineX + 16, fat.spineY, "start");
        pill(ctx, narrow ? "soap molecules" : "polar heads, nonpolar tails", p.cx, p.bot - 22, "middle");
      } else if (state.lye === "low" && parts[1] > 0.95) {
        pill(ctx, "chain still attached", fat.spineX - 20, fat.spineY + fat.gap + 22, "middle");
      }
      if (state.lye === "high" && state.progress > 0.95) {
        pill(ctx, narrow ? "leftover lye" : "leftover lye · harsh", p.tl + 42, p.top + (p.bot - p.top) * 0.48, "start");
      }
    } else {
      pill(ctx, "Add a fat and lye", p.cx, (p.top + p.bot) / 2, "middle");
    }

    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#475569";
    ctx.lineJoin = "round";
    tracePot(ctx, p);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.tl - 10, p.top);
    ctx.lineTo(p.tr + 10, p.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.tr + 16, (p.top + p.bot) / 2, 26, -1.1, 1.1);
    ctx.stroke();
    ctx.restore();

    if (state.heat !== "none" && (state.stage === "reacting" || state.stage === "done" || state.stage === "mixed")) {
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 2;
      for (var s = 0; s < 3; s++) {
        var sx = p.cx - 40 + s * 36;
        var rise = reduceMotion ? 0 : (now / 400 + s) % 1;
        ctx.globalAlpha = 0.35 + 0.4 * (1 - rise);
        ctx.beginPath();
        ctx.moveTo(sx, p.top - 6 - rise * 18);
        ctx.quadraticCurveTo(sx + 8, p.top - 16 - rise * 18, sx, p.top - 28 - rise * 16);
        ctx.stroke();
      }
      ctx.restore();
    }
    pill(ctx, state.heat === "hot" ? "hot pot" : "soap pot", p.tl + 6, p.top - 8, "start");
  }

  function drawCured(ctx, w, h) {
    ctx.fillStyle = "#e7f0f7";
    ctx.fillRect(0, 0, w, h);
    var narrow = w < 640;
    var splitX = narrow ? w * 0.5 : w * 0.3;
    var splitY = narrow ? h * 0.28 : h * 0.48;

    traceRoundRect(ctx, splitX - 70, splitY - 78, 140, 150, 12);
    ctx.fillStyle = "#e0f2fe";
    ctx.fill();
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(splitX - 70, splitY - 78, 140, 58);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.stroke();
    pill(ctx, "soap", splitX, splitY - 50, "middle");
    pill(ctx, "glycerol water", splitX, splitY + 28, "middle");
    pill(ctx, "salting out", splitX, splitY - 96, "middle");

    var px = narrow ? w * 0.5 : w * 0.7;
    var py = narrow ? h * 0.72 : h * 0.5;
    if (state.base === "naoh") {
      traceRoundRect(ctx, px - 78, py - 28, 156, 64, 12);
      ctx.fillStyle = "#fde68a";
      ctx.fill();
      ctx.strokeStyle = "#a16207";
      ctx.lineWidth = 2;
      ctx.stroke();
      pill(ctx, "curing bar", px, py, "middle");
      ctx.fillStyle = "#7dd3fc";
      [[-40, -48], [0, -58], [36, -46]].forEach(function (d) {
        ctx.beginPath();
        ctx.arc(px + d[0], py + d[1], 5, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      traceRoundRect(ctx, px - 36, py - 50, 72, 96, 16);
      ctx.fillStyle = "#fde68a";
      ctx.fill();
      ctx.strokeStyle = "#a16207";
      ctx.lineWidth = 2;
      ctx.stroke();
      traceRoundRect(ctx, px - 16, py - 74, 32, 28, 6);
      ctx.stroke();
      pill(ctx, "liquid soap", px, py - 4, "middle");
    }
  }

  function draw(now) {
    var canvas = $("pot-canvas");
    if (!canvas) return;
    var fit = fitCanvas(canvas);
    fit.ctx.fillStyle = "#e7f0f7";
    fit.ctx.fillRect(0, 0, fit.w, fit.h);
    if (state.stage === "cured") drawCured(fit.ctx, fit.w, fit.h);
    else drawPot(fit.ctx, fit.w, fit.h, now);
  }

  function tick(dt) {
    if (state.stage === "mixing") {
      state.mix = reduceMotion ? 1 : clamp(state.mix + dt / 1400, 0, 1);
      if (state.mix >= 1) state.stage = "mixed";
      renderText();
    } else if (state.stage === "reacting" && state.playing) {
      var rate = HEATS[state.heat].rate;
      state.progress = reduceMotion ? 1 : clamp(state.progress + (dt / 1000) * rate, 0, 1);
      if (state.progress >= 1) state.stage = "done";
      renderText();
    }
  }

  function bindRadios(groupId, attr, key) {
    var group = $(groupId);
    var buttons = Array.prototype.slice.call(group.querySelectorAll("[role='radio']"));
    buttons.forEach(function (btn, index) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        state[key] = btn.getAttribute(attr);
        setChecks(group, attr, state[key]);
        renderText();
      });
      btn.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        var dir = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
        var next = buttons[(index + dir + buttons.length) % buttons.length];
        next.focus();
        if (!next.disabled) next.click();
      });
    });
  }

  function reset() {
    state.stage = "empty";
    state.mix = 0;
    state.progress = 0;
    state.playing = false;
    renderText();
  }

  function bind() {
    bindRadios("oil-group", "data-oil", "oil");
    bindRadios("base-group", "data-base", "base");
    bindRadios("lye-group", "data-lye", "lye");
    bindRadios("heat-group", "data-heat", "heat");
    $("btn-add").addEventListener("click", function () {
      if (state.stage !== "empty") return;
      state.stage = "layered";
      renderText();
    });
    $("btn-mix").addEventListener("click", function () {
      if (state.stage !== "layered") return;
      state.stage = "mixing";
      state.mix = 0;
      if (reduceMotion) {
        state.mix = 1;
        state.stage = "mixed";
      }
      renderText();
    });
    $("btn-heat").addEventListener("click", function () {
      if (state.stage !== "mixed" && state.stage !== "reacting") return;
      state.stage = "reacting";
      state.playing = true;
      if (reduceMotion) {
        state.progress = 1;
        state.stage = "done";
      }
      renderText();
    });
    $("btn-cure").addEventListener("click", function () {
      if (state.stage !== "done") return;
      state.stage = "cured";
      renderText();
    });
    $("btn-reset").addEventListener("click", reset);
  }

  function applyQuery() {
    var params = new URLSearchParams(window.location.search);
    if (OILS[params.get("oil")]) state.oil = params.get("oil");
    if (BASES[params.get("base")]) state.base = params.get("base");
    if (LYES[params.get("lye")]) state.lye = params.get("lye");
    if (HEATS[params.get("heat")]) state.heat = params.get("heat");
    setChecks($("oil-group"), "data-oil", state.oil);
    setChecks($("base-group"), "data-base", state.base);
    setChecks($("lye-group"), "data-lye", state.lye);
    setChecks($("heat-group"), "data-heat", state.heat);
    var stage = params.get("stage");
    if (stage === "added") state.stage = "layered";
    if (stage === "mixed") {
      state.stage = "mixed";
      state.mix = 1;
    }
    if (stage === "reacting") {
      state.stage = "reacting";
      state.mix = 1;
      state.progress = clamp(parseFloat(params.get("progress")) || 0.45, 0, 0.98);
    }
    if (stage === "done") {
      state.stage = "done";
      state.mix = 1;
      state.progress = 1;
    }
    if (stage === "cured") {
      state.stage = "cured";
      state.mix = 1;
      state.progress = 1;
    }
  }

  var canvas = $("pot-canvas");
  bind();
  applyQuery();
  renderText();

  var last = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    var dt = Math.min(40, now - (last || now));
    last = now;
    tick(dt);
    draw(now);
  }
  requestAnimationFrame(frame);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { draw(performance.now()); });
  }
})();
