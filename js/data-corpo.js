/* =========================================================
   CORPO HUMANO — personagem em SVG + as 10 partes do jogo
   Para acrescentar uma parte nova: desenhe/eleja uma área em
   PARTES_CORPO (o mesmo formato de elipse) e pronto — o quiz,
   o modo aprender e a pontuação se ajustam sozinhos.
   ========================================================= */
var Corpo = (function () {

  /* --- as 10 partes: rótulo, artigo, área de toque e a dica falada --- */
  var PARTES = [
    { id:'cabelo',  nome:'cabelo',  artigo:'o', area:{cx:150,cy:60,rx:66,ry:40},
      dica:'Dá pra fazer trança e maria-chiquinha!' },
    { id:'olho',    nome:'olho',    artigo:'o', area:{cx:128,cy:112,rx:22,ry:22},
      dica:'É com o olho que a gente enxerga tudo.' },
    { id:'orelha',  nome:'orelha',  artigo:'a', area:{cx:88,cy:118,rx:17,ry:23},
      dica:'A orelha serve pra escutar a música.' },
    { id:'nariz',   nome:'nariz',   artigo:'o', area:{cx:150,cy:128,rx:12,ry:13},
      dica:'O nariz cheira o bolo e ajuda a respirar.' },
    { id:'boca',    nome:'boca',    artigo:'a', area:{cx:150,cy:150,rx:27,ry:17},
      dica:'A boca fala, come e dá beijo!' },
    { id:'braco',   nome:'braço',   artigo:'o', area:{cx:93,cy:256,rx:18,ry:31,rot:14},
      dica:'O braço dá o abraço mais gostoso.' },
    { id:'mao',     nome:'mão',     artigo:'a', area:{cx:79,cy:300,rx:26,ry:26},
      dica:'Com a mão a gente desenha e brinca.' },
    { id:'barriga', nome:'barriga', artigo:'a', area:{cx:150,cy:262,rx:45,ry:38},
      dica:'É na barriga que a comida vira energia.' },
    { id:'perna',   nome:'perna',   artigo:'a', area:{cx:126,cy:358,rx:22,ry:38},
      dica:'As pernas correm, pulam e dançam.' },
    { id:'pe',      nome:'pé',      artigo:'o', area:{cx:120,cy:414,rx:34,ry:23},
      dica:'Os pés levam a Lara pra todo lugar.' }
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
      '<ellipse cx="150" cy="452" rx="96" ry="13" fill="#2B1B54" opacity=".10"/>' +

      /* cabelo de trás */
      '<path d="M72 214 C58 122 88 24 150 24 C212 24 242 122 228 214 C225 229 206 227 204 210 ' +
              'C200 170 196 142 190 122 L110 122 C104 142 100 170 96 210 C94 227 75 229 72 214 Z" fill="#6B3E26"/>' +

      /* rosto */
      '<ellipse cx="88" cy="118" rx="12" ry="17" fill="#FFD3B4"/>' +
      '<ellipse cx="212" cy="118" rx="12" ry="17" fill="#FFD3B4"/>' +
      '<path d="M84 116 q6 4 2 10" stroke="#E8A87F" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M216 116 q-6 4 -2 10" stroke="#E8A87F" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<rect x="136" y="150" width="28" height="50" rx="12" fill="#F0BC9C"/>' +
      '<ellipse cx="150" cy="112" rx="60" ry="64" fill="#FFD9BE"/>' +

      /* franja + laço */
      '<path d="M90 106 C88 52 118 28 150 28 C186 28 212 52 210 106 C199 70 178 58 152 66 C126 74 103 78 90 106 Z" fill="#6B3E26"/>' +
      '<path d="M96 96 C104 62 128 46 150 46" stroke="#875030" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>' +
      '<g transform="translate(206 54) rotate(16)">' +
        '<path d="M0 0 L-22 -12 L-22 12 Z" fill="#FF5FA2"/><path d="M0 0 L22 -12 L22 12 Z" fill="#FF5FA2"/>' +
        '<circle cx="0" cy="0" r="7" fill="#FFC63C"/></g>' +

      /* sobrancelhas + olhos */
      '<path d="M114 90 Q128 81 143 89" stroke="#6B3E26" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M157 89 Q172 81 186 90" stroke="#6B3E26" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="128" cy="113" rx="13" ry="15" fill="#fff"/>' +
      '<ellipse cx="172" cy="113" rx="13" ry="15" fill="#fff"/>' +
      '<circle cx="128" cy="115" r="8" fill="#3A2A20"/><circle cx="172" cy="115" r="8" fill="#3A2A20"/>' +
      '<circle cx="131.5" cy="111" r="2.8" fill="#fff"/><circle cx="175.5" cy="111" r="2.8" fill="#fff"/>' +
      '<path d="M115 104 q13 -9 26 -1" stroke="#3A2A20" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M159 103 q13 -8 26 1" stroke="#3A2A20" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +

      /* bochechas, nariz e boca */
      '<circle cx="110" cy="138" r="11" fill="#FF9EC0" opacity=".5"/>' +
      '<circle cx="190" cy="138" r="11" fill="#FF9EC0" opacity=".5"/>' +
      '<path d="M150 118 C157 128 156 134 148 134" stroke="#E8996F" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M130 145 Q150 173 170 145 Q150 155 130 145 Z" fill="#C94A6E"/>' +
      '<path d="M141 158 q9 8 18 0" fill="#FF8FA9"/>' +

      /* pescoço e vestido */
      '<path d="M110 196 C120 187 180 187 190 196 L214 300 C218 313 208 319 196 319 L104 319 ' +
              'C92 319 82 313 86 300 Z" fill="url(#vestido-' + sufixo + ')"/>' +
      '<path d="M124 194 Q150 214 176 194" stroke="#fff" stroke-width="5" fill="none" opacity=".55" stroke-linecap="round"/>' +
      '<path d="M150 242 c-9 -12 -25 -4 -18 8 c4 8 14 14 18 18 c4 -4 14 -10 18 -18 c7 -12 -9 -20 -18 -8 Z" fill="#fff" opacity=".8"/>' +
      '<path d="M88 305 h124" stroke="#fff" stroke-width="7" opacity=".35" stroke-linecap="round"/>' +

      /* braços e mãos */
      '<path d="M112 206 C96 234 88 268 82 292" stroke="#FFD9BE" stroke-width="23" fill="none" stroke-linecap="round"/>' +
      '<path d="M188 206 C204 234 212 268 218 292" stroke="#FFD9BE" stroke-width="23" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="112" cy="210" rx="22" ry="19" fill="#FF9CC8"/>' +
      '<ellipse cx="188" cy="210" rx="22" ry="19" fill="#FF9CC8"/>' +
      '<circle cx="79" cy="300" r="18" fill="#FFD9BE"/><circle cx="221" cy="300" r="18" fill="#FFD9BE"/>' +

      /* pernas, meias e sapatos */
      '<path d="M128 316 L123 392" stroke="#FFD9BE" stroke-width="27" fill="none" stroke-linecap="round"/>' +
      '<path d="M172 316 L177 392" stroke="#FFD9BE" stroke-width="27" fill="none" stroke-linecap="round"/>' +
      '<path d="M124 386 L122 396" stroke="#fff" stroke-width="27" fill="none" stroke-linecap="butt"/>' +
      '<path d="M176 386 L178 396" stroke="#fff" stroke-width="27" fill="none" stroke-linecap="butt"/>' +
      '<ellipse cx="120" cy="414" rx="29" ry="18" fill="#7C4DFF"/>' +
      '<ellipse cx="180" cy="414" rx="29" ry="18" fill="#7C4DFF"/>' +
      '<path d="M104 412 h32" stroke="#fff" stroke-width="5" opacity=".7" stroke-linecap="round"/>' +
      '<path d="M164 412 h32" stroke="#fff" stroke-width="5" opacity=".7" stroke-linecap="round"/>' +

      '</g>' +

      /* holofote: a mesma arte, recortada só na parte sorteada */
      '<use class="foco" href="#art-' + sufixo + '" xlink:href="#art-' + sufixo + '" clip-path="url(#foco-' + sufixo + ')"/>' +
      '<g class="hits">' + hits + '</g>' +
      '<text class="qmark" x="-500" y="-500">?</text>' +
    '</svg>';
  }

  function porId(id) {
    for (var i = 0; i < PARTES.length; i++) if (PARTES[i].id === id) return PARTES[i];
    return null;
  }

  return { PARTES: PARTES, desenho: desenho, porId: porId };
})();
