/* منصة الأشعة — تطبيق صفحة واحدة (SPA) بنمط iOS
   التوجيه بالرابط بعد علامة # مثل: #/modalities/ct */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const main = $("#main");
  const I = window.ICON;
  const IMG = (id) => `assets/img/${id}.svg`;
  const fmt = (n, d = 2) => Number(n).toLocaleString("en-US", { maximumFractionDigits: d });
  const C = (c) => `style="--c:var(--${c})"`;

  /* ---------- ألوان الأقسام والأنواع ---------- */
  const SEC = {
    home: "blue", history: "orange", modalities: "indigo", safety: "green", "mri-safety": "purple",
    contrast: "teal", tools: "pink", dose: "orange", quiz: "teal", glossary: "cyan", about: "gray"
  };
  const MOD = {
    xray: ["blue", "bone"], ct: ["indigo", "ring"], mri: ["purple", "magnet"], ultrasound: ["teal", "waves"],
    mammography: ["pink", "circle"], fluoroscopy: ["orange", "video"], nuclear: ["green", "atom"],
    interventional: ["red", "needle"], dexa: ["cyan", "ruler"]
  };
  const CATS = { discovery: "اكتشافات", device: "أجهزة", safety: "سلامة", nobel: "نوبل" };
  const CAT1 = { discovery: "اكتشاف", device: "جهاز وتقنية", safety: "سلامة إشعاعية", nobel: "جائزة نوبل" };

  /* ---------- شريط التبويب ---------- */
  const TABS = [
    { r: "", t: "الرئيسية", i: "home", c: "blue" },
    { r: "history", t: "التاريخ", i: "clock", c: "orange" },
    { r: "modalities", t: "الأنواع", i: "scan", c: "indigo" },
    { r: "safety", t: "الوقاية", i: "shield", c: "green" },
    { r: "tools", t: "الأدوات", i: "grid", c: "pink" }
  ];
  const PARENT = { "mri-safety": ["safety", "الوقاية"], contrast: ["safety", "الوقاية"], dose: ["tools", "الأدوات"], quiz: ["tools", "الأدوات"], glossary: ["tools", "الأدوات"], about: ["", "الرئيسية"] };
  $("#tabbar").innerHTML = TABS.map(t => `<a href="#/${t.r}" data-r="${t.r}" ${C(t.c)}>${I(t.i)}<span>${t.t}</span></a>`).join("");

  /* ---------- المظهر ---------- */
  const isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  };
  const paintThemeBtn = () => { $("#theme-btn").innerHTML = I(isDark() ? "sun" : "moon"); };
  $("#theme-btn").addEventListener("click", () => {
    document.documentElement.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("theme", document.documentElement.dataset.theme); } catch (e) {}
    paintThemeBtn();
  });
  paintThemeBtn();

  /* ---------- شريط التنقل يتغيّر عند التمرير ---------- */
  const navbar = $("#navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 36);
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- مكوّنات ---------- */
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
  const hero = (id, cap) => `<figure class="hero-media" style="margin:0"><img src="${IMG(id)}" alt="${cap}" loading="lazy"><figcaption>رسم توضيحي · ${cap}</figcaption></figure>`;
  const meter = (lvl) => `<span class="meter">${[1, 2, 3, 4].map(i => `<i class="${i <= lvl ? "on" : ""}"></i>`).join("")}</span>`;
  const doseBadge = (lvl) => `<span class="badge lvl-${lvl}">${meter(lvl)}${RAD.doseLabels[lvl]}</span>`;
  const callout = (icon, c, h, p) => `<div class="callout" ${C(c)}>${ico(icon, c)}<div><b>${h}</b><p>${p}</p></div></div>`;
  const yearsSince = () => new Date().getFullYear() - 1895;
  function bgPeriod(m) {
    const days = m / RAD.background * 365;
    if (days < 1) return `${fmt(days * 24, 0)} ساعة`;
    if (days < 60) return `${fmt(days, 0)} يومًا`;
    if (days < 730) return `${fmt(days / 30, 0)} شهرًا`;
    return `${fmt(days / 365, 1)} سنة`;
  }

  /* ---------- الصفحات ---------- */
  const views = {};

  views[""] = () => {
    const fact = RAD.facts[Math.floor(Math.random() * RAD.facts.length)];
    const nEvents = RAD.history.reduce((n, e) => n + e.items.length, 0);
    return `
    ${title("مرجع عربي مفتوح في تخصص الأشعة", "منصة الأشعة", "تعرّف على الأشعة وأنواعها، وكيف تستعد لكل فحص، وكيف تحمي نفسك من الإشعاع وفق التوصيات العالمية.", "blue")}

    <a class="feature" href="#/history" ${C("blue")}>
      <img src="${IMG("hero")}" alt="">
      <div class="cap"><small>ابدأ من هنا</small><h2><span class="num">${yearsSince()}</span> عامًا من الأشعة</h2><p>من اكتشاف رونتجن في 1895 إلى الذكاء الاصطناعي، في ${nEvents} محطة.</p></div>
    </a>

    <section class="section">
      ${sectionHead("استكشف")}
      <div class="tiles">
        ${[
          ["#/history", "orange", "clock", "تاريخ الأشعة", `${nEvents} محطة`],
          ["#/modalities", "indigo", "scan", "أنواع الأشعة", `${RAD.modalities.length} أنواع`],
          ["#/safety", "green", "shield", "الوقاية من الإشعاع", "ICRP · IAEA · WHO"],
          ["#/mri-safety", "purple", "magnet", "سلامة الرنين", "قائمة فحص"],
          ["#/dose", "pink", "gauge", "حاسبة الجرعة", "قارن فحوصاتك"],
          ["#/quiz", "teal", "question", "اختبر معلوماتك", `${RAD.quiz.length} أسئلة`]
        ].map(([h, c, i, t, s]) => `<a class="tile" href="${h}" ${C(c)}><span class="ti">${I(i)}</span><span><b>${t}</b><span>${s}</span></span></a>`).join("")}
      </div>
    </section>

    <div class="fact" ${C("yellow")}>${ico("lightbulb", "yellow")}<div><b>هل تعلم؟</b><p>${fact}</p></div></div>

    <section class="section">
      ${sectionHead("أنواع الأشعة", `<a href="#/modalities">عرض الكل</a>`)}
      ${group(RAD.modalities.map(m => row({ href: `#/modalities/${m.id}`, icon: MOD[m.id][1], c: MOD[m.id][0], t: m.name, s: RAD.doseLabels[m.dose] })), true)}
    </section>

    <section class="section">
      ${group([
        row({ href: "#/glossary", icon: "book", c: "cyan", t: "قاموس المصطلحات", s: `${RAD.glossary.length} مصطلحًا بالعربية والإنجليزية` }),
        row({ href: "#/contrast", icon: "drop", c: "teal", t: "الصبغات", s: "أنواعها والتحضير لها" }),
        row({ href: "#/about", icon: "info", c: "gray", t: "المصادر وعن المنصة" })
      ], true)}
    </section>`;
  };

  /* ---- التاريخ ---- */
  views.history = () => {
    let n = 0;
    return `
    ${title("البداية", "تاريخ الأشعة", "من صورة يدٍ في مختبر ألماني إلى أجهزة تقرأ الصور بالذكاء الاصطناعي. اضغط على أي محطة لقراءة التفاصيل.", "orange")}
    <div class="segmented" role="group" aria-label="تصفية المحطات" ${C("orange")}>
      <button type="button" data-f="all" aria-pressed="true">الكل</button>
      ${Object.entries(CATS).map(([k, v]) => `<button type="button" data-f="${k}" aria-pressed="false">${v}</button>`).join("")}
    </div>
    ${RAD.history.map(era => `
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
              <span class="badge">${CAT1[it.c]}</span>
              <p>${it.d}</p>
              <img src="${IMG(it.img)}" alt="رسم توضيحي: ${it.t}" loading="lazy">
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

  /* ---- أنواع الأشعة ---- */
  views.modalities = (id) => {
    if (id) return modalityDetail(id);
    return `
    ${title("أنواع الأشعة", "اختر نوع الفحص", "لكل فحص طريقة عمل وتحضير مختلف. الشارة توضّح مستوى الإشعاع المؤيّن تقريبًا.", "indigo")}
    <div class="mod-grid">${RAD.modalities.map(m => `
      <a class="mod" href="#/modalities/${m.id}" ${C(MOD[m.id][0])}>
        <div class="media"><img src="${IMG("m-" + m.id)}" alt="" loading="lazy">${ico(MOD[m.id][1], MOD[m.id][0], true)}</div>
        <div class="body"><h3>${m.name}</h3><span class="en">${m.en}</span><p>${m.short}</p>${doseBadge(m.dose)}</div>
      </a>`).join("")}
    </div>`;
  };
  function modalityDetail(id) {
    const i = RAD.modalities.findIndex(m => m.id === id);
    if (i < 0) return notFound();
    const m = RAD.modalities[i], [c] = MOD[m.id];
    const prev = RAD.modalities[(i - 1 + RAD.modalities.length) % RAD.modalities.length];
    const next = RAD.modalities[(i + 1) % RAD.modalities.length];
    const bullets = (arr, bc) => group(arr.map(x => row({ t: x, bullet: bc, top: true })));
    return `
    ${title(`<span class="num">${m.en}</span>`, m.name, m.short, c)}
    ${hero("m-" + m.id, m.name)}
    <div class="widgets">
      <div class="widget lvl-${m.dose}"><span class="wl"><i></i>الإشعاع</span><span class="wv">${meter(m.dose)}</span><span class="s" style="font-size:12px;color:var(--label-2)">${RAD.doseLabels[m.dose]}</span></div>
      <div class="widget" ${C(c)}><span class="wl"><i></i>المدة</span><span class="wv">${m.duration}</span></div>
      <div class="widget" ${C(m.dose ? "orange" : "green")}><span class="wl"><i></i>إشعاع مؤيّن</span><span class="wv">${m.dose ? "نعم" : "لا"}</span></div>
    </div>
    <section class="section">${sectionHead("كيف يعمل؟")}<div class="prose-card"><p>${m.how}</p></div></section>
    <section class="section">${sectionHead("متى يُطلب؟")}${bullets(m.uses, c)}</section>
    <section class="section">${sectionHead("التحضير للفحص")}${group(m.prep.map(x => row({ t: x, icon: "check", c: "green", top: true })), true)}</section>
    <section class="section">${sectionHead("أثناء الفحص")}<div class="prose-card"><p>${m.during}</p></div></section>
    <section class="section">${sectionHead("المخاطر والسلامة")}${bullets(m.risks, "orange")}</section>
    ${callout("lightbulb", "yellow", "معلومة مفيدة", m.tip)}
    ${m.link ? `<a class="btn tinted block" href="${m.link.href}" ${C("purple")}>${I("magnet", 'width="20" height="20"')}${m.link.text}</a>` : ""}
    <nav class="pager" aria-label="التنقل بين الأنواع">
      <a href="#/modalities/${prev.id}" ${C(MOD[prev.id][0])}><small>السابق</small><b>${prev.name}</b></a>
      <a href="#/modalities/${next.id}" ${C(MOD[next.id][0])}><small>التالي</small><b>${next.name}</b></a>
    </nav>`;
  }

  /* ---- الوقاية ---- */
  views.safety = () => `
    ${title("الوقاية من الإشعاع", "كيف نحمي أنفسنا؟", "مبادئ مبنية على توصيات اللجنة الدولية للوقاية من الإشعاع (ICRP) والوكالة الدولية للطاقة الذرية (IAEA) ومنظمة الصحة العالمية.", "green")}

    <section class="section">${sectionHead("مؤيّن وغير مؤيّن")}
      ${group([
        row({ icon: "radiation", c: "orange", t: "الإشعاع المؤيّن", s: "الأشعة السينية والمقطعية والتلفزيونية والطب النووي. طاقته كافية لإحداث تغيير في ذرات الخلايا.", top: true }),
        row({ icon: "waves", c: "green", t: "غير المؤيّن", s: "المغناطيس وموجات الراديو في الرنين، والموجات الصوتية في السونار. لا يحمل هذا النوع من الخطر.", top: true })
      ], true)}
      <p class="footnote">الجرعات التشخيصية منخفضة والخطر منها صغير جدًا مقارنة بفائدة التشخيص، لكنها تتراكم، لذلك نطبّق مبادئ الوقاية دائمًا.</p>
    </section>

    <section class="section">${sectionHead("المبادئ الثلاثة")}
      ${group([
        row({ icon: "check", c: "blue", t: "التبرير", s: "لا يُجرى الفحص إلا إذا كانت فائدته أكبر من خطره، ولا يوجد بديل مناسب بلا إشعاع.", top: true }),
        row({ icon: "gauge", c: "indigo", t: "التحسين (ALARA)", s: "أقل جرعة ممكنة تعطي صورة كافية للتشخيص.", top: true }),
        row({ icon: "shield", c: "green", t: "حدود الجرعة", s: "حدود سنوية للعاملين وعامة الناس، ولا تنطبق على المريض لأن الفحص لمصلحته.", top: true })
      ], true)}
    </section>

    <section class="section">${sectionHead("الزمن والمسافة والحاجز")}
      ${hero("s-tds", "الزمن والمسافة والحاجز")}
      ${group([
        row({ icon: "timer", c: "orange", t: "الزمن", s: "كلما قلّ وقت التعرض قلّت الجرعة.", top: true }),
        row({ icon: "ruler", c: "blue", t: "المسافة", s: "أقوى وسيلة حماية: الجرعة تقل بمربع المسافة.", top: true }),
        row({ icon: "shield", c: "green", t: "الحاجز", s: "الجدران الرصاصية، والنوافذ، والمرايل والواقيات.", top: true })
      ], true)}
      <div class="card card-pad" ${C("blue")}>
        <b>جرّب بنفسك</b>
        <div class="people" aria-hidden="true"><span class="src"></span><span class="p" id="dist-p" ${C("red")}></span></div>
        <label for="dist" class="s" style="color:var(--label-2);font-size:14px">حرّك المؤشر لتغيير المسافة عن مصدر الأشعة</label>
        <input class="slider" type="range" id="dist" min="0.5" max="4" step="0.5" value="1" ${C("blue")}>
        <div class="row" style="padding:0;min-height:0"><span class="txt"><span class="t">المسافة <b class="num" id="dist-m">1</b> م</span></span><span class="v">الجرعة <b class="num" id="dist-v" style="color:var(--c)">100%</b></span></div>
        <div class="bar"><span id="dist-bar" style="width:100%"></span></div>
      </div>
    </section>

    <section class="section">${sectionHead("مقارنة الجرعات", `<a href="#/dose">احسب جرعتك</a>`)}
      ${group(RAD.exams.map(x => row({ t: x.n, s: `يعادل إشعاعًا طبيعيًا لمدة ${bgPeriod(x.m)} تقريبًا`, v: `<span class="num">${fmt(x.m, 3)} mSv</span>` })))}
      <p class="footnote">قيم تقريبية لبالغ متوسط، والجرعة الفعلية تختلف حسب الجهاز والمريض. متوسط الإشعاع الطبيعي العالمي <span class="num">${RAD.background}</span> mSv سنويًا.</p>
    </section>

    <section class="section">${sectionHead("حدود الجرعات السنوية")}
      ${group(RAD.limits.map(l => row({ t: l.who, s: l.note, v: `<span class="num">${l.v}</span>`, top: true })))}
      <p class="footnote">حسب توصيات ICRP (المنشور 103 وبيان 2011 لعدسة العين). قد تختلف الأنظمة المحلية.</p>
    </section>

    <section class="section">${sectionHead("الحمل والأطفال")}
      ${callout("person", "orange", "الحمل", "أبلغي الفني أو الطبيب دائمًا إذا كان هناك احتمال حمل. أغلب الفحوصات خارج منطقة البطن جرعتها على الجنين ضئيلة جدًا. لفحوصات البطن قد يُختار بديل بلا إشعاع، أو تُعدَّل الإعدادات، أو يؤجَّل الفحص غير العاجل.")}
      ${hero("s-pregnancy", "الحمل وفحوصات الأشعة")}
      ${callout("baby", "cyan", "الأطفال", "الأطفال أكثر حساسية للإشعاع، لذلك تُستخدم إعدادات مخصصة لحجم الطفل، ويُفضَّل السونار والرنين متى أمكن، حسب حملة Image Gently.")}
    </section>

    <section class="section">${sectionHead("حماية العاملين")}
      ${hero("s-staff", "أدوات حماية العاملين")}
      ${group([
        "ارتداء مقياس الجرعة الشخصي طوال العمل، في المكان المحدد حسب سياسة القسم.",
        "المريلة الرصاصية وواقي الغدة الدرقية والنظارات الرصاصية في الأشعة التلفزيونية والتداخلية.",
        "الوقوف خلف الحاجز الواقي أثناء التصوير، والابتعاد قدر الإمكان عن المريض والأنبوب.",
        "عدم إمساك المريض أثناء التصوير. إن لزم، يُمسكه مرافق يرتدي واقيًا وليس حاملًا.",
        "فحص الواقيات الرصاصية دوريًا للتأكد من عدم وجود تشققات.",
        "للعاملات الحوامل: الإبلاغ المبكر يتيح ترتيب العمل ومراقبة جرعة الجنين."
      ].map(t => row({ t, bullet: "green", top: true })))}
    </section>

    <section class="section">${sectionHead("خرافات وحقائق")}
      ${group(RAD.myths.map(x => row({ icon: "alert", c: "red", t: x.m, s: `<b style="color:var(--green)">الحقيقة:</b> ${x.f}`, top: true })), true)}
    </section>

    <section class="section">${sectionHead("اقرأ أيضًا")}
      ${group([
        row({ href: "#/mri-safety", icon: "magnet", c: "purple", t: "سلامة الرنين المغناطيسي", s: "مخاطر مختلفة تمامًا عن الإشعاع" }),
        row({ href: "#/contrast", icon: "drop", c: "teal", t: "الصبغات", s: "أنواعها والتفاعلات المحتملة" })
      ], true)}
    </section>`;
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

  /* ---- سلامة الرنين ---- */
  const ZC = ["green", "blue", "orange", "red"];
  const SEV = { high: "red", mid: "orange", low: "blue" };
  views["mri-safety"] = () => `
    ${title("الوقاية · الرنين المغناطيسي", "سلامة الرنين", "لا إشعاع في الرنين، لكن المغناطيس القوي يعمل دائمًا ويجذب المعادن بقوة هائلة، لذلك له قواعد سلامة خاصة.", "purple")}
    ${hero("s-mri-zones", "مناطق الأمان في قسم الرنين")}
    <section class="section">${sectionHead("مناطق الأمان الأربع")}
      ${group(RAD.mriZones.map((z, i) => `<div class="row top"><span class="ico" ${C(ZC[i])}><b class="num" style="font-size:16px">${i + 1}</b></span><span class="txt"><span class="t">${z.t}</span><span class="s">${z.d}</span></span></div>`), true)}
    </section>
    <section class="section">${sectionHead("علامات تصنيف الأجهزة")}
      ${group(RAD.mriLabels.map(l => row({ icon: l.cls === "none" ? "check" : l.cls === "mid" ? "alert" : "bolt", c: l.cls === "none" ? "green" : l.cls === "mid" ? "yellow" : "red", t: `${l.a} <span class="num" style="color:var(--label-2);font-size:14px">${l.k}</span>`, s: l.d, top: true })), true)}
    </section>
    <section class="section">${sectionHead("قائمة فحص قبل الرنين")}
      <div class="group-label">فعّل ما ينطبق عليك. القائمة للتوعية فقط، واستبيان القسم هو المرجع.</div>
      ${group(RAD.mriChecks.map(c => `<label class="row" for="mc-${c.id}"><span class="bullet" ${C(SEV[c.sev])}></span><span class="txt"><span class="t">${c.t}</span><span class="s">${c.s}</span></span>
        <span class="switch" ${C("purple")}><input type="checkbox" id="mc-${c.id}" data-sev="${c.sev}"><span></span></span></label>`))}
      <div id="mri-res" aria-live="polite"></div>
    </section>`;
  views["mri-safety"].mount = () => {
    const res = $("#mri-res");
    const upd = () => {
      const on = $$(".switch input:checked");
      const high = on.filter(x => x.dataset.sev === "high").length;
      res.innerHTML = !on.length
        ? callout("check", "green", "لم تحدد أي بند", "احرص مع ذلك على تعبئة استبيان السلامة وإزالة كل المعادن قبل الدخول.")
        : high
          ? callout("alert", "red", `حددت ${on.length} بنود، منها ${high} مهمة جدًا`, "أبلغ فريق الرنين قبل موعدك بوقت كافٍ، وأحضر بطاقة الجهاز المزروع أو تقريره إن وجد.")
          : callout("info", "orange", `حددت ${on.length} بنود`, "أخبر الفني بها عند الوصول ليتخذ الإجراء المناسب.");
    };
    $$(".switch input").forEach(x => x.addEventListener("change", upd)); upd();
  };

  /* ---- الصبغات ---- */
  views.contrast = () => `
    ${title("الوقاية · الصبغات", "الصبغات في الأشعة", "مواد تُعطى للمريض لتوضيح الأوعية والأعضاء. آمنة في أغلب الحالات، لكنها تحتاج تقييمًا مسبقًا.", "teal")}
    ${hero("s-contrast", "حقن الصبغة قبل الفحص")}
    <section class="section">${sectionHead("أنواع الصبغات")}
      ${group(RAD.contrast.map((c, i) => row({ icon: "drop", c: ["blue", "purple", "gray", "teal"][i], t: c.t, s: `${c.u}. ${c.n}`, top: true })), true)}
    </section>
    <section class="section">${sectionHead("قبل الفحص")}
      ${group(["أخبر الفريق عن أي حساسية سابقة من الصبغة، أو ربو، أو أمراض الكلى.", "قد يُطلب تحليل لوظائف الكلى، خاصة لكبار السن ومرضى السكري والضغط.", "اتبع تعليمات طبيبك بخصوص أدويتك، ولا توقف أي دواء من تلقاء نفسك.", "الصيام حسب تعليمات القسم."].map(t => row({ t, icon: "check", c: "green", top: true })), true)}
    </section>
    <section class="section">${sectionHead("التفاعلات المحتملة")}
      ${group([
        row({ bullet: "green", t: "خفيفة، وهي الأشيع", s: "إحساس بالدفء، طعم معدني، غثيان، أو حكة بسيطة.", top: true }),
        row({ bullet: "orange", t: "متوسطة", s: "طفح جلدي واسع أو تورم، وتُعالج في القسم.", top: true }),
        row({ bullet: "red", t: "شديدة ونادرة جدًا", s: "صعوبة في التنفس أو هبوط الضغط، والقسم مجهّز للتعامل معها فورًا.", top: true })
      ])}
    </section>
    <section class="section">${sectionHead("بعد الفحص")}
      ${group(["اشرب كمية كافية من الماء ما لم يمنعك الطبيب.", "راقب موضع الحقن، وراجع القسم إذا ظهر تورم أو ألم متزايد.", "الرضاعة الطبيعية يمكن عادة استمرارها، ويمكن مناقشة الأمر مع الطبيب."].map(t => row({ t, bullet: "teal", top: true })))}
    </section>`;

  /* ---- الأدوات ---- */
  views.tools = () => `
    ${title("الأدوات", "أدوات تفاعلية", "أدوات بسيطة تساعدك على فهم الأشعة والاستعداد لها.", "pink")}
    <div class="tiles">
      ${[
        ["#/dose", "orange", "gauge", "حاسبة الجرعة", "mSv"],
        ["#/mri-safety", "purple", "magnet", "جاهز للرنين؟", "قائمة فحص"],
        ["#/quiz", "teal", "question", "اختبر معلوماتك", `${RAD.quiz.length} أسئلة`],
        ["#/glossary", "cyan", "book", "المصطلحات", `${RAD.glossary.length} مصطلحًا`]
      ].map(([h, c, i, t, s]) => `<a class="tile" href="${h}" ${C(c)}><span class="ti">${I(i)}</span><span><b>${t}</b><span>${s}</span></span></a>`).join("")}
    </div>
    ${group([
      row({ href: "#/safety", icon: "ruler", c: "green", t: "محاكي المسافة", s: "في صفحة الوقاية" }),
      row({ href: "#/about", icon: "info", c: "gray", t: "المصادر وعن المنصة" })
    ], true)}`;

  /* ---- حاسبة الجرعة ---- */
  views.dose = () => `
    ${title("الأدوات", "حاسبة الجرعة", "اختر الفحوصات وعدد مرات كل منها لترى الجرعة التقريبية وما يعادلها.", "orange")}
    <div class="result sticky-result" ${C("orange")} aria-live="polite">
      <small>المجموع التقريبي</small>
      <div class="big" id="d-total">0 <span>mSv</span></div>
      <div class="stats">
        <div><b class="num" id="d-chest">0</b><span>صورة صدر</span></div>
        <div><b id="d-bg">—</b><span>من الإشعاع الطبيعي</span></div>
        <button class="btn sm" type="button" id="d-reset" style="background:rgba(255,255,255,.22);color:#fff;margin-inline-start:auto">${I("refresh", 'width="16" height="16"')}تصفير</button>
      </div>
    </div>
    ${group(RAD.exams.map(x => `<div class="row"><span class="txt"><span class="t">${x.n}</span><span class="s num" style="text-align:right">${fmt(x.m, 3)} mSv</span></span>
      <span class="count num" id="c-${x.id}" ${C("orange")}>0</span>
      <span class="stepper"><button type="button" data-step="-1" data-id="${x.id}" aria-label="إنقاص ${x.n}">−</button><button type="button" data-step="1" data-id="${x.id}" aria-label="زيادة ${x.n}">+</button></span></div>`))}
    <p class="footnote">قيم تقريبية للتوعية ولا تُستخدم لأي قرار طبي. الفائدة من الفحص المبرَّر أكبر بكثير من خطره.</p>`;
  views.dose.mount = (on) => {
    const counts = { chest: 1, cthead: 1 }; // مثال افتراضي
    const upd = () => {
      const total = RAD.exams.reduce((s, x) => s + (counts[x.id] || 0) * x.m, 0);
      $("#d-total").innerHTML = `${fmt(total, 3)} <span>mSv</span>`;
      $("#d-chest").textContent = fmt(total / RAD.chestXray, 0);
      $("#d-bg").textContent = total ? bgPeriod(total) : "—";
      RAD.exams.forEach(x => $("#c-" + x.id).textContent = counts[x.id] || 0);
    };
    on("click", e => {
      const b = e.target.closest("[data-step]");
      if (b) { const id = b.dataset.id; counts[id] = Math.max(0, Math.min(20, (counts[id] || 0) + Number(b.dataset.step))); upd(); }
      if (e.target.closest("#d-reset")) { Object.keys(counts).forEach(k => counts[k] = 0); upd(); }
    });
    upd();
  };

  /* ---- الاختبار ---- */
  views.quiz = () => `
    ${title("الأدوات", "اختبر معلوماتك", "اختر الإجابة الصحيحة، وستظهر لك نبذة توضيحية بعد كل سؤال.", "teal")}
    <div id="quiz" ${C("teal")}></div>`;
  views.quiz.mount = () => {
    const box = $("#quiz");
    const L = ["أ", "ب", "ج", "د"];
    let i = 0, score = 0;
    const render = () => {
      if (i >= RAD.quiz.length) {
        const msg = score === RAD.quiz.length ? "ممتاز! إجاباتك كلها صحيحة." : score >= RAD.quiz.length / 2 ? "نتيجة جيدة. راجع قسم الوقاية لتكمل الصورة." : "لا بأس، تصفّح المنصة ثم أعد المحاولة.";
        box.innerHTML = `<div class="result" ${C("teal")}><small>نتيجتك</small><div class="big">${score} <span>/ ${RAD.quiz.length}</span></div><p>${msg}</p>
          <button class="btn" type="button" id="q-again" style="background:#fff;color:var(--teal)">${I("refresh", 'width="18" height="18"')}أعد الاختبار</button></div>`;
        $("#q-again").addEventListener("click", () => { i = 0; score = 0; render(); });
        return;
      }
      const q = RAD.quiz[i];
      box.innerHTML = `<div class="quiz-card">
        <div class="row" style="padding:0;min-height:0"><span class="txt"><span class="s">سؤال <span class="num">${i + 1}</span> من <span class="num">${RAD.quiz.length}</span></span></span><span class="v">النقاط <b class="num" style="color:var(--c)">${score}</b></span></div>
        <div class="bar"><span style="width:${(i / RAD.quiz.length) * 100}%"></span></div>
        <h3>${q.q}</h3>
        <div style="display:grid;gap:10px">${q.o.map((o, k) => `<button class="opt" type="button" data-k="${k}"><span class="k">${L[k]}</span>${o}</button>`).join("")}</div>
        <div id="q-x" hidden></div></div>`;
      $$(".opt", box).forEach(b => b.addEventListener("click", () => {
        const k = Number(b.dataset.k), ok = k === q.a;
        if (ok) score++;
        $$(".opt", box).forEach(x => { x.disabled = true; if (Number(x.dataset.k) === q.a) x.classList.add("right"); });
        if (!ok) b.classList.add("wrong");
        const x = $("#q-x"); x.hidden = false;
        x.innerHTML = callout(ok ? "check" : "info", ok ? "green" : "orange", ok ? "إجابة صحيحة" : "إجابة غير صحيحة", q.x)
          + `<button class="btn block" type="button" id="q-next" style="margin-top:12px">${i + 1 < RAD.quiz.length ? "السؤال التالي" : "عرض النتيجة"}</button>`;
        $("#q-next").addEventListener("click", () => { i++; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
      }));
    };
    render();
  };

  /* ---- المصطلحات ---- */
  views.glossary = () => `
    ${title("الأدوات", "المصطلحات", "مصطلحات الأشعة بالعربية والإنجليزية.", "cyan")}
    <div class="search">${I("search")}<input id="g-q" type="search" placeholder="بحث" aria-label="ابحث في المصطلحات" autocomplete="off"></div>
    <div id="g-list"></div>`;
  views.glossary.mount = () => {
    const norm = s => s.toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
    const list = $("#g-list");
    const upd = () => {
      const q = norm($("#g-q").value.trim());
      const items = RAD.glossary.filter(g => !q || norm(g.a + " " + g.e + " " + g.d).includes(q));
      list.innerHTML = items.length
        ? group(items.map(g => `<div class="row top"><span class="txt"><span class="t" style="font-weight:700">${g.a} <span class="num" style="color:var(--cyan);font-size:14px;font-weight:600">${g.e}</span></span><span class="s">${g.d}</span></span></div>`))
        : `<p class="footnote" style="text-align:center;padding:24px">لا توجد نتائج. جرّب كلمة أخرى.</p>`;
    };
    $("#g-q").addEventListener("input", upd); upd();
  };

  /* ---- عن المنصة ---- */
  views.about = () => {
    const src = [
      ["https://www.icrp.org", "اللجنة الدولية للوقاية من الإشعاع", "ICRP"],
      ["https://www.iaea.org/resources/rpop", "الوكالة الدولية للطاقة الذرية", "IAEA · حماية المرضى"],
      ["https://www.who.int/health-topics/radiation-protection", "منظمة الصحة العالمية", "WHO"],
      ["https://www.radiologyinfo.org", "RadiologyInfo", "ACR · RSNA"],
      ["https://www.acr.org", "الكلية الأمريكية للأشعة", "ACR"],
      ["https://www.imagegently.org", "Image Gently", "تصوير الأطفال"],
      ["https://www.imagewisely.org", "Image Wisely", "تصوير البالغين"],
      ["https://www.unscear.org", "لجنة الأمم المتحدة العلمية لآثار الإشعاع", "UNSCEAR"]
    ];
    return `
    ${title("عن المنصة", "المصادر", "يُكتب المحتوى بالاعتماد على توصيات الجهات الدولية التالية، ويُراجَع من مختصين قبل النشر النهائي.", "gray")}
    <div class="group icons">${src.map(([h, t, s]) => `<a class="row" href="${h}" target="_blank" rel="noopener">${ico("link", "blue")}<span class="txt"><span class="t">${t}</span><span class="s num" style="text-align:right">${s}</span></span>${I("chev", 'class="chev"')}</a>`).join("")}</div>
    ${callout("alert", "orange", "تنبيه", "المحتوى للتثقيف فقط ولا يغني عن استشارة الطبيب أو أخصائي الأشعة. الرسوم التوضيحية أصلية ومرسومة خصيصًا للمنصة.")}`;
  };

  function notFound() {
    return `${title("خطأ", "الصفحة غير موجودة", "الرابط غير صحيح أو أن الصفحة نُقلت.", "red")}<a class="btn block" href="#/">العودة للرئيسية</a>`;
  }

  /* ---------- الموجّه ---------- */
  let cleanups = [];
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const key = parts[0] || "";
    const view = views[key];
    cleanups.forEach(f => f()); cleanups = [];
    main.innerHTML = `<div class="page">${view ? view(parts[1]) : notFound()}</div>`;
    const on = (type, fn) => { main.addEventListener(type, fn); cleanups.push(() => main.removeEventListener(type, fn)); };
    if (view && view.mount) view.mount(on);

    // شريط التنقل: زر الرجوع أو الشعار
    const isDetail = key === "modalities" && parts[1];
    const parent = isDetail ? ["modalities", "الأنواع"] : PARENT[key];
    $("#nav-start").innerHTML = parent
      ? `<a class="back" href="#/${parent[0]}">${I("back")}<span>${parent[1]}</span></a>`
      : `<a class="brand" href="#/"><i>${I("scan")}</i><span>منصة الأشعة</span></a>`;
    const h1 = $("h1", main);
    $("#nav-title").textContent = h1 ? h1.textContent : "";

    // التبويب النشط
    const sec = parent ? parent[0] : key;
    $$("#tabbar a").forEach(a => a.dataset.r === sec ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));

    document.title = (h1 && key ? h1.textContent + " · " : "") + "منصة الأشعة التثقيفية";
    window.scrollTo(0, 0); onScroll();
  }
  window.addEventListener("hashchange", route);
  route();
})();
