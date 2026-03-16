# 部署到 Vercel

本仓库包含 **Thinker-pet**（角色展示）和 **Thinker-Pet-app-demo**（H5 对话应用），部署后根路径会重定向到 Demo 应用。

## 一、推送到 Git 仓库

在项目根目录（`GLTF`）执行：

```bash
git init
git add Thinker-pet Thinker-Pet-app-demo vercel.json .gitignore DEPLOY.md
git commit -m "feat: add Thinker Pet app and Vercel config"
```

在 GitHub / GitLab / Bitbucket 新建仓库后：

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

（如已有仓库，直接 `git add .` 后 `git push` 即可。）

## 二、在 Vercel 部署

1. 打开 [vercel.com](https://vercel.com)，用 GitHub/GitLab/Bitbucket 登录。
2. 点击 **Add New Project**，选择刚推送的仓库。
3. **Root Directory** 保持默认（仓库根目录）。
4. **Framework Preset** 选 **Other**（无需构建）。
5. **Build and Output Settings** 留空即可（静态站点）。
6. 点击 **Deploy**。

部署完成后会得到类似 `https://你的项目.vercel.app` 的地址：

- 访问根路径 `/` 会重定向到 `/Thinker-Pet-app-demo/`（角色选择 / 对话应用）。
- 嵌入用的 Thinker-pet 页面在 `/Thinker-pet/`，由 Demo 内 iframe 自动加载。

## 三、本地用 Vercel CLI 部署（可选）

```bash
npm i -g vercel
cd /path/to/GLTF
vercel
```

按提示登录并选择或创建项目即可。
