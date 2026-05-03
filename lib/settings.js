'use strict';

const meta = require.main.require('./src/meta');

const SETTINGS_KEY = 'cp-chat-harmony';

const DEFAULTS = Object.freeze({
  enabled: 'on',
  chatPathPattern: '/chats',
  bridgeBaseUrl: '',
  bridgeApiKey: '',
  wkSdkUrl: 'https://cdn.jsdelivr.net/npm/wukongimjssdk@latest/lib/wukongimjssdk.umd.js',
  wkWsUrl: '',
  lazyLoadEngine: 'on',
  debug: 'off',
  defaultSourceLang: '中文',
  defaultTargetLang: 'မြန်မာစာ',
  enableSmartReply: 'off',
  autoTranslateLastMsg: 'off',
  maxPersistMessages: '220',
  maxTotalMessagesInMemory: '800',
});

function normalize(raw) {
  const out = Object.assign({}, DEFAULTS, raw || {});
  out.enabled = out.enabled === true || out.enabled === 'on' || out.enabled === 'true' ? 'on' : 'off';
  out.lazyLoadEngine = out.lazyLoadEngine === false || out.lazyLoadEngine === 'off' || out.lazyLoadEngine === 'false' ? 'off' : 'on';
  out.debug = out.debug === true || out.debug === 'on' || out.debug === 'true' ? 'on' : 'off';
  out.enableSmartReply = out.enableSmartReply === true || out.enableSmartReply === 'on' || out.enableSmartReply === 'true' ? 'on' : 'off';
  out.autoTranslateLastMsg = out.autoTranslateLastMsg === true || out.autoTranslateLastMsg === 'on' || out.autoTranslateLastMsg === 'true' ? 'on' : 'off';

  out.maxPersistMessages = String(Math.min(1000, Math.max(50, parseInt(out.maxPersistMessages, 10) || 220)));
  out.maxTotalMessagesInMemory = String(Math.min(2000, Math.max(300, parseInt(out.maxTotalMessagesInMemory, 10) || 800)));

  return out;
}

async function get() {
  const raw = await meta.settings.get(SETTINGS_KEY);
  return normalize(raw);
}

async function ensureDefaults() {
  const current = await get();
  await meta.settings.set(SETTINGS_KEY, current);
  return current;
}

function toPublicConfig(cfg) {
  return {
    enabled: cfg.enabled === 'on',
    chatPathPattern: cfg.chatPathPattern || '/chats',
    bridgeEnabled: !!cfg.bridgeBaseUrl,
    wkSdkUrl: cfg.wkSdkUrl || DEFAULTS.wkSdkUrl,
    wkWsUrl: cfg.wkWsUrl || '',
    lazyLoadEngine: cfg.lazyLoadEngine === 'on',
    debug: cfg.debug === 'on',
    defaultSourceLang: cfg.defaultSourceLang || DEFAULTS.defaultSourceLang,
    defaultTargetLang: cfg.defaultTargetLang || DEFAULTS.defaultTargetLang,
    enableSmartReply: cfg.enableSmartReply === 'on',
    autoTranslateLastMsg: cfg.autoTranslateLastMsg === 'on',
    maxPersistMessages: parseInt(cfg.maxPersistMessages, 10) || 220,
    maxTotalMessagesInMemory: parseInt(cfg.maxTotalMessagesInMemory, 10) || 800,
    assetBase: '/plugins/nodebb-plugin-cp-chat-harmony/public',
    pluginId: 'nodebb-plugin-cp-chat-harmony',
  };
}

module.exports = {
  SETTINGS_KEY,
  DEFAULTS,
  get,
  normalize,
  ensureDefaults,
  toPublicConfig,
};
