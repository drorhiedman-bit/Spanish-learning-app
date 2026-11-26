# Tense drill: the "💡 הסבר" button and the automatic explanation after a mistake.
import asyncio, os
from playwright.async_api import async_playwright
OUT = os.path.join(os.path.dirname(__file__), "screenshots"); os.makedirs(OUT, exist_ok=True)
URL = "file://" + os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "index.html"))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("CHROME_PATH") or None, args=["--no-sandbox"])
        pg = await (await b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)).new_page()
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(300); await pg.click("#w-skip")
        await pg.evaluate("S.settings.autoplay=false; go('verbs')")
        await pg.click("#cj-start"); await pg.wait_for_timeout(200)
        await pg.evaluate("""()=>{const v=VERBS.find(x=>x.inf==='volver');const f=allForms(v,'perfecto',true);
          CJ.q[0]={t:'perfecto',v,pi:3,pron:'nosotros',ans:f[3],opts:['ha vuelto','hemos vuelto','has vuelto','volvamos'],before:'Esta semana, nosotros',after:v.c}; renderConj();}""")
        await pg.click('.cjq .opt[data-o="volvamos"]'); await pg.wait_for_timeout(250)
        print("auto explanation after mistake:", await pg.evaluate("!!document.querySelector('#cj-exp .cj-explain')"))
        print("button label:", await pg.text_content("#cj-why"))
        print(await pg.inner_text("#cj-exp"))
        await pg.evaluate("document.querySelector('#cj-fb').scrollIntoView({block:'start'})"); await pg.wait_for_timeout(150)
        await pg.screenshot(path=os.path.join(OUT, "v6_wrong.png"))
        await pg.click("#cj-next")
        await pg.evaluate("document.querySelector(`.cjq .opt[data-o=\"${CJ.q[CJ.i].ans}\"]`).click()"); await pg.wait_for_timeout(150)
        print("closed after correct:", await pg.evaluate("document.querySelector('#cj-exp').innerHTML===''"))
        await pg.click("#cj-why"); await pg.wait_for_timeout(150)
        print("opens on tap:", await pg.evaluate("!!document.querySelector('#cj-exp .cj-explain')"))
        print("ERRORS:", errs); await b.close()
asyncio.run(main())
