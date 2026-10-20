/* =========================================================
   SÍLABAS — as famílias e as palavras do Juntar

   Duas listas, e as duas tem motivo pra ser do jeito que sao.

   FAMILIAS: o silabario da escola brasileira. Primeiro as vogais,
   que e por onde toda cartilha comeca, e depois consoante + vogal.
   Fica de FORA, e cada ausencia e decisao, nao esquecimento:

   - H — HA HE HI HO HU nao existem. O H sozinho nao tem som nenhum
     em portugues ("hora" soa "ora"). Familia do aga ensinaria um som
     que a lingua nao tem, e justo na letra que ela vai querer escrever
     onde nao tem.
   - K, W, Y — so vivem em nome e marca de fora. KA KE KI KO KU soa
     igual a CA QUE QUI CO CU: familia nova, som nenhum novo, e o
     caminho mais curto pra ela escrever "kasa".
   - Ç — existe ÇA ÇO ÇU, nao existe ÇE nem ÇI, e o Ç nunca comeca
     palavra. Cartao de grade e lido como comeco de palavra.
   - CH, LH, NH — digrafos, e nenhum comeca palavra em portugues.
     Mostrar LHU solto ensinaria uma silaba que ela nunca vera escrita
     no comeco de nada. Sao a segunda leva.
   - BR, BL, CR, CL, DR, FR, FL, GR, GL, PR, PL, TR, VR — encontro
     consonantal nao e familia: sao duas consoantes com dois sons. 13
     grupos x 5 vogais seriam 65 cartoes a mais numa grade de 18.
   - AR, OR, UR, EM, AL... — silaba travada tambem nao e familia: aqui
     a consoante FECHA a silaba em vez de comecar. E por isso que POR,
     UR, BAR e VEM nascem da propria palavra no Juntar, nao da grade.

   O Q tem tres silabas, nao cinco: QA, QE, QO e QU nao existem, e QUO
   so vive em "quota", que quase sempre se escreve "cota". Familia de
   tamanho diferente e normal aqui — quem desenha a tela conta o array.

   PALAVRAS: as mesmas 30 do jogo de letra (js/data-palavras.js), que
   ja tem desenho e voz gravada. Cinco ficaram fora:

   - SOL, FLOR, TREM — monossilabo. Nao existe o que juntar.
   - PIZZA — grafia italiana. PIZ-ZA e a divisao formal e ninguem bate
     palma assim; ZZ nao e portugues.
   - CARRO — os dois caminhos ensinam errado. CAR-RO corta no meio um
     som que e um so; CA-RRO contraria o que a professora vai escrever
     no caderno dela.

   A ordem e de dificuldade, e e ela que manda no jogo: CV-CV limpa
   primeiro, depois tres silabas, depois vogal sozinha e ditongo, e por
   ultimo coda, digrafo e encontro.
   ========================================================= */
