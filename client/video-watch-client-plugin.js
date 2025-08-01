import {
  settings,
  loadContribAds,
  getRollsStatus,
  createVastSettings,
  buildVastPlayer
} from '../lib/shared.js';

function register ({ registerHook, peertubeHelpers }) {
  init(registerHook, peertubeHelpers)
    .catch(err => console.error('[VAST PLUGIN] Cannot initialize plugin', err))
}

async function init (registerHook, peertubeHelpers) {
  const s = await peertubeHelpers.getSettings();
  if (!s) {
    console.error('Could not find settings.')
    return
  }

  const pluginSettings = settings(s);
  const rollsStatus = getRollsStatus(pluginSettings);
  const getShouldShowAds = () => {
    const lastAd = parseInt(localStorage.getItem('vastLastAdTimestamp') || '0', 10);
    const coolOffMs = Number(pluginSettings.coolOffMinutes) * 60 * 1000;
    return rollsStatus.hasAtLeastOneRollEnabled && (!coolOffMs || Date.now() - lastAd >= coolOffMs);
  }

  registerHook({
    target: 'filter:internal.video-watch.player.load-options.result',
    handler: (result) => {
      if (getShouldShowAds()) {
        result.autoplay = false;
      }

      return result;
    }
  })

  registerHook({
    target: 'action:video-watch.player.loaded',
    handler: async ({ videojs, player, video }) => {
      if (!getShouldShowAds()) return;

      window.videojs = videojs;
      window.player = player;

      await loadContribAds(player);

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

export { register }
