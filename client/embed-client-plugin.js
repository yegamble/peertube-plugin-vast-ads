import {
  settings,
  loadContribAds,
  getRollsStatus,
  createVastSettings,
  buildVastPlayer
} from '../lib/shared.js';

let pluginSettings = null;
let rollsStatus = null;
let initializationPromise = null;

function register ({ registerHook, peertubeHelpers }) {
  initializationPromise = init(peertubeHelpers);

  registerHook({
    target: "action:embed.player.loaded",
    handler: async ({ videojs, player, video }) => {
      window.videojs = videojs;
      window.player = player;

      loadContribAds(player);

      await initializationPromise;

      const lastAd = parseInt(localStorage.getItem('vastLastAdTimestamp') || '0', 10);
      const coolOffMs = Number(pluginSettings.coolOffMinutes) * 60 * 1000;
      const shouldShowAds = rollsStatus.hasAtLeastOneRollEnabled && (!coolOffMs || Date.now() - lastAd >= coolOffMs);

      if(!pluginSettings.embededEnabled || !shouldShowAds) {
        player.trigger('nopreroll');
        player.trigger('nopostroll');
        return;
      }

      try {
        const vastSettings = createVastSettings(pluginSettings);
        await buildVastPlayer(vastSettings, player);
        localStorage.setItem('vastLastAdTimestamp', Date.now().toString());
      } catch (error) {
        console.error('[VAST PLUGIN] Error:', error);
      }
    }
  });
}

async function init(peertubeHelpers) {
  if (pluginSettings && rollsStatus) return;

  try {
    const s = await peertubeHelpers.getSettings();

    if (!s) {
      console.error('Could not find settings.');
      return;
    }

    pluginSettings = settings(s);

    rollsStatus = getRollsStatus(pluginSettings);
  } catch (error) {
    console.error('[VAST PLUGIN] Error initializing settings:', error);
  }
}

export { register };
