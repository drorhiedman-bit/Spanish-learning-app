import os
OUT = os.path.join(os.path.dirname(__file__), "screenshots"); os.makedirs(OUT, exist_ok=True)
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("CHROME_PATH") or None, args=["--no-sandbox"])
        pg = await (await b.new_context(viewport={"width":390,"height":844}, device_scale_factor=2)).new_page()
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://" + os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "index.html")) + ""); await pg.wait_for_timeout(300)
        await pg.click("#w-skip")
        print("jerga ids:", await pg.evaluate("JERGA_IDS.length"), "defs:", await pg.evaluate("Object.keys(DEFS).length"))
        print("new queue head:", await pg.evaluate("newQueue().slice(0,9).map(id=>DEFS[id].es).join(' | ')"))
        await pg.evaluate("go('cards')"); await pg.click('.mode[data-m="jerga"]'); await pg.click("#c-start"); await pg.wait_for_timeout(200)
        await pg.click("#s-flip"); await pg.wait_for_timeout(250)
        await pg.screenshot(path="" + OUT + "/v3_slang.png")
        await pg.click("#ctx-es .w >> nth=0"); await pg.wait_for_timeout(250)
        print("tap gloss:", await pg.text_content("#ws-gloss"))
        await pg.evaluate("closeSheet(); SES=null; go('reader','s10')"); await pg.wait_for_timeout(300)
        await pg.screenshot(path="" + OUT + "/v3_story_ar.png")
        await pg.evaluate("go('reader','s1')"); 
        print("una underlined in s1:", await pg.evaluate("[...document.querySelectorAll('.story .w')].filter(e=>e.dataset.w.toLowerCase()==='una' && (e.classList.contains('lrn')||e.classList.contains('tgt'))).length"))
        await pg.evaluate("go('verbs')"); await pg.wait_for_timeout(200)
        await pg.click('.tab[data-t="gerundio"]'); await pg.wait_for_timeout(200)
        await pg.screenshot(path="" + OUT + "/v3_verbs.png", full_page=True)
        print("default set:", await pg.evaluate("[...CJ_SET].join(',')"))
        await pg.click("#cj-start"); await pg.wait_for_timeout(200)
        qs = await pg.evaluate("CJ.q.map(q=>q.t+': '+q.before+' ['+q.ans+'] '+q.after).join('\\n')")
        print(qs)
        await pg.screenshot(path="" + OUT + "/v3_conj.png")
        for i in range(20):
            if await pg.query_selector("#cj-again"): break
            await pg.evaluate("document.querySelector(`.cjq .opt[data-o=\"${CJ.q[CJ.i].ans}\"]`).click()")
            await pg.click("#cj-next")
        print("ERRORS:", errs); await b.close()
asyncio.run(main())