var Silabas = (function () {

  /* rotulo = o que aparece no azulejo da grade; letra = de que letra e
     a familia, pra voz dizer o nome dela ("a familia do be") */
  var FAMILIAS = [
    { id:'vogais', rotulo:'A E I O U', letra:'',  vogais:true,
      silabas:['A','E','I','O','U'] },
    { id:'b', rotulo:'B',  letra:'B', silabas:['BA','BE','BI','BO','BU'] },
    { id:'c', rotulo:'C',  letra:'C', silabas:['CA','CE','CI','CO','CU'] },
    { id:'d', rotulo:'D',  letra:'D', silabas:['DA','DE','DI','DO','DU'] },
    { id:'f', rotulo:'F',  letra:'F', silabas:['FA','FE','FI','FO','FU'] },
    { id:'g', rotulo:'G',  letra:'G', silabas:['GA','GE','GI','GO','GU'] },
    { id:'j', rotulo:'J',  letra:'J', silabas:['JA','JE','JI','JO','JU'] },
    { id:'l', rotulo:'L',  letra:'L', silabas:['LA','LE','LI','LO','LU'] },
    { id:'m', rotulo:'M',  letra:'M', silabas:['MA','ME','MI','MO','MU'] },
    { id:'n', rotulo:'N',  letra:'N', silabas:['NA','NE','NI','NO','NU'] },
    { id:'p', rotulo:'P',  letra:'P', silabas:['PA','PE','PI','PO','PU'] },
    { id:'q', rotulo:'QU', letra:'Q', silabas:['QUA','QUE','QUI'] },
    { id:'r', rotulo:'R',  letra:'R', silabas:['RA','RE','RI','RO','RU'] },
    { id:'s', rotulo:'S',  letra:'S', silabas:['SA','SE','SI','SO','SU'] },
    { id:'t', rotulo:'T',  letra:'T', silabas:['TA','TE','TI','TO','TU'] },
    { id:'v', rotulo:'V',  letra:'V', silabas:['VA','VE','VI','VO','VU'] },
    { id:'x', rotulo:'X',  letra:'X', silabas:['XA','XE','XI','XO','XU'] },
    { id:'z', rotulo:'Z',  letra:'Z', silabas:['ZA','ZE','ZI','ZO','ZU'] }
  ];

  var PALAVRAS = [
    { palavra:'BOLA',   silabas:['BO','LA'] },
    { palavra:'GATO',   silabas:['GA','TO'] },
    { palavra:'PATO',   silabas:['PA','TO'] },
    { palavra:'CASA',   silabas:['CA','SA'] },
    { palavra:'BOLO',   silabas:['BO','LO'] },
    { palavra:'SAPO',   silabas:['SA','PO'] },
    { palavra:'VACA',   silabas:['VA','CA'] },
    { palavra:'RATO',   silabas:['RA','TO'] },
    { palavra:'GALO',   silabas:['GA','LO'] },
    { palavra:'CAMA',   silabas:['CA','MA'] },
    { palavra:'COPO',   silabas:['CO','PO'] },
    { palavra:'PERA',   silabas:['PE','RA'] },
    { palavra:'SUCO',   silabas:['SU','CO'] },
    { palavra:'BANANA', silabas:['BA','NA','NA'] },
    { palavra:'PIPOCA', silabas:['PI','PO','CA'] },
    { palavra:'OVO',    silabas:['O','VO'] },
    { palavra:'UVA',    silabas:['U','VA'] },
    { palavra:'LUA',    silabas:['LU','A'] },
    { palavra:'PEIXE',  silabas:['PEI','XE'] },
    { palavra:'PORCO',  silabas:['POR','CO'] },
    { palavra:'BARCO',  silabas:['BAR','CO'] },
    { palavra:'URSO',   silabas:['UR','SO'] },
    { palavra:'NUVEM',  silabas:['NU','VEM'] },
    { palavra:'LIVRO',  silabas:['LI','VRO'] },
    { palavra:'ABELHA', silabas:['A','BE','LHA'] }
  ];

  /* ---------- a fala de cada silaba ----------
     Vogal sozinha usa o nome da letra, que ja esta gravado e conferido
     desde outubro: o nome da vogal E o som dela ("á" é /a/). As outras
     vao em minuscula, que e como o gerador manda palavra curta pra
     ElevenLabs — maiuscula ele le como sigla. */
  function falaDaSilaba(s) {
    var S = String(s).toUpperCase();
    if (S.length === 1 && 'AEIOU'.indexOf(S) > -1) return Palavras.falaDaLetra(S);
    return S.toLowerCase();
  }

  /* "Bola", nao "BOLA": a chave da voz gravada das 30 palavras e assim */
  function ditaPalavra(p) {
    var P = String(p);
    return P.charAt(0) + P.slice(1).toLowerCase();
  }

  /* todas as silabas que o app pode pedir: as das familias mais as que
     so nascem dentro de uma palavra (PEI, POR, BAR, UR, VEM, VRO, LHA) */
  function todasAsSilabas() {
    var v = [];
    function add(s) { if (v.indexOf(s) === -1) v.push(s); }
    FAMILIAS.forEach(function (f) { f.silabas.forEach(add); });
    PALAVRAS.forEach(function (p) { p.silabas.forEach(add); });
    return v;
  }

  /* o desenho vem do jogo de letra, que ja tem um pra cada palavra */
  function fase(palavra) {
    for (var i = 0; i < Palavras.FASES.length; i++)
      if (Palavras.FASES[i].palavra === palavra) return Palavras.FASES[i];
    return null;
  }
  function figura(palavra) {
    var f = fase(palavra);
    return f ? Palavras.figura(f) : '';
  }

  function porId(id) {
    for (var i = 0; i < FAMILIAS.length; i++) if (FAMILIAS[i].id === id) return FAMILIAS[i];
    return null;
  }

  return {
    FAMILIAS: FAMILIAS, PALAVRAS: PALAVRAS,
    falaDaSilaba: falaDaSilaba, ditaPalavra: ditaPalavra,
    todasAsSilabas: todasAsSilabas, figura: figura, fase: fase, porId: porId
  };
})();
