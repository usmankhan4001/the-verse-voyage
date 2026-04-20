import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { RangeRequestsPlugin } from 'workbox-range-requests';

declare const self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

// ── Pre-cache UI Shell ──
precacheAndRoute(self.__WB_MANIFEST);

// ── Cache Audio Files (Husary Recitation) ──
// Matches .mp3 files from everyayah.com or local
registerRoute(
  ({ request, url }) => request.destination === 'audio' || url.pathname.endsWith('.mp3'),
  new CacheFirst({
    cacheName: 'vv-audio-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new RangeRequestsPlugin(), // CRITICAL for seeking in offline audio
    ],
  })
);

// ── Cache Images & Icons ──
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'vv-image-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// ── Offline Fallback ──
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
