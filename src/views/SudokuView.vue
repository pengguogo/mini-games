<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BackBar from '../components/BackBar.vue'

const router = useRouter()
const gameUrl = computed(() => `${import.meta.env.BASE_URL}vendor/sudoku/index.html`)
</script>

<template>
  <main class="game-page">
    <BackBar title="数独" @back="router.push('/games')" />
    <section class="game-shell"><iframe :src="gameUrl" title="数独" /></section>
    <p class="source-note">简单 / 中等 / 困难三档 · 冲突数字自动标红 · 进度保存在本机</p>
  </main>
</template>

<style scoped>
.game-page { min-height: 100dvh; padding: var(--space-3); background: var(--gradient-warm); }
.game-shell { overflow: auto; height: calc(100dvh - 105px); min-height: 600px; max-width: 760px; margin: auto; background: #ffffff; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
.game-shell iframe { width: 100%; height: 100%; border: 0; display: block; }
.source-note { margin: var(--space-2) auto 0; text-align: center; color: var(--text-tertiary); font-size: var(--text-xs); }
@media (max-width: 600px) { .game-page { height: 100dvh; min-height: 0; padding: var(--space-2); overflow: hidden; } .game-shell { height: calc(100dvh - 64px); min-height: 0; border-radius: var(--radius-md); } .source-note { display: none; } }
</style>
