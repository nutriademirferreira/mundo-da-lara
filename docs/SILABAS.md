# As sílabas

Terceira entrada do Escrever, na ordem da alfabetização: ela já desenha a
letra (maiúscula e cursiva), agora junta consoante com vogal, e depois sílaba
com sílaba até ler a palavra.

## Onde mora o quê

| | |
|---|---|
| Dados | `js/data-silabas.js` — as 18 famílias e as 25 palavras, **escritas à mão** |
| Telas | `js/silabas.js` (módulo `Silabário`) |
| Desenho das palavras | reaproveitado de `js/data-palavras.js`, que já tem um pra cada |

## As três telas

| Tela | O que faz |
|---|---|
| **familias** | 18 azulejos, 3 colunas × 6 linhas. As vogais primeiro e depois uma consoante por azulejo |
| **familia** | A família aberta: BA BE BI BO BU, grandes, cada uma tocável. Sem erro e sem estrela — aqui é pra ouvir. E o botão **✏️ Escrever** |
| **escrever** | Ela traça o B, traça o A, e sai BA. Reusa a tela da letra (`screen-cursiva`) no **modo roteiro** |
| **juntar** | O jogo: o desenho da palavra, as lacunas e as pastilhas de sílaba embaralhadas |

Cada tela faz uma coisa só, na ordem da alfabetização: **ouvir** a família,
**escrever** a sílaba, **juntar** as sílabas numa palavra.

## Escrever a sílaba — B + A = BA

Pedido do Ademir em 20/10/2026, com as palavras dele: *"eu quero que ela junte
as letras, eu quero que ela escreva o B mais A igual a BA, C mais A igual a
CA"*. Por isso a tira de cima é literalmente `B + A = BA`, com a letra da vez
em amarelo, a feita em verde e o resultado apagado até fechar.

Quem desenha é o **Traço**, o mesmo motor das 52 letras, no modo roteiro, com
o mesmo gabarito que o Ademir aprovou: cobriu 70% da letra, chegou ao fim de
cada traço, e pelo menos metade do desenho caiu em cima.

Três decisões:

- **Em maiúscula, não em cursiva.** Juntar letras em cursiva é ligar uma na
  outra com a laçada, e os dados da cursiva são 26 letras soltas, sem
  ligadura. Duas cursivas lado a lado ensinariam um jeito de escrever que não
  existe. A ligadura é outro trabalho, com desenho novo.
- **A letra traçada aqui não conta no alfabeto.** Escrever o B dentro de BA
  não é a tarefa do alfabeto; senão a grade das 26 ficaria verde sozinha. A
  estrela é da sílaba, guardada em `lara.silabas.escritas`, e a sílaba fica
  verde com ⭐ na família.
- **A família das vogais não tem Escrever.** A é uma letra, não uma letra mais
  uma vogal. Ali não há o que juntar, e o botão fica escondido.

QUA se escreve com **três** letras, então a tira mostra `Q + U + A = QUA`. É
por isso que no código a lista de letras é separada da sílaba.

### A fala, quase sem gravação nova

| Momento | O que fala | Gravado? |
|---|---|---|
| abre a letra | "Vamos fazer a letra bê!" | sim, nas 26 |
| fecha a letra do meio | "Muito bem, Lara!" | sim |
| fecha a sílaba | "Você escreveu" + o mp3 da própria sílaba | o começo é 1 arquivo de 13 créditos; a sílaba já era pedida pela tela da família |
| fecha a família | "Parabéns, Lara! Você escreveu a família inteira!" | 1 arquivo |

Gravar "Você escreveu ba!" inteiro seriam 95 arquivos e 1.615 créditos. Por
pedaços são 13. Quem junta é o `Som.falarPedacos`, que só usa gravação se
**todos** os pedaços existirem — meia frase boa e meia robótica seria pior que
tudo robótico.

## As quatro decisões que parecem detalhe

### 1. A sílaba solta não soa como dentro da palavra

Em português a vogal átona final reduz: SAPO acaba em /pu/, não em /po/.
GATO, PATO, BOLO, COPO, GALO, SUCO e RATO, a mesma coisa. CASA é "caza",
porque S entre vogais soa Z. PERA tem R brando, e a família do R ensina o R
forte de RATO.

Por isso **a palavra pronta nunca é a soma dos mp3 das pastilhas**: quando ela
fecha a palavra, toca a frase inteira, com a palavra gravada do jeito que se
fala. É a mesma escolha do "Com o u fica Lua": o app diz o que o conjunto se
torna, nunca o que o pedaço é.

Duas palavras continuam sendo o caso mais discreto disso e ficam de propósito:
**CASA** (pastilha SA diz /sa/, palavra diz "caza") e **PERA** (pastilha RA
com R forte, palavra com R brando). Se um dia incomodar, são duas linhas.

### 2. Tocar BA fala "ba", e não "bê com á, ba"

O bê-a-bá é uma conta que só fecha nas letras cujo nome é consoante + ê: dá
certo em bê, cê, dê, gê, pê, tê, vê e zê, e desmonta em "éfe com á",
"eme com á", "erre com á". Pela tabela `FALA` de `js/data-palavras.js`, 8
letras aceitam a conta e 10 não. Regra que vale pra metade do alfabeto é pior
que regra nenhuma — foi o que derrubou o "u de Lua".

O nome da letra entra uma vez só, na abertura da família: *"A família do bê:
ba, be, bi, bo, bu."*

