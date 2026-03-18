/**
 * Thinker-Claw 仓库配置
 * 角色模块（iframe 展示、头像等）从此仓库加载
 * 仓库: https://github.com/huanghdm88/Thinker-Claw
 */
(function (global) {
  var THINKER_CLAW_REPO = 'https://github.com/huanghdm88/Thinker-Claw';
  // 与 Thinker-pet 同仓库部署时使用相对路径；单独部署 Demo 时可改为绝对地址，例如：
  // https://huanghdm88.github.io/Thinker-Claw/Thinker-pet/index.html 或
  // https://你的项目.vercel.app/Thinker-pet/index.html
  var PET_BASE = '../Thinker-pet/index.html';

  global.ThinkerClawConfig = {
    /** Thinker-pet 页面 base URL（iframe src） */
    petBase: PET_BASE,
    /** 仓库地址 */
    repoUrl: THINKER_CLAW_REPO,
    /** 角色列表 JSON 远程地址（配置后从 Thinker-Claw 拉取角色列表） */
    charactersJsonUrl: 'https://raw.githubusercontent.com/huanghdm88/Thinker-Claw/main/Thinker-pet/characters.json',
  };
})(typeof window !== 'undefined' ? window : globalThis);
