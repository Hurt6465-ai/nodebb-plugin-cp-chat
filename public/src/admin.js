'use strict';

define('admin/plugins/cp-chat-harmony', ['settings', 'alerts', 'translator'], function (Settings, alerts, translator) {
  const Admin = {};
  const settingsKey = 'cp-chat-harmony';

  Admin.init = function () {
    const form = $('.cp-chat-harmony-settings');
    Settings.load(settingsKey, form);

    $('#save').on('click', function (ev) {
      ev.preventDefault();
      Settings.save(settingsKey, form, function () {
        translator.translate('[[cp-chat-harmony:admin.saved]]', function (translated) {
          alerts.success(translated);
        });
      });
    });
  };

  return Admin;
});
