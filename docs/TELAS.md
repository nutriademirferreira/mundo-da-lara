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
- `ferramentas/letras.html` — só quando mexer numa letra do Escrever: as 52
  letras em tamanho grande, com a pauta e as bolinhas de partida, usando os
  mesmos dados e a mesma função do app
- `ferramentas/tracos.html` — **obrigatória depois de mexer em `js/cursiva.js`
  ou nos traços**: dedo simulado nas 52 letras contra o gabarito. Traço
  inteiro tem que completar e 60% de cada traço não pode completar. Era um
  teste de uma vez só, feito na mão; virou folha pra ninguém ter que refazer

Dossiê por seção: `docs/HISTORIAS.md` (as histórias de dormir),
`docs/SILABAS.md` (as famílias e o Juntar), `docs/VOZ.md` (a voz gravada).

---

## As sete regras

### 1. Nenhuma tela rola na vertical

A Lara tem 5 anos. Conteúdo abaixo da dobra, pra ela, não existe. São duas
exceções, e as duas rolam **o container**, nunca o `body`:

- a **galeria**, onde rolar é o gesto que todo mundo espera de uma galeria;
- a **leitura** de uma história, porque 450 palavras não cabem numa tela e
  ali quem opera é o adulto lendo em voz alta, não a criança.

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

### 4. Altura vem da grade, e o cartão precisa poder encolher

`min-width:0` / `min-height:0` no **wrapper** não basta: item de flex não
encolhe abaixo da largura do próprio conteúdo, então quem transborda é o
cartão de dentro. Foi assim que "Aprender" ficou 23px mais largo que a
coluna e passou por cima do "Jogar" ao lado. Piso de conforto (`min-height:
132px` no `.mode`) cede antes de a tela quebrar.

E não conserte transbordo com `overflow-wrap:anywhere`: parte a palavra no
meio ("Apren/der") num app onde ela está aprendendo a ler.

### 4b. Altura vem da grade, nunca do conteúdo

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

### 7b. CSS se edita por trecho exato, nunca por contagem de chaves

Cortar um bloco de CSS contando `{` e `}` deixou duas linhas órfãs e uma
chave solta. O navegador não dá erro: ele **descarta em silêncio** a regra
seguinte. A que caiu foi `.tile-wrap[hidden]{display:none}`, e o Cineminha
escondido passou a ocupar uma linha inteira da home em todo aparelho.

Depois de mexer no `style.css`, confira o saldo de chaves (tem que dar 0) e
se a regra que você espera aparece em `getComputedStyle` — não só no arquivo.

### 8. Timer pendente não sobrevive à tela

`setTimeout` agendado dentro de um jogo **continua vivo** quando a partida
acaba, quando ela toca "de novo", e quando ela sai da tela. Ele então
dispara contra o estado seguinte.

Isso já mordeu **três vezes** neste app:

1. arrastou a Lara pra tela de resultado depois que ela saiu da rodada
2. travou as damas em "Minha vez…" — o timer da partida anterior mexia no
   tabuleiro da nova
3. estava latente no jogo da velha desde sempre, só mais difícil de
   disparar porque a partida é curta

O padrão que resolve é um **selo de partida**: cada partida ganha um
número, o timer guarda o número que viu, e desiste se o número mudou. Mais
`clearTimeout` ao começar e um `cancelar()` chamado pelo `ir()` ao sair.
Ver `js/damas.js` e `js/velha.js`.

Módulo novo com temporizador nasce com selo. Não é opcional.

---

## Tela por tela

