/* =========================================================
   MOTOR DO QUIZ — serve pro corpo humano e pro sistema solar
   ========================================================= */
var Jogo = (function () {
  var estado = null;

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
  function totalEstrelas() { return parseInt(localStorage.getItem('lara.estrelas') || '0', 10); }
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
  function rodadasCorpo() {
    var partes = embaralhar(Corpo.PARTES);
    return partes.map(function (alvo) {
      var outros = embaralhar(Corpo.PARTES.filter(function (p) { return p.id !== alvo.id; })).slice(0, 2);
      return {
        alvo: alvo,
        opcoes: embaralhar([alvo].concat(outros)).map(function (p) { return { id: p.id, texto: p.nome }; }),
        pergunta: 'Que parte é essa?',
        fala: 'Que parte do corpo é essa?',
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

  /* ---------- ciclo do jogo ---------- */
  function iniciar(tipo) {
    estado = {
      tipo: tipo,
      rodadas: tipo === 'corpo' ? rodadasCorpo() : rodadasEspaco(),
      indice: 0,
      acertos: 0,
      errouNaRodada: false,
      travado: false
    };
    var tela = $('#screen-quiz');
    tela.classList.toggle('is-space', tipo === 'espaco');
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
    if (estado.tipo === 'corpo') {
      palco.innerHTML = '<div class="kid">' + Corpo.desenho('quiz') + '</div>';
      apontarParte(palco, r.alvo);
    } else {
      palco.innerHTML = '<div class="planeta-quiz">' + Espaco.orbe(r.alvo, 220) + '</div>';
    }

    $('#quiz-question').textContent = r.pergunta;

    var caixa = $('#quiz-options');
    caixa.innerHTML = '';
    r.opcoes.forEach(function (o) {
      var linha = document.createElement('div');
      linha.className = 'opt-linha';

      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.textContent = o.texto;
      b.dataset.id = o.id;
      b.addEventListener('click', function () { responder(b, o.id); });

      /* ela ainda não lê: o alto-falante diz o que está escrito naquele botão */
      var som = document.createElement('button');
      som.type = 'button';
      som.className = 'som-btn';
      som.textContent = '🔊';
      som.setAttribute('aria-label', 'Ouvir ' + o.texto);
      som.dataset.falar = o.texto;

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
      recorte.setAttribute('rx', a.rx + 16); recorte.setAttribute('ry', a.ry + 16);
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

      Som.tocar('acerto');
      Som.falar(r.acertou, { atraso: 420 });
      confete(estado.errouNaRodada ? 10 : 20);
      if (!estado.errouNaRodada) { estado.acertos++; guardarEstrela(); }

      setTimeout(function () {
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
    pintarEstrelas: pintarEstrelas, confete: confete, embaralhar: embaralhar
  };
})();
