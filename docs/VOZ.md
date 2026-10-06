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
`todasAsFalas()`, que o script chama: `Jogo.todasAsFalas()` (quiz) e
`Traco.todasAsFalas()` (Escrever). Módulo novo que monta frase com `+`
precisa do mesmo, senão a frase sai sempre na voz do sistema.

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

## A chave

Fica em `~/.elevenlabs-key`, fora do repositório, permissão 600. Nunca entra
no código nem no app publicado. A chave é restrita a Text to Speech e tem
teto de créditos: se vazar, o pior caso é alguém gastar a cota do mês.

Conta gratuita = 10.000 créditos por mês, que **não acumulam**. O app inteiro
custa por volta de 11.000 hoje — **não cabe mais** uma geração completa num mês
só. Gerar só o que falta (o padrão do script) continua barato.
