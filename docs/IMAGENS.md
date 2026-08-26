# Mundo da Lara — o que gerar no Midjourney

Você gera, salva com o nome exato da tabela, joga na pasta `img/` e me avisa.
Eu converto, comprimo e ligo no app.

## As três regras que não podem ser quebradas

**1. Fundo é atmosfera, nunca detalhe.** O que a criança toca (boneca, planeta, letras, peças
do jogo da velha) tem que continuar sendo a coisa mais nítida da tela. Por isso todo prompt
pede *empty center* — centro vazio, detalhe só nas bordas.

**2. O `--no` é tão importante quanto o prompt.** Na cena da fazenda eu peço `--no animals`
porque o pato e a vaca já vêm por cima; na cozinha, `--no food`; no céu, `--no sun, moon`.
Sem isso o Midjourney enche a cena de coisa que briga com o desenho da palavra.

**3. Sem texto nenhum.** IA escreve errado e num app de alfabetização isso atrapalha de verdade.

## Parâmetros usados

| Parâmetro | Por quê |
|---|---|
| `--ar 9:16` | Tela de celular em pé. Nos planetas troca pra `--ar 1:1` |
| `--s 150` | Stylize baixo: o Midjourney obedece mais e inventa menos |
| `--v 7` | Se sua conta reclamar da versão, é só apagar esse trecho |
| `--no ...` | Lista do que não pode aparecer |

Na hora de salvar: use **Upscale (Subtle)** e baixe em PNG.

## Parte 1 — fundos de tela

### `fundo-inicio.png` — tela de abertura

```
magical night sky over rolling hills, glowing stars and soft milky way, deep violet and indigo, fireflies, calm and dreamy, large empty dark area in the middle, detail only near the edges, 3D animated feature film style, Pixar DreamWorks look, soft global illumination, gentle vibrant colors, cozy and child friendly --ar 9:16 --no text, letters, numbers, logo, people, characters --s 150 --v 7
```

### `fundo-home.png` — menu dos 4 jogos

```
soft daytime sky with fluffy rounded clouds, pastel lilac and pink, gentle sunlight, very low contrast, mostly empty sky in the middle, small clouds only in the top and bottom corners, 3D animated feature film style, Pixar DreamWorks look, soft global illumination, cozy and child friendly --ar 9:16 --no text, letters, numbers, logo, people, characters --s 150 --v 7
```

### `fundo-corpo.png` — corpo humano

```
cozy children bedroom seen from a distance, blurred and out of focus, warm pastel pink and cream, soft toys on a shelf, dreamy and calm, clean empty space in the center, 3D animated feature film style, Pixar DreamWorks look, soft global illumination, cozy and child friendly --ar 9:16 --no text, letters, numbers, logo, people, characters --s 150 --v 7
```

### `fundo-espaco.png` — sistema solar

```
deep space nebula, purple blue and magenta gas clouds, distant stars, cinematic and dark, large empty dark space in the middle, glow only near the edges, 3D animated feature film style, Pixar DreamWorks look, gentle vibrant colors, child friendly --ar 9:16 --no text, letters, numbers, logo, people, characters, planets --s 150 --v 7
```

### `fundo-velha.png` — jogo da velha

```
interior of a fairytale castle hall, warm stone walls, tall windows with golden light, colorful banners and torches, cozy and friendly not scary, empty stone floor in the center, 3D animated feature film style, Pixar DreamWorks look, soft global illumination, warm cinematic light, child friendly --ar 9:16 --no text, letters, numbers, logo, people, characters --s 150 --v 7
```

## Parte 2 — cenários das palavras

Não é um fundo por palavra: é um por família. Os 30 desenhos atuais continuam por cima.

### `cena-fazenda.png` — gato · pato · sapo · vaca · porco · rato · galo · abelha · flor · urso

```
sunny farm yard, green grass, wooden fence, small red barn far in the background, blue sky, background softly blurred, empty grass area in the center, 3D animated feature film style, Pixar DreamWorks look, soft global illumination, gentle vibrant colors, child friendly --ar 9:16 --no text, letters, numbers, logo, people, characters, animals --s 150 --v 7
```

