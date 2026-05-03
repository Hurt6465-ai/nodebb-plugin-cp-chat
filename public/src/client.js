'use strict';

(function () {
  const PLUGIN_ID = 'nodebb-plugin-cp-chat-harmony';
  const CP_ENGINE_VERSION = '1.0.3-cache-peer-fastboot';
  const root = window.CPChatHarmony = window.CPChatHarmony || {};

  let configPromise = null;
  let enginePromise = null;

  function debug() {
    if (root.config && root.config.debug) {
      // eslint-disable-next-line no-console
      console.log.apply(console, ['[cp-chat-harmony]'].concat(Array.prototype.slice.call(arguments)));
    }
  }

  function relativePath() {
    return (window.config && window.config.relative_path) || '';
  }

  function getAssetBase() {
    const configured = root.config && root.config.assetBase;
    return relativePath() + (configured || `/plugins/${PLUGIN_ID}/public`);
  }

  function loadScriptOnce(url, key) {
    if (root[key]) {
      return root[key];
    }
    root[key] = new Promise(function (resolve, reject) {
      const found = document.querySelector(`script[data-cp-chat-harmony="${key}"]`);
      if (found) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.defer = true;
      script.dataset.cpChatHarmony = key;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error(`Failed to load ${url}`));
      };
      document.head.appendChild(script);
    });
    return root[key];
  }

  async function loadConfig() {
    if (configPromise) {
      return configPromise;
    }
    configPromise = fetch(`${relativePath()}/api/plugins/cp-chat-harmony/config`, {
      credentials: 'same-origin',
      headers: { accept: 'application/json' },
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error(`Config request failed: ${res.status}`);
        }
        return res.json();
      })
      .then(function (cfg) {
        root.config = cfg || {};
        return root.config;
      })
      .catch(function (err) {
        root.config = {
          enabled: true,
          chatPathPattern: '/chats',
          lazyLoadEngine: true,
          wkSdkUrl: 'https://cdn.jsdelivr.net/npm/wukongimjssdk@latest/lib/wukongimjssdk.umd.js',
          assetBase: `/plugins/${PLUGIN_ID}/public`,
        };
        debug(err);
        return root.config;
      });
    return configPromise;
  }

  function isChatPage(cfg) {
    const pattern = (cfg && cfg.chatPathPattern) || '/chats';
    const path = window.location.pathname || '';
    return path.indexOf(pattern) !== -1 || !!document.querySelector('[component="chat/messages"]');
  }

  function injectEarlyStyle() {
    if (document.getElementById('cp-chat-harmony-early-style')) {
      return;
    }
    const st = document.createElement('style');
    st.id = 'cp-chat-harmony-early-style';
    st.textContent = '.cp-chat-harmony-booting [component="chat/messages"], .cp-chat-harmony-booting [component="chat/input"], .cp-chat-harmony-booting [component="chat/send"], .cp-chat-harmony-booting .chat-composer, .cp-chat-harmony-booting .chats-full, .cp-chat-harmony-booting .chat-modal { opacity:0!important; pointer-events:none!important; }';
    document.head.appendChild(st);
  }

  function markBooting() {
    injectEarlyStyle();
    const target = document.body || document.documentElement;
    if (target) {
      target.classList.add('cp-chat-harmony-booting');
    }
    window.setTimeout(function () {
      const t = document.body || document.documentElement;
      if (t && !document.getElementById('cp-chat-root')) {
        t.classList.remove('cp-chat-harmony-booting');
      }
    }, 6000);
  }

  async function maybeLoadEngine() {
    const cfg = await loadConfig();
    if (!cfg.enabled || !isChatPage(cfg)) {
      return;
    }
    markBooting();
    root.expectedEngineVersion = CP_ENGINE_VERSION;
    if (enginePromise) {
      return enginePromise;
    }
    const base = getAssetBase();
    enginePromise = loadScriptOnce(`${base}/src/i18n.js?v=${encodeURIComponent(CP_ENGINE_VERSION)}`, 'i18nScript')
      .then(function () {
        return loadScriptOnce(`${base}/src/engine.js?v=${encodeURIComponent(CP_ENGINE_VERSION)}`, 'engineScript');
      })
      .then(function () {
        debug('engine loaded');
      })
      .catch(function (err) {
        // eslint-disable-next-line no-console
        console.warn('[cp-chat-harmony]', err);
      });
    return enginePromise;
  }

  if (window.jQuery) {
    $(maybeLoadEngine);
    $(window).on('action:ajaxify.end action:chat.loaded action:chat.switched', function () {
      setTimeout(maybeLoadEngine, 50);
      setTimeout(maybeLoadEngine, 250);
    });
  } else {
    document.addEventListener('DOMContentLoaded', maybeLoadEngine);
    window.addEventListener('load', maybeLoadEngine);
  }
}());
