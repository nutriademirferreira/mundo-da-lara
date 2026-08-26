/* =========================================================
   COMPLETAR PALAVRAS — 10 fases
   Cada fase: um desenho, a palavra em letra bastão com uma
   letra faltando, e 3 letras pra escolher.
   Pra criar fase nova é só acrescentar aqui: nome da palavra,
   a posição da letra que some e as duas letras que confundem.
   ========================================================= */
var Palavras = (function () {

  /* como cada letra é falada em português */
  var FALA = {
    A:'á', B:'bê', C:'cê', D:'dê', E:'é', F:'éfe', G:'gê', H:'agá', I:'i',
    J:'jota', L:'éle', M:'eme', N:'ene', O:'ó', P:'pê', Q:'quê', R:'erre',
    S:'esse', T:'tê', U:'u', V:'vê', X:'xis', Z:'zê'
  };

  function desenhoBola() { return ''+
    '<circle cx="100" cy="104" r="74" fill="#fff"/>'+
    '<path d="M100 104 L100 30 A74 74 0 0 1 174 104 Z" fill="#FF5FA2"/>'+
    '<path d="M100 104 L174 104 A74 74 0 0 1 100 178 Z" fill="#FFC63C"/>'+
    '<path d="M100 104 L100 178 A74 74 0 0 1 26 104 Z" fill="#2ED3A3"/>'+
    '<path d="M100 104 L26 104 A74 74 0 0 1 100 30 Z" fill="#7C4DFF"/>'+
    '<circle cx="100" cy="104" r="21" fill="#fff"/>'+
    '<circle cx="100" cy="104" r="74" fill="none" stroke="#fff" stroke-width="6"/>'+
    '<ellipse cx="74" cy="72" rx="20" ry="12" fill="#fff" opacity=".45" transform="rotate(-35 74 72)"/>'; }

  function desenhoGato() { return ''+
    '<path d="M52 74 L48 24 L92 50 Z" fill="#E8A25C"/><path d="M148 74 L152 24 L108 50 Z" fill="#E8A25C"/>'+
    '<path d="M58 66 L56 38 L82 54 Z" fill="#FF9EC0"/><path d="M142 66 L144 38 L118 54 Z" fill="#FF9EC0"/>'+
    '<ellipse cx="100" cy="112" rx="62" ry="56" fill="#E8A25C"/>'+
    '<path d="M74 66 q10 12 4 24" stroke="#C97F3C" stroke-width="7" fill="none" stroke-linecap="round"/>'+
    '<path d="M100 62 v22" stroke="#C97F3C" stroke-width="7" fill="none" stroke-linecap="round"/>'+
    '<path d="M126 66 q-10 12 -4 24" stroke="#C97F3C" stroke-width="7" fill="none" stroke-linecap="round"/>'+
    '<ellipse cx="78" cy="108" rx="13" ry="15" fill="#fff"/><ellipse cx="122" cy="108" rx="13" ry="15" fill="#fff"/>'+
    '<ellipse cx="78" cy="110" rx="7" ry="11" fill="#3A2A20"/><ellipse cx="122" cy="110" rx="7" ry="11" fill="#3A2A20"/>'+
    '<circle cx="81" cy="105" r="3" fill="#fff"/><circle cx="125" cy="105" r="3" fill="#fff"/>'+
    '<path d="M92 132 L108 132 L100 142 Z" fill="#FF7BAC"/>'+
    '<path d="M100 142 q-9 12 -18 4 M100 142 q9 12 18 4" stroke="#8A5A2B" stroke-width="4.5" fill="none" stroke-linecap="round"/>'+
    '<path d="M40 122 h26 M40 136 h26 M160 122 h-26 M160 136 h-26" stroke="#C97F3C" stroke-width="4" stroke-linecap="round"/>'+
    '<circle cx="60" cy="132" r="10" fill="#FF9EC0" opacity=".45"/><circle cx="140" cy="132" r="10" fill="#FF9EC0" opacity=".45"/>'; }

  function desenhoCasa() { return ''+
    '<path d="M100 26 L182 92 L18 92 Z" fill="#E23C86"/>'+
    '<path d="M100 26 L182 92 L18 92 Z" fill="none" stroke="#B92A6C" stroke-width="5" stroke-linejoin="round"/>'+
    '<rect x="38" y="92" width="124" height="84" rx="6" fill="#FFE9C9"/>'+
    '<rect x="140" y="40" width="20" height="34" rx="4" fill="#B92A6C"/>'+
    '<rect x="84" y="118" width="34" height="58" rx="7" fill="#7C4DFF"/>'+
    '<circle cx="110" cy="148" r="4" fill="#FFC63C"/>'+
    '<rect x="48" y="106" width="28" height="28" rx="5" fill="#9FD8F5" stroke="#fff" stroke-width="4"/>'+
    '<rect x="126" y="106" width="28" height="28" rx="5" fill="#9FD8F5" stroke="#fff" stroke-width="4"/>'+
    '<path d="M28 176 h144" stroke="#2ED3A3" stroke-width="9" stroke-linecap="round"/>'; }

  function desenhoSol() { return ''+
    '<g stroke="#FFB01F" stroke-width="11" stroke-linecap="round">'+
      '<path d="M100 16 v22 M100 172 v22 M16 105 h22 M162 105 h22"/>'+
      '<path d="M42 47 l16 16 M142 163 l16 16 M158 47 l-16 16 M58 163 l-16 16"/>'+
    '</g>'+
    '<circle cx="100" cy="105" r="58" fill="#FFC63C"/>'+
    '<circle cx="100" cy="105" r="58" fill="none" stroke="#FFB01F" stroke-width="5"/>'+
    '<circle cx="80" cy="95" r="7" fill="#7A4A00"/><circle cx="120" cy="95" r="7" fill="#7A4A00"/>'+
    '<path d="M78 122 q22 22 44 0" stroke="#7A4A00" stroke-width="7" fill="none" stroke-linecap="round"/>'+
    '<circle cx="66" cy="116" r="9" fill="#FF9EC0" opacity=".6"/><circle cx="134" cy="116" r="9" fill="#FF9EC0" opacity=".6"/>'; }

  function desenhoPato() { return ''+
    '<ellipse cx="112" cy="128" rx="60" ry="42" fill="#FFD23F"/>'+
    '<circle cx="66" cy="76" r="34" fill="#FFD23F"/>'+
    '<path d="M40 74 q-24 4 -24 12 q0 8 24 10 q10 -10 0 -22 Z" fill="#F58220"/>'+
    '<circle cx="62" cy="68" r="6.5" fill="#3A2A20"/><circle cx="64" cy="65.5" r="2.2" fill="#fff"/>'+
    '<path d="M96 118 q30 -18 56 4 q-24 26 -56 -4 Z" fill="#F5BE1E"/>'+
    '<path d="M166 118 q18 6 8 24" stroke="#F5BE1E" stroke-width="10" fill="none" stroke-linecap="round"/>'+
    '<path d="M96 168 l-8 16 M120 168 l8 16" stroke="#F58220" stroke-width="9" stroke-linecap="round"/>'+
    '<path d="M78 186 h26 M116 186 h26" stroke="#F58220" stroke-width="9" stroke-linecap="round"/>'; }

  function desenhoLua() { return ''+
    '<defs><mask id="mascara-lua">'+
      '<circle cx="100" cy="104" r="78" fill="#fff"/>'+
      '<circle cx="146" cy="82" r="66" fill="#000"/>'+
    '</mask></defs>'+
    '<circle cx="100" cy="104" r="78" fill="#FFD23F" mask="url(#mascara-lua)"/>'+
    '<circle cx="62" cy="84" r="7" fill="#8A5A00"/>'+
    '<path d="M50 116 q16 18 32 0" stroke="#8A5A00" stroke-width="7" fill="none" stroke-linecap="round"/>'+
    '<circle cx="42" cy="108" r="9" fill="#FF9EC0" opacity=".55"/>'+
    '<circle cx="58" cy="52" r="8" fill="#F0B400" opacity=".45"/><circle cx="58" cy="148" r="10" fill="#F0B400" opacity=".4"/>'+
    '<path d="M160 46 l5 12 12 5 -12 5 -5 12 -5 -12 -12 -5 12 -5 Z" fill="#FFF3B0"/>'+
    '<path d="M172 128 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 Z" fill="#FFF3B0"/>'; }

  function desenhoBolo() { return ''+
    '<rect x="88" y="24" width="10" height="30" rx="4" fill="#7C4DFF"/>'+
    '<path d="M93 12 q10 10 0 16 q-10 -6 0 -16 Z" fill="#FF8A00"/>'+
    '<ellipse cx="100" cy="182" rx="82" ry="12" fill="#E6DAFF"/>'+
    '<rect x="34" y="120" width="132" height="56" rx="10" fill="#F0C08A"/>'+
    '<rect x="48" y="76" width="104" height="50" rx="10" fill="#F7D3A6"/>'+
    '<path d="M48 92 q13 14 26 0 q13 14 26 0 q13 14 26 0 q13 14 26 0 v-16 a10 10 0 0 0 -10 -10 h-84 a10 10 0 0 0 -10 10 Z" fill="#FF5FA2"/>'+
    '<path d="M34 136 q16 16 33 0 q16 16 33 0 q16 16 33 0 q16 16 33 0 v-16 h-132 Z" fill="#FF8FBF"/>'+
    '<circle cx="66" cy="112" r="4" fill="#2ED3A3"/><circle cx="104" cy="106" r="4" fill="#7C4DFF"/>'+
    '<circle cx="136" cy="114" r="4" fill="#FFC63C"/><circle cx="56" cy="158" r="4" fill="#7C4DFF"/>'+
    '<circle cx="100" cy="160" r="4" fill="#2ED3A3"/><circle cx="146" cy="156" r="4" fill="#FFC63C"/>'; }

  function desenhoSapo() { return ''+
    '<ellipse cx="100" cy="132" rx="72" ry="52" fill="#4CB85C"/>'+
    '<circle cx="62" cy="76" r="28" fill="#4CB85C"/><circle cx="138" cy="76" r="28" fill="#4CB85C"/>'+
    '<circle cx="62" cy="74" r="18" fill="#fff"/><circle cx="138" cy="74" r="18" fill="#fff"/>'+
    '<circle cx="62" cy="77" r="9" fill="#1E2B1F"/><circle cx="138" cy="77" r="9" fill="#1E2B1F"/>'+
    '<circle cx="66" cy="72" r="3.4" fill="#fff"/><circle cx="142" cy="72" r="3.4" fill="#fff"/>'+
    '<ellipse cx="100" cy="150" rx="56" ry="30" fill="#8FE07A" opacity=".55"/>'+
    '<path d="M56 132 q44 40 88 0" stroke="#1E5B28" stroke-width="8" fill="none" stroke-linecap="round"/>'+
    '<circle cx="52" cy="122" r="10" fill="#FF9EC0" opacity=".5"/><circle cx="148" cy="122" r="10" fill="#FF9EC0" opacity=".5"/>'+
    '<circle cx="82" cy="106" r="5" fill="#2E8B3D"/><circle cx="122" cy="112" r="4" fill="#2E8B3D"/>'+
    '<path d="M40 176 q-14 8 -6 16 M160 176 q14 8 6 16" stroke="#4CB85C" stroke-width="14" fill="none" stroke-linecap="round"/>'; }

  function desenhoFlor() { return ''+
    '<path d="M100 108 v72" stroke="#2ED3A3" stroke-width="10" stroke-linecap="round"/>'+
    '<path d="M100 150 q-34 -6 -40 -30 q30 -6 40 30 Z" fill="#2ED3A3"/>'+
    '<path d="M100 132 q34 -6 40 -30 q-30 -6 -40 30 Z" fill="#37D9A8"/>'+
    '<g fill="#FF5FA2">'+
      '<ellipse cx="100" cy="46" rx="22" ry="28"/><ellipse cx="100" cy="126" rx="22" ry="28"/>'+
      '<ellipse cx="60" cy="86" rx="28" ry="22"/><ellipse cx="140" cy="86" rx="28" ry="22"/>'+
      '<ellipse cx="72" cy="58" rx="22" ry="22"/><ellipse cx="128" cy="58" rx="22" ry="22"/>'+
      '<ellipse cx="72" cy="114" rx="22" ry="22"/><ellipse cx="128" cy="114" rx="22" ry="22"/>'+
    '</g>'+
    '<circle cx="100" cy="86" r="26" fill="#FFC63C"/>'+
    '<circle cx="91" cy="82" r="4" fill="#7A4A00"/><circle cx="109" cy="82" r="4" fill="#7A4A00"/>'+
    '<path d="M89 94 q11 10 22 0" stroke="#7A4A00" stroke-width="5" fill="none" stroke-linecap="round"/>'; }

  function desenhoPeixe() { return ''+
    '<path d="M148 104 L192 70 L192 138 Z" fill="#F58220"/>'+
    '<ellipse cx="92" cy="104" rx="62" ry="44" fill="#FFA33F"/>'+
    '<path d="M84 60 q16 -22 34 -10 q-4 14 -20 20 Z" fill="#F58220"/>'+
    '<path d="M84 148 q16 22 34 10 q-4 -14 -20 -20 Z" fill="#F58220"/>'+
    '<path d="M118 74 q16 30 0 60" stroke="#F58220" stroke-width="6" fill="none" stroke-linecap="round"/>'+
    '<path d="M100 78 q16 26 0 52" stroke="#F58220" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>'+
    '<circle cx="56" cy="94" r="12" fill="#fff"/><circle cx="54" cy="95" r="6" fill="#2B1B54"/>'+
    '<circle cx="56.5" cy="92" r="2.4" fill="#fff"/>'+
    '<path d="M34 118 q12 10 24 2" stroke="#D96A10" stroke-width="5" fill="none" stroke-linecap="round"/>'+
    '<circle cx="26" cy="60" r="7" fill="#9FD8F5"/><circle cx="44" cy="40" r="5" fill="#9FD8F5"/>'+
    '<circle cx="20" cy="40" r="3.5" fill="#9FD8F5"/>'; }

  /* fase = palavra + qual letra some + as duas letras que confundem */
  var FASES = [
    { palavra:'BOLA',  falta:0, erradas:['M','S'], desenho:desenhoBola },
    { palavra:'GATO',  falta:0, erradas:['T','F'], desenho:desenhoGato },
    { palavra:'SOL',   falta:1, erradas:['A','E'], desenho:desenhoSol  },
    { palavra:'LUA',   falta:1, erradas:['I','O'], desenho:desenhoLua  },
    { palavra:'PATO',  falta:0, erradas:['L','N'], desenho:desenhoPato },
    { palavra:'CASA',  falta:2, erradas:['Z','R'], desenho:desenhoCasa },
    { palavra:'BOLO',  falta:2, erradas:['R','V'], desenho:desenhoBolo },
    { palavra:'SAPO',  falta:1, erradas:['E','O'], desenho:desenhoSapo },
    { palavra:'FLOR',  falta:0, erradas:['V','T'], desenho:desenhoFlor },
    { palavra:'PEIXE', falta:3, erradas:['S','C'], desenho:desenhoPeixe }
  ];

  function falaDaLetra(letra) { return FALA[letra] || letra; }

  function figura(fase) {
    return '<svg class="figura" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" ' +
           'role="img" aria-label="' + fase.palavra + '">' + fase.desenho() + '</svg>';
  }

  return { FASES: FASES, figura: figura, falaDaLetra: falaDaLetra };
})();
