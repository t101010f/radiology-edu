/* English translation of all content.
   Same structure and order as the Arabic data files. Only text fields are listed here;
   ids, numbers, images and categories are taken from the Arabic files when the app merges them. */
window.RAD_EN = {
  history: [
    { era: "The Beginnings", items: [
      { t: "Discovery of X-rays", w: "Wilhelm Conrad Röntgen · University of Würzburg, Germany",
        d: "On 8 November 1895, Röntgen noticed a coated screen glowing during his experiments with a cathode-ray tube, even though the tube was wrapped in black paper. He called these unknown rays “X”. On 22 December he imaged the hand of his wife, Anna Bertha, showing her bones and her ring: the first X-ray image in history." },
      { t: "Discovery of radioactivity", w: "Henri Becquerel · France",
        d: "Becquerel found that uranium salts give off radiation on their own, without any need for sunlight. This later became the foundation of nuclear medicine." },
      { t: "First warnings of radiation injury", w: "Early physicians and researchers",
        d: "Within months of the discovery, X-ray equipment spread with no protection at all, and researchers and patients developed skin burns and hair loss. This was the true beginning of radiation protection as a science." },
      { t: "Discovery of radium and polonium", w: "Marie Curie and Pierre Curie · Paris",
        d: "The Curies discovered two new radioactive elements, and Marie Curie coined the term “radioactivity”. Radium was later used to treat tumors." },
      { t: "The first Nobel Prize in Physics", w: "Wilhelm Röntgen",
        d: "Röntgen received the first Nobel Prize in Physics for his discovery. He refused to patent X-rays so that everyone could benefit from them." },
      { t: "The Coolidge tube", w: "William Coolidge · United States",
        d: "Coolidge developed an X-ray tube with a heated filament that allows precise control of the beam’s intensity and energy. Its principle is still used in today’s equipment." }
    ]},
    { era: "The 20th Century", items: [
      { t: "The International Commission on Radiological Protection is founded", w: "Second International Congress of Radiology · Stockholm",
        d: "The commission known today as the ICRP was founded. It remains the global reference for dose limits and for the protection principles that countries and hospitals follow." },
      { t: "The gamma camera", w: "Hal Anger · United States",
        d: "Anger invented a camera that detects the radiation emitted by a radioactive tracer given to the patient, making it possible to image how organs work, not only their shape." },
      { t: "Ultrasound in pregnancy", w: "Ian Donald · Glasgow, Scotland",
        d: "Donald published his work on using ultrasound to examine the abdomen and pregnancy. It uses no ionizing radiation, which is why it became the first-choice exam in pregnancy." },
      { t: "The first CT scan of a patient", w: "Godfrey Hounsfield · Atkinson Morley Hospital, London",
        d: "On 1 October 1971 the first CT scan of a patient was performed, revealing a brain tumor. The unit of density in CT is called the Hounsfield unit in his honor." },
      { t: "The first MRI scan of a human", w: "Raymond Damadian and his team · United States",
        d: "Building on Lauterbur’s and Mansfield’s work on forming images, the first MRI scan of a human body was performed. MRI uses a magnet and radio waves, with no ionizing radiation." },
      { t: "Nobel Prize in Medicine for CT", w: "Godfrey Hounsfield and Allan Cormack",
        d: "The two scientists shared the Nobel Prize in Physiology or Medicine: Cormack laid the mathematical foundation and Hounsfield built the scanner." }
    ]},
    { era: "The Digital Era", items: [
      { t: "The DICOM standard", w: "American College of Radiology (ACR) and NEMA",
        d: "The common standard for storing and exchanging medical images between devices was published. It made PACS possible and moved departments from film to screens." },
      { t: "Nobel Prize in Medicine for MRI", w: "Paul Lauterbur and Peter Mansfield",
        d: "The two scientists were honored for discoveries that made forming MRI images possible and fast." },
      { t: "The Image Gently campaign", w: "Alliance for Radiation Safety in Pediatric Imaging",
        d: "A worldwide campaign to lower radiation doses for children, followed in 2010 by Image Wisely for adults. The idea: the right exam, at the lowest possible dose, only when needed." },
      { t: "International Day of Radiology", w: "ESR, RSNA and ACR",
        d: "8 November, the anniversary of Röntgen’s discovery, was established as a worldwide day to raise awareness of radiology’s role and the importance of safety." },
      { y: "Today", t: "Artificial intelligence in radiology", w: "Radiology departments worldwide",
        d: "Algorithms help detect urgent findings, prioritize the reading worklist and lower CT doses. The final decision stays with the radiologist." }
    ]}
  ],

  facts: [
    "The first X-ray image in history showed the hand of Anna Bertha, Röntgen’s wife, taken on 22 December 1895.",
    "Röntgen refused to patent X-rays so that they would remain available to all of humanity.",
    "Doubling your distance from an X-ray source cuts the dose to about a quarter.",
    "A chest X-ray is roughly equal to the natural background radiation a person receives in about 15 days.",
    "MRI and ultrasound use no ionizing radiation at all.",
    "An MRI scanner’s magnet is always on, even when no one is being scanned.",
    "8 November is the International Day of Radiology, marking Röntgen’s discovery."
  ],

  doseLabels: ["No ionizing radiation", "Very low dose", "Low dose", "Moderate dose", "Relatively high dose"],

  modalities: [
    {
      name: "X-ray", duration: "A few minutes",
      short: "The oldest and most widely used imaging method, for bones and the chest.",
      how: "A beam of X-rays passes through the body onto a digital detector. Bones absorb more of the rays and appear white, air in the lungs absorbs almost none and appears black, and soft tissues appear in shades of gray.",
      uses: ["Fractures and dislocations, and checking bone healing", "Chest conditions such as pneumonia", "Teeth and jaws", "Swallowed foreign objects", "Checking the position of tubes and catheters"],
      prep: ["Usually no preparation is needed", "Remove jewelry and metal objects from the area being imaged", "Tell the technologist if there is any chance you are pregnant"],
      during: "The technologist will ask you to keep still and sometimes to hold your breath for a few seconds. Two images may be taken from different directions.",
      risks: ["A low radiation dose; when the exam is medically justified, its diagnostic benefit outweighs the risk"],
      tip: "A chest X-ray is roughly equal to the natural background radiation you receive in about 15 days."
    },
    {
      name: "Computed Tomography (CT)", duration: "5 to 15 minutes",
      short: "Detailed cross-sectional images of the whole body in seconds, essential in emergencies.",
      how: "An X-ray tube and detectors rotate around the body as the table moves. A computer then reconstructs thin slices that can be viewed in any plane or turned into 3D images.",
      uses: ["Injuries and accidents", "Stroke and bleeding in the brain", "Diagnosing and following up tumors", "Blood clots in the lungs", "Acute abdominal pain and kidney stones"],
      prep: ["Fast for about 4 hours if the scan uses contrast", "A kidney function blood test before contrast", "Tell the team about any previous reaction to contrast", "Follow your doctor’s instructions about certain diabetes medicines", "Tell the technologist if there is any chance you are pregnant"],
      during: "You lie on a table that moves through a ring-shaped opening. The scan itself takes seconds, and you may feel a brief warm sensation when contrast is injected.",
      risks: ["A higher dose than plain X-ray, so CT is ordered only when there is a clear reason", "A possible allergic reaction to contrast, which is usually mild"],
      tip: "Scanner settings are adjusted to the patient’s size, and special pediatric settings are used to lower the dose for children."
    },
    {
      name: "Magnetic Resonance Imaging (MRI)", duration: "20 to 60 minutes",
      short: "The most detailed way to image the brain, spine and joints, with no radiation.",
      how: "A strong magnet lines up the hydrogen atoms in the body, then pulses of radio waves are sent in. As the atoms return to their resting state they release signals that a computer turns into detailed images of soft tissue.",
      uses: ["Brain and nerve conditions", "Disc problems and the spinal cord", "Ligament and cartilage injuries", "Assessing some tumors", "The heart, liver and prostate"],
      prep: ["Fill in the safety questionnaire carefully", "Tell the team about any implant: pacemaker, cochlear implant, aneurysm clips, pumps", "Remove all metal, cards and electronic devices", "Tell the team if you are afraid of enclosed spaces"],
      during: "You lie inside the scanner’s tunnel and hear loud knocking sounds, so you are given earplugs or headphones. Keeping still is very important for clear images.",
      risks: ["No ionizing radiation", "Metal objects can be pulled forcefully toward the magnet", "Some implants are unsafe or need special conditions", "Gadolinium contrast requires a kidney function check"],
      tip: "The scanner’s magnet is always on, even when no one is being scanned.",
      link: { text: "Read the MRI safety guide" }
    },
    {
      name: "Ultrasound", duration: "15 to 30 minutes",
      short: "Safe real-time imaging with sound waves, the first choice in pregnancy.",
      how: "The probe sends high-frequency sound waves that the ear cannot hear. They bounce off organs, and the machine builds a live image from the echoes. Doppler ultrasound measures blood flow in the vessels.",
      uses: ["Following pregnancy and the baby’s health", "Gallbladder, liver and kidneys", "Thyroid and breast", "Blood vessels and clots", "Guiding the needle during biopsies"],
      prep: ["Fast for 6 to 8 hours for gallbladder and upper abdomen scans", "Drink water and do not empty your bladder for a pelvic scan", "No preparation for most other scans"],
      during: "The sonographer puts gel on your skin and moves the probe over it. The exam is painless.",
      risks: ["No ionizing radiation and no known harm when used correctly for medical purposes"],
      tip: "The quality of an ultrasound exam depends a great deal on the skill of the person performing it."
    },
    {
      name: "Mammography", duration: "About 20 minutes",
      short: "Low-dose X-ray imaging for early detection of breast cancer.",
      how: "The breast is compressed between two plates for a few seconds while low-energy X-ray images are taken. 3D mammography (tomosynthesis) takes several images from different angles.",
      uses: ["Routine screening for early detection", "Assessing a lump or breast symptoms", "Guiding biopsies"],
      prep: ["Do not use deodorant or powder on the day of the exam", "It is best to book about a week after your period", "Bring previous images for comparison"],
      during: "Compression may be uncomfortable for a few seconds, but it lowers the dose and makes the image clearer.",
      risks: ["A low dose", "Extra images are sometimes needed, which does not necessarily mean there is a problem"],
      tip: "How often you need screening depends on your age and family history, and your doctor decides the schedule."
    },
    {
      name: "Fluoroscopy", duration: "15 to 60 minutes",
      short: "Continuous X-rays that show organs moving, like a live video.",
      how: "X-rays are shown on a screen as a live moving image, often with a contrast agent that the patient swallows or that is injected, to follow swallowing, contrast moving through the bowel, or the blood vessels.",
      uses: ["Swallowing studies and the esophagus", "Barium studies of the stomach and bowel", "Imaging of the uterus and fallopian tubes", "Guiding catheters and joint injections"],
      prep: ["Fast before upper digestive tract studies", "Bowel preparation for some colon studies", "Tell the technologist if there is any chance you are pregnant"],
      during: "The doctor watches the screen and asks you to change position or swallow at specific moments.",
      risks: ["The dose depends on how long the beam is on, so it is used in short bursts", "A rare allergy to contrast"],
      tip: "Modern units use pulsed rather than continuous X-rays to lower the dose."
    },
    {
      name: "Nuclear Medicine & PET", duration: "30 minutes to several hours",
      short: "Shows how organs work, not just their shape, using radioactive tracers.",
      how: "The patient receives a small amount of a radioactive substance (by injection, by mouth or by inhalation) that collects in the target organ. A gamma camera or PET scanner then detects the radiation it gives off and builds an image of the organ’s activity.",
      uses: ["Bone scans", "The thyroid gland", "Blood flow to the heart muscle", "Diagnosing and staging cancer with PET-CT", "Kidney function"],
      prep: ["Fast for 4 to 6 hours before a PET scan", "Avoid strenuous exercise the day before a PET scan", "Tell the team if you are breastfeeding or pregnant", "People with diabetes have their blood sugar checked before PET"],
      during: "There is a waiting period between receiving the tracer and the scan so it can spread through the body, then you lie in front of the camera.",
      risks: ["The tracer decays and leaves the body within hours to days", "The team may ask you to drink plenty of water and briefly limit close contact with infants and pregnant women"],
      tip: "Follow the after-scan instructions the department gives you, as they differ depending on the tracer used."
    },
    {
      name: "Interventional Radiology", duration: "30 minutes to several hours",
      short: "Precise treatments through a needle or catheter guided by imaging, without open surgery.",
      how: "The interventional radiologist uses fluoroscopy, CT or ultrasound to guide a small needle or catheter inside the body to exactly where it is needed.",
      uses: ["Taking tissue samples (biopsies)", "Draining abscesses and fluid", "Opening arteries and placing stents", "Stopping bleeding and blocking vessels that feed tumors", "Placing catheters and venous ports"],
      prep: ["Fast as instructed", "Blood tests, including clotting tests", "Stop blood thinners only on your doctor’s instructions", "Sign the consent form after the procedure is explained"],
      during: "Usually under local anesthesia with a sedative. The entry point is very small.",
      risks: ["Bleeding or infection at the entry site, which is rare", "The dose depends on how long and complex the procedure is", "Protecting the staff from radiation is especially important here"],
      tip: "Recovery is much faster than after conventional surgery, and many patients go home the same day."
    },
    {
      name: "Bone Densitometry (DEXA)", duration: "10 to 20 minutes",
      short: "A quick, very low-dose test to diagnose osteoporosis.",
      how: "Two X-ray beams at different energies pass through the hip and spine. The machine calculates bone density and compares it with the normal average in a result called the T-score.",
      uses: ["Diagnosing osteoporosis", "Estimating fracture risk", "Following the response to treatment"],
      prep: ["Stop calcium supplements 24 hours before the test", "Tell the team if you had a barium or contrast study in the previous days", "Wear clothes without metal parts"],
      during: "You lie on an open table while the scanner arm moves slowly over you.",
      risks: ["A tiny dose, lower than a standard chest X-ray"],
      tip: "For accurate comparison, follow-up scans are best done on the same machine."
    }
  ],

  exams: [
    { n: "Extremity X-ray (hand or foot)" },
    { n: "Bone densitometry" },
    { n: "Dental X-ray" },
    { n: "Chest X-ray" },
    { n: "Mammography" },
    { n: "Lower back X-ray" },
    { n: "Head CT" },
    { n: "Chest CT" },
    { n: "Nuclear bone scan" },
    { n: "Abdomen and pelvis CT" },
    { n: "Coronary CT angiography" },
    { n: "PET-CT" }
  ],

  limits: [
    { who: "Radiation workers", note: "Per year, averaged over 5 years, with a maximum of 50 mSv in any single year" },
    { who: "Lens of the eye (workers)", note: "Per year, averaged over 5 years" },
    { who: "Fetus of a pregnant worker", note: "For the remainder of the pregnancy after it is declared" },
    { who: "Members of the public", note: "Per year from artificial sources, not counting natural background or medical exams" },
    { who: "Patients", v: "No limit", note: "Protection relies on justifying the exam and optimizing the dose, because the benefit goes to the patient" }
  ],

  myths: [
    { m: "An X-ray makes your body radioactive after the exam.", f: "X-rays stop the moment the machine is switched off, and nothing remains in the body. Only nuclear medicine tracers stay for a limited time and then clear." },
    { m: "MRI uses radiation, just like CT.", f: "MRI uses a magnet and radio waves and involves no ionizing radiation." },
    { m: "All imaging exams give the same dose.", f: "The difference is large: an abdominal CT can equal dozens of chest X-rays, while a hand X-ray is tiny." },
    { m: "A pregnant woman must never have any X-ray exam.", f: "Many exams are safe or give the baby a tiny dose. What matters is telling the team so they can choose the right exam and adjust the settings." },
    { m: "Every patient must be covered with a lead shield for every exam.", f: "Recent recommendations from medical physics societies no longer advise routine shielding, because it can block the area being imaged or increase the dose. Each facility’s policy is the reference." }
  ],

  mriChecks: [
    { t: "Pacemaker or implanted defibrillator", s: "May be unsafe or need special conditions and programming" },
    { t: "Cochlear implant or implanted hearing device", s: "Needs assessment before entering" },
    { t: "Surgical clips in the brain (for aneurysm treatment)", s: "Some older types are unsafe" },
    { t: "Metal fragments in the eye, or past work in welding or metalwork", s: "An X-ray of the eyes may be needed before MRI" },
    { t: "Insulin pump or continuous glucose monitor", s: "Usually removed before entering" },
    { t: "Nerve stimulator or other implanted device", s: "Its type and conditions must be checked" },
    { t: "Pregnancy or possible pregnancy", s: "The doctor decides on timing and whether contrast can be used" },
    { t: "Medication patch on the skin", s: "Some contain metal and can cause burns" },
    { t: "Tattoo or permanent makeup", s: "Rarely causes local heating; tell the technologist" },
    { t: "Fear of enclosed spaces", s: "A sedative or an open scanner can be arranged" }
  ],

  mriZones: [
    { z: "Zone 1", t: "Public area", d: "Hospital entrances and corridors, open to everyone." },
    { z: "Zone 2", t: "Reception and screening", d: "Patients are received here and fill in the safety questionnaire under staff supervision." },
    { z: "Zone 3", t: "Restricted area", d: "Only people who have passed screening may enter, accompanied by MRI staff." },
    { z: "Zone 4", t: "Scanner room", d: "Where the magnet is. No metal object or device that is not labeled safe may enter." }
  ],

  mriLabels: [
    { a: "MR Safe", d: "Green square. Poses no hazard in the MRI environment." },
    { a: "MR Conditional", d: "Yellow triangle. Safe only under specific conditions set by the manufacturer." },
    { a: "MR Unsafe", d: "Red circle. Must never be taken into the scanner room." }
  ],

  contrast: [
    { t: "Iodinated contrast", u: "CT, angiography and catheter procedures", n: "Kidney function and allergy history are checked before it is used." },
    { t: "Gadolinium contrast", u: "MRI", n: "Kidney function must be assessed, especially in patients with severe kidney failure." },
    { t: "Barium", u: "Imaging of the esophagus, stomach and bowel", n: "Swallowed or given rectally; it passes out in the stool and may change its color for a while." },
    { t: "Microbubbles", u: "Contrast-enhanced ultrasound", n: "Tiny gas bubbles injected into a vein that dissolve quickly." }
  ],

  glossary: [
    { a: "ALARA principle", d: "“As Low As Reasonably Achievable”: getting a diagnostic-quality image with the lowest possible dose." },
    { a: "Ionizing radiation", d: "Radiation with enough energy to remove electrons from atoms, such as X-rays and gamma rays." },
    { a: "Millisievert (mSv)", d: "The unit of effective dose, which estimates the overall risk to the body from radiation." },
    { a: "Gray (Gy)", d: "The unit of absorbed dose: the amount of energy absorbed by tissue." },
    { a: "Background radiation", d: "Radiation we receive every day from the ground, space, food and air. The world average is about 2.4 mSv per year." },
    { a: "Inverse square law", d: "Radiation intensity falls with the square of the distance; doubling the distance cuts the dose to a quarter." },
    { a: "Personal dosimeter (TLD / OSL)", d: "A badge worn by staff to measure the dose they receive over a set period." },
    { a: "Lead apron", d: "A protective garment worn by staff to shield the torso from scattered radiation." },
    { a: "Collimation", d: "Limiting the X-ray beam to the area of interest only, to lower the dose and improve the image." },
    { a: "Contrast agent", d: "A substance given to the patient to make vessels or organs stand out in the image." },
    { a: "Gadolinium", d: "The element MRI contrast agents are made from." },
    { a: "Hounsfield unit (HU)", d: "The density scale in CT: water is zero, air about −1000, and bone has high positive values." },
    { a: "Tesla (T)", d: "The unit of magnetic field strength. Most MRI scanners are 1.5 or 3 tesla." },
    { a: "Transducer (probe)", d: "The part of an ultrasound machine that sends sound waves and receives their echoes." },
    { a: "Doppler", d: "An ultrasound technique that measures the direction and speed of blood flow." },
    { a: "Radiotracer", d: "A small amount of a radioactive substance used in nuclear medicine to follow how an organ works." },
    { a: "Half-life", d: "The time it takes for half of a radioactive substance to decay." },
    { a: "T-score", d: "Compares your bone density with that of a healthy young adult; used to diagnose osteoporosis." },
    { a: "Tomosynthesis", d: "Taking breast images from several angles to build thin slices (3D mammography)." },
    { a: "Biopsy", d: "Taking a small tissue sample to examine under the microscope." },
    { a: "Embolization", d: "Deliberately blocking a blood vessel through a catheter to stop bleeding or cut a tumor’s blood supply." },
    { a: "PACS", d: "Picture Archiving and Communication System: stores, displays and shares medical images digitally." },
    { a: "RIS", d: "Radiology Information System: manages appointments, orders and reports in the radiology department." },
    { a: "DICOM", d: "The international standard for the format of medical images and for exchanging them between devices and systems." },
    { a: "MR Conditional", d: "A device or item that is safe in MRI only under conditions set by its manufacturer." },
    { a: "Justification", d: "The first principle of protection: no exam using radiation is done unless its benefit outweighs its risk." }
  ],

  quiz: [
    { q: "Who discovered X-rays?", o: ["Marie Curie", "Wilhelm Röntgen", "Henri Becquerel", "Godfrey Hounsfield"],
      x: "Röntgen discovered them on 8 November 1895 at the University of Würzburg in Germany." },
    { q: "Which of these exams uses no ionizing radiation?", o: ["CT", "Mammography", "MRI", "Bone densitometry"],
      x: "MRI relies on a magnet and radio waves. Ultrasound also uses no radiation." },
    { q: "If you double your distance from an X-ray source, what happens to the dose?", o: ["It halves", "It drops to a quarter", "It drops to a third", "It stays the same"],
      x: "Under the inverse square law, the dose falls with the square of the distance: 1 ÷ 2² = one quarter." },
    { q: "What does the ALARA principle mean?", o: ["Highest image quality whatever the dose", "Lowest possible dose with a good diagnostic image", "No X-rays for pregnant women", "Repeating the exam to be sure"],
      x: "The aim is an image good enough for diagnosis at the lowest dose that can reasonably be achieved." },
    { q: "Which of these exams has the highest dose?", o: ["Chest X-ray", "Hand X-ray", "Abdomen and pelvis CT", "Bone densitometry"],
      x: "An abdomen and pelvis CT is about 7.7 mSv, roughly equal to 77 chest X-rays." },
    { q: "What does the yellow triangle “MR Conditional” label mean?", o: ["Not allowed in MRI", "Completely safe", "Safe under specific conditions", "Needs contrast"],
      x: "The device is safe only under conditions set by the manufacturer, such as the strength of the magnet." },
    { q: "What is the ICRP annual dose limit for members of the public from artificial sources?", o: ["1 mSv", "5 mSv", "20 mSv", "50 mSv"],
      x: "The limit is 1 mSv per year. It does not include natural background radiation or a patient’s own medical exams." },
    { q: "What is the most important thing to do before any X-ray exam if you might be pregnant?", o: ["Cancel the exam immediately", "Tell the technologist or doctor", "Wear a lead apron", "Drink water"],
      x: "Telling the team lets them choose the most suitable exam, adjust the settings, or postpone it if needed." }
  ]
};
