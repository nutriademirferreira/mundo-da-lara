/* =========================================================
   APP — navegação entre telas, modo Aprender e modo Explorar
   ========================================================= */
var App = (function () {
  function $(s, raiz) { return (raiz || document).querySelector(s); }
  function $$(s, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(s)); }

  var TELAS = {
    'start':            'screen-start',
    'home':             'screen-home',
    'corpo-menu':       'screen-corpo-menu',
    'corpo-aprender':   'screen-corpo-aprender',
    'espaco-menu':      'screen-espaco-menu',
    'espaco-explorar':  'screen-espaco-explorar',
    'galeria':          'screen-galeria',
    'cineminha':        'screen-cineminha',
    'memoria-menu':     'screen-memoria-menu',
    'memoria':          'screen-memoria',
    'tamanho':          'screen-tamanho',
    'viagem':           'screen-viagem',
    'velha-menu':       'screen-velha-menu',
    'velha':            'screen-velha',
    'quiz':             'screen-quiz',
    'result':           'screen-result'
  };
  var telaAtual = 'start';

  /* =========================================================
     FUNDO DE CADA TELA
     imagem + véu. O véu é o que mantém texto e botão legíveis:
     tela clara ganha véu claro, tela escura ganha véu escuro.
     ========================================================= */
  var FUNDOS = {
    'start':            { foto:'fundo-inicio', veu:'escuro' },
    'home':             { foto:'fundo-home',   veu:'claro'  },
    'corpo-menu':       { foto:'fundo-corpo',  veu:'claro'  },
    'corpo-aprender':   { foto:'fundo-corpo',  veu:'claro'  },
    'espaco-menu':      { foto:'fundo-espaco', veu:'escuro' },
    'espaco-explorar':  { foto:'fundo-espaco', veu:'espaco' },
    'tamanho':          { foto:'fundo-espaco', veu:'espaco' },
    'viagem':           { foto:'fundo-espaco', veu:'espaco' },
    'velha-menu':       { foto:'fundo-velha',  veu:'escuro' },
    'velha':            { foto:'fundo-velha',  veu:'meio'   },
    'result':           { foto:'fundo-home',   veu:'claro'  },
    'galeria':          { foto:'fundo-home',   veu:'claro'  },
    'cineminha':        { foto:'fundo-espaco', veu:'escuro' },
    'memoria-menu':     { foto:'fundo-home',   veu:'claro'  },
    'memoria':          { foto:'fundo-home',   veu:'claro'  }
  };

  /* Véu mínimo. A imagem é o espetáculo — quem precisa de contraste
     (título, texto solto) ganha sombra própria no CSS, não uma camada
     branca por cima da arte inteira. */
  var VEUS = {
    claro:  'linear-gradient(180deg, rgba(255,248,252,.34) 0%, rgba(252,246,255,.16) 40%, rgba(246,238,255,.42) 100%)',
    escuro: 'linear-gradient(180deg, rgba(16,10,38,.34), rgba(10,6,26,.55))',
    espaco: 'linear-gradient(180deg, rgba(8,10,32,.28), rgba(5,6,22,.52))',
    meio:   'linear-gradient(180deg, rgba(255,248,242,.20) 0%, rgba(255,246,238,.10) 45%, rgba(255,240,228,.36) 100%)',
    quiz:   'linear-gradient(180deg, rgba(255,248,252,.30), rgba(245,238,255,.48))',
    cena:   'linear-gradient(180deg, rgba(255,250,253,.14) 0%, rgba(255,249,253,.24) 42%, rgba(250,244,255,.62) 74%)'
  };


  /* Cor de borda de cada veu. O html recebe ela junto com a troca de tela.
     Serve de ultima defesa contra a faixa: se por qualquer motivo o iOS
     deixar um fio de janela descoberto, ele sai na cor daquela tela em vez
     do roxo do body, que e o que estava chamando atencao. */
  var BORDAS = {
    claro:  '#EDE6FB',
    escuro: '#140C2E',
    espaco: '#080A20',
    meio:   '#2A1A10',
    quiz:   '#EFE8FF',
    cena:   '#F6F1FC'
  };

  var fundoAtivo = 'a';
  function pintarFundo(nome, extra) {
    var cfg = extra || FUNDOS[nome];
    var veu = $('#fundo-veu');
    if (!cfg) {
      veu.style.background = '';
      document.documentElement.style.background = '';
      $('#fundo-a').classList.remove('is-on'); $('#fundo-b').classList.remove('is-on');
      return;
    }

    var url = 'url("img/' + cfg.foto + '.webp")';
    var visivel = fundoAtivo === 'a' ? $('#fundo-a') : $('#fundo-b');
    veu.style.background = VEUS[cfg.veu] || VEUS.claro;
    document.documentElement.style.background = BORDAS[cfg.veu] || BORDAS.claro;

    /* já é essa a imagem no ar? não faz nada. (antes eu comparava com a
       camada de trás e a troca era engolida quando a foto se repetia) */
    if (visivel.style.backgroundImage === url) return;

    var alvo = fundoAtivo === 'a' ? $('#fundo-b') : $('#fundo-a');
    alvo.style.backgroundImage = url;
    alvo.classList.add('is-on');
    visivel.classList.remove('is-on');
    fundoAtivo = fundoAtivo === 'a' ? 'b' : 'a';
  }

  function atualizarColecao() {
    var botao = document.querySelector('.tile--words');
    if (!botao) return;
    var falante = botao.parentNode.querySelector('[data-falar]');
    if (!falante) return;
    /* sem o número de propósito: ele muda a cada rodada e não dá pra gravar
       um arquivo pra cada, então a frase inteira saía na voz do sistema.
       A contagem exata continua escrita na tela de resultado. */
    var vistas = Jogo.palavrasVistas().length;
    falante.dataset.falar = 'Palavras. Complete a palavra com a letra que está faltando. ' +
      (vistas ? 'Você já conheceu várias palavras!' : 'São trinta palavras pra descobrir.');
  }

  function ir(nome) {
    if (!TELAS[nome]) return;
    Som.calar();
    /* placar da velha só vale enquanto ela está na tela do tabuleiro */
    if (telaAtual === 'velha' && nome !== 'velha') Velha.zerarPlacar();
    $$('.screen').forEach(function (s) { s.classList.remove('is-active'); });
    var el = document.getElementById(TELAS[nome]);
    if (el) { el.classList.add('is-active'); el.scrollTop = 0; }
    telaAtual = nome;
    if (nome !== 'quiz') { pintarFundo(nome); Jogo.cancelarRodada(); }
    if (nome === 'home') atualizarColecao();
    Jogo.pintarEstrelas();
  }

  /* =========================================================
     ALTO-FALANTE — vale pra qualquer botão com data-falar,
     inclusive os que nascem depois (opções do quiz, planetas)
     ========================================================= */
  function ligarAltoFalantes() {
    document.addEventListener('click', function (e) {
      var botao = e.target.closest && e.target.closest('[data-falar]');
      if (!botao) return;
      e.preventDefault();
      e.stopPropagation();
      falarBotao(botao);
    });
  }

  function falarBotao(botao) {
    /* data-falar-partes: frase montada de pedaços gravados, pro caso em que
       o número É o conteúdo (o placar da velha). data-falar continua servindo
       de texto inteiro pro sintetizador, se algum pedaço não tiver gravação. */
    var partes = null;
    if (botao.dataset.falarPartes) {
      try { partes = JSON.parse(botao.dataset.falarPartes); } catch (e) { partes = null; }
    }
    var texto = botao.dataset.falar;
    if (!partes && !texto) return;

    $$('.som-btn.is-falando').forEach(function (b) { b.classList.remove('is-falando'); });
    if (partes) Som.falarPedacos(partes); else Som.falar(texto);
    if (!Som.estaLigado()) return;

    var tamanho = texto ? texto.length : partes.join(' ').length;
    botao.classList.add('is-falando');
    clearTimeout(botao._temporizador);
    botao._temporizador = setTimeout(function () {
      botao.classList.remove('is-falando');
    }, Math.min(700 + tamanho * 72, 6000));
  }

  /* =========================================================
     PASSAGEM — a Lara entra deslizando ao abrir cada mundo.
     Um segundo, sem travar nada: o jogo já está carregando por baixo.
     A versão crescida abre a porta do mundo; a pequena brinca junto.
     ========================================================= */
  /* A Lalá pequena é a companheira de brincadeira — é ela que entra nos
     mundos. A versão crescida ficou só no cartão do Sistema Solar. */
  var PASSAGENS = {
    'corpo-menu':    'lara-corpo2',
    'espaco-menu':   'lara-espaco2',
    'velha-menu':    'lara-velha2',
    'palavras-jogar':'lara-palavras'
  };
  var passagemNoAr = null;

  function passar(qual) {
    var arte = PASSAGENS[qual];
    if (!arte) return;
    var caixa = $('#passagem');
    $('#passagem-img').src = 'img/' + arte + '.webp';
    caixa.classList.remove('is-on');
    void caixa.offsetWidth;               /* reinicia a animação */
    caixa.classList.add('is-on');
    clearTimeout(passagemNoAr);
    passagemNoAr = setTimeout(function () { caixa.classList.remove('is-on'); }, 3000);
  }

  /* ---------- roteamento por data-go ---------- */
  function ligarNavegacao() {
    $$('[data-go]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-falar]')) return;
        var destino = b.dataset.go;
        passar(destino);
        if (destino === 'corpo-jogar')       { ir('quiz'); Jogo.iniciar('corpo'); return; }
        if (destino === 'orgaos-jogar')      { ir('quiz'); Jogo.iniciar('orgaos'); return; }
        if (destino === 'orgaos-aprender')   { montarAprender('orgaos'); ir('corpo-aprender'); return; }
        if (destino === 'espaco-jogar')      { ir('quiz'); Jogo.iniciar('espaco'); return; }
        if (destino === 'palavras-jogar')    { ir('quiz'); Jogo.iniciar('palavras'); return; }
        if (destino === 'velha-app')         { ir('velha'); Velha.iniciar('app', true); return; }
        if (destino === 'velha-dois')        { ir('velha'); Velha.iniciar('dois', true); return; }
        if (destino === 'corpo-aprender')    { montarAprender('partes'); ir('corpo-aprender'); return; }
        if (destino === 'espaco-explorar')   { montarExplorar(); ir('espaco-explorar'); return; }
        if (destino === 'galeria')           { montarGaleria(); ir('galeria'); ajustarGaleria(); return; }
        if (destino === 'cineminha')         { montarCineminha(); ir('cineminha'); ajustarGaleria(); return; }
        if (destino === 'memoria-palavras')  { ir('memoria'); Memoria.iniciar('palavras'); return; }
        if (destino === 'memoria-espaco')    { ir('memoria'); Memoria.iniciar('espaco'); return; }
        if (destino === 'tamanho')           { montarTamanho(); ir('tamanho'); return; }
        if (destino === 'viagem')            { montarViagem(); ir('viagem'); return; }
        ir(destino);
      });
    });
  }

  /* =========================================================
     APRENDER — toca na Lara e ouve o nome da parte
     ========================================================= */
  function montarAprender(tipo) {
    var orgao = tipo === 'orgaos';
    var palco = $('#corpo-stage-learn');
    palco.innerHTML = '<div class="kid">' + Corpo.arte(tipo, 'aprender') + '</div>';
    var svg = palco.querySelector('svg');
    var ficha = $('#corpo-label');
    $('#corpo-aprender-titulo').textContent = orgao ? 'Toque num órgão' : 'Toque numa parte';
    ficha.innerHTML = '<span class="label-card__hint">' +
      (orgao ? 'Toque no corpo pra ver o que tem dentro 👆' : 'Toque na Lara para descobrir 👆') + '</span>';

    $$('.hit', svg).forEach(function (area) {
      area.addEventListener('click', function () {
        var parte = Corpo.porId(area.dataset.parte, tipo);
        if (!parte) return;

        $$('.hit', svg).forEach(function (o) { o.classList.remove('is-on'); });
        area.classList.add('is-on');

        var falaCompleta = parte.artigo + ' ' + parte.nome + '. ' + parte.dica;
        ficha.innerHTML =
          '<div class="label-card__texto">' +
            '<div class="label-card__name">' + parte.artigo + ' ' + parte.nome + '</div>' +
            '<div class="label-card__tip">' + parte.dica + '</div>' +
          '</div>' +
          '<button class="som-btn" type="button" aria-label="Ouvir de novo" data-falar="' +
            falaCompleta.replace(/"/g, '') + '"></button>';

        Som.tocar('zap');
        Som.falar(parte.artigo + ' ' + parte.nome, { atraso: 120 });
        Som.falar(parte.dica, { enfileirar: true, atraso: 140 });
      });
    });
  }

  /* =========================================================
     EXPLORAR — viagem do Sol até Netuno (arrastando pro lado)
     ========================================================= */
  function montarExplorar() {
    var trilha = $('#orbit-scroll');
    trilha.innerHTML = '';
    Espaco.ASTROS.forEach(function (astro) {
      var card = document.createElement('div');
      card.className = 'planet-card';
      card.innerHTML =
        '<button class="planet-card__toque" type="button">' +
          '<span class="planet-card__orb">' + Espaco.orbe(astro, astro.tam) + '</span>' +
        '</button>' +
        '<span class="planet-card__linha">' +
          '<span class="planet-card__name">' + astro.nome + '</span>' +
          '<button class="som-btn som-btn--mini" type="button" aria-label="Ouvir ' + astro.nome + '"' +
            ' data-falar="' + astro.nome + '"></button>' +
        '</span>' +
        '<span class="planet-card__pos">' + astro.legenda + '</span>';
      card.addEventListener('click', function (e) {
        if (e.target.closest('[data-falar]')) return;
        abrirFicha(astro);
      });
      trilha.appendChild(card);
    });
    trilha.scrollLeft = 0;
  }

  /* =========================================================
     TAMANHO DE VERDADE
     Uma escala só pra todos: o maior planeta ocupa a altura da
     faixa, e todo o resto sai dessa mesma régua. Por isso
     Mercúrio vira um pontinho — e é essa a lição.
     ========================================================= */
  function montarTamanho() {
    var trilha = $('#tamanho-scroll');
    var altura = trilha.clientHeight || Math.round(innerHeight * 0.52);
    var util = Math.max(180, altura - 78);            /* sobra pro nome e a medida */
    var escala = util / Espaco.REAIS.jupiter.km;      /* Júpiter é a régua */

    var terraKm = Espaco.REAIS.terra.km;
    trilha.innerHTML = '';

    /* o Sol primeiro: no mesmo tamanho ele teria mais de 4 mil pixels */
    /* o Sol teria milhares de pixels: mostro só a beirada curva,
       o suficiente pra ela ver que é uma bola que não cabe */
    var solPx = Math.round(Espaco.REAIS.sol.km * escala);
    var mostra = 168;
    var sol = document.createElement('div');
    sol.className = 'tam-sol';
    sol.innerHTML =
      '<div class="tam-sol__arco" style="width:' + solPx + 'px;height:' + solPx + 'px;' +
        'margin-left:' + (mostra - solPx) + 'px"></div>' +
      '<div class="tam-sol__rotulo"><b>O Sol</b>' +
      '<span>tão grande que nem cabe aqui — 109 Terras de largura</span></div>';
    trilha.appendChild(sol);

    var ordem = ['mercurio','marte','venus','terra','urano','netuno','saturno','jupiter'];
    ordem.forEach(function (id) {
      var astro = Espaco.porId(id);
      var real = Espaco.REAIS[id];
      var bolaPx = real.km * escala;                   /* tamanho da BOLA na tela */
      var quadroPx = Math.max(14, Math.round(bolaPx / real.bola));  /* a arte é maior que a bola */
      var vezes = (real.km / terraKm);
      var medida = vezes >= 1.6 ? (vezes.toFixed(1).replace('.', ',') + '× a Terra')
                 : vezes <= 0.62 ? ('cabe ' + Math.round(1 / vezes) + '× na Terra')
                 : 'quase igual à Terra';

      var fala = astro.nome + '. ' +
        (vezes >= 1.6 ? ('É ' + vezes.toFixed(1).replace('.', ' vírgula ') + ' vezes maior que a Terra.')
       : vezes <= 0.62 ? ('Ele cabe ' + Math.round(1 / vezes) + ' vezes dentro da Terra.')
       : 'É quase do tamanho da Terra.');

      var item = document.createElement('div');
      item.className = 'tam-item';
      item.innerHTML =
        '<span class="tam-item__bola"><img src="img/planeta-' + id + '.webp" alt="' + astro.nome + '"' +
          ' style="width:' + quadroPx + 'px" draggable="false"></span>' +
        '<span class="tam-item__linha">' +
          '<span class="tam-item__nome">' + astro.nome + '</span>' +
          '<button class="som-btn som-btn--nano" type="button" aria-label="Ouvir ' + astro.nome + '"' +
            ' data-falar="' + fala + '"></button>' +
        '</span>' +
        '<span class="tam-item__medida">' + medida + '</span>';
      item.addEventListener('click', function (e) {
        if (e.target.closest('[data-falar]')) return;
        abrirFicha(astro);
      });
      trilha.appendChild(item);
    });
    trilha.scrollLeft = 0;
  }

  /* =========================================================
     A VIAGEM
     Distância real do Sol até cada planeta, na mesma escala.
     O tamanho aqui é arbitrário de propósito — se as duas coisas
     fossem reais ao mesmo tempo, a Terra viraria pó invisível.
     ========================================================= */
  function montarViagem() {
    var trilha = $('#viagem-scroll');
    /* escala maior e um empurrão inicial: os quatro de dentro ficam juntos de
       verdade, mas amontoados na tela viram bagunça em vez de informação */
    var PX_POR_MILHAO = 1.35;
    var SAIDA = 170;                          /* espaço pro Sol não engolir Mercúrio */
    var margemFinal = 260;
    var fim = SAIDA + Espaco.DISTANCIAS.netuno.milhoes * PX_POR_MILHAO + margemFinal;

    var pista = document.createElement('div');
    pista.className = 'viagem-pista';
    pista.style.width = Math.round(fim) + 'px';
    pista.innerHTML = '<div class="viagem-sol"></div><span class="viagem-sol__nome">O Sol</span>';

    ['mercurio','venus','terra','marte','jupiter','saturno','urano','netuno'].forEach(function (id, i) {
      var astro = Espaco.porId(id);
      var d = Espaco.DISTANCIAS[id];
      var tam = id === 'jupiter' || id === 'saturno' ? 82 : (id === 'urano' || id === 'netuno' ? 66 : 42);
      var real = Espaco.REAIS[id];
      var quadro = Math.round(tam / real.bola);

      var parada = document.createElement('div');
      /* nome alternado em cima e embaixo: com os de dentro tão perto,
         os rótulos se atropelariam numa linha só */
      parada.className = 'viagem-parada' + (i % 2 ? ' viagem-parada--baixo' : '');
      parada.style.left = Math.round(SAIDA + d.milhoes * PX_POR_MILHAO) + 'px';
      parada.innerHTML =
        '<img src="img/planeta-' + id + '.webp" alt="' + astro.nome + '" style="width:' + quadro + 'px" draggable="false">' +
        '<span class="viagem-parada__nome">' + astro.nome + '</span>' +
        '<span class="viagem-parada__tempo">' + d.viagem + '</span>';
      parada.addEventListener('click', function () { abrirFicha(astro); });
      pista.appendChild(parada);
    });

    /* a chegada: ela esperando em Netuno, no fim da viagem */
    var chegada = document.createElement('div');
    chegada.className = 'viagem-chegada';
    chegada.style.left = Math.round(SAIDA + Espaco.DISTANCIAS.netuno.milhoes * PX_POR_MILHAO + 190) + 'px';
    chegada.innerHTML = '<img src="img/lara-espaco.webp" alt="">' +
                        '<span class="viagem-parada__nome">Chegamos!</span>';
    pista.appendChild(chegada);

    trilha.innerHTML = '';
    trilha.appendChild(pista);
    trilha.scrollLeft = 0;
    atualizarFoguete();
    trilha.onscroll = atualizarFoguete;
  }

  function atualizarFoguete() {
    var trilha = $('#viagem-scroll');
    var vao = trilha.scrollWidth - trilha.clientWidth;
    var andado = vao > 0 ? trilha.scrollLeft / vao : 0;
    $('#viagem-foguete').style.left = Math.round(andado * 100) + '%';
    $('#viagem-foguete').classList.toggle('is-chegou', andado > 0.985);

    /* qual foi a última parada que ela já passou */
    var frente = trilha.scrollLeft + 40;   /* a beirada do foguete, não o meio da tela */
    var ultima = 'Saindo do Sol';
    var ordem = ['mercurio','venus','terra','marte','jupiter','saturno','urano','netuno'];
    for (var i = 0; i < ordem.length; i++) {
      var x = 170 + Espaco.DISTANCIAS[ordem[i]].milhoes * 1.35;
      if (frente >= x) ultima = 'Passando por ' + Espaco.porId(ordem[i]).nome;
    }
    if (andado > 0.985) ultima = 'Chegou em Netuno! 🎉';
    $('#viagem-texto').textContent = ultima;
  }

  /* =========================================================
     GALERIA — o lugar onde a Lara se vê
     ========================================================= */
  var FOTOS = [
    { arq:'lara-oi',         nome:'Oi!',            fala:'Lara acenando oi.' },
    { arq:'lara-festa',      nome:'Pulando',        fala:'Lara pulando de alegria.' },
    { arq:'lara-unicornio',  nome:'Unicorninho',    fala:'Lara abraçada com o unicorninho.' },
    { arq:'lara-corpo',      nome:'Pensando',       fala:'Lara pensando com o dedinho no rosto.' },
    { arq:'lara-corpo2',     nome:'Curiosa',        fala:'Lara curiosa.' },
    { arq:'lara-palavras',   nome:'Letrinhas',      fala:'Lara segurando os blocos de letras.' },
    { arq:'lara-velha',      nome:'Coroa',          fala:'Lara com uma coroa dourada na mão.' },
    { arq:'lara-velha2',     nome:'Rainha',         fala:'Lara com a coroa, toda cheia de pose.' },
    { arq:'lara-espaco',     nome:'No planeta',     fala:'Lara em pé em cima de um planeta.' },
    { arq:'lara-espaco2',    nome:'No espaço',      fala:'Lara viajando no espaço.' },
    { arq:'lara-viajante',   nome:'Explorando',     fala:'Lara explorando o sistema solar.' },
    { arq:'lara-astronauta', nome:'Astronauta',     fala:'Lara astronauta, quando ela crescer.' },
    { arq:'lara-princesa',   nome:'Princesa',       fala:'Lara princesa, quando ela crescer.' },
    { arq:'lara-cientista',  nome:'Cientista',      fala:'Lara cientista, quando ela crescer.' }
  ];
  var fotoAberta = 0;

  function montarGaleria() {
    var caixa = $('#galeria');
    if (caixa.childElementCount) return;                 /* monta uma vez só */
    FOTOS.forEach(function (f, i) {
      /* div e não button: botão não repassa a altura da proporção pra
         linha da grade, e os cartões se atropelam */
      var card = document.createElement('div');
      card.className = 'foto-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
      });
      card.innerHTML = '<img src="img/' + f.arq + '.webp" alt="' + f.nome + '" loading="lazy">' +
                       '<span class="foto-card__nome">' + f.nome + '</span>';
      card.addEventListener('click', function () { abrirFoto(i); });
      caixa.appendChild(card);
    });
    /* a tela pode estar escondida na hora de montar: o observador acerta
       a altura assim que a galeria ganha largura de verdade */
    if (window.ResizeObserver) {
      new ResizeObserver(ajustarGaleria).observe(caixa);
    } else {
      window.addEventListener('resize', ajustarGaleria);
      setTimeout(ajustarGaleria, 60); setTimeout(ajustarGaleria, 300);
    }
    ajustarGaleria();
  }

  /* A altura da linha é calculada aqui de propósito: aspect-ratio e o truque
     do padding-top não dimensionam a linha da grade neste caso, e os cartões
     acabavam se atropelando. Medir a largura real e mandar a altura resolve. */
  function ajustarGaleria() {
    ['#galeria', '#cineminha'].forEach(function (sel) {
      var caixa = $(sel);
      var card = caixa && caixa.querySelector('.foto-card');
      if (!card) return;
      var l = card.getBoundingClientRect().width;
      if (l > 0) caixa.style.gridAutoRows = Math.round(l * 1.32) + 'px';
    });
  }

  function abrirFoto(i) {
    fotoAberta = (i + FOTOS.length) % FOTOS.length;
    var f = FOTOS[fotoAberta];
    $('#visor-foto').src = 'img/' + f.arq + '.webp';
    $('#visor-foto').alt = f.nome;
    $('#visor-nome').textContent = f.nome;
    $('#visor-som').dataset.falar = f.fala;
    $('#visor').hidden = false;
    Som.tocar('zap');
    Som.falar(f.fala, { atraso: 200 });
  }
  function fecharFoto() { $('#visor').hidden = true; Som.calar(); }

  /* =========================================================
     CINEMINHA — as animações
     Ficam de fora do cache do service worker de propósito: cada
     filminho pesa mais que o app inteiro. Carregam da internet na
     hora de assistir; sem rede, ela vê um aviso em vez de um erro.
     Pra publicar uma animação: jogue o arquivo em video/ e
     acrescente uma linha aqui — o atalho na home aparece sozinho.
     ========================================================= */
  var FILMES = [
    /* { arq:'lara-dancando', capa:'lara-festa', nome:'Dançando', fala:'Lara dançando.' } */
  ];
  var filmeAberto = 0;

  function montarCineminha() {
    var caixa = $('#cineminha');
    if (caixa.childElementCount) return;
    FILMES.forEach(function (f, i) {
      var card = document.createElement('div');
      card.className = 'foto-card filme-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
      });
      card.innerHTML = '<img src="img/' + f.capa + '.webp" alt="' + f.nome + '" loading="lazy">' +
                       '<span class="foto-card__nome">' + f.nome + '</span>';
      card.addEventListener('click', function () { abrirFilme(i); });
      caixa.appendChild(card);
    });
    if (window.ResizeObserver) new ResizeObserver(ajustarGaleria).observe(caixa);
    ajustarGaleria();
  }

  function abrirFilme(i) {
    filmeAberto = (i + FILMES.length) % FILMES.length;
    var f = FILMES[filmeAberto];
    var v = $('#cinema-video');
    var aviso = $('#cinema-aviso');
    var offline = ('onLine' in navigator) && navigator.onLine === false;
    v.hidden = offline; aviso.hidden = !offline;
    if (!offline) { v.src = 'video/' + f.arq + '.mp4'; v.currentTime = 0; }
    $('#cinema-nome').textContent = f.nome;
    $('#cinema-som').dataset.falar = f.fala;
    $('#cinema').hidden = false;
    Som.tocar('zap');
    /* o filminho tem som próprio: a narração calaria por cima */
    if (!offline) { Som.calar(); v.play().catch(function () {}); }
    else Som.falar('Precisa de internet pra ver o filminho.', { atraso: 200 });
  }
  function fecharFilme() {
    var v = $('#cinema-video');
    v.pause(); v.removeAttribute('src'); v.load();
    $('#cinema').hidden = true; Som.calar();
  }

  function abrirFicha(astro) {
    Som.tocar('zap');
    $('#sheet-art').innerHTML = Espaco.orbe(astro, 152);
    $('#sheet-name').textContent = astro.nome;
    $('#sheet-nome-som').dataset.falar = astro.nome;
    $('#sheet-tag').textContent = astro.tag;
    var lista = $('#sheet-facts');
    lista.innerHTML = '';
    astro.fatos.forEach(function (f) {
      var li = document.createElement('li');
      var partes = f.split(' ');
      var emoji = partes.shift();
      var frase = partes.join(' ');
      li.innerHTML = '<b>' + emoji + '</b><span>' + frase + '</span>' +
        '<button class="som-btn som-btn--mini" type="button" aria-label="Ouvir a curiosidade"' +
        ' data-falar="' + frase.replace(/"/g, '') + '"></button>';
      lista.appendChild(li);
    });
    ladoDaFicha = 'a';
    $('#planet-sheet').hidden = false;
    falarFicha(astro);
    fichaAberta = astro;
  }

  var fichaAberta = null;
  var ladoDaFicha = 'a';

  /* Cada astro tem duas artes. Na Terra as duas são de verdade o outro
     lado do planeta; nos demais é outro ângulo e outra luz. */
  function girarFicha() {
    if (!fichaAberta) return;
    var caixa = $('#sheet-art');
    var img = caixa.querySelector('.orbe');
    if (!img) return;
    ladoDaFicha = ladoDaFicha === 'a' ? 'b' : 'a';
    var novo = 'img/planeta-' + fichaAberta.id + (ladoDaFicha === 'b' ? '-b' : '') + '.webp';
    Som.tocar('zap');
    caixa.classList.add('is-trocando');
    setTimeout(function () {
      img.onerror = function () { img.src = 'img/planeta-' + fichaAberta.id + '.webp'; ladoDaFicha = 'a'; };
      img.src = novo;
      caixa.classList.remove('is-trocando');
    }, 280);
  }

  function falarFicha(astro) {
    var texto = astro.nome + '. ' + astro.tag + '. ' +
                astro.fatos.map(function (f) { return f.replace(/^\S+\s/, ''); }).join(' ');
    Som.falar(texto, { atraso: 260 });
  }
  function fecharFicha() {
    $('#planet-sheet').hidden = true;
    Som.calar();
    fichaAberta = null;
  }

  /* =========================================================
     Botões soltos
     ========================================================= */
  function ligarBotoes() {
    /* entrada — o primeiro toque é o que destrava o áudio no iPhone */
    $('#btn-start').addEventListener('click', function () {
      Som.destravar();
      Som.tocar('estrela');
      ir('home');
      Som.falar('Oi Lara! Vamos brincar?', { atraso: 500 });
    });

    /* liga/desliga som */
    var botaoSom = $('#btn-sound');
    function pintarSom() {
      var on = Som.estaLigado();
      $('#sound-icon').textContent = on ? '🎵' : '🔇';
      botaoSom.classList.toggle('is-muted', !on);
    }
    botaoSom.addEventListener('click', function () { Som.alternar(); pintarSom(); });
    pintarSom();

    /* quiz */
    $('#quiz-back').addEventListener('click', function () {
      var tipo = Jogo.tipoAtual();
      ir((tipo === 'corpo' || tipo === 'orgaos') ? 'corpo-menu'
         : tipo === 'espaco' ? 'espaco-menu' : 'home');
    });

    /* jogo da velha */
    $('#velha-denovo').addEventListener('click', function () {
      Velha.reiniciar();
    });
    $('#quiz-speak').addEventListener('click', function () { Jogo.repetirFala(); });

    /* resultado */
    $('#result-again').addEventListener('click', function () {
      var t = Jogo.tipoAtual();
      ir('quiz'); Jogo.iniciar(t);
    });
    $('#result-home').addEventListener('click', function () { ir('home'); });

    /* galeria */
    $$('[data-fecha-visor]').forEach(function (b) { b.addEventListener('click', fecharFoto); });
    $('#visor-antes').addEventListener('click', function () { abrirFoto(fotoAberta - 1); });
    $('#visor-depois').addEventListener('click', function () { abrirFoto(fotoAberta + 1); });
    $$('[data-fecha-cinema]').forEach(function (b) { b.addEventListener('click', fecharFilme); });
    /* o atalho na home só existe se houver o que assistir */
    if (FILMES.length) {
      $('#wrap-cinema').hidden = false;
      $('#wrap-cinema').classList.add('tile-wrap--largo');
      $('#screen-home .menu').classList.add('menu--cinema');
    }

    /* ficha do planeta */
    $$('[data-close-sheet]').forEach(function (b) { b.addEventListener('click', fecharFicha); });
    $('#sheet-speak').addEventListener('click', function () { if (fichaAberta) falarFicha(fichaAberta); });
    $('#sheet-girar').addEventListener('click', girarFicha);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#planet-sheet').hidden) fecharFicha();
      if (e.key === 'Escape' && !$('#visor').hidden) fecharFoto();
      if (e.key === 'Escape' && !$('#cinema').hidden) fecharFilme();
    });

    /* nada de zoom por duplo toque durante a brincadeira */
    document.addEventListener('dblclick', function (e) { e.preventDefault(); }, { passive: false });
  }

  /* =========================================================
     Boot
     ========================================================= */
  /* Se o aparelho não tiver voz em português, o app fica mudo sem avisar.
     Melhor dizer isso ao adulto na tela de abertura do que a Lara achar
     que o alto-falante está quebrado. */
  function conferirVoz() {
    if (!('speechSynthesis' in window)) return mostrarAviso(
      'Este navegador não fala em voz alta. No iPhone, abra pelo Safari.');
    var checar = function () {
      var vozes = speechSynthesis.getVoices() || [];
      if (!vozes.length) return;                       /* ainda carregando */
      var temPt = vozes.some(function (v) { return /^pt/i.test(v.lang || ''); });
      if (!temPt) mostrarAviso('Este aparelho não tem voz em português instalada — ' +
        'o app vai falar com sotaque. Dá pra baixar em Ajustes › Acessibilidade › Conteúdo Falado.');
    };
    checar();
    speechSynthesis.onvoiceschanged = checar;
    setTimeout(checar, 1200);
  }
  function mostrarAviso(texto) {
    var el = $('#aviso-voz');
    if (!el) return;
    el.textContent = texto; el.hidden = false;
  }

  /* O céu em movimento da abertura. Carrega depois do resto e só aparece
     quando de fato começa a tocar: se a rede falhar, ou se o aparelho
     recusar o autoplay, a tela fica com a foto parada de sempre. */
  /* O céu em movimento da abertura.
     Três detalhes que o navegador impõe e que custaram tentativa:
     1) muted precisa estar na PROPRIEDADE, não só no atributo;
     2) vídeo sem faixa de áudio que o navegador julgue invisível é pausado
        pra poupar bateria — por isso o elemento nasce com opacity 1 e não
        com 0 (com 0 ele nem decodifica o primeiro quadro);
     3) play() no mesmo instante em que se define o src é recusado; só
        funciona depois que existe quadro, daí esperar 'loadeddata'.
     Se ainda assim não tocar, o primeiro toque na tela resolve. E se nada
     resolver, fica a foto parada de sempre — que é a mesma paisagem. */
  /* O céu em movimento da abertura.
     O iPhone recusa autoplay em várias situações — economia de energia
     ligada, aba que ainda não pintou, primeiro carregamento — e não avisa
     qual foi. Então em vez de tentar uma vez, tenta a cada sinal de que a
     tela está viva, e desiste quieto se nada funcionar: fica a foto parada,
     que é a mesma paisagem. */
  function ligarCeu() {
    var v = $('#ceu-video');
    if (!v) return;
    v.muted = true; v.defaultMuted = true;      /* na propriedade, não só no atributo */

    var desistiu = false;
    function tentar() {
      if (desistiu || !v.paused) return;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
    ['loadeddata', 'canplay', 'canplaythrough', 'stalled'].forEach(function (e) {
      v.addEventListener(e, tentar);
    });
    v.addEventListener('error', function () { desistiu = true; v.classList.add('falhou'); });
    v.addEventListener('playing', function () {
      document.removeEventListener('pointerdown', tentar, true);
      document.removeEventListener('visibilitychange', aoVoltar);
    });
    function aoVoltar() { if (document.visibilityState === 'visible') tentar(); }
    document.addEventListener('visibilitychange', aoVoltar);
    /* captura: o toque em qualquer lugar serve, inclusive no botão Começar */
    document.addEventListener('pointerdown', tentar, true);

    v.src = 'video/ceu-inicio.mp4';
    tentar();
  }

  function iniciar() {
    pintarFundo('start');           /* a tela de abertura já nasce ativa, sem passar por ir() */
    ligarCeu();
    conferirVoz();
    ligarAltoFalantes();
    ligarNavegacao();
    ligarBotoes();
    Memoria.ligar();
    Jogo.pintarEstrelas();
    atualizarColecao();
    if ('serviceWorker' in navigator) {
      /* se já existia uma versão instalada no aparelho e chega uma nova,
         recarrega uma vez sozinho — ela não precisa fechar e abrir o app */
      var jaTinhaVersao = !!navigator.serviceWorker.controller;
      var jaRecarregou = false;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (!jaTinhaVersao || jaRecarregou) return;
        jaRecarregou = true;
        location.reload();
      });
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () { /* sem offline, tudo bem */ });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', iniciar);

  return { ir: ir, pintarFundo: pintarFundo };
})();
