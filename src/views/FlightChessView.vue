<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BackBar from '../components/BackBar.vue'

const router = useRouter()
const gameUrl = computed(() => `${import.meta.env.BASE_URL}vendor/aeroplane-chess/index.html`)
</script>

<template>
  <main class="game-page">
    <BackBar title="中国飞行棋 · 极简飞行棋" @back="router.push('/games')" />
    <div>
      <section class="game-shell"><iframe :src="gameUrl" title="极简中国飞行棋" allow="autoplay; fullscreen" /></section>
      <p class="source-note">中国飞行棋规则 · 人机与本地多人 · 跳飞动画 · AI 托管 · 音效</p>
    </div>
  </main>
</template>

<style scoped>
.game-page { min-height: 100dvh; padding: var(--space-4); background: var(--gradient-warm); }
.game-shell { overflow: hidden; height: min(900px, calc(100dvh - 116px)); min-height: 700px; background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
.game-shell iframe { width: 100%; height: 100%; border: 0; }
.source-note { margin-top: var(--space-2); text-align: center; color: var(--text-tertiary); font-size: var(--text-xs); }
@media (max-width: 600px) {
  .game-page { height: 100dvh; min-height: 0; padding: var(--space-2); overflow: hidden; }
  .game-shell { height: calc(100dvh - 72px); min-height: 0; border-radius: var(--radius-md); }
  .source-note { display: none; }
}
</style>
