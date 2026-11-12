/* نماذج ثلاثية الأبعاد لأجهزة الأشعة — 3D models of imaging equipment.
   كل نموذج مبني بالكود بخامات واقعية وإضاءة استوديو، ويُستخدم في:
   1) الصور المُصيَّرة للبطاقات (tools/render3d.html)
   2) العارض التفاعلي في صفحة كل نوع (js/viewer3d.js) */
import * as THREE from "three";
import { RoundedBoxGeometry } from "./vendor/addons/RoundedBoxGeometry.js";
import { RoomEnvironment } from "./vendor/addons/RoomEnvironment.js";

/* ---------------------------------------------------------------- الخامات */
let M = null;
function materials() {
  if (M) return M;
  const phys = (o) => new THREE.MeshPhysicalMaterial(o);
  const std = (o) => new THREE.MeshStandardMaterial(o);
  M = {
    shell: phys({ color: 0xf4f6f8, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.18 }),
    shell2: phys({ color: 0xdfe5ea, roughness: 0.38, clearcoat: 0.4, clearcoatRoughness: 0.3 }),
    trim: std({ color: 0xaeb9c3, roughness: 0.35, metalness: 0.15 }),
    dark: phys({ color: 0x1d2932, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.25 }),
    graphite: std({ color: 0x3a4652, roughness: 0.55 }),
    bore: std({ color: 0xc9d2d9, roughness: 0.6, side: THREE.BackSide }),
    accent: std({ color: 0x2aa6ff, emissive: 0x2aa6ff, emissiveIntensity: 2.4, roughness: 0.4 }),
    accentSoft: std({ color: 0x8fd3ff, emissive: 0x5cc0ff, emissiveIntensity: 1.2, roughness: 0.4 }),
    cushion: phys({ color: 0x2c3e4f, roughness: 0.8, sheen: 0.6, sheenColor: 0x6688aa }),
    sheet: std({ color: 0xf1f5f8, roughness: 0.92 }),
    metal: std({ color: 0xc9cfd5, roughness: 0.22, metalness: 1 }),
    chrome: std({ color: 0xeef2f5, roughness: 0.08, metalness: 1 }),
    rubber: std({ color: 0x1b1f23, roughness: 0.9 }),
    glass: phys({ color: 0xe6f6ff, roughness: 0.04, transmission: 0.92, thickness: 0.02, ior: 1.49, transparent: true }),
    leadGlass: phys({ color: 0xd7ecf2, roughness: 0.03, transmission: 0.85, thickness: 0.05, ior: 1.6, transparent: true }),
    floor: std({ color: 0xd3dbe2, roughness: 0.7 }),
    gold: std({ color: 0xd9a441, roughness: 0.28, metalness: 1 })
  };
  return M;
}

/* ---------------------------------------------------------------- أدوات الهندسة */
function rbox(w, h, d, r, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, Math.min(r, w / 2, h / 2, d / 2) - 1e-4), mat);
  m.position.set(x, y, z); return m;
}
function cyl(rt, rb, h, mat, seg = 48) { return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); }
function roundedRectShape(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
/** لوح بفتحة دائرية (غطاء الجهاز) — slab with a round bore, extruded along z */
function boreSlab(w, h, r, hole, depth, mat, bevel = 0.06) {
  const s = roundedRectShape(w, h, r);
  const p = new THREE.Path(); p.absarc(0, 0, hole, 0, Math.PI * 2, true); s.holes.push(p);
  const g = new THREE.ExtrudeGeometry(s, { depth: depth - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 8, curveSegments: 96 });
  g.translate(0, 0, -(depth - bevel * 2) / 2);
  return new THREE.Mesh(g, mat);
}
function torus(R, r, mat, arc = Math.PI * 2, rs = 24, ts = 128) { return new THREE.Mesh(new THREE.TorusGeometry(R, r, rs, ts, arc), mat); }
function canvasTex(w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function screen(w, h, tex, glow = 1) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: new THREE.Color(glow, glow, glow) }));
  return m;
}
function monitor(w, h, tex) {
  const g = new THREE.Group(), mt = materials();
  g.add(rbox(w + 0.04, h + 0.04, 0.035, 0.012, mt.dark));
  const s = screen(w, h, tex); s.position.z = 0.0185; g.add(s);
  return g;
}

/* ---------------------------------------------------------------- صور الشاشات */
let TX = null;
function textures() {
  if (TX) return TX;
  const noise = (ctx, w, h, a) => { const d = ctx.getImageData(0, 0, w, h); for (let i = 0; i < d.data.length; i += 4) { const n = (Math.random() - 0.5) * a; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; } ctx.putImageData(d, 0, 0); };
  TX = {
    chest: canvasTex(512, 512, (c, w, h) => {
      c.fillStyle = "#050607"; c.fillRect(0, 0, w, h);
      const g = c.createRadialGradient(256, 270, 40, 256, 270, 260); g.addColorStop(0, "#5a5f63"); g.addColorStop(1, "#16191b");
      c.fillStyle = g; c.beginPath(); c.ellipse(256, 280, 210, 230, 0, 0, 7); c.fill();
      c.fillStyle = "#0b0d0e";
      c.beginPath(); c.ellipse(170, 270, 78, 150, 0.08, 0, 7); c.fill(); c.beginPath(); c.ellipse(342, 270, 78, 150, -0.08, 0, 7); c.fill();
      c.filter = "blur(2px)"; c.strokeStyle = "rgba(220,225,228,.55)"; c.lineWidth = 9;
      for (let i = 0; i < 7; i++) { c.beginPath(); c.ellipse(256, 150 + i * 36, 175, 40, 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke(); }
      c.fillStyle = "rgba(225,228,230,.75)"; c.fillRect(244, 70, 24, 400);
      c.beginPath(); c.ellipse(285, 340, 70, 80, 0.4, 0, 7); c.fill();
      c.filter = "none"; noise(c, w, h, 18);
    }),
    ct: canvasTex(512, 512, (c, w, h) => {
      c.fillStyle = "#020303"; c.fillRect(0, 0, w, h);
      c.fillStyle = "#e8eaeb"; c.beginPath(); c.ellipse(256, 256, 170, 205, 0, 0, 7); c.fill();
      c.fillStyle = "#6f7477"; c.beginPath(); c.ellipse(256, 256, 152, 187, 0, 0, 7); c.fill();
      c.filter = "blur(3px)"; c.fillStyle = "#8a8f92";
      for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2; c.beginPath(); c.ellipse(256 + Math.cos(a) * 125, 256 + Math.sin(a) * 155, 22, 12, a, 0, 7); c.fill(); }
      c.fillStyle = "#1b1e20"; c.beginPath(); c.ellipse(232, 250, 14, 48, 0.15, 0, 7); c.fill(); c.beginPath(); c.ellipse(280, 250, 14, 48, -0.15, 0, 7); c.fill();
      c.filter = "none"; c.strokeStyle = "#3d4245"; c.lineWidth = 3; c.beginPath(); c.moveTo(256, 70); c.lineTo(256, 440); c.stroke(); noise(c, w, h, 14);
    }),
    us: canvasTex(512, 384, (c, w, h) => {
      c.fillStyle = "#020304"; c.fillRect(0, 0, w, h);
      c.save(); c.beginPath(); c.moveTo(256, 20); c.arc(256, 20, 340, Math.PI * 0.3, Math.PI * 0.7); c.closePath(); c.clip();
      for (let i = 0; i < 9000; i++) { const x = Math.random() * w, y = Math.random() * h, v = 40 + Math.random() * 120 * (1 - y / h * 0.5); c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(x, y, 2 + Math.random() * 3, 1.5); }
      c.filter = "blur(1px)"; c.fillStyle = "#050607"; c.beginPath(); c.ellipse(250, 210, 70, 46, 0.2, 0, 7); c.fill();
      c.fillStyle = "rgba(200,200,200,.6)"; c.beginPath(); c.ellipse(262, 216, 26, 18, 0, 0, 7); c.fill(); c.restore();
      c.fillStyle = "#4fc3f7"; c.font = "16px sans-serif"; c.fillText("8.0 MHz", 18, 30);
    }),
    ui: canvasTex(512, 320, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#0f2333"); g.addColorStop(1, "#08131c"); c.fillStyle = g; c.fillRect(0, 0, w, h);
      const cols = ["#34c759", "#0a84ff", "#ff9f0a", "#5ac8fa"];
      for (let i = 0; i < 4; i++) { c.fillStyle = "#14324a"; c.fillRect(24 + i * 120, 30, 104, 70); c.fillStyle = cols[i]; c.fillRect(24 + i * 120, 84, 104, 16); }
      c.strokeStyle = "#5ac8fa"; c.lineWidth = 3; c.beginPath(); for (let x = 0; x < 460; x += 4) c.lineTo(24 + x, 220 + Math.sin(x / 18) * 26 * Math.sin(x / 90)); c.stroke();
      c.fillStyle = "#1f4b6b"; for (let i = 0; i < 6; i++) c.fillRect(24 + i * 78, 270, 66, 26);
    }),
    spect: canvasTex(512, 512, (c, w, h) => {
      c.fillStyle = "#000"; c.fillRect(0, 0, w, h);
      const blob = (x, y, rx, ry, col) => { const g = c.createRadialGradient(x, y, 2, x, y, Math.max(rx, ry)); g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)"); c.fillStyle = g; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); };
      blob(256, 70, 50, 60, "#ffd060"); for (let i = 0; i < 9; i++) blob(256, 140 + i * 34, 20, 22, "#ff8a3a");
      blob(190, 420, 40, 70, "#ffb340"); blob(322, 420, 40, 70, "#ffb340"); blob(256, 200, 120, 160, "rgba(120,40,160,.55)");
    })
  };
  return TX;
}

/* ---------------------------------------------------------------- أجزاء مشتركة */
function patientTable({ length = 2.3, height = 0.82, z = 0.9, width = 0.5, base = true } = {}) {
  const g = new THREE.Group(), mt = materials();
  if (base) {
    g.add(rbox(0.56, 0.12, 1.0, 0.04, mt.shell2, 0, 0.06, z + 0.25));
    g.add(rbox(0.42, height - 0.2, 0.8, 0.08, mt.shell, 0, (height - 0.2) / 2 + 0.1, z + 0.25));
    const strip = rbox(0.43, 0.02, 0.6, 0.008, mt.accentSoft, 0, height - 0.24, z + 0.25); g.add(strip);
  }
  g.add(rbox(width, 0.07, length, 0.03, mt.shell, 0, height, z - length / 2 + 0.85));
  g.add(rbox(width - 0.06, 0.06, length - 0.25, 0.03, mt.cushion, 0, height + 0.06, z - length / 2 + 0.85));
  g.add(rbox(0.3, 0.07, 0.22, 0.035, mt.sheet, 0, height + 0.12, z - length + 0.95));
  return g;
}
function caster(x, z, mt) { const w = cyl(0.04, 0.04, 0.035, mt.rubber, 20); w.rotation.z = Math.PI / 2; w.position.set(x, 0.04, z); return w; }
function cArm(R = 0.78, tube = 0.1) {
  const g = new THREE.Group(), mt = materials();
  const c = torus(R, tube, mt.shell, Math.PI, 28, 120); c.rotation.z = Math.PI / 2; c.scale.z = 1.7; g.add(c);
  const det = new THREE.Group(); det.add(rbox(0.5, 0.16, 0.5, 0.05, mt.shell)); const face = rbox(0.44, 0.02, 0.44, 0.01, mt.dark, 0, -0.085, 0); det.add(face);
  det.position.set(0, R + 0.02, 0); g.add(det);
  const tubeH = new THREE.Group(); tubeH.add(rbox(0.34, 0.22, 0.34, 0.06, mt.shell)); tubeH.add(rbox(0.22, 0.06, 0.22, 0.02, mt.graphite, 0, 0.13, 0));
  tubeH.position.set(0, -R + 0.02, 0); g.add(tubeH);
  const hub = cyl(0.16, 0.16, 0.34, mt.shell2); hub.rotation.x = Math.PI / 2; hub.position.set(-R - 0.05, 0, 0); g.add(hub);
  return g;
}

