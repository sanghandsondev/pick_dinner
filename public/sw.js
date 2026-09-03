const CACHE = "pick-dinner-v8";
const BASE = "/pick_dinner";

// Các URL cần cache khi cài app
const PRECACHE = [BASE + "/", BASE + "/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

// Network-first cho navigate, cache-first cho assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bỏ qua các request không phải GET hoặc không cùng origin
  if (
    request.method !== "GET" ||
    !url.origin.includes(self.location.origin.split("//")[1])
  ) {
    return;
  }

  if (request.mode === "navigate") {
    // Navigation: thử network trước, fallback cache
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(BASE + "/index.html")),
    );
    return;
  }

  // Assets (JS/CSS/images): cache-first, revalidate ngầm
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((res) => {
        caches.open(CACHE).then((c) => c.put(request, res.clone()));
        return res;
      });
      return cached || fetchPromise;
    }),
  );
});
