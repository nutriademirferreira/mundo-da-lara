# Mundo da Lara 🌈

App de jogos educativos feito para a Lara (5 anos). Roda no navegador do celular e
pode ser instalado na tela de início como se fosse um aplicativo (PWA, funciona offline).

## O que tem hoje

**Corpo Humano**
- *Aprender*: toca em qualquer parte da boneca, o nome aparece grandão e é falado em voz alta.
- *Jogar Quiz*: 10 rodadas — a parte acende no corpo e a criança escolhe entre 3 nomes escritos.

**Sistema Solar**
- *Explorar*: viagem lateral do Sol até Netuno; toca no astro e ouve o nome + 2 curiosidades.
- *Jogar Quiz*: 9 rodadas — aparece o astro desenhado e a criança escolhe entre 3 nomes.

Cada acerto de primeira vale uma estrelinha, guardada no próprio aparelho.
Errar não tira ponto nem trava nada: o app fala "quase, tenta de novo" e deixa tentar.

## Como mexer

Tudo é HTML/CSS/JS puro, sem build e sem dependência externa.

| Quero... | Mexo em |
|---|---|
| Trocar/incluir parte do corpo | `js/data-corpo.js` — lista `PARTES` (nome, artigo, área da elipse, dica) |
| Trocar/incluir planeta ou curiosidade | `js/data-espaco.js` — lista `ASTROS` |
| Mudar as regras do quiz | `js/game.js` |
| Mudar cor, tamanho de botão, layout | `css/style.css` |

O quiz, o placar e as telas se ajustam sozinhos ao tamanho das listas.

## Publicar

O site é servido pelo GitHub Pages na raiz do repositório.
Depois de qualquer alteração, subir a versão do cache em `sw.js` (`mundo-da-lara-v1` → `v2`)
para o celular baixar os arquivos novos.