/* ---------------------------------------------------------------- النماذج */
const MODELS = {
  ct() {
    const g = new THREE.Group(), mt = materials();
    const gy = 1.0;
    const shell = boreSlab(2.0, 2.0, 0.86, 0.38, 0.85, mt.shell); shell.position.set(0, gy, 0); g.add(shell);
    const back = boreSlab(1.9, 1.9, 0.82, 0.38, 0.2, mt.shell2, 0.04); back.position.set(0, gy, -0.48); g.add(back);
    const bore = cyl(0.38, 0.38, 1.1, mt.bore, 96); bore.rotation.x = Math.PI / 2; bore.position.set(0, gy, -0.1); g.add(bore);
    const bez = boreSlab(1.18, 1.18, 0.59, 0.4, 0.05, mt.shell2, 0.02); bez.position.set(0, gy, 0.44); g.add(bez);
    const rim = torus(0.405, 0.028, mt.dark); rim.position.set(0, gy, 0.47); g.add(rim);
    const glow = torus(0.6, 0.01, mt.accent); glow.position.set(0, gy, 0.47); g.add(glow);
    g.add(rbox(1.5, 0.08, 0.7, 0.03, mt.shell2, 0, 0.04, 0));
    const pane = rbox(0.34, 0.2, 0.03, 0.03, mt.dark, -0.56, gy + 0.62, 0.43); g.add(pane);
    const sc = screen(0.3, 0.16, textures().ui); sc.position.set(-0.56, gy + 0.62, 0.447); g.add(sc);
    [-0.56, 0.56].forEach(x => { const b = rbox(0.12, 0.05, 0.02, 0.012, mt.accentSoft, x === -0.56 ? 0.56 : 0.56, gy + 0.62, 0.44); });
    const lbl = rbox(0.5, 0.03, 0.01, 0.012, mt.trim, 0, gy - 0.78, 0.43); g.add(lbl);
    g.add(patientTable({ length: 2.4, height: 0.86, z: 1.25 }));
    return { group: g, cam: [3.4, 2.1, 4.4], target: [0, 0.95, 0.5] };
  },

  mri() {
    const g = new THREE.Group(), mt = materials();
    const gy = 1.08;
    const body = boreSlab(2.2, 2.3, 0.95, 0.36, 1.7, mt.shell); body.position.set(0, gy, 0); g.add(body);
    const flareG = new THREE.LatheGeometry([new THREE.Vector2(0.36, 0), new THREE.Vector2(0.4, 0.06), new THREE.Vector2(0.5, 0.14), new THREE.Vector2(0.62, 0.18)], 96);
    const flare = new THREE.Mesh(flareG, mt.shell2); flare.rotation.x = Math.PI / 2; flare.position.set(0, gy, 0.86); g.add(flare);
    const bore = cyl(0.36, 0.36, 1.9, mt.bore, 96); bore.rotation.x = Math.PI / 2; bore.position.set(0, gy, 0); g.add(bore);
    const arc = torus(0.92, 0.012, mt.accent, Math.PI * 0.62); arc.rotation.z = Math.PI * 0.19; arc.position.set(0, gy, 0.86); g.add(arc);
    const bezel = boreSlab(2.0, 0.34, 0.12, 0.001, 0.06, mt.dark, 0.02); bezel.geometry = new RoundedBoxGeometry(0.9, 0.12, 0.05, 4, 0.025); bezel.position.set(0, gy + 0.86, 0.86); g.add(bezel);
    const sc = screen(0.8, 0.08, textures().ui); sc.position.set(0, gy + 0.86, 0.887); g.add(sc);
    g.add(rbox(1.9, 0.1, 1.5, 0.04, mt.shell2, 0, 0.05, 0));
    const t = patientTable({ length: 2.6, height: 0.9, z: 1.75 }); g.add(t);
    const coil = new THREE.Group();
    const cg = new THREE.CylinderGeometry(0.17, 0.17, 0.36, 40, 1, true, -Math.PI / 2, Math.PI);
    const cm = new THREE.Mesh(cg, mt.shell2); cm.rotation.z = Math.PI / 2; cm.rotation.y = Math.PI / 2; coil.add(cm);
    for (let i = -1; i <= 1; i++) { const sl = rbox(0.03, 0.02, 0.3, 0.008, mt.graphite, i * 0.11, 0.165, 0); coil.add(sl); }
    coil.position.set(0, 1.08, 1.25); g.add(coil);
    return { group: g, cam: [3.6, 2.2, 4.8], target: [0, 1.0, 0.8] };
  },

  xray() {
    const g = new THREE.Group(), mt = materials();
    [-0.35, 0.35].forEach(x => g.add(rbox(0.08, 0.1, 3.4, 0.02, mt.trim, x, 2.75, 0)));
    g.add(rbox(0.9, 0.12, 0.3, 0.03, mt.shell2, 0, 2.65, 0.1));
    [[0.2, 0.42], [0.17, 0.4], [0.14, 0.38]].forEach(([s, h], i) => g.add(rbox(s, h, s, 0.02, i % 2 ? mt.shell2 : mt.shell, 0, 2.4 - i * 0.3, 0.1)));
    const head = new THREE.Group();
    const housing = cyl(0.13, 0.13, 0.5, mt.shell, 48); housing.rotation.z = Math.PI / 2; head.add(housing);
    [-0.27, 0.27].forEach(x => { const cap = cyl(0.14, 0.14, 0.05, mt.shell2, 48); cap.rotation.z = Math.PI / 2; cap.position.x = x; head.add(cap); });
    head.add(rbox(0.3, 0.2, 0.3, 0.03, mt.shell2, 0, -0.2, 0));
    head.add(rbox(0.22, 0.02, 0.22, 0.01, mt.accentSoft, 0, -0.31, 0));
    const handle = torus(0.12, 0.012, mt.chrome, Math.PI); handle.position.set(0, -0.2, 0.17); head.add(handle);
    head.position.set(0, 1.72, 0.1); g.add(head);
    const beam = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.75, 4, 1, true), new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.08, depthWrite: false }));
    beam.rotation.y = Math.PI / 4; beam.position.set(0, 1.03, 0.1); g.add(beam);
    g.add(rbox(0.5, 0.62, 0.7, 0.06, mt.shell, 0, 0.31, 0.4));
    g.add(rbox(0.76, 0.06, 2.1, 0.025, mt.shell, 0, 0.66, 0.1));
    g.add(rbox(0.66, 0.05, 1.9, 0.025, mt.cushion, 0, 0.71, 0.1));
    g.add(rbox(0.5, 0.04, 0.55, 0.01, mt.graphite, 0, 0.6, 0.1));
    const stand = new THREE.Group();
    stand.add(rbox(0.5, 0.06, 0.45, 0.02, mt.shell2, 0, 0.03, 0));
    stand.add(rbox(0.16, 2.0, 0.14, 0.03, mt.shell, 0, 1.0, 0));
    const det = rbox(0.58, 0.62, 0.1, 0.03, mt.shell, 0, 1.35, 0.12); stand.add(det);
    stand.add(rbox(0.46, 0.46, 0.012, 0.01, mt.graphite, 0, 1.35, 0.172));
    stand.position.set(-1.7, 0, 0.1); stand.rotation.y = Math.PI / 2; g.add(stand);
    return { group: g, cam: [3.4, 2.4, 3.9], target: [-0.3, 1.15, 0.1] };
  },

  ultrasound() {
    const g = new THREE.Group(), mt = materials();
    g.add(rbox(0.6, 0.12, 0.66, 0.05, mt.shell2, 0, 0.12, 0));
    [[-0.24, -0.26], [0.24, -0.26], [-0.24, 0.26], [0.24, 0.26]].forEach(([x, z]) => g.add(caster(x, z, mt)));
    g.add(rbox(0.26, 0.5, 0.26, 0.05, mt.shell, 0, 0.42, -0.05));
    g.add(rbox(0.58, 0.32, 0.56, 0.08, mt.shell, 0, 0.82, 0));
    const consoleG = new THREE.Group();
    consoleG.add(rbox(0.66, 0.06, 0.5, 0.03, mt.shell));
    const ts = screen(0.34, 0.2, textures().ui); ts.rotation.x = -Math.PI / 2; ts.position.set(0, 0.032, -0.08); consoleG.add(ts);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.035, 32, 16), mt.dark); ball.position.set(0, 0.03, 0.14); consoleG.add(ball);
    for (let i = 0; i < 6; i++) consoleG.add(rbox(0.05, 0.015, 0.035, 0.006, mt.shell2, -0.25 + i * 0.1 - (i > 2 ? -0.02 : 0.02) + (i === 2 || i === 3 ? (i === 2 ? -0.07 : 0.07) : 0), 0.035, 0.16));
    const bar = torus(0.3, 0.014, mt.chrome, Math.PI); bar.rotation.x = Math.PI / 2; bar.position.set(0, 0, 0.25); bar.scale.set(1.05, 0.5, 1); consoleG.add(bar);
    consoleG.position.set(0, 1.04, 0.05); consoleG.rotation.x = 0.15; g.add(consoleG);
    g.add(cyl(0.025, 0.025, 0.35, mt.metal).translateX(0).translateY(1.25).translateZ(-0.2));
    const mon = monitor(0.56, 0.38, textures().us); mon.position.set(0, 1.62, -0.16); mon.rotation.x = -0.12; g.add(mon);
    [-0.33, 0.33].forEach((x, i) => {
      const holder = rbox(0.07, 0.12, 0.08, 0.02, mt.shell2, x, 0.98, 0.18); g.add(holder);
      const probe = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.1, 6, 16), i ? mt.shell : mt.shell2); probe.position.set(x, 1.08, 0.18); g.add(probe);
      const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 1.0, 0.18), new THREE.Vector3(x * 1.25, 0.7, 0.32), new THREE.Vector3(x * 1.1, 0.45, 0.28), new THREE.Vector3(x * 0.5, 0.6, 0.2)]);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.008, 8), mt.graphite));
    });
    return { group: g, cam: [2.1, 1.65, 2.7], target: [0, 0.9, 0], fov: 33, fit: 0.95 };
  },

  mammography() {
    const g = new THREE.Group(), mt = materials();
    g.add(rbox(0.62, 0.08, 0.6, 0.03, mt.shell2, 0, 0.04, -0.1));
    g.add(rbox(0.34, 1.95, 0.3, 0.07, mt.shell, 0, 1.0, -0.15));
    const hub = cyl(0.17, 0.17, 0.12, mt.shell2); hub.rotation.x = Math.PI / 2; hub.position.set(0, 1.38, 0.03); g.add(hub);
    g.add(rbox(0.24, 0.92, 0.2, 0.06, mt.shell, 0, 1.38, 0.13));
    const head = rbox(0.34, 0.2, 0.44, 0.07, mt.shell, 0, 1.86, 0.27); g.add(head);
    g.add(rbox(0.24, 0.02, 0.26, 0.01, mt.accentSoft, 0, 1.755, 0.32));
    const sup = rbox(0.36, 0.07, 0.34, 0.03, mt.shell, 0, 1.0, 0.33); g.add(sup);
    g.add(rbox(0.32, 0.01, 0.3, 0.005, mt.graphite, 0, 1.037, 0.34));
    const paddle = rbox(0.33, 0.014, 0.27, 0.006, mt.glass, 0, 1.17, 0.36); g.add(paddle);
    g.add(rbox(0.33, 0.08, 0.02, 0.008, mt.glass, 0, 1.2, 0.235));
    g.add(rbox(0.12, 0.05, 0.08, 0.02, mt.shell2, 0, 1.22, 0.2));
    const shield = rbox(0.4, 0.3, 0.01, 0.04, mt.glass, 0, 1.83, 0.52); g.add(shield);
    [-0.24, 0.24].forEach(x => { const h = torus(0.06, 0.012, mt.chrome, Math.PI); h.rotation.y = Math.PI / 2; h.position.set(x, 1.0, 0.32); h.rotation.z = Math.PI / 2; g.add(h); });
    return { group: g, cam: [2.5, 1.75, 3.0], target: [0, 1.0, 0.1], fov: 32, fit: 0.95 };
  },

  fluoroscopy() {
    const g = new THREE.Group(), mt = materials();
    g.add(patientTable({ length: 2.4, height: 0.92, z: 1.0 }));
    const c = cArm(0.8, 0.095); c.position.set(0, 0.98, -0.1); g.add(c);
    g.add(rbox(0.8, 0.14, 0.42, 0.06, mt.shell, -1.2, 0.98, -0.1));
    g.add(rbox(0.36, 0.98, 0.42, 0.08, mt.shell, -1.55, 0.49, -0.1));
    g.add(rbox(0.7, 0.06, 0.7, 0.03, mt.shell2, -1.55, 0.03, -0.1));
    const boom = new THREE.Group();
    boom.add(cyl(0.03, 0.03, 0.8, mt.metal).translateY(2.4));
    boom.add(rbox(1.25, 0.05, 0.08, 0.02, mt.shell2, 0, 2.0, 0));
    const m1 = monitor(0.58, 0.36, textures().chest); m1.position.set(-0.31, 1.76, 0.05); boom.add(m1);
    const m2 = monitor(0.58, 0.36, textures().ui); m2.position.set(0.31, 1.76, 0.05); boom.add(m2);
    boom.position.set(0.75, 0.1, -0.55); boom.rotation.y = -0.5; g.add(boom);
    return { group: g, cam: [3.6, 2.3, 3.8], target: [-0.2, 1.1, 0] };
  },

  nuclear() {
    const g = new THREE.Group(), mt = materials();
    const gy = 1.05;
    const ring = boreSlab(2.3, 2.2, 0.7, 0.72, 0.5, mt.shell); ring.position.set(0, gy, -0.35); g.add(ring);
    const glow = torus(0.8, 0.008, mt.accent); glow.position.set(0, gy, -0.09); g.add(glow);
    g.add(rbox(1.6, 0.08, 0.6, 0.03, mt.shell2, 0, 0.04, -0.35));
    [1, -1].forEach(s => {
      const head = new THREE.Group();
      head.add(rbox(0.62, 0.24, 0.55, 0.05, mt.shell));
      head.add(rbox(0.56, 0.02, 0.49, 0.01, mt.graphite, 0, -0.12 * s, 0));
      head.add(rbox(0.12, 0.3, 0.2, 0.03, mt.shell2, 0, 0.25 * s, -0.25));
      head.position.set(0, gy + 0.43 * s, 0.25); g.add(head);
    });
    g.add(patientTable({ length: 2.5, height: 0.86, z: 1.45, width: 0.42 }));
    const mon = monitor(0.6, 0.6, textures().spect); mon.position.set(-1.45, 1.35, 0.6); mon.rotation.y = 0.5; g.add(mon);
    g.add(cyl(0.03, 0.03, 1.0, mt.metal).translateX(-1.45).translateY(0.6).translateZ(0.6));
    g.add(rbox(0.5, 0.05, 0.5, 0.02, mt.shell2, -1.45, 0.03, 0.6));
    return { group: g, cam: [3.5, 2.1, 4.3], target: [-0.15, 0.95, 0.4] };
  },

  interventional() {
    const g = new THREE.Group(), mt = materials();
    g.add(patientTable({ length: 2.7, height: 0.94, z: 1.35 }));
    const c = cArm(0.86, 0.1); c.position.set(0, 1.02, -0.2); g.add(c);
    g.add(rbox(0.5, 0.12, 0.3, 0.05, mt.shell, -1.12, 1.02, -0.2));
    g.add(rbox(0.22, 1.7, 0.26, 0.06, mt.shell, -1.3, 1.85, -0.2));
    g.add(rbox(0.6, 0.12, 1.6, 0.04, mt.trim, -1.3, 2.78, -0.2));
    const wall = new THREE.Group();
    wall.add(rbox(1.5, 0.95, 0.06, 0.02, mt.dark));
    const tiles = [textures().chest, textures().ct, textures().ui, textures().spect];
    tiles.forEach((t, i) => { const s = screen(0.7, 0.42, t); s.position.set(i % 2 ? 0.36 : -0.36, i < 2 ? 0.22 : -0.22, 0.032); wall.add(s); });
    wall.position.set(1.05, 1.75, -0.4); wall.rotation.y = -0.55; g.add(wall);
    g.add(cyl(0.035, 0.035, 0.8, mt.metal).translateX(1.05).translateY(2.6).translateZ(-0.4));
    const lead = rbox(0.6, 0.75, 0.02, 0.05, mt.leadGlass, 0.62, 1.55, 0.95); lead.rotation.y = -0.3; g.add(lead);
    g.add(cyl(0.02, 0.02, 1.0, mt.metal).translateX(0.62).translateY(2.4).translateZ(0.95));
    const lamp = new THREE.Group(); lamp.add(cyl(0.32, 0.36, 0.08, mt.shell, 64)); const lens = cyl(0.3, 0.3, 0.01, mt.accentSoft, 64); lens.position.y = -0.045; lamp.add(lens);
    lamp.position.set(-0.4, 2.45, 1.4); lamp.rotation.x = 0.4; g.add(lamp);
    g.add(cyl(0.025, 0.025, 0.5, mt.metal).translateX(-0.4).translateY(2.75).translateZ(1.4));
    return { group: g, cam: [3.6, 2.5, 4.4], target: [0, 1.25, 0.3] };
  },

  dexa() {
    const g = new THREE.Group(), mt = materials();
    g.add(rbox(0.95, 0.5, 0.45, 0.06, mt.shell, 0, 0.25, -0.95));
    g.add(rbox(0.95, 0.5, 0.45, 0.06, mt.shell, 0, 0.25, 0.95));
    g.add(rbox(0.95, 0.14, 2.4, 0.05, mt.shell, 0, 0.57, 0));
    g.add(rbox(0.8, 0.07, 2.1, 0.03, mt.cushion, 0, 0.67, 0));
    g.add(rbox(0.3, 0.07, 0.22, 0.035, mt.sheet, 0, 0.73, -0.85));
    g.add(rbox(0.06, 0.02, 2.2, 0.01, mt.trim, 0.49, 0.62, 0));
    const arm = new THREE.Group();
    arm.add(rbox(0.12, 0.62, 0.22, 0.04, mt.shell, 0.52, 0.9, 0));
    arm.add(rbox(0.82, 0.12, 0.22, 0.05, mt.shell, 0.17, 1.24, 0));
    arm.add(rbox(0.36, 0.14, 0.3, 0.05, mt.shell2, -0.06, 1.13, 0));
    arm.add(rbox(0.3, 0.02, 0.24, 0.01, mt.accentSoft, -0.06, 1.055, 0));
    arm.position.z = 0.15; g.add(arm);
    const pane = rbox(0.3, 0.2, 0.03, 0.02, mt.dark, 0.3, 0.42, 1.18); g.add(pane);
    const sc = screen(0.26, 0.16, textures().ui); sc.position.set(0.3, 0.42, 1.196); g.add(sc);
    return { group: g, cam: [2.6, 1.9, 3.0], target: [0, 0.75, 0] };
  }
};

