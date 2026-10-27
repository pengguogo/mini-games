# 游戏专区开源组件来源

## 经典斗地主

- 项目：classic-doudizhu
- 来源：https://github.com/Hanbin-Zhang-JPN/classic-doudizhu
- 固定提交：`308837eb398463a2924652190f24fbd338207acc`
- 许可证：MIT，版权归 Hanbin Zhang 所有
- 引入日期：2026-10-13
- 本地位置：`public/vendor/classic-doudizhu/`
- 用途：经典三人叫分制斗地主，玩家与两位本地启发式 AI 对战。
- 运行边界：纯浏览器单机运行，不含真实货币、付费筹码、下注或联网房间。

## 麻将连连看

- 项目：Mahjong Solitaire
- 来源：https://github.com/ScriptRaccoon/mahjong-solitaire
- 固定提交：`89dc27b58ab6501994d43fe11dc216245ff820fa`
- 许可证：MIT，版权归 ScriptRaccoon 所有
- 引入日期：2026-10-13
- 本地位置：`public/vendor/mahjong-solitaire/`
- 用途：使用麻将牌面的单机配对消除游戏，不是四人麻将规则。
- 本地适配：界面汉化；将 jQuery 3.5.1 从 CDN 改为随包分发的 MIT 版本，避免运行时网络依赖。

## 炸金花筛选结论

- 2026-10-13 检查的候选 `CHENLAOSHICLS/zhajinhua` 虽采用 MIT，但依赖 Node.js、Socket.IO 与内存房间服务，无法纳入当前纯静态部署。
- 其他候选多为许可证不明确、联机服务端项目或带运营/下注导向的源码，因此本次不接入生产包。

## 飞行棋与蛇梯冒险棋

- 项目：OpenBoard Arcade
- 来源：https://github.com/zynocode/openboard-arcade
- 版本：1.2.0
- 许可证：MIT，版权归 Zynocode 所有
- 引入日期：2026-09-27
- 本地位置：`public/vendor/openboard/`
- 用途：复用 Ludo Royale 和 Snake & Ladder 的完整生产构建，包含人机/本地多人、Phaser 棋盘、3D 骰子、逐格移动、音效和胜利反馈。
- 本地适配：增加 URL 游戏入口，使站内飞行棋与冒险棋页面可以直接打开对应游戏；保留原 MIT 许可证。

## 围棋

- 项目：BesoGo
- 来源：https://github.com/yewang/besogo
- 版本：0.0.2-alpha
- 软件许可证：MIT，版权归 Ye Wang 所有
- 棋子图片：来自 go-assets，采用 CC BY-SA 4.0，版权归 Andreas Tarnowsky 所有
- 本地位置：`public/vendor/besogo/`
- 用途：九路响应式棋盘、真实棋子纹理、阴影、棋谱回退与编辑工具。
- 素材限制：未引入 BesoGo 中采用非商业许可证或许可证不明确的木纹棋盘图片；棋盘使用其开源 SVG/CSS 平面主题。

## 2048 / Emoji 扫雷 / 中国象棋（2026-10-27 引入）

| 游戏 | 来源 | 固定提交 | 许可证 | 本地位置 |
| --- | --- | --- | --- | --- |
| 2048 | https://github.com/gabrielecirulli/2048 | `478b6ec346e3787f589e4af751378d06ded4cbbc` | MIT，Gabriele Cirulli | `public/vendor/game-2048/` |
| Emoji 扫雷 | https://github.com/muan/emoji-minesweeper | `2187e371e9a0f87cf54a207031760fc33b858a9a` | MIT，Mu-An Chiou | `public/vendor/emoji-minesweeper/` |
| 中国象棋 | https://github.com/itlwei/Chess | `e8b4c0fea5220e08528286b157caa8f884f62505` | MIT，liwei | `public/vendor/xiangqi/` |

- 本地适配详见各目录 `SOURCE.md`：界面汉化；扫雷移除 Google Analytics、Google Fonts 与 Service Worker，默认系统 Emoji；象棋移除缺失的 cordova 引用，窄屏默认 325px 棋盘。
## 俄罗斯方块 / 数独 / 贪吃蛇（2026-10-27 引入）

| 游戏 | 来源 | 固定提交 | 许可证 | 本地位置 |
| --- | --- | --- | --- | --- |
| 俄罗斯方块 | https://github.com/Binaryify/vue-tetris | `7431abbb4fdc52a7aab53be0e14c3f5f3b03ccc8` | MIT，阿发 | `public/vendor/tetris/` |
| 数独 | https://github.com/andreynering/sudoku | `f8a58fcdcf15d1594850a3021d74f17795b0a4bf` | MIT，Andrey Nering | `public/vendor/sudoku/` |
| 贪吃蛇 | https://github.com/patorjk/JavaScript-Snake | `3243086c0badb4b4c6bedfe6d95d5a52a7caaa88` | MIT，Patrick Gillespie（TuiCss 为 MIT） | `public/vendor/snake/` |

- 三款均直接使用上游已提交的产物，不在本站重新构建；适配细节见各目录 `SOURCE.md`。
- 俄罗斯方块的像素精灵图上游从 alicdn 远程加载，已原样转存为本地文件并记录 SHA256。

- 本轮筛除：Hextris（许可证非 OSI 标准）、chvin/react-tetris（无许可证）、clumsy-bird（GPL-3.0）、jakesgordon/javascript-tetris（无触屏操作）、taniarascia/sokoban（仅一关、仅键盘）。

完整许可证与上游说明均随相应本地组件一并保留。
