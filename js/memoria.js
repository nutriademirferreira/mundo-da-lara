/* =========================================================
   JOGO DA MEMÓRIA
   Não traz arte nova: usa as figuras das palavras e os planetas
   que já estão no app. Isso também dá o ganho pedagógico de graça
   — cada carta virada fala o nome do que mostra, com a voz gravada
   que já existe pra essas 39 palavras.
   ========================================================= */
var Memoria = (function () {
  var $ = function (s) { return document.querySelector(s); };

  var PARES = 6;              /* 12 cartas em 3x4: cabe em pé sem rolagem */
  var baralho = [];           /* {id, nome, arte} duplicado e embaralhado */
  var viradas = [];           /* indices abertos agora, no maximo 2 */
  var achados = 0;
  var travado = false;        /* durante o tempo em que o par errado fica a mostra */
  var temaAtual = 'palavras';

  function sortear(tema) {
    var fonte;
    if (tema === 'espaco') {
      fonte = Espaco.ASTROS.map(function (a) {
        return { id: a.id, nome: a.nome, arte: Espaco.orbe(a, 96) };
      });
    } else {
      fonte = Palavras.FASES.map(function (f) {
        return { id: f.palavra, nome: f.palavra, arte: Palavras.figura(f) };
      });
    }
    /* sorteia quais entram: o tabuleiro nunca se repete duas partidas seguidas */
    return Jogo.embaralhar(fonte).slice(0, PARES);
  }

  function iniciar(tema) {
    temaAtual = tema || temaAtual;
    var denovo = $('#memoria-denovo'); if (denovo) denovo.hidden = true;
    var escolhidos = sortear(temaAtual);
    baralho = Jogo.embaralhar(escolhidos.concat(escolhidos).map(function (c, i) {
      return { id: c.id, nome: c.nome, arte: c.arte, chave: i };
    }));
    viradas = []; achados = 0; travado = false;
    desenhar();
    recado('Ache as duas figuras iguais.');
    Som.falar('Ache as duas figuras iguais.', { atraso: 300 });
  }

  function desenhar() {
    var caixa = $('#memoria');
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
    Som.falar(baralho[i].nome, { atraso: 160 });

    if (viradas.length < 2) return;

    var a = baralho[viradas[0]], b = baralho[viradas[1]];
    if (a.id === b.id) {
      var abertas = viradas.slice();
      viradas = [];
      achados++;
      setTimeout(function () {
        abertas.forEach(function (k) {
          var el = $('.carta[data-i="' + k + '"]');
          if (el) { el.classList.add('is-par'); el.setAttribute('aria-label', a.nome); }
        });
        Som.tocar('acerto');
        Jogo.ganharEstrela();
        if (achados === PARES) vencer();
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
