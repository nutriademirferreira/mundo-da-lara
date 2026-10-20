/* Confere as histórias e as ilustrações contra as regras do formato.

   Uso:
     node ferramentas/validar-historias.js

   Sai com código 1 se achar qualquer problema, pra servir de portão antes
   de publicar. Rode junto com o compilador.

   As quatro primeiras são cópia literal do que o Ademir entregou: ficam
   isentas da faixa de palavras, mas passam por todo o resto. */

const fs = require('fs'), path = require('path');

const RAIZ = path.join(__dirname, '..');
const SINAL = '\u{1F50A}';
const TRAVESSAO = '—';

const REFERENCIA = ['lumi-vagalume', 'bolota-ursinho', 'pipoca-estrelinha', 'juba-leaozinho'];

const NOMES_DA_REFERENCIA = ['Lumi', 'Bolota', 'Pipoca', 'Juba', 'Saltitão', 'Penugem',
                             'Bolão', 'Trovão', 'Bochecha', 'Pescoçuda', 'Tico'];

/* O nome de cada protagonista. Nenhum pode aparecer em OUTRA história: uma
   "Vovó Casquinha" tartaruga no fundo do mar nasceu junto com a Casquinha
   tartaruga da praia, e duas tartarugas de mesmo nome confundem. */
const PROTAGONISTAS = {
  'casquinha-tartaruga': 'Casquinha', 'pingo-pinguim': 'Pingo',
  'trevo-coelha': 'Trevo', 'brasa-dragao': 'Brasa',
  'castanha-esquilo': 'Castanha', 'bolhinha-polvo': 'Bolhinha',
  'pintinha-joaninha': 'Pintinha', 'algodao-nuvem': 'Algodão',
  'caramelo-cachorro': 'Caramelo', 'azulina-baleia': 'Azulina',
};

const PROIBIDO_SVG = ['<text', '<image', '<filter', '<lineargradient', '<radialgradient',
                      '<style', '<script', '<use', 'url(#'];

const problemas = [];
const avisos = [];
function acusar(onde, o_que) { problemas.push(onde.padEnd(24) + o_que); }

/* ---------- texto ---------- */

