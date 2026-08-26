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


  function desenhoOvo() { return ''+
    '<path d="M64 56 q-32 18 -22 50 q-28 22 -4 48 q16 18 46 12 q30 20 56 -6 q26 -22 6 -48 '+
            'q10 -32 -26 -40 q-30 -22 -56 -16 Z" fill="#FFFDF6"/>'+
    '<circle cx="98" cy="106" r="31" fill="#FFC63C"/>'+
    '<circle cx="88" cy="96" r="10" fill="#FFE486"/>'; }

  function desenhoUva() { return ''+
    '<path d="M100 48 q6 14 2 24" stroke="#8A5A2B" stroke-width="7" fill="none" stroke-linecap="round"/>'+
    '<path d="M104 52 q26 -18 44 -2 q-16 20 -44 2 Z" fill="#4CB85C"/>'+
    '<g fill="#8E4A9E">'+
      '<circle cx="100" cy="80" r="20"/><circle cx="76" cy="104" r="20"/><circle cx="124" cy="104" r="20"/>'+
      '<circle cx="56" cy="128" r="20"/><circle cx="100" cy="128" r="20"/><circle cx="144" cy="128" r="20"/>'+
      '<circle cx="76" cy="152" r="20"/><circle cx="124" cy="152" r="20"/><circle cx="100" cy="174" r="19"/>'+
    '</g>'+
    '<g fill="#B172C4" opacity=".8">'+
      '<circle cx="94" cy="74" r="6"/><circle cx="70" cy="98" r="6"/><circle cx="118" cy="98" r="6"/>'+
      '<circle cx="50" cy="122" r="6"/><circle cx="94" cy="122" r="6"/><circle cx="138" cy="122" r="6"/>'+
    '</g>'; }

  function desenhoPera() { return ''+
    '<path d="M100 46 q4 12 0 20" stroke="#8A5A2B" stroke-width="7" fill="none" stroke-linecap="round"/>'+
    '<path d="M104 54 q24 -14 38 0 q-14 18 -38 0 Z" fill="#4CB85C"/>'+
    '<circle cx="100" cy="90" r="30" fill="#B8DC4A"/>'+
    '<circle cx="100" cy="134" r="46" fill="#B8DC4A"/>'+
    '<rect x="70" y="86" width="60" height="46" fill="#B8DC4A"/>'+
    '<ellipse cx="80" cy="118" rx="14" ry="20" fill="#D2EC86" opacity=".8" transform="rotate(-18 80 118)"/>'+
    '<circle cx="122" cy="150" r="4" fill="#9BC22E"/><circle cx="88" cy="162" r="4" fill="#9BC22E"/>'; }

  function desenhoBanana() { return ''+
    '<path d="M48 50 C44 122 92 168 154 170 C164 170 168 160 160 154 C104 148 72 108 70 52 '+
            'C68 42 50 40 48 50 Z" fill="#FFD23F"/>'+
    '<path d="M60 62 C64 118 100 150 148 158" stroke="#F5BE1E" stroke-width="7" fill="none" stroke-linecap="round"/>'+
    '<path d="M48 50 q10 -12 22 2" stroke="#8A5A2B" stroke-width="9" fill="none" stroke-linecap="round"/>'+
    '<circle cx="160" cy="162" r="7" fill="#8A5A2B"/>'; }

  function desenhoSuco() { return ''+
    '<path d="M64 52 L136 52 L126 168 Q100 180 74 168 Z" fill="#E8F4FB"/>'+
    '<path d="M70 84 L130 84 L126 168 Q100 180 74 168 Z" fill="#FF9A1F"/>'+
    '<path d="M70 84 L130 84 L129 96 L71 96 Z" fill="#FFB55C"/>'+
    '<rect x="118" y="24" width="12" height="52" rx="6" fill="#FF5FA2" transform="rotate(14 124 50)"/>'+
    '<circle cx="146" cy="70" r="20" fill="#FFC63C"/>'+
    '<path d="M146 50 v40 M126 70 h40" stroke="#FF9A1F" stroke-width="4"/>'+
    '<ellipse cx="82" cy="120" rx="7" ry="26" fill="#fff" opacity=".35"/>'; }

  function desenhoPizza() { return ''+
    '<circle cx="100" cy="104" r="72" fill="#E8A85C"/>'+
    '<circle cx="100" cy="104" r="60" fill="#E2503C"/>'+
    '<g fill="#FFD98A">'+
      '<ellipse cx="76" cy="80" rx="18" ry="12" transform="rotate(-20 76 80)"/>'+
      '<ellipse cx="128" cy="92" rx="16" ry="11" transform="rotate(15 128 92)"/>'+
      '<ellipse cx="92" cy="136" rx="20" ry="12" transform="rotate(10 92 136)"/>'+
    '</g>'+
    '<g fill="#B22B3A">'+
      '<circle cx="72" cy="112" r="11"/><circle cx="118" cy="66" r="10"/>'+
      '<circle cx="134" cy="130" r="11"/><circle cx="98" cy="98" r="9"/>'+
    '</g>'+
    '<g fill="#4CB85C"><circle cx="60" cy="90" r="5"/><circle cx="112" cy="142" r="5"/><circle cx="140" cy="94" r="5"/></g>'; }

  function desenhoPipoca() { return ''+
    '<g fill="#FFF6E0">'+
      '<circle cx="70" cy="66" r="18"/><circle cx="100" cy="52" r="20"/><circle cx="132" cy="68" r="18"/>'+
      '<circle cx="84" cy="84" r="16"/><circle cx="118" cy="86" r="16"/><circle cx="52" cy="88" r="13"/>'+
      '<circle cx="150" cy="90" r="12"/>'+
    '</g>'+
    '<g fill="#FFE9B8" opacity=".9">'+
      '<circle cx="96" cy="48" r="7"/><circle cx="66" cy="62" r="6"/><circle cx="128" cy="64" r="6"/>'+
    '</g>'+
    '<path d="M50 96 L150 96 L136 178 L64 178 Z" fill="#E23C86"/>'+
    '<path d="M64 96 L60 178 L76 178 L78 96 Z M92 96 L92 178 L108 178 L108 96 Z '+
            'M122 96 L124 178 L140 178 L136 96 Z" fill="#fff" opacity=".85"/>'; }

  function desenhoVaca() { return ''+
    '<path d="M40 74 q-18 -14 -6 -26 q14 -8 22 12 Z" fill="#D8C6A8"/>'+
    '<path d="M160 74 q18 -14 6 -26 q-14 -8 -22 12 Z" fill="#D8C6A8"/>'+
    '<ellipse cx="46" cy="96" rx="18" ry="12" fill="#fff" stroke="#D8CBB8" stroke-width="3" transform="rotate(-20 46 96)"/>'+
    '<ellipse cx="154" cy="96" rx="18" ry="12" fill="#fff" stroke="#D8CBB8" stroke-width="3" transform="rotate(20 154 96)"/>'+
    '<ellipse cx="100" cy="108" rx="58" ry="54" fill="#fff" stroke="#D8CBB8" stroke-width="3"/>'+
    '<path d="M62 70 q22 -12 34 6 q-20 16 -34 -6 Z" fill="#3A2A20"/>'+
    '<circle cx="138" cy="86" r="13" fill="#3A2A20"/>'+
    '<circle cx="80" cy="104" r="8" fill="#3A2A20"/><circle cx="120" cy="104" r="8" fill="#3A2A20"/>'+
    '<circle cx="83" cy="101" r="3" fill="#fff"/><circle cx="123" cy="101" r="3" fill="#fff"/>'+
    '<ellipse cx="100" cy="140" rx="34" ry="24" fill="#FFB6CE"/>'+
    '<ellipse cx="88" cy="136" rx="5" ry="7" fill="#E0819F"/><ellipse cx="112" cy="136" rx="5" ry="7" fill="#E0819F"/>'+
    '<path d="M84 152 q16 10 32 0" stroke="#E0819F" stroke-width="4" fill="none" stroke-linecap="round"/>'; }

  function desenhoPorco() { return ''+
    '<path d="M52 66 q-8 -26 12 -28 q18 -2 20 24 Z" fill="#FF9EC0"/>'+
    '<path d="M148 66 q8 -26 -12 -28 q-18 -2 -20 24 Z" fill="#FF9EC0"/>'+
    '<circle cx="100" cy="110" r="58" fill="#FF9EC0"/>'+
    '<circle cx="78" cy="98" r="9" fill="#5A2B3E"/><circle cx="122" cy="98" r="9" fill="#5A2B3E"/>'+
    '<circle cx="81" cy="94" r="3.4" fill="#fff"/><circle cx="125" cy="94" r="3.4" fill="#fff"/>'+
    '<ellipse cx="100" cy="134" rx="30" ry="24" fill="#FF7BAC"/>'+
    '<ellipse cx="90" cy="134" rx="6" ry="9" fill="#C4436A"/><ellipse cx="110" cy="134" rx="6" ry="9" fill="#C4436A"/>'+
    '<circle cx="58" cy="124" r="10" fill="#FF7BAC" opacity=".6"/><circle cx="142" cy="124" r="10" fill="#FF7BAC" opacity=".6"/>'; }

  function desenhoRato() { return ''+
    '<path d="M158 120 q34 6 30 32 q-4 20 -26 16" stroke="#C4B8B0" stroke-width="8" fill="none" stroke-linecap="round"/>'+
    '<circle cx="52" cy="70" r="30" fill="#B6A9A0"/><circle cx="148" cy="70" r="30" fill="#B6A9A0"/>'+
    '<circle cx="52" cy="70" r="18" fill="#FFB6CE"/><circle cx="148" cy="70" r="18" fill="#FFB6CE"/>'+
    '<ellipse cx="100" cy="114" rx="54" ry="48" fill="#C4B8B0"/>'+
    '<circle cx="82" cy="106" r="8" fill="#3A2A20"/><circle cx="118" cy="106" r="8" fill="#3A2A20"/>'+
    '<circle cx="85" cy="103" r="3" fill="#fff"/><circle cx="121" cy="103" r="3" fill="#fff"/>'+
    '<ellipse cx="100" cy="132" rx="9" ry="7" fill="#FF7BAC"/>'+
    '<path d="M100 139 q-8 10 -16 4 M100 139 q8 10 16 4" stroke="#6B5B52" stroke-width="4" fill="none" stroke-linecap="round"/>'+
    '<path d="M46 128 h26 M46 140 h26 M154 128 h-26 M154 140 h-26" stroke="#8E8078" stroke-width="3.5" stroke-linecap="round"/>'; }

  function desenhoUrso() { return ''+
    '<circle cx="52" cy="60" r="26" fill="#A0724A"/><circle cx="148" cy="60" r="26" fill="#A0724A"/>'+
    '<circle cx="52" cy="60" r="14" fill="#C99A6E"/><circle cx="148" cy="60" r="14" fill="#C99A6E"/>'+
    '<circle cx="100" cy="112" r="58" fill="#A0724A"/>'+
    '<circle cx="80" cy="100" r="8" fill="#3A2A20"/><circle cx="120" cy="100" r="8" fill="#3A2A20"/>'+
    '<circle cx="83" cy="97" r="3" fill="#fff"/><circle cx="123" cy="97" r="3" fill="#fff"/>'+
    '<ellipse cx="100" cy="136" rx="30" ry="24" fill="#E3C29B"/>'+
    '<ellipse cx="100" cy="126" rx="11" ry="8" fill="#3A2A20"/>'+
    '<path d="M100 134 v8 M100 142 q-10 8 -18 0 M100 142 q10 8 18 0" stroke="#6B4A2E" stroke-width="4" fill="none" stroke-linecap="round"/>'; }

  function desenhoGalo() { return ''+
    '<path d="M150 126 q34 -22 44 4 q-26 -6 -40 12 Z" fill="#E23C86"/>'+
    '<path d="M152 118 q40 -34 42 -2 q-28 -12 -42 12 Z" fill="#F58220"/>'+
    '<ellipse cx="106" cy="126" rx="48" ry="42" fill="#E8A25C"/>'+
    '<circle cx="76" cy="76" r="30" fill="#E8A25C"/>'+
    '<path d="M60 50 q4 -18 16 -8 q6 -16 16 -2 q10 -8 12 8 q-22 6 -44 2 Z" fill="#E2503C"/>'+
    '<path d="M50 62 q-24 4 -22 12 q2 8 22 8 Z" fill="#FFC63C"/>'+
    '<path d="M70 96 q-6 18 6 18 q10 0 6 -18 Z" fill="#E2503C"/>'+
    '<circle cx="72" cy="70" r="6.5" fill="#3A2A20"/><circle cx="74" cy="67.5" r="2.2" fill="#fff"/>'+
    '<path d="M96 166 v14 M120 166 v14 M84 182 h24 M108 182 h24" stroke="#F58220" stroke-width="7" stroke-linecap="round"/>'+
    '<path d="M84 118 q30 -14 50 6 q-24 24 -50 -6 Z" fill="#D2894A"/>'; }

  function desenhoAbelha() { return ''+
    '<ellipse cx="72" cy="66" rx="26" ry="18" fill="#DCEEF8" opacity=".9" transform="rotate(-28 72 66)"/>'+
    '<ellipse cx="128" cy="66" rx="26" ry="18" fill="#DCEEF8" opacity=".9" transform="rotate(28 128 66)"/>'+
    '<ellipse cx="100" cy="118" rx="46" ry="52" fill="#FFC63C"/>'+
    '<path d="M62 100 h76 M58 124 h84 M66 148 h68" stroke="#3A2A20" stroke-width="13" stroke-linecap="round"/>'+
    '<path d="M100 170 q-8 16 0 22 q8 -6 0 -22 Z" fill="#3A2A20"/>'+
    '<circle cx="100" cy="66" r="30" fill="#3A2A20"/>'+
    '<circle cx="88" cy="62" r="8" fill="#fff"/><circle cx="112" cy="62" r="8" fill="#fff"/>'+
    '<circle cx="89" cy="63" r="4" fill="#3A2A20"/><circle cx="113" cy="63" r="4" fill="#3A2A20"/>'+
    '<path d="M84 78 q16 10 32 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>'+
    '<path d="M84 40 q-8 -16 -20 -18 M116 40 q8 -16 20 -18" stroke="#3A2A20" stroke-width="5" fill="none" stroke-linecap="round"/>'+
    '<circle cx="62" cy="20" r="6" fill="#3A2A20"/><circle cx="138" cy="20" r="6" fill="#3A2A20"/>'; }

  function desenhoCarro() { return ''+
    '<path d="M24 138 q0 -26 22 -30 l18 -30 q6 -10 20 -10 h44 q14 0 20 10 l18 30 q22 4 22 30 '+
            'q0 12 -12 12 H36 q-12 0 -12 -12 Z" fill="#FF5FA2"/>'+
    '<path d="M70 82 h24 v26 H56 Z M106 82 h20 l14 26 h-34 Z" fill="#BDE6FA"/>'+
    '<circle cx="60" cy="150" r="22" fill="#3A2A20"/><circle cx="140" cy="150" r="22" fill="#3A2A20"/>'+
    '<circle cx="60" cy="150" r="9" fill="#C4B8B0"/><circle cx="140" cy="150" r="9" fill="#C4B8B0"/>'+
    '<rect x="24" y="118" width="16" height="10" rx="5" fill="#FFE07A"/>'+
    '<rect x="160" y="118" width="16" height="10" rx="5" fill="#FF8A8A"/>'; }

  function desenhoBarco() { return ''+
    '<path d="M100 24 v96" stroke="#8A5A2B" stroke-width="8" stroke-linecap="round"/>'+
    '<path d="M96 32 L96 112 L34 112 Z" fill="#fff" stroke="#D8CBB8" stroke-width="3"/>'+
    '<path d="M106 44 L106 112 L158 112 Z" fill="#E2503C"/>'+
    '<path d="M30 124 h140 l-24 34 q-6 8 -18 8 H72 q-12 0 -18 -8 Z" fill="#C4436A"/>'+
    '<path d="M30 124 h140 l-6 10 H36 Z" fill="#8E2F4E"/>'+
    '<path d="M14 176 q16 -12 32 0 q16 12 32 0 q16 -12 32 0 q16 12 32 0 q16 -12 32 0" '+
            'stroke="#4FC3F7" stroke-width="8" fill="none" stroke-linecap="round"/>'; }

  function desenhoTrem() { return ''+
    '<g fill="#EAF2F8" opacity=".95">'+
      '<circle cx="56" cy="34" r="14"/><circle cx="80" cy="22" r="11"/><circle cx="34" cy="26" r="9"/>'+
    '</g>'+
    '<rect x="40" y="60" width="24" height="34" rx="5" fill="#3A2A20"/>'+
    '<path d="M36 94 h128 q10 0 10 10 v42 H26 v-42 q0 -10 10 -10 Z" fill="#7C4DFF"/>'+
    '<path d="M112 60 h52 q10 0 10 10 v24 h-62 v-24 q0 -10 10 -10 Z" fill="#5A2FD6"/>'+
    '<rect x="122" y="70" width="18" height="18" rx="4" fill="#BDE6FA"/>'+
    '<rect x="146" y="70" width="18" height="18" rx="4" fill="#BDE6FA"/>'+
    '<rect x="42" y="106" width="30" height="24" rx="5" fill="#BDE6FA"/>'+
    '<rect x="82" y="106" width="30" height="24" rx="5" fill="#BDE6FA"/>'+
    '<rect x="18" y="150" width="164" height="10" rx="5" fill="#8A5A2B"/>'+
    '<circle cx="56" cy="164" r="18" fill="#3A2A20"/><circle cx="112" cy="164" r="18" fill="#3A2A20"/>'+
    '<circle cx="156" cy="164" r="14" fill="#3A2A20"/>'+
    '<circle cx="56" cy="164" r="7" fill="#C4B8B0"/><circle cx="112" cy="164" r="7" fill="#C4B8B0"/>'+
    '<circle cx="156" cy="164" r="6" fill="#C4B8B0"/>'; }

  function desenhoCama() { return ''+
    '<rect x="20" y="60" width="20" height="112" rx="8" fill="#A0724A"/>'+
    '<rect x="160" y="96" width="20" height="76" rx="8" fill="#A0724A"/>'+
    '<rect x="30" y="118" width="140" height="34" rx="10" fill="#FFF6E8"/>'+
    '<path d="M30 132 h140 v10 q0 10 -10 10 H40 q-10 0 -10 -10 Z" fill="#7C4DFF"/>'+
    '<path d="M74 132 h96 v10 q0 10 -10 10 H74 Z" fill="#9B7BFF"/>'+
    '<rect x="40" y="98" width="44" height="26" rx="12" fill="#fff" stroke="#E6DAFF" stroke-width="3"/>'+
    '<path d="M92 118 h78" stroke="#F0E6FF" stroke-width="4" stroke-linecap="round"/>'; }

  function desenhoLivro() { return ''+
    '<path d="M100 58 q-30 -16 -70 -10 v96 q40 -6 70 10 Z" fill="#fff" stroke="#D8CBB8" stroke-width="3"/>'+
    '<path d="M100 58 q30 -16 70 -10 v96 q-40 -6 -70 10 Z" fill="#FFF9F0" stroke="#D8CBB8" stroke-width="3"/>'+
    '<path d="M100 58 v96" stroke="#C4B8B0" stroke-width="4"/>'+
    '<path d="M22 44 q-8 2 -8 10 v96 q0 8 8 10 l8 -6 v-96 Z" fill="#E23C86"/>'+
    '<path d="M178 44 q8 2 8 10 v96 q0 8 -8 10 l-8 -6 v-96 Z" fill="#E23C86"/>'+
    '<g stroke="#C9BEEC" stroke-width="4" stroke-linecap="round">'+
      '<path d="M44 76 h42 M44 92 h42 M44 108 h32 M114 76 h42 M114 92 h42 M114 108 h32"/></g>'; }

  function desenhoCopo() { return ''+
    '<path d="M58 46 L142 46 L130 168 Q100 180 70 168 Z" fill="#EAF6FC" stroke="#C8DEEA" stroke-width="4"/>'+
    '<path d="M66 92 L134 92 L130 168 Q100 180 70 168 Z" fill="#4FC3F7"/>'+
    '<path d="M66 92 q34 -12 68 0 q-34 12 -68 0 Z" fill="#9FE0FA"/>'+
    '<ellipse cx="80" cy="128" rx="7" ry="24" fill="#fff" opacity=".4"/>'+
    '<circle cx="112" cy="118" r="6" fill="#fff" opacity=".5"/>'+
    '<circle cx="98" cy="142" r="4" fill="#fff" opacity=".5"/>'; }

  function desenhoNuvem() { return ''+
    '<g fill="#fff">'+
      '<circle cx="70" cy="104" r="34"/><circle cx="108" cy="86" r="42"/><circle cx="142" cy="112" r="30"/>'+
      '<rect x="66" y="104" width="80" height="38" rx="19"/>'+
    '</g>'+
    '<g fill="#DCEEF8" opacity=".9">'+
      '<circle cx="62" cy="122" r="12"/><circle cx="140" cy="126" r="10"/>'+
    '</g>'+
    '<circle cx="92" cy="102" r="6" fill="#7C9BB5"/><circle cx="122" cy="102" r="6" fill="#7C9BB5"/>'+
    '<path d="M96 118 q12 10 24 0" stroke="#7C9BB5" stroke-width="5" fill="none" stroke-linecap="round"/>'+
    '<circle cx="78" cy="116" r="8" fill="#FFB6CE" opacity=".6"/><circle cx="136" cy="116" r="8" fill="#FFB6CE" opacity=".6"/>'+
    '<g fill="#4FC3F7"><circle cx="76" cy="164" r="7"/><circle cx="108" cy="176" r="6"/><circle cx="140" cy="160" r="6"/></g>'; }

  /* fase = palavra + qual letra some + as duas letras que confundem */
  var FASES = [
    { palavra:'BOLA',   falta:0, erradas:['M','S'], desenho:desenhoBola },
    { palavra:'GATO',   falta:0, erradas:['T','F'], desenho:desenhoGato },
    { palavra:'SOL',    falta:1, erradas:['A','E'], desenho:desenhoSol  },
    { palavra:'LUA',    falta:1, erradas:['I','O'], desenho:desenhoLua  },
    { palavra:'PATO',   falta:0, erradas:['L','N'], desenho:desenhoPato },
    { palavra:'CASA',   falta:2, erradas:['Z','R'], desenho:desenhoCasa },
    { palavra:'BOLO',   falta:2, erradas:['R','V'], desenho:desenhoBolo },
    { palavra:'SAPO',   falta:1, erradas:['E','O'], desenho:desenhoSapo },
    { palavra:'FLOR',   falta:0, erradas:['V','T'], desenho:desenhoFlor },
    { palavra:'PEIXE',  falta:3, erradas:['S','C'], desenho:desenhoPeixe },
    { palavra:'OVO',    falta:1, erradas:['L','F'], desenho:desenhoOvo },
    { palavra:'UVA',    falta:0, erradas:['A','O'], desenho:desenhoUva },
    { palavra:'PERA',   falta:0, erradas:['T','M'], desenho:desenhoPera },
    { palavra:'BANANA', falta:2, erradas:['M','L'], desenho:desenhoBanana },
    { palavra:'SUCO',   falta:0, erradas:['F','R'], desenho:desenhoSuco },
    { palavra:'PIZZA',  falta:0, erradas:['T','L'], desenho:desenhoPizza },
    { palavra:'PIPOCA', falta:4, erradas:['G','S'], desenho:desenhoPipoca },
    { palavra:'VACA',   falta:0, erradas:['F','N'], desenho:desenhoVaca },
    { palavra:'PORCO',  falta:2, erradas:['L','N'], desenho:desenhoPorco },
    { palavra:'RATO',   falta:0, erradas:['M','N'], desenho:desenhoRato },
    { palavra:'URSO',   falta:0, erradas:['O','A'], desenho:desenhoUrso },
    { palavra:'GALO',   falta:0, erradas:['T','F'], desenho:desenhoGalo },
    { palavra:'ABELHA', falta:1, erradas:['L','M'], desenho:desenhoAbelha },
    { palavra:'CARRO',  falta:0, erradas:['G','S'], desenho:desenhoCarro },
    { palavra:'BARCO',  falta:0, erradas:['M','S'], desenho:desenhoBarco },
    { palavra:'TREM',   falta:0, erradas:['F','L'], desenho:desenhoTrem },
    { palavra:'CAMA',   falta:2, erradas:['N','V'], desenho:desenhoCama },
    { palavra:'LIVRO',  falta:0, erradas:['N','T'], desenho:desenhoLivro },
    { palavra:'COPO',   falta:0, erradas:['T','S'], desenho:desenhoCopo },
    { palavra:'NUVEM',  falta:0, erradas:['M','R'], desenho:desenhoNuvem }
  ];

  function falaDaLetra(letra) { return FALA[letra] || letra; }

  function figura(fase) {
    return '<svg class="figura" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" ' +
           'role="img" aria-label="' + fase.palavra + '">' + fase.desenho() + '</svg>';
  }

  return { FASES: FASES, figura: figura, falaDaLetra: falaDaLetra };
})();