### `cena-ceu.png` — sol · lua · nuvem

```
wide open sky at golden hour, gradient from warm orange to soft blue, a few tiny distant clouds near the bottom, completely empty in the middle, 3D animated feature film style, Pixar DreamWorks look, soft light, child friendly --ar 9:16 --no text, letters, numbers, logo, people, characters, sun, moon --s 150 --v 7
```

### `cena-cozinha.png` — ovo · uva · pera · banana · suco · pizza · pipoca · bolo · copo

```
warm wooden kitchen table seen from the front, cozy home kitchen blurred in the background, morning light, completely empty table surface in the center, 3D animated feature film style, Pixar DreamWorks look, soft global illumination, cozy and child friendly --ar 9:16 --no text, letters, numbers, logo, people, characters, food, plates --s 150 --v 7
```

### `cena-quarto.png` — bola · casa · cama · livro · carro · trem

```
child playroom floor, soft rug, pastel wall with a shelf blurred in the background, warm light, empty floor space in the center, 3D animated feature film style, Pixar DreamWorks look, soft global illumination, cozy and child friendly --ar 9:16 --no text, letters, numbers, logo, people, characters, toys --s 150 --v 7
```

### `cena-agua.png` — peixe · barco

```
calm blue lake surface with gentle ripples, soft sunlight reflections, distant green shore blurred, empty water in the center, 3D animated feature film style, Pixar DreamWorks look, soft light, child friendly --ar 9:16 --no text, letters, numbers, logo, people, characters, boats, fish --s 150 --v 7
```

## Parte 3 — planetas em estilo Pixar

**Gere só o Saturno primeiro.** Eu coloco no app ao lado do atual, você compara no celular e
decide se vale gerar os outros nove. Aqui é quadrado e fundo preto puro (eu recorto).

### `planeta-saturno.png`

```
Saturn as a cute 3D animated planet, Pixar style, soft rounded glossy shape, creamy golden bands, wide icy rings, toy-like surface, friendly and inviting, dramatic rim light, centered composition, pure solid black background --ar 1:1 --no text, letters, logo, stars, nebula, spaceship --s 200 --v 7
```

Os outros nove usam o mesmo prompt trocando só o começo:

| Arquivo | Troque o início por |
|---|---|
| `planeta-sol.png` | `the Sun as a cute 3D animated glowing star, warm golden and orange plasma surface` |
| `planeta-mercurio.png` | `Mercury as a cute 3D animated planet, grey cratered rocky surface` |
| `planeta-venus.png` | `Venus as a cute 3D animated planet, creamy yellow swirling clouds` |
| `planeta-terra.png` | `Earth as a cute 3D animated planet, blue oceans, green continents, white swirling clouds` |
| `planeta-marte.png` | `Mars as a cute 3D animated planet, dusty red orange surface, small white polar cap` |
| `planeta-jupiter.png` | `Jupiter as a cute 3D animated planet, orange and cream cloud bands, great red spot` |
| `planeta-urano.png` | `Uranus as a cute 3D animated planet, pale cyan smooth surface, thin vertical ring` |
| `planeta-netuno.png` | `Neptune as a cute 3D animated planet, deep blue surface, soft cloud streaks` |

## O que eu faço quando receber

1. Converto pra WebP e comprimo — meta: app inteiro abaixo de 5 MB, pra continuar abrindo
   instantâneo e funcionando offline.
2. Aplico camada de legibilidade sobre cada fundo, garantindo texto e botão legíveis.
3. Ligo cada imagem na tela certa, atualizo o cache offline e subo a versão.
4. Testo nas duas alturas de tela (iPhone SE e iPhone grande) antes de publicar.

## Ordem sugerida

1. `fundo-velha.png` — tela mais simples, efeito imediato
2. `fundo-espaco.png` + `planeta-saturno.png` — decide o rumo dos planetas
3. Os outros três fundos de tela
4. As cinco cenas das palavras
5. Os nove planetas restantes, só se o Saturno agradar
