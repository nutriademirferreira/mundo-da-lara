# Mundo da Lara 🌈

**No ar:** https://nutriademirferreira.github.io/mundo-da-lara/

App de jogos educativos feito para a Lara (5 anos). Roda no navegador do celular e
pode ser instalado na tela de início como se fosse um aplicativo (PWA, funciona offline).

## O que tem hoje

**Corpo Humano** — dois grupos
- *Por fora*: as 10 partes visíveis (cabelo, olho, orelha, nariz, boca, braço, mão, barriga, perna, pé).
- *Por dentro*: os 10 órgãos (cérebro, pulmão, coração, fígado, estômago, baço, pâncreas, rim,
  intestino, bexiga), num corpo translúcido com os órgãos no lugar certo.
- Cada grupo tem *Aprender* (toca e ouve o nome + o que aquilo faz) e *Jogar Quiz* (10 rodadas,
  a parte acende e a criança escolhe entre 3 nomes escritos).

**Sistema Solar**
- *Explorar*: viagem lateral do Sol até Netuno; toca no astro e ouve o nome + 2 curiosidades.
- *Jogar Quiz*: 9 rodadas — aparece o astro desenhado e a criança escolhe entre 3 nomes.

**Palavras** — 10 fases por sessão, sorteadas de um banco de 30
- Aparece o desenho, a palavra em letra bastão com uma letra faltando, e 3 letras pra escolher.
  Acertou, a letra cai na lacuna.
- O banco tem 30 palavras com 30 desenhos. Cada sessão tira 10 de um baralho embaralhado e
  guarda o resto: em 3 sessões ela passa pelas 30 sem repetir nenhuma, e só então o baralho
  vira de novo.

**Jogo da Velha**
- Contra o app (que joga fácil de propósito) ou dois jogadores no mesmo celular.
  A Lara é o ✗ e sempre começa. Vitória dela vale estrelinha.
- Placar de sessão no topo (✗ / empates / ◯): acumula enquanto ela fica na tela e zera
  quando sai. "Jogar de novo" mantém o placar.
- O app **não fala de quem é a vez** — só anuncia o fim: "o xis ganhou", "a bolinha ganhou"
  ou "deu velha". Quem quiser ouvir a vez ou o placar toca no alto-falante.

**Tudo é ouvível.** Como a Lara ainda não lê, todo lugar com informação escrita tem um
alto-falante do lado: cada uma das 3 opções do quiz, os cartões da tela inicial, os modos de
jogo, o nome de cada planeta, cada curiosidade da ficha, a contagem de estrelinhas e o
resultado final. Tocar no alto-falante de uma opção **não responde** a pergunta — só lê em voz
alta o que está escrito ali, para ela comparar com o que vê na tela.

O botão 🎵 no topo da tela inicial é outra coisa: liga e desliga todo o som do app.

Cada acerto de primeira vale uma estrelinha, guardada no próprio aparelho.
Errar não tira ponto nem trava nada: o app fala "quase, tenta de novo" e deixa tentar.

## Como mexer

Tudo é HTML/CSS/JS puro, sem build e sem dependência externa.

| Quero... | Mexo em |
|---|---|
| Trocar/incluir parte do corpo ou órgão | `js/data-corpo.js` — listas `PARTES` e `ORGAOS` (nome, artigo, área da elipse, dica) |
| Trocar/incluir planeta ou curiosidade | `js/data-espaco.js` — lista `ASTROS` |
| Criar palavra nova | `js/data-palavras.js` — lista `FASES` (palavra, posição da letra que some, 2 letras erradas, desenho). O sorteio se ajusta sozinho ao tamanho do banco |
| Mudar quantas palavras saem por sessão | `js/game.js` — `POR_SESSAO` |
| Mudar a dificuldade do jogo da velha | `js/velha.js` — a chance de jogada esperta em `jogadaDoApp()` (hoje 35%) |
| Mudar as regras do quiz | `js/game.js` |
| Mudar cor, tamanho de botão, layout | `css/style.css` |

O quiz, o placar e as telas se ajustam sozinhos ao tamanho das listas.

## Publicar

O site é servido pelo GitHub Pages na raiz do repositório.
Depois de qualquer alteração, subir a versão do cache em `sw.js` (`mundo-da-lara-v1` → `v2`)
para o celular baixar os arquivos novos.
