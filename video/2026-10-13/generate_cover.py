from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
R=Path(__file__).resolve().parent
with sync_playwright() as w:
 b=w.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless=True)
 p=b.new_page(viewport={'width':1080,'height':1920});p.goto((R/'cover.html').as_uri());p.screenshot(path=str(R/'out/cover.png'));b.close()
im=Image.open(R/'out/cover.png');im.verify();assert Image.open(R/'out/cover.png').size==(1080,1920)
