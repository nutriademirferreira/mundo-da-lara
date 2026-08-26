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

  /* --- os 10 órgãos: mesma mecânica, só que por dentro --- */
  var ORGAOS = [
    { id:'cerebro',   nome:'cérebro',   artigo:'o', area:{cx:150,cy:64,rx:34,ry:28},
      dica:'O cérebro pensa, sonha e manda em todo o corpo.' },
    { id:'pulmao',    nome:'pulmão',    artigo:'o', area:{cx:124,cy:188,rx:21,ry:32},
      dica:'Os pulmões enchem de ar quando a gente respira.' },
    { id:'coracao',   nome:'coração',   artigo:'o', area:{cx:156,cy:194,rx:22,ry:22},
      dica:'O coração bate e empurra o sangue pro corpo todo.' },
    { id:'figado',    nome:'fígado',    artigo:'o', area:{cx:128,cy:222,rx:28,ry:20},
      dica:'O fígado limpa o sangue e guarda energia.' },
    { id:'estomago',  nome:'estômago',  artigo:'o', area:{cx:178,cy:224,rx:18,ry:22},
      dica:'No estômago a comida vira um mingauzinho.' },
    { id:'baco',      nome:'baço',      artigo:'o', area:{cx:189,cy:238,rx:13,ry:13},
      dica:'O baço ajuda a defender o corpo dos micróbios.' },
    { id:'pancreas',  nome:'pâncreas',  artigo:'o', area:{cx:152,cy:252,rx:34,ry:11},
      dica:'O pâncreas ajuda a digerir e cuida do açúcar do sangue.' },
    { id:'rim',       nome:'rim',       artigo:'o', area:{cx:122,cy:270,rx:15,ry:18},
      dica:'Os rins limpam o sangue e fazem o xixi.' },
    { id:'intestino', nome:'intestino', artigo:'o', area:{cx:150,cy:306,rx:42,ry:28},
      dica:'No intestino o corpo pega as vitaminas da comida.' },
    { id:'bexiga',    nome:'bexiga',    artigo:'a', area:{cx:150,cy:342,rx:19,ry:15},
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
      '<ellipse cx="150" cy="452" rx="90" ry="12" fill="#2B1B54" opacity=".08"/>' +

      /* silhueta translúcida */
      '<g fill="#FFD9BE" opacity=".55">' +
        '<ellipse cx="150" cy="78" rx="46" ry="50"/>' +
        '<rect x="134" y="112" width="32" height="30" rx="12"/>' +
        '<path d="M104 134 C110 126 190 126 196 134 L204 296 C208 340 194 362 150 362 ' +
                'C106 362 92 340 96 296 Z"/>' +
        '<path d="M112 146 C92 180 84 246 80 300" stroke="#FFD9BE" stroke-width="26" fill="none" stroke-linecap="round"/>' +
        '<path d="M188 146 C208 180 216 246 220 300" stroke="#FFD9BE" stroke-width="26" fill="none" stroke-linecap="round"/>' +
        '<path d="M128 360 L124 444" stroke="#FFD9BE" stroke-width="30" fill="none" stroke-linecap="round"/>' +
        '<path d="M172 360 L176 444" stroke="#FFD9BE" stroke-width="30" fill="none" stroke-linecap="round"/>' +
      '</g>' +
      '<g fill="none" stroke="#E8A87F" stroke-width="3" opacity=".65">' +
        '<ellipse cx="150" cy="78" rx="46" ry="50"/>' +
        '<path d="M104 134 C110 126 190 126 196 134 L204 296 C208 340 194 362 150 362 ' +
                'C106 362 92 340 96 296 Z"/>' +
      '</g>' +

      /* pulmões */
      '<path d="M140 156 C118 158 104 182 107 204 C110 222 128 228 138 216 C144 208 143 176 140 156 Z" fill="#F0919F"/>' +
      '<path d="M160 156 C182 158 196 182 193 204 C190 222 172 228 162 216 C156 208 157 176 160 156 Z" fill="#F0919F"/>' +
      '<g stroke="#D96C7D" stroke-width="3" fill="none" opacity=".8">' +
        '<path d="M128 172 v40 M120 186 h14 M172 172 v40 M166 186 h14"/></g>' +

      /* coração */
      '<path d="M157 176 c-10 -15 -31 -7 -31 10 c0 15 19 26 31 36 c12 -10 31 -21 31 -36 c0 -17 -21 -25 -31 -10 Z" fill="#E23B4E"/>' +
      '<path d="M148 190 q8 6 14 -2" stroke="#fff" stroke-width="4" fill="none" opacity=".45" stroke-linecap="round"/>' +

      /* fígado e estômago */
      '<path d="M102 208 C108 200 150 200 157 212 C161 221 148 236 128 240 C110 243 101 231 102 208 Z" fill="#A85434"/>' +
      '<path d="M130 214 C140 210 150 212 155 216" stroke="#8C4028" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M170 206 C188 200 198 216 194 232 C190 246 174 252 167 243 C161 234 170 228 168 219 C167 212 166 208 170 206 Z" fill="#E8A05C"/>' +

      /* baço */
      '<path d="M184 228 c9 -3 14 6 12 15 c-2 9 -11 12 -15 5 c-4 -7 -3 -18 3 -20 Z" fill="#8E4A6B"/>' +

      /* pâncreas */
      '<path d="M120 250 C142 241 172 243 187 250 C191 257 180 261 164 259 C144 256 128 261 120 257 Z" fill="#E8C35C"/>' +

      /* rins */
      '<path d="M116 256 c11 -5 18 4 18 15 c0 11 -7 18 -16 15 c-9 -3 -11 -26 -2 -30 Z" fill="#B4543F"/>' +
      '<path d="M184 256 c-11 -5 -18 4 -18 15 c0 11 7 18 16 15 c9 -3 11 -26 2 -30 Z" fill="#B4543F"/>' +

      /* intestino */
      '<path d="M118 284 h62 a11 11 0 0 1 0 22 h-58 a11 11 0 0 0 0 22 h50" ' +
              'stroke="#E8905C" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M118 284 h62 a11 11 0 0 1 0 22 h-58 a11 11 0 0 0 0 22 h50" ' +
              'stroke="#F5B58A" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +

      /* bexiga */
      '<path d="M134 334 c2 -9 30 -9 32 0 c2 11 -5 20 -16 20 c-11 0 -18 -9 -16 -20 Z" fill="#F0C24A"/>' +

      /* cérebro */
      '<ellipse cx="150" cy="64" rx="32" ry="26" fill="#F2A0B5"/>' +
      '<g stroke="#D3728C" stroke-width="3.4" fill="none" stroke-linecap="round">' +
        '<path d="M150 40 v48"/><path d="M132 46 q10 8 0 16 q-10 8 0 16"/><path d="M168 46 q-10 8 0 16 q10 8 0 16"/>' +
      '</g>' +
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