/* صورة الرئيسية: جهاز مقطعي مع شاشة التحكم */
MODELS.hero = function () {
  const base = MODELS.ct();
  const mt = materials();
  const mon = monitor(0.9, 0.55, textures().ct); mon.position.set(-1.65, 1.55, -0.4); mon.rotation.y = 0.55; base.group.add(mon);
  const mon2 = monitor(0.9, 0.55, textures().chest); mon2.position.set(-2.2, 1.55, 0.45); mon2.rotation.y = 0.85; base.group.add(mon2);
  base.group.add(cyl(0.03, 0.03, 1.3, mt.metal).translateX(-1.9).translateY(0.65).translateZ(0));
  base.group.add(rbox(0.6, 0.05, 0.6, 0.02, mt.shell2, -1.9, 0.03, 0));
  return { group: base.group, cam: [3.0, 1.9, 4.8], target: [-0.55, 1.0, 0.3], fov: 34 };
};

/* ---------------------------------------------------------------- نماذج التاريخ والوقاية */
const wood = () => new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = "#7a4a2a"; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) { c.strokeStyle = `rgba(${40 + Math.random() * 40},${20 + Math.random() * 20},10,.35)`; c.lineWidth = 1 + Math.random() * 2; c.beginPath(); const y = Math.random() * h; c.moveTo(0, y); c.bezierCurveTo(w / 3, y + Math.random() * 10 - 5, 2 * w / 3, y + Math.random() * 10 - 5, w, y); c.stroke(); }
}), roughness: 0.55 });
function glassLathe(points, mat) { return new THREE.Mesh(new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), 64), mat); }
function handTexture() {
  return canvasTex(512, 640, (c, w, h) => {
    const g = c.createRadialGradient(256, 330, 30, 256, 330, 340); g.addColorStop(0, "#2a3238"); g.addColorStop(1, "#06090b");
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = "rgba(150,170,180,.18)"; c.filter = "blur(10px)"; c.beginPath(); c.ellipse(256, 330, 150, 260, 0, 0, 7); c.fill(); c.filter = "blur(1.2px)";
    const bone = (x, y, len, wd, ang) => { c.save(); c.translate(x, y); c.rotate(ang); const gr = c.createLinearGradient(-wd / 2, 0, wd / 2, 0); gr.addColorStop(0, "rgba(200,212,218,.65)"); gr.addColorStop(0.5, "rgba(235,242,245,.95)"); gr.addColorStop(1, "rgba(200,212,218,.65)"); c.fillStyle = gr; c.beginPath(); c.roundRect(-wd / 2, -len / 2, wd, len, wd / 2); c.fill(); c.restore(); };
    bone(226, 560, 170, 34, 0.04); bone(290, 565, 160, 28, -0.03);
    [[214, 455], [244, 448], [274, 450], [302, 458], [228, 425], [258, 418], [286, 422], [312, 432]].forEach(([x, y]) => { c.fillStyle = "rgba(225,234,238,.85)"; c.beginPath(); c.ellipse(x, y, 15, 13, 0, 0, 7); c.fill(); });
    const F = [[180, 410, -0.75, 70, [60, 44]], [218, 400, -0.18, 110, [70, 46, 34]], [256, 396, 0, 118, [78, 50, 36]], [292, 400, 0.15, 110, [70, 46, 34]], [324, 410, 0.32, 96, [56, 38, 30]]];
    F.forEach(([x0, y0, a, meta, segs], i) => {
      const ux = Math.sin(a), uy = -Math.cos(a);
      bone(x0 + ux * meta / 2, y0 + uy * meta / 2, meta, 20, a);
      let px = x0 + ux * (meta + 6), py = y0 + uy * (meta + 6);
      segs.forEach((L, k) => {
        bone(px + ux * L / 2, py + uy * L / 2, L, 18 - k * 2, a);
        if (i === 3 && k === 0) { c.save(); c.translate(px + ux * L / 2, py + uy * L / 2); c.rotate(a); c.fillStyle = "#fff"; c.shadowColor = "#fff"; c.shadowBlur = 12; c.fillRect(-19, -8, 38, 16); c.restore(); }
        px += ux * (L + 6); py += uy * (L + 6);
      });
    });
    c.filter = "none"; c.fillStyle = "rgba(220,230,235,.5)"; c.font = "bold 22px serif"; c.fillText("1895", 400, 610);
  });
}
function medalTexture(year, field) {
  return canvasTex(512, 512, (c, w, h) => {
    const g = c.createRadialGradient(220, 200, 20, 256, 256, 260); g.addColorStop(0, "#fff3cf"); g.addColorStop(1, "#b98a2e"); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.strokeStyle = "rgba(120,80,20,.6)"; c.lineWidth = 6; c.beginPath(); c.arc(256, 256, 230, 0, 7); c.stroke();
    c.lineWidth = 2; c.setLineDash([3, 9]); c.beginPath(); c.arc(256, 256, 205, 0, 7); c.stroke(); c.setLineDash([]);
    for (let s = -1; s <= 1; s += 2) for (let i = 0; i < 9; i++) { const a = Math.PI / 2 + s * (0.4 + i * 0.22); c.save(); c.translate(256 + Math.cos(a) * 170, 256 + Math.sin(a) * 170); c.rotate(a + s * 0.6); c.fillStyle = "rgba(130,90,25,.55)"; c.beginPath(); c.ellipse(0, 0, 9, 22, 0, 0, 7); c.fill(); c.restore(); }
    c.fillStyle = "rgba(110,70,15,.85)"; c.textAlign = "center"; c.font = "bold 92px Georgia, serif"; c.fillText(year, 256, 268);
    c.font = "bold 34px Georgia, serif"; c.fillText(field, 256, 322); c.font = "26px Georgia, serif"; c.fillText("NOBEL", 256, 180);
  });
}
function medal(year, field) {
  const g = new THREE.Group(), mt = materials();
  const caseMat = new THREE.MeshPhysicalMaterial({ color: 0x14202a, roughness: 0.55, sheen: 1, sheenColor: 0x3a5a78 });
  g.add(rbox(1.3, 0.14, 1.3, 0.05, caseMat, 0, 0.07, 0));
  g.add(rbox(1.1, 0.04, 1.1, 0.02, new THREE.MeshPhysicalMaterial({ color: 0x1b2d3b, roughness: 0.9, sheen: 1, sheenColor: 0x557799 }), 0, 0.15, 0));
  const coin = cyl(0.42, 0.42, 0.06, mt.gold, 96); coin.position.y = 0.2; g.add(coin);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.4, 96), new THREE.MeshStandardMaterial({ map: medalTexture(year, field), metalness: 0.9, roughness: 0.3 }));
  face.rotation.x = -Math.PI / 2; face.position.y = 0.231; g.add(face);
  const rim = torus(0.42, 0.018, mt.gold); rim.rotation.x = Math.PI / 2; rim.position.y = 0.23; g.add(rim);
  return { group: g, cam: [0.9, 1.6, 1.5], target: [0, 0.18, 0], fov: 30 };
}
function workstation(screens) {
  const g = new THREE.Group(), mt = materials();
  g.add(rbox(2.0, 0.05, 0.85, 0.02, mt.shell2, 0, 0.75, 0));
  [-0.9, 0.9].forEach(x => g.add(rbox(0.06, 0.75, 0.75, 0.02, mt.trim, x, 0.375, 0)));
  screens.forEach((t, i) => { const m = monitor(0.62, 0.42, t); const a = (i - (screens.length - 1) / 2); m.position.set(a * 0.64, 1.12, -0.15 + Math.abs(a) * 0.12); m.rotation.y = -a * 0.35; g.add(m); g.add(cyl(0.02, 0.02, 0.2, mt.metal).translateX(a * 0.64).translateY(0.86).translateZ(-0.2 + Math.abs(a) * 0.12)); });
  g.add(rbox(0.5, 0.02, 0.16, 0.01, mt.dark, 0, 0.785, 0.2));
  g.add(rbox(0.07, 0.025, 0.11, 0.03, mt.dark, 0.38, 0.79, 0.22));
  return g;
}
const aiTexture = () => canvasTex(512, 512, (c, w, h) => { c.drawImage(textures().chest.image, 0, 0); c.strokeStyle = "#ffcc00"; c.lineWidth = 5; c.setLineDash([14, 8]); c.strokeRect(280, 300, 120, 100); c.setLineDash([]); c.fillStyle = "#ffcc00"; c.font = "bold 22px sans-serif"; c.fillText("AI  92%", 282, 290); });
function teddy() {
  const g = new THREE.Group(), fur = new THREE.MeshPhysicalMaterial({ color: 0xc58b52, roughness: 0.95, sheen: 1, sheenColor: 0xffd7a8 });
  const sp = (r, x, y, z, m = fur) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16), m); s.position.set(x, y, z); g.add(s); return s; };
  sp(0.12, 0, 0.12, 0); sp(0.085, 0, 0.29, 0.01); sp(0.035, -0.07, 0.36, 0); sp(0.035, 0.07, 0.36, 0); sp(0.04, 0, 0.27, 0.08);
  sp(0.045, -0.12, 0.05, 0.06); sp(0.045, 0.12, 0.05, 0.06); sp(0.04, -0.13, 0.17, 0.02); sp(0.04, 0.13, 0.17, 0.02);
  const eye = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 }); sp(0.012, -0.03, 0.31, 0.075, eye); sp(0.012, 0.03, 0.31, 0.075, eye); sp(0.014, 0, 0.275, 0.12, eye);
  return g;
}
function signTexture() {
  return canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = "#ffcc00"; c.fillRect(0, 0, w, h); c.fillStyle = "#151515"; c.lineWidth = 0;
    const cx = 256, cy = 230, R = 150, r = 48;
    c.beginPath(); c.arc(cx, cy, 34, 0, 7); c.fill();
    for (let k = 0; k < 3; k++) { const a0 = -Math.PI / 2 + k * 2 * Math.PI / 3 - Math.PI / 6, a1 = a0 + Math.PI / 3; c.beginPath(); c.arc(cx, cy, R, a0, a1); c.arc(cx, cy, r, a1, a0, true); c.closePath(); c.fill(); }
    c.font = "bold 40px sans-serif"; c.textAlign = "center"; c.fillText("RADIATION", 256, 445);
  });
}
Object.assign(MODELS, {
  "h-1895-hand"() {
    const g = new THREE.Group(), mt = materials();
    g.add(rbox(1.2, 1.45, 0.14, 0.04, mt.shell, 0, 1.3, 0));
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.06, 1.3), new THREE.MeshBasicMaterial({ color: 0xf4fbff, toneMapped: false })); panel.position.set(0, 1.3, 0.071); g.add(panel);
    const film = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 1.03), new THREE.MeshBasicMaterial({ map: handTexture(), toneMapped: false, transparent: true, opacity: 0.97 })); film.position.set(0, 1.27, 0.075); g.add(film);
    [-0.25, 0.25].forEach(x => g.add(rbox(0.08, 0.05, 0.03, 0.01, mt.metal, x, 1.8, 0.09)));
    g.add(rbox(0.3, 0.05, 0.04, 0.015, mt.dark, 0, 0.62, 0.08));
    return { group: g, cam: [0.8, 1.45, 2.4], target: [0, 1.25, 0], fov: 34 };
  },
  "h-1896-becquerel"() {
    const g = new THREE.Group(), w = wood();
    g.add(rbox(1.6, 0.06, 1.0, 0.01, w, 0, 0.03, 0));
    const plate = rbox(0.6, 0.025, 0.45, 0.005, new THREE.MeshStandardMaterial({ color: 0x0d0f11, roughness: 0.6 }), 0, 0.075, 0); g.add(plate);
    const fog = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.41), new THREE.MeshBasicMaterial({ transparent: true, map: canvasTex(256, 192, (c, W, H) => { c.filter = "blur(10px)"; c.fillStyle = "rgba(160,170,175,.55)"; c.beginPath(); c.ellipse(130, 96, 60, 40, 0.3, 0, 7); c.fill(); c.beginPath(); c.ellipse(60, 120, 25, 18, 0, 0, 7); c.fill(); }) }));
    fog.rotation.x = -Math.PI / 2; fog.position.set(-0.32, 0.089, 0.22); g.add(fog);
    const fogPlate = rbox(0.6, 0.012, 0.45, 0.004, new THREE.MeshStandardMaterial({ color: 0x2a2f33, roughness: 0.4 }), -0.32, 0.08, 0.22); fogPlate.rotation.y = 0.3; g.add(fogPlate); fog.rotation.z = 0.3; fog.position.y = 0.088;
    const cry = new THREE.MeshPhysicalMaterial({ color: 0x9be37a, roughness: 0.15, transmission: 0.4, thickness: 0.05, emissive: 0x4ca83a, emissiveIntensity: 0.35 });
    for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.03 + Math.random() * 0.03, 0), cry); m.position.set(0.05 + (Math.random() - 0.5) * 0.18, 0.1 + Math.random() * 0.02, (Math.random() - 0.5) * 0.14); m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3); g.add(m); }
    return { group: g, cam: [0.9, 0.9, 1.1], target: [-0.08, 0.06, 0.05], fov: 34 };
  },
  "h-1896-early-lab"() {
    const g = new THREE.Group(), w = wood(), mt = materials();
    g.add(rbox(1.8, 0.06, 0.9, 0.01, w, 0, 0.75, 0));
    [[-0.8, -0.38], [0.8, -0.38], [-0.8, 0.38], [0.8, 0.38]].forEach(([x, z]) => g.add(rbox(0.06, 0.75, 0.06, 0.01, w, x, 0.375, z)));
    const tube = glassLathe([[0.001, -0.42], [0.05, -0.38], [0.12, -0.25], [0.15, -0.05], [0.13, 0.15], [0.06, 0.32], [0.025, 0.36], [0.025, 0.46], [0.001, 0.46]], mt.glass);
    tube.rotation.z = Math.PI / 2; tube.position.set(0, 1.12, 0); g.add(tube);
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 16), new THREE.MeshBasicMaterial({ color: 0x9dffb8, toneMapped: false })); glow.scale.set(2.6, 0.9, 0.9); glow.position.set(-0.02, 1.12, 0); g.add(glow);
    [-0.5, 0.5].forEach(x => { g.add(cyl(0.012, 0.012, 0.35, mt.metal).translateX(x * 0.8).translateY(0.95)); g.add(rbox(0.12, 0.03, 0.12, 0.01, w, x * 0.8, 0.79, 0)); });
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0.46, 1.12, 0), new THREE.Vector3(0.65, 1.0, 0.1), new THREE.Vector3(0.7, 0.8, 0.25)]); g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.006, 8), new THREE.MeshStandardMaterial({ color: 0x8a3b1f, roughness: 0.4, metalness: 0.6 })));
    g.add(rbox(0.36, 0.26, 0.03, 0.01, new THREE.MeshStandardMaterial({ color: 0x3a7a4a, emissive: 0x7dffa0, emissiveIntensity: 0.9, roughness: 0.6 }), 0.55, 0.92, -0.3));
    const pl = new THREE.PointLight(0x8dffb0, 1.5, 1.5); pl.position.set(0, 1.12, 0.2); g.add(pl);
    return { group: g, cam: [1.4, 1.5, 1.9], target: [0, 1.0, 0], fov: 32 };
  },
  "h-1898-curie"() {
    const g = new THREE.Group(), w = wood(), mt = materials();
    g.add(rbox(1.6, 0.06, 1.0, 0.01, w, 0, 0.03, 0));
    const flask = glassLathe([[0.001, 0.06], [0.2, 0.06], [0.22, 0.09], [0.06, 0.42], [0.05, 0.56], [0.06, 0.58], [0.001, 0.58]], mt.glass); flask.position.set(-0.25, 0, 0); g.add(flask);
    const liquid = glassLathe([[0.001, 0.065], [0.19, 0.065], [0.205, 0.09], [0.125, 0.24], [0.001, 0.24]], new THREE.MeshBasicMaterial({ color: 0x7dffa8, toneMapped: false })); liquid.position.set(-0.25, 0, 0); g.add(liquid);
    const light = new THREE.PointLight(0x5cff8a, 1.2, 1.2); light.position.set(-0.25, 0.2, 0); g.add(light);
    g.add(rbox(0.45, 0.1, 0.14, 0.01, w, 0.32, 0.25, 0)); g.add(rbox(0.45, 0.02, 0.14, 0.005, w, 0.32, 0.09, 0));
    [0, 1, 2].forEach(i => { const t = glassLathe([[0.001, 0], [0.025, 0.02], [0.028, 0.3], [0.03, 0.31], [0.001, 0.31]], mt.glass); t.position.set(0.17 + i * 0.15, 0.08, 0); g.add(t); if (i === 1) { const l = cyl(0.023, 0.023, 0.08, new THREE.MeshStandardMaterial({ color: 0x8dffb0, emissive: 0x4dff88, emissiveIntensity: 1.2 })); l.position.set(0.32, 0.13, 0); g.add(l); } });
    return { group: g, cam: [0.75, 0.75, 1.35], target: [0, 0.22, 0], fov: 34 };
  },
  "h-1901-roentgen"() { return medal("1901", "PHYSICS"); },
  "h-1979-nobel"() { return medal("1979", "MEDICINE"); },
  "h-2003-nobel"() { return medal("2003", "MEDICINE"); },
  "h-1913-coolidge"() {
    const g = new THREE.Group(), mt = materials();
    const tube = glassLathe([[0.001, -0.5], [0.04, -0.48], [0.05, -0.3], [0.16, -0.12], [0.18, 0.02], [0.16, 0.16], [0.05, 0.3], [0.04, 0.48], [0.001, 0.5]], mt.glass);
    tube.rotation.z = Math.PI / 2; tube.position.set(0, 0.5, 0); g.add(tube);
    const cath = cyl(0.03, 0.04, 0.32, mt.metal); cath.rotation.z = Math.PI / 2; cath.position.set(-0.3, 0.5, 0); g.add(cath);
    const fil = new THREE.Mesh(new THREE.SphereGeometry(0.012, 16, 8), new THREE.MeshBasicMaterial({ color: 0xffb347, toneMapped: false })); fil.position.set(-0.13, 0.5, 0); g.add(fil);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 8), new THREE.MeshBasicMaterial({ color: 0xff9a2e, transparent: true, opacity: 0.35, toneMapped: false })); halo.position.copy(fil.position); g.add(halo);
    const anode = cyl(0.045, 0.045, 0.36, new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 1, roughness: 0.3 })); anode.rotation.z = Math.PI / 2; anode.position.set(0.25, 0.5, 0); g.add(anode);
    const face = cyl(0.05, 0.05, 0.02, mt.chrome); face.rotation.z = Math.PI / 2 + 0.5; face.position.set(0.07, 0.5, 0); g.add(face);
    [-0.45, 0.45].forEach(x => { g.add(rbox(0.06, 0.4, 0.06, 0.02, materials().dark, x * 1.05, 0.2, 0)); });
    g.add(rbox(1.3, 0.04, 0.35, 0.015, materials().dark, 0, 0.02, 0));
    return { group: g, cam: [0.6, 0.85, 1.55], target: [0, 0.42, 0], fov: 32 };
  },
  "h-1928-icrp"() {
    const g = new THREE.Group(), mt = materials();
    g.add(rbox(2.2, 1.8, 0.06, 0.01, new THREE.MeshStandardMaterial({ color: 0xe9edf0, roughness: 0.8 }), 0, 0.9, -0.05));
    const sign = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.62, 0.02, 4, 0.04), [mt.shell2, mt.shell2, mt.shell2, mt.shell2, new THREE.MeshStandardMaterial({ map: signTexture(), roughness: 0.4 }), mt.shell2]); sign.position.set(-0.35, 1.15, 0); g.add(sign);
    const door = rbox(0.9, 1.6, 0.05, 0.01, new THREE.MeshStandardMaterial({ color: 0xb7c3cc, roughness: 0.5, metalness: 0.2 }), 0.55, 0.8, 0); g.add(door);
    g.add(rbox(0.04, 0.2, 0.04, 0.015, mt.chrome, 0.2, 0.85, 0.05));
    const lamp = rbox(0.4, 0.12, 0.06, 0.03, new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 1.8 }), 0.55, 1.75, 0.02); g.add(lamp);
    return { group: g, cam: [0.9, 1.25, 2.6], target: [0.05, 1.05, 0], fov: 34 };
  },
  "h-1957-gamma"() { return MODELS.nuclear(); },
  "h-1958-ultrasound"() { return MODELS.ultrasound(); },
  "h-1971-ct"() { return MODELS.ct(); },
  "h-1977-mri"() { return MODELS.mri(); },
  "h-1993-pacs"() { const t = textures(); return { group: workstation([t.ct, t.chest, t.ui]), cam: [1.1, 1.55, 2.2], target: [0, 1.0, 0], fov: 34 }; },
  "h-today-ai"() { const t = textures(); return { group: workstation([aiTexture(), t.ct]), cam: [0.9, 1.45, 1.9], target: [0, 1.02, 0], fov: 34 }; },
  "h-2008-children"() { const d = MODELS.xray(); const b = teddy(); b.position.set(0, 0.74, 0.25); b.rotation.y = 0.4; d.group.add(b); d.cam = [2.6, 1.8, 2.8]; d.target = [0, 1.0, 0.1]; return d; },
  "h-2012-idor"() {
    const g = new THREE.Group(), w = wood();
    g.add(rbox(1.6, 0.06, 1.0, 0.01, w, 0, 0.03, 0));
    const tex = canvasTex(512, 512, (c, W, H) => { c.fillStyle = "#fff"; c.fillRect(0, 0, W, H); c.fillStyle = "#ff3b30"; c.fillRect(0, 0, W, 140); c.fillStyle = "#fff"; c.textAlign = "center"; c.font = "bold 64px sans-serif"; c.fillText("NOV · نوفمبر", 256, 95); c.fillStyle = "#1c1c1e"; c.font = "bold 260px sans-serif"; c.fillText("8", 256, 400); c.fillStyle = "#8e8e93"; c.font = "30px sans-serif"; c.fillText("IDoR", 256, 470); });
    const cal = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.5, 0.06, 4, 0.02), [materials().shell2, materials().shell2, materials().shell2, materials().shell2, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 }), materials().shell2]);
    cal.position.set(0, 0.3, 0); cal.rotation.x = -0.18; g.add(cal);
    g.add(rbox(0.5, 0.04, 0.2, 0.01, materials().shell2, 0, 0.08, -0.08));
    return { group: g, cam: [0.55, 0.6, 1.25], target: [0, 0.28, 0], fov: 32 };
  },
  "s-staff"() {
    const g = new THREE.Group(), mt = materials();
    const rack = new THREE.Group(); rack.add(rbox(1.7, 0.05, 0.08, 0.02, mt.chrome, 0, 1.75, 0)); [-0.8, 0.8].forEach(x => rack.add(rbox(0.05, 1.75, 0.05, 0.02, mt.chrome, x, 0.875, 0))); rack.add(rbox(1.9, 0.04, 0.5, 0.02, mt.trim, 0, 0.02, 0)); g.add(rack);
    const fabric = (col) => new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.75, sheen: 0.8, sheenColor: 0xffffff });
    const apronShape = () => { const s = new THREE.Shape(); s.moveTo(-0.16, 0); s.quadraticCurveTo(0, -0.06, 0.16, 0); s.lineTo(0.3, -0.25); s.lineTo(0.28, -0.95); s.quadraticCurveTo(0, -1.0, -0.28, -0.95); s.lineTo(-0.3, -0.25); s.closePath(); return s; };
    [[-0.38, 0x1f5f9e], [0.38, 0x2a7f62]].forEach(([x, col]) => {
      const a = new THREE.Mesh(new THREE.ExtrudeGeometry(apronShape(), { depth: 0.02, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 4 }), fabric(col)); a.position.set(x, 1.68, 0.03); g.add(a);
      g.add(rbox(0.32, 0.03, 0.03, 0.01, mt.chrome, x, 1.7, 0.02));
    });
    const collar = torus(0.13, 0.03, fabric(0xd2453a), Math.PI * 1.4); collar.rotation.x = Math.PI / 2 - 0.3; collar.position.set(0.05, 0.93, 0.45); collar.scale.y = 1; g.add(collar);
    const table = rbox(1.2, 0.04, 0.6, 0.015, mt.shell2, 0, 0.8, 0.45); g.add(table); g.add(rbox(1.1, 0.78, 0.5, 0.02, mt.shell, 0, 0.39, 0.45));
    const gl = new THREE.Group(); [-0.055, 0.055].forEach(x => { const f = torus(0.042, 0.007, mt.dark); f.position.x = x; gl.add(f); const l = new THREE.Mesh(new THREE.CircleGeometry(0.04, 32), mt.leadGlass); l.position.x = x; gl.add(l); }); gl.add(rbox(0.03, 0.008, 0.008, 0.003, mt.dark)); gl.rotation.x = -1.2; gl.position.set(-0.35, 0.84, 0.5); g.add(gl);
    const badge = rbox(0.06, 0.09, 0.012, 0.008, mt.shell, 0.4, 0.83, 0.5); badge.rotation.x = -Math.PI / 2 + 0.1; g.add(badge);
    const dot = cyl(0.016, 0.016, 0.004, new THREE.MeshStandardMaterial({ color: 0xff9f0a, emissive: 0xff9f0a, emissiveIntensity: 0.4 })); dot.position.set(0.4, 0.84, 0.49); g.add(dot);
    return { group: g, cam: [1.1, 1.55, 2.9], target: [0, 1.0, 0.25], fov: 34 };
  },
  "s-children"() { return MODELS["h-2008-children"](); },
  "s-contrast"() {
    const g = new THREE.Group(), mt = materials();
    g.add(rbox(1.4, 0.04, 0.8, 0.015, mt.shell2, 0, 0.02, 0));
    const tray = rbox(0.9, 0.03, 0.45, 0.06, mt.metal, 0, 0.055, 0); g.add(tray);
    const syr = new THREE.Group();
    const barrel = cyl(0.035, 0.035, 0.42, mt.glass, 48); barrel.rotation.z = Math.PI / 2; syr.add(barrel);
    const liq = cyl(0.03, 0.03, 0.26, new THREE.MeshPhysicalMaterial({ color: 0xfff4c2, transmission: 0.6, roughness: 0.1, thickness: 0.05 }), 48); liq.rotation.z = Math.PI / 2; liq.position.x = 0.07; syr.add(liq);
    const plunger = cyl(0.008, 0.008, 0.3, mt.shell, 16); plunger.rotation.z = Math.PI / 2; plunger.position.x = -0.24; syr.add(plunger);
    const cap = cyl(0.04, 0.04, 0.01, mt.shell, 32); cap.rotation.z = Math.PI / 2; cap.position.x = -0.39; syr.add(cap);
    const flange = rbox(0.012, 0.12, 0.05, 0.005, mt.shell, -0.21, 0, 0); syr.add(flange);
    const hub = cyl(0.008, 0.02, 0.05, mt.shell, 24); hub.rotation.z = -Math.PI / 2; hub.position.x = 0.235; syr.add(hub);
    const needle = cyl(0.002, 0.002, 0.18, mt.chrome, 12); needle.rotation.z = Math.PI / 2; needle.position.x = 0.35; syr.add(needle);
    syr.position.set(-0.05, 0.11, 0.02); syr.rotation.y = 0.35; g.add(syr);
    const vial = glassLathe([[0.001, 0], [0.06, 0], [0.065, 0.02], [0.065, 0.16], [0.03, 0.2], [0.03, 0.24], [0.001, 0.24]], mt.glass); vial.position.set(0.32, 0.07, -0.08); g.add(vial);
    const vl = cyl(0.058, 0.058, 0.12, new THREE.MeshPhysicalMaterial({ color: 0xfff1b8, transmission: 0.5, roughness: 0.1, thickness: 0.1 })); vl.position.set(0.32, 0.135, -0.08); g.add(vl);
    const vcap = cyl(0.036, 0.036, 0.04, new THREE.MeshStandardMaterial({ color: 0x0a84ff, roughness: 0.4 })); vcap.position.set(0.32, 0.33, -0.08); g.add(vcap);
    const lab = cyl(0.066, 0.066, 0.07, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), 48); lab.position.set(0.32, 0.17, -0.08); g.add(lab);
    return { group: g, cam: [0.7, 0.75, 1.15], target: [0.05, 0.12, 0], fov: 32 };
  }
});

