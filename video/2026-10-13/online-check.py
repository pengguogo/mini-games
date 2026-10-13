from playwright.sync_api import sync_playwright
from pathlib import Path
import json
R=Path(__file__).resolve().parent
with sync_playwright() as w:
 b=w.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless=True)
 p=b.new_page(viewport={'width':375,'height':812});errors=[];bad=[];req=[]
 p.on('pageerror',lambda e:errors.append(str(e)));p.on('request',lambda r:req.append(r.url));p.on('response',lambda r:bad.append([r.url,r.status]) if r.status>=400 else None)
 p.goto('http://game.penggeai.com',wait_until='networkidle');assert p.locator('.card').count()==9
 assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
 initial=req.copy();p.screenshot(path=str(R/'capture/online-home.png'),full_page=True)
 checks=[]
 for name in ['picture-puzzle','shape-puzzle','memory-match','pattern-play','tic-tac-toe','gomoku','flight-chess','adventure-chess','go']:
  p.goto('http://game.penggeai.com/#/games/'+name,wait_until='networkidle');p.wait_for_timeout(400)
  if name=='picture-puzzle':
   assert p.locator('.image-check').evaluate('(e)=>e.complete&&e.naturalWidth>0')
  checks.append({'game':name,'overflow':p.evaluate('document.documentElement.scrollWidth>innerWidth'),'frames':[{'url':f.url,'text':f.locator('body').inner_text()[:90]} for f in p.frames]})
 (R/'online-check.json').write_text(json.dumps({'initialRequests':initial,'errors':errors,'badResponses':bad,'games':checks,'externalRequests':[u for u in req if not u.startswith('http://game.penggeai.com')]},ensure_ascii=False,indent=2))
 b.close()
