/* منصة الأشعة — تطبيق صفحة واحدة (SPA)
   التوجيه بالرابط بعد علامة # مثل: #/modalities/ct */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const main = $("#main");
  const IMG = (id) => `assets/img/${id}.svg`;
  const TAGS = { discovery: "اكتشاف", device: "جهاز وتقنية", safety: "سلامة إشعاعية", nobel: "جائزة نوبل" };
  const SRC = { hist: "رسم توضيحي", ai: "رسم توضيحي" };
  const fmt = (n, d = 2) => Number(n).toLocaleString("en-US", { maximumFractionDigits: d });

  /* ---------- التنقل ---------- */
  const ICONS = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    history: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    modalities: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3M7 9h4M7 13h7"/>',
    safety: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    tools: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'
  };
  const NAV = [
    { r: "", t: "الرئيسية", i: "home" },
    { r: "history", t: "التاريخ", i: "history" },
    { r: "modalities", t: "أنواع الأشعة", i: "modalities" },
    { r: "safety", t: "الوقاية", i: "safety" },
    { r: "tools", t: "الأدوات", i: "tools" }
  ];
  const SECTION_OF = { "mri-safety": "safety", contrast: "safety", dose: "tools", quiz: "tools", glossary: "tools", about: "" };
  $("#nav").innerHTML = NAV.map(n =>
    `<a href="#/${n.r}" data-r="${n.r}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n.i]}</svg><span>${n.t}</span></a>`
  ).join("");

  /* ---------- المظهر ---------- */
  $("#theme-btn").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });

  /* ---------- أدوات مشتركة ---------- */
  const figure = (id, caption, src) =>
    `<figure class="figure"><img src="${IMG(id)}" alt="${caption}" loading="lazy"><figcaption>${caption}${src ? " · " + SRC[src] : ""}</figcaption></figure>`;
  const meter = (lvl) => `<span class="dose-meter" aria-hidden="true">${[1, 2, 3, 4].map(i => `<i class="${i <= lvl ? "on" : ""}"></i>`).join("")}</span>`;
  const dosePill = (lvl) => `<span class="pill ${RAD.doseClass[lvl]}">${meter(lvl)}${RAD.doseLabels[lvl]}</span>`;
  const head = (eyebrow, title, lede, crumbs) =>
    `<div class="page-head">${crumbs ? `<div class="crumbs">${crumbs}</div>` : ""}<p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${lede ? `<p class="lede">${lede}</p>` : ""}</div>`;
  const yearsSince = () => new Date().getFullYear() - 1895;

  /* ---------- الصفحات ---------- */
  const views = {};

  views[""] = () => {
    const fact = RAD.facts[Math.floor(Math.random() * RAD.facts.length)];
    return `
    <section class="hero">
      <div class="page-head">
        <p class="eyebrow">مرجع عربي مفتوح في تخصص الأشعة</p>
        <h1>كل ما تحتاج معرفته عن الأشعة، بلغة واضحة</h1>
        <p class="lede">تعرّف على تاريخ الأشعة وأنواعها وكيف تستعد لكل فحص، وكيف تحمي نفسك ومن حولك من الإشعاع وفق التوصيات العالمية.</p>
        <div class="since"><b>${yearsSince()}</b><span>عامًا منذ اكتشاف الأشعة السينية في 8 نوفمبر 1895</span></div>
        <div class="actions"><a class="btn primary" href="#/history">ابدأ من التاريخ</a><a class="btn" href="#/modalities">تصفّح أنواع الأشعة</a></div>
      </div>
      ${figure("hero", "قسم أشعة حديث", "ai")}
    </section>

    <section>
      <h2 class="section-title">أقسام المنصة</h2>
      <div class="grid">
        <a class="tile" href="#/history"><span class="k">1895 ← اليوم</span><h3>تاريخ الأشعة</h3><p>من صورة يد آنا بيرتا إلى الذكاء الاصطناعي، في ${RAD.history.reduce((n, e) => n + e.items.length, 0)} محطة.</p></a>
        <a class="tile" href="#/modalities"><span class="k">${RAD.modalities.length} أنواع</span><h3>أنواع الأشعة</h3><p>كيف يعمل كل فحص، ومتى يُطلب، وكيف تستعد له.</p></a>
        <a class="tile" href="#/safety"><span class="k">ICRP · IAEA · WHO</span><h3>الوقاية من الإشعاع</h3><p>المبادئ العالمية للحماية، والحمل والأطفال، وحماية العاملين.</p></a>
        <a class="tile" href="#/mri-safety"><span class="k">MR Safe</span><h3>سلامة الرنين</h3><p>مناطق الأمان، والأجهزة المزروعة، وقائمة فحص قبل الدخول.</p></a>
        <a class="tile" href="#/dose"><span class="k">mSv</span><h3>حاسبة الجرعة</h3><p>قارن جرعة فحوصاتك بالإشعاع الطبيعي وصور الصدر.</p></a>
        <a class="tile" href="#/quiz"><span class="k">${RAD.quiz.length} أسئلة</span><h3>اختبر معلوماتك</h3><p>اختبار قصير عن الأشعة والسلامة.</p></a>
      </div>
    </section>

    <section class="fact"><strong>هل تعلم؟</strong><p>${fact}</p></section>`;
  };

  views.history = () => {
    let n = 0;
    const eras = RAD.history.map(era => `
      <section data-era>
        <h2 class="era">${era.era}</h2>
        <ol class="tl">${era.items.map(it => {
          const id = "ev" + (n++);
          return `<li data-cat="${it.c}">
            <button class="frame" type="button" aria-expanded="false" aria-controls="${id}">
              <span class="top"><span class="year">${it.y}</span><span class="tag">${TAGS[it.c]}</span></span>
              <span class="t">${it.t}</span><span class="who">${it.w}</span><span class="hint">اقرأ المزيد</span>
            </button>
            <div class="more" id="${id}" hidden><p>${it.d}</p>${figure(it.img, it.t, it.src)}</div>
          </li>`;
        }).join("")}</ol>
      </section>`).join("");
    return `
      ${head("البداية", "تاريخ الأشعة", "من صورة يدٍ في مختبر ألماني إلى أجهزة تقرأ الصور بالذكاء الاصطناعي. اضغط على أي محطة لقراءة التفاصيل.")}
      <div class="filters" role="group" aria-label="تصفية المحطات">
        <button class="chip" type="button" data-f="all" aria-pressed="true">الكل</button>
        ${Object.entries(TAGS).map(([k, v]) => `<button class="chip" type="button" data-f="${k}" aria-pressed="false">${v}</button>`).join("")}
      </div>
      <div>${eras}</div>`;
  };
  views.history.mount = () => {
    main.addEventListener("click", onTimelineClick);
  };
  function onTimelineClick(e) {
    const frame = e.target.closest(".frame");
    if (frame) {
      const more = document.getElementById(frame.getAttribute("aria-controls"));
      const open = frame.getAttribute("aria-expanded") === "true";
      frame.setAttribute("aria-expanded", String(!open));
      more.hidden = open;
      $(".hint", frame).textContent = open ? "اقرأ المزيد" : "إخفاء التفاصيل";
      return;
    }
    const chip = e.target.closest(".chip[data-f]");
    if (chip) {
      const f = chip.dataset.f;
      $$(".chip[data-f]").forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
      $$(".tl li").forEach(li => li.hidden = !(f === "all" || li.dataset.cat === f));
      $$("[data-era]").forEach(s => s.hidden = !$("li:not([hidden])", s));
    }
  }

  views.modalities = (id) => {
    if (id) return modalityDetail(id);
    return `
      ${head("أنواع الأشعة", "اختر نوع الفحص", "لكل نوع طريقة عمل واستخدامات وتحضير مختلف. اللون يوضّح مستوى الإشعاع المؤيّن تقريبًا.")}
      <div class="grid">${RAD.modalities.map(m => `
        <a class="mod-card" href="#/modalities/${m.id}">
          <img src="${IMG("m-" + m.id)}" alt="${m.name}" loading="lazy">
          <div class="body"><h3>${m.name}</h3><span class="en">${m.en}</span><p>${m.short}</p>${dosePill(m.dose)}</div>
        </a>`).join("")}
      </div>`;
  };
  function modalityDetail(id) {
    const i = RAD.modalities.findIndex(m => m.id === id);
    if (i < 0) return notFound();
    const m = RAD.modalities[i];
    const prev = RAD.modalities[(i - 1 + RAD.modalities.length) % RAD.modalities.length];
    const next = RAD.modalities[(i + 1) % RAD.modalities.length];
    const list = (a) => `<ul class="list">${a.map(x => `<li>${x}</li>`).join("")}</ul>`;
    return `
      ${head(m.en, m.name, m.short, `<a href="#/modalities">أنواع الأشعة</a> / ${m.name}`)}
      <div class="detail">
        <div class="blocks">
          ${figure("m-" + m.id, m.name, "ai")}
          <section><h2>كيف يعمل؟</h2><div class="prose"><p>${m.how}</p></div></section>
          <section><h2>متى يُطلب؟</h2>${list(m.uses)}</section>
          <section><h2>التحضير للفحص</h2>${list(m.prep)}</section>
          <section><h2>أثناء الفحص</h2><div class="prose"><p>${m.during}</p></div></section>
          <section><h2>المخاطر والسلامة</h2>${list(m.risks)}</section>
          <div class="callout safe"><strong>معلومة مفيدة</strong><p>${m.tip}</p></div>
          ${m.link ? `<a class="btn" href="${m.link.href}">${m.link.text}</a>` : ""}
        </div>
        <aside>
          <dl class="facts">
            <div><dt>مستوى الإشعاع</dt><dd>${dosePill(m.dose)}</dd></div>
            <div><dt>مدة الفحص التقريبية</dt><dd>${m.duration}</dd></div>
            <div><dt>إشعاع مؤيّن</dt><dd>${m.dose === 0 ? "لا" : "نعم"}</dd></div>
          </dl>
        </aside>
      </div>
      <nav class="pager" aria-label="التنقل بين الأنواع">
        <a class="btn" href="#/modalities/${prev.id}">→ ${prev.name}</a>
        <a class="btn" href="#/modalities/${next.id}">${next.name} ←</a>
      </nav>`;
  }

  views.safety = () => `
    ${head("الوقاية من الإشعاع", "كيف نحمي أنفسنا من الإشعاع؟", "مبادئ مبنية على توصيات اللجنة الدولية للوقاية من الإشعاع (ICRP) والوكالة الدولية للطاقة الذرية (IAEA) ومنظمة الصحة العالمية.")}
    <nav class="toc" aria-label="محتويات الصفحة">
      <a href="#/safety" data-jump="types">أنواع الإشعاع</a><a href="#/safety" data-jump="principles">المبادئ الثلاثة</a>
      <a href="#/safety" data-jump="tds">الزمن والمسافة والحاجز</a><a href="#/safety" data-jump="doses">مقارنة الجرعات</a>
      <a href="#/safety" data-jump="limits">حدود الجرعات</a><a href="#/safety" data-jump="pregnancy">الحمل والأطفال</a>
      <a href="#/safety" data-jump="staff">حماية العاملين</a><a href="#/safety" data-jump="myths">خرافات وحقائق</a>
    </nav>

    <section id="types">
      <h2 class="section-title">مؤيّن وغير مؤيّن</h2>
      <div class="prose"><p><b>الإشعاع المؤيّن</b> طاقته عالية بما يكفي لإحداث تغيير في ذرات الخلايا، ويُستخدم في الأشعة السينية والمقطعية والتلفزيونية والطب النووي. <b>غير المؤيّن</b> مثل المغناطيس وموجات الراديو في الرنين، والموجات الصوتية في السونار، ولا يحمل هذا النوع من الخطر.</p>
      <p>الجرعات التشخيصية منخفضة، والخطر المحتمل منها صغير جدًا مقارنة بفائدة التشخيص الصحيح. لكن الجرعات تتراكم، ولذلك نطبّق مبادئ الوقاية دائمًا.</p></div>
    </section>

    <section id="principles">
      <h2 class="section-title">المبادئ الثلاثة للوقاية (ICRP)</h2>
      <div class="trio">
        <div><h3>التبرير</h3><p>لا يُجرى الفحص إلا إذا كانت فائدته أكبر من خطره، ولا يوجد بديل مناسب بلا إشعاع.</p></div>
        <div><h3>التحسين (ALARA)</h3><p>أقل جرعة ممكنة تعطي صورة كافية للتشخيص، بضبط الإعدادات حسب المريض والفحص.</p></div>
        <div><h3>حدود الجرعة</h3><p>حدود سنوية للعاملين وعامة الناس. لا تنطبق على المريض لأن الفحص لمصلحته.</p></div>
      </div>
    </section>

    <section id="tds">
      <h2 class="section-title">الزمن والمسافة والحاجز</h2>
      <div class="trio">
        <div><h3>الزمن</h3><p>كلما قلّ وقت التعرض قلّت الجرعة، ولذلك يُشغَّل جهاز الأشعة التلفزيونية على فترات قصيرة.</p></div>
        <div><h3>المسافة</h3><p>أقوى وسيلة حماية. الجرعة تقل بمربع المسافة عن المصدر.</p></div>
        <div><h3>الحاجز</h3><p>الجدران المبطنة بالرصاص، والنوافذ الرصاصية، والمرايل والواقيات.</p></div>
      </div>
      <div style="margin-top:14px">${figure("s-tds", "الزمن والمسافة والحاجز", "ai")}</div>
      <div class="distance" style="margin-top:14px">
        <label for="dist"><b>جرّب بنفسك:</b> حرّك المؤشر لترى أثر المسافة على الجرعة</label>
        <input type="range" id="dist" min="0.5" max="4" step="0.5" value="1">
        <div class="dist-bar"><span id="dist-bar" style="width:100%"></span></div>
        <div class="dist-out"><span>المسافة: <b id="dist-m">1</b> م</span><span>الجرعة النسبية: <b id="dist-p">100%</b></span></div>
        <p class="note">مقارنة بالجرعة على بعد متر واحد من المصدر، وفق قانون التربيع العكسي.</p>
      </div>
    </section>

    <section id="doses">
      <h2 class="section-title">مقارنة الجرعات</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>الفحص</th><th>الجرعة التقريبية</th><th>يعادل إشعاعًا طبيعيًا لمدة</th></tr></thead>
        <tbody>${RAD.exams.map(x => `<tr><td>${x.n}</td><td class="num">${fmt(x.m, 3)} mSv</td><td>${bgPeriod(x.m)}</td></tr>`).join("")}</tbody>
      </table></div>
      <p class="note" style="margin-top:8px">قيم تقريبية لبالغ متوسط، والجرعة الفعلية تختلف حسب الجهاز والمريض. متوسط الإشعاع الطبيعي العالمي ${RAD.background} mSv سنويًا. <a href="#/dose">احسب جرعة فحوصاتك</a>.</p>
    </section>

    <section id="limits">
      <h2 class="section-title">حدود الجرعات السنوية</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>الفئة</th><th>الحد</th><th>ملاحظات</th></tr></thead>
        <tbody>${RAD.limits.map(l => `<tr><td>${l.who}</td><td class="num">${l.v}</td><td>${l.note}</td></tr>`).join("")}</tbody>
      </table></div>
      <p class="note" style="margin-top:8px">حسب توصيات ICRP (المنشور 103 وبيان 2011 لعدسة العين). قد تختلف الأنظمة المحلية.</p>
    </section>

    <section id="pregnancy">
      <h2 class="section-title">الحمل والأطفال</h2>
      <div class="two-col">
        <div class="blocks">
          <div class="callout warn"><strong>الحمل</strong><p>أبلغي الفني أو الطبيب دائمًا إذا كان هناك احتمال حمل. أغلب الفحوصات التشخيصية خارج منطقة البطن جرعتها على الجنين ضئيلة جدًا. لفحوصات البطن والحوض قد يُختار بديل بلا إشعاع مثل السونار أو الرنين، أو تُعدَّل الإعدادات، أو يؤجَّل الفحص غير العاجل.</p></div>
          ${figure("s-pregnancy", "الحمل وفحوصات الأشعة", "ai")}
        </div>
        <div class="blocks">
          <div class="callout"><strong>الأطفال</strong><p>الأطفال أكثر حساسية للإشعاع ولديهم عمر أطول تتراكم فيه الآثار. لذلك تُستخدم إعدادات مخصصة لحجم الطفل، ويُفضّل السونار والرنين متى أمكن، حسب حملة Image Gently.</p></div>
          ${figure("s-children", "تصوير الأطفال", "ai")}
        </div>
      </div>
    </section>

    <section id="staff">
      <h2 class="section-title">حماية العاملين</h2>
      <ul class="list">
        <li>ارتداء مقياس الجرعة الشخصي طوال العمل، في المكان المحدد حسب سياسة القسم.</li>
        <li>المريلة الرصاصية وواقي الغدة الدرقية والنظارات الرصاصية في الأشعة التلفزيونية والتداخلية.</li>
        <li>الوقوف خلف الحاجز الواقي أثناء التصوير، والابتعاد قدر الإمكان عن المريض والأنبوب.</li>
        <li>عدم إمساك المريض أثناء التصوير. إن لزم، يُمسكه مرافق يرتدي واقيًا وليس حاملًا.</li>
        <li>فحص الواقيات الرصاصية دوريًا للتأكد من عدم وجود تشققات.</li>
        <li>للعاملات الحوامل: الإبلاغ المبكر يتيح ترتيب العمل ومراقبة جرعة الجنين.</li>
      </ul>
      <div style="margin-top:14px">${figure("s-staff", "أدوات حماية العاملين", "ai")}</div>
    </section>

    <section id="myths">
      <h2 class="section-title">خرافات وحقائق</h2>
      <div class="terms">${RAD.myths.map(x => `<div class="myth"><span class="m">${x.m}</span><span class="f">${x.f}</span></div>`).join("")}</div>
    </section>

    <div class="grid">
      <a class="tile" href="#/mri-safety"><h3>سلامة الرنين المغناطيسي</h3><p>مخاطر مختلفة تمامًا عن الإشعاع.</p></a>
      <a class="tile" href="#/contrast"><h3>الصبغات</h3><p>أنواعها والتحضير لها والتفاعلات المحتملة.</p></a>
    </div>`;
  views.safety.mount = () => {
    const r = $("#dist");
    const upd = () => {
      const d = Number(r.value), p = 100 / (d * d);
      $("#dist-m").textContent = d;
      $("#dist-p").textContent = fmt(p, 1) + "%";
      $("#dist-bar").style.width = Math.min(100, p) + "%";
    };
    r.addEventListener("input", upd); upd();
    $$("[data-jump]").forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      document.getElementById(a.dataset.jump).scrollIntoView({ behavior: "smooth", block: "start" });
    }));
  };
  function bgPeriod(m) {
    const days = m / RAD.background * 365;
    if (days < 1) return `${fmt(days * 24, 0)} ساعة تقريبًا`;
    if (days < 60) return `${fmt(days, 0)} يومًا تقريبًا`;
    if (days < 730) return `${fmt(days / 30, 0)} شهرًا تقريبًا`;
    return `${fmt(days / 365, 1)} سنة تقريبًا`;
  }

  views["mri-safety"] = () => `
    ${head("الوقاية · الرنين المغناطيسي", "سلامة الرنين المغناطيسي", "لا إشعاع في الرنين، لكن المغناطيس القوي يعمل دائمًا ويجذب المعادن بقوة هائلة. لذلك له قواعد سلامة خاصة.", `<a href="#/safety">الوقاية</a> / الرنين`)}
    ${figure("s-mri-zones", "مناطق الأمان في قسم الرنين", "ai")}
    <section>
      <h2 class="section-title">مناطق الأمان الأربع</h2>
      <div class="trio">${RAD.mriZones.map(z => `<div><span class="year">${z.z}</span><h3>${z.t}</h3><p>${z.d}</p></div>`).join("")}</div>
    </section>
    <section>
      <h2 class="section-title">علامات تصنيف الأجهزة</h2>
      <div class="trio">${RAD.mriLabels.map(l => `<div><span class="pill ${l.cls}">${l.k}</span><h3 style="margin-top:6px">${l.a}</h3><p>${l.d}</p></div>`).join("")}</div>
    </section>
    <section>
      <h2 class="section-title">قائمة فحص قبل الرنين</h2>
      <div class="tool">
        <p class="note">ضع علامة على ما ينطبق عليك. القائمة للتوعية فقط، واستبيان السلامة في القسم هو المرجع.</p>
        <div>${RAD.mriChecks.map(c => `<label class="check"><input type="checkbox" id="mc-${c.id}" data-sev="${c.sev}"><span>${c.t}<small>${c.s}</small></span></label>`).join("")}</div>
        <div class="result" id="mri-res" aria-live="polite"></div>
      </div>
    </section>`;
  views["mri-safety"].mount = () => {
    const res = $("#mri-res");
    const upd = () => {
      const on = $$(".check input:checked");
      const high = on.filter(x => x.dataset.sev === "high").length;
      if (!on.length) res.innerHTML = `<p style="margin:0"><b>لم تحدد أي بند.</b> احرص مع ذلك على تعبئة استبيان السلامة وإزالة كل المعادن قبل الدخول.</p>`;
      else if (high) res.innerHTML = `<p style="margin:0"><b>حددت ${on.length} بنود، منها ${high} مهمة جدًا.</b> أبلغ فريق الرنين قبل موعدك بوقت كافٍ، وأحضر بطاقة الجهاز المزروع أو تقريره إن وجد.</p>`;
      else res.innerHTML = `<p style="margin:0"><b>حددت ${on.length} بنود.</b> أخبر الفني بها عند الوصول ليتخذ الإجراء المناسب.</p>`;
    };
    $$(".check input").forEach(x => x.addEventListener("change", upd)); upd();
  };

  views.contrast = () => `
    ${head("الوقاية · الصبغات", "الصبغات في الأشعة", "مواد تُعطى للمريض لتوضيح الأوعية والأعضاء. آمنة في أغلب الحالات، لكنها تحتاج تقييمًا مسبقًا.", `<a href="#/safety">الوقاية</a> / الصبغات`)}
    ${figure("s-contrast", "حقن الصبغة قبل الفحص", "ai")}
    <div class="grid">${RAD.contrast.map(c => `<div class="tile"><h3>${c.t}</h3><p><b>الاستخدام:</b> ${c.u}</p><p>${c.n}</p></div>`).join("")}</div>
    <section class="blocks">
      <div><h2>قبل الفحص</h2><ul class="list">
        <li>أخبر الفريق عن أي حساسية سابقة من الصبغة، أو ربو، أو أمراض الكلى.</li>
        <li>قد يُطلب تحليل لوظائف الكلى، خاصة لكبار السن ومرضى السكري والضغط.</li>
        <li>اتبع تعليمات طبيبك بخصوص أدويتك، ولا توقف أي دواء من تلقاء نفسك.</li>
        <li>الصيام حسب تعليمات القسم.</li>
      </ul></div>
      <div><h2>التفاعلات المحتملة</h2><ul class="list">
        <li><b>خفيفة وهي الأشيع:</b> إحساس بالدفء، طعم معدني، غثيان، أو حكة بسيطة.</li>
        <li><b>متوسطة:</b> طفح جلدي واسع أو تورم، وتُعالج في القسم.</li>
        <li><b>شديدة ونادرة جدًا:</b> صعوبة في التنفس أو هبوط الضغط، والقسم مجهّز للتعامل معها فورًا.</li>
      </ul></div>
      <div><h2>بعد الفحص</h2><ul class="list">
        <li>اشرب كمية كافية من الماء ما لم يمنعك الطبيب.</li>
        <li>راقب موضع الحقن، وراجع القسم إذا ظهر تورم أو ألم متزايد.</li>
        <li>الرضاعة الطبيعية يمكن عادة استمرارها، ويمكن مناقشة الأمر مع الطبيب.</li>
      </ul></div>
    </section>`;

  views.tools = () => `
    ${head("الأدوات", "أدوات تفاعلية", "أدوات بسيطة تساعدك على فهم الأشعة والاستعداد لها.")}
    <div class="grid">
      <a class="tile" href="#/dose"><span class="k">mSv</span><h3>حاسبة الجرعة</h3><p>اختر فحوصاتك وقارن جرعتها بالإشعاع الطبيعي.</p></a>
      <a class="tile" href="#/mri-safety"><span class="k">قائمة فحص</span><h3>هل أنت جاهز للرنين؟</h3><p>قائمة توعوية بما يجب إبلاغ الفريق به.</p></a>
      <a class="tile" href="#/safety"><span class="k">1 ÷ م²</span><h3>محاكي المسافة</h3><p>شاهد كيف تقل الجرعة كلما ابتعدت عن المصدر.</p></a>
      <a class="tile" href="#/quiz"><span class="k">${RAD.quiz.length} أسئلة</span><h3>اختبر معلوماتك</h3><p>أسئلة سريعة مع شرح لكل إجابة.</p></a>
      <a class="tile" href="#/glossary"><span class="k">${RAD.glossary.length} مصطلحًا</span><h3>قاموس المصطلحات</h3><p>مصطلحات الأشعة بالعربية والإنجليزية.</p></a>
    </div>`;

  views.dose = () => `
    ${head("الأدوات", "حاسبة الجرعة", "اختر الفحوصات وعدد مرات كل منها، لترى مجموع الجرعة التقريبية وما يعادلها.", `<a href="#/tools">الأدوات</a> / حاسبة الجرعة`)}
    <div class="detail">
      <div class="tool">${RAD.exams.map(x => `
        <div class="exam-row"><div><div class="n">${x.n}</div><div class="d">${fmt(x.m, 3)} mSv</div></div>
          <div class="stepper"><button type="button" data-step="-1" data-id="${x.id}" aria-label="إنقاص ${x.n}">−</button><output id="c-${x.id}">0</output><button type="button" data-step="1" data-id="${x.id}" aria-label="زيادة ${x.n}">+</button></div>
        </div>`).join("")}
      </div>
      <aside class="result" style="position:sticky;top:80px" aria-live="polite">
        <div><span class="note">المجموع التقريبي</span><div class="big" id="d-total">0 mSv</div></div>
        <div class="row">
          <div><b id="d-chest">0</b><span>صورة صدر</span></div>
          <div><b id="d-bg">—</b><span>من الإشعاع الطبيعي</span></div>
        </div>
        <button class="btn" type="button" id="d-reset">تصفير</button>
        <p class="note">قيم تقريبية للتوعية ولا تُستخدم لأي قرار طبي. الفائدة من الفحص المبرَّر أكبر بكثير من خطره.</p>
      </aside>
    </div>`;
  views.dose.mount = () => {
    const counts = {};
    const upd = () => {
      const total = RAD.exams.reduce((s, x) => s + (counts[x.id] || 0) * x.m, 0);
      $("#d-total").textContent = fmt(total, 3) + " mSv";
      $("#d-chest").textContent = fmt(total / RAD.chestXray, 0);
      $("#d-bg").textContent = total ? bgPeriod(total) : "—";
      RAD.exams.forEach(x => $("#c-" + x.id).textContent = counts[x.id] || 0);
    };
    main.addEventListener("click", e => {
      const b = e.target.closest("[data-step]");
      if (b) { const id = b.dataset.id; counts[id] = Math.max(0, Math.min(20, (counts[id] || 0) + Number(b.dataset.step))); upd(); }
      if (e.target.closest("#d-reset")) { Object.keys(counts).forEach(k => counts[k] = 0); upd(); }
    });
    counts.chest = 1; counts.cthead = 1; upd(); // مثال افتراضي
  };

  views.quiz = () => `
    ${head("الأدوات", "اختبر معلوماتك", "اختر الإجابة الصحيحة، وستظهر لك نبذة توضيحية بعد كل سؤال.", `<a href="#/tools">الأدوات</a> / الاختبار`)}
    <div class="tool" id="quiz"></div>`;
  views.quiz.mount = () => {
    const box = $("#quiz");
    let i = 0, score = 0;
    const render = () => {
      if (i >= RAD.quiz.length) {
        box.innerHTML = `<div class="result"><div class="big">${score} / ${RAD.quiz.length}</div>
          <p style="margin:0">${score === RAD.quiz.length ? "ممتاز! إجاباتك كلها صحيحة." : score >= RAD.quiz.length / 2 ? "نتيجة جيدة. راجع قسم الوقاية لتكمل الصورة." : "لا بأس، تصفّح المنصة ثم أعد المحاولة."}</p>
          <button class="btn primary" type="button" id="q-again">أعد الاختبار</button></div>`;
        $("#q-again").addEventListener("click", () => { i = 0; score = 0; render(); });
        return;
      }
      const q = RAD.quiz[i];
      box.innerHTML = `<div class="progress"><span style="width:${i / RAD.quiz.length * 100}%"></span></div>
        <div class="q"><span class="note">سؤال ${i + 1} من ${RAD.quiz.length}</span><h3>${q.q}</h3>
        <div class="opts">${q.o.map((o, k) => `<button class="opt" type="button" data-k="${k}">${o}</button>`).join("")}</div>
        <div id="q-x" hidden></div></div>`;
      $$(".opt", box).forEach(b => b.addEventListener("click", () => {
        const k = Number(b.dataset.k);
        if (k === q.a) score++;
        $$(".opt", box).forEach(x => { x.disabled = true; if (Number(x.dataset.k) === q.a) x.classList.add("right"); });
        if (k !== q.a) b.classList.add("wrong");
        const x = $("#q-x"); x.hidden = false;
        x.innerHTML = `<div class="callout ${k === q.a ? "safe" : "warn"}"><strong>${k === q.a ? "إجابة صحيحة" : "إجابة غير صحيحة"}</strong><p>${q.x}</p></div>
          <button class="btn primary" type="button" id="q-next" style="margin-top:12px">${i + 1 < RAD.quiz.length ? "السؤال التالي" : "عرض النتيجة"}</button>`;
        $("#q-next").addEventListener("click", () => { i++; render(); });
      }));
    };
    render();
  };

  views.glossary = () => `
    ${head("الأدوات", "قاموس المصطلحات", "ابحث بالعربية أو الإنجليزية.", `<a href="#/tools">الأدوات</a> / المصطلحات`)}
    <input class="search" id="g-q" type="search" placeholder="مثال: ALARA أو الصبغة" aria-label="ابحث في المصطلحات">
    <div class="terms" id="g-list"></div>`;
  views.glossary.mount = () => {
    const norm = s => s.toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
    const list = $("#g-list");
    const upd = () => {
      const q = norm($("#g-q").value.trim());
      const items = RAD.glossary.filter(g => !q || norm(g.a + " " + g.e + " " + g.d).includes(q));
      list.innerHTML = items.length
        ? items.map(g => `<div class="term"><div class="h"><b>${g.a}</b><span class="en">${g.e}</span></div><p>${g.d}</p></div>`).join("")
        : `<div class="empty">لا توجد نتائج. جرّب كلمة أخرى.</div>`;
    };
    $("#g-q").addEventListener("input", upd); upd();
  };

  views.about = () => `
    ${head("عن المنصة", "المصادر وعن المنصة", "منصة تثقيفية عربية في تخصص الأشعة، في مرحلة تجريبية.")}
    <section class="prose">
      <p>يُكتب المحتوى بالاعتماد على توصيات الجهات الدولية التالية، ويُراجَع من مختصين قبل النشر النهائي.</p>
      <ul class="list">
        <li><a href="https://www.icrp.org" target="_blank" rel="noopener">اللجنة الدولية للوقاية من الإشعاع ICRP</a></li>
        <li><a href="https://www.iaea.org/resources/rpop" target="_blank" rel="noopener">الوكالة الدولية للطاقة الذرية: حماية المرضى من الإشعاع</a></li>
        <li><a href="https://www.who.int/health-topics/radiation-protection" target="_blank" rel="noopener">منظمة الصحة العالمية: الوقاية من الإشعاع</a></li>
        <li><a href="https://www.radiologyinfo.org" target="_blank" rel="noopener">RadiologyInfo.org (ACR و RSNA)</a></li>
        <li><a href="https://www.acr.org" target="_blank" rel="noopener">الكلية الأمريكية للأشعة ACR</a></li>
        <li><a href="https://www.imagegently.org" target="_blank" rel="noopener">Image Gently</a> و <a href="https://www.imagewisely.org" target="_blank" rel="noopener">Image Wisely</a></li>
        <li><a href="https://www.unscear.org" target="_blank" rel="noopener">UNSCEAR</a></li>
      </ul>
    </section>
    <div class="callout warn"><strong>تنبيه</strong><p>المحتوى للتثقيف فقط ولا يغني عن استشارة الطبيب أو أخصائي الأشعة. الرسوم التوضيحية أصلية ومرسومة خصيصًا للمنصة.</p></div>`;

  function notFound() {
    return `${head("خطأ", "الصفحة غير موجودة", "الرابط غير صحيح أو أن الصفحة نُقلت.")}<a class="btn primary" href="#/">العودة للرئيسية</a>`;
  }

  /* ---------- الموجّه ---------- */
  let lastHandler = null;
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const key = parts[0] || "";
    const view = views[key];
    if (lastHandler) { main.removeEventListener("click", lastHandler); lastHandler = null; }
    main.innerHTML = `<div class="page">${view ? view(parts[1]) : notFound()}</div>`;
    if (view && view.mount) {
      const before = main.addEventListener;
      // تتبع مستمع النقر الذي تضيفه الصفحة لإزالته عند الانتقال
      main.addEventListener = function (type, fn, opt) { if (type === "click") lastHandler = fn; return before.call(main, type, fn, opt); };
      view.mount(parts[1]);
      delete main.addEventListener;
    }
    const sec = key in SECTION_OF ? SECTION_OF[key] : key;
    $$("#nav a").forEach(a => a.dataset.r === sec ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    const h1 = $("h1", main);
    document.title = (h1 && key ? h1.textContent + " · " : "") + "منصة الأشعة التثقيفية";
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  route();
})();
