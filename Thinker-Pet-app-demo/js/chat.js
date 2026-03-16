/**
 * 对话页：与选中角色对话，下达任务/Cron，角色按执行状态实时切换动作
 */
(function () {
  const bridge = window.ThinkerPetBridge;
  const messagesEl = document.getElementById('chat-messages');
  const emptyEl = document.getElementById('empty-state');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('btn-send');
  const skillTags = document.getElementById('skill-tags');

  /** 默认状态：对话 / 等待 随机 */
  function getDefaultAction() {
    return Math.random() < 0.5 ? 'dialogue' : 'wait';
  }

  var agentAvatarUrl = '';

  function setAgentAvatarUrl(url) {
    agentAvatarUrl = url || '';
    if (!url) return;
    document.querySelectorAll('.message.agent .message-avatar').forEach(function (wrap) {
      var img = wrap.querySelector('.message-avatar-img');
      if (img) {
        img.src = url;
      } else {
        wrap.innerHTML = '';
        var im = document.createElement('img');
        im.className = 'message-avatar-img';
        im.src = url;
        im.alt = '';
        wrap.appendChild(im);
      }
    });
  }

  function initPet() {
    const characterIndex = getCharacterIndex();
    const evolved = getEvolved();
    const defaultAction = getDefaultAction();
    const src = bridge.getIframeSrc(characterIndex, defaultAction, evolved, true);
    const iframe = document.getElementById('thinker-pet-iframe');
    if (iframe) {
      iframe.src = src;
      iframe.addEventListener('load', function () {
        bridge.setCharacter(characterIndex);
        bridge.setAction(defaultAction);
        bridge.setEvolved(evolved);
        bridge.requestAvatar(characterIndex, evolved, function (dataUrl) {
          if (dataUrl) setAgentAvatarUrl(dataUrl);
        });
      });
    }
    const char = getCharacterByIndex(characterIndex);
    document.title = '与 ' + char.name + ' 对话 — Thinker Pet';
  }

  function setPetStatus(actionId) {
    if (bridge) bridge.setAction(actionId);
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function appendMessage(role, content, meta) {
    if (emptyEl) emptyEl.style.display = 'none';
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = 'message ' + role;

    var avatarWrap = document.createElement('div');
    avatarWrap.className = 'message-avatar';
    if (role === 'agent') {
      if (agentAvatarUrl) {
        var im = document.createElement('img');
        im.className = 'message-avatar-img';
        im.alt = '';
        im.src = agentAvatarUrl;
        avatarWrap.appendChild(im);
      } else {
        var ph = document.createElement('span');
        ph.className = 'message-avatar-placeholder';
        ph.textContent = '🐾';
        avatarWrap.appendChild(ph);
      }
    } else {
      avatarWrap.textContent = '👤';
    }

    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = escapeHtml(content).replace(/\n/g, '<br>') + '<div class="message-time">' + escapeHtml(time) + '</div>';

    div.appendChild(avatarWrap);
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    appendChatMessage(role, content, meta);
  }

  function sendMessage(content) {
    content = (content || '').trim();
    if (!content) return;

    appendMessage('user', content);
    inputEl.value = '';

    setPetStatus('listen');
    setTimeout(function () { setPetStatus('process'); }, 100);

    const systemPrompt = getSystemPrompt();
    const defaultAction = getDefaultAction();

    setTimeout(function () {
      let result;
      try {
        result = Agent.processUserInput(content, systemPrompt);
      } catch (e) {
        result = { reply: '处理出错：' + e.message, actionSuggest: 'error' };
      }

      setPetStatus(result.actionSuggest || 'outputText');
      appendMessage('agent', result.reply, {
        skillUsed: result.skillUsed,
        cron: result.cron,
        memory: result.memory,
      });
      Agent.updateEvolutionState();

      if (result.cron || result.memory) {
        setPetStatus('success');
        setTimeout(function () {
          setPetStatus('dialogue');
          setTimeout(function () { setPetStatus(defaultAction); }, 2000);
        }, 1200);
      } else {
        setPetStatus('dialogue');
        setTimeout(function () { setPetStatus(defaultAction); }, 2000);
      }
    }, 800 + Math.random() * 400);
  }

  sendBtn.addEventListener('click', function () { sendMessage(inputEl.value); });

  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputEl.value);
    }
  });

  if (skillTags) {
    skillTags.addEventListener('click', function (e) {
      const tag = e.target.closest('.skill-tag');
      if (!tag) return;
      const skill = tag.getAttribute('data-skill');
      const prompts = {
        commercial: '请对以下内容做商业分析：',
        industry: '请对以下内容做行业分析：',
        knowledge_graph: '请根据以下内容生成知识架构图：',
      };
      const prefix = prompts[skill] || '';
      if (inputEl.value.trim()) sendMessage(prefix + inputEl.value);
      else { inputEl.placeholder = prefix + '（在此输入）'; inputEl.focus(); }
    });
  }

  if (!hasChosenCharacter()) {
    window.location.href = 'index.html';
    return;
  }

  if (typeof Agent !== 'undefined' && Agent.checkDevolveOnLoad) Agent.checkDevolveOnLoad();
  initPet();

  const history = getChatHistory();
  if (history.length > 0) {
    if (emptyEl) emptyEl.style.display = 'none';
    history.forEach(function (msg) {
      const div = document.createElement('div');
      div.className = 'message ' + msg.role;

      var avatarWrap = document.createElement('div');
      avatarWrap.className = 'message-avatar';
      if (msg.role === 'agent') {
        if (agentAvatarUrl) {
          var im = document.createElement('img');
          im.className = 'message-avatar-img';
          im.alt = '';
          im.src = agentAvatarUrl;
          avatarWrap.appendChild(im);
        } else {
          var ph = document.createElement('span');
          ph.className = 'message-avatar-placeholder';
          ph.textContent = '🐾';
          avatarWrap.appendChild(ph);
        }
      } else {
        avatarWrap.textContent = '👤';
      }

      var bubble = document.createElement('div');
      bubble.className = 'message-bubble';
      var timeStr = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '';
      bubble.innerHTML = escapeHtml(msg.content).replace(/\n/g, '<br>') + '<div class="message-time">' + escapeHtml(timeStr) + '</div>';

      div.appendChild(avatarWrap);
      div.appendChild(bubble);
      messagesEl.appendChild(div);
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'thinker-pet-avatar' && e.data.dataUrl) {
      setAgentAvatarUrl(e.data.dataUrl);
    }
  });
})();
