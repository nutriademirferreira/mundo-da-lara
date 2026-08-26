/* Service worker — o app abre offline e se atualiza sozinho.
   Estratégia: entrega o que está em cache na hora (rápido pra criança)
   e, em paralelo, baixa a versão nova pro próximo abrir. */
var CACHE = 'mundo-da-lara-v16';
var ARQUIVOS = [
  './',
  'index.html',
  'css/style.css',
  'js/audio.js',
  'js/data-corpo.js',
  'js/data-espaco.js',
  'js/data-palavras.js',
  'js/game.js',
  'js/velha.js',
  'js/app.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'img/cena-agua.webp',
  'img/cena-ceu.webp',
  'img/cena-cozinha.webp',
  'img/cena-fazenda.webp',
  'img/estrela.webp',
  'img/fundo-corpo.webp',
  'img/fundo-espaco.webp',
  'img/fundo-home.webp',
  'img/fundo-inicio.webp',
  'img/fundo-velha.webp',
  'img/icone-espaco.webp',
  'img/lara-astronauta.webp',
  'img/lara-cientista.webp',
  'img/lara-corpo.webp',
  'img/lara-espaco.webp',
  'img/lara-festa.webp',
  'img/lara-oi.webp',
  'img/lara-palavras.webp',
  'img/lara-princesa.webp',
  'img/lara-unicornio.webp',
  'img/lara-velha.webp',
  'img/planeta-jupiter-b.webp',
  'img/planeta-jupiter.webp',
  'img/planeta-marte-b.webp',
  'img/planeta-marte.webp',
  'img/planeta-mercurio-b.webp',
  'img/planeta-mercurio.webp',
  'img/planeta-netuno-b.webp',
  'img/planeta-netuno.webp',
  'img/planeta-saturno-b.webp',
  'img/planeta-saturno.webp',
  'img/planeta-sol-b.webp',
  'img/planeta-sol.webp',
  'img/planeta-terra-b.webp',
  'img/planeta-terra.webp',
  'img/planeta-urano-b.webp',
  'img/planeta-urano.webp',
  'img/planeta-venus-b.webp',
  'img/planeta-venus.webp'
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
