#!/usr/bin/env python3
"""Servidor local de teste. Igual ao http.server, mas manda o navegador
nunca guardar nada — senão cada verificação testa o arquivo de ontem."""
import sys, functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class SemCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    def log_message(self, *a):
        pass

if __name__ == '__main__':
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8947
    raiz = sys.argv[2] if len(sys.argv) > 2 else '.'
    handler = functools.partial(SemCache, directory=raiz)
    print('servindo %s em http://localhost:%d (sem cache)' % (raiz, porta), flush=True)
    ThreadingHTTPServer(('127.0.0.1', porta), handler).serve_forever()
