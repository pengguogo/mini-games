# 上游来源

- 项目：Binaryify/vue-tetris
- 来源：https://github.com/Binaryify/vue-tetris
- 固定提交：`7431abbb4fdc52a7aab53be0e14c3f5f3b03ccc8`
- 许可证：MIT，Copyright (c) 2017 阿发
- 引入日期：2026-10-27
- 本地内容：上游 `docs/` 中的生产构建（Vue + Vuex），未在本站重新构建。
- 本地适配：移除桌面引导区的远程 GitHub Star/Fork 按钮和远程二维码图片，删除 `qr.jpeg` 与 source map，并在 `index.html` 隐藏桌面端的 GitHub 与二维码引导区；站内入口通过 `?lan=cn` 固定中文界面。音效 `music.mp3` 随上游本地分发。
- 精灵图：上游 CSS 原从 `//img.alicdn.com/tps/TB1qq7kNXXXXXacXFXXXXXXXXXX-400-186.png` 远程加载（像素数字、暂停/音效图标、像素恐龙），2026-10-27 原样转存为 `static/sprite.png`，SHA256 `2ebed24ecd7b002f49d1e911e471fb49ef22d713c39c09ee947043835a2b6106`，CSS 改为相对路径引用。该图未随上游仓库提交，按上游 MIT 项目的一部分使用。
