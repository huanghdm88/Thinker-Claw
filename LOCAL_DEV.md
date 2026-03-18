# 本地开发环境

## 一、启动本地服务

在仓库根目录 `GLTF` 下执行：

```bash
npm install
npm run dev
```

会启动静态服务，默认端口 **3000**。

## 二、访问地址

| 地址 | 说明 |
|------|------|
| http://localhost:3000/ | 自动跳转到 Demo 应用 |
| http://localhost:3000/Thinker-Pet-app-demo/ | 角色选择页（入口） |
| http://localhost:3000/Thinker-Pet-app-demo/chat.html | 对话页 |
| http://localhost:3000/Thinker-Pet-app-demo/settings.html | 设置页 |
| http://localhost:3000/Thinker-pet/ | Thinker-pet 角色展示（iframe 会从此路径加载） |

## 三、手机同网段访问

若需在真机调试：

1. 查看本机 IP（如 `192.168.1.100`）
2. 手机连同一 WiFi，浏览器访问：`http://192.168.1.100:3000/Thinker-Pet-app-demo/`

## 四、注意事项

- 必须通过 HTTP 访问，不要用 `file://` 打开，否则 iframe 与 postMessage 可能受跨域限制。
- 角色模块（Thinker-pet）通过相对路径 `../Thinker-pet/index.html` 加载，本地与 Demo 需在同一域名下，故从根目录起用 `serve` 同时提供两个目录。

---

## 五、Review 要点（本地环境）

| 项目 | 说明 |
|------|------|
| **服务根目录** | 必须从 `GLTF` 根目录起跑 `serve`，这样 `/Thinker-Pet-app-demo/` 与 `/Thinker-pet/` 同源，iframe 与 postMessage 正常。 |
| **config.js** | `petBase` 为相对路径 `../Thinker-pet/index.html`，在本地与 Vercel 同仓库部署下均适用。 |
| **角色列表** | `charactersJsonUrl` 指向 GitHub raw；若网络或 CORS 失败会回退到内置列表，不影响使用。 |
| **根路径** | 根目录 `index.html` 做跳转到 `Thinker-Pet-app-demo/`，与 Vercel 上根路径重定向行为一致（Vercel 当前指向 `chat.html`，可按需在 `vercel.json` 改为 `/Thinker-Pet-app-demo/`）。 |