function validarTexto(id) {
  const arquivo = path.join(RAIZ, 'historias', id + '.md');
  if (!fs.existsSync(arquivo)) { acusar(id, 'o .md não existe'); return null; }

  const bruto = fs.readFileSync(arquivo, 'utf8').replace(/\r\n/g, '\n').trim();
  const linhas = bruto.split('\n');
  const ehReferencia = REFERENCIA.indexOf(id) >= 0;

  if (!/^#\s+\S+\s+.+$/u.test(linhas[0] || ''))
    acusar(id, 'primeira linha não é "# <emoji> <título>"');

  const instrucao = linhas.find(l => l.trim().startsWith('*(Quando aparecer'));
  if (!instrucao) acusar(id, 'falta a linha de instrução');
  else if (instrucao.trim() !== '*(Quando aparecer ' + SINAL + ', faz o som ou chama ela pra fazer junto)*')
    acusar(id, 'a linha de instrução está diferente do padrão');

  const corpo = linhas.slice(1).filter(l => !l.trim().startsWith('*(Quando aparecer')).join(' ');
  const palavras = corpo.replace(new RegExp(SINAL, 'gu'), ' ').replace(/[*#]/g, ' ')
                        .split(/\s+/).filter(Boolean).length;
  const sons = (bruto.match(new RegExp(SINAL, 'gu')) || []).length;
  /* ação física = marcação entre parênteses logo depois do sinal */
  const acoes = (bruto.match(new RegExp(SINAL + '[^\\n]*?\\*\\([^)]+\\)\\*', 'gu')) || []).length;

  if (!ehReferencia && (palavras < 350 || palavras > 550))
    acusar(id, 'tem ' + palavras + ' palavras (a faixa é 350 a 550)');
  if (sons < 8 || sons > 14)
    acusar(id, 'tem ' + sons + ' marcações de som (a faixa é 8 a 14)');
  if (acoes < 2)
    acusar(id, 'tem ' + acoes + ' ações físicas (o mínimo é 2)');

  if (bruto.indexOf(TRAVESSAO) >= 0)
    acusar(id, 'usa travessão');
  if (/n[ãa]o\s+é\s+sobre/i.test(bruto))
    acusar(id, 'usa a expressão "não é sobre"');
  if (/lindinh/i.test(bruto))
    acusar(id, 'usa "lindinho"');
  if (!/\*Fim\.\*/.test(bruto))
    acusar(id, 'não termina com *Fim.*');
  /* negrito só é cobrado das novas: entre as quatro de referência, só a do
     Lumi destaca a lição, e elas entram como foram escritas */
  if (!ehReferencia && !/\*\*[^*]+\*\*/.test(bruto))
    acusar(id, 'não tem a lição em negrito');

  if (!ehReferencia) {
    NOMES_DA_REFERENCIA.forEach(nome => {
      if (new RegExp('\\b' + nome + '\\b').test(bruto))
        acusar(id, 'repete o nome "' + nome + '", que já é das histórias de referência');
    });
  }

  Object.keys(PROTAGONISTAS).forEach(dono => {
    if (dono === id) return;
    const nome = PROTAGONISTAS[dono];
    if (new RegExp('\\b' + nome + '\\b').test(bruto))
      acusar(id, 'usa o nome "' + nome + '", que é o protagonista de ' + dono);
  });

  /* frase muito longa cansa quem lê em voz alta */
  const longas = corpo.replace(/\*/g, '').split(/(?<=[.!?])\s+/)
                      .filter(f => f.split(/\s+/).filter(Boolean).length > 28);
  if (longas.length) avisos.push(id.padEnd(24) + longas.length + ' frase(s) com mais de 28 palavras');

  return { palavras, sons, acoes };
}

/* ---------- ilustração ---------- */

/* parser de tags por pilha: pega tag não fechada e aninhamento trocado, que
   é o que de fato quebra um SVG escrito à mão */
function xmlBemFormado(texto) {
  const pilha = [];
  const re = /<\/?([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(texto))) {
    const fechamento = m[0].startsWith('</');
    const vazia = m[3] === '/';
    if (fechamento) {
      if (pilha.pop() !== m[1]) return 'tag </' + m[1] + '> fecha fora de ordem';
    } else if (!vazia) {
      pilha.push(m[1]);
    }
  }
  if (pilha.length) return 'tag <' + pilha[pilha.length - 1] + '> ficou aberta';
  return null;
}

function validarSvg(id) {
  const arquivo = path.join(RAIZ, 'img', 'historias', id + '.svg');
  if (!fs.existsSync(arquivo)) { acusar(id, 'o .svg não existe'); return null; }

  const bruto = fs.readFileSync(arquivo, 'utf8');
  const bytes = Buffer.byteLength(bruto);
  const baixo = bruto.toLowerCase();

  const erroXml = xmlBemFormado(bruto);
  if (erroXml) acusar(id, 'svg mal formado: ' + erroXml);

  if (bruto.indexOf('viewBox="0 0 380 420"') < 0)
    acusar(id, 'svg sem viewBox="0 0 380 420"');
  /* sem xmlns o SVG funciona colado no HTML e NAO funciona carregado por
     <img>: o navegador parseia o arquivo como XML e recusa sem namespace.
     Os 14 nasceram assim e a biblioteca abriu com 14 imagens quebradas. */
  if (bruto.indexOf('xmlns="http://www.w3.org/2000/svg"') < 0)
    acusar(id, 'svg sem xmlns (não carrega como arquivo em <img>)');
  if (baixo.indexOf('<title>') < 0) acusar(id, 'svg sem <title>');
  if (baixo.indexOf('<desc>') < 0)  acusar(id, 'svg sem <desc>');
  if (bytes > 15 * 1024)            acusar(id, 'svg com ' + Math.round(bytes / 1024) + ' KB (o teto é 15)');

  PROIBIDO_SVG.forEach(p => {
    if (baixo.indexOf(p) >= 0) acusar(id, 'svg usa "' + p + '", que é proibido');
  });

  const elementos = (bruto.match(/<(rect|circle|ellipse|path|polygon|g)\b/g) || []).length;
  if (elementos > 150) acusar(id, 'svg com ' + elementos + ' elementos (o teto é 150)');
  if (elementos < 12)  acusar(id, 'svg com só ' + elementos + ' elementos: cena pobre demais');

  /* o fundo precisa ser o primeiro elemento, senão a cena fica com buraco */
  if (!/<svg[^>]*>\s*(<title>.*?<\/title>\s*)?(<desc>.*?<\/desc>\s*)?\s*<rect x="0" y="0" width="380" height="420" rx="16"/s.test(bruto))
    avisos.push(id.padEnd(24) + 'o retângulo de fundo não é o primeiro elemento');

  return { bytes, elementos };
}

/* ---------- roda ---------- */

const CATALOGO = require('fs')
  .readFileSync(path.join(__dirname, 'compilar-historias.js'), 'utf8')
  .match(/\{ id: '([^']+)'/g).map(s => s.match(/'([^']+)'/)[1]);

console.log('histórica'.padEnd(24) + 'palavras  sons  ações   svg KB  elem');
console.log('-'.repeat(66));

CATALOGO.forEach(id => {
  const t = validarTexto(id);
  const s = validarSvg(id);
  console.log(
    id.padEnd(24) +
    String(t ? t.palavras : '--').padStart(8) +
    String(t ? t.sons : '--').padStart(6) +
    String(t ? t.acoes : '--').padStart(7) +
    String(s ? (s.bytes / 1024).toFixed(1) : '--').padStart(9) +
    String(s ? s.elementos : '--').padStart(6));
});

console.log();
if (avisos.length) { console.log('avisos (não barram):'); avisos.forEach(a => console.log('  ' + a)); console.log(); }

if (problemas.length) {
  console.log(problemas.length + ' problema(s):');
  problemas.forEach(p => console.log('  ' + p));
  process.exit(1);
}
console.log('as ' + CATALOGO.length + ' histórias passaram em tudo.');
