'use strict';

const settings = require('./settings');

function getUid(req) {
  return String((req.user && req.user.uid) || (req.uid) || 0);
}

function joinUrl(base, path) {
  const cleanBase = String(base || '').replace(/\/+$/, '');
  const cleanPath = String(path || '').replace(/^\/+/, '');
  return `${cleanBase}/${cleanPath}`;
}

async function readJsonSafe(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    return { raw: text };
  }
}

async function proxyBridge(req, res, path, opts = {}) {
  const cfg = await settings.get();
  if (!cfg.bridgeBaseUrl) {
    if (opts.emptyToken) {
      return res.json({ uid: getUid(req), token: '', bridge: false });
    }
    if (opts.emptyArray) {
      return res.json({ data: [], bridge: false });
    }
    return res.status(501).json({ ok: false, bridge: false, error: 'Bridge is not configured in ACP.' });
  }

  const query = req.originalUrl && req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
  const target = joinUrl(cfg.bridgeBaseUrl, path) + (opts.includeQuery === false ? '' : query);
  const headers = { accept: 'application/json' };
  if (cfg.bridgeApiKey) {
    headers.authorization = `Bearer ${cfg.bridgeApiKey}`;
  }

  const fetchOpts = {
    method: opts.method || req.method || 'GET',
    headers,
  };

  if (fetchOpts.method !== 'GET' && fetchOpts.method !== 'HEAD') {
    headers['content-type'] = 'application/json';
    fetchOpts.body = JSON.stringify(req.body || {});
  }

  try {
    const upstream = await fetch(target, fetchOpts);
    const json = await readJsonSafe(upstream);
    return res.status(upstream.status).json(json);
  } catch (err) {
    return res.status(502).json({ ok: false, error: err.message || 'Bridge proxy failed' });
  }
}

exports.renderAdmin = async function renderAdmin(req, res) {
  res.render('admin/plugins/cp-chat-harmony', {});
};

exports.getPublicConfig = async function getPublicConfig(req, res) {
  const cfg = await settings.get();
  res.json(settings.toPublicConfig(cfg));
};

exports.health = async function health(req, res) {
  const cfg = await settings.get();
  res.json({ ok: true, uid: getUid(req), bridgeConfigured: !!cfg.bridgeBaseUrl });
};

exports.bridgeToken = async function bridgeToken(req, res) {
  return proxyBridge(req, res, 'token', { emptyToken: true });
};

exports.bridgeGetHistory = async function bridgeGetHistory(req, res) {
  return proxyBridge(req, res, 'get-history', { emptyArray: true });
};

exports.bridgeRevoke = async function bridgeRevoke(req, res) {
  return proxyBridge(req, res, 'revoke', { method: 'POST', includeQuery: false });
};

