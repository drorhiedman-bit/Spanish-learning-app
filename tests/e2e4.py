# Slang only in its own mode; "I know it" button after flipping a card.
import asyncio, os
from playwright.async_api import async_playwright
OUT = os.path.join(os.path.dirname(__file__), "screenshots"); os.makedirs(OUT, exist_ok=True)
URL = "file://" + os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "index.html"))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get("CHROME_PATH") or None, args=["--no-sandbox"])
        pg = await (await b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)).new_page()
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(300)
        await pg.click("#w-skip")
        # read the Argentine story so its words enter the normal queue
        await pg.evaluate("S.read['s10']={score:1,date:Date.now()}; S.read['s11']={score:1,date:Date.now()}; save()")
        nq = await pg.evaluate("newQueue()")
        slang_in_normal = await pg.evaluate("newQueue().filter(isSlang).map(id=>DEFS[id].es)")
        print("normal new queue has slang:", slang_in_normal, "| s10 normal words present:", await pg.evaluate("newQueue().includes('c_parrilla')"))
        # mixed session: no slang
        await pg.evaluate("go('cards')"); await pg.wait_for_timeout(150)
        await pg.screenshot(path=os.path.join(OUT, "v5_hub.png"))
        await pg.click('.mode[data-m="mixed"]'); await pg.click("#c-start"); await pg.wait_for_timeout(150)
        print("mixed session slang count:", await pg.evaluate("SES.q.filter(isSlang).length"), "of", await pg.evaluate("SES.q.length"))
        await pg.click("#s-flip"); await pg.wait_for_timeout(250)
        await pg.screenshot(path=os.path.join(OUT, "v5_card_back.png"))
        first = await pg.evaluate("SES.q[SES.i]")
        await pg.click("#s-known2"); await pg.wait_for_timeout(250)
        print("marked known:", first, await pg.evaluate(f"!!S.known['{first}']"), "| still in rest of queue:", await pg.evaluate(f"SES.q.slice(SES.i).includes('{first}')"), "| next card index:", await pg.evaluate("SES.i"))
        # slang mode: only slang
        await pg.evaluate("SES=null; go('cards')"); await pg.click('.mode[data-m="jerga"]'); await pg.click("#c-start"); await pg.wait_for_timeout(150)
        print("slang session non-slang count:", await pg.evaluate("SES.q.filter(id=>!isSlang(id)).length"), "of", await pg.evaluate("SES.q.length"))
        await pg.click("#s-flip"); await pg.wait_for_timeout(250)
        await pg.screenshot(path=os.path.join(OUT, "v5_slang_back.png"))
        for _ in range(30):
            if await pg.query_selector("#d-more"): break
            if await pg.query_selector("#s-flip"): await pg.click("#s-flip")
            await pg.click('.grade[data-g="3"]')
        await pg.click("#d-more"); await pg.wait_for_timeout(150)
        print("continue after slang round stays slang:", await pg.evaluate("SES.mode"), await pg.evaluate("SES.q.filter(id=>!isSlang(id)).length"))
        await pg.evaluate("SES=null; go('home')")
        print("home due/new exclude slang:", await pg.evaluate("dueList().filter(isSlang).length"))
        print("ERRORS:", errs); await b.close()
asyncio.run(main())
