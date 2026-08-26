/* =========================================================
   MOTOR DO QUIZ — serve pro corpo humano e pro sistema solar
   ========================================================= */
var Jogo = (function () {
  var estado = null;
  var proximaRodada = null;

  /* ---------- utilidades ---------- */
  function $(s, raiz) { return (raiz || document).querySelector(s); }
  function embaralhar(lista) {
    var a = lista.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- estrelinhas ---------- */
  function totalEstrelas() {
    var n = parseInt(localStorage.getItem('lara.estrelas'), 10);
    return (isNaN(n) || n < 0) ? 0 : n;      /* dado corrompido não vira "NaN" na tela */
  }
  function guardarEstrela() {
    var n = totalEstrelas() + 1;
    localStorage.setItem('lara.estrelas', String(n));
    pintarEstrelas();
    return n;
  }
  function pintarEstrelas() {
    var n = totalEstrelas();
    var alvo = $('#star-total'); if (alvo) alvo.textContent = n;
    var falaEstrela = $('#star-som');
    if (falaEstrela) {
      falaEstrela.dataset.falar = n === 0 ? 'Você ainda não tem estrelinhas. Vamos jogar?'
        : (n === 1 ? 'Você tem uma estrelinha!' : 'Você tem ' + n + ' estrelinhas!');
    }
    var espelhos = document.querySelectorAll('[data-star-mirror]');
    for (var i = 0; i < espelhos.length; i++) espelhos[i].textContent = n;
    var noQuiz = $('#quiz-stars'); if (noQuiz) noQuiz.textContent = n;
  }

  /* ---------- festinha ---------- */
  var EMOJIS = ['⭐', '🎉', '✨', '💛', '🌈', '💫', '🎈', '🩷'];
  function confete(qtd) {
    var caixa = $('#confetti'); if (!caixa) return;
    for (var i = 0; i < qtd; i++) {
      var p = document.createElement('b');
      p.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      p.style.left = (Math.random() * 96) + '%';
      p.style.fontSize = (18 + Math.random() * 20) + 'px';
      p.style.animationDuration = (1.5 + Math.random() * 1.2) + 's';
      p.style.animationDelay = (Math.random() * 0.35) + 's';
      caixa.appendChild(p);
      (function (el) { setTimeout(function () { el.remove(); }, 3200); })(p);
    }
  }

  /* ---------- montagem das rodadas ---------- */
  function rodadasCorpo(tipo) {
    var todos = Corpo.lista(tipo);
    var orgao = tipo === 'orgaos';
    return embaralhar(todos).map(function (alvo) {
      var outros = embaralhar(todos.filter(function (p) { return p.id !== alvo.id; })).slice(0, 2);
      return {
        alvo: alvo,
        opcoes: embaralhar([alvo].concat(outros)).map(function (p) { return { id: p.id, texto: p.nome }; }),
        pergunta: orgao ? 'Que órgão é esse?' : 'Que parte é essa?',
        fala: orgao ? 'Que órgão é esse?' : 'Que parte do corpo é essa?',
        acertou: 'Isso! É ' + alvo.artigo + ' ' + alvo.nome + '.'
      };
    });
  }

  function rodadasEspaco() {
    var astros = embaralhar(Espaco.ASTROS);
    return astros.map(function (alvo) {
      var outros = embaralhar(Espaco.ASTROS.filter(function (a) { return a.id !== alvo.id; })).slice(0, 2);
      return {
        alvo: alvo,
        opcoes: embaralhar([alvo].concat(outros)).map(function (a) { return { id: a.id, texto: a.nome }; }),
        pergunta: alvo.estrela ? 'Quem é esse?' : 'Que planeta é esse?',
        fala: alvo.estrela ? 'Quem é esse?' : 'Que planeta é esse?',
        acertou: 'Isso! É ' + Espaco.comArtigo(alvo) + '.'
      };
    });
  }

  var POR_SESSAO = 10;

  /* Baralho das 30 palavras: cada sessão tira 10 de cima e guarda o resto.
     Assim ela passa pelas 30 sem repetir antes de o baralho virar de novo. */
  function sortearFases() {
    var deck = [];
    try { deck = JSON.parse(localStorage.getItem('lara.palavras.baralho') || '[]'); } catch (e) { deck = []; }
    if (!Array.isArray(deck)) deck = [];
    deck = deck.filter(function (i) { return typeof i === 'number' && i >= 0 && i < Palavras.FASES.length; });

    if (deck.length < POR_SESSAO) {
      var novas = [];
      for (var i = 0; i < Palavras.FASES.length; i++) if (deck.indexOf(i) === -1) novas.push(i);
      deck = deck.concat(embaralhar(novas));   // resto do baralho velho vem primeiro
    }

    var escolhidas = deck.slice(0, POR_SESSAO);
    try { localStorage.setItem('lara.palavras.baralho', JSON.stringify(deck.slice(POR_SESSAO))); } catch (e) {}
    return escolhidas.map(function (i) { return Palavras.FASES[i]; });
  }

  function rodadasPalavras() {
    var sorteadas = sortearFases();
    var total = sorteadas.length;
    return sorteadas.map(function (fase, i) {
      var letra = fase.palavra.charAt(fase.falta);
      var dita = fase.palavra.charAt(0) + fase.palavra.slice(1).toLowerCase();
      var opcoes = embaralhar([letra].concat(fase.erradas)).map(function (l) {
        return { id: l, texto: l, fala: Palavras.falaDaLetra(l) };
      });

      var pecas = '';
      for (var k = 0; k < fase.palavra.length; k++) {
        pecas += (k === fase.falta)
          ? '<span class="letra letra--vazia">?</span>'
          : '<span class="letra">' + fase.palavra.charAt(k) + '</span>';
      }

      return {
        alvo: { id: letra },
        opcoes: opcoes,
        layout: 'letras',
        /* 'quarto' ainda não foi gerado: o quartinho rosa serve de casa por enquanto */
        cena: fase.cena === 'quarto' ? 'fundo-corpo' : 'cena-' + fase.cena,
        palco: '<div class="palco-palavra">' +
                 '<span class="fase-tag">Fase ' + (i + 1) + ' de ' + total + '</span>' +
                 Palavras.figura(fase) +
                 '<div class="palavra" style="--n:' + fase.palavra.length + '">' + pecas + '</div>' +
               '</div>',
        pergunta: 'Que letra está faltando?',
        fala: dita + '. Que letra está faltando?',
        acertou: 'Isso! ' + Palavras.falaDaLetra(letra) + ' de ' + dita + '!',
        aoAcertar: function () {
          var vazia = document.querySelector('#quiz-stage .letra--vazia');
          if (!vazia) return;
          vazia.textContent = letra;
          vazia.classList.remove('letra--vazia');
          vazia.classList.add('letra--acertou');
        }
      };
    });
  }

  /* ---------- ciclo do jogo ---------- */
  function iniciar(tipo) {
    estado = {
      tipo: tipo,
      rodadas: (tipo === 'corpo' || tipo === 'orgaos') ? rodadasCorpo(tipo)
             : tipo === 'palavras' ? rodadasPalavras()
             : rodadasEspaco(),
      indice: 0,
      acertos: 0,
      errouNaRodada: false,
      travado: false
    };
    var tela = $('#screen-quiz');
    tela.classList.toggle('is-space', tipo === 'espaco');
    if (tipo === 'espaco') App.pintarFundo(null, { foto:'fundo-espaco', veu:'espaco' });
    else if (tipo !== 'palavras') App.pintarFundo(null, { foto:'fundo-corpo', veu:'claro' });
    pintarEstrelas();
    desenharRodada();
  }

  function progresso() {
    var caixa = $('#quiz-progress');
    caixa.innerHTML = '';
    for (var i = 0; i < estado.rodadas.length; i++) {
      var d = document.createElement('i');
      if (i < estado.indice) d.className = 'is-done';
      else if (i === estado.indice) d.className = 'is-now';
      caixa.appendChild(d);
    }
  }

  function desenharRodada() {
    var r = estado.rodadas[estado.indice];
    estado.errouNaRodada = false;
    estado.travado = false;
    progresso();

    var palco = $('#quiz-stage');
    if (estado.tipo === 'corpo' || estado.tipo === 'orgaos') {
      palco.innerHTML = '<div class="kid">' + Corpo.arte(estado.tipo, 'quiz') + '</div>';
      apontarParte(palco, r.alvo);
    } else if (estado.tipo === 'palavras') {
      palco.innerHTML = r.palco;
      App.pintarFundo(null, { foto: r.cena, veu:'cena' });
    } else {
      palco.innerHTML = '<div class="planeta-quiz">' + Espaco.orbe(r.alvo, 220) + '</div>';
    }

    $('#quiz-question').textContent = r.pergunta;

    var letras = r.layout === 'letras';
    var caixa = $('#quiz-options');
    caixa.className = 'options' + (letras ? ' options--letras' : '');
    caixa.innerHTML = '';
    r.opcoes.forEach(function (o) {
      var linha = document.createElement('div');
      linha.className = letras ? 'opt-coluna' : 'opt-linha';

      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt' + (letras ? ' opt--letra' : '');
      b.textContent = o.texto;
      b.dataset.id = o.id;
      b.addEventListener('click', function () { responder(b, o.id); });

      /* ela ainda não lê: o alto-falante diz o que está escrito naquele botão */
      var som = document.createElement('button');
      som.type = 'button';
      som.className = 'som-btn';
      som.textContent = '🔊';
      som.className += letras ? ' som-btn--mini' : '';
      som.setAttribute('aria-label', 'Ouvir ' + (o.fala || o.texto));
      som.dataset.falar = o.fala || o.texto;

      linha.appendChild(b);
      linha.appendChild(som);
      caixa.appendChild(linha);
    });

    Som.falar(r.fala, { atraso: 260 });
  }

  /* holofote em cima da parte sorteada */
  function apontarParte(palco, parte) {
    var svg = palco.querySelector('svg');
    if (!svg) return;
    var boneca = palco.querySelector('.kid');
    var hits = svg.querySelector('.hits');
    if (hits) hits.style.pointerEvents = 'none';

    var alvo = svg.querySelector('.hit[data-parte="' + parte.id + '"]');
    if (alvo) alvo.classList.add('is-on');

    var a = parte.area;
    var recorte = svg.querySelector('.spot-hole');
    if (recorte) {
      recorte.setAttribute('cx', a.cx); recorte.setAttribute('cy', a.cy);
      /* folga proporcional: órgão pequeno e espremido não pode acender o vizinho */
      recorte.setAttribute('rx', a.rx + Math.min(16, a.rx * 0.4));
      recorte.setAttribute('ry', a.ry + Math.min(16, a.ry * 0.4));
      if (a.rot) recorte.setAttribute('transform', 'rotate(' + a.rot + ' ' + a.cx + ' ' + a.cy + ')');
    }
    if (boneca) boneca.classList.add('is-focando');

    /* interrogação sempre na lateral vazia, nunca por cima do rosto */
    var q = svg.querySelector('.qmark');
    if (q) {
      q.setAttribute('x', a.cx < 150 ? 32 : 264);
      q.setAttribute('y', a.cy + 14);
    }
  }

  function responder(botao, id) {
    if (estado.travado || botao.classList.contains('is-off')) return;
    var r = estado.rodadas[estado.indice];

    if (id === r.alvo.id) {
      estado.travado = true;
      botao.classList.add('is-right');
      var todos = document.querySelectorAll('#quiz-options .opt');
      for (var i = 0; i < todos.length; i++) if (todos[i] !== botao) todos[i].classList.add('is-off');

      if (r.aoAcertar) r.aoAcertar();
      Som.tocar('acerto');
      Som.falar(r.acertou, { atraso: 420 });
      confete(estado.errouNaRodada ? 10 : 20);
      if (!estado.errouNaRodada) { estado.acertos++; guardarEstrela(); }

      clearTimeout(proximaRodada);
      proximaRodada = setTimeout(function () {
        /* se ela saiu do quiz nesses 2 segundos, não arrasta ela pro resultado */
        if (!document.getElementById('screen-quiz').classList.contains('is-active')) return;
        estado.indice++;
        if (estado.indice >= estado.rodadas.length) terminar();
        else desenharRodada();
      }, 2100);
    } else {
      estado.errouNaRodada = true;
      botao.classList.add('is-wrong');
      Som.tocar('erro');
      Som.falar('Quase! Tenta de novo.', { atraso: 260 });
      setTimeout(function () {
        botao.classList.remove('is-wrong');
        botao.classList.add('is-off');
      }, 420);
    }
  }

  function terminar() {
    var total = estado.rodadas.length, acertos = estado.acertos;
    $('#result-hits').textContent = acertos;
    $('#result-total').textContent = total;

    var perfeito = acertos === total;
    var cartao = document.querySelector('.result-card');
    var lara = $('#result-lara');
    if (lara) lara.src = perfeito ? 'img/lara-unicornio.webp' : 'img/lara-festa.webp';
    if (cartao) cartao.classList.toggle('is-perfeito', perfeito);
    $('#result-emoji').textContent = perfeito ? '🏆' : (acertos >= total / 2 ? '🌟' : '💪');
    $('#result-title').textContent = perfeito ? 'Perfeito, Lara!' : (acertos >= total / 2 ? 'Muito bem, Lara!' : 'Boa, Lara!');

    var caixa = $('#result-stars');
    caixa.innerHTML = '';
    for (var i = 0; i < acertos; i++) {
      var s = document.createElement('span');
      s.textContent = '⭐';
      s.style.animationDelay = (i * 0.09) + 's';
      caixa.appendChild(s);
    }

    var fala = perfeito
      ? 'Parabéns Lara! Você acertou tudo!'
      : 'Muito bem Lara! Você acertou ' + acertos + ' de ' + total + '.';
    var botaoSom = $('#result-som');
    if (botaoSom) botaoSom.dataset.falar = fala;

    App.ir('result');
    Som.tocar('fanfarra');
    confete(46);
    Som.falar(fala, { atraso: 700 });
  }

  function tipoAtual() { return estado ? estado.tipo : 'corpo'; }
  function repetirFala() {
    if (!estado) return;
    Som.falar(estado.rodadas[estado.indice].fala);
  }

  return {
    iniciar: iniciar, tipoAtual: tipoAtual, repetirFala: repetirFala,
    pintarEstrelas: pintarEstrelas, confete: confete, embaralhar: embaralhar,
    cancelarRodada: function () { clearTimeout(proximaRodada); },
    ganharEstrela: guardarEstrela
  };
})();
