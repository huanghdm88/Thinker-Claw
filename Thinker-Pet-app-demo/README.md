# Thinker-Pet-app-demo

**H5 应用（仅面向手机浏览）**：选择角色后进入与该角色的对话页，可发消息、下达任务或创建定时任务；角色根据执行状态实时切换动作（聆听 → 处理 → 输出/成功 → 对话 → 默认状态）。

## 功能

1. **与角色对话**：选择角色后，在对话页向该角色发送消息；角色以 Agent 逻辑回复，并可按意图创建 Cron、写入长记忆或执行技能。
2. **下达任务与定时任务**：支持普通任务（商业分析、行业分析、知识架构图）与 **Cron 定时任务**（如「每天 9 点提醒我开会」「每周一提醒我复盘」），系统自动识别并创建；创建成功时角色会短暂显示「成功」状态。
3. **角色动作实时切换**：根据执行流程自动切换：聆听 → 处理 → 输出文字/输出视觉/成功/错误 → 对话 → 恢复为默认状态（行走/待机/对话，可在设置中选）。
4. **角色默认状态**：在设置页可选择对话页加载时及回复结束后的默认动作：**行走**、**待机** 或 **对话**。
5. **设置页**：切换角色、默认状态、人设、长记忆、Cron 任务管理。

## 使用

- 将本目录与同级的 `Thinker-pet` 放在同一站点下（同域），以便 iframe 加载 Thinker-pet。
- 用本地服务器打开（避免 file:// 跨域）：
  ```bash
  cd GLTF && npx serve -p 3000
  ```
  手机访问：`http://<你的电脑IP>:3000/Thinker-Pet-app-demo/`
- 首次进入为角色选择页，选好后进入对话页；在设置中可切换角色、默认状态、人设与长记忆。

## 目录结构

```
Thinker-Pet-app-demo/
├── index.html       # 选择角色
├── chat.html        # 与角色对话（含顶部 Thinker-pet）
├── settings.html    # 设置：角色 / 默认状态 / 人设 / 长记忆 / Cron
├── css/styles.css   # H5 暗色样式
├── js/
│   ├── storage.js   # 本地存储
│   ├── characters.js # 角色列表（与 Thinker-pet 0～20 一致）
│   ├── thinker-pet-bridge.js # 与 Thinker-pet 通信（postMessage/API）
│   ├── agent.js     # 意图解析、Cron/长记忆/技能、进化退化
│   └── chat.js      # 对话页逻辑
└── README.md
```

## 与 Thinker-pet 对接

- iframe 加载 `../Thinker-pet/index.html?embed=1&character=N&action=...`，嵌入模式仅显示角色画布。
- 对话页顶部内嵌 Thinker-pet，默认动作由设置页「角色默认状态」决定，随 Agent 状态通过 postMessage 实时切换动作。
- 动作与场景对应见 [Thinker-pet/INTEGRATION.md](../Thinker-pet/INTEGRATION.md)。
