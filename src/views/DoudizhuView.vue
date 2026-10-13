<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BackBar from '../components/BackBar.vue'

const router = useRouter()
const gameUrl = computed(() => `${import.meta.env.BASE_URL}vendor/classic-doudizhu/index.html`)
</script>

<template>
  <main class="game-page">
    <BackBar title="经典斗地主" @back="router.push('/games')" />
    <section class="game-shell"><iframe :src="gameUrl" title="经典斗地主人机对战" allow="fullscreen" /></section>
    <p class="source-note">单机三人局 · 两位本地 AI · 叫分制 · 不含充值、下注或联网房间</p>
  </main>
</template>

<style scoped>
.game-page { min-height: 100dvh; padding: var(--space-3); background: #172f28; }
.game-shell { overflow: hidden; height: calc(100dvh - 105px); min-height: 680px; max-width: 1180px; margin: auto; background: #17372f; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
.game-shell iframe { width: 100%; height: 100%; border: 0; }
.source-note { margin: var(--space-2) auto 0; text-align: center; color: #d7e3dc; font-size: var(--text-xs); }
@media (max-width: 600px) { .game-page { height: 100dvh; min-height: 0; padding: var(--space-2); overflow: hidden; } .game-shell { height: calc(100dvh - 64px); min-height: 0; border-radius: var(--radius-md); } .source-note { display: none; } }
</style>