### 3. As pastilhas nascem da palavra, não da grade

Sete sílabas das 25 palavras não saem de nenhuma família, porque são sílaba
travada ou dígrafo: **PEI, POR, BAR, UR, VEM, VRO, LHA**. A grade só serve pra
sortear distratora.

A distratora sai de uma **janela** que acompanha a dificuldade: as palavras do
começo da lista até cinco à frente da atual. Varrendo a lista inteira, BOLA —
a primeira palavra do jogo — sorteava VRO e POR, as sílabas mais difíceis do
conjunto, no primeiro minuto dela.

Distratora nunca pode **soar** igual a uma certa: CE e SE são o mesmo som, GE e
JE também, QUE e KE também. Com sósia na mesa ela não erra por não saber ler,
erra porque o jogo não tem resposta pelo ouvido, e aí a estrela vira sorte.
Quem cuida disso é `somDaSilaba()`.

### 4. Uma pastilha por lacuna, não por sílaba distinta

BANANA é BA-NA-NA. Com uma pastilha NA pra duas lacunas, o jogo trava na
terceira. A identidade da pastilha é a **posição**, não o texto.

## O que ficou de fora, e por quê

### Famílias

| Fora | Por quê |
|---|---|
| **H** | HA HE HI HO HU não existem. O H sozinho não tem som em português ("hora" soa "ora"). Família do agá ensinaria um som que a língua não tem, e justo na letra que ela vai querer escrever onde não tem |
| **K, W, Y** | Só vivem em nome e marca de fora. KA KE KI KO KU soa igual a CA QUE QUI CO CU: família nova, som nenhum novo, e o caminho mais curto pra ela escrever "kasa" |
| **Ç** | Existe ÇA ÇO ÇU, não existe ÇE nem ÇI, e o Ç nunca começa palavra. Azulejo de grade é lido como começo de palavra |
| **CH, LH, NH** | Dígrafos, e nenhum começa palavra. Mostrar LHU solto ensinaria uma sílaba que ela nunca verá escrita no começo de nada. São a segunda leva |
| **BR, BL, CR...** | Encontro consonantal não é família: são duas consoantes com dois sons. 13 grupos × 5 vogais seriam 65 azulejos a mais numa grade de 18 |
| **AR, OR, UR, EM...** | Sílaba travada também não é família: aqui a consoante FECHA a sílaba em vez de começar |

O **Q** tem três sílabas, não cinco: QA, QE, QO e QU não existem, e QUO só vive
em "quota", que quase sempre se escreve "cota". Família de tamanho diferente é
normal — quem desenha a tela conta o array, e grade de cinco linhas fixas
deixaria uma vaga fantasma QUU.

**A família do C inclui CU**, que é o que a escola ensina e o que o app fala em
voz alta. Decisão do Ademir, avisada antes de gravar: tirar abre um buraco
visível na grade e ela vai encontrar a sílaba na escola de qualquer jeito.
Se ele quiser tirar, é um elemento do array.

### Palavras

Das 30 palavras do jogo de letra, **cinco** ficaram fora do Juntar:

| Fora | Por quê |
|---|---|
| SOL, FLOR, TREM | Monossílabo. Não existe o que juntar |
| PIZZA | Grafia italiana. PIZ-ZA é a divisão formal e ninguém bate palma assim; ZZ não é português |
| CARRO | Os dois caminhos ensinam errado. CAR-RO corta no meio um som que é um só; CA-RRO contraria o que a professora vai escrever no caderno dela |

As cinco continuam perfeitas no jogo de letra que falta, que é de letra, não de
sílaba.

**As sete mais difíceis ficaram** (PEIXE, PORCO, BARCO, URSO, NUVEM, LIVRO,
ABELHA), nas últimas posições. A divisão delas está certa e ela vai encontrar
essas palavras na vida; o custo é que as pastilhas POR, BAR, UR, VEM, VRO, LHA
e PEI não têm família que as explique. Se ela empacar nelas, tirar é apagar
sete linhas.

## A ordem manda no jogo

A ordem de `PALAVRAS` é de dificuldade e é ela que decide o que vem a seguir:
CV-CV limpa primeiro (15), depois três sílabas, depois vogal sozinha e
ditongo, e por último coda, dígrafo e encontro.

Ela guarda o que já montou em `lara.silabas.feitas`, e o jogo abre sempre na
primeira que falta. Estrela só na primeira vez e só sem toque errado, igual ao
quiz. Palavra já feita continua jogável, com ⭐ na etiqueta, e não dá estrela
de novo.

## Pra mexer

Palavra nova = uma linha em `PALAVRAS` (com a divisão escrita à mão), um
desenho em `js/data-palavras.js`, e rodar o gerador de vozes. Família nova =
uma linha em `FAMILIAS`.

Mexeu no motor de traço (`js/cursiva.js`) ou nos traços das letras? Rode
`ferramentas/tracos.html` **antes de publicar**: dedo simulado nas 52 letras,
traço inteiro tem que completar e 60% de cada traço não pode completar.

```bash
node ferramentas/gerar-vozes.js --faltam     # não custa crédito
```

Nunca escreva uma função que divide a palavra em sílabas sozinha: regra de
código que corta em consoante + vogal acerta BOLA e dá CAR-RO, PE-IXE e
LIV-RO. Divisão errada na tela ensina divisão errada, e o jogo continua
funcionando do mesmo jeito — ninguém vê.