/* ---------------------------------------------------------------- مخططات «كيف يعمل» المقطوعة
   labels: { p: نقطة في المشهد, at: موضع النص [0..1 من العرض والارتفاع], ar, en } */
const skin = () => new THREE.MeshPhysicalMaterial({ color: 0xd8c0a6, roughness: 0.55, sheen: 0.4, sheenColor: 0xffe2c8 });
const ghostSkin = () => new THREE.MeshPhysicalMaterial({ color: 0xe6cdb4, roughness: 0.5, transparent: true, opacity: 0.32, depthWrite: false });
const ghost = (col = 0xffffff, op = 0.18) => new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.25, clearcoat: 0.6, transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide });
const glowMat = (col, op = 1) => new THREE.MeshBasicMaterial({ color: col, transparent: op < 1, opacity: op, depthWrite: op >= 1, toneMapped: false, side: THREE.DoubleSide });

/** مجسّم إنسان (قائم، القدمان عند y=0، الوجه نحو +z) */
function mannequin(mat) {
  const g = new THREE.Group(), m = mat || skin();
  const cap = (r, len, x, y, z, rz = 0, sx = 1, sz = 1) => { const c = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 8, 24), m); c.position.set(x, y, z); c.rotation.z = rz; c.scale.set(sx, 1, sz); g.add(c); return c; };
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 24), m); head.scale.set(0.9, 1.12, 1); head.position.y = 1.6; g.add(head);
  cap(0.05, 0.06, 0, 1.47, 0);
  cap(0.17, 0.32, 0, 1.2, 0, 0, 1.05, 0.62);
  cap(0.15, 0.06, 0, 0.93, 0, Math.PI / 2, 1, 0.7);
  [-1, 1].forEach(sd => { cap(0.068, 0.68, 0.095 * sd, 0.47, 0, 0.02 * sd); cap(0.045, 0.52, 0.245 * sd, 1.13, 0, 0.09 * sd);
    const foot = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.1, 6, 12), m); foot.rotation.x = Math.PI / 2; foot.position.set(0.1 * sd, 0.04, 0.05); g.add(foot); });
  return g;
}
/** مريض مستلقٍ على ظهره، الرأس نحو -z */
function lyingPatient(mat, y = 0.95, z = 0.8) { const m = mannequin(mat); m.rotation.x = -Math.PI / 2; m.position.set(0, y, z); return m; }
function cone(rTop, rBot, h, mat, seg = 4) { const c = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg, 1, true), mat); if (seg === 4) c.rotation.y = Math.PI / 4; return c; }
function fan(r, angle, mat) { return new THREE.Mesh(new THREE.CircleGeometry(r, 48, -Math.PI / 2 - angle / 2, angle), mat); }
function arrowArc(R, arc, mat) { const g = new THREE.Group(); g.add(torus(R, 0.012, mat, arc)); const h = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 16), mat); h.position.set(R * Math.cos(arc), R * Math.sin(arc), 0); h.rotation.z = arc; g.add(h); return g; }
function arrowLine(len, mat) { const g = new THREE.Group(); const s = cyl(0.012, 0.012, len, mat, 12); s.position.y = len / 2; g.add(s); const h = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 16), mat); h.position.y = len + 0.04; g.add(h); return g; }
const L = (p, at, ar, en) => ({ p, at, ar, en });

