/* =========================================================
   SÍLABAS — a grade das famílias, a família aberta e o Juntar

   Terceira entrada do Escrever, depois da letra maiúscula e da
   cursiva, e na ordem da alfabetização: ela já desenha a letra, agora
   junta consoante com vogal, e depois sílaba com sílaba até ler a
   palavra.

   Três telas:

   1. familias — 18 azulejos. As vogais primeiro, que é por onde toda
      cartilha começa, e depois uma consoante por azulejo.
   2. familia  — a família aberta: BA BE BI BO BU, grandes, cada uma
      tocável. Sem erro e sem estrela: aqui é pra ouvir.
   3. juntar   — o jogo. O desenho da palavra, as lacunas e as
      pastilhas de sílaba embaralhadas.

   QUATRO DECISÕES QUE PARECEM DETALHE E NÃO SÃO:

   1. A SÍLABA SOLTA NÃO SOA COMO DENTRO DA PALAVRA. Em português a
      vogal átona final reduz: SAPO acaba em /pu/, não em /po/. GATO,
      PATO, BOLO, COPO, GALO, SUCO e RATO, a mesma coisa. CASA é
      "caza", porque S entre vogais soa Z. Então a palavra pronta NUNCA
      é a soma dos mp3 das pastilhas: quando ela fecha a palavra, toca
      a frase inteira, com a palavra gravada do jeito que se fala.
      É a mesma escolha do "Com o u fica Lua": o app diz o que o
      conjunto se torna, nunca o que o pedaço é.

   2. TOCAR "BA" FALA "ba", e não "bê com á, ba". O bê-a-bá é uma conta
      que só fecha nas letras cujo nome é consoante + ê: dá certo em
      bê, cê, dê, gê, pê, tê, vê e zê, e desmonta em "éfe com á",
      "eme com á", "erre com á". Regra que vale pra metade do alfabeto
      é pior que regra nenhuma — foi o que derrubou o "u de Lua". O
      nome da letra entra uma vez só, na abertura da família.

   3. AS PASTILHAS NASCEM DA PALAVRA, não da grade. Sete sílabas das 25
      palavras não saem de nenhuma família, porque são sílaba travada
      ou dígrafo: PEI, POR, BAR, UR, VEM, VRO, LHA. A grade só serve
      pra sortear distratora.

   4. UMA PASTILHA POR LACUNA, não por sílaba distinta. BANANA é
      BA-NA-NA: com uma pastilha NA pra duas lacunas, o jogo trava na
      terceira. A identidade da pastilha é a posição, não o texto.
   ========================================================= */
