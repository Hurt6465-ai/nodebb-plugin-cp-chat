'use strict';

const controllers = require('./lib/controllers');
const settings = require('./lib/settings');

const plugin = {};

plugin.init = async function init(params) {
  const router = params.router;
  const middleware = params.middleware;

  router.get('/admin/plugins/cp-chat-harmony', middleware.admin.buildHeader, controllers.renderAdmin);
  router.get('/api/admin/plugins/cp-chat-harmony', controllers.renderAdmin);

  router.get('/api/plugins/cp-chat-harmony/config', controllers.getPublicConfig);
  router.get('/api/plugins/cp-chat-harmony/health', controllers.health);

  // Legacy bridge endpoints used by the imported chat engine. If a real Wukong bridge
  // exists elsewhere, configure `bridgeBaseUrl` in ACP and these endpoints will proxy it.
  router.get('/bridge/token', controllers.bridgeToken);
  router.get('/bridge/get-history', controllers.bridgeGetHistory);
  router.post('/bridge/revoke', controllers.bridgeRevoke);

  await settings.ensureDefaults();
};

plugin.addAdminNavigation = async function addAdminNavigation(header) {
  header.plugins = header.plugins || [];
  header.plugins.push({
    route: '/plugins/cp-chat-harmony',
    icon: 'fa-comments',
    name: 'CP Chat Harmony',
  });
  return header;
};

module.exports = plugin;
