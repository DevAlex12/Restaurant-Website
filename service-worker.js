/* Papilz Foods — service worker
   Cache-first for the app shell (fast repeat visits, works offline once
   visited), network-first-ish for HTML so menu/price edits still show up. */

const CACHE_VERSION = "papilz-v1";
const APP_SHELL = [
  "index.html",
  "menu.html",
  "cart.html",
  "index.css",
  "menu.css",
  "cart.css",
  "styles/tokens.css",
  "menu.js",
  "cart.js",
  "pwa.js",
  "engagement.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "images/papilz-badge.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const isHTML = request.mode === "navigate" || request.headers.get("accept")?.includes("text/html");

  if (isHTML) {
    // Network-first for pages, fall back to cache when offline.
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((res) => res || caches.match("index.html")))
    );
    return;
  }

  // Cache-first for static assets (images, css, js, fonts).
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type !== "opaque") {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
