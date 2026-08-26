/* Service worker — o app abre offline e se atualiza sozinho.
   Estratégia: entrega o que está em cache na hora (rápido pra criança)
   e, em paralelo, baixa a versão nova pro próximo abrir. */
var CACHE = 'mundo-da-lara-v1';
var ARQUIVOS = [
  './',
  'index.html',
  'css/style.css',
  'js/audio.js',
  'js/data-corpo.js',
  'js/data-espaco.js',
  'js/game.js',
  'js/app.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ARQUIVOS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (chaves) {
      return Promise.all(chaves.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req).then(function (guardado) {
        var rede = fetch(req).then(function (resp) {
          if (resp && resp.status === 200) cache.put(req, resp.clone());
          return resp;
        }).catch(function () { return guardado || cache.match('index.html'); });
        return guardado || rede;   // cache na hora, rede atualiza pro próximo abrir
      });
    })
  );
});
