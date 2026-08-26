/* =========================================================
   JOGO DA VELHA — Lara é o ✗, o app (ou o outro jogador) é o ◯
   O computador joga fácil de propósito: criança de 5 anos
   precisa ganhar bastante pra querer jogar de novo.
   ========================================================= */
var Velha = (function () {
  function $(s) { return document.querySelector(s); }

  var LINHAS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  var estado = null;

  function marca(sim) {
    if (sim === 'X') {
      return '<svg class="marca marca--x" viewBox="0 0 100 100" aria-label="xis">' +
             '<path d="M28 28 L72 72"/><path d="M72 28 L28 72"/></svg>';
    }
    return '<svg class="marca marca--o" viewBox="0 0 100 100" aria-label="bolinha">' +
           '<circle cx="50" cy="50" r="25"/></svg>';
  }

  function nome(sim) { return sim === 'X' ? 'xis' : 'bolinha'; }

  function iniciar(modo) {
    estado = { modo: modo, tab: ['','','','','','','','',''], vez: 'X', fim: false, travado: false };
    $('#velha-status').classList.remove('is-fim');
    $('#velha-denovo').classList.remove('is-forte');
    var titulo = $('#velha-titulo');
    if (titulo) titulo.textContent = modo === 'app' ? 'Lara ✗  contra  App ◯' : 'Lara ✗  contra  Papai ◯';
    desenhar();
    anunciar(true);
  }

  function desenhar() {
    var tabuleiro = $('#velha-tab');
    tabuleiro.innerHTML = '';
    estado.tab.forEach(function (valor, i) {
      var casa = document.createElement('button');
      casa.type = 'button';
      casa.className = 'casa' + (valor ? ' casa--cheia' : '');
      casa.innerHTML = valor ? marca(valor) : '';
      casa.setAttribute('aria-label', valor ? nome(valor) : 'casa vazia');
      if (!valor) casa.addEventListener('click', function () { jogar(i); });
      tabuleiro.appendChild(casa);
    });
  }

  function anunciar(falar) {
    var faixa = $('#velha-status');
    var texto;
    if (estado.modo === 'app') {
      texto = estado.vez === 'X' ? 'Sua vez, Lara! ✗' : 'Minha vez… ◯';
    } else {
      texto = estado.vez === 'X' ? 'Vez do ✗' : 'Vez do ◯';
    }
    faixa.textContent = texto;
    faixa.classList.toggle('is-app', estado.vez === 'O' && estado.modo === 'app');
    var som = $('#velha-som');
    var fala = estado.modo === 'app'
      ? (estado.vez === 'X' ? 'Sua vez, Lara!' : 'Agora é a minha vez.')
      : 'Vez do ' + nome(estado.vez) + '.';
    if (som) som.dataset.falar = fala;
    if (falar) Som.falar(fala, { atraso: 300 });
  }

  function vencedor(tab) {
    for (var i = 0; i < LINHAS.length; i++) {
      var l = LINHAS[i];
      if (tab[l[0]] && tab[l[0]] === tab[l[1]] && tab[l[1]] === tab[l[2]]) return { sim: tab[l[0]], linha: l };
    }
    return tab.indexOf('') === -1 ? { sim: 'velha', linha: [] } : null;
  }

  function jogar(i) {
    if (estado.fim || estado.travado || estado.tab[i]) return;
    estado.tab[i] = estado.vez;
    Som.tocar('toque');
    desenhar();

    var fim = vencedor(estado.tab);
    if (fim) return terminar(fim);

    estado.vez = estado.vez === 'X' ? 'O' : 'X';
    anunciar(true);

    if (estado.modo === 'app' && estado.vez === 'O') {
      estado.travado = true;
      setTimeout(function () {
        estado.travado = false;
        var escolha = jogadaDoApp();
        if (escolha != null) jogar(escolha);
      }, 750);
    }
  }

  /* jogada do app: às vezes esperta, na maior parte do tempo boba */
  function jogadaDoApp() {
    var livres = [];
    estado.tab.forEach(function (v, i) { if (!v) livres.push(i); });
    if (!livres.length) return null;

    if (Math.random() < 0.35) {
      var esperta = fecharLinha('O') ; // ganha se der
      if (esperta == null) esperta = fecharLinha('X');   // senão, bloqueia
      if (esperta != null) return esperta;
    }
    return livres[Math.floor(Math.random() * livres.length)];
  }

  function fecharLinha(sim) {
    for (var i = 0; i < LINHAS.length; i++) {
      var l = LINHAS[i];
      var meus = 0, vazia = -1;
      for (var j = 0; j < 3; j++) {
        if (estado.tab[l[j]] === sim) meus++;
        else if (!estado.tab[l[j]]) vazia = l[j];
      }
      if (meus === 2 && vazia > -1) return vazia;
    }
    return null;
  }

  function terminar(fim) {
    estado.fim = true;
    var faixa = $('#velha-status');
    var casas = document.querySelectorAll('#velha-tab .casa');
    fim.linha.forEach(function (i) { casas[i].classList.add('casa--ganhou'); });

    var texto, fala;
    if (fim.sim === 'velha') {
      texto = 'Deu velha! 🤝';
      fala = 'Deu velha! Ninguém ganhou. Bora de novo?';
      Som.tocar('estrela');
    } else if (estado.modo === 'app') {
      if (fim.sim === 'X') {
        texto = 'Você ganhou! 🏆';
        fala = 'Você ganhou, Lara! Uhuul!';
        Som.tocar('fanfarra'); Jogo.confete(40); Jogo.ganharEstrela();
      } else {
        texto = 'Eu ganhei dessa vez ◯';
        fala = 'Eu ganhei dessa vez. Joga de novo comigo!';
        Som.tocar('erro');
      }
    } else {
      texto = (fim.sim === 'X' ? 'O ✗ ganhou!' : 'O ◯ ganhou!') + ' 🏆';
      fala = 'O ' + nome(fim.sim) + ' ganhou!';
      Som.tocar('fanfarra'); Jogo.confete(40);
      if (fim.sim === 'X') Jogo.ganharEstrela();
    }

    faixa.textContent = texto;
    faixa.classList.remove('is-app');
    faixa.classList.add('is-fim');
    var som = $('#velha-som');
    if (som) som.dataset.falar = fala;
    Som.falar(fala, { atraso: 420 });
    $('#velha-denovo').classList.add('is-forte');
  }

  function reiniciar() { iniciar(estado ? estado.modo : 'app'); }

  function modoAtual() { return estado ? estado.modo : 'app'; }

  return { iniciar: iniciar, reiniciar: reiniciar, modoAtual: modoAtual };
})();
