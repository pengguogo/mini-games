import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

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
