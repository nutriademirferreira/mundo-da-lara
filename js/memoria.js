/* =========================================================
   JOGO DA MEMÓRIA
   Não traz arte nova: usa as figuras das palavras e os planetas
   que já estão no app. Isso também dá o ganho pedagógico de graça
   — cada carta virada fala o nome do que mostra, com a voz gravada
   que já existe pra essas 39 palavras.
   ========================================================= */
var Memoria = (function () {
  var $ = function (s) { return document.querySelector(s); };

  /* =========================================================
     DIFICULDADE QUE CRESCE
     Comeca facil e sobe a cada tabuleiro fechado. Zera quando o app
     recarrega — de proposito: ela volta no dia seguinte e ganha a
     primeira partida, que e o que faz querer a segunda. Subir sem
     nunca descer transformaria o jogo numa escada que so cansa.
     Cada nivel tem grade propria porque a tela e em pe: mais linhas
     que colunas, senao a carta fica larga e baixa e a figura some.
     ========================================================= */
  var NIVEIS = [
    { pares: 3, colunas: 2, linhas: 3 },   /*  6 cartas */
    { pares: 4, colunas: 2, linhas: 4 },   /*  8 */
    { pares: 6, colunas: 3, linhas: 4 },   /* 12 */
    { pares: 8, colunas: 4, linhas: 4 },   /* 16 — teto: abaixo disso a
                                              carta fica menor que o dedo */
  ];
  var nivel = 0;             /* zera sozinho quando o app recarrega */
  var baralho = [];           /* {id, nome, arte} duplicado e embaralhado */
  var viradas = [];           /* indices abertos agora, no maximo 2 */
  var achados = 0;
  var travado = false;        /* durante o tempo em que o par errado fica a mostra */
  var temaAtual = 'palavras';
  var paresAgora = 3;

  /* =========================================================
     PARES DE FOTO QUE SE CONFUNDEM
     As 14 fotos sao da mesma menina, quase sempre no mesmo vestido
     floral — no tabuleiro de 16 cartas a carta fica com 79px e
     "Curiosa" vira igual a "Oi!". Medi a distancia visual entre todas
     as combinacoes (cor media em grade de 20x20 sobre o recorte, mais
     a proporcao da silhueta) e estes nove pares ficaram abaixo do
     limiar em que ainda da pra diferenciar nesse tamanho.
     Existe conjunto de 9 fotos sem nenhum par destes, e o nivel maximo
     usa 8 — entao sempre cabe. O sorteio abaixo pula o conflito em vez
     de fixar uma lista, senao todo tabuleiro grande sairia igual.
     ========================================================= */
  var CONFUNDEM = [
    ['lara-oi', 'lara-corpo2'],        /* Oi!      x Curiosa    */
    ['lara-corpo2', 'lara-velha'],     /* Curiosa  x Coroa      */
    ['lara-oi', 'lara-velha'],         /* Oi!      x Coroa      */
    ['lara-corpo', 'lara-velha'],      /* Pensando x Coroa      */
    ['lara-oi', 'lara-palavras'],      /* Oi!      x Letrinhas  */
    ['lara-velha2', 'lara-espaco2'],   /* Rainha   x No espaço  */
    ['lara-velha', 'lara-velha2'],     /* Coroa    x Rainha     */
    ['lara-corpo2', 'lara-palavras'],  /* Curiosa  x Letrinhas  */
    ['lara-espaco', 'lara-viajante'],  /* No planeta x Explorando */
  ];

  function briga(id, jaEscolhidos) {
    return CONFUNDEM.some(function (p) {
      return (p[0] === id && jaEscolhidos.indexOf(p[1]) > -1) ||
             (p[1] === id && jaEscolhidos.indexOf(p[0]) > -1);
    });
  }

  /* embaralha e vai pegando, pulando quem se parece com alguem que ja
     entrou. Se sobrar vaga no fim (nao deve, mas o jogo nao pode ficar
     com tabuleiro incompleto), completa com o que restou. */
  function sortearFotos(fonte, quantas) {
    var baguncado = Jogo.embaralhar(fonte);
    var ids = [], escolhidas = [];
    baguncado.forEach(function (f) {
      if (escolhidas.length >= quantas || briga(f.id, ids)) return;
      escolhidas.push(f); ids.push(f.id);
    });
    if (escolhidas.length < quantas) {
      baguncado.forEach(function (f) {
        if (escolhidas.length < quantas && ids.indexOf(f.id) === -1) {
          escolhidas.push(f); ids.push(f.id);
        }
      });
    }
    return escolhidas;
  }

  function sortear(tema, pares) {
    var fonte;
    if (tema === 'espaco') {
      fonte = Espaco.ASTROS.map(function (a) {
        return { id: a.id, fala: Espaco.comArtigo(a), arte: Espaco.orbe(a, 96) };
      });
    } else if (tema === 'lara') {
      /* a fala e a legenda da galeria ("Lara acenando oi."), nao o rotulo
         curto: as 15 legendas ja estao gravadas na voz dela */
      fonte = App.fotos().map(function (f) {
        return { id: f.arq, fala: f.fala,
                 arte: '<img class="foto-carta" src="img/' + f.arq + '.webp" alt="' + f.nome + '" draggable="false">' };
      });
    } else {
      fonte = Palavras.FASES.map(function (f) {
        return { id: f.palavra, fala: f.palavra, arte: Palavras.figura(f) };
      });
    }
    /* sorteia quais entram: o tabuleiro nunca se repete duas partidas seguidas */
    if (tema === 'lara') return sortearFotos(fonte, pares);
    return Jogo.embaralhar(fonte).slice(0, pares);
  }

  function iniciar(tema) {
    temaAtual = tema || temaAtual;
    var denovo = $('#memoria-denovo'); if (denovo) denovo.hidden = true;
    var n = NIVEIS[Math.min(nivel, NIVEIS.length - 1)];
    paresAgora = n.pares;
    var escolhidos = sortear(temaAtual, n.pares);
    baralho = Jogo.embaralhar(escolhidos.concat(escolhidos).map(function (c, i) {
      return { id: c.id, fala: c.fala, arte: c.arte, chave: i };
    }));
    viradas = []; achados = 0; travado = false;
    desenhar(n);
    recado('Ache as duas figuras iguais.');
    Som.falar('Ache as duas figuras iguais.', { atraso: 300 });
  }

  function desenhar(n) {
    var caixa = $('#memoria');
    /* a grade vem do nivel, nao do CSS: cada tamanho de tabuleiro tem a sua */
    caixa.style.gridTemplateColumns = 'repeat(' + n.colunas + ',1fr)';
    caixa.style.gridTemplateRows = 'repeat(' + n.linhas + ',1fr)';
    caixa.dataset.pares = n.pares;
    caixa.innerHTML = baralho.map(function (c, i) {
      return '<button class="carta" type="button" data-i="' + i + '" aria-label="Carta virada">' +
               '<span class="carta__lado carta__verso"><img src="img/estrela.webp" alt="" draggable="false"></span>' +
               '<span class="carta__lado carta__frente">' + c.arte + '</span>' +
             '</button>';
    }).join('');
    caixa.classList.remove('is-fim');
  }

  function recado(t) { var e = $('#memoria-msg'); if (e) e.textContent = t; }

  function tocar(i) {
    if (travado) return;
    var carta = $('.carta[data-i="' + i + '"]');
    if (!carta || carta.classList.contains('is-aberta') || carta.classList.contains('is-par')) return;

    carta.classList.add('is-aberta');
    viradas.push(i);
    Som.tocar('toque');
    Som.falar(baralho[i].fala, { atraso: 160 });

    if (viradas.length < 2) return;

    var a = baralho[viradas[0]], b = baralho[viradas[1]];
    if (a.id === b.id) {
      var abertas = viradas.slice();
      viradas = [];
      achados++;
      setTimeout(function () {
        abertas.forEach(function (k) {
          var el = $('.carta[data-i="' + k + '"]');
          if (el) { el.classList.add('is-par'); el.setAttribute('aria-label', a.fala); }
        });
        Som.tocar('acerto');
        Jogo.ganharEstrela();
        if (achados === paresAgora) vencer();
        else Som.falar('Achou!', { atraso: 220 });
      }, 420);
    } else {
      /* erro nao pune: as duas so voltam a virar, sem som de errado */
      travado = true;
      var erradas = viradas.slice();
      viradas = [];
      setTimeout(function () {
        erradas.forEach(function (k) {
          var el = $('.carta[data-i="' + k + '"]');
          if (el) el.classList.remove('is-aberta');
        });
        travado = false;
      }, 1100);
    }
  }

  function vencer() {
    /* sobe um degrau; o proximo tabuleiro ja vem maior */
    if (nivel < NIVEIS.length - 1) nivel++;
    recado('Você achou todos os pares!');
    Som.tocar('fanfarra');
    Jogo.confete(40);
    Som.falar('Você achou todos os pares, Lara!', { atraso: 300 });
    $('#memoria').classList.add('is-fim');
    var denovo = $('#memoria-denovo'); if (denovo) denovo.hidden = false;
  }

  function ligar() {
    var caixa = $('#memoria');
    if (!caixa) return;
    caixa.addEventListener('click', function (e) {
      var c = e.target.closest('.carta');
      if (c) tocar(Number(c.dataset.i));
    });
    var denovo = $('#memoria-denovo');
    /* mesmo tema, cartas novas: ela quer jogar de novo, nao escolher de novo */
    if (denovo) denovo.addEventListener('click', function () { Som.tocar('toque'); iniciar(temaAtual); });
  }

  return { iniciar: iniciar, ligar: ligar };
})();
