/* ============================================================
   FRIEND POCKET — SERVICE WORKER (PREPARATION ONLY)
   Not registered by default. This is scaffolding for a future
   PWA pass and intentionally does no offline caching of
   financial data or forms.
   ============================================================ */

const CACHE_NAME = "friend-pocket-shell-v1";
const SHELL_ASSETS = ["index.html", "css/style.css", "js/config.js", "js/main.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

// Network-first for now — this is intentionally conservative so
// demo/application data is never served stale.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
