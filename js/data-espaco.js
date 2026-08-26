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

  /* Diâmetro real em km e quanto da altura do quadro a bola ocupa em cada
     arte — sem isso a proporção entre os planetas viraria mentira. */
  var REAIS = {
    sol:      { km: 1392700, bola: 0.884 },
    mercurio: { km:    4879, bola: 0.996 },
    venus:    { km:   12104, bola: 0.996 },
    terra:    { km:   12742, bola: 0.800 },
    marte:    { km:    6779, bola: 0.996 },
    jupiter:  { km:  139820, bola: 0.996 },
    saturno:  { km:  116460, bola: 0.456 },
    urano:    { km:   50724, bola: 0.773 },
    netuno:   { km:   49244, bola: 0.831 }
  };

  /* Distância média até o Sol, em milhões de km, e quanto tempo levaria
     num foguete rápido (40 mil km/h) indo em linha reta. */
  var DISTANCIAS = {
    mercurio: { milhoes:  58, viagem: '2 meses de foguete' },
    venus:    { milhoes: 108, viagem: '3 meses de foguete' },
    terra:    { milhoes: 150, viagem: '5 meses de foguete' },
    marte:    { milhoes: 228, viagem: '8 meses de foguete' },
    jupiter:  { milhoes: 778, viagem: '2 anos de foguete'  },
    saturno:  { milhoes:1430, viagem: '4 anos de foguete'  },
    urano:    { milhoes:2870, viagem: '8 anos de foguete'  },
    netuno:   { milhoes:4500, viagem: '13 anos de foguete' }
  };

  function comArtigo(a) { return (a.artigo ? a.artigo + ' ' : '') + a.nome; }

  function porId(id) {
    for (var i = 0; i < ASTROS.length; i++) if (ASTROS[i].id === id) return ASTROS[i];
    return null;
  }

  return { ASTROS: ASTROS, REAIS: REAIS, DISTANCIAS: DISTANCIAS, orbe: orbe, porId: porId, comArtigo: comArtigo };
})();
