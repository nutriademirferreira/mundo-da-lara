# Recorte de fundo — como refazer

Use o **Vision da Apple** (`VNGenerateForegroundInstanceMaskRequest`), o mesmo
motor do "Remover Fundo" do Preview e do apertar-e-arrastar do iPhone. Roda
local, ~1 s por imagem, não envia imagem nenhuma pra internet.

```bash
python3 -m venv venv
./venv/bin/pip install pyobjc-framework-Vision pyobjc-framework-Quartz pillow
./venv/bin/python recorte.py entrada.png saida.png
```

O script está em `ferramentas/recorte.py`. Ele devolve um alfa **suave** —
fio de cabelo com meio-tom — em vez de recorte duro.

## O que NÃO usar

Balde de tinta (`ImageDraw.floodfill`), componentes conectados e limiar de
luminância no Pillow. Foi o método usado até 2026-08-27 e produzia, sempre:

- crosta branca em volta do cabelo (o balde para onde a cor muda)
- pedaço de roupa clara comido (vestido branco em fundo branco é indistinguível por cor)
- sombra de chão sobrando embaixo dos pés
- borda serrilhada, sem meio-tom

Nenhum desses defeitos é ajustável por limiar: o método não tem como saber
o que é sujeito. Não tente consertar por parâmetro — troque de ferramenta.

## Limite conhecido

O Vision decide sozinho o que é sujeito. Em `lara-espaco2` ele considerou só
a menina e descartou o planeta em que ela pisava. Quando isso acontecer, ou
se aceita o sujeito sozinho, ou se escolhe outra variação do mesmo prompt em
que o objeto encosta no personagem (aí Vision trata os dois como uma peça só).
