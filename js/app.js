/* منصة الأشعة — تطبيق صفحة واحدة (SPA) بنمط iOS، بالعربية والإنجليزية
   Radiology Platform — iOS-style single-page app, Arabic and English.
   التوجيه بالرابط بعد علامة # مثل: #/modalities/ct */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const main = $("#main");
  const I = window.ICON;
  const fmt = (n, d = 2) => Number(n).toLocaleString("en-US", { maximumFractionDigits: d });
  const C = (c) => `style="--c:var(--${c})"`;

  /* ---------- اللغة / Language ---------- */
  const RAD_AR = window.RAD;
  const merge = (a, b) => {
    if (b === undefined) return a;
    if (Array.isArray(a)) return a.map((x, i) => merge(x, b[i]));
    if (a && typeof a === "object") { const o = {}; for (const k of Object.keys(a)) o[k] = merge(a[k], b[k]); for (const k of Object.keys(b)) if (!(k in o)) o[k] = b[k]; return o; }
    return b;
  };
  const RAD_EN = merge(RAD_AR, window.RAD_EN);
  let LANG = "ar", D = RAD_AR, U = I18N.ar;
  try { const l = localStorage.getItem("lang"); if (l === "en" || l === "ar") LANG = l; } catch (e) {}
  const tr = (s, v = {}) => s.replace(/\{(\w+)\}/g, (_, k) => (k in v ? v[k] : ""));
  const IMG = (id) => `assets/img/${id}${LANG === "en" ? "-en" : ""}.svg`;

  /* ---------- الألوان / Colors ---------- */
  const MOD = {
    xray: ["blue", "bone"], ct: ["indigo", "ring"], mri: ["purple", "magnet"], ultrasound: ["teal", "waves"],
    mammography: ["pink", "circle"], fluoroscopy: ["orange", "video"], nuclear: ["green", "atom"],
    interventional: ["red", "needle"], dexa: ["cyan", "ruler"]
  };
  const TABS = [
    { r: "", k: "home", i: "home", c: "blue" },
    { r: "history", k: "history", i: "clock", c: "orange" },
    { r: "modalities", k: "modalities", i: "scan", c: "indigo" },
    { r: "safety", k: "safety", i: "shield", c: "green" },
    { r: "tools", k: "tools", i: "grid", c: "pink" }
  ];
  const PARENT = { "mri-safety": "safety", contrast: "safety", dose: "tools", quiz: "tools", glossary: "tools", about: "" };
  const parentLabel = (r) => U.tabs[(TABS.find(t => t.r === r) || TABS[0]).k];

  /* ---------- الإطار / App chrome ---------- */
  function paintChrome() {
    const html = document.documentElement;
    html.lang = LANG; html.dir = LANG === "ar" ? "rtl" : "ltr";
    $("#tabbar").innerHTML = TABS.map(t => `<a href="#/${t.r}" data-r="${t.r}" ${C(t.c)}>${I(t.i)}<span>${U.tabs[t.k]}</span></a>`).join("");
    $(".skip").textContent = U.skip;
    $(".site-footer").innerHTML = `${U.footer} · <a href="#/about">${U.footerLink}</a>`;
    $("#theme-btn").setAttribute("aria-label", U.themeBtn);
    $("#lang-btn").setAttribute("aria-label", U.langBtn);
    $("#lang-btn").textContent = U.langShort;
    $("#lang-btn").setAttribute("lang", LANG === "ar" ? "en" : "ar");
    $("#tabbar").setAttribute("aria-label", LANG === "ar" ? "التنقل الرئيسي" : "Main navigation");
    paintThemeBtn();
  }
  function setLang(l) {
    LANG = l; D = l === "en" ? RAD_EN : RAD_AR; U = I18N[l];
    window.RAD = D;
    try { localStorage.setItem("lang", l); } catch (e) {}
    paintChrome();
  }

  const isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  };
  function paintThemeBtn() { $("#theme-btn").innerHTML = I(isDark() ? "sun" : "moon"); }
  $("#theme-btn").addEventListener("click", () => {
    document.documentElement.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("theme", document.documentElement.dataset.theme); } catch (e) {}
    paintThemeBtn();
  });
  $("#lang-btn").addEventListener("click", () => { setLang(LANG === "ar" ? "en" : "ar"); route(true); });

  const navbar = $("#navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 36);
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- مكوّنات / Components ---------- */
  const title = (kicker, h, p, c) => `<header class="large-title" ${C(c)}>${kicker ? `<span class="kicker">${kicker}</span>` : ""}<h1>${h}</h1>${p ? `<p>${p}</p>` : ""}</header>`;
  const sectionHead = (h, link) => `<div class="section-head"><h2>${h}</h2>${link || ""}</div>`;
  const ico = (name, c, lg) => `<span class="ico${lg ? " lg" : ""}" ${C(c)}>${I(name)}</span>`;
  const row = (o) => {
    const tag = o.href ? "a" : "div";
    return `<${tag} class="row${o.top ? " top" : ""}"${o.href ? ` href="${o.href}"` : ""}>
      ${o.icon ? ico(o.icon, o.c) : o.bullet ? `<span class="bullet" ${C(o.bullet)}></span>` : ""}
      <span class="txt"><span class="t">${o.t}</span>${o.s ? `<span class="s">${o.s}</span>` : ""}</span>
      ${o.v ? `<span class="v">${o.v}</span>` : ""}${o.href ? I("chev", 'class="chev"') : ""}</${tag}>`;
  };
  const group = (rows, icons) => `<div class="group${icons ? " icons" : ""}">${rows.join("")}</div>`;
  const hero = (id, cap) => `<figure class="hero-media" style="margin:0"><img src="${IMG(id)}" alt="${tr(U.illusAlt, { t: cap })}" loading="lazy"><figcaption>${U.illus} · ${cap}</figcaption></figure>`;
  const meter = (lvl) => `<span class="meter">${[1, 2, 3, 4].map(i => `<i class="${i <= lvl ? "on" : ""}"></i>`).join("")}</span>`;
  const doseBadge = (lvl) => `<span class="badge lvl-${lvl}">${meter(lvl)}${D.doseLabels[lvl]}</span>`;
  const callout = (icon, c, h, p) => `<div class="callout" ${C(c)}>${ico(icon, c)}<div><b>${h}</b><p>${p}</p></div></div>`;
  const tile = ([h, c, i, t, s]) => `<a class="tile" href="${h}" ${C(c)}><span class="ti">${I(i)}</span><span><b>${t}</b><span>${s}</span></span></a>`;
  const yearsSince = () => new Date().getFullYear() - 1895;
  const nEvents = () => D.history.reduce((n, e) => n + e.items.length, 0);
  // عدد + وحدة بصيغة صحيحة لغويًا / count + unit with correct grammar
  function count(n, w) {
    const s = fmt(n, n < 10 && n % 1 ? 1 : 0), v = Number(s);
    if (LANG === "en") return `${s} ${v === 1 ? w[0] : w[1]}`;
    if (v === 1) return w[0];
    if (v === 2) return w[1];
    if (v >= 3 && v <= 10 && v % 1 === 0) return `${s} ${w[2]}`;
    return `${s} ${w[3]}`;
  }
  function bgPeriod(m) {
    const days = m / D.background * 365;
    if (days < 1) return count(Math.round(days * 24), U.units.h);
    if (days < 60) return count(Math.round(days), U.units.d);
    if (days < 730) return count(Math.round(days / 30), U.units.m);
    return count(Math.round(days / 365 * 10) / 10, U.units.y);
  }

  /* ---------- الصفحات / Views ---------- */
  const views = {};

  views[""] = () => {
    const H = U.home;
    const fact = D.facts[Math.floor(Math.random() * D.facts.length)];
    return `
    ${title(H.k, H.h, H.p, "blue")}
    <a class="feature" href="#/history" ${C("blue")}>
      <img src="${IMG("hero")}" alt="">
      <div class="cap"><small>${H.start}</small><h2>${tr(H.years, { n: `<span class="num">${yearsSince()}</span>` })}</h2><p>${tr(H.feat, { n: nEvents() })}</p></div>
    </a>
    <section class="section">
      ${sectionHead(H.explore)}
      <div class="tiles">${[
        ["#/history", "orange", "clock", H.tHistory, tr(H.sHistory, { n: nEvents() })],
        ["#/modalities", "indigo", "scan", H.tTypes, tr(H.sTypes, { n: D.modalities.length })],
        ["#/safety", "green", "shield", H.tSafety, "ICRP · IAEA · WHO"],
        ["#/mri-safety", "purple", "magnet", H.tMri, H.sMri],
        ["#/dose", "pink", "gauge", H.tDose, H.sDose],
        ["#/quiz", "teal", "question", H.tQuiz, tr(H.sQuiz, { n: D.quiz.length })]
      ].map(tile).join("")}</div>
    </section>
    <div class="fact" ${C("yellow")}>${ico("lightbulb", "yellow")}<div><b>${H.fact}</b><p>${fact}</p></div></div>
    <section class="section">
      ${sectionHead(H.types, `<a href="#/modalities">${U.seeAll}</a>`)}
      ${group(D.modalities.map(m => row({ href: `#/modalities/${m.id}`, icon: MOD[m.id][1], c: MOD[m.id][0], t: m.name, s: D.doseLabels[m.dose] })), true)}
    </section>
    <section class="section">
      ${group([
        row({ href: "#/glossary", icon: "book", c: "cyan", t: H.gloss, s: tr(H.glossS, { n: D.glossary.length }) }),
        row({ href: "#/contrast", icon: "drop", c: "teal", t: H.contrast, s: H.contrastS }),
        row({ href: "#/about", icon: "info", c: "gray", t: H.about })
      ], true)}
    </section>`;
  };

  views.history = () => {
    const H = U.history;
    let n = 0;
    return `
    ${title(H.k, H.h, H.p, "orange")}
    <div class="segmented" role="group" aria-label="${H.filter}" ${C("orange")}>
      <button type="button" data-f="all" aria-pressed="true">${U.all}</button>
      ${Object.entries(U.cats).map(([k, v]) => `<button type="button" data-f="${k}" aria-pressed="false">${v}</button>`).join("")}
    </div>
    ${D.history.map(era => `
      <section class="section" data-era>
        <div class="era-label">${era.era}</div>
        <div>${era.items.map(it => {
          const id = "ev" + (n++);
          return `<article class="event cat-${it.c}" data-cat="${it.c}">
            <button type="button" aria-expanded="false" aria-controls="${id}">
              <span class="yr num">${it.y}</span>
              <span class="txt"><span class="t">${it.t}</span><span class="s">${it.w}</span></span>
              ${I("chev", 'class="chev"')}
            </button>
            <div class="more" id="${id}" hidden>
              <span class="badge">${U.cat1[it.c]}</span>
              <p>${it.d}</p>
              <img src="${IMG(it.img)}" alt="${tr(U.illusAlt, { t: it.t })}" loading="lazy">
            </div>
          </article>`;
        }).join("")}</div>
      </section>`).join("")}`;
  };
  views.history.mount = (on) => {
    on("click", e => {
      const b = e.target.closest(".event > button");
      if (b) {
        const open = b.getAttribute("aria-expanded") === "true";
        b.setAttribute("aria-expanded", String(!open));
        document.getElementById(b.getAttribute("aria-controls")).hidden = open;
        return;
      }
      const f = e.target.closest("[data-f]");
      if (f) {
        $$("[data-f]").forEach(x => x.setAttribute("aria-pressed", String(x === f)));
        $$(".event").forEach(ev => ev.hidden = !(f.dataset.f === "all" || ev.dataset.cat === f.dataset.f));
        $$("[data-era]").forEach(s => s.hidden = !$(".event:not([hidden])", s));
      }
    });
  };

  // الاسم الثانوي: الإنجليزي في العربية، والعربي في الإنجليزية
  const altName = (m, i) => LANG === "en" ? RAD_AR.modalities[i].name : m.en;

  views.modalities = (id) => {
    if (id) return modalityDetail(id);
    const H = U.mods;
    return `
    ${title(H.k, H.h, H.p, "indigo")}
    <div class="mod-grid">${D.modalities.map((m, i) => `
      <a class="mod" href="#/modalities/${m.id}" ${C(MOD[m.id][0])}>
        <div class="media"><img src="${IMG("m-" + m.id)}" alt="" loading="lazy">${ico(MOD[m.id][1], MOD[m.id][0], true)}</div>
        <div class="body"><h3>${m.name}</h3><span class="en" lang="${LANG === "en" ? "ar" : "en"}">${altName(m, i)}</span><p>${m.short}</p>${doseBadge(m.dose)}</div>
      </a>`).join("")}
    </div>`;
  };
  function modalityDetail(id) {
    const i = D.modalities.findIndex(m => m.id === id);
    if (i < 0) return notFound();
    const H = U.mod;
    const m = D.modalities[i], [c] = MOD[m.id];
    const prev = D.modalities[(i - 1 + D.modalities.length) % D.modalities.length];
    const next = D.modalities[(i + 1) % D.modalities.length];
    const bullets = (arr, bc) => group(arr.map(x => row({ t: x, bullet: bc, top: true })));
    return `
    ${title(`<span lang="${LANG === "en" ? "ar" : "en"}">${altName(m, i)}</span>`, m.name, m.short, c)}
    ${hero("m-" + m.id, m.name)}
    <div class="widgets">
      <div class="widget lvl-${m.dose}"><span class="wl"><i></i>${H.rad}</span><span class="wv">${meter(m.dose)}</span><span style="font-size:12px;color:var(--label-2)">${D.doseLabels[m.dose]}</span></div>
      <div class="widget" ${C(c)}><span class="wl"><i></i>${H.dur}</span><span class="wv">${m.duration}</span></div>
      <div class="widget" ${C(m.dose ? "orange" : "green")}><span class="wl"><i></i>${H.ion}</span><span class="wv">${m.dose ? U.yes : U.no}</span></div>
    </div>
    <section class="section">${sectionHead(H.how)}<div class="prose-card"><p>${m.how}</p></div></section>
    <section class="section">${sectionHead(H.uses)}${bullets(m.uses, c)}</section>
    <section class="section">${sectionHead(H.prep)}${group(m.prep.map(x => row({ t: x, icon: "check", c: "green", top: true })), true)}</section>
    <section class="section">${sectionHead(H.during)}<div class="prose-card"><p>${m.during}</p></div></section>
    <section class="section">${sectionHead(H.risks)}${bullets(m.risks, "orange")}</section>
    ${callout("lightbulb", "yellow", H.tip, m.tip)}
    ${m.link ? `<a class="btn tinted block" href="${m.link.href}" ${C("purple")}>${I("magnet", 'width="20" height="20"')}${m.link.text}</a>` : ""}
    <nav class="pager" aria-label="${H.pager}">
      <a href="#/modalities/${prev.id}" ${C(MOD[prev.id][0])}><small>${H.prev}</small><b>${prev.name}</b></a>
      <a href="#/modalities/${next.id}" ${C(MOD[next.id][0])}><small>${H.next}</small><b>${next.name}</b></a>
    </nav>`;
  }

  views.safety = () => {
    const H = U.safety;
    return `
    ${title(H.k, H.h, H.p, "green")}
    <section class="section">${sectionHead(H.ionH)}
      ${group([
        row({ icon: "radiation", c: "orange", t: H.ion[0], s: H.ion[1], top: true }),
        row({ icon: "waves", c: "green", t: H.non[0], s: H.non[1], top: true })
      ], true)}
      <p class="footnote">${H.ionNote}</p>
    </section>
    <section class="section">${sectionHead(H.prH)}
      ${group(H.pr.map((p, i) => row({ icon: ["check", "gauge", "shield"][i], c: ["blue", "indigo", "green"][i], t: p[0], s: p[1], top: true })), true)}
    </section>
    <section class="section">${sectionHead(H.tdsH)}
      ${hero("s-tds", H.tdsH)}
      ${group(H.tds.map((p, i) => row({ icon: ["timer", "ruler", "shield"][i], c: ["orange", "blue", "green"][i], t: p[0], s: p[1], top: true })), true)}
      <div class="card card-pad" ${C("blue")}>
        <b>${H.tryH}</b>
        <div class="people" aria-hidden="true"><span class="src"></span><span class="p" id="dist-p" ${C("red")}></span></div>
        <label for="dist" style="color:var(--label-2);font-size:14px">${H.tryL}</label>
        <input class="slider" type="range" id="dist" min="0.5" max="4" step="0.5" value="1" ${C("blue")}>
        <div class="row" style="padding:0;min-height:0"><span class="txt"><span class="t">${H.dist} <b class="num" id="dist-m">1</b> ${H.m}</span></span><span class="v">${H.dose} <b class="num" id="dist-v" style="color:var(--c)">100%</b></span></div>
        <div class="bar"><span id="dist-bar" style="width:100%"></span></div>
      </div>
    </section>
    <section class="section">${sectionHead(H.cmpH, `<a href="#/dose">${H.cmpLink}</a>`)}
      ${group(D.exams.map(x => row({ t: x.n, s: tr(H.cmpS, { p: bgPeriod(x.m) }), v: `<span class="num">${fmt(x.m, 3)} mSv</span>` })))}
      <p class="footnote">${tr(H.cmpNote, { bg: `<span class="num">${D.background}</span>` })}</p>
    </section>
    <section class="section">${sectionHead(H.limH)}
      ${group(D.limits.map(l => row({ t: l.who, s: l.note, v: `<span class="num">${l.v}</span>`, top: true })))}
      <p class="footnote">${H.limNote}</p>
    </section>
    <section class="section">${sectionHead(H.pregH)}
      ${callout("person", "orange", H.preg[0], H.preg[1])}
      ${hero("s-pregnancy", H.pregCap)}
      ${callout("baby", "cyan", H.kids[0], H.kids[1])}
    </section>
    <section class="section">${sectionHead(H.staffH)}
      ${hero("s-staff", H.staffCap)}
      ${group(H.staff.map(t => row({ t, bullet: "green", top: true })))}
    </section>
    <section class="section">${sectionHead(H.mythH)}
      ${group(D.myths.map(x => row({ icon: "alert", c: "red", t: x.m, s: `<b style="color:var(--green)">${H.truth}</b> ${x.f}`, top: true })), true)}
    </section>
    <section class="section">${sectionHead(H.moreH)}
      ${group([
        row({ href: "#/mri-safety", icon: "magnet", c: "purple", t: H.mri[0], s: H.mri[1] }),
        row({ href: "#/contrast", icon: "drop", c: "teal", t: H.contrast[0], s: H.contrast[1] })
      ], true)}
    </section>`;
  };
  views.safety.mount = () => {
    const r = $("#dist");
    const upd = () => {
      const d = Number(r.value), p = 100 / (d * d);
      $("#dist-m").textContent = d;
      $("#dist-v").textContent = fmt(p, 1) + "%";
      $("#dist-bar").style.width = Math.min(100, p) + "%";
      const pp = $("#dist-p");
      pp.style.marginRight = `${(4 - d) / 3.5 * 70}%`;
      pp.style.setProperty("--c", p >= 50 ? "var(--red)" : p >= 15 ? "var(--orange)" : "var(--green)");
    };
    r.addEventListener("input", upd); upd();
  };

  const ZC = ["green", "blue", "orange", "red"];
  const SEV = { high: "red", mid: "orange", low: "blue" };
  views["mri-safety"] = () => {
    const H = U.mri;
    return `
    ${title(H.k, H.h, H.p, "purple")}
    ${hero("s-mri-zones", H.cap)}
    <section class="section">${sectionHead(H.zonesH)}
      ${group(D.mriZones.map((z, i) => `<div class="row top"><span class="ico" ${C(ZC[i])}><b class="num" style="font-size:16px">${i + 1}</b></span><span class="txt"><span class="t">${z.t}</span><span class="s">${z.d}</span></span></div>`), true)}
    </section>
    <section class="section">${sectionHead(H.labelsH)}
      ${group(D.mriLabels.map(l => row({
        icon: l.cls === "none" ? "check" : l.cls === "mid" ? "alert" : "bolt", c: l.cls === "none" ? "green" : l.cls === "mid" ? "yellow" : "red",
        t: LANG === "en" ? l.a : `${l.a} <span class="num" style="color:var(--label-2);font-size:14px">${l.k}</span>`, s: l.d, top: true
      })), true)}
    </section>
    <section class="section">${sectionHead(H.checkH)}
      <div class="group-label">${H.checkNote}</div>
      ${group(D.mriChecks.map(c => `<label class="row" for="mc-${c.id}"><span class="bullet" ${C(SEV[c.sev])}></span><span class="txt"><span class="t">${c.t}</span><span class="s">${c.s}</span></span>
        <span class="switch" ${C("purple")}><input type="checkbox" id="mc-${c.id}" data-sev="${c.sev}"><span></span></span></label>`))}
      <div id="mri-res" aria-live="polite"></div>
    </section>`;
  };
  views["mri-safety"].mount = () => {
    const H = U.mri, res = $("#mri-res");
    const upd = () => {
      const on = $$(".switch input:checked");
      const high = on.filter(x => x.dataset.sev === "high").length, v = { n: on.length, h: high };
      res.innerHTML = !on.length ? callout("check", "green", H.none[0], H.none[1])
        : high ? callout("alert", "red", tr(H.high[0], v), H.high[1])
        : callout("info", "orange", tr(H.some[0], v), H.some[1]);
    };
    $$(".switch input").forEach(x => x.addEventListener("change", upd)); upd();
  };

  views.contrast = () => {
    const H = U.contrast;
    return `
    ${title(H.k, H.h, H.p, "teal")}
    ${hero("s-contrast", H.cap)}
    <section class="section">${sectionHead(H.typesH)}
      ${group(D.contrast.map((c, i) => row({ icon: "drop", c: ["blue", "purple", "gray", "teal"][i], t: c.t, s: `${c.u}. ${c.n}`, top: true })), true)}
    </section>
    <section class="section">${sectionHead(H.beforeH)}${group(H.before.map(t => row({ t, icon: "check", c: "green", top: true })), true)}</section>
    <section class="section">${sectionHead(H.reactH)}${group(H.react.map((r, i) => row({ bullet: ["green", "orange", "red"][i], t: r[0], s: r[1], top: true })))}</section>
    <section class="section">${sectionHead(H.afterH)}${group(H.after.map(t => row({ t, bullet: "teal", top: true })))}</section>`;
  };

  views.tools = () => {
    const H = U.tools;
    return `
    ${title(H.k, H.h, H.p, "pink")}
    <div class="tiles">${[
      ["#/dose", "orange", "gauge", H.dose, "mSv"],
      ["#/mri-safety", "purple", "magnet", H.mri, H.mriS],
      ["#/quiz", "teal", "question", H.quiz, tr(H.quizS, { n: D.quiz.length })],
      ["#/glossary", "cyan", "book", H.gloss, tr(H.glossS, { n: D.glossary.length })]
    ].map(tile).join("")}</div>
    ${group([
      row({ href: "#/safety", icon: "ruler", c: "green", t: H.dist, s: H.distS }),
      row({ href: "#/about", icon: "info", c: "gray", t: H.about })
    ], true)}`;
  };

  views.dose = () => {
    const H = U.dose;
    return `
    ${title(H.k, H.h, H.p, "orange")}
    <div class="result sticky-result" ${C("orange")} aria-live="polite">
      <small>${H.total}</small>
      <div class="big" id="d-total">0 <span>mSv</span></div>
      <div class="stats">
        <div><b class="num" id="d-chest">0</b><span>${H.chest}</span></div>
        <div><b id="d-bg">—</b><span>${H.bg}</span></div>
        <button class="btn sm" type="button" id="d-reset" style="background:rgba(255,255,255,.22);color:#fff;margin-inline-start:auto">${I("refresh", 'width="16" height="16"')}${H.reset}</button>
      </div>
    </div>
    ${group(D.exams.map(x => `<div class="row"><span class="txt"><span class="t">${x.n}</span><span class="s"><span class="num">${fmt(x.m, 3)} mSv</span></span></span>
      <span class="count num" id="c-${x.id}" ${C("orange")}>0</span>
      <span class="stepper"><button type="button" data-step="-1" data-id="${x.id}" aria-label="${tr(H.dec, { t: x.n })}">−</button><button type="button" data-step="1" data-id="${x.id}" aria-label="${tr(H.inc, { t: x.n })}">+</button></span></div>`))}
    <p class="footnote">${H.note}</p>`;
  };
  views.dose.mount = (on) => {
    const counts = { chest: 1, cthead: 1 }; // مثال افتراضي / default example
    const upd = () => {
      const total = D.exams.reduce((s, x) => s + (counts[x.id] || 0) * x.m, 0);
      $("#d-total").innerHTML = `${fmt(total, 3)} <span>mSv</span>`;
      $("#d-chest").textContent = fmt(total / D.chestXray, 0);
      $("#d-bg").textContent = total ? bgPeriod(total) : "—";
      D.exams.forEach(x => $("#c-" + x.id).textContent = counts[x.id] || 0);
    };
    on("click", e => {
      const b = e.target.closest("[data-step]");
      if (b) { const id = b.dataset.id; counts[id] = Math.max(0, Math.min(20, (counts[id] || 0) + Number(b.dataset.step))); upd(); }
      if (e.target.closest("#d-reset")) { Object.keys(counts).forEach(k => counts[k] = 0); upd(); }
    });
    upd();
  };

  views.quiz = () => `${title(U.quiz.k, U.quiz.h, U.quiz.p, "teal")}<div id="quiz" ${C("teal")}></div>`;
  views.quiz.mount = () => {
    const H = U.quiz, box = $("#quiz");
    let i = 0, score = 0;
    const render = () => {
      const N = D.quiz.length;
      if (i >= N) {
        const msg = score === N ? H.perfect : score >= N / 2 ? H.good : H.low;
        box.innerHTML = `<div class="result" ${C("teal")}><small>${H.score}</small><div class="big">${score} <span>/ ${N}</span></div><p>${msg}</p>
          <button class="btn" type="button" id="q-again" style="background:#fff;color:var(--teal)">${I("refresh", 'width="18" height="18"')}${H.again}</button></div>`;
        $("#q-again").addEventListener("click", () => { i = 0; score = 0; render(); });
        return;
      }
      const q = D.quiz[i];
      box.innerHTML = `<div class="quiz-card">
        <div class="row" style="padding:0;min-height:0"><span class="txt"><span class="s">${tr(H.of, { i: `<span class="num">${i + 1}</span>`, n: `<span class="num">${N}</span>` })}</span></span><span class="v">${H.points} <b class="num" style="color:var(--c)">${score}</b></span></div>
        <div class="bar"><span style="width:${(i / N) * 100}%"></span></div>
        <h3>${q.q}</h3>
        <div style="display:grid;gap:10px">${q.o.map((o, k) => `<button class="opt" type="button" data-k="${k}"><span class="k">${H.letters[k]}</span>${o}</button>`).join("")}</div>
        <div id="q-x" hidden></div></div>`;
      $$(".opt", box).forEach(b => b.addEventListener("click", () => {
        const k = Number(b.dataset.k), ok = k === q.a;
        if (ok) score++;
        $$(".opt", box).forEach(x => { x.disabled = true; if (Number(x.dataset.k) === q.a) x.classList.add("right"); });
        if (!ok) b.classList.add("wrong");
        const x = $("#q-x"); x.hidden = false;
        x.innerHTML = callout(ok ? "check" : "info", ok ? "green" : "orange", ok ? H.right : H.wrong, q.x)
          + `<button class="btn block" type="button" id="q-next" style="margin-top:12px">${i + 1 < N ? H.next : H.show}</button>`;
        $("#q-next").addEventListener("click", () => { i++; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
      }));
    };
    render();
  };

  views.glossary = () => {
    const H = U.gloss;
    return `${title(H.k, H.h, H.p, "cyan")}
    <div class="search">${I("search")}<input id="g-q" type="search" placeholder="${H.search}" aria-label="${H.aria}" autocomplete="off"></div>
    <div id="g-list"></div>`;
  };
  views.glossary.mount = () => {
    const H = U.gloss;
    const norm = s => s.toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
    const list = $("#g-list");
    // المصطلح الثانوي: الإنجليزي في العربية، والعربي في الإنجليزية
    const items = D.glossary.map((g, i) => ({ a: g.a, d: g.d, b: LANG === "en" ? RAD_AR.glossary[i].a : g.e, bl: LANG === "en" ? "ar" : "en", key: norm([g.a, g.d, RAD_AR.glossary[i].a, RAD_AR.glossary[i].e].join(" ")) }));
    const upd = () => {
      const q = norm($("#g-q").value.trim());
      const res = items.filter(g => !q || g.key.includes(q));
      list.innerHTML = res.length
        ? group(res.map(g => `<div class="row top"><span class="txt"><span class="t" style="font-weight:700">${g.a} <span lang="${g.bl}" style="color:var(--cyan);font-size:14px;font-weight:600">${g.b}</span></span><span class="s">${g.d}</span></span></div>`))
        : `<p class="footnote" style="text-align:center;padding:24px">${H.empty}</p>`;
    };
    $("#g-q").addEventListener("input", upd); upd();
  };

  views.about = () => {
    const H = U.about;
    const urls = ["https://www.icrp.org", "https://www.iaea.org/resources/rpop", "https://www.who.int/health-topics/radiation-protection", "https://www.radiologyinfo.org", "https://www.acr.org", "https://www.imagegently.org", "https://www.imagewisely.org", "https://www.unscear.org"];
    return `
    ${title(H.k, H.h, H.p, "gray")}
    <div class="group icons">${urls.map((h, i) => `<a class="row" href="${h}" target="_blank" rel="noopener">${ico("link", "blue")}<span class="txt"><span class="t">${H.src[i]}</span><span class="s">${H.srcS[i]}</span></span>${I("chev", 'class="chev"')}</a>`).join("")}</div>
    ${callout("alert", "orange", H.warn[0], H.warn[1])}`;
  };

  function notFound() {
    return `${title(U.nf.k, U.nf.h, U.nf.p, "red")}<a class="btn block" href="#/">${U.nf.btn}</a>`;
  }

  /* ---------- الموجّه / Router ---------- */
  let cleanups = [];
  function route(keepScroll) {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const key = parts[0] || "";
    const view = views[key];
    cleanups.forEach(f => f()); cleanups = [];
    main.innerHTML = `<div class="page">${view ? view(parts[1]) : notFound()}</div>`;
    const on = (type, fn) => { main.addEventListener(type, fn); cleanups.push(() => main.removeEventListener(type, fn)); };
    if (view && view.mount) view.mount(on);

    const parent = key === "modalities" && parts[1] ? "modalities" : PARENT[key];
    $("#nav-start").innerHTML = parent !== undefined
      ? `<a class="back" href="#/${parent}">${I("back")}<span>${parentLabel(parent)}</span></a>`
      : `<a class="brand" href="#/"><i>${I("scan")}</i><span>${U.appName}</span></a>`;
    const h1 = $("h1", main);
    $("#nav-title").textContent = h1 ? h1.textContent : "";

    const sec = parent !== undefined ? parent : key;
    $$("#tabbar a").forEach(a => a.dataset.r === sec ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    document.title = (h1 && key ? h1.textContent + " · " : "") + U.docTitle;
    if (keepScroll !== true) window.scrollTo(0, 0);
    onScroll();
  }
  window.addEventListener("hashchange", () => route());
  setLang(LANG);
  route();
})();
