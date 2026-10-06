"""Ouve as gravações do app com o whisper e diz o que ele entendeu.

Serve pra achar fala com pronúncia errada sem ouvir uma por uma: "sapo"
saindo "cipo", "a letra i" saindo "a letra aí".

Uso (na raiz do repositório):
  python3 ferramentas/ouvir.py                     # palavras soltas (1-2 palavras)
  python3 ferramentas/ouvir.py "frase um|frase dois"  # frases escolhidas
  python3 ferramentas/ouvir.py --letras            # os nomes das 26 letras

Precisa de: brew install whisper-cpp ffmpeg
e do modelo em ~/.cache/whisper/ggml-small.bin:
  mkdir -p ~/.cache/whisper && curl -L -o ~/.cache/whisper/ggml-small.bin \
    https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin

COMO LER O RESULTADO — o whisper também erra, e erra de jeito conhecido:
- palavra solta sem contexto ele chuta: o R de "rato" (som de H) virava
  "hat". Por isso cada fala toca DEPOIS de "Oi, Lara! Vamos brincar?", que
  põe ele no modo português; essa frase sai do resultado
- letra solta ouve com uma lista de letras como dica (--letras). Mesmo
  assim, conferido com a voz do sistema: "ene", "erre", "gê" e "xis" ele
  erra até com pronúncia certa. Nessas, só o ouvido decide
- "ERRO" com a letra escrita como símbolo ("letra B") não é erro
"""
import json, os, re, subprocess, sys, tempfile, unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELO = os.environ.get('WHISPER_MODELO', os.path.expanduser('~/.cache/whisper/ggml-small.bin'))
TMP = tempfile.mkdtemp(prefix='ouvir-')
idx = json.load(open(os.path.join(RAIZ, 'audio/indice.json'), encoding='utf-8'))

LETRAS = ['á', 'bê', 'cê', 'dê', 'é', 'éfe', 'gê', 'agá', 'i', 'jota', 'cá', 'éle', 'eme',
          'ene', 'ó', 'pê', 'quê', 'erre', 'esse', 'tê', 'u', 'vê', 'dáblio', 'xis', 'ípsilon', 'zê']
DICA_LETRAS = 'Letras do alfabeto em português: á, bê, cê, dê, é, i, ó, u.'


def norm(t):
    t = unicodedata.normalize('NFD', t.lower())
    t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z ]', '', t).strip()


def wav(arq, nome):
    out = os.path.join(TMP, nome)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', arq, '-ar', '16000', '-ac', '1', out], check=True)
    return out


def silencio(seg, nome):
    out = os.path.join(TMP, nome)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi', '-i',
                    'anullsrc=r=16000:cl=mono', '-t', str(seg), out], check=True)
    return out


def juntar(partes, nome):
    out = os.path.join(TMP, nome)
    cmd = ['ffmpeg', '-y', '-loglevel', 'error']
    for p in partes:
        cmd += ['-i', p]
    cmd += ['-filter_complex', 'concat=n=%d:v=0:a=1' % len(partes), '-ar', '16000', '-ac', '1', out]
    subprocess.run(cmd, check=True)
    return out


def whisper(arq, dica=None):
    cmd = ['whisper-cli', '-m', MODELO, '-l', 'pt', '-nt', '-np', '-f', arq]
    if dica:
        cmd += ['--prompt', dica]
    return subprocess.run(cmd, capture_output=True, text=True).stdout.strip()


def audio(chave):
    return os.path.join(RAIZ, 'audio', idx[chave])


def main():
    if not os.path.exists(MODELO):
        sys.exit('Falta o modelo do whisper em %s (instrução no topo deste arquivo).' % MODELO)
    args = sys.argv[1:]
    if args and args[0] == '--letras':
        pausa = silencio(0.8, 'pausa.wav')
        for l in LETRAS:
            if l not in idx:
                print('%-8s (sem áudio)' % l)
                continue
            ouvido = whisper(juntar([pausa, wav(audio(l), 'v.wav'), pausa], 'p.wav'), DICA_LETRAS)
            print('%-8s -> %s' % (l, ouvido))
        return

    frases = args[0].split('|') if args else [k for k in idx if len(k.split()) <= 2 and len(k) <= 16]
    porta = wav(audio('oi lara! vamos brincar?'), 'porta.wav')
    pausa = silencio(0.45, 'pausa.wav')
    erros = 0
    for f in sorted(frases):
        k = ' '.join(f.split()).strip().lower()
        if k not in idx:
            print('SEM ÁUDIO  %s' % f)
            erros += 1
            continue
        tudo = whisper(juntar([porta, pausa, wav(audio(k), 'v.wav')], 'j.wav'))
        ouvido = re.split(r'brinca\w*[?!.,]*', tudo, maxsplit=1, flags=re.I)
        ouvido = (ouvido[1] if len(ouvido) > 1 else tudo).strip()
        ok = norm(ouvido).replace(' ', '') == norm(f).replace(' ', '')
        erros += not ok
        print('%s %s -> %s' % ('ok  ' if ok else 'ERRO', f, ouvido))
    print('\n%d de %d ouvidas diferente do texto (leia o topo do arquivo antes de regravar)' % (erros, len(frases)))


if __name__ == '__main__':
    main()
