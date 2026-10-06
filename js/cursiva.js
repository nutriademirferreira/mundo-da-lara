/* =========================================================
   ESCREVER — ela passa o dedo por cima da letra
   Serve aos dois alfabetos: letra maiúscula (de forma) e letra
   cursiva. Mesmo motor, mesmas duas telas (screen-cursiva-menu e
   screen-cursiva); muda o desenho, a pauta, a inclinação e onde
   fica guardado o que ela já fez — ver ALFABETOS.

   Como funciona:
   1. a letra aparece como uma estrada clara, larga
   2. um traço colorido desenha a letra sozinho, mostrando ONDE
      começa e PRA QUE LADO vai — mostrar ensina sem precisar de
      palavra
   3. ela passa o dedo; cada pedaço da estrada que o dedo cobre
      fica verde
   4. coberto o bastante, a letra brilha e ela ganha a estrela

   O GABARITO (pedido do Ademir):
   - ACERTOU: cobriu 70% da letra, chegou ao fim de cada traço, e
     pelo menos metade do que desenhou ficou em cima da letra
     -> tela verde de parabéns e passa sozinha pra próxima
   - ERROU: mais da metade do desenho fora da letra
     -> "Quase! Tenta de novo.", apaga e mostra a demonstração de novo
   - no meio disso: nada, ela continua desenhando
   O "errou" não tem X nem vermelho: a regra do app é que erro nunca
   pune, e a fala de tentar de novo já existia gravada no quiz.

   O que NÃO é exigido, de propósito: começar no ponto verde e
   seguir a ordem exata. A demonstração e os números é que ensinam.
   ========================================================= */
