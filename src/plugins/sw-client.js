
import Vue from 'vue';

const isDev = process.env.NODE_ENV === 'development';
let hasUpdate = Promise.resolve(false);

if ('serviceWorker' in navigator) {
  hasUpdate = navigator.serviceWorker.getRegistrations().then(async (workers) => {
    if (workers.length < 1) {
      return false;
    }
    const hasUpdate = await Promise.race(workers.map(workerUpdate));
    if (hasUpdate) {
      await clearCaches();
      if (!isDev) {
        return global.location.reload();
      }
    }
    return hasUpdate;
  }).catch((err) => {
    throw err;
  });
}

function workerUpdate (worker) {
  return new Promise(resolve => (worker.onupdatefound = resolve)).then(() => true);
}

async function clearCaches () {
  const names = await caches.keys();
  return Promise.all(
    names.map(name => caches.delete(name))
  );
}

Vue.prototype.$hasPWAUpdate = () => {
  return hasUpdate;
};
