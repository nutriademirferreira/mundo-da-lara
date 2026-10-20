# A voz do app

A Lara não lê. Tudo o que o app ensina, ele fala. Por isso a voz não é
enfeite: é a interface.

## Como funciona

As frases do app são **finitas e conhecidas** — 416 em outubro de 2026. Mesmo
as que parecem montadas na hora ("Isso, Lara! É o coração.", "Vamos fazer a
letra bê!") vêm de listas fixas em `js/data-*.js`. Então cada frase tem um
arquivo gravado.

`Som.falar(texto)` faz assim:

1. Procura o texto em `audio/indice.json`
2. Achou → toca `audio/<arquivo>.mp3` (a voz boa)
3. Não achou → fala pelo sintetizador do sistema (a voz feia)

O passo 3 é a rede de segurança. **Frase nova nunca fica muda** — sai com a
voz ruim até alguém gerar o arquivo dela.

## A voz

Criada no Voice Design da ElevenLabs, chamada "Mundo da Lara".

| | |
|---|---|
| voice_id | `rduLEaK1k4q8RJYHyO5R` |
| Modelo | `eleven_multilingual_v2` |
| Stability | 0,40 |
| Similarity | 0,85 |
| Style | 0,35 |
| Speed | 1,0 |

Os ajustes estão no topo de `ferramentas/gerar-vozes.js`. Mudar qualquer um
deles só vale a pena junto com apagar `audio/` inteiro e gerar tudo de novo —
metade das frases num ajuste e metade noutro fica audivelmente desencontrado.

## Quando acrescentar palavra ou tela nova

O script lê as frases dos próprios dados do app, então ele descobre sozinho
o que é novo. Não existe lista paralela pra manter.

Frase montada com `+` ("Vamos fazer a letra " + letra) o varredor não
enxerga. Por isso quem monta frase assim também a exporta numa função
`todasAsFalas()`, que o script chama: `Jogo.todasAsFalas()` (quiz),
`Traco.todasAsFalas()` (as letras do Escrever) e `Silabario.todasAsFalas()`
(as sílabas). Módulo novo que monta frase com `+` precisa do mesmo **e** de
entrar na lista de `eval` do gerador, senão nasce mudo e o verificador jura
que está tudo certo.

Palavra solta ("sapo", "rato", "á") vai pra ElevenLabs em minúscula, com
ponto final e com `previous_text: "Em português do Brasil:"`. Sem isso o
modelo lia com fonética de inglês ou espanhol — "sapo" saía "cipo".

## Conferir a pronúncia sem ouvir uma por uma

```bash
python3 ferramentas/ouvir.py "vamos fazer a letra bê!|sapo"   # frases escolhidas
python3 ferramentas/ouvir.py --letras                          # as 26 letras soltas
```

O whisper transcreve e o script compara com o texto. Instruções e limites
dele no topo do arquivo — o principal: em letra solta ele erra até com voz
certa ("ene", "erre", "gê", "xis"), então ali o ouvido decide.

**Cada geração é um sorteio.** O mesmo texto sai certo numa tomada e errado
na outra: "ó." saiu "pô", "uá" e "ó" em três tomadas seguidas. Quando o
whisper acusa, gere duas ou três tomadas e fique com a que ele ouve certo —
foi assim com á, ó, agá, éle, pê e as frases da letra i, em outubro de 2026.
Grafia que ajudou de verdade fica em `PRONUNCIA`, no gerador (muda só o
texto enviado, nunca a chave): a letra i entre aspas no meio da frase, e
"pê!" com exclamação.

```bash
# 1. o que está sem voz? (não gasta crédito nenhum)
node ferramentas/gerar-vozes.js --faltam

# 2. gerar só o que falta
ELEVENLABS_API_KEY="$(cat ~/.elevenlabs-key)" \
  node ferramentas/gerar-vozes.js rduLEaK1k4q8RJYHyO5R
```

Rodar de novo sem nada faltando custa zero: ele pula todo arquivo que já
existe. **Rode `--faltam` antes de publicar.**

Depois de gerar, suba a versão do cache em `sw.js` — senão quem já tem o app
instalado continua com o índice antigo e não ouve as falas novas.

## Sílaba solta de duas letras

Minúscula + ponto + `previous_text` resolveu o problema de **idioma** ("uva"
saindo "O.V.A.", "sapo" saindo "cipo"), que é de palavra de 4 a 6 letras. Não
resolve o de **duas** letras, que é outro: um token de dois caracteres tem três
leituras concorrendo e o contexto não desempata — sílaba portuguesa, palavra
inglesa e sigla.

A prova está no próprio histórico daqui: tudo que precisou de grafia especial
ou de várias tomadas (á, ó, agá, éle, pê, i) tem de uma a três letras.

E o erro que importa não é soar robótico: é **"be" sair com o /bi/ do inglês**,
que é exatamente a sílaba BI do cartão vizinho. Ela aprenderia o par letra-som
trocado, e nada na tela denunciaria.

Por isso as 29 grafias novas em `PRONUNCIA`, no gerador. Elas mudam só o texto
enviado, nunca a chave do índice — o app continua pedindo "be". Onde dava, a
grafia mandada é uma que **já foi aprovada de ouvido** (bê, cê, dê, gê, pê, tê,
vê, zê, quê, cá) ou uma palavra de verdade (já, nó, só, dó, tô, fé, né, ré,
mé, lê, chá):

- **coluna do E** — o nome da letra *é* a sílaba: "bê" é /be/, igual a BE. Só
  vale nas letras cujo nome é consoante + ê
- **JE → gê** e **SE → cê** — em português JE e GE são o mesmo /ʒe/, e SE e CE
  o mesmo /se/. Mandar a grafia irmã entrega o som certo com texto conferido
- **coluna do O** — "no", "so", "go", "do", "to" são palavras inglesas de mesma
  grafia, e a leitura inglesa cai em cima de outra sílaba
- **família do X → CH** — o X inicial é /ʃ/ (xícara, xarope), o mesmo som do
  CH. Sozinho, o X sai /ks/, /z/ ou /s/

### Cortar a sílaba de dentro da frase não funciona

Tentei, pra não gastar crédito: a frase *"A família do bê: ba, be, bi, bo,
bu."* já tem as cinco sílabas na voz boa, lidas como português. **Só separa nas
famílias de consoante oclusiva** — b, d, q e f dão cinco trechos limpos de
0,2 s a 0,3 s, com as vírgulas abrindo uma pausa de uns 0,14 s. As outras onze
(c, g, j, l, m, n, r, s, v, x, z) o modelo lê em **legato**, sem silêncio
nenhum entre as sílabas: varri cinco limiares (-25 a -45 dB) e nenhum separa.
Não insista — cortar no meio de um fonema tira o /f/ de "fa" e sobra "a", que é
erro que ninguém vê.

### Triagem de graça, por duração

Leitura por sigla deixa marca no tempo, e tempo não custa nada pra medir. As
falas de uma sílaba que existem no app duram de 0,37 s a 0,65 s. Um "ba" lido
"B.A." são dois nomes de letra, por volta de 1,0 s. Um clipe cortado no começo
cai abaixo de 0,35 s.

```bash
python3 - <<'EOF'
import json,subprocess
idx=json.load(open('audio/indice.json',encoding='utf-8'))
alvo=[k for k in idx if 2<=len(k)<=3 and ' ' not in k]
r=[(float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration',
   '-of','csv=p=0','audio/'+idx[k]],capture_output=True,text=True).stdout or 0),k) for k in alvo]
[print('%5.2f s  %s'%x) for x in sorted(r,reverse=True)]
EOF
```

Ouça o que estiver acima de 0,70 s ou abaixo de 0,35 s. São dez, não cem.

## A cota estourou em 20/10/2026

No meio da geração das Sílabas: **67 gravadas, e parou com 7 créditos
restando** de 10.000. Ficou gravado o que mais importa — as 18 frases de
família, as 25 confirmações do Juntar ("Isso, Lara! Você leu Bola!") e 19 dos
25 pedidos — e ficaram de fora as **90 sílabas soltas**, que é justo o som que
a tela existe pra ensinar, mais 6 pedidos e uma frase de menu.

Até a cota virar, essas 97 saem no sintetizador do sistema: feio, mas em
português e com o som certo (o sintetizador erra pouco em sílaba, porque lê por
regra). Pra fechar, **405 créditos**:

```bash
ELEVENLABS_API_KEY="$(cat ~/.elevenlabs-key)"   node ferramentas/gerar-vozes.js rduLEaK1k4q8RJYHyO5R
```

A ordem alfabética do gerador ajuda de propósito: as frases (maiúsculas) saem
primeiro e as sílabas soltas (minúsculas) por último, então uma geração
interrompida deixa o rabo faltando, nunca buraco no meio.

Conferido de ouvido pelo whisper nas 18 frases de família: nenhuma tomada saiu
grosseiramente errada, e várias confirmam exato ("Fá, fé, fi, fo, fu", "Xa xe
xi xo xu", "A, E, I, O, U"). O whisper entra em laço de repetição quando a
frase é uma lista de sílabas parecidas (B, V, L, S e R saíram "B, B, B, B") —
isso é defeito dele, não da gravação; o B transcreveu perfeito quando testado
sozinho.

## A chave

Fica em `~/.elevenlabs-key`, fora do repositório, permissão 600. Nunca entra
no código nem no app publicado. A chave é restrita a Text to Speech e tem
teto de créditos: se vazar, o pior caso é alguém gastar a cota do mês.

Conta gratuita = 10.000 créditos por mês, que **não acumulam**. O app inteiro
custa por volta de 11.000 hoje — **não cabe mais** uma geração completa num mês
só. Gerar só o que falta (o padrão do script) continua barato.
