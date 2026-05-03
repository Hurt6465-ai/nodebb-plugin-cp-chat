'use strict';

(function () {
  const PLUGIN_ID = 'nodebb-plugin-cp-chat-harmony';
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

  async function maybeLoadEngine() {
    const cfg = await loadConfig();
    if (!cfg.enabled || !isChatPage(cfg)) {
      return;
    }
    if (enginePromise) {
      return enginePromise;
    }
    const base = getAssetBase();
    enginePromise = loadScriptOnce(`${base}/src/i18n.js`, 'i18nScript')
      .then(function () {
        return loadScriptOnce(`${base}/src/engine.js`, 'engineScript');
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
