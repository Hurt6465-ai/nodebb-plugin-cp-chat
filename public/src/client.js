'use strict';

(function () {
  const PLUGIN_ID = 'nodebb-plugin-cp-chat-harmony';
  const CP_ENGINE_VERSION = '1.0.4-chat-list-safe';
  const root = window.CPChatHarmony = window.CPChatHarmony || {};

  let configPromise = null;
  let enginePromise = null;
  let bootingTimer = null;

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

  function normalizeRoute(value) {
    let route = value || '/';
    const base = relativePath();

    if (base && route.indexOf(base) === 0) {
      route = route.slice(base.length) || '/';
    }

    if (route.charAt(0) !== '/') {
      route = `/${route}`;
    }

    route = route.replace(/\/{2,}/g, '/');

    if (route.length > 1) {
      route = route.replace(/\/+$/, '');
    }

    return route || '/';
  }

  function currentRoute() {
    return normalizeRoute(window.location.pathname || '/');
  }

  function hasChatMessagesContainer() {
    return !!document.querySelector('[component="chat/messages"]');
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
    const pattern = normalizeRoute((cfg && cfg.chatPathPattern) || '/chats');
    const path = currentRoute();

    /*
     * Important:
     * /chats is the native NodeBB conversation list page.
     * Do NOT load the heavy chat window engine on this page.
     */
    if (path === pattern) {
      debug('skip conversation list page:', path);
      return false;
    }

    /*
     * Allow real chat room / chat detail pages.
     * Example:
     * /chats/123
     * /chats/some-room-id
     */
    if (path.indexOf(`${pattern}/`) === 0) {
      return true;
    }

    /*
     * Some NodeBB themes/routes open user chat at:
     * /user/:userslug/chats
     */
    if (/^\/user\/[^/]+\/chats(?:\/.*)?$/.test(path)) {
      return true;
    }

    /*
     * Fallback:
     * If the native chat messages container already exists, this is a chat window,
     * not only the conversation list.
     */
    return hasChatMessagesContainer();
  }

  function injectEarlyStyle() {
    if (document.getElementById('cp-chat-harmony-early-style')) {
      return;
    }

    const st = document.createElement('style');
    st.id = 'cp-chat-harmony-early-style';

    /*
     * Do NOT hide .chats-full here.
     * .chats-full is used by the native NodeBB conversation list.
     * Hiding it makes the conversation list look slow or blank.
     */
    st.textContent = [
      '.cp-chat-harmony-booting [component="chat/messages"],',
      '.cp-chat-harmony-booting [component="chat/input"],',
      '.cp-chat-harmony-booting [component="chat/send"],',
      '.cp-chat-harmony-booting .chat-composer,',
      '.cp-chat-harmony-booting .chat-modal {',
      'opacity:0!important;',
      'pointer-events:none!important;',
      '}',
    ].join(' ');

    document.head.appendChild(st);
  }

  function clearBooting() {
    if (bootingTimer) {
      window.clearTimeout(bootingTimer);
      bootingTimer = null;
    }

    const target = document.body || document.documentElement;
    if (target) {
      target.classList.remove('cp-chat-harmony-booting');
    }
  }

  function markBooting() {
    injectEarlyStyle();

    const target = document.body || document.documentElement;
    if (target) {
      target.classList.add('cp-chat-harmony-booting');
    }

    if (bootingTimer) {
      window.clearTimeout(bootingTimer);
    }

    /*
     * Always remove booting state as a safety fallback.
     * Do not depend on cp-chat-root existence.
     */
    bootingTimer = window.setTimeout(function () {
      clearBooting();
    }, 6000);
  }

  async function maybeLoadEngine() {
    const cfg = await loadConfig();

    if (!cfg.enabled || !isChatPage(cfg)) {
      clearBooting();
      return null;
    }

    root.expectedEngineVersion = CP_ENGINE_VERSION;

    /*
     * Engine already requested/loaded.
     * Do not mark booting again, otherwise ajaxify/chat events can repeatedly
     * hide the native chat UI.
     */
    if (enginePromise) {
      return enginePromise;
    }

    markBooting();

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
        clearBooting();
      });

    return enginePromise;
  }

  if (window.jQuery) {
    $(maybeLoadEngine);

    $(window).on('action:ajaxify.end action:chat.loaded action:chat.switched', function () {
      window.setTimeout(maybeLoadEngine, 50);
      window.setTimeout(maybeLoadEngine, 250);
    });
  } else {
    document.addEventListener('DOMContentLoaded', maybeLoadEngine);
    window.addEventListener('load', maybeLoadEngine);
  }
}());
