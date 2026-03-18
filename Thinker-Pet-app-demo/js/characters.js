/**
 * 角色列表，与 Thinker-pet 索引 0～20 一致
 * 若配置了 ThinkerClawConfig.charactersJsonUrl，则从 Thinker-Claw 仓库拉取并覆盖
 * 仓库: https://github.com/huanghdm88/Thinker-Claw
 */
var CHARACTERS = [
  { index: 0, id: 'c01', name: '科技人形', base: 'robot' },
  { index: 1, id: 'c02', name: '暖阳鸭', base: 'duck' },
  { index: 2, id: 'c03', name: '薄荷兔', base: 'rabbit' },
  { index: 3, id: 'c04', name: '樱花喵咪', base: 'cat' },
  { index: 4, id: 'c05', name: '天空熊', base: 'bear' },
  { index: 5, id: 'c06', name: '暖橙人形', base: 'robot' },
  { index: 6, id: 'c07', name: '青柠鸭', base: 'duck' },
  { index: 7, id: 'c08', name: '薰衣草喵咪', base: 'cat' },
  { index: 8, id: 'c09', name: '蜜桃兔', base: 'rabbit' },
  { index: 9, id: 'c10', name: '深海熊', base: 'bear' },
  { index: 10, id: 'c11', name: '琥珀人形', base: 'robot' },
  { index: 11, id: 'c12', name: '翡翠鸭', base: 'duck' },
  { index: 12, id: 'c13', name: '玫瑰喵咪', base: 'cat' },
  { index: 13, id: 'c14', name: '奶油兔', base: 'rabbit' },
  { index: 14, id: 'c15', name: '靛青熊', base: 'bear' },
  { index: 15, id: 'c16', name: '珊瑚红人形', base: 'robot' },
  { index: 16, id: 'c17', name: '柠檬鸭', base: 'duck' },
  { index: 17, id: 'c18', name: '丁香喵咪', base: 'cat' },
  { index: 18, id: 'c19', name: '森林兔', base: 'rabbit' },
  { index: 19, id: 'c20', name: '雾灰熊', base: 'bear' },
  { index: 20, id: 'c21', name: '皮卡丘', base: 'pikachu' },
];

/** 角色列表就绪 Promise：若配置了远程 JSON 则先拉取再 resolve，否则立即 resolve */
var CHARACTERS_READY = (function () {
  var config = typeof window !== 'undefined' && window.ThinkerClawConfig;
  var url = config && config.charactersJsonUrl;
  if (!url) return Promise.resolve(CHARACTERS);
  return fetch(url)
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (list) {
      if (Array.isArray(list) && list.length > 0) CHARACTERS = list;
      return CHARACTERS;
    })
    .catch(function () { return CHARACTERS; });
})();
if (typeof window !== 'undefined') window.CHARACTERS_READY = CHARACTERS_READY;

function getCharacterByIndex(index) {
  var i = Number(index);
  if (isNaN(i) || i < 0 || i > 20) return CHARACTERS[0];
  return CHARACTERS[i] || CHARACTERS[0];
}
