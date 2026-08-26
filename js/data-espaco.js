/* =========================================================
   SISTEMA SOLAR — Sol + 8 planetas desenhados em SVG puro
   (nada de imagem externa: abre rápido e funciona offline)
   ========================================================= */
var Espaco = (function () {
  var seq = 0;

  var ASTROS = [
    {
      id:'sol', nome:'Sol', artigo:'o', estrela:true, base:'#FDB813', tam:150,
      tag:'A nossa estrela', legenda:'Centro do sistema solar',
      fatos:['☀️ É uma estrela gigante feita de fogo.',
             '🔥 É ele que esquenta e ilumina todos os planetas.'],
      detalhe:function(){ return ''+
        '<circle cx="60" cy="60" r="40" fill="#FFE07A"/>'+
        '<circle cx="60" cy="60" r="40" fill="#FF9A1F" opacity=".55"/>'+
        '<circle cx="44" cy="46" r="9" fill="#FFF3B0" opacity=".8"/>'+
        '<circle cx="76" cy="72" r="7" fill="#FF7A00" opacity=".45"/>'+
        '<circle cx="68" cy="38" r="5" fill="#FF7A00" opacity=".35"/>'; }
    },
    {
      id:'mercurio', nome:'Mercúrio', artigo:'', base:'#9A8F86', tam:54, ordem:1,
      tag:'O menorzinho, bem pertinho do Sol', legenda:'1º planeta',
      fatos:['🪨 É todo cheio de buraquinhos: são as crateras.',
             '🏃 É o planeta mais rápido de todos, corre demais!'],
      detalhe:function(){ return ''+
        '<circle cx="46" cy="48" r="9" fill="#7C736C"/><circle cx="46" cy="48" r="5" fill="#8E857D"/>'+
        '<circle cx="74" cy="66" r="7" fill="#7C736C"/><circle cx="62" cy="82" r="5" fill="#7C736C"/>'+
        '<circle cx="80" cy="40" r="4" fill="#7C736C"/><circle cx="36" cy="72" r="4" fill="#7C736C"/>'; }
    },
    {
      id:'venus', nome:'Vênus', artigo:'', base:'#E8B25C', tam:74, ordem:2,
      tag:'O planeta mais quente', legenda:'2º planeta',
      fatos:['🔥 Lá faz mais calor que dentro de um forno.',
             '☁️ Ele vive escondidinho atrás de nuvens amarelas.'],
      detalhe:function(){ return ''+
        '<ellipse cx="60" cy="40" rx="46" ry="9" fill="#FFD9A0" opacity=".7"/>'+
        '<ellipse cx="60" cy="60" rx="46" ry="7" fill="#C98F3C" opacity=".55"/>'+
        '<ellipse cx="60" cy="76" rx="46" ry="8" fill="#FFE3B8" opacity=".5"/>'+
        '<ellipse cx="60" cy="90" rx="46" ry="6" fill="#C98F3C" opacity=".4"/>'; }
    },
    {
      id:'terra', nome:'Terra', artigo:'a', base:'#2E7DD1', tam:80, ordem:3,
      tag:'A nossa casa', legenda:'3º planeta',
      fatos:['💙 É o único com água, bichos, plantas... e a Lara!',
             '🌙 Tem uma Lua que aparece pra gente de noite.'],
      detalhe:function(){ return ''+
        '<path d="M28 46 q14 -10 26 -2 q10 7 2 15 q-12 10 -24 4 q-9 -6 -4 -17 Z" fill="#3FA84E"/>'+
        '<path d="M70 34 q16 -4 22 8 q4 10 -8 12 q-14 2 -18 -8 q-2 -8 4 -12 Z" fill="#3FA84E"/>'+
        '<path d="M62 70 q18 -6 28 6 q8 10 -6 16 q-18 8 -26 -6 q-4 -10 4 -16 Z" fill="#4CB85C"/>'+
        '<path d="M26 84 q12 -6 20 2 q6 8 -4 12 q-14 4 -18 -6 Z" fill="#3FA84E"/>'+
        '<ellipse cx="60" cy="22" rx="26" ry="7" fill="#EAF6FF" opacity=".85"/>'+
        '<ellipse cx="60" cy="98" rx="22" ry="6" fill="#EAF6FF" opacity=".8"/>'+
        '<ellipse cx="44" cy="60" rx="20" ry="5" fill="#fff" opacity=".28"/>'+
        '<ellipse cx="82" cy="52" rx="14" ry="4" fill="#fff" opacity=".25"/>'; }
    },
    {
      id:'marte', nome:'Marte', artigo:'', base:'#D2603A', tam:64, ordem:4,
      tag:'O planeta vermelho', legenda:'4º planeta',
      fatos:['🔴 A areia dele é vermelha, cor de ferrugem.',
             '🤖 Robozinhos passeiam por lá procurando água.'],
      detalhe:function(){ return ''+
        '<path d="M30 48 q16 -8 28 2 q6 8 -6 12 q-18 4 -22 -6 Z" fill="#A8462A" opacity=".8"/>'+
        '<path d="M68 74 q16 -6 22 4 q4 8 -8 11 q-16 3 -18 -7 Z" fill="#A8462A" opacity=".7"/>'+
        '<circle cx="84" cy="44" r="7" fill="#B24E2F" opacity=".7"/>'+
        '<ellipse cx="60" cy="23" rx="17" ry="6" fill="#FFEFE6" opacity=".9"/>'+
        '<ellipse cx="60" cy="97" rx="14" ry="5" fill="#FFEFE6" opacity=".8"/>'; }
    },
    {
      id:'jupiter', nome:'Júpiter', artigo:'', base:'#D9A066', tam:132, ordem:5,
      tag:'O maior de todos', legenda:'5º planeta',
      fatos:['🌀 Tem uma tempestade maior que a Terra inteira!',
             '🎈 Ele é tão grande que cabem mil Terras lá dentro.'],
      detalhe:function(){ return ''+
        '<ellipse cx="60" cy="30" rx="46" ry="8" fill="#F0D2A8" opacity=".9"/>'+
        '<ellipse cx="60" cy="44" rx="46" ry="7" fill="#B67C48" opacity=".8"/>'+
        '<ellipse cx="60" cy="58" rx="46" ry="9" fill="#F5E0C0" opacity=".85"/>'+
        '<ellipse cx="60" cy="72" rx="46" ry="8" fill="#A96B3C" opacity=".75"/>'+
        '<ellipse cx="60" cy="86" rx="46" ry="7" fill="#EBD0A4" opacity=".8"/>'+
        '<ellipse cx="60" cy="98" rx="46" ry="6" fill="#B67C48" opacity=".7"/>'+
        '<ellipse cx="76" cy="72" rx="14" ry="9" fill="#D2452F" opacity=".92"/>'+
        '<ellipse cx="76" cy="72" rx="8" ry="5" fill="#F0705A" opacity=".8"/>'; }
    },
    {
      id:'saturno', nome:'Saturno', artigo:'', base:'#E3C48D', tam:120, ordem:6, aneis:true,
      tag:'O dos anéis', legenda:'6º planeta',
      fatos:['💍 Os anéis são feitos de gelo e pedrinhas.',
             '🎈 Ele é tão levinho que boiaria numa banheira gigante.'],
      detalhe:function(){ return ''+
        '<ellipse cx="60" cy="34" rx="46" ry="8" fill="#F5E2BC" opacity=".85"/>'+
        '<ellipse cx="60" cy="50" rx="46" ry="7" fill="#C9A468" opacity=".7"/>'+
        '<ellipse cx="60" cy="66" rx="46" ry="8" fill="#F7EAC8" opacity=".8"/>'+
        '<ellipse cx="60" cy="82" rx="46" ry="7" fill="#C9A468" opacity=".6"/>'; }
    },
    {
      id:'urano', nome:'Urano', artigo:'', base:'#7FD3DE', tam:94, ordem:7, aneisVerticais:true,
      tag:'O que gira deitadinho', legenda:'7º planeta',
      fatos:['🔄 Ele gira deitado, rolando igual bolinha.',
             '🥶 É um planeta muito, muito gelado.'],
      detalhe:function(){ return ''+
        '<ellipse cx="60" cy="40" rx="46" ry="9" fill="#A9E6EE" opacity=".6"/>'+
        '<ellipse cx="60" cy="66" rx="46" ry="8" fill="#5FBCCB" opacity=".5"/>'+
        '<ellipse cx="60" cy="88" rx="46" ry="7" fill="#A9E6EE" opacity=".45"/>'; }
    },
    {
      id:'netuno', nome:'Netuno', artigo:'', base:'#3B5BD9', tam:92, ordem:8,
      tag:'O mais longe do Sol', legenda:'8º planeta',
      fatos:['💨 Lá tem os ventos mais fortes de todos.',
             '🔵 Ele é azul escurinho, cor de mar bem fundo.'],
      detalhe:function(){ return ''+
        '<ellipse cx="60" cy="36" rx="46" ry="8" fill="#6C87EE" opacity=".55"/>'+
        '<ellipse cx="60" cy="62" rx="46" ry="9" fill="#2B45AC" opacity=".55"/>'+
        '<ellipse cx="60" cy="86" rx="46" ry="7" fill="#6C87EE" opacity=".45"/>'+
        '<ellipse cx="46" cy="56" rx="11" ry="7" fill="#1B2E7A" opacity=".8"/>'; }
    }
  ];

  /* --- imagem do astro (arte do Midjourney, fundo já recortado) --- */
  function orbe(astro, tam) {
    return '<img class="orbe" src="img/planeta-' + astro.id + '.webp" alt="' + astro.nome + '" ' +
           'width="' + tam + '" height="' + tam + '" draggable="false" loading="eager">';
  }

  /* --- versão vetorial antiga, guardada como reserva --- */
  function orbeVetor(astro, tam) {
    var u = 'a' + (++seq);
    var brilho = astro.estrela
      ? '<circle cx="60" cy="60" r="56" fill="url(#glow' + u + ')"/>'
      : '';
    var defs = '' +
      '<clipPath id="cp' + u + '"><circle cx="60" cy="60" r="40"/></clipPath>' +
      '<radialGradient id="luz' + u + '" cx="33%" cy="27%" r="80%">' +
        '<stop offset="0" stop-color="#fff" stop-opacity=".45"/>' +
        '<stop offset="55%" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="bor' + u + '" cx="50%" cy="50%" r="50%">' +
        '<stop offset="62%" stop-color="#000" stop-opacity="0"/>' +
        '<stop offset="100%" stop-color="#04061A" stop-opacity="' + (astro.estrela ? '.10' : '.55') + '"/></radialGradient>' +
      (astro.estrela
        ? '<radialGradient id="glow' + u + '" cx="50%" cy="50%" r="50%">' +
          '<stop offset="55%" stop-color="#FFD23F" stop-opacity=".55"/>' +
          '<stop offset="100%" stop-color="#FF8A00" stop-opacity="0"/></radialGradient>'
        : '');

    var aneisAtras = '', aneisFrente = '';
    if (astro.aneis) {
      aneisAtras = '<g transform="rotate(-17 60 60)">' +
        '<ellipse cx="60" cy="60" rx="57" ry="15" fill="none" stroke="#F0DDB4" stroke-width="7" opacity=".9"/>' +
        '<ellipse cx="60" cy="60" rx="47" ry="12" fill="none" stroke="#C8A971" stroke-width="3" opacity=".85"/></g>';
      aneisFrente = '<g transform="rotate(-17 60 60)" clip-path="url(#frente' + u + ')">' +
        '<ellipse cx="60" cy="60" rx="57" ry="15" fill="none" stroke="#F7E8C6" stroke-width="7"/>' +
        '<ellipse cx="60" cy="60" rx="47" ry="12" fill="none" stroke="#D8BC85" stroke-width="3"/></g>';
      defs += '<clipPath id="frente' + u + '"><rect x="-10" y="60" width="140" height="70"/></clipPath>';
    }
    if (astro.aneisVerticais) {
      aneisAtras = '<ellipse cx="60" cy="60" rx="12" ry="55" fill="none" stroke="#BFEFF6" stroke-width="2.5" opacity=".55" transform="rotate(8 60 60)"/>';
    }

    return '<svg viewBox="0 0 120 120" width="' + tam + '" height="' + tam + '" ' +
             'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + astro.nome + '">' +
             '<defs>' + defs + '</defs>' + brilho + aneisAtras +
             '<circle cx="60" cy="60" r="40" fill="' + astro.base + '"/>' +
             '<g clip-path="url(#cp' + u + ')">' + astro.detalhe() + '</g>' +
             '<circle cx="60" cy="60" r="40" fill="url(#luz' + u + ')"/>' +
             '<circle cx="60" cy="60" r="40" fill="url(#bor' + u + ')"/>' +
             aneisFrente +
           '</svg>';
  }

  function comArtigo(a) { return (a.artigo ? a.artigo + ' ' : '') + a.nome; }

  function porId(id) {
    for (var i = 0; i < ASTROS.length; i++) if (ASTROS[i].id === id) return ASTROS[i];
    return null;
  }

  return { ASTROS: ASTROS, orbe: orbe, orbeVetor: orbeVetor, porId: porId, comArtigo: comArtigo };
})();
