/* نصوص الواجهة باللغتين — Interface text in both languages.
   {n} وما شابهها متغيّرات تُستبدل عند العرض. */
window.I18N = {
  ar: {
    appName: "منصة الأشعة", docTitle: "منصة الأشعة التثقيفية", skip: "تخطَّ إلى المحتوى",
    themeBtn: "تبديل المظهر", langBtn: "Switch to English", langShort: "EN",
    footer: "المحتوى تثقيفي ولا يغني عن استشارة الطبيب", footerLink: "المصادر وعن المنصة",
    tabs: { home: "الرئيسية", history: "التاريخ", modalities: "الأنواع", safety: "الوقاية", tools: "الأدوات" },
    cats: { discovery: "اكتشافات", device: "أجهزة", safety: "سلامة", nobel: "نوبل" },
    cat1: { discovery: "اكتشاف", device: "جهاز وتقنية", safety: "سلامة إشعاعية", nobel: "جائزة نوبل" },
    units: { h: ["ساعة", "ساعتان", "ساعات", "ساعة"], d: ["يوم", "يومان", "أيام", "يومًا"], m: ["شهر", "شهران", "أشهر", "شهرًا"], y: ["سنة", "سنتان", "سنوات", "سنة"] },
    illus: "رسم توضيحي", illusAlt: "رسم توضيحي: {t}", all: "الكل", seeAll: "عرض الكل", yes: "نعم", no: "لا",

    home: {
      k: "مرجع عربي مفتوح في تخصص الأشعة", h: "منصة الأشعة",
      p: "تعرّف على الأشعة وأنواعها، وكيف تستعد لكل فحص، وكيف تحمي نفسك من الإشعاع وفق التوصيات العالمية.",
      start: "ابدأ من هنا", years: "{n} عامًا من الأشعة", feat: "من اكتشاف رونتجن في 1895 إلى الذكاء الاصطناعي، في {n} محطة.",
      explore: "استكشف", fact: "هل تعلم؟", types: "أنواع الأشعة",
      tHistory: "تاريخ الأشعة", sHistory: "{n} محطة", tTypes: "أنواع الأشعة", sTypes: "{n} أنواع",
      tSafety: "الوقاية من الإشعاع", tMri: "سلامة الرنين", sMri: "قائمة فحص", tDose: "حاسبة الجرعة", sDose: "قارن فحوصاتك",
      tQuiz: "اختبر معلوماتك", sQuiz: "{n} أسئلة",
      gloss: "قاموس المصطلحات", glossS: "{n} مصطلحًا بالعربية والإنجليزية", contrast: "الصبغات", contrastS: "أنواعها والتحضير لها", about: "المصادر وعن المنصة"
    },
    history: { k: "البداية", h: "تاريخ الأشعة", p: "من صورة يدٍ في مختبر ألماني إلى أجهزة تقرأ الصور بالذكاء الاصطناعي. اضغط على أي محطة لقراءة التفاصيل.", filter: "تصفية المحطات" },
    mods: { k: "أنواع الأشعة", h: "اختر نوع الفحص", p: "لكل فحص طريقة عمل وتحضير مختلف. الشارة توضّح مستوى الإشعاع المؤيّن تقريبًا." },
    mod: { rad: "الإشعاع", dur: "المدة", ion: "إشعاع مؤيّن", how: "كيف يعمل؟", uses: "متى يُطلب؟", prep: "التحضير للفحص", during: "أثناء الفحص", risks: "المخاطر والسلامة", tip: "معلومة مفيدة", prev: "السابق", next: "التالي", pager: "التنقل بين الأنواع" },

    safety: {
      k: "الوقاية من الإشعاع", h: "كيف نحمي أنفسنا؟",
      p: "مبادئ مبنية على توصيات اللجنة الدولية للوقاية من الإشعاع (ICRP) والوكالة الدولية للطاقة الذرية (IAEA) ومنظمة الصحة العالمية.",
      ionH: "مؤيّن وغير مؤيّن",
      ion: ["الإشعاع المؤيّن", "الأشعة السينية والمقطعية والتلفزيونية والطب النووي. طاقته كافية لإحداث تغيير في ذرات الخلايا."],
      non: ["غير المؤيّن", "المغناطيس وموجات الراديو في الرنين، والموجات الصوتية في السونار. لا يحمل هذا النوع من الخطر."],
      ionNote: "الجرعات التشخيصية منخفضة والخطر منها صغير جدًا مقارنة بفائدة التشخيص، لكنها تتراكم، لذلك نطبّق مبادئ الوقاية دائمًا.",
      prH: "المبادئ الثلاثة",
      pr: [["التبرير", "لا يُجرى الفحص إلا إذا كانت فائدته أكبر من خطره، ولا يوجد بديل مناسب بلا إشعاع."],
           ["التحسين (ALARA)", "أقل جرعة ممكنة تعطي صورة كافية للتشخيص."],
           ["حدود الجرعة", "حدود سنوية للعاملين وعامة الناس، ولا تنطبق على المريض لأن الفحص لمصلحته."]],
      tdsH: "الزمن والمسافة والحاجز",
      tds: [["الزمن", "كلما قلّ وقت التعرض قلّت الجرعة."], ["المسافة", "أقوى وسيلة حماية: الجرعة تقل بمربع المسافة."], ["الحاجز", "الجدران الرصاصية، والنوافذ، والمرايل والواقيات."]],
      tryH: "جرّب بنفسك", tryL: "حرّك المؤشر لتغيير المسافة عن مصدر الأشعة", dist: "المسافة", m: "م", dose: "الجرعة",
      cmpH: "مقارنة الجرعات", cmpLink: "احسب جرعتك", cmpS: "يعادل إشعاعًا طبيعيًا لمدة {p} تقريبًا",
      cmpNote: "قيم تقريبية لبالغ متوسط، والجرعة الفعلية تختلف حسب الجهاز والمريض. متوسط الإشعاع الطبيعي العالمي {bg} mSv سنويًا.",
      limH: "حدود الجرعات السنوية", limNote: "حسب توصيات ICRP (المنشور 103 وبيان 2011 لعدسة العين). قد تختلف الأنظمة المحلية.",
      pregH: "الحمل والأطفال",
      preg: ["الحمل", "أبلغي الفني أو الطبيب دائمًا إذا كان هناك احتمال حمل. أغلب الفحوصات خارج منطقة البطن جرعتها على الجنين ضئيلة جدًا. لفحوصات البطن قد يُختار بديل بلا إشعاع، أو تُعدَّل الإعدادات، أو يؤجَّل الفحص غير العاجل."],
      pregCap: "الحمل وفحوصات الأشعة",
      kids: ["الأطفال", "الأطفال أكثر حساسية للإشعاع، لذلك تُستخدم إعدادات مخصصة لحجم الطفل، ويُفضَّل السونار والرنين متى أمكن، حسب حملة Image Gently."],
      staffH: "حماية العاملين", staffCap: "أدوات حماية العاملين",
      staff: ["ارتداء مقياس الجرعة الشخصي طوال العمل، في المكان المحدد حسب سياسة القسم.",
              "المريلة الرصاصية وواقي الغدة الدرقية والنظارات الرصاصية في الأشعة التلفزيونية والتداخلية.",
              "الوقوف خلف الحاجز الواقي أثناء التصوير، والابتعاد قدر الإمكان عن المريض والأنبوب.",
              "عدم إمساك المريض أثناء التصوير. إن لزم، يُمسكه مرافق يرتدي واقيًا وليس حاملًا.",
              "فحص الواقيات الرصاصية دوريًا للتأكد من عدم وجود تشققات.",
              "للعاملات الحوامل: الإبلاغ المبكر يتيح ترتيب العمل ومراقبة جرعة الجنين."],
      mythH: "خرافات وحقائق", truth: "الحقيقة:",
      moreH: "اقرأ أيضًا", mri: ["سلامة الرنين المغناطيسي", "مخاطر مختلفة تمامًا عن الإشعاع"], contrast: ["الصبغات", "أنواعها والتفاعلات المحتملة"]
    },

    mri: {
      k: "الوقاية · الرنين المغناطيسي", h: "سلامة الرنين",
      p: "لا إشعاع في الرنين، لكن المغناطيس القوي يعمل دائمًا ويجذب المعادن بقوة هائلة، لذلك له قواعد سلامة خاصة.",
      cap: "مناطق الأمان في قسم الرنين", zonesH: "مناطق الأمان الأربع", labelsH: "علامات تصنيف الأجهزة",
      checkH: "قائمة فحص قبل الرنين", checkNote: "فعّل ما ينطبق عليك. القائمة للتوعية فقط، واستبيان القسم هو المرجع.",
      none: ["لم تحدد أي بند", "احرص مع ذلك على تعبئة استبيان السلامة وإزالة كل المعادن قبل الدخول."],
      high: ["البنود المحددة: {n} · المهمة جدًا: {h}", "أبلغ فريق الرنين قبل موعدك بوقت كافٍ، وأحضر بطاقة الجهاز المزروع أو تقريره إن وجد."],
      some: ["البنود المحددة: {n}", "أخبر الفني بها عند الوصول ليتخذ الإجراء المناسب."]
    },

    contrast: {
      k: "الوقاية · الصبغات", h: "الصبغات في الأشعة",
      p: "مواد تُعطى للمريض لتوضيح الأوعية والأعضاء. آمنة في أغلب الحالات، لكنها تحتاج تقييمًا مسبقًا.",
      cap: "حقن الصبغة قبل الفحص", typesH: "أنواع الصبغات",
      beforeH: "قبل الفحص",
      before: ["أخبر الفريق عن أي حساسية سابقة من الصبغة، أو ربو، أو أمراض الكلى.", "قد يُطلب تحليل لوظائف الكلى، خاصة لكبار السن ومرضى السكري والضغط.", "اتبع تعليمات طبيبك بخصوص أدويتك، ولا توقف أي دواء من تلقاء نفسك.", "الصيام حسب تعليمات القسم."],
      reactH: "التفاعلات المحتملة",
      react: [["خفيفة، وهي الأشيع", "إحساس بالدفء، طعم معدني، غثيان، أو حكة بسيطة."], ["متوسطة", "طفح جلدي واسع أو تورم، وتُعالج في القسم."], ["شديدة ونادرة جدًا", "صعوبة في التنفس أو هبوط الضغط، والقسم مجهّز للتعامل معها فورًا."]],
      afterH: "بعد الفحص",
      after: ["اشرب كمية كافية من الماء ما لم يمنعك الطبيب.", "راقب موضع الحقن، وراجع القسم إذا ظهر تورم أو ألم متزايد.", "الرضاعة الطبيعية يمكن عادة استمرارها، ويمكن مناقشة الأمر مع الطبيب."]
    },

    tools: {
      k: "الأدوات", h: "أدوات تفاعلية", p: "أدوات بسيطة تساعدك على فهم الأشعة والاستعداد لها.",
      dose: "حاسبة الجرعة", mri: "جاهز للرنين؟", mriS: "قائمة فحص", quiz: "اختبر معلوماتك", quizS: "{n} أسئلة",
      gloss: "المصطلحات", glossS: "{n} مصطلحًا", dist: "محاكي المسافة", distS: "في صفحة الوقاية", about: "المصادر وعن المنصة"
    },
    dose: {
      k: "الأدوات", h: "حاسبة الجرعة", p: "اختر الفحوصات وعدد مرات كل منها لترى الجرعة التقريبية وما يعادلها.",
      total: "المجموع التقريبي", chest: "صورة صدر", bg: "من الإشعاع الطبيعي", reset: "تصفير", dec: "إنقاص {t}", inc: "زيادة {t}",
      note: "قيم تقريبية للتوعية ولا تُستخدم لأي قرار طبي. الفائدة من الفحص المبرَّر أكبر بكثير من خطره."
    },
    quiz: {
      k: "الأدوات", h: "اختبر معلوماتك", p: "اختر الإجابة الصحيحة، وستظهر لك نبذة توضيحية بعد كل سؤال.",
      score: "نتيجتك", perfect: "ممتاز! إجاباتك كلها صحيحة.", good: "نتيجة جيدة. راجع قسم الوقاية لتكمل الصورة.", low: "لا بأس، تصفّح المنصة ثم أعد المحاولة.",
      again: "أعد الاختبار", of: "سؤال {i} من {n}", points: "النقاط", letters: ["أ", "ب", "ج", "د"],
      right: "إجابة صحيحة", wrong: "إجابة غير صحيحة", next: "السؤال التالي", show: "عرض النتيجة"
    },
    gloss: { k: "الأدوات", h: "المصطلحات", p: "مصطلحات الأشعة بالعربية والإنجليزية.", search: "بحث", aria: "ابحث في المصطلحات", empty: "لا توجد نتائج. جرّب كلمة أخرى." },
    about: {
      k: "عن المنصة", h: "المصادر", p: "يُكتب المحتوى بالاعتماد على توصيات الجهات الدولية التالية، ويُراجَع من مختصين قبل النشر النهائي.",
      src: ["اللجنة الدولية للوقاية من الإشعاع", "الوكالة الدولية للطاقة الذرية", "منظمة الصحة العالمية", "RadiologyInfo", "الكلية الأمريكية للأشعة", "Image Gently", "Image Wisely", "لجنة الأمم المتحدة العلمية لآثار الإشعاع"],
      srcS: ["ICRP", "IAEA · حماية المرضى", "WHO", "ACR · RSNA", "ACR", "تصوير الأطفال", "تصوير البالغين", "UNSCEAR"],
      warn: ["تنبيه", "المحتوى للتثقيف فقط ولا يغني عن استشارة الطبيب أو أخصائي الأشعة. الرسوم التوضيحية أصلية ومرسومة خصيصًا للمنصة."]
    },
    v3d: { cap: "نموذج ثلاثي الأبعاد", open: "عرض ثلاثي الأبعاد", close: "إغلاق", loading: "جارٍ التحميل…", error: "تعذّر التحميل", hint: "اسحب للتدوير، وقرّب بإصبعين", diagram: "مخطط توضيحي لطريقة العمل" },
    nf: { k: "خطأ", h: "الصفحة غير موجودة", p: "الرابط غير صحيح أو أن الصفحة نُقلت.", btn: "العودة للرئيسية" }
  },

  en: {
    appName: "Radiology Platform", docTitle: "Radiology Education Platform", skip: "Skip to content",
    themeBtn: "Toggle appearance", langBtn: "التبديل إلى العربية", langShort: "ع",
    footer: "Educational content only; it does not replace medical advice", footerLink: "Sources & about",
    tabs: { home: "Home", history: "History", modalities: "Imaging", safety: "Safety", tools: "Tools" },
    cats: { discovery: "Discoveries", device: "Devices", safety: "Safety", nobel: "Nobel" },
    cat1: { discovery: "Discovery", device: "Device & technology", safety: "Radiation safety", nobel: "Nobel Prize" },
    units: { h: ["hour", "hours"], d: ["day", "days"], m: ["month", "months"], y: ["year", "years"] },
    illus: "Illustration", illusAlt: "Illustration: {t}", all: "All", seeAll: "See all", yes: "Yes", no: "No",

    home: {
      k: "An open reference in radiology", h: "Radiology Platform",
      p: "Learn about medical imaging and its types, how to prepare for each exam, and how to protect yourself from radiation according to international recommendations.",
      start: "Start here", years: "{n} years of radiology", feat: "From Röntgen’s discovery in 1895 to artificial intelligence, in {n} milestones.",
      explore: "Explore", fact: "Did you know?", types: "Imaging types",
      tHistory: "History of Radiology", sHistory: "{n} milestones", tTypes: "Imaging Types", sTypes: "{n} types",
      tSafety: "Radiation Protection", tMri: "MRI Safety", sMri: "Checklist", tDose: "Dose Calculator", sDose: "Compare your exams",
      tQuiz: "Test Yourself", sQuiz: "{n} questions",
      gloss: "Glossary", glossS: "{n} terms in English and Arabic", contrast: "Contrast Agents", contrastS: "Types and preparation", about: "Sources & about"
    },
    history: { k: "The beginning", h: "History of Radiology", p: "From an image of a hand in a German laboratory to scanners that read images with artificial intelligence. Tap any milestone to read more.", filter: "Filter milestones" },
    mods: { k: "Imaging types", h: "Choose an exam", p: "Each exam works differently and needs different preparation. The badge shows the approximate level of ionizing radiation." },
    mod: { rad: "Radiation", dur: "Duration", ion: "Ionizing radiation", how: "How does it work?", uses: "When is it used?", prep: "Preparing for the exam", during: "During the exam", risks: "Risks and safety", tip: "Good to know", prev: "Previous", next: "Next", pager: "Browse imaging types" },

    safety: {
      k: "Radiation protection", h: "How do we protect ourselves?",
      p: "Principles based on the recommendations of the International Commission on Radiological Protection (ICRP), the International Atomic Energy Agency (IAEA) and the World Health Organization.",
      ionH: "Ionizing and non-ionizing",
      ion: ["Ionizing radiation", "X-ray, CT, fluoroscopy and nuclear medicine. Its energy is high enough to change the atoms in cells."],
      non: ["Non-ionizing", "The magnet and radio waves in MRI, and sound waves in ultrasound. This type does not carry that risk."],
      ionNote: "Diagnostic doses are low and their risk is very small compared with the benefit of a correct diagnosis, but doses add up, so we always apply the principles of protection.",
      prH: "The three principles",
      pr: [["Justification", "An exam is done only if its benefit outweighs its risk and there is no suitable alternative without radiation."],
           ["Optimization (ALARA)", "The lowest possible dose that still gives an image good enough for diagnosis."],
           ["Dose limits", "Annual limits for workers and the public. They do not apply to patients, because the exam is for their own benefit."]],
      tdsH: "Time, distance and shielding",
      tds: [["Time", "The shorter the exposure, the lower the dose."], ["Distance", "The most powerful protection: dose falls with the square of the distance."], ["Shielding", "Lead-lined walls, lead glass windows, aprons and shields."]],
      tryH: "Try it yourself", tryL: "Move the slider to change your distance from the X-ray source", dist: "Distance", m: "m", dose: "Dose",
      cmpH: "Comparing doses", cmpLink: "Calculate your dose", cmpS: "About {p} of natural background radiation",
      cmpNote: "Approximate values for an average adult; the actual dose varies with the equipment and the patient. The world average natural background radiation is {bg} mSv per year.",
      limH: "Annual dose limits", limNote: "Based on ICRP recommendations (Publication 103 and the 2011 statement on the lens of the eye). Local regulations may differ.",
      pregH: "Pregnancy and children",
      preg: ["Pregnancy", "Always tell the technologist or doctor if there is any chance you are pregnant. Most exams outside the abdomen give the baby a tiny dose. For abdominal exams, a radiation-free alternative may be chosen, the settings adjusted, or a non-urgent exam postponed."],
      pregCap: "Pregnancy and imaging exams",
      kids: ["Children", "Children are more sensitive to radiation, so settings are tailored to the child’s size, and ultrasound and MRI are preferred whenever possible, as promoted by the Image Gently campaign."],
      staffH: "Protecting staff", staffCap: "Personal protective equipment",
      staff: ["Wear your personal dosimeter throughout your shift, in the position set by your department’s policy.",
              "A lead apron, thyroid shield and lead glasses in fluoroscopy and interventional radiology.",
              "Stand behind the protective barrier during exposures and keep as far as possible from the patient and the tube.",
              "Never hold a patient during an exposure. If needed, a companion wearing a shield, who is not pregnant, may hold them.",
              "Check lead aprons and shields regularly for cracks.",
              "Pregnant staff: declaring the pregnancy early allows work to be arranged and the fetal dose to be monitored."],
      mythH: "Myths and facts", truth: "Fact:",
      moreH: "Read more", mri: ["MRI safety", "Hazards completely different from radiation"], contrast: ["Contrast agents", "Types and possible reactions"]
    },

    mri: {
      k: "Safety · MRI", h: "MRI Safety",
      p: "There is no radiation in MRI, but the powerful magnet is always on and pulls metal with enormous force, so it has its own safety rules.",
      cap: "Safety zones in the MRI department", zonesH: "The four safety zones", labelsH: "Device safety labels",
      checkH: "Pre-MRI checklist", checkNote: "Switch on anything that applies to you. This list is for awareness only; the department’s questionnaire is the reference.",
      none: ["Nothing selected", "Even so, make sure you complete the safety questionnaire and remove all metal before entering."],
      high: ["Selected: {n} · Very important: {h}", "Tell the MRI team well before your appointment, and bring your implant card or report if you have one."],
      some: ["Selected: {n}", "Tell the technologist about them when you arrive so the right steps can be taken."]
    },

    contrast: {
      k: "Safety · Contrast", h: "Contrast Agents in Imaging",
      p: "Substances given to the patient to make vessels and organs clearer. They are safe in most cases but need an assessment beforehand.",
      cap: "Contrast injection before the exam", typesH: "Types of contrast",
      beforeH: "Before the exam",
      before: ["Tell the team about any previous reaction to contrast, asthma, or kidney disease.", "A kidney function test may be requested, especially for older adults and people with diabetes or high blood pressure.", "Follow your doctor’s instructions about your medicines, and do not stop any medicine on your own.", "Fast as instructed by the department."],
      reactH: "Possible reactions",
      react: [["Mild, and the most common", "A warm feeling, a metallic taste, nausea, or slight itching."], ["Moderate", "A widespread rash or swelling, treated in the department."], ["Severe and very rare", "Difficulty breathing or a drop in blood pressure; the department is equipped to deal with it immediately."]],
      afterH: "After the exam",
      after: ["Drink plenty of water unless your doctor tells you otherwise.", "Watch the injection site, and contact the department if swelling or pain increases.", "Breastfeeding can usually continue; you can discuss this with your doctor."]
    },

    tools: {
      k: "Tools", h: "Interactive Tools", p: "Simple tools to help you understand imaging and prepare for it.",
      dose: "Dose Calculator", mri: "Ready for MRI?", mriS: "Checklist", quiz: "Test Yourself", quizS: "{n} questions",
      gloss: "Glossary", glossS: "{n} terms", dist: "Distance simulator", distS: "On the Safety page", about: "Sources & about"
    },
    dose: {
      k: "Tools", h: "Dose Calculator", p: "Choose your exams and how many times each was done to see the approximate dose and what it equals.",
      total: "Approximate total", chest: "chest X-rays", bg: "of natural background", reset: "Reset", dec: "Decrease {t}", inc: "Increase {t}",
      note: "Approximate values for awareness only; not for any medical decision. The benefit of a justified exam far outweighs its risk."
    },
    quiz: {
      k: "Tools", h: "Test Yourself", p: "Choose the correct answer; a short explanation appears after each question.",
      score: "Your score", perfect: "Excellent! Every answer is correct.", good: "Good result. Review the Safety section to complete the picture.", low: "No problem. Browse the platform and try again.",
      again: "Try again", of: "Question {i} of {n}", points: "Score", letters: ["A", "B", "C", "D"],
      right: "Correct", wrong: "Not quite", next: "Next question", show: "See your score"
    },
    gloss: { k: "Tools", h: "Glossary", p: "Radiology terms in English and Arabic.", search: "Search", aria: "Search the glossary", empty: "No results. Try another word." },
    about: {
      k: "About", h: "Sources", p: "Content is based on the recommendations of the following international bodies and is reviewed by specialists before final publication.",
      src: ["International Commission on Radiological Protection", "International Atomic Energy Agency", "World Health Organization", "RadiologyInfo", "American College of Radiology", "Image Gently", "Image Wisely", "UN Scientific Committee on the Effects of Atomic Radiation"],
      srcS: ["ICRP", "IAEA · Radiation protection of patients", "WHO", "ACR · RSNA", "ACR", "Pediatric imaging", "Adult imaging", "UNSCEAR"],
      warn: ["Note", "This content is for education only and does not replace advice from your doctor or radiologist. The illustrations are original and drawn specifically for this platform."]
    },
    v3d: { cap: "3D model", open: "View in 3D", close: "Close", loading: "Loading…", error: "Could not load", hint: "Drag to rotate, pinch to zoom", diagram: "Diagram of how it works" },
    nf: { k: "Error", h: "Page not found", p: "The link is incorrect or the page has moved.", btn: "Back to Home" }
  }
};
