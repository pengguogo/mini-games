# 鹏哥下班玩 AI #03：无广告小游戏专区

- 成片：out/pengge-ai-03-mini-games.mp4，1080×1920 / 30 fps / 49.6 秒。
- 配音：Qwen3-TTS VoiceDesign 1.7B 4bit，用户试听后选择 energetic。每段使用统一声音描述；未强行加速。
- 封面：out/cover.png，1080×1920；HTML 模板使用本期真实首页截图。
- 口播与镜头：script-and-shots.md。发布标题与正文：publish-copy.md。
- 真实手机录屏：project/public/demo.webm；浏览器、构建与测试证据见 JSON / txt。
- 视频字幕按每条实际 WAV 的开始、结束和句长分配，不是逐词强制对齐；句子级时间轴见 timing.json。

## 复现视频

```sh
cd project
npm ci
npm run render
```

Chrome 默认位于 /Applications/Google Chrome.app/Contents/MacOS/Google Chrome；其他系统请调整 package.json 的 --browser-executable 参数。

## 复现配音

安装 mlx-audio 的 Python 环境，仅适用于支持 MLX 的 macOS Apple Silicon：

```sh
python3 generate_voice.py --python /path/to/python --style energetic --sample
# 试听确认后
python3 generate_voice.py --python /path/to/python --style energetic
```

模型：mlx-community/Qwen3-TTS-12Hz-1.7B-VoiceDesign-4bit；支持 natural/professional/energetic/documentary。生成完成后将 out/narration.wav 复制到 project/public/，timing.json 复制到 project/src/，再渲染。

封面脚本依赖 playwright 与 Pillow，需 Chrome。生成前将真实首页截图放到 capture/home-desktop.png，然后运行 generate_cover.py。

## 验证范围

7 项源玩法测试通过；公网 9 个游戏入口无页面异常、HTTP 错误和 375px 横向溢出。拼图、翻牌、井字棋实际操作留有录屏。所有游戏整局、人机策略质量和所有设备兼容性不在本次验收范围。

首页初始仅 HTML、JS、CSS、WebP 四个资源；主 JS 约 39 KB gzip。WebP 226790 字节，原图 2897010 字节。它们是包体积，不是公网秒开承诺。上游 OpenBoard 的 Google 字体已移除。
