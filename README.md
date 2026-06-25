# GYX AI Portfolio Website

高煜翔个人作品集网站，使用 React + Vite 构建，适合部署到 GitHub Pages。

## 本地预览

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址即可预览。

## 构建检查

```bash
npm run build
```

构建产物会生成在 `dist/`，该目录不需要提交到 GitHub。

## 后续替换作品内容

主要内容位于：

- `src/App.jsx`：页面内容、项目数据、个人介绍、联系方式
- `styles.css`：整体视觉样式
- `assets/`：视频、项目封面、角色卡等素材

替换图片时，建议把新素材放到 `assets/covers/` 或 `assets/profile/`，再在 `src/App.jsx` 中修改对应路径。

## GitHub Pages 部署

本项目已经配置 `.github/workflows/deploy.yml`。代码推送到 GitHub 的 `main` 或 `master` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。

首次部署时需要在 GitHub 仓库中开启 Pages：

1. 打开仓库页面。
2. 进入 `Settings`。
3. 左侧选择 `Pages`。
4. `Build and deployment` 的 `Source` 选择 `GitHub Actions`。
5. 回到仓库的 `Actions` 页面，等待 `Deploy to GitHub Pages` 执行完成。

部署完成后，GitHub 会在 Actions 结果或 Pages 设置页显示线上访问地址。