var Traco = (function () {
  function $(s) { return document.querySelector(s); }
  var NS = 'http://www.w3.org/2000/svg';

  var TOLERANCIA = 10;      /* distancia (na escala da letra) pra contar como coberto */
  var META = 0.70;          /* fração da letra que precisa ficar coberta */
  var PRECISAO_MIN = 0.50;  /* fração do desenho dela que precisa cair em cima da letra */
  var JULGAR_COM = 0.60;    /* só julga erro depois de desenhar 60% do comprimento da letra:
                               meia dúzia de pontos tortos no começo não é tentativa */
  /* a tela verde fica até a fala do parabéns acabar: trocar de letra no
     meio de "você fez a letra bê" mostraria o C ainda falando do B.
     Medido: a mais longa ("...a letra cê!") dura 3,0 s, mais 0,3 s de atraso */
  var ESPERA_PROXIMA = 3400;
  var ESPERA_ALFABETO = 4200;
  var PASSO = 1.6;          /* espaçamento das amostras ao longo do traço */

  var ALFABETOS = {
    maiuscula: {
      titulo: 'Letra Maiúscula',
      fala: 'Letra maiúscula. Passe o dedo por cima da letra.',
      letras: Maiuscula.LETRAS, ordem: Maiuscula.ORDEM,
      inclina: '',
      pauta: [[20, ''], [63, 'pauta--meio'], [106, 'pauta--base']],
      chave: 'lara.maiuscula.feitas',
      numerar: true
    },
    cursiva: {
      titulo: 'Letra Cursiva',
      fala: 'Letra cursiva. Passe o dedo por cima da letra.',
      letras: Cursiva.LETRAS, ordem: Cursiva.ORDEM,
      inclina: 'translate(10 0) skewX(-9)',
      pauta: [[12, ''], [42, 'pauta--meio'], [86, 'pauta--base'], [116, '']],
      chave: 'lara.cursiva.feitas',
      /* o segundo traço da cursiva é o pingo do i e do j, ou o corte do t:
         uma bolinha com número em cima esconderia justo o pingo */
      numerar: false
    }
  };
  var alfa = ALFABETOS.cursiva;

  var atual = 'a';
  var amostras = [];        /* {x, y, ok} ao longo de todos os traços da letra */
  var fins = [];            /* índice da última amostra de cada traço */
  var cobertos = 0;
  var concluida = false;
  var fechouAlfabeto = false; /* acertou a última que faltava: volta pro alfabeto, não pra próxima */
  var ponteiro = null;      /* id do dedo que está desenhando; o segundo dedo é ignorado */
  var linhaTinta = null;
  var ultimoPonto = null;
  var tintaTotal = 0;       /* comprimento de tudo que ela desenhou */
  var tintaCerta = 0;       /* comprimento do que caiu em cima da letra */
  var comprimentoLetra = 0;
  /* regra 8 do dossiê: a passagem automática pra próxima letra é um
     setTimeout, e timer pendente não pode sobreviver à saída da tela */
  var selo = 0, timerProxima = null;

  /* ---------- falas ----------
     Montadas aqui e em nenhum outro lugar: o gerador de vozes chama
     todasAsFalas() e grava exatamente o que o app vai pedir. Frase
     montada com + espalhada pelo código ficaria sem gravação e sairia
     na voz do sistema. As mesmas frases valem pros dois alfabetos —
     "a letra bê" é a mesma letra, maiúscula ou cursiva. */
  var FALA_ALFABETO = 'Parabéns, Lara! Você fez o alfabeto inteiro!';
  var FALA_DE_NOVO = 'Quase! Tenta de novo.';
  function nomeDaLetra(l) { return Palavras.falaDaLetra(l.toUpperCase()); }
  function falaAbrir(l) { return 'Vamos fazer a letra ' + nomeDaLetra(l) + '!'; }
  function falaAcerto(l) { return 'Muito bem, Lara! Você fez a letra ' + nomeDaLetra(l) + '!'; }
  function todasAsFalas() {
    var f = [FALA_ALFABETO, FALA_DE_NOVO];
    Object.keys(ALFABETOS).forEach(function (n) { f.push(ALFABETOS[n].fala); });
    Maiuscula.ORDEM.forEach(function (l) { f.push(falaAbrir(l), falaAcerto(l)); });
    return f;
  }

  function usar(nome) { if (ALFABETOS[nome]) alfa = ALFABETOS[nome]; }

  /* ---------- quais letras ela já fez ----------
     Lista validada na leitura: localStorage corrompido já mostrou
     "NaN" estrelas neste app. Dado estranho vira lista vazia. */
  function feitas() {
    try {
      var v = JSON.parse(localStorage.getItem(alfa.chave) || '[]');
      return Array.isArray(v) ? v.filter(function (l) { return alfa.letras[l]; }) : [];
    } catch (e) { return []; }
  }
  function marcarFeita(l) {
    var v = feitas();
    if (v.indexOf(l) > -1) return false;           /* já tinha: sem estrela de novo */
    v.push(l);
    try { localStorage.setItem(alfa.chave, JSON.stringify(v)); } catch (e) {}
    return true;
  }

  function el(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function pauta() {
    return '<g class="pauta">' + alfa.pauta.map(function (p) {
      return '<line x1="0" y1="' + p[0] + '" x2="100" y2="' + p[0] + '"' + (p[1] ? ' class="' + p[1] + '"' : '') + '/>';
    }).join('') + '</g>';
  }

  /* Onde vai a bolinha de partida de cada traço. Dois traços que nascem
     no mesmo ponto (as duas pernas do A, a haste e o teto do E) poriam o
     2 em cima do 1; então o segundo anda um pouco pelo próprio traço —
     continua dizendo onde começa e ainda aponta pra onde vai. */
  function partidas(caminhos) {
    var postos = [];
    caminhos.forEach(function (p) {
      var pt = p.getPointAtLength(0);
      var colado = postos.some(function (q) { return Math.abs(q.x - pt.x) < 8 && Math.abs(q.y - pt.y) < 8; });
      if (colado) pt = p.getPointAtLength(Math.min(16, p.getTotalLength() / 2));
      postos.push({ x: pt.x, y: pt.y });
    });
    return postos;
  }

  /* ---------- a grade com o alfabeto ---------- */
  function montarGrade(nome) {
    if (nome) usar(nome);
    var caixa = $('#cursiva-grade');
    var ja = feitas();
    caixa.innerHTML = alfa.ordem.map(function (l) {
      var L = alfa.letras[l];
      var tracos = L.d.map(function (d) { return '<path d="' + d + '"/>'; }).join('');
      var feita = ja.indexOf(l) > -1;
      return '<button class="cletra' + (feita ? ' is-feita' : '') + '" type="button" data-letra="' + l + '"' +
             ' aria-label="Letra ' + nomeDaLetra(l) + (feita ? ', já feita' : '') + '">' +
               '<svg viewBox="0 0 100 130" aria-hidden="true"><g transform="' + alfa.inclina + '">' + tracos + '</g></svg>' +
             '</button>';
    }).join('');
    var n = $('#cursiva-contador');
    if (n) n.textContent = ja.length + ' de ' + alfa.ordem.length;
    var t = $('#cursiva-menu-titulo');
    if (t) t.textContent = alfa.titulo;
    var som = $('#cursiva-menu-som');
    if (som) som.dataset.falar = alfa.fala;
  }

  /* ---------- a letra grande ---------- */
  function abrir(l, opcoes) {
    opcoes = opcoes || {};
    cancelar();
    atual = l;
    var L = alfa.letras[l];
    var svg = $('#cursiva-svg');
    var tracos = L.d.map(function (d, i) {
      return '<path class="estrada" d="' + d + '"/>' +
             '<path class="demo" d="' + d + '" style="--atraso:' + (i * 1.7) + 's"/>';
    }).join('');
    svg.innerHTML = pauta() +
      '<g class="cursiva-letra" transform="' + alfa.inclina + '">' +
        tracos +
        '<g class="cobertura"></g>' +
        '<g class="tinta"></g>' +
        '<g class="partidas"></g>' +
      '</g>';

    /* o traço de demonstração precisa saber o próprio comprimento pra
       se desenhar sozinho: stroke-dasharray do tamanho exato */
    svg.querySelectorAll('.demo').forEach(function (p) {
      var c = p.getTotalLength();
      p.style.strokeDasharray = c;
      p.style.strokeDashoffset = c;
      p.style.setProperty('--comprimento', c);
    });

    /* letra de vários traços, na maiúscula: cada começo ganha o número da
       ordem, e só o 1 pulsa — é por ali que começa */
    var numerar = alfa.numerar && L.d.length > 1;
    var postos = partidas(Array.prototype.slice.call(svg.querySelectorAll('.estrada')));
    if (!numerar) postos = postos.slice(0, 1);
    svg.querySelector('.partidas').innerHTML = postos.map(function (p, i) {
      var x = p.x.toFixed(1), y = p.y.toFixed(1);
      return '<circle class="partida' + (i ? ' is-quieta' : '') + '" cx="' + x + '" cy="' + y + '" r="' + (numerar ? 6 : 5.5) + '"/>' +
             (numerar ? '<text class="partida__n" x="' + x + '" y="' + y + '">' + (i + 1) + '</text>' : '');
    }).join('');

    amostrar();
    concluida = false;
    fechouAlfabeto = false;
    $('#cursiva-svg').classList.remove('is-concluida', 'is-desenhando');
    $('#cursiva-titulo').textContent = 'Letra ' + l;
    var som = $('#cursiva-som');
    if (som) som.dataset.falar = falaAbrir(l);
    /* vindo do parabéns, entra na fila: assim não corta o "muito bem" */
    Som.falar(falaAbrir(l), { atraso: 250, enfileirar: !!opcoes.enfileirar });
    pintarSetas();
  }

  function amostrar() {
    amostras = []; fins = []; cobertos = 0; comprimentoLetra = 0;
    tintaTotal = 0; tintaCerta = 0; ultimoPonto = null;
    document.querySelectorAll('#cursiva-svg .estrada').forEach(function (p) {
      var total = p.getTotalLength();
      comprimentoLetra += total;
      for (var s = 0; s <= total; s += PASSO) {
        var pt = p.getPointAtLength(s);
        amostras.push({ x: pt.x, y: pt.y, ok: false });
      }
      var ultimo = p.getPointAtLength(total);       /* o fim exato, que o passo pode pular */
      amostras.push({ x: ultimo.x, y: ultimo.y, ok: false });
      fins.push(amostras.length - 1);
    });
  }

  /* dedo (tela) -> coordenada da letra, desfazendo viewBox, translate e skew */
  function paraLetra(ev) {
    var g = document.querySelector('#cursiva-svg .cursiva-letra');
    var m = g && g.getScreenCTM();
    if (!m) return null;
    var p = $('#cursiva-svg').createSVGPoint();
    p.x = ev.clientX; p.y = ev.clientY;
    return p.matrixTransform(m.inverse());
  }

  /* marca o que o dedo cobriu e diz se esse ponto caiu em cima da letra */
  function marcar(pt) {
    var cob = document.querySelector('#cursiva-svg .cobertura');
    var emCima = false, lim = TOLERANCIA * TOLERANCIA;
    for (var i = 0; i < amostras.length; i++) {
      var a = amostras[i];
      var dx = a.x - pt.x, dy = a.y - pt.y;
      if (dx * dx + dy * dy > lim) continue;
      emCima = true;
      if (!a.ok) {
        a.ok = true; cobertos++;
        cob.appendChild(el('circle', { cx: a.x, cy: a.y, r: 4.2 }));
      }
    }
    return emCima;
  }

  /* soma o pedaço desenhado, pesado pelo comprimento: dedo rápido gera
     menos pontos que dedo lento, e contar pontos daria peso errado */
  function somarTinta(pt, emCima) {
    if (ultimoPonto) {
      var dx = pt.x - ultimoPonto.x, dy = pt.y - ultimoPonto.y;
      var trecho = Math.sqrt(dx * dx + dy * dy);
      tintaTotal += trecho;
      if (emCima) tintaCerta += trecho;
    }
    ultimoPonto = pt;
  }

  function comecar(ev) {
    if (ponteiro !== null || concluida) return;
    ponteiro = ev.pointerId;
    try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch (e) {}
    /* na primeira encostada a demonstração sai da frente */
    $('#cursiva-svg').classList.add('is-desenhando');
    var pt = paraLetra(ev); if (!pt) return;
    linhaTinta = el('polyline', { points: pt.x.toFixed(1) + ',' + pt.y.toFixed(1) });
    document.querySelector('#cursiva-svg .tinta').appendChild(linhaTinta);
    ultimoPonto = null;                     /* dedo novo: não liga com o traço anterior */
    somarTinta(pt, marcar(pt));
    ev.preventDefault();
  }

  function mover(ev) {
    if (ev.pointerId !== ponteiro || !linhaTinta) return;
    var pt = paraLetra(ev); if (!pt) return;
    linhaTinta.setAttribute('points', linhaTinta.getAttribute('points') + ' ' + pt.x.toFixed(1) + ',' + pt.y.toFixed(1));
    somarTinta(pt, marcar(pt));
    ev.preventDefault();
  }

  function soltar(ev) {
    if (ev.pointerId !== ponteiro) return;
    ponteiro = null; linhaTinta = null;
    conferir();
  }

  /* Cobertura sozinha deixava completar fazendo um pedaço: a margem do dedo
     alcança amostras à frente, e letra que passa duas vezes pelo mesmo lugar
     (a haste do t sobe e desce na mesma linha) conta as duas de uma vez.
     Medido: o t completava com 31% do traço. Por isso também precisa CHEGAR
     AO FIM de cada traço — o que não depende da ordem: quem começa do lado
     "errado" e vai até o fim também chega.
     E cobertura sozinha deixava passar quem rabisca a tela toda e acaba
     cobrindo a letra no meio do rabisco: por isso a precisão, que mede
     quanto do desenho dela caiu em cima da letra. */
  function conferir() {
    if (concluida || !amostras.length) return;
    var cobertura = cobertos / amostras.length;
    var chegouAoFim = fins.every(function (i) { return amostras[i].ok; });
    var precisao = tintaTotal > 0 ? tintaCerta / tintaTotal : 1;

    if (cobertura >= META && chegouAoFim && precisao >= PRECISAO_MIN) { acertou(); return; }

    /* errou: só depois de ela ter desenhado o bastante pra ser uma tentativa */
    if (tintaTotal >= comprimentoLetra * JULGAR_COM && precisao < PRECISAO_MIN) { tentarDeNovo(); return; }
    /* desenhou muito e ainda não fechou: também recomeça, senão ela fica
       rabiscando pra sempre sem saber o que falta */
    if (tintaTotal >= comprimentoLetra * 2.6) { tentarDeNovo(); return; }
    /* no meio do caminho: não diz nada, ela continua */
  }

  function acertou() {
    concluida = true;
    var svg = $('#cursiva-svg');
    svg.classList.add('is-concluida');
    Som.tocar('fanfarra');
    var nova = marcarFeita(atual);
    if (nova) Jogo.ganharEstrela();
    /* era a última que faltava: o alfabeto inteiro ficou verde */
    fechouAlfabeto = nova && feitas().length === alfa.ordem.length;
    Jogo.confete(fechouAlfabeto ? 90 : 30);
    Som.falar(fechouAlfabeto ? FALA_ALFABETO : falaAcerto(atual), { atraso: 300 });
    var tela = $('#cursiva-parabens');
    if (tela) tela.hidden = false;

    /* passa sozinha pra próxima — com selo, pra não disparar se ela já saiu */
    var meu = ++selo;
    clearTimeout(timerProxima);
    timerProxima = setTimeout(function () {
      if (meu !== selo) return;
      seguir();
    }, fechouAlfabeto ? ESPERA_ALFABETO : ESPERA_PROXIMA);
  }

  /* depois do parabéns: próxima letra; no fim do alfabeto (ou quando
     fechou o alfabeto inteiro) volta pra grade, toda verde */
  function seguir() {
    var tela = $('#cursiva-parabens');
    if (tela) tela.hidden = true;
    var i = alfa.ordem.indexOf(atual);
    if (!fechouAlfabeto && i < alfa.ordem.length - 1) { abrir(alfa.ordem[i + 1], { enfileirar: true }); return; }
    fechouAlfabeto = false;
    montarGrade();
    App.ir('cursiva-menu');
  }

  function tentarDeNovo() {
    Som.falar(FALA_DE_NOVO, { atraso: 120 });
    var svg = $('#cursiva-svg');
    svg.classList.add('is-de-novo');
    var meu = ++selo;
    clearTimeout(timerProxima);
    timerProxima = setTimeout(function () {
      if (meu !== selo) return;
      svg.classList.remove('is-de-novo');
      limpar();
    }, 700);
  }

  function limpar() {
    var svg = $('#cursiva-svg');
    svg.querySelector('.tinta').innerHTML = '';
    svg.querySelector('.cobertura').innerHTML = '';
    svg.classList.remove('is-concluida', 'is-desenhando');
    amostras.forEach(function (a) { a.ok = false; });
    cobertos = 0; concluida = false;
    tintaTotal = 0; tintaCerta = 0; ultimoPonto = null;
    $('#cursiva-proxima').classList.remove('is-forte');
    /* mostra de novo como se faz */
    svg.querySelectorAll('.demo').forEach(function (p) {
      p.style.animation = 'none'; void p.getBoundingClientRect(); p.style.animation = '';
    });
  }

  function andar(passo) {
    var i = alfa.ordem.indexOf(atual) + passo;
    if (i < 0 || i >= alfa.ordem.length) return;
    Som.tocar('toque');
    $('#cursiva-proxima').classList.remove('is-forte');
    abrir(alfa.ordem[i]);
  }

  function pintarSetas() {
    var i = alfa.ordem.indexOf(atual);
    $('#cursiva-anterior').disabled = i === 0;
    $('#cursiva-proxima').disabled = i === alfa.ordem.length - 1;
  }

  function ligar() {
    var grade = $('#cursiva-grade');
    if (grade) grade.addEventListener('click', function (e) {
      var b = e.target.closest('.cletra'); if (!b) return;
      Som.tocar('toque');
      App.ir('cursiva');
      abrir(b.dataset.letra);
    });
    var sup = $('#cursiva-svg');
    if (sup) {
      sup.addEventListener('pointerdown', comecar);
      sup.addEventListener('pointermove', mover);
      sup.addEventListener('pointerup', soltar);
      sup.addEventListener('pointercancel', soltar);
    }
    var b;
    if ((b = $('#cursiva-limpar'))) b.addEventListener('click', function () { Som.tocar('toque'); limpar(); });
    if ((b = $('#cursiva-parabens'))) b.addEventListener('click', function () { selo++; clearTimeout(timerProxima); seguir(); });
    if ((b = $('#cursiva-anterior'))) b.addEventListener('click', function () { andar(-1); });
    if ((b = $('#cursiva-proxima'))) b.addEventListener('click', function () { andar(1); });
  }

  function cancelar() {
    selo++; clearTimeout(timerProxima); timerProxima = null;
    fechouAlfabeto = false;
    var tela = $('#cursiva-parabens'); if (tela) tela.hidden = true;
    var svg = $('#cursiva-svg'); if (svg) svg.classList.remove('is-de-novo');
  }

  return {
    montarGrade: montarGrade, abrir: abrir, ligar: ligar, cancelar: cancelar,
    todasAsFalas: todasAsFalas, partidas: partidas, ALFABETOS: ALFABETOS
  };
})();
