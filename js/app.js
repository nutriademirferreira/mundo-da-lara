/* =========================================================
   APP — navegação entre telas, modo Aprender e modo Explorar
   ========================================================= */
var App = (function () {
  function $(s, raiz) { return (raiz || document).querySelector(s); }
  function $$(s, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(s)); }

  var TELAS = {
    'start':            'screen-start',
    'home':             'screen-home',
    'corpo-menu':       'screen-corpo-menu',
    'corpo-aprender':   'screen-corpo-aprender',
    'espaco-menu':      'screen-espaco-menu',
    'espaco-explorar':  'screen-espaco-explorar',
    'quiz':             'screen-quiz',
    'result':           'screen-result'
  };
  var telaAtual = 'start';

  function ir(nome) {
    if (!TELAS[nome]) return;
    Som.calar();
    $$('.screen').forEach(function (s) { s.classList.remove('is-active'); });
    var el = document.getElementById(TELAS[nome]);
    if (el) { el.classList.add('is-active'); el.scrollTop = 0; }
    telaAtual = nome;
    Jogo.pintarEstrelas();
  }

  /* ---------- roteamento por data-go ---------- */
  function ligarNavegacao() {
    $$('[data-go]').forEach(function (b) {
      b.addEventListener('click', function () {
        var destino = b.dataset.go;
        Som.tocar('toque');
        if (destino === 'corpo-jogar')       { ir('quiz'); Jogo.iniciar('corpo'); return; }
        if (destino === 'espaco-jogar')      { ir('quiz'); Jogo.iniciar('espaco'); return; }
        if (destino === 'corpo-aprender')    { montarAprender(); ir('corpo-aprender'); return; }
        if (destino === 'espaco-explorar')   { montarExplorar(); ir('espaco-explorar'); return; }
        ir(destino);
      });
    });
  }

  /* =========================================================
     APRENDER — toca na Lara e ouve o nome da parte
     ========================================================= */
  function montarAprender() {
    var palco = $('#corpo-stage-learn');
    palco.innerHTML = '<div class="kid">' + Corpo.desenho('aprender') + '</div>';
    var svg = palco.querySelector('svg');
    var ficha = $('#corpo-label');
    ficha.innerHTML = '<span class="label-card__hint">Toque na Lara para descobrir 👆</span>';

    $$('.hit', svg).forEach(function (area) {
      area.addEventListener('click', function () {
        var parte = Corpo.porId(area.dataset.parte);
        if (!parte) return;

        $$('.hit', svg).forEach(function (o) { o.classList.remove('is-on'); });
        area.classList.add('is-on');

        ficha.innerHTML =
          '<div><div class="label-card__name">' + parte.artigo + ' ' + parte.nome + '</div>' +
          '<div class="label-card__tip">' + parte.dica + '</div></div>';

        Som.tocar('zap');
        Som.falar(parte.artigo + ' ' + parte.nome, { atraso: 120 });
        Som.falar(parte.dica, { enfileirar: true, atraso: 140 });
      });
    });
  }

  /* =========================================================
     EXPLORAR — viagem do Sol até Netuno (arrastando pro lado)
     ========================================================= */
  function montarExplorar() {
    var trilha = $('#orbit-scroll');
    trilha.innerHTML = '';
    Espaco.ASTROS.forEach(function (astro) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'planet-card';
      card.innerHTML =
        '<span class="planet-card__orb">' + Espaco.orbe(astro, astro.tam) + '</span>' +
        '<span class="planet-card__name">' + astro.nome + '</span>' +
        '<span class="planet-card__pos">' + astro.legenda + '</span>';
      card.addEventListener('click', function () { abrirFicha(astro); });
      trilha.appendChild(card);
    });
    trilha.scrollLeft = 0;
  }

  function abrirFicha(astro) {
    Som.tocar('zap');
    $('#sheet-art').innerHTML = Espaco.orbe(astro, 152);
    $('#sheet-name').textContent = astro.nome;
    $('#sheet-tag').textContent = astro.tag;
    var lista = $('#sheet-facts');
    lista.innerHTML = '';
    astro.fatos.forEach(function (f) {
      var li = document.createElement('li');
      var partes = f.split(' ');
      var emoji = partes.shift();
      li.innerHTML = '<b>' + emoji + '</b><span>' + partes.join(' ') + '</span>';
      lista.appendChild(li);
    });
    $('#planet-sheet').hidden = false;
    falarFicha(astro);
    fichaAberta = astro;
  }

  var fichaAberta = null;
  function falarFicha(astro) {
    var texto = astro.nome + '. ' + astro.tag + '. ' +
                astro.fatos.map(function (f) { return f.replace(/^\S+\s/, ''); }).join(' ');
    Som.falar(texto, { atraso: 260 });
  }
  function fecharFicha() {
    $('#planet-sheet').hidden = true;
    Som.calar();
    fichaAberta = null;
  }

  /* =========================================================
     Botões soltos
     ========================================================= */
  function ligarBotoes() {
    /* entrada — o primeiro toque é o que destrava o áudio no iPhone */
    $('#btn-start').addEventListener('click', function () {
      Som.destravar();
      Som.tocar('estrela');
      ir('home');
      Som.falar('Oi Lara! Vamos brincar?', { atraso: 500 });
    });

    /* liga/desliga som */
    var botaoSom = $('#btn-sound');
    function pintarSom() {
      var on = Som.estaLigado();
      $('#sound-icon').textContent = on ? '🔊' : '🔇';
      botaoSom.classList.toggle('is-muted', !on);
    }
    botaoSom.addEventListener('click', function () { Som.alternar(); pintarSom(); });
    pintarSom();

    /* quiz */
    $('#quiz-back').addEventListener('click', function () {
      Som.tocar('toque');
      ir(Jogo.tipoAtual() === 'corpo' ? 'corpo-menu' : 'espaco-menu');
    });
    $('#quiz-speak').addEventListener('click', function () { Jogo.repetirFala(); });

    /* resultado */
    $('#result-again').addEventListener('click', function () {
      Som.tocar('toque');
      var t = Jogo.tipoAtual();
      ir('quiz'); Jogo.iniciar(t);
    });
    $('#result-home').addEventListener('click', function () { Som.tocar('toque'); ir('home'); });

    /* ficha do planeta */
    $$('[data-close-sheet]').forEach(function (b) { b.addEventListener('click', fecharFicha); });
    $('#sheet-speak').addEventListener('click', function () { if (fichaAberta) falarFicha(fichaAberta); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#planet-sheet').hidden) fecharFicha();
    });

    /* nada de zoom por duplo toque durante a brincadeira */
    document.addEventListener('dblclick', function (e) { e.preventDefault(); }, { passive: false });
  }

  /* =========================================================
     Boot
     ========================================================= */
  function iniciar() {
    ligarNavegacao();
    ligarBotoes();
    Jogo.pintarEstrelas();
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { /* sem offline, tudo bem */ });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', iniciar);

  return { ir: ir };
})();
