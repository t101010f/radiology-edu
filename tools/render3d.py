"""يولّد صور النماذج ثلاثية الأبعاد إلى assets/img/3d/*.jpg
تشغيل: python3 tools/render3d.py [id ...]   (يتطلب playwright و google-chrome)"""
import base64, http.server, os, sys, threading, functools
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img", "3d"); os.makedirs(OUT, exist_ok=True)
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
H.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
    pg = b.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.goto(f"http://127.0.0.1:{srv.server_port}/tools/render3d.html"); pg.wait_for_function("window.READY === true", timeout=60000)
    args = sys.argv[1:]
    labeled = set(pg.evaluate("window.LABELED_IDS"))
    ids = args or pg.evaluate("window.MODEL_IDS")
    for i in [x for x in ids if x in labeled]:
        for lang in ("ar", "en"):
            url = pg.evaluate("([i, l]) => window.renderLabeled(i, l)", [i, lang])
            data = base64.b64decode(url.split(",", 1)[1])
            open(os.path.join(OUT, f"{i}-{lang}.jpg"), "wb").write(data); print(i, lang, len(data) // 1024, "KB")
    for i in [x for x in ids if x not in labeled]:
        url = pg.evaluate("([i]) => window.renderImage(i)", [i])
        data = base64.b64decode(url.split(",", 1)[1])
        open(os.path.join(OUT, i + ".jpg"), "wb").write(data); print(i, len(data) // 1024, "KB")
    if errs: print("ERRORS", errs)
    b.close()
srv.shutdown()
