<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BackBar from '../components/BackBar.vue'

const router = useRouter()
const gameUrl = computed(() => `${import.meta.env.BASE_URL}vendor/besogo/index.html`)
</script>

<template>
  <main class="game-page">
    <BackBar title="九路围棋 · BesoGo" @back="router.push('/games')" />
    <div>
      <section class="game-shell"><iframe :src="gameUrl" title="BesoGo 九路围棋" allow="fullscreen" /></section>
      <p class="source-note">真实棋子纹理 · 落子阴影 · 棋谱回退 · 死活标记</p>
    </div>
  </main>
</template>

<style scoped>
.game-page { min-height: 100dvh; padding: var(--space-4); background: var(--gradient-warm); }
.game-shell { overflow: hidden; height: min(820px, calc(100dvh - 116px)); min-height: 620px; background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
.game-shell iframe { width: 100%; height: 100%; border: 0; }
.source-note { margin-top: var(--space-2); text-align: center; color: var(--text-tertiary); font-size: var(--text-xs); }
@media (max-width: 600px) { .game-page { padding: var(--space-2); } .game-shell { min-height: 680px; } }
</style>
