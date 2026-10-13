from pathlib import Path
import json,time
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parent
with sync_playwright() as w:
 b=w.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless=True)
 c=b.new_context(viewport={'width':430,'height':820},device_scale_factor=2,record_video_dir=str(R/'capture'),record_video_size={'width':430,'height':820})
 p=c.new_page();errors=[];requests=[];bad=[]
 p.on('pageerror',lambda e:errors.append(str(e)))
 p.on('request',lambda r:requests.append(r.url))
 p.on('response',lambda r:bad.append({'url':r.url,'status':r.status}) if r.status>=400 else None)
 p.goto('http://127.0.0.1:5180/',wait_until='networkidle');p.screenshot(path=str(R/'capture/home-mobile.png'),full_page=True)
 initial=list(requests);metrics=p.evaluate('({navigation:performance.getEntriesByType("navigation")[0].toJSON(),resources:performance.getEntriesByType("resource").map(x=>({name:x.name,transferSize:x.transferSize,duration:x.duration}))})');p.wait_for_timeout(1700)
 p.get_by_role('button',name='棋类',exact=True).click();assert p.locator('.card').count()==5;p.wait_for_timeout(1000)
 p.get_by_role('button',name='全部',exact=True).click();p.get_by_role('link',name='从一幅拼图开始').click();p.wait_for_timeout(1000)
 p.get_by_role('button',name='看看原图').click();p.wait_for_timeout(1300);p.get_by_role('button',name='继续拼图').click()
 p.locator('.picture-piece').nth(0).click();p.wait_for_timeout(400);p.locator('.picture-piece').nth(1).click();p.wait_for_timeout(500)
 for i in range(4):
  if p.get_by_role('button',name='帮我拼一块').is_enabled():p.get_by_role('button',name='帮我拼一块').click();p.wait_for_timeout(550)
 assert '拼好了' in p.locator('[role=status]').inner_text();p.screenshot(path=str(R/'capture/puzzle-win.png'));p.wait_for_timeout(1500)
 p.get_by_role('button',name='返回上一页').click();p.get_by_role('link',name='动物翻翻乐').click();p.wait_for_timeout(700)
 for i in range(4):
  p.locator('.memory-grid button').nth(i).click();p.wait_for_timeout(600)
 p.screenshot(path=str(R/'capture/memory.png'));p.get_by_role('button',name='返回上一页').click()
 p.get_by_role('link',name='井字棋').click();p.wait_for_timeout(500)
 buttons=p.locator('.kids-grid button')
 for i in [0,3,1,4,2]:buttons.nth(i).click();p.wait_for_timeout(400)
 p.screenshot(path=str(R/'capture/tic-win.png'));p.wait_for_timeout(1300)
 p.get_by_role('button',name='返回上一页').click();p.get_by_role('link',name='五子棋',exact=False).click();p.wait_for_timeout(700)
 p.screenshot(path=str(R/'capture/gomoku.png'));p.wait_for_timeout(1000)
 video=p.video;c.close();video.save_as(str(R/'capture/demo.webm'))
 q=b.new_page(viewport={'width':1280,'height':900});q.goto('http://127.0.0.1:5180/',wait_until='networkidle');q.screenshot(path=str(R/'capture/home-desktop.png'),full_page=True)
 checks=[]
 for route in ['shape-puzzle','pattern-play','flight-chess','adventure-chess','go']:
  q.goto('http://127.0.0.1:5180/#/games/'+route,wait_until='networkidle');q.wait_for_timeout(600);checks.append({'route':route,'iframe':q.locator('iframe').count(),'body':q.inner_text('body')[:100]});q.screenshot(path=str(R/'capture'/f'{route}.png'))
 (R/'browser-check.json').write_text(json.dumps({'errors':errors,'badResponses':bad,'initialRequests':initial,'requests':requests,'metrics':metrics,'otherGames':checks,'mobileOverflow':p.is_closed()},ensure_ascii=False,indent=2));b.close()
