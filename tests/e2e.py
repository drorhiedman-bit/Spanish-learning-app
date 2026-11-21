import os
OUT = os.path.join(os.path.dirname(__file__), "screenshots"); os.makedirs(OUT, exist_ok=True)
import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("CHROME_PATH") or None, args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":390,"height":844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        pg = await ctx.new_page()
        errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: m.type=="error" and errs.append(m.text))
        await pg.goto("file://" + os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "index.html")) + "")
        await pg.wait_for_timeout(800)
        await pg.screenshot(path="" + OUT + "/01_welcome.png")
        await pg.click("#w-test")
        # answer placement: always choose first option
        for i in range(15):
            await pg.wait_for_selector(".pt-opts .opt")
            if i==2: await pg.screenshot(path="" + OUT + "/02_placement.png")
            # pick correct answer via JS to simulate a B1 learner: correct for band<=2
            await pg.evaluate("""()=>{const it=PT.item.x;const k=it.band<=2?it.a:-1;document.querySelector(`.pt-opts .opt[data-k="${k}"]`).click();}""")
        await pg.wait_for_timeout(300)
        await pg.screenshot(path="" + OUT + "/03_result.png")
        print("level after placement:", await pg.evaluate("S.level"))
        await pg.click("#pt-go")
        await pg.wait_for_timeout(400)
        await pg.screenshot(path="" + OUT + "/04_reader.png", full_page=False)
        # tap a word
        await pg.click(".story .w >> nth=5")
        await pg.wait_for_timeout(400)
        await pg.screenshot(path="" + OUT + "/05_sheet.png")
        await pg.click("#ws-add") if await pg.query_selector("#ws-add") else None
        await pg.click("#scrim", position={"x":20,"y":50})
        # answer quiz
        n = await pg.evaluate("Reader.story.questions.length")
        for qi in range(n):
            a = await pg.evaluate(f"Reader.story.questions[{qi}].answer")
            await pg.click(f'.q[data-q="{qi}"] .opt[data-o="{a}"]')
        await pg.wait_for_timeout(300)
        await pg.evaluate("document.querySelector('#q-res').scrollIntoView()")
        await pg.screenshot(path="" + OUT + "/06_quiz.png")
        await pg.click("#q-practice")
        await pg.wait_for_timeout(300)
        await pg.screenshot(path="" + OUT + "/07_card.png")
        await pg.click("#s-flip")
        await pg.wait_for_timeout(200)
        await pg.screenshot(path="" + OUT + "/08_card_back.png")
        for g in [3,1,4,3,3,2]:
            if await pg.query_selector("#s-flip"):
                await pg.click("#s-flip")
            if await pg.query_selector(f'.grade[data-g="{g}"]'):
                await pg.click(f'.grade[data-g="{g}"]')
        print("cards:", await pg.evaluate("Object.keys(S.cards).length"), "due:", await pg.evaluate("dueList().length"))
        await pg.click("#s-x") if await pg.query_selector("#s-x") else await pg.click("#d-home")
        await pg.evaluate("go('home')")
        await pg.wait_for_timeout(300)
        await pg.screenshot(path="" + OUT + "/09_home.png")
        await pg.evaluate("go('cards')"); await pg.wait_for_timeout(200)
        await pg.screenshot(path="" + OUT + "/10_cards.png")
        await pg.evaluate("go('stories')"); await pg.wait_for_timeout(200)
        await pg.screenshot(path="" + OUT + "/11_stories.png")
        await pg.evaluate("go('progress')"); await pg.wait_for_timeout(200)
        await pg.screenshot(path="" + OUT + "/12_progress.png", full_page=True)
        # reload persistence
        await pg.reload(); await pg.wait_for_timeout(500)
        print("after reload level:", await pg.evaluate("S.level"), "cards:", await pg.evaluate("Object.keys(S.cards).length"), "view:", await pg.evaluate("VIEW"))
        # FSRS sanity
        print(await pg.evaluate("""()=>{let c=null;const out=[];let t=Date.now();for(const g of [3,3,3,3]){c=schedule(c,g,t);out.push(c.ivl);t=c.due+3*HOUR;}c=schedule(c,1,t);out.push('lapse s='+c.s.toFixed(2));return out.join(',')}"""))
        print("ERRORS:", errs)
        await b.close()
asyncio.run(main())
