/**
 * 与 Thinker-pet 通信：iframe postMessage 或同页 window.ThinkerPet
 * 角色模块从 Thinker-Claw 仓库加载：https://github.com/huanghdm88/Thinker-Claw
 */
(function (global) {
  const IFRAME_ID = 'thinker-pet-iframe';
  const THINKER_PET_BASE = (global.ThinkerClawConfig && global.ThinkerClawConfig.petBase) || '../Thinker-pet/index.html';

  const STATE_TO_ACTION = {
    idle: 'idle', listening: 'listen', thinking: 'process', searching: 'search',
    outputText: 'outputText', outputVisual: 'outputVisual', waiting: 'wait',
    error: 'error', success: 'success', dialogue: 'dialogue', walk: 'walk',
  };

  function getIframe() {
    return document.getElementById(IFRAME_ID);
  }

  function send(payload) {
    const iframe = getIframe();
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'thinker-pet', ...payload }, '*');
    }
  }

  function useAPI(method, ...args) {
    if (typeof global.ThinkerPet !== 'undefined' && global.ThinkerPet[method]) {
      global.ThinkerPet[method](...args);
      return true;
    }
    return false;
  }

  const bridge = {
    setCharacter(index) {
      if (useAPI('setCharacter', index)) return;
      send({ method: 'setCharacter', characterIndex: index });
    },
    setAction(actionIdOrState) {
      const actionId = STATE_TO_ACTION[actionIdOrState] || actionIdOrState;
      if (useAPI('setAction', actionId)) return;
      send({ method: 'setAction', action: actionId });
    },
    setEvolved(evolved) {
      if (useAPI('setEvolved', !!evolved)) return;
      send({ method: 'setEvolved', evolved: !!evolved });
    },
    setLanguage(lang) {
      if (useAPI('setLanguage', lang)) return;
      send({ method: 'setLanguage', language: lang });
    },
    applyState(characterIndex, action, evolved) {
      if (useAPI('applyState', characterIndex, action, evolved)) return;
      send({
        method: 'applyState',
        characterIndex: characterIndex != null ? characterIndex : undefined,
        action: action != null ? (STATE_TO_ACTION[action] || action) : undefined,
        evolved: evolved != null ? !!evolved : undefined,
      });
    },
    getIframeSrc(characterIndex, action, evolved, embed) {
      const params = new URLSearchParams();
      if (embed) params.set('embed', '1');
      if (characterIndex != null) params.set('character', String(characterIndex));
      if (action != null) params.set('action', STATE_TO_ACTION[action] || action);
      if (evolved != null) params.set('evolved', evolved ? '1' : '0');
      params.set('lang', 'zh');
      const q = params.toString();
      return THINKER_PET_BASE + (q ? '?' + q : '');
    },

    /** 向 iframe 请求角色头像图，收到后回调 dataUrl */
    requestAvatar(characterIndex, evolved, callback) {
      const iframe = document.getElementById(IFRAME_ID);
      if (!iframe || !iframe.contentWindow) {
        if (callback) callback(null);
        return;
      }
      const onMessage = function (e) {
        if (e.data && e.data.type === 'thinker-pet-avatar') {
          window.removeEventListener('message', onMessage);
          if (callback) callback(e.data.dataUrl);
        }
      };
      window.addEventListener('message', onMessage);
      iframe.contentWindow.postMessage({
        type: 'thinker-pet',
        method: 'getAvatar',
        characterIndex: characterIndex,
        evolved: evolved,
      }, '*');
    },
  };

  global.ThinkerPetBridge = bridge;
})(typeof window !== 'undefined' ? window : globalThis);
