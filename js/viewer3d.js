/* عارض ثلاثي الأبعاد تفاعلي — interactive 3D viewer (drag to rotate, pinch/scroll to zoom) */
import { buildScene, makeRenderer, THREE } from "./scenes3d.js";
import { OrbitControls } from "./vendor/addons/OrbitControls.js";

export function mount(host, id) {
  const canvas = document.createElement("canvas");
  canvas.className = "v3d-canvas";
  host.appendChild(canvas);
  const r = makeRenderer(canvas);
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const { scene, camera, target } = buildScene(id, r);
  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(target);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.9;
  controls.enablePan = false;
  const d = camera.position.distanceTo(target);
  controls.minDistance = d * 0.45; controls.maxDistance = d * 1.6;
  controls.maxPolarAngle = Math.PI / 2 - 0.04;
  controls.addEventListener("start", () => { controls.autoRotate = false; });
  const size = () => {
    const w = host.clientWidth, h = host.clientHeight;
    r.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(size); ro.observe(host); size();
  let raf = 0, alive = true;
  const loop = () => { if (!alive) return; controls.update(); r.render(scene, camera); raf = requestAnimationFrame(loop); };
  loop();
  return () => {
    alive = false; cancelAnimationFrame(raf); ro.disconnect(); controls.dispose();
    scene.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    r.dispose(); canvas.remove();
  };
}
export { THREE };
