/* Lê as histórias escritas em historias/*.md e gera js/data-historias.js.

   Por que compilar em vez de ler o .md em tempo de execução: o app abre
   offline e tudo o que ele precisa já está no cache do service worker. Um
   fetch de markdown no meio da leitura seria mais uma coisa pra falhar na
   hora de dormir.

   Uso:
     node ferramentas/compilar-historias.js

   O texto é a fonte. Pra corrigir uma frase, edite o .md e rode isso de novo. */

const fs = require('fs'), path = require('path');

const RAIZ = path.join(__dirname, '..');
const FONTE = path.join(RAIZ, 'historias');
const DESTINO = path.join(RAIZ, 'js', 'data-historias.js');

/* A ordem aqui é a ordem da biblioteca. O tema não cabe no markdown
   (o arquivo é só a história), então mora aqui. A Azulina fecha a lista
   de propósito: é a mais calma, feita pra ser a última da noite. */
const CATALOGO = [
  { id: 'lumi-vagalume',      tema: 'coragem' },
  { id: 'bolota-ursinho',     tema: 'medo dos barulhos da noite' },
  { id: 'pipoca-estrelinha',  tema: 'amizade e pedir ajuda' },
  { id: 'juba-leaozinho',     tema: 'cada um tem o seu tempo' },
  { id: 'casquinha-tartaruga', tema: 'saudade' },
  { id: 'pingo-pinguim',      tema: 'errar faz parte' },
  { id: 'trevo-coelha',       tema: 'provar uma comida nova' },
  { id: 'brasa-dragao',       tema: 'raiva' },
  { id: 'castanha-esquilo',   tema: 'dividir' },
  { id: 'bolhinha-polvo',     tema: 'ser diferente' },
  { id: 'pintinha-joaninha',  tema: 'primeiro dia em lugar novo' },
  { id: 'algodao-nuvem',      tema: 'timidez' },
  { id: 'caramelo-cachorro',  tema: 'ciúme' },
  { id: 'azulina-baleia',     tema: 'sonhos bons' },
];

const SINAL = '\u{1F50A}';                       /* o alto-falante que marca som e ação */
const INSTRUCAO = /^\*\(Quando aparecer/;

/* Um parágrafo vira uma lista de trechos. Texto corrido é um trecho; cada
   marcação de som é outro. O app precisa dessa separação pra desenhar o
   chip colorido que o adulto enxerga de longe, no escuro. */
function parsearParagrafo(linha) {
  const trechos = [];
  let i = 0, buffer = '';

  while (i < linha.length) {
    const pos = linha.indexOf(SINAL, i);
    if (pos === -1) { buffer += linha.slice(i); break; }

    buffer += linha.slice(i, pos);
    if (buffer.trim()) trechos.push({ tipo: 'texto', texto: buffer.trim() });
    buffer = '';
    i = pos + SINAL.length;

    /* depois do sinal vêm uma ou duas marcações em itálico: o som e a ação.
       (parênteses = ação pro adulto fazer; sem parênteses = onomatopeia) */
    let som = null, acao = null;
    for (;;) {
      const m = /^[ \t]*\*([^*]+)\*/.exec(linha.slice(i));
      if (!m) break;
      const dentro = m[1].trim();
      if (dentro.startsWith('(') && dentro.endsWith(')')) acao = dentro.slice(1, -1).trim();
      else som = dentro;
      i += m[0].length;
      if (som && acao) break;
    }
    trechos.push({ tipo: 'som', som, acao });
  }

  if (buffer.trim()) trechos.push({ tipo: 'texto', texto: buffer.trim() });
  return trechos;
}

function contarPalavras(texto) {
  return texto.replace(new RegExp(SINAL, 'gu'), ' ').split(/\s+/).filter(Boolean).length;
}

function lerHistoria(entrada) {
  const arquivo = path.join(FONTE, entrada.id + '.md');
  if (!fs.existsSync(arquivo)) return { erro: 'arquivo não existe: historias/' + entrada.id + '.md' };

  const bruto = fs.readFileSync(arquivo, 'utf8').replace(/\r\n/g, '\n').trim();
  const linhas = bruto.split('\n');

  const cabecalho = /^#\s+(\S+)\s+(.+)$/u.exec(linhas[0] || '');
  if (!cabecalho) return { erro: 'primeira linha não é "# <emoji> <título>"' };

  /* tira o título e a linha de instrução: a instrução é sempre a mesma e o
     app a desenha sozinho, acima do texto */
  const corpo = linhas.slice(1).filter(l => !INSTRUCAO.test(l.trim()));

  const paragrafos = corpo.join('\n').split(/\n\s*\n/)
    .map(p => p.trim()).filter(Boolean)
    .map(p => parsearParagrafo(p.replace(/\n/g, ' ')))
    .filter(t => t.length);

  const palavras = contarPalavras(corpo.join(' ').replace(/[*#]/g, ''));
  const sons = (bruto.match(new RegExp(SINAL, 'gu')) || []).length;

  return {
    id: entrada.id,
    titulo: cabecalho[2].trim(),
    emoji: cabecalho[1],
    tema: entrada.tema,
    /* em voz alta, com as pausas dos sons, saem ~110 palavras por minuto */
    tempoLeituraMin: Math.min(5, Math.max(3, Math.round(palavras / 110))),
    ilustracao: 'img/historias/' + entrada.id + '.svg',
    paragrafos,
    palavras,
    sons,
  };
}

const lidas = CATALOGO.map(lerHistoria);
const falhas = lidas.filter(h => h.erro);
const ok = lidas.filter(h => !h.erro);

falhas.forEach((f, i) => console.error('FALHOU ' + CATALOGO[lidas.indexOf(f)].id + ': ' + f.erro));

const paraArquivo = ok.map(h => ({
  id: h.id, titulo: h.titulo, emoji: h.emoji, tema: h.tema,
  tempoLeituraMin: h.tempoLeituraMin, ilustracao: h.ilustracao, paragrafos: h.paragrafos,
}));

const saida = `/* GERADO POR ferramentas/compilar-historias.js — não edite à mão.
   A fonte de cada história é o arquivo historias/<id>.md.
   Pra mudar uma frase: edite o .md e rode o compilador de novo. */
var Historias = (function () {
  var LISTA = ${JSON.stringify(paraArquivo, null, 1)};

  function porId(id) {
    for (var i = 0; i < LISTA.length; i++) if (LISTA[i].id === id) return LISTA[i];
    return null;
  }

  return { LISTA: LISTA, porId: porId };
})();
`;

fs.writeFileSync(DESTINO, saida);

console.log('histórias compiladas: ' + ok.length + ' de ' + CATALOGO.length);
ok.forEach(h => console.log(
  '  ' + h.emoji + ' ' + h.titulo.padEnd(46).slice(0, 46) +
  '  ' + String(h.palavras).padStart(3) + ' palavras' +
  '  ' + String(h.sons).padStart(2) + ' sons' +
  '  ' + h.tempoLeituraMin + ' min'));
if (falhas.length) { console.error('\n' + falhas.length + ' sem compilar'); process.exit(1); }
