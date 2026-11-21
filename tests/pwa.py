# Simulates GitHub Pages: serve the site, use it, ship an "update", reopen — data must survive; offline must work.
import asyncio, os, shutil, sys
from playwright.async_api import async_playwright
SITE = os.environ.get("SITE_DIR", "/tmp/site/Spanish-learning-app")
URL = os.environ.get("SITE_URL", "http://localhost:8765/Spanish-learning-app/")
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("CHROME_PATH") or None, args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width": 390, "height": 844})
        pg = await ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(800)
        await pg.fill("#w-name", "Noa"); await pg.click("#w-skip"); await pg.wait_for_timeout(300)
        await pg.evaluate("S.cards['c_llegar']=schedule(null,3); S.read['s1']={score:1,date:Date.now()}; bumpStreak(); save()")
        sw = await pg.evaluate("navigator.serviceWorker.getRegistration().then(r=>!!r)")
        print("service worker registered:", sw)
        await pg.screenshot(path=os.path.join(os.path.dirname(__file__), "screenshots", "pwa_home.png"))
        # ship an update: change the served index.html
        html = open(os.path.join(SITE, "index.html"), encoding="utf8").read()
        open(os.path.join(SITE, "index.html"), "w", encoding="utf8").write(html.replace("Cuentos <span>y</span> Tarjetas", "Cuentos <span>y</span> Tarjetas<!--v-next-->"))
        await pg.reload(); await pg.wait_for_timeout(800)
        got_update = "v-next" in await pg.content()
        print("update received on reopen:", got_update)
        print("data kept after update:", await pg.evaluate("S.name + ' | cards=' + Object.keys(S.cards).length + ' | read=' + Object.keys(S.read).length + ' | days=' + practiceDays() + ' | view=' + VIEW"))
        await ctx.set_offline(True); await pg.reload(); await pg.wait_for_timeout(800)
        print("works offline:", await pg.evaluate("typeof S==='object' && VIEW"))
        open(os.path.join(SITE, "index.html"), "w", encoding="utf8").write(html)
        print("ERRORS:", [e for e in errs]); await b.close()
asyncio.run(main())
