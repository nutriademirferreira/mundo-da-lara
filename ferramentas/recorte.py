"""Recorte por Vision (Apple) — mesmo motor do 'Remover Fundo' do Preview.
Devolve um alfa suave, com fio de cabelo, em vez de balde de tinta."""
import sys, ctypes
import Vision, Quartz
from Foundation import NSURL
from PIL import Image

def matte(caminho):
    url = NSURL.fileURLWithPath_(caminho)
    handler = Vision.VNImageRequestHandler.alloc().initWithURL_options_(url, {})
    req = Vision.VNGenerateForegroundInstanceMaskRequest.alloc().init()
    ok, err = handler.performRequests_error_([req], None)
    if not ok: raise RuntimeError('Vision falhou: %s' % err)
    res = req.results()
    if not res: raise RuntimeError('nenhum sujeito encontrado')
    obs = res[0]
    buf, err = obs.generateScaledMaskForImageForInstances_fromRequestHandler_error_(
        obs.allInstances(), handler, None)
    if buf is None: raise RuntimeError('mascara falhou: %s' % err)

    Quartz.CVPixelBufferLockBaseAddress(buf, 1)
    try:
        w = Quartz.CVPixelBufferGetWidth(buf)
        h = Quartz.CVPixelBufferGetHeight(buf)
        stride = Quartz.CVPixelBufferGetBytesPerRow(buf)
        fmt = Quartz.CVPixelBufferGetPixelFormatType(buf)
        base = Quartz.CVPixelBufferGetBaseAddress(buf)
        raw = bytes(base.as_buffer(stride * h))
    finally:
        Quartz.CVPixelBufferUnlockBaseAddress(buf, 1)

    if fmt == 1278226534:                        # 'L00f' OneComponent32Float
        import array
        linhas = []
        for y in range(h):
            a = array.array('f'); a.frombytes(raw[y*stride:y*stride + w*4])
            linhas.append(bytes(0 if v <= 0 else (255 if v >= 1 else int(v*255+.5)) for v in a))
        m = Image.frombytes('L', (w, h), b''.join(linhas))
    elif fmt == 1278226488:                      # 'L008' OneComponent8
        m = Image.frombytes('L', (w, h), b''.join(raw[y*stride:y*stride+w] for y in range(h)))
    else:
        raise RuntimeError('formato de pixel inesperado: %s' % fmt)
    return m, fmt

if __name__ == '__main__':
    origem, destino = sys.argv[1], sys.argv[2]
    m, fmt = matte(origem)
    base = Image.open(origem).convert('RGBA')
    if m.size != base.size:
        m = m.resize(base.size, Image.LANCZOS)
    base.putalpha(m)
    base.save(destino)
    print('%s  fmt=%s  %s' % (destino.split('/')[-1], fmt, base.size))
