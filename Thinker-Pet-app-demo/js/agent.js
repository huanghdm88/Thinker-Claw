/**
 * 解析用户输入：Cron、长记忆、技能；进化/退化规则
 */
(function (global) {
  const EVOLVE_MINUTES = 15;
  const DEVOLVE_HOURS = 24;

  function detectCronIntent(text) {
    const t = (text || '').toLowerCase();
    const patterns = [
      { regex: /每天\s*(\d{1,2})\s*[点时:]/, expr: '0 * * * *', desc: '每天' },
      { regex: /每周[一二三四五六日天]/, expr: '0 9 * * 1', desc: '每周' },
      { regex: /每[周天]/, expr: '0 9 * * 1', desc: '每周提醒' },
      { regex: /每小时/, expr: '0 * * * *', desc: '每小时' },
      { regex: /提醒我\s*(.+)/, expr: '0 9 * * *', desc: '每日提醒' },
      { regex: /(定时|定期|周期).*?(执行|做|检查)/, expr: '0 9 * * *', desc: '周期任务' },
    ];
    for (const { regex, expr, desc } of patterns) {
      if (regex.test(t)) {
        const m = t.match(/提醒我\s*(.+)/);
        const description = m ? m[1].slice(0, 50) : desc + '：' + text.slice(0, 30);
        return { expr, description };
      }
    }
    return null;
  }

  function extractMemoryIntent(text) {
    const t = (text || '').trim();
    if (t.length < 5) return null;
    if (/请?记住|记一下|帮我记|存到?记忆|写入?记忆|long\s*memory/i.test(t)) {
      const content = t.replace(/请?记住|记一下|帮我记|存到?记忆|写入?记忆|long\s*memory/gi, '').trim();
      return content.length >= 2 ? content : null;
    }
    if (t.length >= 40 && /是|叫|喜欢|偏好|习惯|目标|计划/i.test(t)) return t.slice(0, 200);
    return null;
  }

  const SKILL_COMMERCIAL = 'commercial';
  const SKILL_INDUSTRY = 'industry';
  const SKILL_KNOWLEDGE_GRAPH = 'knowledge_graph';

  function detectSkill(text) {
    const t = (text || '').toLowerCase();
    if (/商业|市场|盈利|商业模式|竞品|b2b|b2c|商业化/i.test(t)) return SKILL_COMMERCIAL;
    if (/行业|赛道|趋势|产业链|竞争格局|行业分析/i.test(t)) return SKILL_INDUSTRY;
    if (/知识架构|知识图谱|结构图|思维导图|mind\s*map|架构图/i.test(t)) return SKILL_KNOWLEDGE_GRAPH;
    return null;
  }

  function runSkill(skillId, userText, systemPrompt) {
    const memory = typeof getLongMemory === 'function' ? getLongMemory() : [];
    const ctx = memory.slice(0, 5).map((m) => m.content).join('\n');
    const base = (systemPrompt || '') + (ctx ? '\n\n【长记忆】\n' + ctx : '');

    switch (skillId) {
      case SKILL_COMMERCIAL:
        return `【商业分析】\n基于「${userText.slice(0, 80)}」：\n\n• 目标与价值主张\n• 商业模式（订阅/抽成/混合）\n• 竞争与护城河\n• 关键指标 LTV/CAC、留存、NPS\n\n（模拟分析，可接入真实模型。）`;
      case SKILL_INDUSTRY:
        return `【行业分析】\n针对「${userText.slice(0, 80)}」：\n\n• 行业规模与增速 TAM/SAM/SOM\n• 产业链与关键环节\n• 竞争格局与趋势\n\n（模拟分析。）`;
      case SKILL_KNOWLEDGE_GRAPH:
        return `【知识架构图】\n「${userText.slice(0, 80)}」\n\n主题\n├── 子维度 A\n│   ├── 要点 1\n│   └── 要点 2\n├── 子维度 B\n└── 子维度 C\n\n（文本示意，可渲染为图谱。）`;
      default:
        return `已收到。可试「商业分析」「行业分析」「知识架构图」，或「每天9点提醒我…」「请记住…」。`;
    }
  }

  function processUserInput(userText, systemPrompt) {
    const cron = detectCronIntent(userText);
    const memoryContent = extractMemoryIntent(userText);
    const skill = detectSkill(userText);

    let reply = '';
    let actionSuggest = 'outputText';

    if (cron) {
      if (typeof addCronTask === 'function') addCronTask(cron.expr, cron.description);
      reply += `已创建定时任务：${cron.description}（${cron.expr}）。\n\n`;
    }
    if (memoryContent) {
      if (typeof addLongMemoryItem === 'function') addLongMemoryItem(memoryContent);
      reply += `已写入长记忆：${memoryContent.slice(0, 50)}…\n\n`;
    }
    if (skill) {
      reply += runSkill(skill, userText, systemPrompt);
      actionSuggest = skill === SKILL_KNOWLEDGE_GRAPH ? 'outputVisual' : 'outputText';
    }
    if (!reply) {
      reply = '收到。可说「商业分析」「行业分析」「知识架构图」使用技能；或「每天9点提醒我…」「请记住…」创建任务或长记忆。';
    }

    return {
      reply: reply.trim(),
      cron: cron || undefined,
      memory: memoryContent || undefined,
      skillUsed: skill || undefined,
      actionSuggest,
    };
  }

  function updateEvolutionState() {
    if (typeof getLastActiveAt !== 'function' || typeof setLastActiveAt !== 'function') return;
    if (typeof getSessionStartAt !== 'function' || typeof setSessionStartAt !== 'function') return;
    if (typeof getEvolved !== 'function' || typeof setEvolved !== 'function') return;

    const now = new Date();
    const lastActive = getLastActiveAt();
    let sessionStart = getSessionStartAt();
    const evolved = getEvolved();

    if (!sessionStart) sessionStart = now;
    setSessionStartAt(sessionStart);
    setLastActiveAt(now);

    const minutes = (now - new Date(sessionStart)) / (60 * 1000);
    if (minutes >= EVOLVE_MINUTES && !evolved) {
      setEvolved(true);
      if (global.ThinkerPetBridge) global.ThinkerPetBridge.setEvolved(true);
    }
  }

  function checkDevolveOnLoad() {
    if (typeof getLastActiveAt !== 'function' || typeof setEvolved !== 'function') return;
    const lastActive = getLastActiveAt();
    const evolved = getEvolved();
    if (!evolved || !lastActive) return;
    const hours = (new Date() - new Date(lastActive)) / (60 * 60 * 1000);
    if (hours > DEVOLVE_HOURS) {
      setEvolved(false);
      if (typeof setSessionStartAt === 'function') setSessionStartAt(null);
      if (global.ThinkerPetBridge) global.ThinkerPetBridge.setEvolved(false);
    }
  }

  global.Agent = {
    processUserInput,
    updateEvolutionState,
    checkDevolveOnLoad,
    SKILL_COMMERCIAL,
    SKILL_INDUSTRY,
    SKILL_KNOWLEDGE_GRAPH,
  };
})(typeof window !== 'undefined' ? window : globalThis);
