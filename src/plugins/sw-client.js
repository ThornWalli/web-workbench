const CACHE_VERSION = process.env.PWA_CACHE_VERSION;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(removeUnusedCaches).catch((err) => {
    throw err;
  });
}

async function removeUnusedCaches () {
  const names = await caches.keys();
  return Promise.all(
    names.filter(name => !name.endsWith(CACHE_VERSION)).map(name => caches.delete(name))
  );
}
