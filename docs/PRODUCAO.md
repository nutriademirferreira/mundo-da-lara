# Mundo da Lara — linha de produção

Duas trilhas correndo em paralelo: **você gera imagem**, **eu construo tela**.
Elas só se encontram no fim de cada fase.

## Como entregar as imagens

1. Baixe do Midjourney sempre a versão **Upscale**, nunca a grade de 4
2. Jogue tudo em `~/Downloads` — **não precisa renomear nada**
3. Me avise

Eu identifico cada arquivo, renomeio, converto pra WebP, comprimo, ligo na tela certa,
atualizo o cache offline e publico.

---

## Fase 1 — Encanamento + primeiras imagens

O trabalho invisível que todas as outras fases dependem: criar a camada de fundo do app
(posicionamento, camada de legibilidade, pipeline de compressão, cache offline).

| Você | Eu |
|---|---|
| Baixar `cena-cozinha`, `cena-agua` e `planeta-saturno` (a 4ª) | Construir a camada de fundo |
| | Ligar a cozinha alinhando a mesa embaixo do desenho + sombra sob os objetos |
| | Pôr o Saturno lado a lado com o atual pra você julgar no celular |

**Fim da fase:** você decide se os planetas do Midjourney entram ou se ficamos com os vetores.

---

## Fase 2 — As telas ganham lugar

| Você | Eu |
|---|---|
| Gerar os 5 fundos de tela: `velha` (castelo), `espaco`, `inicio`, `home`, `corpo` | Ligar cada uma, ajustar contraste tela por tela |
| Gerar as 3 cenas que faltam: `fazenda`, `ceu`, `quarto` | Testar nas duas alturas de tela |

**Ordem dentro da fase:** castelo primeiro (efeito imediato), espaço depois.

---

## Fase 3 — O espaço vira espetáculo

| Você | Eu |
|---|---|
| Gerar os 9 planetas restantes com o prompt calibrado pela luz do Saturno | Normalizar o tamanho de cada bola pra proporção não virar mentira |
| | Parallax: fundo andando mais devagar que os planetas |
| | Conferir se Urano e Netuno não saíram gêmeos demais pro quiz |

Os 9 prompts calibrados eu te mando quando a fase começar.

---

## Fase 4 — A Lara entra como personagem

| Você | Eu |
|---|---|
| Gerar `lara-oi` com a foto dela | Recortar o que precisar de recorte |
| Escolher a melhor e gerar as outras 3 usando ELA como referência | Entrada deslizante de 1 segundo ao abrir cada jogo |
| Remover fundo no Finder (Ações Rápidas) | Lara grande na tela de parabéns |

---

## Fase 5 — Telas novas de conteúdo

**Não depende de você.** Eu construo enquanto você gera as imagens das outras fases.

| Tela | O que é |
|---|---|
| **Tamanho de Verdade** | Os 8 planetas em proporção real entre si, arrastando pro lado, com o Sol entrando como um arco gigante que não cabe na tela |
| **A Viagem** | Distância até cada planeta com foguete e barra de progresso — sente a distância sem precisar de 37 mil arrastadas |

Começam com os planetas vetoriais atuais e recebem as artes novas quando a fase 3 fechar.

---

## Estado

| Fase | Situação |
|---|---|
| 1 | ✅ **No ar** — camada de fundo, véus, 19 imagens em WebP, cenários das palavras |
| 2 | ✅ **No ar** junto com a 1 — os 5 fundos e 4 das 5 cenas. Falta só `cena-quarto` |
| 3 | ✅ **No ar** — os 9 planetas + Sol trocados. Falta parallax e o teste de morfagem |
| 4 | Imagens da Lara geradas e escolhidas; falta recortar o fundo e ligar nas telas |
| 5 | Não iniciada — Tamanho de Verdade e A Viagem |

## Onde ficam os arquivos

| Pasta | O quê |
|---|---|
| `~/Pictures/Mundo da Lara/brutas/` | as 123 imagens cruas do Midjourney |
| `~/Pictures/Mundo da Lara/contato/` | folhas de contato pra comparar variações |
| `~/Pictures/Lara/referencias/` | fotos da Lara — **nunca** vão pro repositório, que é público |
| `mundo-da-lara/img/` | só os WebP finais que o app carrega |
| `mundo-da-lara/img/manifesto.json` | qual variação foi escolhida em cada grupo |
