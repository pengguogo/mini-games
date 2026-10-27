import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, readdirSync } from 'node:fs'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('新增棋牌入口、源码和许可证齐全', () => {
  const home = read('src/Home.vue')
  const router = read('src/main.js')
  for (const game of ['classic-doudizhu', 'mahjong-solitaire']) {
    assert.equal(existsSync(new URL(`../public/vendor/${game}/index.html`, import.meta.url)), true)
    assert.match(read(`public/vendor/${game}/LICENSE`), /Permission is hereby granted/)
    assert.match(read(`public/vendor/${game}/SOURCE.md`), /固定提交/)
  }
  assert.match(home, /经典斗地主/)
  assert.match(home, /麻将连连看/)
  assert.match(router, /DoudizhuView\.vue/)
  assert.match(router, /MahjongSolitaireView\.vue/)
})

test('两款新增游戏不依赖远程运行时脚本或样式', () => {
  for (const game of ['classic-doudizhu', 'mahjong-solitaire']) {
    const html = read(`public/vendor/${game}/index.html`)
    assert.doesNotMatch(html, /<(?:script|link)[^>]+(?:src|href)=["']https?:\/\//i)
  }
  const mahjong = read('public/vendor/mahjong-solitaire/index.html')
  assert.match(mahjong, /jquery-3\.5\.1\.min\.js/)
  assert.equal(existsSync(new URL('../public/vendor/mahjong-solitaire/jquery.LICENSE.txt', import.meta.url)), true)
})

test('2048、扫雷、象棋入口、许可证与来源齐全且无远程依赖', () => {
  const home = read('src/Home.vue')
  const router = read('src/main.js')
  const games = { 'game-2048': 'Game2048View', 'emoji-minesweeper': 'MinesweeperView', xiangqi: 'XiangqiView' }
  for (const [dir, view] of Object.entries(games)) {
    const license = existsSync(new URL(`../public/vendor/${dir}/LICENSE`, import.meta.url)) ? `public/vendor/${dir}/LICENSE` : `public/vendor/${dir}/LICENSE.txt`
    assert.match(read(license), /Permission is hereby granted/)
    assert.match(read(`public/vendor/${dir}/SOURCE.md`), /固定提交/)
    assert.match(router, new RegExp(`${view}\\.vue`))
    assert.doesNotMatch(read(`public/vendor/${dir}/index.html`), /<(?:script|link)[^>]+(?:src|href)=["']https?:\/\//i)
  }
  for (const name of ['2048', 'Emoji 扫雷', '中国象棋']) assert.match(home, new RegExp(name))
  const mines = read('public/vendor/emoji-minesweeper/index.html')
  assert.doesNotMatch(mines, /google-analytics|serviceWorker/)
  assert.match(mines, /id="emoji" checked/)
  assert.doesNotMatch(read('public/vendor/xiangqi/index.html'), /cordova/)
  assert.equal(existsSync(new URL('../public/vendor/xiangqi/js/gambit.all.js', import.meta.url)), true)
})

test('俄罗斯方块、数独、贪吃蛇入口、许可证与来源齐全且无远程依赖', () => {
  const home = read('src/Home.vue')
  const router = read('src/main.js')
  for (const [dir, view, name] of [['tetris', 'TetrisView', '俄罗斯方块'], ['sudoku', 'SudokuView', '数独'], ['snake', 'SnakeView', '贪吃蛇']]) {
    assert.match(read(`public/vendor/${dir}/LICENSE`), /Permission is hereby granted/)
    assert.match(read(`public/vendor/${dir}/SOURCE.md`), /固定提交/)
    assert.match(router, new RegExp(`${view}\\.vue`))
    assert.match(home, new RegExp(name))
    assert.doesNotMatch(read(`public/vendor/${dir}/index.html`), /<(?:script|link|iframe|img)[^>]+(?:src|href)=["']https?:\/\//i)
  }
  const tetris = readdirSync(new URL('../public/vendor/tetris/static/js/', import.meta.url)).map(f => read(`public/vendor/tetris/static/js/${f}`)).join('')
  assert.doesNotMatch(tetris, /ghbtns\.com|raw\.githubusercontent\.com/)
  assert.doesNotMatch(read('public/vendor/sudoku/bundle.js'), /e.children,l.createElement\(i,null\)|The code of this game/)
  assert.doesNotMatch(read('public/vendor/snake/index.html'), /googletagmanager/)
  assert.match(read('src/views/TetrisView.vue'), /lan=cn/)
  const tetrisCss = readdirSync(new URL('../public/vendor/tetris/static/css/', import.meta.url)).map(f => read(`public/vendor/tetris/static/css/${f}`)).join('')
  assert.doesNotMatch(tetrisCss, /url\((?:https?:)?\/\//)
  assert.equal(existsSync(new URL('../public/vendor/tetris/static/sprite.png', import.meta.url)), true)
})
