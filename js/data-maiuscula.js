/* =========================================================
   LETRA MAIÚSCULA — os traços das 26 letras de forma (bastão)
   É a letra que a escola ensina primeiro e a mesma do jogo das
   Palavras. Como na cursiva, cada letra é o CAMINHO da caneta,
   não o contorno: é o que deixa mostrar onde começa, pra que
   lado vai e conferir se ela passou o dedo por cima.

   Pauta (viewBox 0 0 100 130), sem inclinação:
     20  topo
     63  meio
     106 linha de base
   A letra ocupa a pauta quase inteira, maior que a cursiva: é a
   primeira letra que ela aprende, e dedo de 5 anos precisa de
   espaço.

   Um caminho por traço, NA ORDEM da escola: de cima pra baixo,
   da esquerda pra direita, e a perna/barriga depois da haste.
   A tela numera o começo de cada traço (1, 2, 3) quando a letra
   tem mais de um. Letra que a mão faz sem levantar (M, N, V, W,
   Z, L) é um traço só — zigue-zague num gesto é mais fácil pra
   ela do que quatro risquinhos soltos.

   Conferidas em tamanho grande em ferramentas/letras.html.
   ========================================================= */
var Maiuscula = (function () {
  /* o O inteiro, igual no O e no Q */
  var OVAL = 'M50 20 C23 20 15 47 15 63 C15 85 26 106 50 106 C74 106 85 85 85 63 C85 42 74 20 50 20';
  /* a curva do C, que o G continua */
  var CURVA_C = 'M77 33 C69 20 50 17 37 23 C18 31 15 58 18 71 C20 93 42 109 61 106';

  var LETRAS = {
    A:{d:['M50 20 L20 106','M50 20 L80 106','M31 74 L69 74']},
    B:{d:['M26 20 L26 106','M26 20 L50 20 C72 20 72 63 50 63 L26 63','M26 63 L54 63 C77 63 77 106 54 106 L26 106']},
    C:{d:[CURVA_C + ' C69 105 74 101 78 95']},
    D:{d:['M26 20 L26 106','M26 20 L45 20 C72 20 80 44 80 63 C80 85 69 106 45 106 L26 106']},
    E:{d:['M26 20 L26 106','M26 20 L74 20','M26 63 L66 63','M26 106 L74 106']},
    F:{d:['M26 20 L26 106','M26 20 L74 20','M26 63 L66 63']},
    G:{d:[CURVA_C + ' C74 103 80 90 80 74 L80 66 L58 66']},
    H:{d:['M26 20 L26 106','M74 20 L74 106','M26 63 L74 63']},
    I:{d:['M50 20 L50 106']},
    J:{d:['M66 20 L66 85 C66 103 50 111 37 106 C29 103 23 95 23 87']},
    K:{d:['M26 20 L26 106','M74 20 L27 66','M27 66 L77 106']},
    L:{d:['M26 20 L26 106 L74 106']},
    M:{d:['M18 106 L18 20 L50 74 L82 20 L82 106']},
    N:{d:['M23 106 L23 20 L77 106 L77 20']},
    O:{d:[OVAL]},
    P:{d:['M26 20 L26 106','M26 20 L50 20 C72 20 72 63 50 63 L26 63']},
    Q:{d:[OVAL,'M58 85 L82 111']},
    R:{d:['M26 20 L26 106','M26 20 L50 20 C72 20 72 63 50 63 L26 63','M45 63 L77 106']},
    S:{d:['M77 31 C69 20 50 17 37 23 C23 28 20 44 34 55 C45 63 66 63 74 74 C85 87 74 106 53 106 C37 107 26 101 20 93']},
    T:{d:['M15 20 L85 20','M50 20 L50 106']},
    U:{d:['M20 20 L20 76 C20 98 34 106 50 106 C66 106 80 98 80 76 L80 20']},
    V:{d:['M18 20 L50 106 L82 20']},
    W:{d:['M10 20 L29 106 L50 44 L72 106 L90 20']},
    X:{d:['M20 20 L80 106','M80 20 L20 106']},
    Y:{d:['M20 20 L50 63','M80 20 L50 63 L50 106']},
    Z:{d:['M20 20 L80 20 L20 106 L80 106']}
  };

  var ORDEM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return { LETRAS: LETRAS, ORDEM: ORDEM };
})();