Object.assign(MODELS, {
  "m-xray"() {
    const g = new THREE.Group(), mt = materials();
    const head = new THREE.Group();
    const housing = cyl(0.13, 0.13, 0.5, mt.shell, 48); housing.rotation.z = Math.PI / 2; head.add(housing);
    head.add(rbox(0.3, 0.2, 0.3, 0.03, mt.shell2, 0, -0.2, 0));
    head.position.set(0, 1.85, 0.05); g.add(head);
    g.add(rbox(0.14, 0.7, 0.14, 0.02, mt.shell, 0, 2.3, 0.05));
    const beam = cone(0.04, 0.5, 1.12, glowMat(0xffc861, 0.22)); beam.position.set(0, 1.18, 0.05); g.add(beam);
    g.add(rbox(0.5, 0.6, 0.7, 0.06, mt.shell, 0, 0.3, 0.6));
    g.add(rbox(0.76, 0.05, 2.1, 0.02, ghost(0xffffff, 0.35), 0, 0.66, 0.4));
    const det = rbox(0.62, 0.03, 0.62, 0.01, glowMat(0x34c759, 0.95), 0, 0.6, 0.05); g.add(det);
    g.add(lyingPatient(skin(), 0.8, 1.25));
    const mon = monitor(0.7, 0.46, textures().chest); mon.position.set(1.15, 1.25, -0.2); mon.rotation.y = -0.5; g.add(mon);
    return { group: g, cam: [2.4, 1.9, 3.3], target: [0.25, 1.1, 0.35], fov: 34, labels: [
      L([0, 1.9, 0.05], [0.2, 0.12], "أنبوب الأشعة", "X-ray tube"), L([0.12, 1.25, 0.05], [0.15, 0.42], "شعاع الأشعة السينية", "X-ray beam"),
      L([0.28, 0.6, 0.3], [0.2, 0.8], "الكاشف الرقمي", "Digital detector"), L([0.05, 0.9, 0.6], [0.5, 0.9], "المريض", "Patient"),
      L([1.15, 1.25, -0.2], [0.82, 0.15], "الصورة على الشاشة", "Image on screen")] };
  },
  "m-ct"() {
    const g = new THREE.Group(), mt = materials(), gy = 1.0;
    const shell = boreSlab(2.0, 2.0, 0.86, 0.38, 0.85, ghost(0xffffff, 0.16)); shell.position.set(0, gy, 0); g.add(shell);
    const ring = torus(0.7, 0.05, mt.graphite); ring.position.set(0, gy, 0); g.add(ring);
    const tube = rbox(0.24, 0.14, 0.26, 0.03, new THREE.MeshStandardMaterial({ color: 0xff9f0a, roughness: 0.4 }), 0, gy + 0.7, 0); g.add(tube);
    const det = torus(0.7, 0.07, glowMat(0x34c759), Math.PI * 0.42); det.rotation.z = -Math.PI / 2 - Math.PI * 0.21; det.position.set(0, gy, 0); g.add(det);
    const f = fan(1.35, 0.62, glowMat(0xffc861, 0.26)); f.position.set(0, gy + 0.66, 0); g.add(f);
    const rot = arrowArc(0.9, Math.PI * 0.5, glowMat(0x0a84ff)); rot.position.set(0, gy, 0.05); rot.rotation.z = Math.PI * 0.15; g.add(rot);
    g.add(patientTable({ length: 2.4, height: 0.86, z: 1.25 }));
    g.add(lyingPatient(skin(), 1.02, 0.7));
    const mv = arrowLine(0.5, glowMat(0x0a84ff)); mv.rotation.x = -Math.PI / 2; mv.position.set(0.38, 0.95, 1.6); g.add(mv);
    const mon = monitor(0.6, 0.6, textures().ct); mon.position.set(-1.35, 1.35, 0.6); mon.rotation.y = 0.55; g.add(mon);
    return { group: g, cam: [2.2, 1.7, 3.9], target: [-0.15, 1.0, 0.45], fov: 36, labels: [
      L([0, gy + 0.7, 0], [0.5, 0.06], "أنبوب الأشعة يدور حول الجسم", "X-ray tube rotates around the body"),
      L([0.3, gy + 0.2, 0], [0.86, 0.3], "حزمة مروحية من الأشعة", "Fan-shaped X-ray beam"),
      L([0.35, gy - 0.6, 0], [0.78, 0.86], "الكواشف", "Detectors"),
      L([0.38, 0.95, 1.85], [0.6, 0.94], "السرير يتحرك داخل الجهاز", "Table moves through the scanner"),
      L([-1.35, 1.35, 0.6], [0.12, 0.2], "مقطع عرضي", "Cross-sectional slice")] };
  },
  "m-mri"() {
    const g = new THREE.Group(), mt = materials(), gy = 1.08;
    const shell = boreSlab(2.2, 2.3, 0.95, 0.36, 1.7, ghost(0xffffff, 0.14)); shell.position.set(0, gy, 0); g.add(shell);
    const copper = new THREE.MeshStandardMaterial({ color: 0xc8793d, metalness: 1, roughness: 0.32 });
    [-0.65, -0.35, -0.08, 0.08, 0.35, 0.65].forEach(z => { const c = torus(0.82, 0.07, copper); c.position.set(0, gy, z); c.scale.z = 1.6; g.add(c); });
    const grad = cyl(0.5, 0.5, 1.5, ghost(0x5e5ce6, 0.35), 64); grad.rotation.x = Math.PI / 2; grad.position.set(0, gy, 0); g.add(grad);
    const bird = new THREE.Group(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; const r = cyl(0.008, 0.008, 0.36, glowMat(0x64d2ff), 8); r.rotation.x = Math.PI / 2; r.position.set(Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0); bird.add(r); } [-0.18, 0.18].forEach(z => { const t = torus(0.2, 0.01, glowMat(0x64d2ff)); t.position.z = z; bird.add(t); });
    bird.position.set(0, 1.1, -0.15); g.add(bird);
    for (let i = 0; i < 4; i++) { const k = 1.2 + i * 0.28; const e = new THREE.Mesh(new THREE.TorusGeometry(1, 0.006, 8, 128), glowMat(0x0a84ff, 0.5 - i * 0.09)); e.scale.set(1.1 * k, 0.6 * k, 1); e.rotation.y = Math.PI / 2; e.position.set(0, gy, 0); g.add(e); }
    g.add(patientTable({ length: 2.6, height: 0.9, z: 1.75 }));
    g.add(lyingPatient(skin(), 1.05, 1.5));
    return { group: g, cam: [3.4, 2.0, 3.8], target: [0, 1.0, 0.35], fov: 36, labels: [
      L([0.5, gy + 0.65, 0.35], [0.82, 0.1], "المغناطيس الرئيسي (ملفات فائقة التوصيل)", "Main magnet (superconducting coils)"),
      L([0.3, gy + 0.4, 0.75], [0.12, 0.1], "ملفات التدرج", "Gradient coils"),
      L([0.2, 1.1, -0.15], [0.1, 0.42], "ملف الترددات الراديوية", "Radiofrequency coil"),
      L([0, gy + 1.0, -1.2], [0.42, 0.04], "المجال المغناطيسي", "Magnetic field"),
      L([0.12, 1.12, 1.9], [0.62, 0.9], "المريض داخل الفتحة", "Patient inside the bore")] };
  },
  "m-ultrasound"() {
    const g = new THREE.Group(), mt = materials();
    g.add(rbox(0.7, 0.06, 2.0, 0.025, mt.shell, 0, 0.66, 0)); g.add(rbox(0.6, 0.05, 1.8, 0.02, mt.cushion, 0, 0.71, 0)); g.add(rbox(0.5, 0.6, 0.8, 0.06, mt.shell2, 0, 0.3, 0));
    g.add(lyingPatient(ghostSkin(), 0.87, 0.85));
    const liver = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 16), new THREE.MeshStandardMaterial({ color: 0x9c3b32, roughness: 0.5 })); liver.scale.set(1.4, 0.6, 0.9); liver.position.set(-0.04, 0.84, -0.12); g.add(liver);
    const gb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 24, 12), new THREE.MeshStandardMaterial({ color: 0x4f8a3c, roughness: 0.4 })); gb.position.set(0.04, 0.86, -0.05); g.add(gb);
    const probe = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.12, 6, 16), mt.shell); probe.position.set(0.03, 1.08, -0.08); probe.rotation.z = 0.15; g.add(probe);
    const f = fan(0.25, 0.9, glowMat(0x5ac8fa, 0.32)); f.rotation.y = Math.PI / 2; f.position.set(0.02, 1.0, -0.08); g.add(f);
    for (let i = 1; i <= 4; i++) { const a = torus(0.05 * i, 0.003, glowMat(0x5ac8fa, 0.8), 0.9); a.rotation.set(0, Math.PI / 2, -Math.PI / 2 - 0.45); a.position.set(0.02, 1.0, -0.08); g.add(a); }
    const cart = MODELS.ultrasound().group; cart.position.set(0.95, 0, -0.55); cart.rotation.y = -0.6; g.add(cart);
    return { group: g, cam: [1.6, 1.75, 1.6], target: [0.3, 0.95, -0.15], fov: 36, labels: [
      L([0.03, 1.12, -0.08], [0.18, 0.12], "المجس مع الجل", "Probe with gel"), L([0.02, 0.98, -0.08], [0.12, 0.5], "موجات صوتية وصداها", "Sound waves and echoes"),
      L([-0.06, 0.84, -0.15], [0.2, 0.85], "العضو (الكبد والمرارة)", "Organ (liver and gallbladder)"), L([0.95, 1.62, -0.7], [0.85, 0.12], "صورة لحظية", "Real-time image")] };
  },
  "m-mammography"() {
    const d = MODELS.mammography(), g = d.group, mt = materials();
    const breast = new THREE.Mesh(new THREE.SphereGeometry(0.11, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), skin()); breast.scale.set(1.2, 0.55, 1.1); breast.rotation.x = Math.PI; breast.position.set(0, 1.16, 0.36); breast.scale.y = 0.55; g.add(breast);
    const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.12, 32), skin()); b2.scale.z = 0.9; b2.position.set(0, 1.1, 0.33); g.add(b2);
    const beam = cone(0.03, 0.2, 0.62, glowMat(0xffc861, 0.25)); beam.position.set(0, 1.45, 0.33); g.add(beam);
    const p = arrowLine(0.12, glowMat(0x0a84ff)); p.rotation.x = Math.PI; p.position.set(0.24, 1.36, 0.36); g.add(p);
    return { group: g, cam: [1.4, 1.55, 1.75], target: [0, 1.3, 0.25], fov: 34, labels: [
      L([0, 1.86, 0.35], [0.2, 0.1], "أنبوب الأشعة", "X-ray tube"), L([0.1, 1.17, 0.4], [0.82, 0.38], "لوح الضغط", "Compression paddle"),
      L([0, 1.1, 0.42], [0.18, 0.6], "الثدي بين اللوحين", "Breast between the plates"), L([0.1, 1.03, 0.4], [0.75, 0.82], "الكاشف", "Detector"),
      L([0.05, 1.45, 0.33], [0.8, 0.12], "أشعة بطاقة منخفضة", "Low-energy X-rays")] };
  },
  "m-fluoroscopy"() {
    const d = MODELS.fluoroscopy(), g = d.group;
    g.add(lyingPatient(skin(), 1.07, 1.15));
    const beam = cone(0.05, 0.22, 1.35, glowMat(0xffc861, 0.25)); beam.position.set(0, 0.98, -0.1); beam.rotation.x = Math.PI; g.add(beam);
    return { group: g, cam: [3.0, 2.0, 3.2], target: [-0.1, 1.15, -0.1], fov: 36, labels: [
      L([0, 0.22, -0.1], [0.25, 0.9], "أنبوب الأشعة أسفل السرير", "X-ray tube under the table"), L([0, 1.8, -0.1], [0.2, 0.1], "الكاشف فوق المريض", "Detector above the patient"),
      L([0.05, 1.3, -0.1], [0.08, 0.45], "شعاع مستمر أو نبضي", "Continuous or pulsed beam"), L([0.55, 1.8, -0.45], [0.82, 0.12], "صورة حية متحركة", "Live moving image")] };
  },
  "m-nuclear"() {
    const g = new THREE.Group(), mt = materials(), gy = 1.05;
    [1, -1].forEach(sd => { const h = new THREE.Group(); h.add(rbox(0.62, 0.24, 0.9, 0.05, mt.shell)); h.add(rbox(0.56, 0.02, 0.84, 0.01, mt.graphite, 0, -0.12 * sd, 0)); h.position.set(0, gy + 0.43 * sd, 0.55); g.add(h); });
    const ring = boreSlab(2.3, 2.2, 0.7, 0.72, 0.5, ghost(0xffffff, 0.18)); ring.position.set(0, gy, -0.35); g.add(ring);
    g.add(patientTable({ length: 2.5, height: 0.86, z: 1.45, width: 0.42 }));
    g.add(lyingPatient(ghostSkin(), 1.02, 1.0));
    const hot = (x, y, z, r, c) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 12), glowMat(c)); s.position.set(x, y, z); g.add(s); const h = new THREE.Mesh(new THREE.SphereGeometry(r * 2.2, 24, 12), glowMat(c, 0.25)); h.position.copy(s.position); g.add(h); };
    for (let i = 0; i < 8; i++) hot(0, 1.0, -0.05 + i * 0.06, 0.018, 0xffb340);
    hot(-0.07, 1.0, 0.3, 0.035, 0xff7a3a); hot(0.07, 1.0, 0.3, 0.035, 0xff7a3a); hot(0, 1.0, 0.55, 0.04, 0xffd060); hot(0, 1.02, -0.6, 0.06, 0xffd060);
    [[0, 0.2], [-0.07, 0.3], [0.07, 0.4]].forEach(([x, z]) => { const r = cyl(0.004, 0.004, 0.3, glowMat(0xffc861, 0.8), 6); r.position.set(x, 1.18, z); g.add(r); });
    return { group: g, cam: [2.6, 1.9, 3.4], target: [0, 1.0, 0.45], fov: 34, labels: [
      L([0, 1.02, 0.3], [0.85, 0.55], "مادة مشعة متتبّعة داخل الجسم", "Radioactive tracer inside the body"),
      L([0.07, 1.25, 0.4], [0.82, 0.25], "أشعة جاما تخرج من الجسم", "Gamma rays leave the body"),
      L([0.3, gy + 0.55, 0.55], [0.3, 0.06], "كاشف جاما", "Gamma detector"), L([0.3, gy - 0.5, 0.55], [0.2, 0.9], "كاشف ثانٍ", "Second detector")] };
  },
  "m-interventional"() {
    const g = new THREE.Group(), mt = materials();
    g.add(patientTable({ length: 2.7, height: 0.94, z: 1.35 }));
    const c = cArm(0.86, 0.1); c.position.set(0, 1.02, -0.3); g.add(c);
    g.add(lyingPatient(ghostSkin(), 1.08, 1.1));
    const red = new THREE.MeshStandardMaterial({ color: 0xd2382d, roughness: 0.35, emissive: 0x6a0f0a, emissiveIntensity: 0.4 });
    const path = (pts, r) => g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p))), 64, r, 10), red));
    path([[0, 1.08, -0.45], [0, 1.08, 0.0], [0, 1.08, 0.25], [0.08, 1.08, 0.45], [0.1, 1.08, 0.95]], 0.022);
    path([[0, 1.08, 0.25], [-0.08, 1.08, 0.45], [-0.1, 1.08, 0.95]], 0.02);
    path([[0, 1.08, -0.05], [0.09, 1.07, -0.08], [0.12, 1.06, -0.02]], 0.012); path([[0, 1.08, -0.3], [-0.12, 1.08, -0.35], [-0.2, 1.08, -0.3]], 0.012);
    const cath = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[0.35, 1.2, 0.75], [0.15, 1.12, 0.62], [0.08, 1.08, 0.45], [0, 1.08, 0.2], [0, 1.08, -0.05], [0.09, 1.07, -0.08]].map(p => new THREE.Vector3(...p))), 80, 0.007, 8), glowMat(0x64d2ff));
    g.add(cath);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 8), glowMat(0xffffff)); tip.position.set(0.09, 1.07, -0.08); g.add(tip);
    const beam = cone(0.05, 0.24, 1.5, glowMat(0xffc861, 0.18)); beam.position.set(0, 1.02, -0.3); g.add(beam);
    return { group: g, cam: [1.9, 2.3, 2.6], target: [0.05, 1.05, 0.15], fov: 34, labels: [
      L([0.35, 1.2, 0.75], [0.82, 0.78], "فتحة دخول صغيرة", "Small entry point"), L([0.02, 1.08, 0.2], [0.85, 0.42], "القسطرة داخل الشريان", "Catheter inside the artery"),
      L([0.09, 1.07, -0.08], [0.55, 0.06], "طرف القسطرة عند الهدف", "Catheter tip at the target"), L([-0.1, 1.08, 0.7], [0.15, 0.85], "الأوعية الدموية", "Blood vessels"),
      L([0, 1.9, -0.3], [0.15, 0.12], "توجيه بالأشعة", "Imaging guidance")] };
  },
  "m-dexa"() {
    const d = MODELS.dexa(), g = d.group;
    g.add(lyingPatient(ghostSkin(), 0.82, 0.8));
    const bone = new THREE.MeshStandardMaterial({ color: 0xf4f1e8, roughness: 0.5, emissive: 0x333028, emissiveIntensity: 0.3 });
    for (let i = 0; i < 6; i++) g.add(rbox(0.07, 0.05, 0.05, 0.015, bone, 0, 0.8, -0.05 + i * 0.065));
    [-1, 1].forEach(sd => { const h = new THREE.Mesh(new THREE.SphereGeometry(0.06, 24, 12), bone); h.scale.set(1.4, 0.7, 1); h.position.set(0.09 * sd, 0.8, 0.42); g.add(h); const f = cyl(0.025, 0.025, 0.3, bone); f.rotation.x = Math.PI / 2; f.position.set(0.1 * sd, 0.8, 0.62); g.add(f); });
    const zone = rbox(0.4, 0.005, 0.5, 0.01, glowMat(0x34c759, 0.3), 0, 0.88, 0.25); g.add(zone);
    const b1 = cone(0.08, 0.02, 0.5, glowMat(0x0a84ff, 0.35)); b1.position.set(-0.05, 0.9, 0.15); g.add(b1);
    const b2 = cone(0.08, 0.02, 0.5, glowMat(0xffc861, 0.35)); b2.position.set(-0.07, 0.9, 0.19); g.add(b2);
    d.labels = [L([-0.06, 1.13, 0.15], [0.2, 0.08], "الكاشف يمر فوق المريض", "Detector moves over the patient"), L([-0.06, 0.95, 0.17], [0.1, 0.42], "شعاعان بطاقتين مختلفتين", "Two beams at different energies"),
      L([0.09, 0.8, 0.42], [0.55, 0.92], "قياس كثافة الورك والعمود الفقري", "Hip and spine density measured"), L([0.3, 0.42, 1.18], [0.85, 0.6], "نتيجة T-score", "T-score result")];
    d.cam = [2.0, 1.7, 2.4]; d.target = [0, 0.8, 0.3]; d.fov = 34; return d;
  },

  /* ---- الوقاية ---- */
  "s-tds"() {
    const g = new THREE.Group(), mt = materials();
    g.add(rbox(0.3, 1.3, 0.3, 0.05, mt.shell, -1.6, 0.65, 0));
    const src = cyl(0.13, 0.13, 0.42, mt.shell, 48); src.rotation.x = Math.PI / 2; src.position.set(-1.6, 1.35, 0); g.add(src);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 12), glowMat(0xffb340)); core.position.set(-1.38, 1.35, 0); g.add(core);
    for (let i = 1; i <= 5; i++) { const r = new THREE.Mesh(new THREE.RingGeometry(i * 0.5 - 0.01, i * 0.5 + 0.01, 96), glowMat(0xff9f0a, 0.5 - i * 0.07)); r.rotation.x = -Math.PI / 2; r.position.set(-1.6, 0.005, 0); g.add(r); }
    const figure = (x, col) => { const m = mannequin(new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.45, clearcoat: 0.4 })); m.position.set(x, 0, 0); m.rotation.y = -Math.PI / 2; g.add(m); };
    figure(-0.6, 0xff453a); figure(0.4, 0xff9f0a);
    const wall = rbox(0.12, 2.0, 1.4, 0.02, new THREE.MeshStandardMaterial({ color: 0x8e9aa5, roughness: 0.4, metalness: 0.5 }), 1.05, 1.0, 0); g.add(wall);
    const win = rbox(0.13, 0.4, 0.6, 0.02, mt.leadGlass, 1.05, 1.5, 0); g.add(win);
    figure(1.55, 0x30d158);
    return { group: g, cam: [0.3, 2.3, 4.8], target: [0.0, 0.95, 0], fov: 38, labels: [
      L([-1.38, 1.35, 0], [0.12, 0.12], "مصدر الأشعة", "Radiation source"),
      L([-0.6, 1.75, 0], [0.32, 0.1], "على بعد 1 م · جرعة 100%", "At 1 m · 100% dose"),
      L([0.4, 1.75, 0], [0.56, 0.1], "على بعد 2 م · جرعة 25%", "At 2 m · 25% dose"),
      L([1.05, 2.0, 0.3], [0.78, 0.06], "حاجز رصاصي", "Lead barrier"),
      L([1.55, 1.0, 0], [0.88, 0.62], "خلف الحاجز · أقل جرعة", "Behind the barrier · lowest dose")] };
  },
  "s-mri-zones"() {
    const g = new THREE.Group(), mt = materials();
    const zone = (w, d, x, z, col) => { const f = rbox(w, 0.04, d, 0.01, new THREE.MeshStandardMaterial({ color: col, roughness: 0.7 }), x, 0.02, z); g.add(f); };
    const wallM = new THREE.MeshStandardMaterial({ color: 0xf2f4f6, roughness: 0.8 });
    const wall = (w, d, x, z) => g.add(rbox(w, 0.45, d, 0.01, wallM, x, 0.26, z));
    zone(1.6, 3.0, -1.8, 0, 0x7fd6a0); zone(1.2, 3.0, -0.4, 0, 0x8fc7f2); zone(1.0, 3.0, 0.7, 0, 0xf6c27a); zone(1.4, 3.0, 1.9, 0, 0xf29a92);
    wall(0.06, 3.0, -1.0, 0); wall(0.06, 3.0, 0.2, 0); wall(0.08, 3.0, 1.2, 0); wall(5.2, 0.06, 0, -1.5);
    g.add(rbox(0.08, 0.45, 0.6, 0.01, mt.leadGlass, 1.2, 0.26, 0.7));
    const mri = MODELS.mri().group; mri.scale.setScalar(0.32); mri.position.set(1.95, 0.04, -0.35); mri.rotation.y = -Math.PI / 2; g.add(mri);
    const desk = rbox(0.5, 0.3, 0.3, 0.03, mt.shell, -0.45, 0.19, -0.9); g.add(desk);
    const chair = (x, z) => g.add(rbox(0.18, 0.2, 0.18, 0.03, mt.cushion, x, 0.14, z)); chair(-2.2, -0.3); chair(-2.2, 0.1); chair(-2.2, 0.5);
    const lab = (n, x, z) => { const t = new THREE.Mesh(new THREE.CircleGeometry(0.17, 48), new THREE.MeshBasicMaterial({ map: canvasTex(128, 128, (c, w, h) => { c.fillStyle = "#fff"; c.beginPath(); c.arc(64, 64, 62, 0, 7); c.fill(); c.fillStyle = "#1c1c1e"; c.font = "bold 84px sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(n, 64, 70); }), transparent: true })); t.rotation.x = -Math.PI / 2; t.position.set(x, 0.045, z); g.add(t); };
    lab("1", -1.8, 1.1); lab("2", -0.4, 1.1); lab("3", 0.7, 1.1); lab("4", 1.65, 1.1);
    return { group: g, cam: [0.2, 4.6, 4.2], target: [0.1, 0, 0.1], fov: 36, labels: [
      L([-1.8, 0.05, 0.6], [0.1, 0.9], "المنطقة 1 · عامة", "Zone 1 · Public"), L([-0.4, 0.05, 0.6], [0.36, 0.92], "المنطقة 2 · الاستقبال والفحص", "Zone 2 · Reception & screening"),
      L([0.7, 0.05, 0.6], [0.64, 0.92], "المنطقة 3 · مقيّدة", "Zone 3 · Restricted"), L([1.7, 0.4, -0.3], [0.88, 0.1], "المنطقة 4 · غرفة الجهاز", "Zone 4 · Scanner room")] };
  },
  "s-pregnancy"() {
    const g = new THREE.Group(), mt = materials();
    const us = MODELS.ultrasound().group; us.position.set(0.9, 0, -0.1); us.rotation.y = -0.4; g.add(us);
    const bed = new THREE.Group(); bed.add(rbox(0.7, 0.06, 1.9, 0.025, mt.shell, 0, 0.66, 0)); bed.add(rbox(0.6, 0.06, 1.75, 0.02, mt.cushion, 0, 0.72, 0)); bed.add(rbox(0.5, 0.6, 0.8, 0.06, mt.shell2, 0, 0.3, 0));
    bed.position.set(0, 0, 0.3); g.add(bed);
    const sign = new THREE.Group();
    sign.add(rbox(0.04, 1.3, 0.04, 0.015, mt.metal, 0, 0.65, 0)); sign.add(rbox(0.4, 0.04, 0.3, 0.015, mt.shell2, 0, 0.02, 0));
    const board = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.8, 0.03, 4, 0.03), [mt.shell, mt.shell, mt.shell, mt.shell, new THREE.MeshStandardMaterial({ roughness: 0.5, map: canvasTex(384, 512, (c, w, h) => {
      c.fillStyle = "#fff"; c.fillRect(0, 0, w, h); c.fillStyle = "#ff9f0a"; c.fillRect(0, 0, w, 120);
      c.fillStyle = "#fff"; c.beginPath(); c.arc(192, 60, 38, 0, 7); c.fill(); c.fillStyle = "#ff9f0a"; c.font = "bold 56px sans-serif"; c.textAlign = "center"; c.fillText("!", 192, 80);
      c.strokeStyle = "#ff9f0a"; c.lineWidth = 10; c.beginPath(); c.arc(192, 280, 80, 0, 7); c.stroke(); c.fillStyle = "#ff9f0a"; c.beginPath(); c.arc(192, 230, 22, 0, 7); c.fill(); c.beginPath(); c.ellipse(205, 300, 38, 48, 0, 0, 7); c.fill();
      c.fillStyle = "#1c1c1e"; c.font = "bold 30px sans-serif"; c.fillText("?", 300, 210);
    }) }), mt.shell]);
    board.position.y = 1.35; sign.add(board); sign.position.set(-0.85, 0, -0.5); sign.rotation.y = 0.45; g.add(sign);
    return { group: g, cam: [0.5, 1.8, 3.6], target: [0, 0.95, 0], fov: 36, labels: [
      L([-0.85, 1.6, -0.5], [0.13, 0.08], "احتمال حمل؟ أبلغي الفني أولًا", "Could you be pregnant? Tell the staff first"),
      L([0.9, 1.6, -0.2], [0.85, 0.08], "بديل بلا إشعاع: السونار", "Radiation-free option: ultrasound"),
      L([0, 0.78, 0.6], [0.5, 0.92], "تعديل الإعدادات أو تأجيل غير العاجل", "Adjust settings or postpone if not urgent")] };
  }
});

export const MODEL_IDS = Object.keys(MODELS);
export const LABELED_IDS = MODEL_IDS.filter(id => /^m-|^s-(tds|mri-zones|pregnancy)$/.test(id));

/* ---------------------------------------------------------------- المشهد الكامل */
export function buildScene(id, renderer, { background = 0xe4e9ee } = {}) {
  const mt = materials();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xd3dbe2);
  scene.fog = new THREE.Fog(0xd3dbe2, 6, 15);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x8f9daa, 0.45); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff8f0, 2.6);
  key.position.set(3.5, 6, 4); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 4; key.shadow.blurSamples = 20; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.5, far: 20 });
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xcfe6ff, 0.8); rim.position.set(-4, 3, -3); scene.add(rim);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), mt.floor);
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  const def = MODELS[id]();
  def.group.traverse(o => { if (o.isMesh && !(o.material && (o.material.isMeshBasicMaterial || o.material.transparent))) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(def.group);
  // ظل تلامس ناعم تحت الجهاز / soft contact shadow
  const box = new THREE.Box3().setFromObject(def.group), size = box.getSize(new THREE.Vector3()), ctr = box.getCenter(new THREE.Vector3());
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(size.x * 1.35 + 0.4, size.z * 1.35 + 0.4), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, map: canvasTex(256, 256, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, "rgba(20,30,40,.42)"); g.addColorStop(0.55, "rgba(20,30,40,.18)"); g.addColorStop(1, "rgba(20,30,40,0)"); c.fillStyle = g; c.fillRect(0, 0, w, h); }) }));
  blob.rotation.x = -Math.PI / 2; blob.position.set(ctr.x, 0.003, ctr.z); scene.add(blob);

  const camera = new THREE.PerspectiveCamera(def.fov || 30, 16 / 9, 0.05, 60);
  let target = new THREE.Vector3(...def.target);
  camera.position.set(...def.cam);
  if (def.fit) { // تأطير تلقائي حول الجهاز / auto-frame around the model
    const sph = box.getBoundingSphere(new THREE.Sphere());
    const dir = camera.position.clone().sub(target).normalize();
    target = sph.center.clone();
    camera.position.copy(target).addScaledVector(dir, sph.radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * def.fit);
  }
  camera.lookAt(target);
  return { scene, camera, target, labels: def.labels || [] };
}

export function makeRenderer(canvas, { preserve = false } = {}) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: preserve, alpha: false });
  r.toneMapping = THREE.AgXToneMapping; r.toneMappingExposure = 1.25;
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.VSMShadowMap;
  return r;
}

export { THREE };
