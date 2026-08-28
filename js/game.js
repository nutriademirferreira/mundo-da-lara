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

  /* =========================================================
     AS FRASES FALADAS
     Ficam aqui, em funcoes proprias, porque o gerador de voz precisa
     produzir exatamente as mesmas strings. Enquanto ele refazia a conta
     por conta propria as duas versoes divergiam em silencio — foi assim
     que as 30 confirmacoes das palavras passaram meses sem gravacao,
     com o verificador jurando que estava tudo certo.
     Regra: nenhuma fala do quiz nasce fora daqui.
     ========================================================= */
  function ditaPalavra(fase) {
    return fase.palavra.charAt(0) + fase.palavra.slice(1).toLowerCase();
  }
  function falaPerguntaCorpo(orgao) { return orgao ? 'Que órgão é esse?' : 'Que parte do corpo é essa?'; }
  function falaAcertoCorpo(p)       { return 'Isso, Lara! É ' + p.artigo + ' ' + p.nome + '.'; }
  function falaPerguntaAstro(a)     { return a.estrela ? 'Quem é esse?' : 'Que planeta é esse?'; }
  function falaAcertoAstro(a)       { return 'Isso, Lara! É ' + Espaco.comArtigo(a) + '.'; }
  function falaPerguntaLetra(fase)  { return ditaPalavra(fase) + '. Que letra está faltando?'; }
  /* "u de Lua" ensinava mentira: em 12 das 30 palavras a letra que falta nao
     e a primeira, e "X de Y" e a formula da inicial — a Lara aprenderia que
     xis comeca peixe. "Com o u fica Lua" e verdade em qualquer posicao, e a
     letra continua no meio da palavra, que e o que da trabalho pra ela. */
  function falaAcertoLetra(fase) {
    var letra = fase.palavra.charAt(fase.falta);
    return 'Isso, Lara! Com o ' + Palavras.falaDaLetra(letra) + ' fica ' + ditaPalavra(fase) + '!';
  }

  /* tudo que o quiz pode dizer, pro gerador de voz nao ter que adivinhar */
  function todasAsFalas() {
    var f = [];
    ['partes', 'orgaos'].forEach(function (t) {
      f.push(falaPerguntaCorpo(t === 'orgaos'));
      Corpo.lista(t).forEach(function (p) { f.push(falaAcertoCorpo(p), p.nome, p.artigo + ' ' + p.nome, p.dica); });
    });
    Espaco.ASTROS.forEach(function (a) {
      f.push(falaPerguntaAstro(a), falaAcertoAstro(a), a.nome, Espaco.comArtigo(a));
      (a.fatos || []).forEach(function (x) { f.push(String(x).replace(/^\S+\s/, '')); });
    });
    Palavras.FASES.forEach(function (fase) {
      f.push(falaPerguntaLetra(fase), falaAcertoLetra(fase), fase.palavra);
      (fase.erradas || []).forEach(function (l) { f.push(Palavras.falaDaLetra(l)); });
      f.push(Palavras.falaDaLetra(fase.palavra.charAt(fase.falta)));
    });
    return f.filter(Boolean);
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
      /* sem o número na frase de propósito: o número muda toda hora e não
         dá pra gravar um arquivo pra cada, então sairia na voz do sistema.
         Ela vê a quantidade escrita e desenhada em estrelinhas do lado. */
      falaEstrela.dataset.falar = n === 0 ? 'Você ainda não tem estrelinhas. Vamos jogar?'
        : (n === 1 ? 'Você tem uma estrelinha!' : 'Olha quantas estrelinhas você já tem!');
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
        fala: falaPerguntaCorpo(orgao),
        acertou: falaAcertoCorpo(alvo)
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
        fala: falaPerguntaAstro(alvo),
        acertou: falaAcertoAstro(alvo)
      };
    });
  }

  var POR_SESSAO = 10;

  /* coleção: quais palavras ela já viu alguma vez (não zera entre sessões) */
  function palavrasVistas() {
    try {
      var v = JSON.parse(localStorage.getItem('lara.palavras.vistas') || '[]');
      return Array.isArray(v) ? v.filter(function (i) { return typeof i === 'number'; }) : [];
    } catch (e) { return []; }
  }
  function marcarVista(indice) {
    var v = palavrasVistas();
    if (v.indexOf(indice) === -1) {
      v.push(indice);
      try { localStorage.setItem('lara.palavras.vistas', JSON.stringify(v)); } catch (e) {}
    }
  }

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
    escolhidas.forEach(marcarVista);
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
        fala: falaPerguntaLetra(fase),
        acertou: falaAcertoLetra(fase),
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
      som.textContent = '';
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

  /* No fim do quiz do espaço a astronauta aparece falando, no lugar da
     figura parada. O vídeo não tem som: quem fala é o app, por cima.
     Sem rede o vídeo não carrega e a figura de sempre continua ali. */
  function falarComElaNoEspaco(perfeito) {
    var v = $('#result-video'), foto = $('#result-lara');
    if (!v || !foto) return;
    v.pause(); v.removeAttribute('src'); v.load();
    v.hidden = true; foto.hidden = false;
    if (estado.tipo !== 'espaco') return;

    v.addEventListener('playing', function aoTocar() {
      v.removeEventListener('playing', aoTocar);
      v.hidden = false; foto.hidden = true;
    });
    v.addEventListener('error', function () { v.hidden = true; foto.hidden = false; });
    v.muted = true; v.defaultMuted = true;
    v.src = 'video/' + (perfeito ? 'lara-fala-perfeito' : 'lara-fala-bem') + '.mp4';
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* fica a figura parada */ });
  }

  function terminar() {
    var total = estado.rodadas.length, acertos = estado.acertos;
    $('#result-hits').textContent = acertos;
    $('#result-total').textContent = total;

    var perfeito = acertos === total;
    var cartao = document.querySelector('.result-card');
    var lara = $('#result-lara');
    if (lara) lara.src = perfeito ? 'img/lara-unicornio.webp' : 'img/lara-festa.webp';
    falarComElaNoEspaco(perfeito);
    if (cartao) cartao.classList.toggle('is-perfeito', perfeito);
    $('#result-emoji').textContent = perfeito ? '🏆' : (acertos >= total / 2 ? '🌟' : '💪');
    $('#result-title').textContent = perfeito ? 'Perfeito, Lara!' : (acertos >= total / 2 ? 'Muito bem, Lara!' : 'Boa, Lara!');

    var caixa = $('#result-stars');
    caixa.innerHTML = '';
    for (var i = 0; i < acertos; i++) {
      var s = document.createElement('img');
      s.src = 'img/estrela.webp'; s.alt = '';
      s.style.animationDelay = (i * 0.09) + 's';
      caixa.appendChild(s);
    }

    /* coleção de palavras: quantas das 30 ela já conheceu */
    var colecao = $('#result-colecao');
    if (colecao) {
      if (estado.tipo === 'palavras') {
        var vistas = palavrasVistas();
        colecao.hidden = false;
        colecao.textContent = 'Você já conheceu ' + vistas.length + ' das ' +
                              Palavras.FASES.length + ' palavras';
      } else {
        colecao.hidden = true;
      }
    }

    /* mesma razão do contador de estrelinhas: frase com número não tem como
       ser gravada. O placar exato aparece escrito logo abaixo, em estrelinhas. */
    var fala = perfeito ? 'Parabéns, Lara! Você acertou tudo!'
      : (acertos >= total * 0.7 ? 'Muito bem, Lara! Você acertou quase tudo!'
      : (acertos >= total / 2   ? 'Boa, Lara! Você acertou bastante!'
                                : 'Boa, Lara! Bora jogar de novo pra acertar mais!'));
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
    palavrasVistas: palavrasVistas,
    ganharEstrela: guardarEstrela,
    todasAsFalas: todasAsFalas
  };
})();