| Tela | O que faz | Dados | Cuidado |
|---|---|---|---|
| **start** | Abertura, céu em vídeo | `video/ceu-inicio.mp4` | Vídeo pode falhar no autoplay; a foto parada é a mesma paisagem, então não degrada |
| **home** | Sete azulejos | — | 4 quadrados (Corpo, Sistema Solar, Palavras, Escrever) + faixas largas (`.tile--faixa`). Cada faixa nova = mais uma linha `auto` **e uma medida no iPhone SE**: a linha nova nasce `auto` mesmo sem ser declarada, então nada estoura na tela — o que encolhe, calado, é o azulejo quadrado. Piso medido: 99px de azulejo (figura de 48px e o nome 12px abaixo do alto-falante). Cada faixa custa ~60px das duas linhas de cima, e três é o que cabe. Módulo novo entra **dentro** de um submenu (Jogos, Escrever), não como azulejo solto |
| **corpo-menu** | Escolhe por fora / por dentro | — | — |
| **corpo-aprender** | Toca na figura e ouve o nome | `Corpo.PARTES` / `ORGAOS` | Zonas de toque são elipses em quadro 300×470. Trocar a arte exige recalibrar as 20 |
| **quiz** | Pergunta + 3 opções escritas | `Corpo`, `Espaco`, `Palavras` | Opções são **texto puro**, sem emoji: ela precisa reconhecer a palavra escrita |
| **espaco-menu** | Explorar / Tamanho / Viagem | — | — |
| **espaco-explorar** | Faixa de planetas, toca e abre ficha | `Espaco.ASTROS` | Rola só o container |
| **tamanho** | Tamanhos reais, uma régua só | `Espaco.REAIS` | Júpiter é a régua. Mercúrio virar pontinho **é** a lição |
| **viagem** | Distâncias reais, arrastando | `Espaco.DISTANCIAS` | Uma variável por tela: aqui distância é real, tamanho não |
| **palavras** | Completa a letra que falta | `Palavras.FASES` (30) | Letra fica **no meio** de propósito. A frase de acerto é "Com o u fica Lua" — "u de Lua" ensinava que a letra é a inicial |
| **memoria** | 3→4→6→8 pares, grade por nível | Palavras, planetas ou as fotos dela | Dificuldade sobe a cada tabuleiro e **zera quando o app recarrega** — ela ganha a primeira partida do dia. O tabuleiro que cresceu avisa: "Agora tem mais cartas, Lara!". No modo das fotos, o sorteio pula pares de foto que se confundem a 79px (lista medida em `js/memoria.js`) |
| **jogos-menu** | Velha, Memória e Damas | — | Os três ficavam soltos na home e ela passou de 8 entradas — no iPhone SE os azulejos perdiam a figura e o nome ia pra baixo do alto-falante |
| **escrever-menu** | Letras (maiúscula, cursiva) e Sílabas (As Famílias, Juntar) | — | Mesma razão do jogos-menu: um quinto quadrado quebrava a grade 2×2 da home. Quatro cartões **altos** não cabem, então são dois grupos de dois cartões curtos, igual ao corpo-menu. Cuidado medido: a media query de `max-height:680px` põe `padding-right:76px` em `.mode`, que é do cartão ALTO — no curto isso deixava 68px de conteúdo, "As Famílias" quebrava em duas linhas e o cartão crescia 24px a mais que o vizinho. Por isso `.mode--curto` reafirma o padding lá dentro |
| **cursiva-menu** | Grade 5×6 do alfabeto — **serve aos dois** | `Maiuscula.LETRAS` (`js/data-maiuscula.js`) e `Cursiva.LETRAS` (`js/data-cursiva.js`); o resto em `ALFABETOS`, `js/cursiva.js` | A **rota** escolhe o alfabeto: `maiuscula-menu` ou `cursiva-menu`. O voltar do desenho é `letras-voltar`, que volta pro alfabeto em que ela estava — `data-go="cursiva-menu"` ali jogaria quem fazia maiúscula na cursiva. Letra feita fica verde com estrela; cada alfabeto guarda a sua lista (`lara.maiuscula.feitas`, `lara.cursiva.feitas`) |
| **cursiva** | Passar o dedo por cima da letra (maiúscula ou cursiva) | idem | **Maiúscula** é letra de forma, em pé, um caminho por traço na ordem da escola; o começo de cada traço tem número e só o 1 pulsa. Dois traços que nascem no mesmo ponto (pernas do A, haste e teto do E): o 2 anda 16 unidades pelo próprio traço, senão fica em cima do 1. **Cursiva** tem uma bolinha só: número em cima esconderia o pingo do i. **Falas:** abrir a letra → "Vamos fazer a letra bê!"; acertou → "Muito bem, Lara! Você fez a letra bê!" e a próxima entra na **fila** da voz (trocar a letra antes faria o C aparecer ainda falando do B — por isso a espera é 3,4 s: a fala mais longa dura 3,0 s); a última que faltava → "Parabéns, Lara! Você fez o alfabeto inteiro!" e volta pra grade. Testado por traço simulado: as 52 letras completam com o traço inteiro e nenhuma com 60% de cada traço. **Gabarito do Ademir:** cobriu 70% da letra, chegou ao fim de cada traço e pelo menos metade do desenho caiu em cima da letra → tela verde e passa sozinha pra próxima. Mais da metade fora → "Quase! Tenta de novo." (sem X nem vermelho: erro não pune). No meio → silêncio, ela continua. Sem "chegar ao fim" o `t` completava com 31% do traço; sem a precisão, rabiscar a tela toda passava. Tremor de até ±11 unidades passa 100% — dedo de 5 anos treme ~±7. A passagem automática tem selo (regra 8). **Modo roteiro:** a mesma tela escreve uma SÍLABA, pedida pela tela da família — traça o B, traça o A, e a tira de cima fecha em `B + A = BA`. No roteiro a letra **não** entra em `lara.maiuscula.feitas` e não dá estrela (escrever o B dentro de BA não é a tarefa do alfabeto, e a grade ficaria verde sozinha); a estrela é da sílaba e quem guarda é o Silabário. O roteiro mora aqui, e não num módulo próprio, porque o gabarito inteiro é este código e uma segunda cópia divergiria calada. Dois cuidados: `cancelar()` é chamado pelo próprio `abrir()` a cada letra, então **quem larga o roteiro é o `sair()`**, chamado pelo `App.ir()`; e o `letras-voltar` ganhou um terceiro dono — na escrita ele cai na família, não no alfabeto |
| **velha** | Contra o app ou a dois | — | A IA é fraca **de propósito** (35% esperta). Não "conserte" |
| **damas** | 6×6, estrela dela contra planetas | — | Captura **não** é obrigatória e a dama **não** voa: as duas regras fariam o app recusar a jogada dela. 6×6 e não 8×8 porque em 8×8 a casa cai pra 42px. IA fraca de propósito (40%) |
| **familias** | Grade das 18 famílias silábicas | `Silabas.FAMILIAS` (`js/data-silabas.js`) | 3 colunas × 6 linhas, e não 5 colunas: em 5 o azulejo cai pra 62px e a última linha fica com dois soltos. O azulejo **não** mostra a consoante sozinha — mostra ela com as cinco vogais embaixo, senão ensina que B é um som que se pronuncia solto, que é a confusão que a família silábica existe pra desfazer. O que ficou de fora da grade (H, K, W, Y, Ç, dígrafos, encontros) está em `docs/SILABAS.md`, cada um com o motivo |
| **familia** | A família aberta: BA BE BI BO BU, e o botão de escrever | idem | O número de linhas vem do **tamanho do array**, escrito em JS: a família do Q tem três sílabas e grade de cinco linhas fixas deixava uma vaga fantasma QUU. Tocar a sílaba fala só ela ("ba"), nunca "bê com á, ba" — ver `docs/SILABAS.md`. O voltar é fixo em `familias` porque esta tela só se abre por lá, diferente do `letras-voltar` da letra, que serve a dois alfabetos. O botão **✏️ Escrever** manda a família inteira pro modo roteiro da tela da letra; ele fica escondido na família das vogais, porque A é uma letra e não uma letra MAIS uma vogal — ali não há o que juntar |
| **juntar** | Monta a palavra tocando as sílabas na ordem | `Silabas.PALAVRAS` + os desenhos de `Palavras.FASES` | A lacuna **exige a ordem**, e só a da vez aceita. Toque errado não pune: a pastilha treme, fala a própria sílaba e volta pro lugar — nada apaga, porque a pastilha errada pode ser a certa da lacuna seguinte. Ajuda em três degraus (fala a sílaba, repete a palavra, acende a certa), nenhum custando gravação. A bandeja tem altura fixa e duas fileiras sempre, senão o desenho sobe e desce a cada palavra. **A palavra pronta nunca é a soma das pastilhas**: toca a frase inteira, com a palavra gravada do jeito que se fala |
| **historias** | Biblioteca das 14 histórias de dormir | `Historias.LISTA` (`js/data-historias.js`) | Rola só o container. Altura da linha calculada em JS, igual à galeria (regra 4b) |
| **leitura** | A história aberta, pro papai ler em voz alta | idem | Painel escuro atrás do texto: sobre o céu estrelado as letras disputavam com as estrelas. Cada 🔊 vira um chip, que é o sinal de parar de ler e fazer o som |
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
| Quatro cartões se atropelando, 40px de conteúdo cortado dentro do container | `espaco-menu`, iPhone SE |
| Foto da Lara com 166px numa carta de 138 — cabeça cortada. Eu tinha escrito a regra 4 e violado ela na mesma sessão | `memoria`, modo Eu |
| Botão "Jogar de novo" com 43px — um abaixo do mínimo | `damas` e `memoria` |
| Home com 8 entradas: no SE os azulejos perdiam a figura e os nomes ficavam embaixo do alto-falante | `home` |
| O mesmo defeito de volta por outro caminho, 19/10: a faixa das Histórias (a terceira) deixou a linha do azulejo com 82px no SE — figura da Lara em 4px e "Corpo Human" por baixo do botão. Não foi a linha `auto` que faltou (a implícita já é `auto`, medido): foi altura. Devolvida cortando a reserva de duas linhas do nome, o padding do azulejo, as margens da barra de estrelinhas e o rodapé — 99px de azulejo | `home`, iPhone SE |
| Cineminha escondido ocupando uma linha inteira da grade — chave `}` solta no CSS fez o navegador descartar `.tile-wrap[hidden]` | `home`, todos os aparelhos |
| Botão de ouvir a **pergunta** do quiz era um quadrado branco vazio desde 27/08 — o commit `fdaef7c` tirou o 🔊 de todos os botões pro ícone novo, que só existe em `.som-btn`, e esse é `.speak-btn` | `quiz`, os quatro temas |
| Cartão 23px mais largo que a própria coluna, passando por cima do vizinho | `corpo-menu`, iPhone SE |
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
- **Não olhava para dentro dos containers.** Checava rolagem da página e
  vazamento da janela, e por isso deu `espaco-menu` como limpa enquanto os
  quatro cartões se atropelavam no iPhone SE. Ganhou duas colunas novas —
  *conteúdo escondido* (container que corta o que tem dentro) e *atropelo*
  (irmãos de conteúdo sobrepostos). A regra 1 diz que o que ela não alcança
  não existe; a auditoria não estava testando a própria regra 1.
