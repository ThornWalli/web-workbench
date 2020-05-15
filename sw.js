importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@4.3.1/workbox/workbox-sw.js')

// --------------------------------------------------
// Configure
// --------------------------------------------------

// Set workbox config
workbox.setConfig({
  "debug": false
})

// Set workbox cache names
workbox.core.setCacheNameDetails({
  "suffix": "105477480"
})

// Start controlling any existing clients as soon as it activates
workbox.core.clientsClaim()

// Skip over the SW waiting lifecycle stage
workbox.core.skipWaiting()

workbox.precaching.cleanupOutdatedCaches()

// --------------------------------------------------
// Precaches
// --------------------------------------------------

// Precache assets

// -- Start of cachingExtensions --
/* global workbox */
workbox.routing.registerRoute(
  /.*\.(mp4|webm)/,
  workbox.strategies.cacheFirst({
    plugins: [
      new workbox.rangeRequests.Plugin()
    ]
  }),
  'GET'
);
// -- End of cachingExtensions --

// --------------------------------------------------
// Runtime Caching
// --------------------------------------------------

// Register route handlers for runtimeCaching
workbox.routing.registerRoute(new RegExp('/\/.*/'), new workbox.strategies.NetworkFirst ({}), 'GET')
workbox.routing.registerRoute(new RegExp('/web-workbench/_nuxt/'), new workbox.strategies.CacheFirst ({}), 'GET')
workbox.routing.registerRoute(new RegExp('/web-workbench/'), new workbox.strategies.NetworkFirst ({}), 'GET')
