/* Service worker — o app abre offline e se atualiza sozinho.
   Estratégia: entrega o que está em cache na hora (rápido pra criança)
   e, em paralelo, baixa a versão nova pro próximo abrir. */
var CACHE = 'mundo-da-lara-v28';
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
  'img/corpo-dentro.webp',
  'img/corpo-fora.webp',
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
  'img/lara-corpo2.webp',
  'img/lara-espaco.webp',
  'img/lara-espaco2.webp',
  'img/lara-festa.webp',
  'img/lara-oi.webp',
  'img/lara-palavras.webp',
  'img/lara-princesa.webp',
  'img/lara-unicornio.webp',
  'img/lara-velha.webp',
  'img/lara-velha2.webp',
  'img/lara-viajante.webp',
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

/* As falas gravadas sao 228 arquivos — listar tudo aqui a mao ficaria
   desatualizado no primeiro acrescimo. O indice diz quais existem, e o
   proprio indice pode nao existir ainda: nesse caso o app fala pelo
   sintetizador do sistema e nada quebra. */
function arquivosDeVoz() {
  return fetch('audio/indice.json')
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (j) {
      return ['audio/indice.json'].concat(Object.keys(j).map(function (k) { return 'audio/' + j[k]; }));
    })
    .catch(function () { return []; });
}

/* A instalacao guarda so o essencial. As 252 falas somam ~3,7 MB e, quando
   elas faziam parte da instalacao, cada versao nova so entrava no ar depois
   de baixar tudo — no celular isso significava abrir o app e nao ver mudanca
   nenhuma. Agora a versao troca na hora e a voz vai chegando depois; frase
   que ainda nao chegou vem da rede, e sem rede cai no sintetizador. */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ARQUIVOS); })
      .then(function () { return self.skipWaiting(); })
  );
});

function guardarVozesEmSegundoPlano() {
  return caches.open(CACHE).then(function (c) {
    return arquivosDeVoz().then(function (vozes) {
      return vozes.reduce(function (fila, u) {
        return fila.then(function () {
          return c.match(u).then(function (tem) {
            return tem ? null : c.add(u).catch(function () {});
          });
        });
      }, Promise.resolve());
    });
  });
}

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (chaves) {
      return Promise.all(chaves.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
      .then(function () { guardarVozesEmSegundoPlano(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  /* animações vão direto pra rede: pesam demais pro cache offline e o
     player pede pedaço por pedaço (Range), que o Cache API não devolve */
  if (/\.(mp4|webm|mov)$/i.test(new URL(req.url).pathname)) return;

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
