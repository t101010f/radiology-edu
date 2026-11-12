"""يرسم الرسوم التوضيحية لمنصة الأشعة كملفات SVG أصلية (640x360)."""
import math, os, sys

OUT = sys.argv[1]
LANG = sys.argv[2] if len(sys.argv) > 2 else "ar"
EN = {'أبلغي الفني أولًا': 'Tell the staff first', 'أثر الإشعاع على اللوح': 'Radiation mark', 'أدوات الحماية الشخصية في الأشعة': 'Personal protective equipment in radiology', 'أقل جرعة ممكنة': 'Lowest dose', 'أملاح اليورانيوم': 'Uranium salts', 'أنابيب مضخّمة': 'PM tubes', 'أنبوب الأشعة': 'X-ray tube', 'أنبوب الأشعة يدور': 'Rotating X-ray tube', 'أواخر القرن التاسع عشر': 'Late 19th century', 'أول مقطع للدماغ': 'First brain slice', 'إجراء دقيق': 'Precise procedure', 'إلكترونات': 'Electrons', 'احتمال حمل؟': 'Pregnant?', 'الأرشيف': 'Archive', 'الأشعة السينية': 'X-ray', 'الأشعة العادية': 'X-ray', 'الأشعة المقطعية': 'CT', 'الأوعية الدموية': 'Blood vessels', 'الاستقبال والفحص': 'Reception & screening', 'الجنين': 'Fetus', 'الخاتم يظهر ناصعًا': 'Ring shows bright', 'الرنين': 'MRI', 'الصبغة': 'Contrast', 'الطب': 'Medicine', 'العضو لا شكله فقط': 'not just shape', 'الفيزياء': 'Physics', 'الكاشف': 'Detector', 'الكاشف الرقمي': 'Digital detector', 'الكواشف': 'Detectors', 'المجس': 'Probe', 'المريلة الرصاصية': 'Lead apron', 'المغناطيس الرئيسي': 'Main magnet', 'المنطقة 1': 'Zone 1', 'المنطقة 2': 'Zone 2', 'المنطقة 3': 'Zone 3', 'المنطقة 4': 'Zone 4', 'النظارات الرصاصية': 'Lead glasses', 'الهدف (الأنود)': 'Target (anode)', 'الوعاء يظهر بوضوح في الصورة': 'Vessel shows clearly', 'اليوم العالمي للأشعة': 'Day of Radiology', 'بتوجيه الأشعة': 'guided by imaging', 'بديل بلا إشعاع': 'Radiation-free', 'بقرار الطبيب': 'Doctor decides', 'بلا مريلة أو حاجز أو قياس جرعة': 'No apron, barrier or dosimeter', 'بلّورة وامضة': 'Crystal', 'تأجيل غير العاجل': 'Postpone', 'تصوير وظيفة': 'Shows function,', 'تعديل الإعدادات': 'Adjust dose', 'توهّج الراديوم': 'Radium glow', 'جرعة الجنين ضئيلة': 'Tiny fetal dose', 'جرعة حسب حجم الطفل': 'Dose adjusted to child size', 'حاجز': 'Barrier', 'حاجز رصاصي': 'Lead barrier', 'حركة السرير': 'Table moves', 'حماية الجذع': 'Protects the torso', 'حماية الغدة': 'Protects the thyroid', 'حماية عدسة العين': 'Protects the eye lens', 'خطوط المجال المغناطيسي': 'Magnetic field lines', 'خلف الحاجز': 'Behind barrier', 'سونار أو رنين': 'Ultrasound/MRI', 'شعاع الأشعة السينية': 'X-ray beam', 'شعاعان بطاقتين': 'Two energy beams', 'صورة أوضح بجرعة أقل': 'Clearer image, lower dose', 'صورة الصدر': 'Chest image', 'صورة حية متحركة': 'Live moving image', 'صورة لحظية': 'Real-time image', 'ضاعف المسافة': 'Double distance', 'ضغط لثوانٍ': 'Brief compression', 'طرف القسطرة': 'Catheter tip', 'عامة': 'Public', 'عيادة الطبيب': "Doctor's clinic", 'غرفة الجهاز': 'Scanner room', 'فتحة الجهاز': 'Scanner bore', 'فتحة دخول صغيرة': 'Small entry point', 'فتيل مُسخَّن': 'Heated filament', 'فحص خارج البطن': 'Not abdominal', 'قبل الصبغة': 'Before contrast', 'قريب': 'Close', 'كاشف أشعة جاما': 'Gamma detector', 'لا إشعاع مؤيّن': 'No ionizing radiation', 'لوح الضغط': 'Paddle', 'لوح تصوير مغلّف': 'Wrapped photo plate', 'مادة مشعّة متتبّعة': 'Radioactive tracer', 'مجال مغناطيسي قوي': 'Strong magnetic field', 'محطة القراءة': 'Workstation', 'مقطع عرضي': 'Cross-section', 'مقياس الجرعة': 'Dosimeter', 'مقيّدة': 'Restricted', 'منطقة مشتبهة': 'Suspicious area', 'موجات صوتية وصداها': 'Sound waves and echoes', 'موجّه الأشعة': 'Collimator', 'نوفمبر': 'November', 'واقي الدرقية': 'Thyroid shield', 'يساعد الطبيب ولا يحل محله': 'Assists the radiologist', 'يُرتدى دائمًا': 'Always worn'}
TITLES_EN = {'m-xray': 'X-ray', 'm-ct': 'CT', 'm-mri': 'MRI', 'm-ultrasound': 'Ultrasound', 'm-mammography': 'Mammography', 'm-fluoroscopy': 'Fluoroscopy', 'm-nuclear': 'Nuclear medicine', 'm-interventional': 'Interventional radiology', 'm-dexa': 'Bone densitometry', 'hero': 'A modern radiology department', 'h-1895-hand': 'Illustration of the first X-ray image', 'h-1896-becquerel': "Becquerel's experiment", 'h-1896-early-lab': 'Early X-ray tube without protection', 'h-1898-curie': 'Discovery of radium', 'h-1901-roentgen': 'The first Nobel Prize in Physics', 'h-1979-nobel': 'Nobel Prize in Medicine for CT', 'h-2003-nobel': 'Nobel Prize in Medicine for MRI', 'h-1913-coolidge': 'The Coolidge tube', 'h-1928-icrp': 'Founding of the ICRP', 'h-1957-gamma': 'The gamma camera', 'h-1958-ultrasound': 'Ultrasound in pregnancy', 'h-1971-ct': 'The first CT scan', 'h-1977-mri': 'The first human MRI', 'h-1993-pacs': 'PACS', 'h-2008-children': 'Doses tailored for children', 'h-2012-idor': 'International Day of Radiology', 'h-today-ai': 'AI in radiology', 's-staff': 'Staff protective equipment', 's-children': 'Imaging children', 's-pregnancy': 'Pregnancy and imaging', 's-mri-zones': 'MRI safety zones', 's-contrast': 'Contrast injection', 's-tds': 'Time, distance and shielding'}
W, H = 640, 360
C = dict(bg="#0f1c23", bg2="#16303a", line="#cfe3ea", dim="#8fb3c0", acc="#6fc3d9", amber="#f0b45c",
         green="#6fcf97", red="#f2877f", body="#2c4350", dev="#1f323c", devl="#e3ecef", bone="#e6f1f4")
