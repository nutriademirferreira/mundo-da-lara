# Mundo da Lara — o que gerar na plataforma de imagens

Documento de produção. Você gera, salva com o nome exato da tabela, joga na pasta `img/`
e me avisa. Eu converto, comprimo e ligo no app.

## As três regras que não podem ser quebradas

**1. Fundo é atmosfera, nunca detalhe.** O que a criança toca (boneca, planeta, letras, peças
do jogo da velha) tem que continuar sendo a coisa mais nítida da tela. Fundo carregado no meio
da tela destrói a leitura e piora o app. Por isso todo prompt abaixo pede *centro vazio,
detalhe só nas bordas, baixo contraste*.

**2. Vertical.** Tudo em 9:16 (1080 × 1920). Se a plataforma só faz quadrado, gera quadrado
que eu corto — mas avisa, porque aí eu preciso de margem sobrando.

**3. Sem texto nenhum.** Nada de letra, número ou logo dentro da imagem. IA escreve errado e
num app de alfabetização isso confunde a criança de verdade.

## Estilo — cole isso no fim de todo prompt

```
3D animated feature film style, Pixar / DreamWorks look, soft global illumination,
warm cinematic lighting, vibrant but gentle colors, subtle depth of field,
child-friendly, cozy, no text, no letters, no logos, no people, no characters,
vertical composition 9:16
```

## Parte 1 — fundos de tela (5 imagens, essenciais)

| Arquivo | Tela | Prompt |
|---|---|---|
| `fundo-inicio.png` | Abertura "Começar" | `magical night sky over rolling hills, glowing stars and a soft milky way, deep violet and indigo, fireflies, dreamy and calm, empty dark center area for text, detail only near the edges` |
| `fundo-home.png` | Menu dos 4 jogos | `soft daytime sky with fluffy rounded clouds, pastel lilac and pink, gentle sunlight, very low contrast, mostly empty sky in the middle, small clouds only at top and bottom corners` |
| `fundo-corpo.png` | Corpo humano | `cozy children bedroom seen from far away, blurred out of focus, warm pastel pink and cream, soft toys on a shelf, very soft and dreamy, empty clean space in the center` |
| `fundo-espaco.png` | Sistema solar | `deep space nebula, purple blue and magenta clouds of gas, distant stars, dark and cinematic, plenty of empty dark space in the middle, glow only at the edges` |
| `fundo-velha.png` | Jogo da velha | `interior of a fairytale castle hall, warm stone walls, tall windows with golden light, banners and torches, cozy and friendly not scary, empty stone floor in the center` |

## Parte 2 — cenários das palavras (5 imagens)

Não é um fundo por palavra: é um cenário por **família de palavras**. Os desenhos atuais
continuam por cima, só ganham um lugar pra estar.

| Arquivo | Palavras que usam | Prompt |
|---|---|---|
| `cena-fazenda.png` | gato · pato · sapo · vaca · porco · rato · galo · abelha · flor · urso | `sunny farm yard, green grass, wooden fence, small red barn far in the background, blue sky, very soft focus on the background, empty grass area in the center` |
| `cena-ceu.png` | sol · lua · nuvem | `wide open sky at golden hour, gradient from warm orange to soft blue, a few tiny distant clouds at the bottom, completely empty in the middle` |
| `cena-cozinha.png` | ovo · uva · pera · banana · suco · pizza · pipoca · bolo · copo | `warm wooden kitchen table seen from the front, cozy home kitchen blurred in the background, morning light, empty table surface in the center` |
| `cena-quarto.png` | bola · casa · cama · livro · carro · trem | `child playroom floor, soft rug, pastel wall with a shelf of toys blurred in the background, warm light, empty floor space in the center` |
| `cena-agua.png` | peixe · barco | `calm blue lake surface with gentle ripples, soft sunlight reflections, distant green shore blurred, empty water in the center` |

## Parte 3 — planetas em estilo Pixar (teste 1, depois os 10)

**Comece só pelo Saturno.** Me manda, eu coloco no app ao lado do atual e você compara.
Se gostar, geramos os outros nove; se não, a gente para e economiza o trabalho.

Formato aqui é diferente: **quadrado 1024 × 1024, planeta centralizado, fundo preto puro**
(preto sólido, não estrelado — eu recorto e ponho no céu do app).

| Arquivo | Prompt |
|---|---|
| `planeta-saturno.png` | `Saturn as a cute 3D animated planet, Pixar style, soft rounded shape, creamy golden bands, wide icy rings, glossy toy-like surface, friendly and inviting, dramatic rim light, centered, pure solid black background, no stars, no text` |

Os outros nove seguem o mesmo prompt trocando o corpo: `Sun` (estrela dourada brilhante),
`Mercury` (cinza craterado), `Venus` (amarelo nublado), `Earth` (azul com continentes verdes e
nuvens), `Mars` (vermelho poeirento com calota polar), `Jupiter` (bandas laranja + grande mancha
vermelha), `Uranus` (ciano claro), `Neptune` (azul profundo).

## O que eu faço quando receber

1. Converto pra WebP e comprimo — meta: o app inteiro fica abaixo de 5 MB pra continuar
   abrindo instantâneo e funcionando offline.
2. Aplico uma camada de legibilidade por cima de cada fundo (escurecer ou clarear conforme a
   tela), pra garantir que texto e botão continuem legíveis.
3. Ligo cada imagem na tela certa, atualizo a lista de cache offline e subo a versão.
4. Testo nas duas alturas de tela (iPhone SE e iPhone grande) antes de publicar.

## Ordem que eu sugiro

1. `fundo-velha.png` (castelo) — é a tela mais fácil e o efeito é imediato
2. `fundo-espaco.png` + `planeta-saturno.png` — decide o rumo dos planetas
3. Os outros três fundos de tela
4. As cinco cenas das palavras
5. Os nove planetas restantes, só se o teste do Saturno agradar
