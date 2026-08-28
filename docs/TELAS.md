# As telas do Mundo da Lara

Dossiê de manutenção. Cada seção diz **o que a tela faz**, **de onde vêm os
dados** e **que regra ela não pode quebrar**. As regras não são estilo: cada
uma está aqui porque já foi quebrada e custou uma rodada de conserto.

Antes de publicar qualquer mudança, rode as duas ferramentas:

```bash
python3 ferramentas/servidor.py 8952 .     # servidor local sem cache
```

- `ferramentas/auditoria.html` — todas as telas × 5 aparelhos, contra as
  regras abaixo. Ela espera as imagens carregarem antes de medir e ignora
  o que está recortado por container com rolagem — sem esses dois cuidados
  ela acusava defeito que não existe, e auditoria que grita lobo é ignorada
- `node ferramentas/gerar-vozes.js --faltam` — o que está sem voz gravada

---

## As sete regras

### 1. Nenhuma tela rola na vertical

A Lara tem 5 anos. Conteúdo abaixo da dobra, pra ela, não existe. A única
exceção é a galeria, onde rolar é o gesto que todo mundo espera de uma
galeria — e lá a rolagem é **do container**, nunca do `body`.

### 2. Nada rola na horizontal no `body`

Faixas que deslizam (planetas, Tamanho de Verdade, A Viagem) rolam **dentro
do próprio container**. `body` tem `overflow-x:hidden` e isso não se mexe.

### 3. A camada de fundo passa da janela

`.fundo` é `position:fixed` com `inset:-80px`. O transbordo é de propósito:
no iPhone instalado na tela de início a janela de layout às vezes fica menor
que a tela física, e o que sobrar é pintado pelo `body` — a faixa roxa que
voltou três vezes. O `<html>` também acompanha a cor da tela atual, como
segunda linha de defesa.

**No navegador esse defeito não reproduz**, porque `env(safe-area-inset)`
vale zero. A auditoria simula 59px em cima e 34px embaixo justamente por
isso. Testar sem simular é testar vazamento com a torneira fechada.

### 4. Altura vem da grade, nunca do conteúdo

`aspect-ratio` e o truque do `padding-top` **não** dimensionam linha
implícita de grade neste app. Quem tentou, viu os cartões se atropelarem
(galeria) ou a figura sumir (azulejo da Memória).

- Grade com número fixo de linhas: `grid-template-rows: repeat(N, 1fr)`
- Grade que cresce: calcule `gridAutoRows` em JS com `ResizeObserver`
  (`ajustarGaleria` em `js/app.js`)
- Imagem dentro de caixa que precisa encolher: `position:absolute` +
  `object-fit`. No fluxo normal ela segura a altura do pai.

### 5. Erro nunca pune

Sem som de errado, sem tela vermelha, sem perder ponto. A resposta errada
apenas não avança. Estrela só na primeira tentativa certa — no quiz. Na
Memória, cada par achado vale uma estrela, porque ali achar **é** o
acerto.

### 6. Toda fala nasce em `js/game.js`

As frases do quiz são montadas por `falaAcertoCorpo`, `falaAcertoLetra` e
companhia, e `Jogo.todasAsFalas()` entrega a lista completa ao gerador de
voz. **Nunca monte uma frase falada fora dessas funções.** Enquanto o
gerador remontava as frases por conta própria, as duas versões divergiam em
silêncio e 30 confirmações passaram meses sem gravação — com o verificador
jurando que estava tudo certo.

### 7. Todo botão tem nome e 44px

Texto visível ou `aria-label` — os 9 botões de planeta ficaram sem nome até
a auditoria apontar. E nenhum alvo de toque abaixo de 44px: os alto-falantes
declaravam 50px e eram espremidos pra 43px por serem item de flex, daí o
`.som-btn{flex:0 0 auto}`. Tamanho declarado não é tamanho medido.

---

## Tela por tela

