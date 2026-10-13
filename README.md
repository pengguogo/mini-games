# 鹏哥小游戏

从 [Mimi 启蒙乐园](https://github.com/pengguogo/english-app) 抽离的独立浏览器小游戏专区。9 款游戏，无广告，无需登录；纯静态部署，不依赖学习平台或后端。

部署入口：http://game.penggeai.com （已上线）

```sh
npm ci
npm test
npm run dev
# 生产构建
npm run build
npm run preview
```

童话拼图、几何拼图、动物翻翻乐、找规律、井字棋、五子棋、飞行棋、蛇梯冒险棋、九路围棋。棋类模式取决于各上游实现；不提供联网对战。围棋为棋盘编辑与落子，不承诺自动裁判或 AI。

首页插画由源项目 PNG 转为 WebP，约 227 KB；首页 JS 约 39 KB gzip。每款游戏按路由加载，首页不会下载第三方棋盘引擎。实际加载速度取决于网络、设备与服务器。

## 自动部署

推送 main 自动触发 GitHub Actions：npm ci → 玩法测试 → 生产构建 → SCP 上传 → 原子切换版本 → Nginx 与 HTTP 响应检查。每次推送 main 均触发部署，也可手动 workflow_dispatch。

在仓库 Settings → Secrets and variables → Actions 中配置与原项目相同的 ALIYUN_HOST、ALIYUN_USER、ALIYUN_PASSWORD。GitHub 无法读取原仓库 Secret 的值；请在新仓库重新设置，密码不进入源码或聊天。服务器需已有 Nginx，部署用户需有 /var/www 与 Nginx 管理权限。

DNS：添加 game 的 A 记录指向 ALIYUN_HOST，按原项目服务器 IP 配置。站点独立使用 /var/www/mini-games 和 /etc/nginx/conf.d/game.penggeai.conf。

部署完成后访问 /version.txt 查看提交 SHA。上一版本路径保存在 /var/www/mini-games/previous-release，可切换 current 符号链接回滚。

## 开源署名

本项目遵循源项目 LICENSE。第三方组件保持各自许可证，详见 docs 与 public/vendor/*/LICENSE。BesoGo 棋子图片为 Andreas Tarnowsky 的 go-assets，CC BY-SA 4.0。

飞行棋使用 ZTMYO/MinimalistAeroplaneChess（当前组件目录为 aeroplane-chess）；蛇梯冒险棋使用 OpenBoard Arcade。docs/game-open-source-sources.md 保留源项目历史来源记录，实际入口以 src/views 中的路径为准。

## 本期视频

制作文件在 video/2026-10-13/；成片与封面通过 GitHub Release 分发，避免把大文件放入 Git 历史。
