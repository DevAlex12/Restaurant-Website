/* Papilz Foods — service worker
   Cache-first for the app shell (fast repeat visits, works offline once
   visited), network-first-ish for HTML so menu/price edits still show up.

   NOTE: bump CACHE_VERSION any time you deploy changes to CSS/JS/assets.
   That forces every visitor's old cache to be dropped immediately on
   next load instead of relying on the background revalidation below —
   the two together are what stop "I have to hard-refresh" complaints. */

const CACHE_VERSION = "papilz-v2";
const APP_SHELL = [
  "index.html",
  "menu.html",
  "cart.html",
  "shorts.html",
  "index.css",
  "menu.css",
  "cart.css",
  "shorts.css",
  "styles/tokens.css",
  "menu.js",
  "cart.js",
  "pwa.js",
  "engagement.js",
  "shorts.js",
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

  // Only handle real http(s) requests. Browser extensions (password
  // managers, PDF tools, etc.) inject their own chrome-extension://
  // subresources into the page, and caches.put() throws on anything
  // that isn't http/https — that's the "Failed to execute 'put' on
  // 'Cache'" error. Let the browser handle those directly.
  if (!request.url.startsWith("http")) return;

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

  // Stale-while-revalidate for static assets (images, css, js, fonts):
  // serve the cached copy instantly for speed, but always refetch in
  // the background and update the cache — so the *next* load already
  // has whatever changed, without anyone needing to hard-refresh.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type !== "opaque") {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
