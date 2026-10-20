# As histórias de dormir

Quatorze histórias no formato Readmio: quem lê é o adulto, em voz alta, e o
texto traz marcações 🔊 com um som ou uma ação pra fazer junto com a criança.
A história começa animada e vai desacelerando até o clima de sono.

As quatro primeiras são as de referência, entregues prontas pelo Ademir. As
dez seguintes foram escritas seguindo o mesmo formato.

## Onde mora o quê

| | |
|---|---|
| Texto | `historias/<id>.md` — **a fonte**. Pra corrigir uma frase, é aqui |
| Ilustração | `img/historias/<id>.svg` — SVG escrito à mão, sem IA de imagem |
| Dados do app | `js/data-historias.js` — **gerado**, não edite |
| Telas | `js/historias.js` (módulo `Contos`) |

## Pra mexer

```bash
node ferramentas/compilar-historias.js    # .md  ->  js/data-historias.js
node ferramentas/validar-historias.js     # portão: sai 1 se achar problema
```

O tema e a **ordem da biblioteca** ficam no `CATALOGO`, dentro do compilador.
A Azulina é a última de propósito: é a mais calma, feita pra fechar a noite.

História nova = um `.md`, um `.svg`, uma linha no `CATALOGO`, e rodar os dois
comandos acima.

## As regras do texto

Entre 350 e 550 palavras, de 8 a 14 marcações 🔊 (pelo menos 2 delas sendo
ação física, e uma calmante perto do fim), frases curtas, lição em negrito,
e o fechamento falando com a criança + `*Fim.*`.

Proibido: travessão, a expressão "não é sobre", a palavra "lindinho",
personagem conhecido, marca, tela ou eletrônico, vilão assustador.

O validador cobra tudo isso. As quatro de referência ficam isentas da faixa
de palavras e do negrito obrigatório, porque entraram como foram escritas.

## As regras da ilustração

SVG de 380×420 feito só de `rect`, `circle`, `ellipse`, `path`, `polygon` e
`g`. Sem gradiente, sem filtro, sem `<text>`, sem `<image>`, sem fonte. Cor
sempre em hexadecimal no próprio elemento. Até 150 elementos e 15 KB.

### O xmlns não é opcional

O formato original especificava abrir com `<svg width="100%" viewBox="0 0 380
420" role="img">`, **sem** `xmlns`. Assim o arquivo funciona colado dentro do
HTML e **não funciona** carregado por `<img src="...">`: o navegador parseia
o arquivo como XML e recusa sem o namespace.

As quatorze nasceram assim e a biblioteca abriu com quatorze imagens
quebradas. O validador cobra o `xmlns` desde então. Ilustração nova tem que
abrir com:

```
<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 380 420" role="img">
```

## O que o app NÃO faz aqui

Não lê a história em voz alta. A voz gravada do app serve pros jogos; a
história é o pai lendo. O único áudio desta seção é o alto-falante do
azulejo na home, que diz o nome da seção.
