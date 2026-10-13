import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from './Home.vue'
import './styles/tokens.css'
import './styles/site.css'
const router = createRouter({ history: createWebHashHistory(), routes: [{path:'/',component:Home},{path:'/games',redirect:'/'} ,{path:'/games/picture-puzzle',component:()=>import('./views/PicturePuzzleView.vue')},{path:'/games/shape-puzzle',component:()=>import('./views/ShapePuzzleView.vue')},{path:'/games/memory-match',component:()=>import('./views/MemoryMatchView.vue')},{path:'/games/pattern-play',component:()=>import('./views/PatternPlayView.vue')},{path:'/games/tic-tac-toe',component:()=>import('./views/TicTacToeView.vue')},{path:'/games/gomoku',component:()=>import('./views/GomokuView.vue')},{path:'/games/flight-chess',component:()=>import('./views/FlightChessView.vue')},{path:'/games/adventure-chess',component:()=>import('./views/AdventureChessView.vue')},{path:'/games/go',component:()=>import('./views/GoView.vue')}] })
createApp(App).use(router).mount('#app')
