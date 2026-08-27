/* =========================================================
   CORPO HUMANO — personagem em SVG + as 10 partes do jogo
   Para acrescentar uma parte nova: desenhe/eleja uma área em
   PARTES_CORPO (o mesmo formato de elipse) e pronto — o quiz,
   o modo aprender e a pontuação se ajustam sozinhos.
   ========================================================= */
var Corpo = (function () {

  /* --- as 10 partes: rótulo, artigo, área de toque e a dica falada --- */
  var PARTES = [
    { id:'cabelo',  nome:'cabelo',  artigo:'o', area:{cx:150,cy:38,rx:66,ry:24},
      dica:'Dá pra fazer trança e maria-chiquinha!' },
    { id:'olho',    nome:'olho',    artigo:'o', area:{cx:120,cy:100,rx:15,ry:14},
      dica:'É com o olho que a gente enxerga tudo.' },
    { id:'orelha',  nome:'orelha',  artigo:'a', area:{cx:104,cy:121,rx:8,ry:15},
      dica:'A orelha serve pra escutar a música.' },
    { id:'nariz',   nome:'nariz',   artigo:'o', area:{cx:146,cy:114,rx:10,ry:8},
      dica:'O nariz cheira o bolo e ajuda a respirar.' },
    { id:'boca',    nome:'boca',    artigo:'a', area:{cx:141,cy:128,rx:21,ry:10},
      dica:'A boca fala, come e dá beijo!' },
    { id:'braco',   nome:'braço',   artigo:'o', area:{cx:88,cy:222,rx:9,ry:29,rot:-32},
      dica:'O braço dá o abraço mais gostoso.' },
    { id:'mao',     nome:'mão',     artigo:'a', area:{cx:53,cy:259,rx:21,ry:18},
      dica:'Com a mão a gente desenha e brinca.' },
    { id:'barriga', nome:'barriga', artigo:'a', area:{cx:150,cy:222,rx:40,ry:26},
      dica:'É na barriga que a comida vira energia.' },
    { id:'perna',   nome:'perna',   artigo:'a', area:{cx:132,cy:355,rx:18,ry:38},
      dica:'As pernas correm, pulam e dançam.' },
    { id:'pe',      nome:'pé',      artigo:'o', area:{cx:120,cy:417,rx:28,ry:20},
      dica:'Os pés levam a Lara pra todo lugar.' }
  ];

  /* --- os 10 órgãos: mesma mecânica, só que por dentro --- */
  var ORGAOS = [
    { id:'cerebro',   nome:'cérebro',   artigo:'o', area:{cx:149,cy:47,rx:33,ry:21},
      dica:'O cérebro pensa, sonha e manda em todo o corpo.' },
    { id:'pulmao',    nome:'pulmão',    artigo:'o', area:{cx:130,cy:182,rx:19,ry:26},
      dica:'Os pulmões enchem de ar quando a gente respira.' },
    { id:'coracao',   nome:'coração',   artigo:'o', area:{cx:157,cy:186,rx:15,ry:15},
      dica:'O coração bate e empurra o sangue pro corpo todo.' },
    { id:'figado',    nome:'fígado',    artigo:'o', area:{cx:131,cy:220,rx:21,ry:15},
      dica:'O fígado limpa o sangue e guarda energia.' },
    { id:'estomago',  nome:'estômago',  artigo:'o', area:{cx:163,cy:222,rx:14,ry:17},
      dica:'No estômago a comida vira um mingauzinho.' },
    { id:'baco',      nome:'baço',      artigo:'o', area:{cx:183,cy:223,rx:8,ry:14},
      dica:'O baço ajuda a defender o corpo dos micróbios.' },
    { id:'pancreas',  nome:'pâncreas',  artigo:'o', area:{cx:161,cy:238,rx:21,ry:8},
      dica:'O pâncreas ajuda a digerir e cuida do açúcar do sangue.' },
    { id:'rim',       nome:'rim',       artigo:'o', area:{cx:125,cy:244,rx:12,ry:12},
      dica:'Os rins limpam o sangue e fazem o xixi.' },
    { id:'intestino', nome:'intestino', artigo:'o', area:{cx:151,cy:269,rx:33,ry:20},
      dica:'No intestino o corpo pega as vitaminas da comida.' },
    { id:'bexiga',    nome:'bexiga',    artigo:'a', area:{cx:152,cy:297,rx:13,ry:10},
      dica:'A bexiga guarda o xixi até a hora do banheiro.' }
  ];

  function areaSvg(p, classe, id) {
    var a = p.area;
    var rot = a.rot ? ' transform="rotate(' + a.rot + ' ' + a.cx + ' ' + a.cy + ')"' : '';
    return '<ellipse ' + (id ? 'id="' + id + '" ' : '') + 'class="' + classe + '" data-parte="' + p.id +
           '" cx="' + a.cx + '" cy="' + a.cy + '" rx="' + a.rx + '" ry="' + a.ry + '"' + rot + '/>';
  }

  /* --- a Lara desenhada --- */
  function desenho(sufixo) {
    var hits = PARTES.map(function (p) { return areaSvg(p, 'hit'); }).join('');

    return '' +
    '<svg class="kid-svg" viewBox="0 0 300 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Boneca Lara">' +
      '<defs>' +
        '<linearGradient id="vestido-' + sufixo + '" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#FF9CC8"/><stop offset="1" stop-color="#F0417F"/></linearGradient>' +
        '<clipPath id="foco-' + sufixo + '">' +
          '<ellipse class="spot-hole" cx="-500" cy="-500" rx="0" ry="0"/></clipPath>' +
      '</defs>' +

      '<g class="art" id="art-' + sufixo + '">' +
      '<ellipse cx="150" cy="455" rx="84" ry="12" fill="#2B1B54" opacity=".10"/>' +
      '<image href="img/corpo-fora.webp" x="31" y="6" width="238" height="440"/>' +
      '</g>' +

      '<use class="foco" href="#art-' + sufixo + '" xlink:href="#art-' + sufixo + '" clip-path="url(#foco-' + sufixo + ')"/>' +
      '<g class="hits">' + hits + '</g>' +
      '<text class="qmark" x="-500" y="-500">?</text>' +
    '</svg>';
  }

  /* --- o mesmo corpo, agora visto por dentro --- */
  function desenhoOrgaos(sufixo) {
    var hits = ORGAOS.map(function (p) { return areaSvg(p, 'hit'); }).join('');

    return '' +
    '<svg class="kid-svg" viewBox="0 0 300 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Corpo por dentro">' +
      '<defs>' +
        '<clipPath id="foco-' + sufixo + '">' +
          '<ellipse class="spot-hole" cx="-500" cy="-500" rx="0" ry="0"/></clipPath>' +
      '</defs>' +

      '<g class="art" id="art-' + sufixo + '">' +
      '<ellipse cx="150" cy="455" rx="80" ry="12" fill="#2B1B54" opacity=".10"/>' +
      '<image href="img/corpo-dentro.webp" x="27" y="6" width="247" height="440"/>' +
      '</g>' +

      '<use class="foco" href="#art-' + sufixo + '" xlink:href="#art-' + sufixo + '" clip-path="url(#foco-' + sufixo + ')"/>' +
      '<g class="hits">' + hits + '</g>' +
      '<text class="qmark" x="-500" y="-500">?</text>' +
    '</svg>';
  }

  function lista(tipo) { return tipo === 'orgaos' ? ORGAOS : PARTES; }
  function arte(tipo, sufixo) { return tipo === 'orgaos' ? desenhoOrgaos(sufixo) : desenho(sufixo); }

  function porId(id, tipo) {
    var alvo = lista(tipo);
    for (var i = 0; i < alvo.length; i++) if (alvo[i].id === id) return alvo[i];
    return null;
  }

  return {
    PARTES: PARTES, ORGAOS: ORGAOS,
    desenho: desenho, desenhoOrgaos: desenhoOrgaos,
    lista: lista, arte: arte, porId: porId
  };
})();