| Tela | O que faz | Dados | Cuidado |
|---|---|---|---|
| **start** | Abertura, céu em vídeo | `video/ceu-inicio.mp4` | Vídeo pode falhar no autoplay; a foto parada é a mesma paisagem, então não degrada |
| **home** | Sete azulejos | — | 4 quadrados + faixas largas (`.tile--faixa`). Cada faixa nova = mais uma linha `auto` |
| **corpo-menu** | Escolhe por fora / por dentro | — | — |
| **corpo-aprender** | Toca na figura e ouve o nome | `Corpo.PARTES` / `ORGAOS` | Zonas de toque são elipses em quadro 300×470. Trocar a arte exige recalibrar as 20 |
| **quiz** | Pergunta + 3 opções escritas | `Corpo`, `Espaco`, `Palavras` | Opções são **texto puro**, sem emoji: ela precisa reconhecer a palavra escrita |
| **espaco-menu** | Explorar / Tamanho / Viagem | — | — |
| **espaco-explorar** | Faixa de planetas, toca e abre ficha | `Espaco.ASTROS` | Rola só o container |
| **tamanho** | Tamanhos reais, uma régua só | `Espaco.REAIS` | Júpiter é a régua. Mercúrio virar pontinho **é** a lição |
| **viagem** | Distâncias reais, arrastando | `Espaco.DISTANCIAS` | Uma variável por tela: aqui distância é real, tamanho não |
| **palavras** | Completa a letra que falta | `Palavras.FASES` (30) | Letra fica **no meio** de propósito. A frase de acerto é "Com o u fica Lua" — "u de Lua" ensinava que a letra é a inicial |
| **memoria** | 6 pares, grade 3×4 | Palavras ou planetas | Carta virada fala o nome: vocabulário de graça |
| **velha** | Contra o app ou a dois | — | A IA é fraca **de propósito** (35% esperta). Não "conserte" |
| **galeria** | As figurinhas dela | `FOTOS` em `js/app.js` | Única tela que rola. `gridAutoRows` calculado em JS |
| **cineminha** | Animações | `FILMES` em `js/app.js` | Atalho só aparece se houver filme. Vídeo **fora** do cache offline |
| **result** | Fim de rodada | — | — |

---

## O que fica fora do cache offline

| | Por quê |
|---|---|
| `.mp4`, `.webm`, `.mov` | Um clipe pesa mais que o app inteiro, e o player pede pedaço por pedaço (Range), que o Cache API não devolve |

Tudo o mais — imagem, áudio de fala, código — entra. O app abre sem internet.

---

## O que a auditoria já pegou

Registro do que ela encontrou, pra ninguém remover uma regra achando que
é frescura:

| Achado | Onde |
|---|---|
| 9 botões de planeta sem nome pra leitura de tela | `espaco-explorar` |
| Alto-falante renderizando a 43,1px (declarado 44, cartão tem escala 0.98) | `espaco-explorar` |
| Cartões da galeria se atropelando, linha da grade em 83px | `galeria` |
| Figura do azulejo sumindo em faixa de 90px | `home` |
| Faixa roxa na borda da janela | todas, só no iPhone instalado |

E o que ela **errou** antes de eu ajustar — vale tanto quanto:

- Contava elemento recortado por container que rola como se vazasse
  (galeria e Tamanho de Verdade davam "defeito" de 1000px)
- Media alvo de toque antes das imagens carregarem e acusava botão pequeno
  que não existia

Auditoria que grita lobo é desligada, e aí não serve pra nada. Se ela
apontar algo, **meça na mão antes de consertar**.

---

## Depois de mexer

1. `node ferramentas/gerar-vozes.js --faltam` — não custa crédito
2. Abrir `ferramentas/auditoria.html` — todas as telas, todos os aparelhos
3. Subir a versão do cache em `sw.js`, senão quem já tem o app instalado
   continua com a versão antiga
