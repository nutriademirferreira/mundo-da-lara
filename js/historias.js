/* =========================================================
   HISTÓRIAS — a biblioteca e a tela de leitura

   Quem lê é o adulto, em voz alta, no escuro, com a Lara no colo. Tudo
   aqui serve a isso: texto grande, muito espaço em branco, fundo escuro
   e as marcações de som num chip que dá pra enxergar de longe.

   É a única tela além da galeria que rola, e rola o CONTAINER, nunca o
   body (regra 1 e 2 do docs/TELAS.md). História de 450 palavras não cabe
   numa tela, e aqui quem opera é o pai, não a criança.

   Os dados vêm de js/data-historias.js, gerado por
   ferramentas/compilar-historias.js a partir de historias/*.md.
   ========================================================= */
var Contos = (function () {

  function $(s) { return document.querySelector(s); }

  var INSTRUCAO = 'Quando aparecer o som, faz o barulhinho ou chama ela pra fazer junto';
  var lendo = null;

  /* ---------- texto ---------- */

  function escapar(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* negrito e itálico do markdown. O negrito sai primeiro: se o itálico
     corresse antes, ** viraria dois ** vazios e comeria a lição. */
  function enfeitar(t) {
    return escapar(t)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  function chipDeSom(trecho) {
    var dentro = '<span class="som-chip__ico" aria-hidden="true"></span>';
    if (trecho.som)  dentro += '<span class="som-chip__som">' + escapar(trecho.som) + '</span>';
    if (trecho.acao) dentro += '<span class="som-chip__acao">' + escapar(trecho.acao) + '</span>';
    return '<span class="som-chip">' + dentro + '</span>';
  }

  function montarParagrafo(trechos) {
    var html = '';
    for (var i = 0; i < trechos.length; i++) {
      var t = trechos[i];
      if (t.tipo === 'som') html += chipDeSom(t);
      else html += '<span>' + enfeitar(t.texto) + '</span>';
      if (i < trechos.length - 1) html += ' ';
    }
    return '<p class="leitura__p">' + html + '</p>';
  }

  /* ---------- biblioteca ---------- */

  function montarBiblioteca() {
    var caixa = $('#historias');
    if (!caixa || caixa.childElementCount) return;    /* monta uma vez só */

    var lista = (typeof Historias !== 'undefined' && Historias.LISTA) || [];
    lista.forEach(function (h) {
      var card = document.createElement('div');
      card.className = 'conto-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Ler ' + h.titulo);
      card.innerHTML =
        '<img src="' + h.ilustracao + '" alt="" loading="lazy">' +
        '<span class="conto-card__pe">' +
          '<b class="conto-card__nome">' + escapar(h.emoji + ' ' + h.titulo) + '</b>' +
          '<small class="conto-card__min">' + h.tempoLeituraMin + ' min de leitura</small>' +
        '</span>';
      card.addEventListener('click', function () { abrir(h.id); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
      });
      caixa.appendChild(card);
    });

    /* mesma razão da galeria: aspect-ratio não dimensiona linha implícita
       de grade neste app (regra 4b), então a altura vem medida em JS */
    if (window.ResizeObserver) new ResizeObserver(ajustar).observe(caixa);
    ajustar();
  }

  function ajustar() {
    var caixa = $('#historias');
    var card = caixa && caixa.querySelector('.conto-card');
    if (!card) return;
    var l = card.getBoundingClientRect().width;
    if (l > 0) caixa.style.gridAutoRows = Math.round(l * 1.06) + 'px';
  }

  /* ---------- leitura ---------- */

  function abrir(id) {
    var h = (typeof Historias !== 'undefined' && Historias.porId(id)) || null;
    if (!h) return;
    lendo = h;

    var corpo = $('#leitura');
    if (!corpo) return;

    var html =
      '<img class="leitura__arte" src="' + h.ilustracao + '" alt="">' +
      '<h3 class="leitura__titulo">' + escapar(h.emoji + ' ' + h.titulo) + '</h3>' +
      '<p class="leitura__instrucao">' + INSTRUCAO + '</p>';

    h.paragrafos.forEach(function (p) { html += montarParagrafo(p); });
    html += '<p class="leitura__fim">Boa noite, Lara. 💛</p>';

    corpo.innerHTML = html;
    corpo.scrollTop = 0;

    var titulo = $('#leitura-titulo');
    if (titulo) titulo.textContent = h.titulo;

    /* a troca de tela é do App: montar o texto sem navegar deixava o toque
       no cartão sem resposta nenhuma */
    if (typeof App !== 'undefined' && App.ir) App.ir('leitura');
  }

  function aLendo() { return lendo; }

  return { montarBiblioteca: montarBiblioteca, abrir: abrir, ajustar: ajustar, aLendo: aLendo };
})();
