/* Gera um arquivo de audio por frase do app, usando a ElevenLabs.
   As frases sao lidas dos proprios dados do app, entao acrescentar uma
   palavra nova em data-palavras.js e rodar isso de novo basta.

   Uso:
     export ELEVENLABS_API_KEY="..."
     node ferramentas/gerar-vozes.js --faltam              # o que esta sem voz (nao gasta nada)
     node ferramentas/gerar-vozes.js <voice_id>            # gera so o que falta
     node ferramentas/gerar-vozes.js <voice_id> --amostra  # so 6 frases
     node ferramentas/gerar-vozes.js <voice_id> --contar   # nao gera nada

   Rode --faltam antes de publicar. Frase sem arquivo nao quebra nada (o app
   cai no sintetizador do sistema), mas sai com a voz feia em vez da boa.

   A chave fica so na variavel de ambiente. Nunca entra no repositorio. */

const fs = require('fs'), path = require('path'), crypto = require('crypto');

const RAIZ   = path.join(__dirname, '..');
const DESTINO = path.join(RAIZ, 'audio');
const MODELO = 'eleven_multilingual_v2';
/* mesmos ajustes usados no teste que o Ademir aprovou */
const AJUSTES = { stability: 0.40, similarity_boost: 0.85, style: 0.35, use_speaker_boost: true, speed: 1.0 };

