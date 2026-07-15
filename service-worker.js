/* ==========================================================================
   SERVICE WORKER — Calculadora do Lucro Real
   Faz cache dos arquivos essenciais para o app abrir mesmo sem internet
   (a única parte que depende de rede são os CDNs do Tailwind/Font Awesome/
   Google Fonts, usados só para estilo — a calculadora em si funciona offline).
   ========================================================================== */

const CACHE_NAME = "lucro-real-cache-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Instala o service worker e guarda os arquivos essenciais em cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Remove caches antigos quando uma nova versão do app é publicada
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Estratégia "cache primeiro, com atualização em segundo plano"
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && event.request.method === "GET") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
