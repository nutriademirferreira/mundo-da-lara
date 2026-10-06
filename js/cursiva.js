/* =========================================================
   LETRA CURSIVA — ela passa o dedo por cima da letra
   Como funciona:
   1. a letra aparece como uma estrada clara, larga
   2. um traço colorido desenha a letra sozinho, mostrando ONDE
      começa e PRA QUE LADO vai — cursiva é direção, e mostrar
      ensina sem precisar de palavra
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
   seguir a ordem exata. A demonstração é que ensina a direção.
   ========================================================= */
var Traco = (function () {
  function $(s) { return document.querySelector(s); }
  var NS = 'http://www.w3.org/2000/svg';

  var TOLERANCIA = 10;      /* distancia (na escala da letra) pra contar como coberto */
  var META = 0.70;          /* fração da letra que precisa ficar coberta */
  var PRECISAO_MIN = 0.50;  /* fração do desenho dela que precisa cair em cima da letra */
  var JULGAR_COM = 0.60;    /* só julga erro depois de desenhar 60% do comprimento da letra:
                               meia dúzia de pontos tortos no começo não é tentativa */
  var ESPERA_PROXIMA = 1900;
  var PASSO = 1.6;          /* espaçamento das amostras ao longo do traço */
  var INCLINA = 'translate(10 0) skewX(-9)';

  var atual = 'a';
  var amostras = [];        /* {x, y, ok} ao longo de todos os traços da letra */
  var fins = [];            /* índice da última amostra de cada traço */
  var cobertos = 0;
  var concluida = false;
  var ponteiro = null;      /* id do dedo que está desenhando; o segundo dedo é ignorado */
  var linhaTinta = null;
  var ultimoPonto = null;
  var tintaTotal = 0;       /* comprimento de tudo que ela desenhou */
  var tintaCerta = 0;       /* comprimento do que caiu em cima da letra */
  var comprimentoLetra = 0;
  /* regra 8 do dossiê: a passagem automática pra próxima letra é um
     setTimeout, e timer pendente não pode sobreviver à saída da tela */
  var selo = 0, timerProxima = null;

  /* ---------- quais letras ela já fez ----------
     Lista validada na leitura: localStorage corrompido já mostrou
     "NaN" estrelas neste app. Dado estranho vira lista vazia. */
  function feitas() {
    try {
      var v = JSON.parse(localStorage.getItem('lara.cursiva.feitas') || '[]');
      return Array.isArray(v) ? v.filter(function (l) { return Cursiva.LETRAS[l]; }) : [];
    } catch (e) { return []; }
  }
  function marcarFeita(l) {
    var v = feitas();
    if (v.indexOf(l) > -1) return false;           /* já tinha: sem estrela de novo */
    v.push(l);
    try { localStorage.setItem('lara.cursiva.feitas', JSON.stringify(v)); } catch (e) {}
    return true;
  }

  function el(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function pauta() {
    return '<g class="pauta">' +
      '<line x1="0" y1="12" x2="100" y2="12"/>' +
      '<line x1="0" y1="42" x2="100" y2="42" class="pauta--meio"/>' +
      '<line x1="0" y1="86" x2="100" y2="86" class="pauta--base"/>' +
      '<line x1="0" y1="116" x2="100" y2="116"/></g>';
  }

  /* ---------- a grade com o alfabeto ---------- */
  function montarGrade() {
    var caixa = $('#cursiva-grade');
    var ja = feitas();
    caixa.innerHTML = Cursiva.ORDEM.map(function (l) {
      var L = Cursiva.LETRAS[l];
      var tracos = L.d.map(function (d) { return '<path d="' + d + '"/>'; }).join('');
      var feita = ja.indexOf(l) > -1;
      return '<button class="cletra' + (feita ? ' is-feita' : '') + '" type="button" data-letra="' + l + '"' +
             ' aria-label="Letra ' + Palavras.falaDaLetra(l.toUpperCase()) + (feita ? ', já feita' : '') + '">' +
               '<svg viewBox="0 0 100 130" aria-hidden="true"><g transform="' + INCLINA + '">' + tracos + '</g></svg>' +
             '</button>';
    }).join('');
    var n = $('#cursiva-contador');
    if (n) n.textContent = ja.length + ' de ' + Cursiva.ORDEM.length;
  }

  /* ---------- a letra grande ---------- */
  function abrir(l) {
    cancelar();
    atual = l;
    var L = Cursiva.LETRAS[l];
    var svg = $('#cursiva-svg');
    var tracos = L.d.map(function (d, i) {
      return '<path class="estrada" d="' + d + '"/>' +
             '<path class="demo" d="' + d + '" style="--atraso:' + (i * 1.7) + 's"/>';
    }).join('');
    svg.innerHTML = pauta() +
      '<g class="cursiva-letra" transform="' + INCLINA + '">' +
        tracos +
        '<g class="cobertura"></g>' +
        '<g class="tinta"></g>' +
        '<circle class="partida" cx="' + L.ini[0] + '" cy="' + L.ini[1] + '" r="5.5"/>' +
      '</g>';

    /* o traço de demonstração precisa saber o próprio comprimento pra
       se desenhar sozinho: stroke-dasharray do tamanho exato */
    svg.querySelectorAll('.demo').forEach(function (p) {
      var c = p.getTotalLength();
      p.style.strokeDasharray = c;
      p.style.strokeDashoffset = c;
      p.style.setProperty('--comprimento', c);
    });

    amostrar();
    concluida = false;
    $('#cursiva-svg').classList.remove('is-concluida', 'is-desenhando');
    $('#cursiva-titulo').textContent = 'Letra ' + l;
    var som = $('#cursiva-som');
    if (som) som.dataset.falar = Palavras.falaDaLetra(l.toUpperCase());
    Som.falar(Palavras.falaDaLetra(l.toUpperCase()), { atraso: 250 });
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
    Jogo.confete(30);
    if (marcarFeita(atual)) Jogo.ganharEstrela();
    Som.falar('Muito bem, Lara!', { atraso: 300 });
    var tela = $('#cursiva-parabens');
    if (tela) tela.hidden = false;

    /* passa sozinha pra próxima — com selo, pra não disparar se ela já saiu */
    var meu = ++selo;
    clearTimeout(timerProxima);
    timerProxima = setTimeout(function () {
      if (meu !== selo) return;
      seguir();
    }, ESPERA_PROXIMA);
  }

  /* depois do parabéns: próxima letra, ou volta pro alfabeto no z */
  function seguir() {
    var tela = $('#cursiva-parabens');
    if (tela) tela.hidden = true;
    var i = Cursiva.ORDEM.indexOf(atual);
    if (i < Cursiva.ORDEM.length - 1) { abrir(Cursiva.ORDEM[i + 1]); return; }
    montarGrade();
    App.ir('cursiva-menu');
  }

  function tentarDeNovo() {
    Som.falar('Quase! Tenta de novo.', { atraso: 120 });
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
    var i = Cursiva.ORDEM.indexOf(atual) + passo;
    if (i < 0 || i >= Cursiva.ORDEM.length) return;
    Som.tocar('toque');
    $('#cursiva-proxima').classList.remove('is-forte');
    abrir(Cursiva.ORDEM[i]);
  }

  function pintarSetas() {
    var i = Cursiva.ORDEM.indexOf(atual);
    $('#cursiva-anterior').disabled = i === 0;
    $('#cursiva-proxima').disabled = i === Cursiva.ORDEM.length - 1;
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
    var tela = $('#cursiva-parabens'); if (tela) tela.hidden = true;
    var svg = $('#cursiva-svg'); if (svg) svg.classList.remove('is-de-novo');
  }

  return { montarGrade: montarGrade, abrir: abrir, ligar: ligar, cancelar: cancelar };
})();
