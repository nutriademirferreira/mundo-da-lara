/* =========================================================
   DAMAS — tabuleiro 6x6, versão para 5 anos
   Ela é a ESTRELA, o adversário é o PLANETA. Duas artes que já
   existem, as duas redondas e sem chance de confusão em 56px.

   O que foi cortado das damas brasileiras, e por quê:
   - captura NÃO é obrigatória. A lei da maioria faria o app recusar
     a jogada que ela escolheu, e recusar jogada de criança de 5 anos
     é o mesmo que jogar por ela.
   - a dama NÃO voa: anda uma casa, só que nas quatro diagonais.
     Dama que voa exige enxergar a diagonal inteira antes de tocar.
   - 6x6 e não 8x8: em 8x8 a casa fica com 42px num iPhone SE, abaixo
     do mínimo de 44px que o dedo dela precisa.
   O que ficou é damas de verdade: anda na diagonal, come pulando,
   vira dama na última fila.
   ========================================================= */
var Damas = (function () {
  function $(s) { return document.querySelector(s); }

  var N = 6;                                   /* 6x6 = 36 casas, 12 jogáveis por lado */
  var estado = null;
  /* Selo da partida. A jogada do app e agendada com setTimeout, e o timer
     sobrevive ao fim da partida e a saida da tela: sem isso ele dispara
     contra o estado da partida SEGUINTE e o jogo trava em "Minha vez".
     Cada partida ganha um selo; timer com selo velho e ignorado. */
  var selo = 0;
  var timerIA = null;
  /* placar vale só enquanto ela fica na tela, igual ao da velha */
  var placar = { L: 0, A: 0 };

  function idx(r, c) { return r * N + c; }
  function dentro(r, c) { return r >= 0 && r < N && c >= 0 && c < N; }
  function escura(r, c) { return (r + c) % 2 === 1; }

  function novoTabuleiro() {
    var t = new Array(N * N).fill(null);
    for (var r = 0; r < N; r++) {
      for (var c = 0; c < N; c++) {
        if (!escura(r, c)) continue;
        if (r < 2) t[idx(r, c)] = { d: 'A', dama: false };
        if (r > N - 3) t[idx(r, c)] = { d: 'L', dama: false };
      }
    }
    return t;
  }

  /* de onde a peça pode ir. Peça comum anda pra frente; dama, pros quatro lados. */
  function direcoes(p) {
    if (p.dama) return [[-1,-1],[-1,1],[1,-1],[1,1]];
    return p.d === 'L' ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]];
  }

  function movimentos(t, i) {
    var p = t[i]; if (!p) return [];
    var r = Math.floor(i / N), c = i % N, saidas = [];
    direcoes(p).forEach(function (d) {
      var r1 = r + d[0], c1 = c + d[1];
      if (!dentro(r1, c1)) return;
      var j = idx(r1, c1);
      if (!t[j]) { saidas.push({ para: j, come: null }); return; }
      if (t[j].d === p.d) return;                       /* peça própria bloqueia */
      var r2 = r1 + d[0], c2 = c1 + d[1];               /* pula por cima */
      if (dentro(r2, c2) && !t[idx(r2, c2)]) saidas.push({ para: idx(r2, c2), come: j });
    });
    return saidas;
  }

  function todasAsJogadas(t, dono) {
    var lista = [];
    t.forEach(function (p, i) {
      if (p && p.d === dono) movimentos(t, i).forEach(function (m) {
        lista.push({ de: i, para: m.para, come: m.come });
      });
    });
    return lista;
  }

  function aplicar(t, m) {
    var p = t[m.de];
    t[m.de] = null;
    if (m.come !== null) t[m.come] = null;
    var r = Math.floor(m.para / N);
    /* virou dama ao chegar na última fila do adversário */
    if (!p.dama && ((p.d === 'L' && r === 0) || (p.d === 'A' && r === N - 1))) p.dama = true;
    t[m.para] = p;
    return p;
  }

  function pecas(t, dono) { return t.filter(function (p) { return p && p.d === dono; }).length; }

  /* ---------- desenho ---------- */
  function arte(p) {
    if (p.d === 'L') return '<img src="img/estrela.webp" alt="" draggable="false">';
    return '<img src="img/planeta-netuno-b.webp" alt="" draggable="false">';
  }
  function nomeDe(p) {
    return (p.d === 'L' ? 'estrela' : 'planeta') + (p.dama ? ' rainha' : '');
  }

  function desenhar() {
    var tab = $('#damas-tab');
    tab.innerHTML = '';
    var destinos = {};
    if (estado.sel !== null) {
      movimentos(estado.tab, estado.sel).forEach(function (m) { destinos[m.para] = m; });
    }
    estado.tab.forEach(function (p, i) {
      var r = Math.floor(i / N), c = i % N;
      var casa = document.createElement('button');
      casa.type = 'button';
      casa.className = 'dcasa' + (escura(r, c) ? ' dcasa--escura' : ' dcasa--clara') +
                       (destinos[i] ? ' is-destino' : '') +
                       (estado.sel === i ? ' is-escolhida' : '');
      casa.disabled = !escura(r, c);
      if (p) {
        casa.innerHTML = '<span class="dpeca dpeca--' + (p.d === 'L' ? 'lara' : 'app') +
                         (p.dama ? ' is-dama' : '') + '">' + arte(p) + '</span>';
        casa.setAttribute('aria-label', nomeDe(p));
      } else {
        casa.setAttribute('aria-label', destinos[i] ? 'jogar aqui' : 'casa vazia');
      }
      if (escura(r, c)) casa.addEventListener('click', function () { tocar(i, destinos); });
      tab.appendChild(casa);
    });
  }

  /* ---------- o jogo ---------- */
  function tocar(i, destinos) {
    if (estado.fim || estado.travado || estado.vez !== 'L' && estado.modo === 'app') return;
    var p = estado.tab[i];
    if (destinos && destinos[i]) { jogar(destinos[i]); return; }
    if (p && p.d === estado.vez) {
      estado.sel = (estado.sel === i) ? null : i;   /* tocar de novo desmarca */
      Som.tocar('toque');
      desenhar();
      return;
    }
    estado.sel = null; desenhar();
  }

  function jogar(m) {
    m.de = estado.sel;
    aplicar(estado.tab, m);
    estado.sel = null;
    Som.tocar(m.come !== null ? 'acerto' : 'toque');
    var dono = estado.vez;
    estado.vez = dono === 'L' ? 'A' : 'L';
    desenhar();
    if (conferirFim()) return;
    anunciar();
    if (estado.modo === 'app' && estado.vez === 'A') {
      estado.travado = true;
      var meu = selo;
      clearTimeout(timerIA);
      timerIA = setTimeout(function () { if (meu === selo) jogadaDoApp(); }, 620);
    }
  }

  /* joga mal de propósito, igual à velha: só às vezes escolhe comer.
     Criança de 5 anos precisa ganhar bastante pra querer jogar de novo. */
  function jogadaDoApp() {
    if (!estado || estado.fim || estado.vez !== 'A') { if (estado) estado.travado = false; return; }
    var todas = todasAsJogadas(estado.tab, 'A');
    if (!todas.length) { estado.travado = false; conferirFim(); return; }
    var comidas = todas.filter(function (m) { return m.come !== null; });
    var escolha = (comidas.length && Math.random() < 0.4)
      ? comidas[Math.floor(Math.random() * comidas.length)]
      : todas[Math.floor(Math.random() * todas.length)];
    aplicar(estado.tab, escolha);
    estado.vez = 'L';
    estado.travado = false;
    desenhar();
    if (conferirFim()) return;
    anunciar();
  }

  function conferirFim() {
    var semPecaL = pecas(estado.tab, 'L') === 0;
    var semPecaA = pecas(estado.tab, 'A') === 0;
    var semJogadaL = todasAsJogadas(estado.tab, 'L').length === 0;
    var semJogadaA = todasAsJogadas(estado.tab, 'A').length === 0;
    if (!semPecaL && !semPecaA && !semJogadaL && !semJogadaA) return false;

    estado.fim = true;
    var ganhouLara = semPecaA || semJogadaA;
    placar[ganhouLara ? 'L' : 'A']++;
    pintarPlacar();
    var faixa = $('#damas-status');
    faixa.classList.add('is-fim');
    if (ganhouLara) {
      faixa.textContent = 'Você ganhou! ⭐';
      Som.tocar('fanfarra'); Jogo.confete(40); Jogo.ganharEstrela();
      Som.falar('Muito bem, Lara!', { atraso: 300 });
    } else {
      faixa.textContent = 'Os planetas ganharam dessa vez';
      Som.tocar('zap');
      Som.falar('Boa, Lara! Bora jogar de novo pra acertar mais!', { atraso: 300 });
    }
    var som = $('#damas-som');
    if (som) som.dataset.falar = ganhouLara ? 'Muito bem, Lara!' : 'Boa, Lara! Bora jogar de novo pra acertar mais!';
    $('#damas-denovo').classList.add('is-forte');
    return true;
  }

  function anunciar() {
    var faixa = $('#damas-status');
    faixa.classList.remove('is-fim');
    if (estado.modo === 'app') {
      faixa.textContent = estado.vez === 'L' ? 'Sua vez, Lara! ⭐' : 'Minha vez… 🪐';
      faixa.classList.toggle('is-app', estado.vez === 'A');
    } else {
      faixa.textContent = estado.vez === 'L' ? 'Vez da estrela ⭐' : 'Vez do planeta 🪐';
    }
    var som = $('#damas-som');
    if (som) som.dataset.falar = estado.vez === 'L' ? 'Sua vez, Lara!' : 'Agora é a minha vez.';
  }

  function pintarPlacar() {
    var l = $('#dplacar-l'), a = $('#dplacar-a');
    if (l) l.textContent = placar.L;
    if (a) a.textContent = placar.A;
    var som = $('#dplacar-som');
    if (som && !placar.L && !placar.A) som.dataset.falar = 'Ninguém ganhou ainda. Bora jogar!';
  }

  function iniciar(modo, sessaoNova) {
    cancelar();                       /* mata o timer da partida anterior */
    if (sessaoNova) placar = { L: 0, A: 0 };
    estado = { modo: modo, tab: novoTabuleiro(), vez: 'L', sel: null, fim: false, travado: false };
    var t = $('#damas-titulo');
    if (t) t.textContent = modo === 'app' ? 'Lara ⭐  contra  App 🪐' : 'Lara ⭐  contra  Papai 🪐';
    $('#damas-denovo').classList.remove('is-forte');
    pintarPlacar();
    desenhar();
    anunciar();
    Som.falar('Sua vez, Lara!', { atraso: 300 });
  }

  function ligar() {
    var d = $('#damas-denovo');
    if (d) d.addEventListener('click', function () { Som.tocar('toque'); iniciar(estado ? estado.modo : 'app', false); });
  }

  function zerarPlacar() { placar = { L: 0, A: 0 }; }
  /* chamado ao sair da tela: sem isso a jogada do app dispara com ela
     ja noutro jogo */
  function cancelar() { selo++; clearTimeout(timerIA); timerIA = null; }

  return { iniciar: iniciar, ligar: ligar, zerarPlacar: zerarPlacar, cancelar: cancelar };
})();
