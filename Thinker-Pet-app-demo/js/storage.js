/**
 * 本地存储：当前角色、是否已选、人设、长记忆、Cron、活跃时间（进化/退化）、默认宠物状态、对话历史
 */
const STORAGE_KEYS = {
  CHARACTER_INDEX: 'tp_character_index',
  HAS_CHOSEN: 'tp_has_chosen',
  SYSTEM_PROMPT: 'tp_system_prompt',
  LONG_MEMORY: 'tp_long_memory',
  CRON_TASKS: 'tp_cron_tasks',
  LAST_ACTIVE_AT: 'tp_last_active_at',
  SESSION_START_AT: 'tp_session_start_at',
  EVOLVED: 'tp_evolved',
  DEFAULT_PET_ACTION: 'tp_default_pet_action',
  CHAT_HISTORY: 'tp_chat_history',
};

const DEFAULT_SYSTEM_PROMPT = `你是 Thinker Pet 智能助手，友好、专业。
支持：商业分析、行业分析、知识架构图；定时任务（如「每天9点提醒我」）；长记忆（「请记住…」）。`;

function get(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return defaultValue;
    return JSON.parse(raw);
  } catch (_) {
    return defaultValue;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_) {
    return false;
  }
}

function getCharacterIndex() {
  const v = get(STORAGE_KEYS.CHARACTER_INDEX);
  return typeof v === 'number' && v >= 0 && v <= 20 ? v : 0;
}

function setCharacterIndex(index) {
  if (typeof index !== 'number' || index < 0 || index > 20) return;
  set(STORAGE_KEYS.CHARACTER_INDEX, index);
}

function hasChosenCharacter() {
  return get(STORAGE_KEYS.HAS_CHOSEN, false) === true;
}

function setChosenCharacter() {
  set(STORAGE_KEYS.HAS_CHOSEN, true);
}

function clearChosenCharacter() {
  set(STORAGE_KEYS.HAS_CHOSEN, false);
}

function getSystemPrompt() {
  return get(STORAGE_KEYS.SYSTEM_PROMPT, DEFAULT_SYSTEM_PROMPT);
}

function setSystemPrompt(text) {
  set(STORAGE_KEYS.SYSTEM_PROMPT, String(text));
}

function getLongMemory() {
  return get(STORAGE_KEYS.LONG_MEMORY, []);
}

function setLongMemory(list) {
  set(STORAGE_KEYS.LONG_MEMORY, Array.isArray(list) ? list : []);
}

function addLongMemoryItem(content) {
  const list = getLongMemory();
  const item = { id: 'mem_' + Date.now(), content: String(content).trim(), createdAt: new Date().toISOString() };
  if (!item.content) return list;
  list.unshift(item);
  setLongMemory(list);
  return list;
}

function removeLongMemoryItem(id) {
  setLongMemory(getLongMemory().filter((x) => x.id !== id));
}

function getCronTasks() {
  return get(STORAGE_KEYS.CRON_TASKS, []);
}

function setCronTasks(tasks) {
  set(STORAGE_KEYS.CRON_TASKS, Array.isArray(tasks) ? tasks : []);
}

function addCronTask(expr, description) {
  const list = getCronTasks();
  list.unshift({ id: 'cron_' + Date.now(), expr: String(expr).trim(), description: String(description).trim(), createdAt: new Date().toISOString() });
  setCronTasks(list);
  return list;
}

function removeCronTask(id) {
  setCronTasks(getCronTasks().filter((x) => x.id !== id));
}

function getLastActiveAt() {
  const v = get(STORAGE_KEYS.LAST_ACTIVE_AT);
  return v ? new Date(v) : null;
}

function setLastActiveAt(date) {
  set(STORAGE_KEYS.LAST_ACTIVE_AT, (date || new Date()).toISOString());
}

function getSessionStartAt() {
  const v = get(STORAGE_KEYS.SESSION_START_AT);
  return v ? new Date(v) : null;
}

function setSessionStartAt(date) {
  if (date == null) {
    try { localStorage.removeItem(STORAGE_KEYS.SESSION_START_AT); } catch (_) {}
    return;
  }
  set(STORAGE_KEYS.SESSION_START_AT, (date instanceof Date ? date : new Date(date)).toISOString());
}

function getEvolved() {
  return get(STORAGE_KEYS.EVOLVED, false) === true;
}

function setEvolved(evolved) {
  set(STORAGE_KEYS.EVOLVED, !!evolved);
}

/** 默认宠物状态：'walk' | 'idle' | 'dialogue' */
function getDefaultPetAction() {
  const v = get(STORAGE_KEYS.DEFAULT_PET_ACTION);
  return v === 'walk' || v === 'idle' || v === 'dialogue' ? v : 'walk';
}

function setDefaultPetAction(action) {
  if (action !== 'walk' && action !== 'idle' && action !== 'dialogue') return;
  set(STORAGE_KEYS.DEFAULT_PET_ACTION, action);
}

function getChatHistory() {
  return get(STORAGE_KEYS.CHAT_HISTORY, []);
}

function setChatHistory(history) {
  set(STORAGE_KEYS.CHAT_HISTORY, Array.isArray(history) ? history : []);
}

function appendChatMessage(role, content, meta) {
  const list = getChatHistory();
  list.push({ id: 'msg_' + Date.now(), role, content, ...meta, createdAt: new Date().toISOString() });
  setChatHistory(list);
  return list;
}
