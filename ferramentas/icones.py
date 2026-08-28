#!/usr/bin/env python3
"""Gera os icones do app a partir de um recorte da Lara.
iOS exige icone opaco: transparencia vira preto na tela de inicio.
Uso: python3 ferramentas/icones.py img/lara-unicornio.webp"""
import sys
from PIL import Image, ImageDraw

ORIGEM = sys.argv[1] if len(sys.argv) > 1 else 'img/lara-unicornio.webp'

def fundo(lado):
    """diagonal roxo -> rosa, as cores dos azulejos do app"""
    g = Image.new('RGB', (lado, lado))
    d = ImageDraw.Draw(g)
    a, b = (124, 77, 255), (240, 65, 127)      # #7C4DFF -> #F0417F
    for i in range(lado * 2):
        t = i / (lado * 2 - 1)
        d.line([(i, 0), (0, i)], fill=tuple(round(a[c] + (b[c] - a[c]) * t) for c in range(3)))
    return g

def montar(lado, ocupa, saida):
    """ocupa = fracao do lado que a figura preenche.
       O icone mascarado precisa de figura menor: o iOS e o Android
       recortam ate 40% da borda e comeriam a cabeca dela."""
    im = Image.open(ORIGEM).convert('RGBA')
    bb = im.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox()
    if bb: im = im.crop(bb)
    alvo = lado * ocupa
    r = min(alvo / im.width, alvo / im.height)
    im = im.resize((max(1, round(im.width * r)), max(1, round(im.height * r))), Image.LANCZOS)
    lona = fundo(lado)
    lona.paste(im, ((lado - im.width) // 2, (lado - im.height) // 2), im)
    lona.save(saida, 'PNG')
    print('%-38s %dx%d' % (saida, lado, lado))

montar(512, 0.86, 'icons/icon-512.png')
montar(192, 0.86, 'icons/icon-192.png')
montar(180, 0.86, 'icons/apple-touch-icon.png')
montar(64,  0.90, 'icons/favicon.png')
montar(512, 0.58, 'icons/icon-maskable-512.png')   # zona segura de 40%