FONT = "Tajawal, Tahoma, Arial, sans-serif"
FONT_EN = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"

def svg(inner, title):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{title}">
<defs>
<radialGradient id="bgg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="{C['bg2']}"/><stop offset="1" stop-color="{C['bg']}"/></radialGradient>
<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#ffffff" stroke-opacity=".045"/></pattern>
<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{C['amber']}" stop-opacity=".75"/><stop offset="1" stop-color="{C['amber']}" stop-opacity=".08"/></linearGradient>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="soft"><feGaussianBlur stdDeviation="1.2"/></filter>
<marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="{C['acc']}"/></marker>
</defs>
<rect width="{W}" height="{H}" fill="url(#bgg)"/><rect width="{W}" height="{H}" fill="url(#grid)"/>
{inner}
</svg>'''

def T(x, y, s, size=16, color=None, weight=500, anchor="middle"):
    if LANG == "en":
        if s in EN: s = EN[s]
        elif any("\u0600" <= ch <= "\u06ff" for ch in s): raise SystemExit("missing EN: " + s)
        anchor = {"start": "end"}.get(anchor, anchor)
    s = s.replace("&", "&amp;")
    size = round(size * (1.12 if LANG == "en" else 1.3))
    return f'<text x="{x}" y="{y}" font-family="{FONT_EN if LANG == 'en' else FONT}" font-size="{size}" font-weight="{weight}" fill="{color or C["line"]}" text-anchor="{anchor}" direction="{'ltr' if LANG == 'en' else 'rtl'}">{s}</text>'

def M(x, y, s, size=13, color=None, anchor="middle"):
    size = round(size * (1.25 if size < 20 else 1))
    return f'<text x="{x}" y="{y}" font-family="Menlo, Consolas, monospace" font-size="{size}" fill="{color or C["dim"]}" text-anchor="{anchor}">{s}</text>'

def label(px, py, tx, ty, s, size=14):
    """نقطة على العنصر + خط إلى نص"""
    return (f'<circle cx="{px}" cy="{py}" r="3.5" fill="{C["acc"]}"/>'
            f'<path d="M{px} {py}L{tx} {ty}" stroke="{C["acc"]}" stroke-width="1.2" stroke-opacity=".8"/>'
            + T(tx, ty - 6 if ty < py else ty + 16, s, size, C["line"]))

def caption(s):
    return T(W / 2, H - 18, s, 15, C["dim"], 400)

def patient(x, y, w=230, fill=None):
    f = fill or C["body"]
    return (f'<g><circle cx="{x}" cy="{y}" r="17" fill="{f}" stroke="{C["dim"]}" stroke-width="1.5"/>'
            f'<rect x="{x+20}" y="{y-16}" width="{w}" height="32" rx="16" fill="{f}" stroke="{C["dim"]}" stroke-width="1.5"/></g>')

def table(x, y, w, h=10):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{C["devl"]}" fill-opacity=".85"/>'
            f'<rect x="{x+w*0.55}" y="{y+h}" width="40" height="{150-y+190 if y<190 else 60}" fill="{C["dev"]}" stroke="{C["dim"]}" stroke-opacity=".5"/>')

def monitor(x, y, w=120, h=80, inner=""):
    return (f'<g><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="#071015" stroke="{C["dim"]}" stroke-width="2"/>'
            f'<rect x="{x+w/2-6}" y="{y+h}" width="12" height="16" fill="{C["dim"]}"/><rect x="{x+w/2-26}" y="{y+h+16}" width="52" height="5" rx="2" fill="{C["dim"]}"/>'
            f'<g transform="translate({x},{y})">{inner}</g></g>')

def medal(year, field):
    leaves = ""
    for side in (-1, 1):
        for i in range(7):
            a = math.radians(200 + i * 22) if side < 0 else math.radians(-20 - i * 22)
            cx = 320 + side * 0 + 112 * math.cos(a) * side * -1 if False else 320 + 110 * math.cos(a)
            cy = 165 + 110 * math.sin(a) * -1
            rot = math.degrees(a) * -1 + 90
            leaves += f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="7" ry="16" transform="rotate({rot:.1f} {cx:.1f} {cy:.1f})" fill="{C["amber"]}" fill-opacity=".55"/>'
    return (leaves +
            f'<circle cx="320" cy="165" r="88" fill="{C["amber"]}" fill-opacity=".18" stroke="{C["amber"]}" stroke-width="3"/>'
            f'<circle cx="320" cy="165" r="74" fill="none" stroke="{C["amber"]}" stroke-opacity=".5" stroke-dasharray="2 5"/>'
            + M(320, 158, year, 34, C["amber"]) + T(320, 192, field, 18, C["amber"], 700))

# ---------------------------------------------------------------- عناصر الأجهزة
def xray_tube_head(x, y):
    return (f'<rect x="{x-38}" y="{y-26}" width="76" height="40" rx="8" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="2"/>'
            f'<path d="M{x-16} {y+14}h32l-6 12h-20z" fill="{C["devl"]}" fill-opacity=".8"/>'
            f'<rect x="{x-4}" y="{y-110}" width="8" height="84" fill="{C["dim"]}"/>')

def beam(x, y, y2, half):
    return f'<path d="M{x-6} {y}L{x+6} {y}L{x+half} {y2}L{x-half} {y2}z" fill="url(#beam)"/>'

def hand_bones(cx, cy, s=1.0, ring=True):
    """رسم مبسّط لعظام يد (أصلي)"""
    g = []
    bone = C["bone"]
    def b(x, y, w, h, rot=0, op=.9):
        g.append(f'<rect x="{x-w/2:.1f}" y="{y-h/2:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{w/2:.1f}" fill="{bone}" fill-opacity="{op}" transform="rotate({rot} {x:.1f} {y:.1f})"/>')
    # الساعد
    b(cx - 18, cy + 120, 20, 90, 4); b(cx + 16, cy + 122, 16, 86, -3)
    # عظام الرسغ
    for i, (dx, dy) in enumerate([(-24, 64), (-6, 60), (12, 62), (28, 66), (-16, 46), (2, 42), (18, 44), (32, 50)]):
        g.append(f'<circle cx="{cx+dx}" cy="{cy+dy}" r="9" fill="{bone}" fill-opacity=".8"/>')
    fingers = [(-46, 38, -32, [36, 26]), (-24, 34, -10, [46, 30, 22]), (0, 32, 0, [50, 34, 24]), (22, 34, 9, [46, 30, 22]), (42, 40, 18, [38, 24, 18])]
    for i, (dx, dy, ang, segs) in enumerate(fingers):
        a = math.radians(ang)
        ux, uy = math.sin(a), -math.cos(a)
        x0, y0 = cx + dx * 0.45, cy + dy
        meta = 62 if i else 40
        mx, my = x0 + ux * meta / 2, y0 + uy * meta / 2
        b(mx, my, 12, meta, ang)
        px, py = x0 + ux * (meta + 4), y0 + uy * (meta + 4)
        for k, L in enumerate(segs):
            sx, sy = px + ux * L / 2, py + uy * L / 2
            b(sx, sy, 11 - k, L, ang)
            if ring and i == 3 and k == 0:
                g.append(f'<rect x="{sx-11:.1f}" y="{sy-5:.1f}" width="22" height="10" rx="3" fill="#ffffff" transform="rotate({ang} {sx:.1f} {sy:.1f})" filter="url(#glow)"/>')
            px, py = px + ux * (L + 4), py + uy * (L + 4)
    soft = f'<ellipse cx="{cx}" cy="{cy+20}" rx="{95}" ry="{150}" fill="#9fc3cf" fill-opacity=".10" filter="url(#soft)"/>'
    return f'<g transform="translate({cx*(1-s):.1f},{cy*(1-s):.1f}) scale({s})">{soft}{"".join(g)}</g>'

def lungs(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<path d="M-12 -70C-50 -70 -80 -20 -84 40C-86 80 -60 92 -30 84C-14 80 -10 60 -10 30Z" fill="#0a1419" stroke="{C["dim"]}" stroke-width="2"/>'
            f'<path d="M12 -70C50 -70 80 -20 84 40C86 80 60 92 30 84C14 80 10 60 10 30Z" fill="#0a1419" stroke="{C["dim"]}" stroke-width="2"/>'
            + "".join(f'<path d="M-96 {-50+i*22}Q0 {-30+i*22} 96 {-50+i*22}" fill="none" stroke="{C["bone"]}" stroke-opacity=".35" stroke-width="5"/>' for i in range(6))
            + f'<rect x="-7" y="-90" width="14" height="190" rx="5" fill="{C["bone"]}" fill-opacity=".5"/>'
            + f'<path d="M-30 30C-30 60 10 75 28 50C40 30 20 10 0 15Z" fill="{C["bone"]}" fill-opacity=".25"/></g>')

def ct_gantry(cx, cy, r=110, show_parts=True):
    s = (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="3"/>'
         f'<circle cx="{cx}" cy="{cy}" r="{r*0.55}" fill="{C["bg"]}" stroke="{C["dim"]}" stroke-width="2"/>')
    if show_parts:
        s += (f'<circle cx="{cx}" cy="{cy}" r="{r*0.78}" fill="none" stroke="{C["acc"]}" stroke-opacity=".5" stroke-dasharray="6 6"/>'
              f'<rect x="{cx-18}" y="{cy-r*0.78-12}" width="36" height="24" rx="5" fill="{C["amber"]}"/>'
              f'<path d="M{cx-r*0.62} {cy+r*0.5}A{r*0.8} {r*0.8} 0 0 0 {cx+r*0.62} {cy+r*0.5}" fill="none" stroke="{C["green"]}" stroke-width="10" stroke-linecap="round"/>'
              f'<path d="M{cx-10} {cy-r*0.78+12}L{cx-r*0.5} {cy+r*0.62}L{cx+r*0.5} {cy+r*0.62}L{cx+10} {cy-r*0.78+12}z" fill="url(#beam)" opacity=".7"/>'
              f'<path d="M{cx+r*0.95} {cy-r*0.45}A{r*1.05} {r*1.05} 0 0 1 {cx+r*0.95} {cy+r*0.45}" fill="none" stroke="{C["acc"]}" stroke-width="2.5" marker-end="url(#arr)"/>')
    return s

def brain_slice(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})"><ellipse rx="34" ry="40" fill="{C["bone"]}" fill-opacity=".9"/><ellipse rx="29" ry="35" fill="#53666e"/>'
            f'<path d="M0 -35V35" stroke="#2f3e44" stroke-width="2"/><ellipse cx="-8" cy="0" rx="5" ry="10" fill="#1d282d"/><ellipse cx="8" cy="0" rx="5" ry="10" fill="#1d282d"/>'
            f'<circle cx="14" cy="-16" r="7" fill="{C["bone"]}" fill-opacity=".8"/></g>')

def mri_magnet(cx, cy, w=300, h=190, field=True):
    s = ""
    if field:
        for i, k in enumerate([1.15, 1.35, 1.6]):
            s += f'<ellipse cx="{cx}" cy="{cy}" rx="{w*0.5*k}" ry="{h*0.32*k}" fill="none" stroke="{C["acc"]}" stroke-opacity="{.45-i*.12}" stroke-dasharray="5 7"/>'
    s += (f'<rect x="{cx-w/2}" y="{cy-h/2}" width="{w}" height="{h}" rx="34" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="3"/>'
          f'<ellipse cx="{cx}" cy="{cy}" rx="{h*0.36}" ry="{h*0.36}" fill="{C["bg"]}" stroke="{C["dim"]}" stroke-width="2"/>'
          f'<ellipse cx="{cx}" cy="{cy}" rx="{h*0.28}" ry="{h*0.28}" fill="#0a1419"/>')
    return s

# ---------------------------------------------------------------- الرسوم
D = {}

D["m-xray"] = ("الأشعة السينية", xray_tube_head(250, 120) + beam(250, 146, 262, 70)
    + patient(150, 248, 230) + f'<rect x="120" y="266" width="300" height="10" rx="3" fill="{C["devl"]}" fill-opacity=".85"/>'
    + f'<rect x="160" y="278" width="190" height="12" rx="3" fill="{C["green"]}" fill-opacity=".85"/>'
    + label(250, 116, 120, 70, "أنبوب الأشعة") + label(290, 210, 380, 160, "شعاع الأشعة السينية")
    + label(255, 290, 255, 325, "الكاشف الرقمي")
    + monitor(470, 150, 130, 100, lungs(65, 52, 0.42)) + T(535, 305, "صورة الصدر", 14))

D["m-ct"] = ("الأشعة المقطعية", ct_gantry(250, 170, 120)
    + f'<rect x="60" y="176" width="420" height="12" rx="4" fill="{C["devl"]}" fill-opacity=".85"/>' + patient(110, 158, 200)
    + f'<path d="M20 215H100" stroke="{C["acc"]}" stroke-width="2.5" marker-end="url(#arr)"/>' + T(60, 240, "حركة السرير", 13)
    + label(250, 63, 120, 50, "أنبوب الأشعة يدور") + label(320, 238, 330, 312, "الكواشف")
    + monitor(490, 120, 120, 90, brain_slice(60, 45, 0.85)) + T(550, 248, "مقطع عرضي", 14))

D["m-mri"] = ("الرنين المغناطيسي", mri_magnet(280, 160, 300, 200)
    + f'<rect x="80" y="166" width="400" height="12" rx="4" fill="{C["devl"]}" fill-opacity=".85"/>' + patient(110, 148, 210)
    + label(160, 90, 90, 40, "المغناطيس الرئيسي") + label(420, 92, 520, 40, "خطوط المجال المغناطيسي")
    + f'<g transform="translate(520 210)"><circle r="40" fill="none" stroke="{C["green"]}" stroke-width="2"/><path d="M-12 -4h24M-12 8h24" stroke="{C["green"]}" stroke-width="4" stroke-linecap="round"/></g>'
    + T(520, 278, "لا إشعاع مؤيّن", 15, C["green"], 700))

wave = "".join(f'<path d="M{350+i*16} 168a{30+i*14} {30+i*14} 0 0 1 0 {50}" fill="none" stroke="{C["acc"]}" stroke-opacity="{.9-i*.15}" stroke-width="2"/>' for i in range(5))
fan = (f'<path d="M60 10L10 80H110z" fill="#1b2b33"/><ellipse cx="62" cy="52" rx="20" ry="13" fill="#05090b"/>'
       f'<ellipse cx="66" cy="54" rx="7" ry="5" fill="{C["dim"]}"/>')
D["m-ultrasound"] = ("الموجات فوق الصوتية",
    f'<path d="M120 250Q250 130 400 250Z" fill="{C["body"]}" stroke="{C["dim"]}" stroke-width="2"/>'
    + f'<g transform="rotate(25 320 150)"><rect x="300" y="80" width="40" height="80" rx="12" fill="{C["devl"]}"/><rect x="304" y="150" width="32" height="18" rx="6" fill="{C["acc"]}"/>'
    + f'<path d="M320 80Q320 40 360 30" fill="none" stroke="{C["dim"]}" stroke-width="4"/></g>'
    + wave + label(300, 170, 230, 120, "المجس") + label(372, 200, 300, 300, "موجات صوتية وصداها")
    + monitor(470, 120, 130, 100, fan) + T(535, 260, "صورة لحظية", 14))

D["m-mammography"] = ("تصوير الثدي",
    f'<rect x="250" y="40" width="40" height="270" rx="8" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="2"/>'
    + f'<rect x="290" y="60" width="150" height="40" rx="8" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="2"/>'
    + beam(380, 100, 210, 40)
    + f'<rect x="300" y="160" width="160" height="10" rx="3" fill="{C["acc"]}" fill-opacity=".9"/>'
    + f'<path d="M300 172H450Q470 190 450 208H300z" fill="{C["body"]}" stroke="{C["dim"]}" stroke-width="1.5"/>'
    + f'<rect x="300" y="210" width="160" height="14" rx="3" fill="{C["green"]}" fill-opacity=".85"/>'
    + f'<path d="M480 150v20M480 230v-20" stroke="{C["acc"]}" stroke-width="2.5" marker-end="url(#arr)"/>'
    + label(440, 80, 560, 60, "أنبوب الأشعة") + label(460, 165, 560, 130, "لوح الضغط")
    + label(460, 217, 560, 270, "الكاشف") + T(150, 180, "ضغط لثوانٍ", 18, C["line"], 700) + T(150, 206, "صورة أوضح بجرعة أقل", 14, C["dim"]))

carm = (f'<path d="M150 70A120 120 0 0 0 150 310" fill="none" stroke="{C["devl"]}" stroke-width="16" stroke-linecap="round"/>'
        f'<rect x="130" y="250" width="70" height="40" rx="6" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="2"/>'
        f'<rect x="120" y="60" width="90" height="22" rx="5" fill="{C["green"]}" fill-opacity=".85"/>'
        f'<path d="M160 250L130 90H200L172 250z" fill="url(#beam)" transform="rotate(180 165 170)"/>')
D["m-fluoroscopy"] = ("الأشعة التلفزيونية", carm
    + f'<rect x="200" y="176" width="200" height="10" rx="3" fill="{C["devl"]}" fill-opacity=".85"/>' + patient(230, 160, 160)
    + label(165, 270, 90, 330, "أنبوب الأشعة") + label(165, 70, 80, 40, "الكاشف")
    + monitor(450, 90, 150, 110, f'<path d="M75 10C60 40 90 60 70 100" fill="none" stroke="{C["bone"]}" stroke-width="10" stroke-linecap="round" stroke-opacity=".8"/>'
      + f'<circle cx="20" cy="15" r="4" fill="{C["red"]}"/>' + M(40, 19, "LIVE", 10, C["red"]))
    + T(525, 240, "صورة حية متحركة", 14))

dots = "".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{C["amber"]}" filter="url(#glow)"/>' for x, y, r in [(260, 205, 6), (300, 210, 4), (340, 200, 5), (380, 208, 3)])
D["m-nuclear"] = ("الطب النووي",
    f'<rect x="200" y="70" width="240" height="56" rx="10" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="2"/>'
    + f'<rect x="200" y="252" width="240" height="56" rx="10" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="2"/>'
    + f'<rect x="140" y="226" width="360" height="10" rx="3" fill="{C["devl"]}" fill-opacity=".85"/>' + patient(170, 208, 260) + dots
    + "".join(f'<path d="M{x} {195}V132" stroke="{C["amber"]}" stroke-dasharray="3 5" stroke-width="1.5"/>' for x in (260, 340))
    + label(440, 98, 540, 70, "كاشف أشعة جاما") + label(300, 210, 540, 200, "مادة مشعّة متتبّعة")
    + T(110, 70, "تصوير وظيفة", 18, C["line"], 700) + T(110, 95, "العضو لا شكله فقط", 14, C["dim"]))

vessels = (f'<path d="M320 40V300M320 120L250 190M320 120L390 180M250 190L230 260M250 190L280 270M390 180L370 270M390 180L420 250" '
           f'fill="none" stroke="{C["red"]}" stroke-opacity=".7" stroke-width="7" stroke-linecap="round"/>')
D["m-interventional"] = ("الأشعة التداخلية",
    f'<path d="M260 30Q320 10 380 30L410 330H230Z" fill="{C["body"]}" fill-opacity=".5" stroke="{C["dim"]}"/>' + vessels
    + f'<path d="M320 300V120L390 180L404 215" fill="none" stroke="{C["acc"]}" stroke-width="3" stroke-dasharray="1 0"/>'
    + f'<circle cx="404" cy="215" r="8" fill="{C["acc"]}" filter="url(#glow)"/>'
    + label(404, 215, 520, 240, "طرف القسطرة") + label(320, 290, 160, 310, "فتحة دخول صغيرة")
    + label(250, 190, 140, 150, "الأوعية الدموية") + T(530, 120, "إجراء دقيق", 18, C["line"], 700) + T(530, 146, "بتوجيه الأشعة", 14, C["dim"]))

D["m-dexa"] = ("قياس كثافة العظام",
    f'<rect x="80" y="220" width="460" height="16" rx="4" fill="{C["devl"]}" fill-opacity=".85"/>'
    + f'<rect x="440" y="236" width="30" height="80" fill="{C["dev"]}"/>' + patient(110, 202, 330)
    + f'<path d="M300 100V60H480V250" fill="none" stroke="{C["devl"]}" stroke-width="12" stroke-linecap="round"/>'
    + f'<rect x="270" y="100" width="60" height="26" rx="6" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="2"/>'
    + f'<path d="M300 126V190" stroke="{C["amber"]}" stroke-width="3" stroke-dasharray="4 4"/><path d="M290 126V190" stroke="{C["acc"]}" stroke-width="3" stroke-dasharray="4 4"/>'
    + label(300, 113, 170, 70, "شعاعان بطاقتين") + f'<path d="M260 150H360" stroke="{C["acc"]}" stroke-width="2" marker-end="url(#arr)" marker-start="url(#arr)"/>'
    + f'<g transform="translate(560 150)"><rect x="-50" y="-40" width="100" height="80" rx="8" fill="#071015" stroke="{C["dim"]}"/>' + M(0, -12, "T-score", 12) + M(0, 18, "−1.8", 22, C["amber"]) + "</g>")

D["hero"] = ("قسم أشعة حديث", ct_gantry(230, 170, 130, True)
    + f'<rect x="20" y="178" width="400" height="12" rx="4" fill="{C["devl"]}" fill-opacity=".85"/>' + patient(60, 160, 170)
    + monitor(450, 60, 160, 110, lungs(80, 58, 0.44)) + monitor(470, 215, 120, 70, brain_slice(60, 35, 0.7)))

# ---- التاريخ
D["h-1895-hand"] = ("رسم توضيحي لأول صورة أشعة", f'<rect x="170" y="20" width="300" height="320" rx="6" fill="#0a1419" stroke="{C["dim"]}" stroke-opacity=".5"/>'
    + hand_bones(320, 170, 0.85) + M(460, 330, "1895", 14, C["dim"], "end") + label(372, 92, 520, 70, "الخاتم يظهر ناصعًا"))

D["h-1896-becquerel"] = ("تجربة بيكريل",
    f'<rect x="170" y="150" width="300" height="150" rx="6" fill="#20313a" stroke="{C["dim"]}" stroke-width="2"/>'
    + f'<ellipse cx="320" cy="225" rx="70" ry="40" fill="#05090b" filter="url(#soft)" opacity=".85"/>'
    + f'<rect x="280" y="110" width="80" height="50" rx="4" fill="{C["green"]}" fill-opacity=".7"/>'
    + "".join(f'<path d="M{300+i*10} 160L{290+i*14} 200" stroke="{C["amber"]}" stroke-opacity=".7" stroke-width="2"/>' for i in range(5))
    + label(360, 125, 480, 80, "أملاح اليورانيوم") + label(470, 270, 540, 300, "لوح تصوير مغلّف")
    + label(260, 225, 120, 260, "أثر الإشعاع على اللوح"))

crookes = (f'<ellipse cx="320" cy="170" rx="150" ry="60" fill="{C["acc"]}" fill-opacity=".12" stroke="{C["devl"]}" stroke-width="2.5"/>'
           f'<path d="M170 170H120M470 170H520" stroke="{C["devl"]}" stroke-width="5"/>'
           f'<rect x="190" y="150" width="14" height="40" fill="{C["dim"]}"/><path d="M410 140L440 170L410 200z" fill="{C["dim"]}"/>'
           f'<ellipse cx="320" cy="170" rx="120" ry="40" fill="{C["green"]}" fill-opacity=".18" filter="url(#glow)"/>')
D["h-1896-early-lab"] = ("أنبوب أشعة مبكر بلا حماية", crookes
    + f'<path d="M320 230L250 320H390z" fill="url(#beam)"/>' + f'<path d="M300 260h40v50h-40z" fill="none" stroke="{C["red"]}" stroke-width="2" stroke-dasharray="4 4"/>'
    + label(400, 290, 480, 300, "بلا مريلة أو حاجز أو قياس جرعة", 12.5) + T(320, 60, "أواخر القرن التاسع عشر", 16, C["dim"]))

D["h-1898-curie"] = ("اكتشاف الراديوم", f'<path d="M260 120h30v60l40 90q6 20-14 20h-82q-20 0-14-20l40-90z" fill="{C["acc"]}" fill-opacity=".12" stroke="{C["devl"]}" stroke-width="2.5" transform="translate(-20 0)"/>'
    + f'<path d="M230 240q30 -10 82 0l14 30q6 20-14 20h-82q-20 0-14-20z" fill="{C["green"]}" fill-opacity=".55" filter="url(#glow)" transform="translate(-20 0)"/>'
    + "".join(f'<rect x="{390+i*40}" y="{130+i*6}" width="18" height="{140-i*6}" rx="9" fill="{C["acc"]}" fill-opacity=".12" stroke="{C["devl"]}" stroke-width="2"/>' for i in range(3))
    + M(310, 80, "Ra · Po", 28, C["green"]) + label(270, 260, 140, 300, "توهّج الراديوم"))

D["h-1901-roentgen"] = ("أول جائزة نوبل في الفيزياء", medal("1901", "الفيزياء"))
D["h-1979-nobel"] = ("نوبل في الطب عن الأشعة المقطعية", medal("1979", "الطب"))
D["h-2003-nobel"] = ("نوبل في الطب عن الرنين المغناطيسي", medal("2003", "الطب"))

D["h-1913-coolidge"] = ("أنبوب كوليدج", f'<ellipse cx="320" cy="150" rx="190" ry="70" fill="{C["acc"]}" fill-opacity=".08" stroke="{C["devl"]}" stroke-width="2.5"/>'
    + f'<path d="M130 150H70M510 150H570" stroke="{C["devl"]}" stroke-width="6"/>'
    + f'<path d="M170 140q8 -14 16 0t16 0t16 0" fill="none" stroke="{C["amber"]}" stroke-width="3" filter="url(#glow)"/>'
    + f'<path d="M430 110L470 150L430 190z" fill="{C["dim"]}"/>'
    + "".join(f'<circle cx="{240+i*36}" cy="{150+(i%2)*6-3}" r="4" fill="{C["acc"]}"/>' for i in range(5))
    + f'<path d="M230 150H410" stroke="{C["acc"]}" stroke-width="1.5" stroke-dasharray="3 6" marker-end="url(#arr)"/>'
    + f'<path d="M445 160L380 320H500z" fill="url(#beam)"/>'
    + label(195, 140, 160, 60, "فتيل مُسخَّن") + label(300, 147, 300, 60, "إلكترونات") + label(440, 130, 540, 60, "الهدف (الأنود)")
    + label(450, 260, 560, 290, "الأشعة السينية"))

def trefoil(cx, cy, r, color):
    s = f'<circle cx="{cx}" cy="{cy}" r="{r*0.22}" fill="{color}"/>'
    for k in range(3):
        a0 = math.radians(-90 + k * 120 - 30); a1 = math.radians(-90 + k * 120 + 30)
        r1, r2 = r * 0.32, r
        p = (f'M{cx+r1*math.cos(a0):.1f} {cy+r1*math.sin(a0):.1f}L{cx+r2*math.cos(a0):.1f} {cy+r2*math.sin(a0):.1f}'
             f'A{r2} {r2} 0 0 1 {cx+r2*math.cos(a1):.1f} {cy+r2*math.sin(a1):.1f}L{cx+r1*math.cos(a1):.1f} {cy+r1*math.sin(a1):.1f}'
             f'A{r1} {r1} 0 0 0 {cx+r1*math.cos(a0):.1f} {cy+r1*math.sin(a0):.1f}z')
        s += f'<path d="{p}" fill="{color}"/>'
    return s
shield = f'<path d="M420 90l70 26v50c0 40-30 70-70 80-40-10-70-40-70-80v-50z" fill="{C["green"]}" fill-opacity=".2" stroke="{C["green"]}" stroke-width="3"/><path d="M393 168l20 20 36-40" fill="none" stroke="{C["green"]}" stroke-width="6" stroke-linecap="round"/>'
D["h-1928-icrp"] = ("تأسيس اللجنة الدولية للوقاية من الإشعاع", f'<circle cx="220" cy="165" r="96" fill="{C["amber"]}" fill-opacity=".9"/>' + trefoil(220, 165, 80, "#1a1406") + shield
    + M(320, 320, "ICRP · 1928", 18, C["dim"]))

D["h-1957-gamma"] = ("كاميرا جاما", f'<rect x="170" y="60" width="300" height="150" rx="12" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="2"/>'
    + "".join(f'<rect x="{190+i*48}" y="80" width="36" height="60" rx="6" fill="{C["dim"]}" fill-opacity=".5"/>' for i in range(6))
    + f'<rect x="185" y="150" width="270" height="18" fill="{C["acc"]}" fill-opacity=".55"/>'
    + "".join(f'<rect x="{185+i*9}" y="172" width="4" height="30" fill="{C["dim"]}"/>' for i in range(30))
    + "".join(f'<path d="M{x} 300L{x} 210" stroke="{C["amber"]}" stroke-dasharray="3 5" stroke-width="2"/>' for x in (260, 330, 390))
    + "".join(f'<circle cx="{x}" cy="305" r="7" fill="{C["amber"]}" filter="url(#glow)"/>' for x in (260, 330, 390))
    + label(470, 110, 560, 80, "أنابيب مضخّمة") + label(455, 159, 560, 160, "بلّورة وامضة") + label(455, 190, 560, 240, "موجّه الأشعة"))

D["h-1958-ultrasound"] = ("الموجات فوق الصوتية في الحمل",
    f'<path d="M140 290Q320 60 500 290Z" fill="{C["body"]}" stroke="{C["dim"]}" stroke-width="2"/>'
    + f'<ellipse cx="330" cy="235" rx="60" ry="38" fill="#0a1419"/><circle cx="305" cy="228" r="16" fill="{C["dim"]}"/><ellipse cx="345" cy="240" rx="28" ry="14" fill="{C["dim"]}"/>'
    + f'<g transform="rotate(-20 300 110)"><rect x="285" y="40" width="34" height="70" rx="10" fill="{C["devl"]}"/></g>'
    + "".join(f'<path d="M{306-i*0} {130+i*14}a{20+i*12} 8 0 0 0 {50+i*10} 0" fill="none" stroke="{C["acc"]}" stroke-opacity="{.9-i*.18}" stroke-width="2"/>' for i in range(4))
    + label(330, 235, 520, 210, "الجنين") + label(300, 80, 160, 60, "المجس") + M(320, 335, "1958", 14))

D["h-1971-ct"] = ("أول فحص أشعة مقطعية", ct_gantry(230, 170, 120)
    + monitor(450, 100, 150, 110, brain_slice(75, 55, 1.1)) + T(525, 250, "أول مقطع للدماغ", 14) + M(230, 330, "1971", 16))

D["h-1977-mri"] = ("أول رنين لإنسان", mri_magnet(320, 165, 320, 210) + M(320, 335, "1977", 16)
    + label(420, 80, 540, 40, "مجال مغناطيسي قوي") + label(320, 165, 520, 300, "فتحة الجهاز"))

def box(x, y, w, h, s, col):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{C["dev"]}" stroke="{col}" stroke-width="2"/>' + T(x + w / 2, y + h / 2 + 6, s, 13)
D["h-1993-pacs"] = ("نظام أرشفة الصور PACS",
    box(30, 50, 140, 50, "الأشعة المقطعية", C["acc"]) + box(30, 155, 140, 50, "الرنين", C["acc"]) + box(30, 260, 140, 50, "الأشعة العادية", C["acc"])
    + box(250, 140, 140, 80, "", C["amber"]) + M(320, 178, "PACS", 22, C["amber"]) + T(320, 204, "الأرشيف", 13, C["dim"])
    + box(470, 60, 140, 60, "محطة القراءة", C["green"]) + box(470, 240, 140, 60, "عيادة الطبيب", C["green"])
    + "".join(f'<path d="M172 {y}C210 {y} 210 180 248 180" fill="none" stroke="{C["acc"]}" stroke-width="2" marker-end="url(#arr)"/>' for y in (75, 180, 285))
    + "".join(f'<path d="M392 180C430 180 430 {y} 468 {y}" fill="none" stroke="{C["acc"]}" stroke-width="2" marker-end="url(#arr)"/>' for y in (90, 270))
    + M(210, 130, "DICOM", 12, C["acc"]) + M(430, 130, "DICOM", 12, C["acc"]))

def gauge(cx, cy, val, col):
    a = math.radians(180 + 180 * val)
    return (f'<path d="M{cx-60} {cy}A60 60 0 0 1 {cx+60} {cy}" fill="none" stroke="{C["dim"]}" stroke-opacity=".4" stroke-width="14"/>'
            f'<path d="M{cx-60} {cy}A60 60 0 0 1 {cx+60*math.cos(a):.1f} {cy+60*math.sin(a):.1f}" fill="none" stroke="{col}" stroke-width="14"/>'
            f'<path d="M{cx} {cy}L{cx+48*math.cos(a):.1f} {cy+48*math.sin(a):.1f}" stroke="{C["line"]}" stroke-width="3" stroke-linecap="round"/><circle cx="{cx}" cy="{cy}" r="6" fill="{C["line"]}"/>')
D["h-2008-children"] = ("جرعات مخصّصة للأطفال", xray_tube_head(200, 120) + beam(200, 146, 240, 34)
    + f'<rect x="110" y="250" width="200" height="10" rx="3" fill="{C["devl"]}" fill-opacity=".85"/>' + patient(150, 234, 100)
    + gauge(470, 200, 0.25, C["green"]) + T(470, 240, "جرعة حسب حجم الطفل", 15) + M(410, 214, "low", 11) + M(530, 214, "high", 11))

D["h-2012-idor"] = ("اليوم العالمي للأشعة", f'<rect x="200" y="60" width="240" height="240" rx="16" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="2"/>'
    + f'<rect x="200" y="60" width="240" height="56" rx="16" fill="{C["acc"]}"/><rect x="200" y="96" width="240" height="20" fill="{C["acc"]}"/>'
    + T(320, 98, "نوفمبر", 24, "#0b1216", 800) + M(320, 230, "8", 110, C["line"]) + T(320, 280, "اليوم العالمي للأشعة", 15, C["dim"]))

nodes = ""
for li, n in enumerate([3, 4, 2]):
    for k in range(n):
        x, y = 470 + li * 60, 180 + (k - (n - 1) / 2) * 44
        nodes += f'<circle cx="{x}" cy="{y}" r="9" fill="{C["acc"]}"/>'
        if li < 2:
            n2 = [3, 4, 2][li + 1]
            for j in range(n2):
                nodes += f'<path d="M{x} {y}L{x+60} {180+(j-(n2-1)/2)*44}" stroke="{C["acc"]}" stroke-opacity=".3"/>'
D["h-today-ai"] = ("الذكاء الاصطناعي في الأشعة", lungs(220, 175, 1.1)
    + f'<rect x="230" y="190" width="70" height="60" rx="4" fill="none" stroke="{C["amber"]}" stroke-width="3" stroke-dasharray="7 5"/>'
    + T(265, 310, "منطقة مشتبهة", 13, C["amber"]) + nodes + T(530, 300, "يساعد الطبيب ولا يحل محله", 14, C["dim"]))

# ---- الوقاية
def icon_card(x, y, title, sub, inner, col):
    return (f'<rect x="{x}" y="{y}" width="140" height="150" rx="12" fill="{C["dev"]}" stroke="{col}" stroke-width="1.5"/>'
            f'<g transform="translate({x+70},{y+58})">{inner}</g>' + T(x + 70, y + 118, title, 11.5, C["line"], 700) + T(x + 70, y + 138, sub, 10, C["dim"], 400))
apron = f'<path d="M-24 -38h48l10 70h-68z" fill="{C["dim"]}"/><path d="M-24 -38q24 18 48 0" fill="none" stroke="{C["bg"]}" stroke-width="3"/>'
collar = f'<path d="M-34 -6q34 30 68 0v14q-34 30-68 0z" fill="{C["dim"]}"/>'
glasses = f'<circle cx="-18" cy="0" r="14" fill="none" stroke="{C["dim"]}" stroke-width="5"/><circle cx="18" cy="0" r="14" fill="none" stroke="{C["dim"]}" stroke-width="5"/><path d="M-4 0h8" stroke="{C["dim"]}" stroke-width="4"/>'
badge = f'<rect x="-18" y="-28" width="36" height="50" rx="5" fill="{C["dim"]}"/><circle cx="0" cy="-2" r="9" fill="{C["amber"]}"/><rect x="-6" y="-38" width="12" height="12" rx="2" fill="none" stroke="{C["dim"]}" stroke-width="3"/>'
D["s-staff"] = ("أدوات حماية العاملين", icon_card(20, 90, "المريلة الرصاصية", "حماية الجذع", apron, C["acc"]) + icon_card(175, 90, "واقي الدرقية", "حماية الغدة", collar, C["acc"])
    + icon_card(330, 90, "النظارات الرصاصية", "حماية عدسة العين", glasses, C["acc"]) + icon_card(485, 90, "مقياس الجرعة", "يُرتدى دائمًا", badge, C["amber"])
    + T(320, 55, "أدوات الحماية الشخصية في الأشعة", 20, C["line"], 800))

D["s-children"] = ("تصوير الأطفال", D["h-2008-children"][1])

opt = lambda x, y, s, col: f'<rect x="{x}" y="{y}" width="130" height="54" rx="10" fill="{C["dev"]}" stroke="{col}" stroke-width="2"/>' + T(x + 65, y + 33, s, 11.5)
D["s-pregnancy"] = ("الحمل وفحوصات الأشعة", f'<rect x="230" y="30" width="180" height="62" rx="12" fill="{C["amber"]}" fill-opacity=".2" stroke="{C["amber"]}" stroke-width="2"/>'
    + T(320, 58, "احتمال حمل؟", 18, C["amber"], 800) + T(320, 80, "أبلغي الفني أولًا", 13, C["line"])
    + "".join(f'<path d="M320 94C320 140 {x} 140 {x} 186" fill="none" stroke="{C["acc"]}" stroke-width="2" marker-end="url(#arr)"/>' for x in (95, 245, 395, 545))
    + opt(30, 190, "بديل بلا إشعاع", C["green"]) + opt(180, 190, "تعديل الإعدادات", C["acc"]) + opt(330, 190, "فحص خارج البطن", C["acc"]) + opt(480, 190, "تأجيل غير العاجل", C["acc"])
    + T(95, 270, "سونار أو رنين", 12, C["dim"]) + T(245, 270, "أقل جرعة ممكنة", 12, C["dim"]) + T(395, 270, "جرعة الجنين ضئيلة", 12, C["dim"]) + T(545, 270, "بقرار الطبيب", 12, C["dim"]))

zones = ""
for i, (r, col) in enumerate([(160, C["green"]), (122, C["acc"]), (84, C["amber"]), (46, C["red"])]):
    zones += f'<rect x="{220-r*1.25}" y="{180-r}" width="{r*2.5}" height="{r*2}" rx="14" fill="{col}" fill-opacity=".14" stroke="{col}" stroke-width="2"/>'
zones += f'<circle cx="220" cy="180" r="24" fill="{C["dev"]}" stroke="{C["devl"]}" stroke-width="3"/><circle cx="220" cy="180" r="11" fill="#0a1419"/>'
legend = "".join(f'<rect x="602" y="{70+i*58}" width="18" height="18" rx="4" fill="{c}"/>' + T(592, 84 + i * 58, t, 15, C["line"], 700, "start") + T(592, 104 + i * 58, s, 12, C["dim"], 400, "start")
                 for i, (c, t, s) in enumerate([(C["green"], "المنطقة 1", "عامة"), (C["acc"], "المنطقة 2", "الاستقبال والفحص"), (C["amber"], "المنطقة 3", "مقيّدة"), (C["red"], "المنطقة 4", "غرفة الجهاز")]))
D["s-mri-zones"] = ("مناطق الأمان في الرنين", zones + legend)

D["s-contrast"] = ("حقن الصبغة", f'<path d="M60 180H580" stroke="{C["red"]}" stroke-opacity=".35" stroke-width="40" stroke-linecap="round"/>'
    + f'<path d="M300 180H580" stroke="{C["acc"]}" stroke-width="22" stroke-linecap="round" filter="url(#glow)" opacity=".85"/>'
    + f'<g transform="rotate(-30 250 120)"><rect x="150" y="100" width="150" height="38" rx="6" fill="{C["acc"]}" fill-opacity=".2" stroke="{C["devl"]}" stroke-width="2"/>'
    + f'<rect x="210" y="104" width="86" height="30" fill="{C["acc"]}" fill-opacity=".6"/><path d="M300 119H350" stroke="{C["devl"]}" stroke-width="3"/>'
    + f'<path d="M150 104v30M120 119H150" stroke="{C["devl"]}" stroke-width="6"/></g>'
    + label(250, 110, 150, 60, "الصبغة") + label(470, 180, 470, 290, "الوعاء يظهر بوضوح في الصورة") + label(150, 180, 150, 290, "قبل الصبغة"))

# جديد: الزمن والمسافة والحاجز
person = lambda x, y, col: f'<circle cx="{x}" cy="{y-46}" r="13" fill="{col}"/><rect x="{x-14}" y="{y-30}" width="28" height="52" rx="12" fill="{col}"/>'
src = f'<circle cx="0" cy="0" r="16" fill="{C["amber"]}" filter="url(#glow)"/>'
D["s-tds"] = ("الزمن والمسافة والحاجز",
    f'<g transform="translate(60 180)">{src}</g>' + "".join(f'<circle cx="60" cy="180" r="{r}" fill="none" stroke="{C["amber"]}" stroke-opacity="{.5-i*.1}"/>' for i, r in enumerate((50, 100, 150, 200)))
    + person(180, 200, C["red"]) + person(330, 200, C["amber"]) + f'<rect x="440" y="110" width="16" height="130" rx="3" fill="{C["dim"]}"/>' + person(520, 200, C["green"])
    + M(180, 260, "1 m · 100%", 13) + M(330, 260, "2 m · 25%", 13) + T(520, 264, "خلف الحاجز", 13, C["dim"])
    + T(180, 300, "قريب", 15) + T(330, 300, "ضاعف المسافة", 15) + T(500, 300, "حاجز رصاصي", 15) + T(448, 100, "حاجز", 13, C["dim"]))

for k, (title, inner) in D.items():
    if LANG == "en":
        title = TITLES_EN[k]
    with open(os.path.join(OUT, k + ("-en" if LANG == "en" else "") + ".svg"), "w", encoding="utf8") as f:
        f.write(svg(inner, title))
print(len(D), "illustrations")