function frases() {
  global.window = { addEventListener() {} };
  global.document = { addEventListener() {}, querySelector: () => null, querySelectorAll: () => [] };
  for (const f of ['js/data-corpo.js', 'js/data-espaco.js', 'js/data-palavras.js'])
    (0, eval)(fs.readFileSync(path.join(RAIZ, f), 'utf8'));

  /* pedaco de codigo nao e frase: o varredor por regex morde trecho de
     expressao, e audio gerado pra isso e credito jogado fora */
  const F = new Set();
  /* vindo dos dados: pode ser palavra solta ("boca", "bê") — sao as opcoes do quiz */
  const add = s => { if (s && String(s).trim()) F.add(String(s).trim()); };
  /* vindo de varredura por regex no codigo: exige cara de frase, senao entram
     pedacos de expressao e argumentos de .replace() */
  const addVarrido = s => {
    if (!s) return; s = String(s).trim();
    if (/[a-zà-ú]/i.test(s) && /\s/.test(s) && !/[(){}\[\]<>=;_]|\+\s*$|^\s*\+/.test(s)) F.add(s);
  };

  for (const tipo of ['partes', 'orgaos']) for (const p of Corpo.lista(tipo)) {
    /* o nome pelado tambem e falado: e o texto das opcoes do quiz */
    add(p.nome);
    add(p.artigo + ' ' + p.nome); add(p.dica); add('Isso! É ' + p.artigo + ' ' + p.nome + '.');
  }
  add('Que parte do corpo é essa?'); add('Que órgão é esse?');

  for (const a of Espaco.ASTROS) {
    add(a.nome); add(Espaco.comArtigo(a)); add('Isso! É ' + Espaco.comArtigo(a) + '.');
    /* era add(a.fato), no singular — campo que nao existe. O dado se chama
       'fatos' e e uma lista, entao isso aqui nunca acrescentou nada e a ficha
       do planeta inteira ficou sem voz. Cada curiosidade tem alto-falante
       proprio, e o emoji da frente nao e falado. */
    for (const f of (a.fatos || [])) add(f.replace(/^\S+\s/, ''));
  }
  add('Que planeta é esse?'); add('Quem é esse?');

  for (const p of Palavras.FASES) {
    add(p.palavra);
    add(p.palavra + '. Que letra está faltando?');
    add('Isso! ' + Palavras.falaDaLetra(p.falta) + ' de ' + p.palavra + '!');
    for (const e of (p.erradas || [])) add(Palavras.falaDaLetra(e));
  }
  for (const l of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') add(Palavras.falaDaLetra(l));

  /* Montada em js/app.js: prefixo fixo + um dos dois ramos. O app fala a
     frase inteira, entao e a inteira que precisa de arquivo — o varredor por
     regex so enxerga os pedacos, por isso as duas estao escritas aqui. */
  for (const ramo of ['São trinta palavras pra descobrir.', 'Você já conheceu várias palavras!'])
    add('Palavras. Complete a palavra com a letra que está faltando. ' + ramo);

  /* Tamanho de Verdade e a ficha do planeta montam a frase na hora a partir
     dos dados. Sao poucas e fixas: da pra calcular igual e gravar todas. */
  for (const a of Espaco.ASTROS) {
    const real = Espaco.REAIS && Espaco.REAIS[a.id];
    const terraKm = Espaco.REAIS && Espaco.REAIS.terra && Espaco.REAIS.terra.km;
    if (real && terraKm) {
      const vezes = real.km / terraKm;
      add(a.nome + '. ' + (vezes >= 1.6
        ? ('É ' + vezes.toFixed(1).replace('.', ' vírgula ') + ' vezes maior que a Terra.')
        : vezes <= 0.62 ? ('Ele cabe ' + Math.round(1 / vezes) + ' vezes dentro da Terra.')
        : 'É quase do tamanho da Terra.'));
    }
    if (a.tag && a.fatos)
      add(a.nome + '. ' + a.tag + '. ' + a.fatos.map(f => f.replace(/^\S+\s/, '')).join(' '));
  }

  /* legendas da galeria e do cineminha: moram em js/app.js, nao nos dados */
  for (const m of fs.readFileSync(path.join(RAIZ, 'js/app.js'), 'utf8').matchAll(/fala:\s*'([^']+)'/g)) addVarrido(m[1]);

  /* pedacos do placar da velha: a frase inteira muda a cada partida, mas
     ela e montada de pedacos fixos, e cada pedaco tem gravacao propria */
  for (const p of ['Xis', 'bolinha', 'e', 'empate', 'empates']) add(p);
  for (const n of ['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez',
                   'onze','doze','treze','quatorze','quinze','dezesseis','dezessete','dezoito',
                   'dezenove','vinte']) add(n);

  for (const m of fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8').matchAll(/data-falar="([^"]+)"/g)) addVarrido(m[1]);
  for (const f of ['js/app.js', 'js/game.js', 'js/velha.js']) {
    const src = fs.readFileSync(path.join(RAIZ, f), 'utf8');
    for (const m of src.matchAll(/Som\.falar\('([^']+)'/g)) addVarrido(m[1]);
    /* dataset.falar = '...' nasce em JS e nao aparece no HTML. Faltava varrer
       isso, e por causa disso cinco frases sairam com a voz do sistema.
       Literal colado num + e pedaco de frase montada com numero ("Você tem "
       + n + " estrelinhas!") — gerar audio pra pedaco e desperdicio, porque
       o app nunca vai pedir o pedaco sozinho. */
    /* Frase montada numa variavel e so depois passada pro Som.falar():
       era o caso do fim de quiz e de todos os avisos do jogo da velha, que
       por isso sairam na voz do sistema justo na hora de ganhar. */
    for (const m of src.matchAll(/\bfala\s*=\s*[^;]*/g)) {
      const expr = m[0];
      for (const lit of expr.matchAll(/'([^']{4,})'/g)) {
        const antes = expr.slice(0, lit.index).trimEnd();
        const depois = expr.slice(lit.index + lit[0].length).trimStart();
        if (antes.endsWith('+') || depois.startsWith('+')) continue;
        addVarrido(lit[1]);
      }
    }
    for (const m of src.matchAll(/dataset\.falar\s*=[^;]*/g)) {
      const expr = m[0];
      for (const lit of expr.matchAll(/'([^']{4,})'/g)) {
        const antes = expr.slice(0, lit.index).trimEnd();
        const depois = expr.slice(lit.index + lit[0].length).trimStart();
        if (antes.endsWith('+') || depois.startsWith('+')) continue;
        addVarrido(lit[1]);
      }
    }
  }

  return [...F].sort();
}

/* mesma normalizacao do js/audio.js — se as duas divergirem, o app nao acha o arquivo */
const chave = t => String(t).replace(/\s+/g, ' ').trim().toLowerCase();
const nomeArquivo = t => crypto.createHash('sha1').update(chave(t)).digest('hex').slice(0, 12) + '.mp3';

async function gerar(texto, voz, apiKey) {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz}?output_format=mp3_44100_64`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texto, model_id: MODELO, voice_settings: AJUSTES })
  });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
  return Buffer.from(await r.arrayBuffer());
}

(async () => {
  const voz = process.argv[2];
  const amostra = process.argv.includes('--amostra');
  const soContar = process.argv.includes('--contar');
  const todas = frases();
  const letras = todas.reduce((n, s) => n + s.length, 0);

  /* --faltam: confere o que ainda nao tem arquivo. Sai com codigo 1 se faltar
     alguma coisa, pra dar pra usar num gancho de pre-commit se um dia quiser. */
  if (process.argv.includes('--faltam')) {
    const indicePath = path.join(DESTINO, 'indice.json');
    const indice = fs.existsSync(indicePath) ? JSON.parse(fs.readFileSync(indicePath, 'utf8')) : {};
    const semVoz = todas.filter(t => {
      const arq = indice[chave(t)];
      return !arq || !fs.existsSync(path.join(DESTINO, arq));
    });
    if (!semVoz.length) { console.log(`Todas as ${todas.length} frases tem voz gravada.`); return; }
    console.log(`${semVoz.length} de ${todas.length} frases estao sem voz (${semVoz.reduce((n, s) => n + s.length, 0)} creditos para gerar):\n`);
    for (const t of semVoz) console.log('  ' + t);
    console.log(`\nPara gerar: node ferramentas/gerar-vozes.js <voice_id>`);
    process.exitCode = 1;
    return;
  }

  if (soContar || !voz) {
    console.log(`${todas.length} frases, ${letras} caracteres (~${letras} creditos)`);
    if (!voz && !soContar) console.log('\nFalta o voice_id: node ferramentas/gerar-vozes.js <voice_id>');
    return;
  }
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) { console.error('Falta ELEVENLABS_API_KEY no ambiente.'); process.exit(1); }

  const alvo = amostra
    ? ['Que parte do corpo é essa?', 'Isso! É o coração.',
       'O coração bate e empurra o sangue pro corpo todo.', 'A boca fala, come e dá beijo!',
       'Por dentro. Os órgãos que ficam escondidos: coração, pulmão, estômago, rim.',
       'Aqui o que vale é a distância. Arraste o dedo pra viajar do Sol até Netuno.']
    : todas;

  fs.mkdirSync(DESTINO, { recursive: true });
  const indicePath = path.join(DESTINO, 'indice.json');
  const indice = fs.existsSync(indicePath) ? JSON.parse(fs.readFileSync(indicePath, 'utf8')) : {};

  let feitas = 0, puladas = 0, gastos = 0;
  for (const t of alvo) {
    const arq = nomeArquivo(t);
    if (fs.existsSync(path.join(DESTINO, arq))) { indice[chave(t)] = arq; puladas++; continue; }
    try {
      fs.writeFileSync(path.join(DESTINO, arq), await gerar(t, voz, apiKey));
      indice[chave(t)] = arq; feitas++; gastos += t.length;
      process.stdout.write(`\r${feitas} geradas, ${puladas} ja existiam  (${gastos} creditos)   `);
    } catch (e) {
      console.error(`\nFALHOU: ${t.slice(0, 50)} -> ${e.message}`);
      process.exit(1);                      /* para na hora: nao queima credito errado em silencio */
    }
    await new Promise(r => setTimeout(r, 250));   /* respeita o limite de requisicoes */
  }
  fs.writeFileSync(indicePath, JSON.stringify(indice, null, 1));
  console.log(`\nPronto: ${feitas} geradas, ${puladas} reaproveitadas, ${gastos} creditos gastos.`);
})();
