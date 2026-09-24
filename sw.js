/* Surf & Climb Yoga — offline cache (subpath-safe relative URLs) */
const CACHE = 'yoga-v10';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './sw.js',
  './poses/down-dog.webp',
  './poses/thumbs/down-dog.webp',
  './poses/pigeon.webp',
  './poses/thumbs/pigeon.webp',
  './poses/cat-cow.webp',
  './poses/thumbs/cat-cow.webp',
  './poses/neck-rolls.webp',
  './poses/thumbs/neck-rolls.webp',
  './poses/shoulder-cars.webp',
  './poses/thumbs/shoulder-cars.webp',
  './poses/wrist-circles.webp',
  './poses/thumbs/wrist-circles.webp',
  './poses/chin-tucks.webp',
  './poses/thumbs/chin-tucks.webp',
  './poses/child-pose.webp',
  './poses/thumbs/child-pose.webp',
  './poses/child-pose-long.webp',
  './poses/thumbs/child-pose-long.webp',
  './poses/low-lunge.webp',
  './poses/thumbs/low-lunge.webp',
  './poses/hip-cars.webp',
  './poses/thumbs/hip-cars.webp',
  './poses/malasana.webp',
  './poses/thumbs/malasana.webp',
  './poses/figure-four.webp',
  './poses/thumbs/figure-four.webp',
  './poses/happy-baby.webp',
  './poses/thumbs/happy-baby.webp',
  './poses/lizard.webp',
  './poses/thumbs/lizard.webp',
  './poses/half-splits.webp',
  './poses/thumbs/half-splits.webp',
  './poses/forward-fold.webp',
  './poses/thumbs/forward-fold.webp',
  './poses/wide-fold.webp',
  './poses/thumbs/wide-fold.webp',
  './poses/seated-fold.webp',
  './poses/thumbs/seated-fold.webp',
  './poses/janu.webp',
  './poses/thumbs/janu.webp',
  './poses/thread-needle.webp',
  './poses/thumbs/thread-needle.webp',
  './poses/puppy.webp',
  './poses/thumbs/puppy.webp',
  './poses/frog.webp',
  './poses/thumbs/frog.webp',
  './poses/sphinx.webp',
  './poses/thumbs/sphinx.webp',
  './poses/cobra.webp',
  './poses/thumbs/cobra.webp',
  './poses/cow-face-arms.webp',
  './poses/thumbs/cow-face-arms.webp',
  './poses/chest-opener.webp',
  './poses/thumbs/chest-opener.webp',
  './poses/gate.webp',
  './poses/thumbs/gate.webp',
  './poses/wrist-flexor.webp',
  './poses/thumbs/wrist-flexor.webp',
  './poses/wrist-extensor.webp',
  './poses/thumbs/wrist-extensor.webp',
  './poses/prayer-stretch.webp',
  './poses/thumbs/prayer-stretch.webp',
  './poses/forearm-massage.webp',
  './poses/thumbs/forearm-massage.webp',
  './poses/neck-side.webp',
  './poses/thumbs/neck-side.webp',
  './poses/savasana.webp',
  './poses/thumbs/savasana.webp',
  './poses/eagle-arms.webp',
  './poses/thumbs/eagle-arms.webp',
  './poses/reverse-prayer.webp',
  './poses/thumbs/reverse-prayer.webp',
  './poses/supine-twist.webp',
  './poses/thumbs/supine-twist.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // only handle same-origin
  if (url.origin !== self.location.origin) return;
  // poses: cache-first (also precached)
  const isPose = url.pathname.includes('/poses/');
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (isPose && cached) return cached;
      const fetchPromise = fetch(e.request)
        .then((res) => {
          if (res && res.ok && (res.type === 'basic' || res.type === 'cors')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match('./index.html'));
      return cached || fetchPromise;
    })
  );
});
