const pluginSettings = require('./lib/pluginSettings');

async function register ({
  registerHook,
  registerSetting,
  settingsManager,
  storageManager,
  peertubeHelpers,
}) {
  pluginSettings.forEach((setting) => {
    registerSetting(setting);
  });
}

async function unregister () {
  return
}

module.exports = {
  register,
  unregister
}
