<script setup>
import { ref, computed } from 'vue'
const base = import.meta.env.BASE_URL
const category = ref('全部')
const games = [
 ['picture-puzzle','童话拼图','把森林里的小美好，拼回原位。','拼图','🧩'],
 ['memory-match','动物翻翻乐','翻开两张卡，找到一对小伙伴。','益智','🐱'],
 ['shape-puzzle','几何转转拼图','转一转，让几何图案归位。','拼图','◈'],
 ['pattern-play','找规律','下一颗星星，会在哪里？','益智','✦'],
 ['tic-tac-toe','井字棋','三子连成线，来一场小小对决。','棋类','ＸＯ'],
 ['gomoku','五子棋','黑白之间，慢慢想下一步。','棋类','●'],
 ['flight-chess','飞行棋','掷出骰子，出发去终点。','棋类','✈'],
 ['adventure-chess','蛇梯冒险棋','爬上梯子，小心滑下来的蛇。','棋类','⚄'],
 ['go','九路围棋','在小棋盘上，体验黑白落子。','棋类','○']
]
const visible = computed(() => games.filter(g => category.value === '全部' || g[3] === category.value))
</script>
<template><main class="home">
<header><a href="#/" class="wordmark"><b>P.</b> 鹏哥小游戏</a><span>下班后，玩一会儿。</span></header>
<section class="hero"><div><p class="eyebrow">SMALL GAMES. SIMPLE JOY.</p><h1>给快乐<br>留一点<em>空白。</em></h1><p class="desc">没有广告打断，也不用先登录。<br>选一个喜欢的小游戏，轻松玩一局。</p><div class="pills"><span>无广告</span><span>无需登录</span><span>浏览器直接玩</span></div><RouterLink class="cta" to="/games/picture-puzzle">从一幅拼图开始 ↗</RouterLink></div><RouterLink class="hero-art" to="/games/picture-puzzle"><img :src="`${base}images/games/woodland-puzzle.webp`" alt="童话拼图真实游戏插画"><p>01 / 童话拼图 <b>点开就玩 ↗</b></p></RouterLink></section>
<section><div class="library-head"><div><p class="eyebrow">YOUR LITTLE PLAYGROUND</p><h2>今天，玩点什么？<small>09 款小游戏</small></h2></div><nav aria-label="游戏分类"><button v-for="c in ['全部','拼图','益智','棋类']" :key="c" :class="{active:category===c}" @click="category=c">{{c}}</button></nav></div><div class="cards"><RouterLink v-for="g in visible" :key="g[0]" :to="'/games/'+g[0]" class="card"><div class="card-art" :class="'art-'+g[3]">{{g[4]}}</div><div class="card-copy"><small>{{g[3]}}</small><h3>{{g[1]}} <span>↗</span></h3><p>{{g[2]}}</p></div></RouterLink></div></section>
<footer><p>少一点打扰，多一点快乐。</p><a href="https://github.com/pengguogo/english-app" target="_blank" rel="noopener">源项目 · english-app ↗</a><details><summary>开源来源与署名</summary><p>玩法摘自 Mimi 启蒙乐园。飞行棋：ZTMYO/MinimalistAeroplaneChess；蛇梯棋：zynocode/openboard-arcade；围棋：yewang/besogo；几何拼图：refusado/scrollzz。完整许可证随源码保留；围棋棋子素材为 Andreas Tarnowsky / go-assets，CC BY-SA 4.0。</p></details></footer>
</main></template>
