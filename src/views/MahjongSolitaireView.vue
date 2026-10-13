<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BackBar from '../components/BackBar.vue'

const router = useRouter()
const gameUrl = computed(() => `${import.meta.env.BASE_URL}vendor/mahjong-solitaire/index.html`)
</script>

<template>
  <main class="game-page">
    <BackBar title="麻将连连看" @back="router.push('/games')" />
    <section class="game-shell"><iframe :src="gameUrl" title="麻将牌配对消除游戏" sandbox="allow-scripts allow-same-origin" /></section>
    <p class="source-note">麻将牌配对消除玩法 · 不是四人麻将 · 全部逻辑和素材均在浏览器本地运行</p>
  </main>
</template>

<style scoped>
.game-page { min-height: 100dvh; padding: var(--space-3); background: var(--gradient-warm); }
.game-shell { overflow: auto; height: calc(100dvh - 105px); min-height: 690px; max-width: 1180px; margin: auto; background: #132e28; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
.game-shell iframe { width: 100%; height: 100%; min-width: 900px; border: 0; }
.source-note { margin: var(--space-2) auto 0; text-align: center; color: var(--text-tertiary); font-size: var(--text-xs); }
@media (max-width: 600px) { .game-page { height: 100dvh; min-height: 0; padding: var(--space-2); overflow: hidden; } .game-shell { height: calc(100dvh - 64px); min-height: 0; border-radius: var(--radius-md); } .source-note { display: none; } }
</style>