var Silabario = (function () {

  function $(s) { return document.querySelector(s); }

  /* ---------- as falas ----------
     Nascem todas aqui e saem todas por todasAsFalas(), que o
     ferramentas/gerar-vozes.js chama. Frase montada com + o varredor
     por regex não enxerga, e frase que ele não enxerga sai na voz do
     sintetizador — o defeito que o Ademir já cobrou três vezes. */

  var FALA_GRADE  = 'As famílias. Toque numa letra pra ouvir a família dela.';
  var FALA_JUNTAR = 'Juntar as sílabas. Toque na sílaba certa pra montar a palavra.';
  var FALA_FIM    = 'Parabéns, Lara! Você juntou todas as palavras!';

  function falaDaFamilia(f) {
    /* o cantinho vai numa frase só, com palavra de verdade em volta: é
       assim que a ElevenLabs sabe que é português. Sílaba solta sem
       contexto já saiu com fonética de inglês neste app. */
    var sons = f.silabas.map(Silabas.falaDaSilaba).join(', ');
    if (f.vogais) return 'As vogais: ' + sons + '.';
    return 'A família do ' + Palavras.falaDaLetra(f.letra) + ': ' + sons + '.';
  }
  function falaPedido(p) { return Silabas.ditaPalavra(p.palavra) + '. Junte as sílabas.'; }
  function falaAcerto(p) { return 'Isso, Lara! Você leu ' + Silabas.ditaPalavra(p.palavra) + '!'; }

  function todasAsFalas() {
    var f = [FALA_GRADE, FALA_JUNTAR, FALA_FIM];
    Silabas.FAMILIAS.forEach(function (fam) { f.push(falaDaFamilia(fam)); });
    Silabas.todasAsSilabas().forEach(function (s) { f.push(Silabas.falaDaSilaba(s)); });
    Silabas.PALAVRAS.forEach(function (p) {
      f.push(falaPedido(p), falaAcerto(p), Silabas.ditaPalavra(p.palavra));
    });
    return f;
  }

  /* ---------- som aproximado, pra não pôr sósia na mesa ----------
     Distratora que SOA igual à certa tira a resposta única: ela não
     erra por não saber ler, erra porque o jogo não tem resposta pelo
     ouvido, e aí a estrela vira sorte. CE e SE são o mesmo som, GE e
     JE também, QUE e KE também. */
  function somDaSilaba(s) {
    var x = String(s).toUpperCase();
    x = x.replace(/^QU/, 'K');
    x = x.replace(/^C(?=[EI])/, 'S').replace(/^C/, 'K');
    x = x.replace(/^G(?=[EI])/, 'J');
    x = x.replace(/^X/, 'CH');
    return x;
  }

  /* =========================================================
     1. A GRADE DAS FAMÍLIAS
     18 azulejos em 3 colunas x 6 linhas. Altura vem da grade, nunca
     do conteúdo (regra 4b do dossiê).
     ========================================================= */
  function montarGrade() {
    var caixa = $('#familias-grade');
    if (!caixa || caixa.childElementCount) return;      /* monta uma vez só */
    caixa.innerHTML = Silabas.FAMILIAS.map(function (f) {
      var nome = f.vogais ? 'As vogais' : 'Família do ' + Palavras.falaDaLetra(f.letra);
      /* O azulejo NÃO mostra a consoante sozinha. Um B grande e só
         ensinaria que B é um som que se pronuncia solto, que é justo a
         confusão entre letra e som que a família silábica desfaz. Então
         ele já mostra a regra: a consoante em cima e as cinco vogais
         embaixo. */
      var dentro = f.vogais
        ? '<b class="cfamilia__vogais">' + f.rotulo + '</b>'
        : '<b class="cfamilia__c">' + f.rotulo + '</b>' +
          '<small class="cfamilia__v">A E I O U</small>';
      return '<button class="cfamilia' + (f.vogais ? ' cfamilia--vogais' : '') + '" type="button"' +
             ' data-familia="' + f.id + '" aria-label="' + nome + '">' + dentro + '</button>';
    }).join('');
  }

  /* =========================================================
     2. A FAMÍLIA ABERTA
     Só as cinco sílabas, grandes. Sem palavra de exemplo: a lição
     daqui é que a consoante FICA e a vogal MUDA, e desenho diferente
     em cada linha puxaria o olho pro que varia por fora. A palavra de
     verdade é o assunto da outra tela, o Juntar.
     ========================================================= */
  var familiaAtual = null;

  /* BA -> B + A. A consoante na cor da tinta e a vogal em rosa: ela vê
     de olho que a primeira parte não muda e a segunda muda. */
  function pastilhaDaFamilia(s) {
    var S = String(s).toUpperCase();
    var consoante = S.slice(0, -1), vogal = S.slice(-1);
    return '<button class="fsilaba" type="button" data-silaba="' + S + '" aria-label="Sílaba ' + S + '">' +
             (consoante ? '<b class="fsilaba__c">' + consoante + '</b>' : '') +
             '<b class="fsilaba__v">' + vogal + '</b>' +
           '</button>';
  }

  function abrirFamilia(id) {
    var f = Silabas.porId(id);
    if (!f) return;
    familiaAtual = f;

    var caixa = $('#familia-silabas');
    if (!caixa) return;
    caixa.innerHTML = f.silabas.map(pastilhaDaFamilia).join('');
    /* o Q tem três sílabas, não cinco: o número de linhas vem do
       tamanho do array, senão sobra uma vaga fantasma (QUU) */
    caixa.style.gridTemplateRows = 'repeat(' + f.silabas.length + ',1fr)';

    var t = $('#familia-titulo');
    if (t) t.textContent = f.vogais ? 'As Vogais' : 'Família do ' + f.rotulo;
    var som = $('#familia-som');
    if (som) som.dataset.falar = falaDaFamilia(f);
    pintarSetasFamilia();

    /* a troca de tela vem ANTES da fala: App.ir() chama Som.calar(),
       e falar primeiro faria a tela engolir a própria abertura */
    App.ir('familia');
    Som.falar(falaDaFamilia(f), { atraso: 250 });
  }

  function indiceDaFamilia() {
    var i = -1;
    Silabas.FAMILIAS.forEach(function (f, k) { if (familiaAtual && f.id === familiaAtual.id) i = k; });
    return i;
  }

  function andarFamilia(passo) {
    var j = indiceDaFamilia() + passo;
    if (j < 0 || j >= Silabas.FAMILIAS.length) return;
    Som.tocar('toque');
    abrirFamilia(Silabas.FAMILIAS[j].id);
  }

  function pintarSetasFamilia() {
    var i = indiceDaFamilia();
    var a = $('#familia-anterior'), p = $('#familia-proxima');
    if (a) a.disabled = i <= 0;
    if (p) p.disabled = i === Silabas.FAMILIAS.length - 1;
  }

  /* =========================================================
     3. JUNTAR
     ========================================================= */
  var CHAVE_FEITAS = 'lara.silabas.feitas';
  var ESPERA_PROXIMA = 3600;   /* "Isso, Lara! Você leu Banana!" dura ~2,6 s */
  var ESPERA_FIM = 4600;
  /* a ajuda sobe em degrau, e nenhum degrau custa gravação nova:
     1º erro na lacuna — a pastilha fala a própria sílaba e volta
     2º erro — o app repete a palavra que ela está montando
     3º erro — a pastilha certa começa a pulsar, e fica pulsando
     O 3º aponta, não resolve: o toque continua sendo dela, porque
     completar sozinho roubaria o ato que é a lição. */
  var AJUDA_FALA = 2, AJUDA_ACENDE = 3;

  var jogando = null;
  var selo = 0, timerProxima = null;

  function feitas() {
    try {
      var v = JSON.parse(localStorage.getItem(CHAVE_FEITAS) || '[]');
      if (!Array.isArray(v)) return [];
      return v.filter(function (n) {
        return Silabas.PALAVRAS.some(function (p) { return p.palavra === n; });
      });
    } catch (e) { return []; }                 /* localStorage estragado já virou "NaN" na tela deste app */
  }
  function marcarFeita(nome) {
    var v = feitas();
    if (v.indexOf(nome) > -1) return false;    /* já tinha: sem estrela de novo */
    v.push(nome);
    try { localStorage.setItem(CHAVE_FEITAS, JSON.stringify(v)); } catch (e) {}
    return true;
  }

  /* a próxima que ela ainda não fez; se fez todas, volta pra primeira */
  function proximaPalavra() {
    var ja = feitas();
    for (var i = 0; i < Silabas.PALAVRAS.length; i++)
      if (ja.indexOf(Silabas.PALAVRAS[i].palavra) === -1) return Silabas.PALAVRAS[i];
    return Silabas.PALAVRAS[0];
  }

  /* Pastilhas: uma por LACUNA mais duas distratoras — 4 numa palavra de
     duas sílabas, 5 numa de três. Duas não é estética: como a pastilha
     sai da mesa ao cair na lacuna, a última decisão da palavra fica
     sempre entre três, que é a forma do quiz, a única escolha já
     testada com ela. Com seis ela para de ouvir e vai por eliminação.
     Distratora sai das sílabas das OUTRAS palavras (todas gravadas e
     pronunciáveis), nunca uma que soe igual a alguma certa. */
  function montarPecas(p) {
    var certas = p.silabas.slice();
    var proibido = {};
    certas.forEach(function (s) { proibido[somDaSilaba(s)] = true; });

    /* A distratora sai de uma JANELA que acompanha a dificuldade: as
       palavras do começo da lista até cinco à frente desta. Varrendo a
       lista inteira, a primeira palavra do jogo — BOLA — sorteava VRO e
       POR como distratora, que são as sílabas mais difíceis do conjunto
       inteiro e aparecem no primeiro minuto dela. */
    var ate = 0;
    Silabas.PALAVRAS.forEach(function (o, k) { if (o.palavra === p.palavra) ate = k + 5; });
    var pool = [];
    Silabas.PALAVRAS.forEach(function (o, k) {
      if (k > ate || o.palavra === p.palavra) return;
      o.silabas.forEach(function (s) {
        if (proibido[somDaSilaba(s)]) return;
        if (pool.indexOf(s) === -1) pool.push(s);
      });
    });
    var extras = Jogo.embaralhar(pool).slice(0, 2);

    /* identidade por POSIÇÃO, não por texto: BANANA tem duas pastilhas
       NA, e casar por texto faria uma só atender as duas lacunas */
    return Jogo.embaralhar(certas.concat(extras)).map(function (s, i) {
      return { id: i, silaba: s, usada: false };
    });
  }

  function montarJuntar(p) {
    cancelar();
    p = p || proximaPalavra();
    jogando = { p: p, pecas: montarPecas(p), vaga: 0, errosNaVaga: 0, errou: false };

    var feita = feitas().indexOf(p.palavra) > -1;
    var n = 0;
    Silabas.PALAVRAS.forEach(function (x, k) { if (x.palavra === p.palavra) n = k + 1; });
    var palco = $('#juntar-palco');
    if (palco) palco.innerHTML =
      '<span class="fase-tag' + (feita ? ' fase-tag--feita' : '') + '">' +
        (feita ? '⭐ ' : '') + n + ' de ' + Silabas.PALAVRAS.length +
      '</span>' + Silabas.figura(p.palavra);

    desenharVagas();
    desenharPecas();

    var som = $('#juntar-som');
    if (som) som.dataset.falar = falaPedido(p);
    pintarSetasJuntar();
    Som.falar(falaPedido(p), { atraso: 300 });
  }

  function desenharVagas() {
    var caixa = $('#juntar-vagas');
    if (!caixa) return;
    var j = jogando;
    caixa.innerHTML = j.p.silabas.map(function (s, i) {
      if (i < j.vaga) return '<span class="jvaga is-cheia">' + s + '</span>';
      return '<span class="jvaga' + (i === j.vaga ? ' is-agora' : '') + '">&nbsp;</span>';
    }).join('');
  }

  function desenharPecas() {
    var caixa = $('#juntar-pecas');
    if (!caixa) return;
    /* duas fileiras sempre: 4 pastilhas viram 2x2 e 5 viram 3+2. Deixar o
       flex quebrar sozinho dava 4+1, torto, e mudava a altura da bandeja
       de uma palavra pra outra (regra 4b: altura vem da grade) */
    var colunas = Math.ceil(jogando.pecas.length / 2);
    caixa.style.gridTemplateColumns = 'repeat(' + colunas + ',minmax(0,104px))';
    caixa.innerHTML = jogando.pecas.map(function (pc) {
      return '<button class="jpeca' + (pc.usada ? ' is-usada' : '') + '" type="button"' +
             ' data-peca="' + pc.id + '"' + (pc.usada ? ' disabled' : '') +
             ' aria-label="Sílaba ' + pc.silaba + '">' + pc.silaba + '</button>';
    }).join('');
  }

  function tocarPeca(id) {
    var j = jogando;
    if (!j || j.vaga >= j.p.silabas.length) return;
    var pc = null;
    j.pecas.forEach(function (x) { if (String(x.id) === String(id)) pc = x; });
    if (!pc || pc.usada) return;

    if (pc.silaba !== j.p.silabas[j.vaga]) { errou(pc); return; }

    pc.usada = true;
    j.vaga++;
    j.errosNaVaga = 0;
    Som.tocar('zap');
    desenharVagas();
    desenharPecas();
    /* a sílaba que entrou é falada: é o pedaço virando som */
    Som.falar(Silabas.falaDaSilaba(pc.silaba));
    if (j.vaga >= j.p.silabas.length) fechouPalavra();
  }

  /* Erro não pune (regra 5): a pastilha não entra na lacuna, treme e
     volta pro lugar. Nada apaga, nada desaparece, nada fica vermelho —
     e a pastilha errada pode ser a certa da lacuna seguinte, então
     apagar ela seria mentira. O bop macio e o atraso da fala são os
     mesmos do quiz, que é o jeito já aprovado de dizer "não é essa". */
  function errou(pc) {
    var j = jogando;
    j.errou = true;
    j.errosNaVaga++;

    var b = $('#juntar-pecas .jpeca[data-peca="' + pc.id + '"]');
    if (b) { b.classList.remove('is-tremendo'); void b.offsetWidth; b.classList.add('is-tremendo'); }
    Som.tocar('erro');
    /* falar a própria sílaba transforma o erro em informação: ela toca
       PO e ouve "po". O app afirma a verdade em vez de corrigir ela. */
    Som.falar(Silabas.falaDaSilaba(pc.silaba), { atraso: 260 });
    if (j.errosNaVaga >= AJUDA_FALA)
      Som.falar(falaPedido(j.p), { atraso: 300, enfileirar: true });
    if (j.errosNaVaga >= AJUDA_ACENDE) acender();
  }

  /* ajuda que aponta sem falar: a pastilha certa começa a pulsar */
  function acender() {
    var j = jogando;
    var certa = j.p.silabas[j.vaga], achou = null;
    j.pecas.forEach(function (x) { if (!x.usada && !achou && x.silaba === certa) achou = x; });
    if (!achou) return;
    var b = $('#juntar-pecas .jpeca[data-peca="' + achou.id + '"]');
    if (b) b.classList.add('is-dica');
  }

  function fechouPalavra() {
    var j = jogando;
    var nova = marcarFeita(j.p.palavra);
    /* estrela só na primeira vez e só sem toque errado, igual ao quiz */
    if (nova && !j.errou) Jogo.ganharEstrela();
    var fechou = nova && feitas().length === Silabas.PALAVRAS.length;

    Som.tocar('fanfarra');
    Jogo.confete(fechou ? 90 : (j.errou ? 12 : 28));
    /* a palavra pronta toca a frase inteira, com a palavra gravada do
       jeito que se fala — nunca a soma das pastilhas. Enfileirada, pra
       não cortar a sílaba que acabou de entrar. */
    Som.falar(fechou ? FALA_FIM : falaAcerto(j.p), { atraso: 320, enfileirar: true });

    var vagas = $('#juntar-vagas');
    if (vagas) vagas.classList.add('is-pronta');

    var meu = ++selo;
    clearTimeout(timerProxima);
    timerProxima = setTimeout(function () {
      if (meu !== selo) return;                 /* regra 8: ela já saiu da tela */
      if (fechou) { App.ir('escrever-menu'); return; }
      montarJuntar();
    }, fechou ? ESPERA_FIM : ESPERA_PROXIMA);
  }

  function indiceDaPalavra() {
    var i = -1;
    Silabas.PALAVRAS.forEach(function (p, k) { if (jogando && p.palavra === jogando.p.palavra) i = k; });
    return i;
  }

  function andarJuntar(passo) {
    var j = indiceDaPalavra() + passo;
    if (j < 0 || j >= Silabas.PALAVRAS.length) return;
    Som.tocar('toque');
    montarJuntar(Silabas.PALAVRAS[j]);
  }

  function pintarSetasJuntar() {
    var i = indiceDaPalavra();
    var a = $('#juntar-anterior'), n = $('#juntar-proxima');
    if (a) a.disabled = i <= 0;
    if (n) n.disabled = i === Silabas.PALAVRAS.length - 1;
  }

  /* ---------- liga ---------- */
  function ligar() {
    var grade = $('#familias-grade');
    if (grade) grade.addEventListener('click', function (e) {
      var b = e.target.closest('.cfamilia'); if (!b) return;
      Som.tocar('toque');
      abrirFamilia(b.dataset.familia);
    });

    var fam = $('#familia-silabas');
    if (fam) fam.addEventListener('click', function (e) {
      var b = e.target.closest('.fsilaba'); if (!b) return;
      Som.falar(Silabas.falaDaSilaba(b.dataset.silaba));
      b.classList.remove('is-tocada'); void b.offsetWidth; b.classList.add('is-tocada');
    });

    var pecas = $('#juntar-pecas');
    if (pecas) pecas.addEventListener('click', function (e) {
      var b = e.target.closest('.jpeca'); if (!b) return;
      tocarPeca(b.dataset.peca);
    });

    var b;
    if ((b = $('#familia-anterior'))) b.addEventListener('click', function () { andarFamilia(-1); });
    if ((b = $('#familia-proxima')))  b.addEventListener('click', function () { andarFamilia(1); });
    if ((b = $('#juntar-anterior')))  b.addEventListener('click', function () { andarJuntar(-1); });
    if ((b = $('#juntar-proxima')))   b.addEventListener('click', function () { andarJuntar(1); });
  }

  /* regra 8: timer pendente não sobrevive à saída da tela */
  function cancelar() {
    selo++; clearTimeout(timerProxima); timerProxima = null;
    var vagas = $('#juntar-vagas');
    if (vagas) vagas.classList.remove('is-pronta');
  }

  return {
    montarGrade: montarGrade, abrirFamilia: abrirFamilia,
    montarJuntar: montarJuntar, ligar: ligar, cancelar: cancelar,
    todasAsFalas: todasAsFalas, somDaSilaba: somDaSilaba
  };
})();
