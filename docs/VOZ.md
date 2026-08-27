# A voz do app

A Lara não lê. Tudo o que o app ensina, ele fala. Por isso a voz não é
enfeite: é a interface.

## Como funciona

As frases do app são **finitas e conhecidas** — 228 no total. Mesmo as que
parecem montadas na hora ("Isso! É o coração.", "Isso! B de BOLA!") vêm de
listas fixas em `js/data-*.js`. Então cada frase tem um arquivo gravado.

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
custa 4.399. Cabe uma geração completa por mês com folga.
