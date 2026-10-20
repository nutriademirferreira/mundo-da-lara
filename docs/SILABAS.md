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
| **familia** | A família aberta: BA BE BI BO BU, grandes, cada uma tocável. Sem erro e sem estrela — aqui é pra ouvir |
| **juntar** | O jogo: o desenho da palavra, as lacunas e as pastilhas de sílaba embaralhadas |

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

```bash
node ferramentas/gerar-vozes.js --faltam     # não custa crédito
```

Nunca escreva uma função que divide a palavra em sílabas sozinha: regra de
código que corta em consoante + vogal acerta BOLA e dá CAR-RO, PE-IXE e
LIV-RO. Divisão errada na tela ensina divisão errada, e o jogo continua
funcionando do mesmo jeito — ninguém vê.
