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
        # simulate old streak data migration
        await pg.evaluate("go('reader','s1')")
        n = await pg.evaluate("Reader.story.questions.length")
        for qi in range(n):
            a = await pg.evaluate(f"Reader.story.questions[{qi}].answer"); await pg.click(f'.q[data-q="{qi}"] .opt[data-o="{a}"]')
        await pg.click("#q-practice"); await pg.wait_for_timeout(200)
        await pg.click("#s-flip"); await pg.wait_for_timeout(300)
        await pg.screenshot(path="" + OUT + "/v2_card.png")
        await pg.click("#ctx-es .w >> nth=1"); await pg.wait_for_timeout(300)
        await pg.screenshot(path="" + OUT + "/v2_card_sheet.png")
        await pg.click("#scrim", position={"x":20,"y":40})
        await pg.click("#s-lang"); await pg.wait_for_timeout(200)
        await pg.screenshot(path="" + OUT + "/v2_card_en.png")
        # finish session
        for _ in range(40):
            if await pg.query_selector("#d-more"): break
            if await pg.query_selector("#s-flip"): await pg.click("#s-flip")
            await pg.click('.grade[data-g="3"]')
        await pg.screenshot(path="" + OUT + "/v2_end.png")
        await pg.click("#d-more"); await pg.wait_for_timeout(200)
        print("extra session len:", await pg.evaluate("SES && SES.q.length"))
        await pg.evaluate("SES=null; go('home')"); await pg.wait_for_timeout(200)
        await pg.screenshot(path="" + OUT + "/v2_home.png")
        await pg.evaluate("go('cards')"); await pg.click('.mode[data-m="free"]'); await pg.click("#c-start"); await pg.wait_for_timeout(200)
        print("free session len:", await pg.evaluate("SES && SES.q.length"))
        await pg.evaluate("SES=null; S.day.newDone=99; go('cards')"); await pg.click('.mode[data-m="new"]'); await pg.click("#c-start")
        print("new beyond goal len:", await pg.evaluate("SES && SES.q.length"))
        await pg.evaluate("SES=null; go('verbs')"); await pg.wait_for_timeout(200)
        await pg.screenshot(path="" + OUT + "/v2_verbs.png", full_page=True)
        await pg.click("#cj-start"); await pg.wait_for_timeout(200)
        await pg.screenshot(path="" + OUT + "/v2_conj.png")
        for i in range(17):
            if await pg.query_selector("#cj-again"): break
            await pg.evaluate("document.querySelector(`.cjq .opt[data-o=\"${CJ.q[CJ.i].ans}\"]`).click()") if i%3 else await pg.click(".cjq .opt >> nth=0")
            if i==0:
                await pg.click("#cj-tab"); await pg.wait_for_timeout(100); await pg.screenshot(path="" + OUT + "/v2_conj_fb.png")
            await pg.click("#cj-next")
        print("days:", await pg.evaluate("practiceDays()"), "conj:", await pg.evaluate("JSON.stringify(S.conj)"))
        print("sample q:", await pg.evaluate("(()=>{const q=makeQuestion(['imperfecto','subjuntivo'],VERBS);return q.before+' ___ '+q.after+' | '+q.ans+' | '+q.opts.join(',')})()"))
        print("ERRORS:", errs); await b.close()
asyncio.run(main())
