# 滚动背景视频生成提示词

类型：时间静止子弹时间 / Bullet-Time Frozen Orbit

## 图片 Prompt

黑银电影感的超现实宽画幅画面，一位抽象 AI 视觉设计师作为中央主体悬浮在画面中景，身体稳定悬停，周围冻结漂浮着视频时间线碎片、半透明胶片帧、发光纸张、玻璃片、光粒、镜头轨迹线和作品画面残影，所有悬浮元素在前景、中景、背景形成强烈空间层次。前景有虚化的玻璃片和银色纸页擦过镜头边缘，中景主体被冷白侧逆光和少量暖金边缘光勾勒，背景是深黑摄影棚般的雾气空间、柔和体积光束和远处若隐若现的影像屏幕轮廓。构图干净，主体不要过满，左右保留网站文字展示空间，真实摄影质感，surreal cinematic atmosphere, floating objects frozen in midair, strong foreground parallax, central subject in the middle, deep background layers, 16:9 wide cinematic frame，无文字、无字幕、无水印、无 UI、无 logo。

## 图生视频运镜 Prompt

one continuous shot, no cuts, no scene transition, no text。镜头从深黑空间远处缓慢推进，先穿过前景几片静止悬浮的玻璃片、银色纸页和发光时间线碎片，逐渐靠近画面中央悬浮的 AI 视觉设计师主体；随后镜头围绕主体做平滑的 180 度弧形旋转，速度缓慢克制，主体始终稳定在画面中间，周围的视频帧、光粒、纸张和镜头轨迹保持时间冻结，只允许极轻微漂浮。前景悬浮物擦过镜头形成真实视差，冷白侧逆光和暖金边缘光方向保持稳定，雾气只轻微流动。最后镜头停在主体侧前方中近景，主体仍在中央，悬浮元素环绕四周，画面保持有意义的最后一帧，不切黑、不转场、不改变主体身份。

## 网页接入说明

- 当前网页先使用根目录的 `../hero.mp4` 作为滚动同步背景视频。
- 正式视频生成后，替换 `script.js` 里的 `BACKGROUND_VIDEO_SRC`。
- 当前背景视频从 `START_TIME = 0.2` 开始，滚动到页面底部时接近视频末帧。
- 用正式视频最后 1-2 秒抽取一张 `assets/fallback/final-frame.jpg`，保证 Contact 段停留在稳定画面。