- **Comparava sobreposição só entre elementos da mesma classe.** Por isso a
  home passou com "Corpo Huma…" escondido embaixo do alto-falante. Ganhou a
  coluna *nome coberto*: todo texto de azulejo contra todo botão flutuante.
  Validada recriando o defeito — acusou os seis nomes — e restaurando.
- **Achava que botão com `aria-label` estava bem.** Nome pra leitor de tela
  não é desenho na tela: o botão da pergunta do quiz passava em "botão sem
  nome" e era um quadrado vazio. Ganhou a coluna *botão vazio* — sem texto
  visível, sem imagem e sem ícone em `::before`/`::after`. Validada tirando
  o ícone de novo: acusou `quiz-speak`.
- **Tratava `<text>` de SVG como caixa com rolagem.** A curva do "?" do quiz
  do corpo dava 11px "escondidos" no iPad. SVG não corta o próprio texto;
  elemento SVG agora fica fora da checagem de conteúdo escondido.

Auditoria que grita lobo é desligada, e aí não serve pra nada. Se ela
apontar algo, **meça na mão antes de consertar**.

---

## Depois de mexer

1. `node ferramentas/gerar-vozes.js --faltam` — não custa crédito
1b. Se mexeu em história: `node ferramentas/compilar-historias.js` e
    `node ferramentas/validar-historias.js`
2. Abrir `ferramentas/auditoria.html` — todas as telas, todos os aparelhos
3. Subir a versão do cache em `sw.js`, senão quem já tem o app instalado
   continua com a versão antiga
