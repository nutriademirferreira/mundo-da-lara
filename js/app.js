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
    'velha-menu':       'screen-velha-menu',
    'velha':            'screen-velha',
    'quiz':             'screen-quiz',
    'result':           'screen-result'
  };
  var telaAtual = 'start';

  /* =========================================================
     FUNDO DE CADA TELA
     imagem + véu. O véu é o que mantém texto e botão legíveis:
     tela clara ganha véu claro, tela escura ganha véu escuro.
     ========================================================= */
  var FUNDOS = {
    'start':            { foto:'fundo-inicio', veu:'escuro' },
    'home':             { foto:'fundo-home',   veu:'claro'  },
    'corpo-menu':       { foto:'fundo-corpo',  veu:'claro'  },
    'corpo-aprender':   { foto:'fundo-corpo',  veu:'claro'  },
    'espaco-menu':      { foto:'fundo-espaco', veu:'escuro' },
    'espaco-explorar':  { foto:'fundo-espaco', veu:'espaco' },
    'velha-menu':       { foto:'fundo-velha',  veu:'escuro' },
    'velha':            { foto:'fundo-velha',  veu:'meio'   },
    'result':           { foto:'fundo-home',   veu:'claro'  }
  };

  var VEUS = {
    claro:  'linear-gradient(180deg, rgba(255,246,251,.74) 0%, rgba(252,244,255,.52) 38%, rgba(244,236,255,.80) 100%)',
    escuro: 'linear-gradient(180deg, rgba(20,12,44,.55), rgba(12,8,30,.78))',
    espaco: 'linear-gradient(180deg, rgba(8,10,32,.62), rgba(5,6,22,.80))',
    meio:   'linear-gradient(180deg, rgba(255,246,240,.58) 0%, rgba(255,242,232,.44) 40%, rgba(255,238,225,.78) 100%)',
    quiz:   'linear-gradient(180deg, rgba(255,248,252,.90), rgba(245,238,255,.94))',
    /* cenário aparece em cima, onde está o desenho; some embaixo, onde ela lê e escolhe */
    cena:   'linear-gradient(180deg, rgba(255,250,253,.34) 0%, rgba(255,249,253,.52) 42%, rgba(250,244,255,.92) 72%)'
  };

  var fundoAtivo = 'a';
  function pintarFundo(nome, extra) {
    var cfg = extra || FUNDOS[nome];
    var veu = $('#fundo-veu');
    if (!cfg) { veu.style.background = ''; $('#fundo-a').classList.remove('is-on'); $('#fundo-b').classList.remove('is-on'); return; }

    var alvo = fundoAtivo === 'a' ? $('#fundo-b') : $('#fundo-a');
    var url = 'url("img/' + cfg.foto + '.webp")';
    if (alvo.style.backgroundImage !== url) {
      alvo.style.backgroundImage = url;
      alvo.classList.add('is-on');
      (fundoAtivo === 'a' ? $('#fundo-a') : $('#fundo-b')).classList.remove('is-on');
      fundoAtivo = fundoAtivo === 'a' ? 'b' : 'a';
    }
    veu.style.background = VEUS[cfg.veu] || VEUS.claro;
  }

  function ir(nome) {
    if (!TELAS[nome]) return;
    Som.calar();
    /* placar da velha só vale enquanto ela está na tela do tabuleiro */
    if (telaAtual === 'velha' && nome !== 'velha') Velha.zerarPlacar();
    $$('.screen').forEach(function (s) { s.classList.remove('is-active'); });
    var el = document.getElementById(TELAS[nome]);
    if (el) { el.classList.add('is-active'); el.scrollTop = 0; }
    telaAtual = nome;
    if (nome !== 'quiz') pintarFundo(nome);
    Jogo.pintarEstrelas();
  }

  /* =========================================================
     ALTO-FALANTE — vale pra qualquer botão com data-falar,
     inclusive os que nascem depois (opções do quiz, planetas)
     ========================================================= */
  function ligarAltoFalantes() {
    document.addEventListener('click', function (e) {
      var botao = e.target.closest && e.target.closest('[data-falar]');
      if (!botao) return;
      e.preventDefault();
      e.stopPropagation();
      falarBotao(botao);
    });
  }

  function falarBotao(botao) {
    var texto = botao.dataset.falar;
    if (!texto) return;
    $$('.som-btn.is-falando').forEach(function (b) { b.classList.remove('is-falando'); });
    Som.tocar('toque');
    Som.falar(texto);
    if (!Som.estaLigado()) return;
    botao.classList.add('is-falando');
    clearTimeout(botao._temporizador);
    botao._temporizador = setTimeout(function () {
      botao.classList.remove('is-falando');
    }, Math.min(700 + texto.length * 72, 6000));
  }

  /* ---------- roteamento por data-go ---------- */
  function ligarNavegacao() {
    $$('[data-go]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-falar]')) return;
        var destino = b.dataset.go;
        Som.tocar('toque');
        if (destino === 'corpo-jogar')       { ir('quiz'); Jogo.iniciar('corpo'); return; }
        if (destino === 'orgaos-jogar')      { ir('quiz'); Jogo.iniciar('orgaos'); return; }
        if (destino === 'orgaos-aprender')   { montarAprender('orgaos'); ir('corpo-aprender'); return; }
        if (destino === 'espaco-jogar')      { ir('quiz'); Jogo.iniciar('espaco'); return; }
        if (destino === 'palavras-jogar')    { ir('quiz'); Jogo.iniciar('palavras'); return; }
        if (destino === 'velha-app')         { ir('velha'); Velha.iniciar('app', true); return; }
        if (destino === 'velha-dois')        { ir('velha'); Velha.iniciar('dois', true); return; }
        if (destino === 'corpo-aprender')    { montarAprender('partes'); ir('corpo-aprender'); return; }
        if (destino === 'espaco-explorar')   { montarExplorar(); ir('espaco-explorar'); return; }
        ir(destino);
      });
    });
  }

  /* =========================================================
     APRENDER — toca na Lara e ouve o nome da parte
     ========================================================= */
  function montarAprender(tipo) {
    var orgao = tipo === 'orgaos';
    var palco = $('#corpo-stage-learn');
    palco.innerHTML = '<div class="kid">' + Corpo.arte(tipo, 'aprender') + '</div>';
    var svg = palco.querySelector('svg');
    var ficha = $('#corpo-label');
    $('#corpo-aprender-titulo').textContent = orgao ? 'Toque num órgão' : 'Toque numa parte';
    ficha.innerHTML = '<span class="label-card__hint">' +
      (orgao ? 'Toque no corpo pra ver o que tem dentro 👆' : 'Toque na Lara para descobrir 👆') + '</span>';

    $$('.hit', svg).forEach(function (area) {
      area.addEventListener('click', function () {
        var parte = Corpo.porId(area.dataset.parte, tipo);
        if (!parte) return;

        $$('.hit', svg).forEach(function (o) { o.classList.remove('is-on'); });
        area.classList.add('is-on');

        var falaCompleta = parte.artigo + ' ' + parte.nome + '. ' + parte.dica;
        ficha.innerHTML =
          '<div class="label-card__texto">' +
            '<div class="label-card__name">' + parte.artigo + ' ' + parte.nome + '</div>' +
            '<div class="label-card__tip">' + parte.dica + '</div>' +
          '</div>' +
          '<button class="som-btn" type="button" aria-label="Ouvir de novo" data-falar="' +
            falaCompleta.replace(/"/g, '') + '">🔊</button>';

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
      var card = document.createElement('div');
      card.className = 'planet-card';
      card.innerHTML =
        '<button class="planet-card__toque" type="button">' +
          '<span class="planet-card__orb">' + Espaco.orbe(astro, astro.tam) + '</span>' +
        '</button>' +
        '<span class="planet-card__linha">' +
          '<span class="planet-card__name">' + astro.nome + '</span>' +
          '<button class="som-btn som-btn--mini" type="button" aria-label="Ouvir ' + astro.nome + '"' +
            ' data-falar="' + astro.nome + '">🔊</button>' +
        '</span>' +
        '<span class="planet-card__pos">' + astro.legenda + '</span>';
      card.addEventListener('click', function (e) {
        if (e.target.closest('[data-falar]')) return;
        abrirFicha(astro);
      });
      trilha.appendChild(card);
    });
    trilha.scrollLeft = 0;
  }

  function abrirFicha(astro) {
    Som.tocar('zap');
    $('#sheet-art').innerHTML = Espaco.orbe(astro, 152);
    $('#sheet-name').textContent = astro.nome;
    $('#sheet-nome-som').dataset.falar = astro.nome;
    $('#sheet-tag').textContent = astro.tag;
    var lista = $('#sheet-facts');
    lista.innerHTML = '';
    astro.fatos.forEach(function (f) {
      var li = document.createElement('li');
      var partes = f.split(' ');
      var emoji = partes.shift();
      var frase = partes.join(' ');
      li.innerHTML = '<b>' + emoji + '</b><span>' + frase + '</span>' +
        '<button class="som-btn som-btn--mini" type="button" aria-label="Ouvir a curiosidade"' +
        ' data-falar="' + frase.replace(/"/g, '') + '">🔊</button>';
      lista.appendChild(li);
    });
    ladoDaFicha = 'a';
    $('#planet-sheet').hidden = false;
    falarFicha(astro);
    fichaAberta = astro;
  }

  var fichaAberta = null;
  var ladoDaFicha = 'a';

  /* Cada astro tem duas artes. Na Terra as duas são de verdade o outro
     lado do planeta; nos demais é outro ângulo e outra luz. */
  function girarFicha() {
    if (!fichaAberta) return;
    var caixa = $('#sheet-art');
    var img = caixa.querySelector('.orbe');
    if (!img) return;
    ladoDaFicha = ladoDaFicha === 'a' ? 'b' : 'a';
    var novo = 'img/planeta-' + fichaAberta.id + (ladoDaFicha === 'b' ? '-b' : '') + '.webp';
    Som.tocar('zap');
    caixa.classList.add('is-trocando');
    setTimeout(function () {
      img.onerror = function () { img.src = 'img/planeta-' + fichaAberta.id + '.webp'; ladoDaFicha = 'a'; };
      img.src = novo;
      caixa.classList.remove('is-trocando');
    }, 280);
  }

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
      $('#sound-icon').textContent = on ? '🎵' : '🔇';
      botaoSom.classList.toggle('is-muted', !on);
    }
    botaoSom.addEventListener('click', function () { Som.alternar(); pintarSom(); });
    pintarSom();

    /* quiz */
    $('#quiz-back').addEventListener('click', function () {
      Som.tocar('toque');
      var tipo = Jogo.tipoAtual();
      ir((tipo === 'corpo' || tipo === 'orgaos') ? 'corpo-menu'
         : tipo === 'espaco' ? 'espaco-menu' : 'home');
    });

    /* jogo da velha */
    $('#velha-denovo').addEventListener('click', function () {
      Som.tocar('toque');
      Velha.reiniciar();
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
    $('#sheet-girar').addEventListener('click', girarFicha);
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
    pintarFundo('start');           /* a tela de abertura já nasce ativa, sem passar por ir() */
    ligarAltoFalantes();
    ligarNavegacao();
    ligarBotoes();
    Jogo.pintarEstrelas();
    if ('serviceWorker' in navigator) {
      /* se já existia uma versão instalada no aparelho e chega uma nova,
         recarrega uma vez sozinho — ela não precisa fechar e abrir o app */
      var jaTinhaVersao = !!navigator.serviceWorker.controller;
      var jaRecarregou = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (!jaTinhaVersao || jaRecarregou) return;
        jaRecarregou = true;
        location.reload();
      });
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { /* sem offline, tudo bem */ });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', iniciar);

  return { ir: ir, pintarFundo: pintarFundo };
})();
