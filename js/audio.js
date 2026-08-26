/* =========================================================
   Som do app: voz (pt-BR) + efeitos gerados no Web Audio.
   Nenhum arquivo externo — funciona offline.
   ========================================================= */
var Som = (function () {
  var ligado = localStorage.getItem('lara.som') !== 'off';
  var ctx = null;
  var vozPtBr = null;
  var vozesProntas = false;

  function escolherVoz() {
    if (!('speechSynthesis' in window)) return;
    var vozes = speechSynthesis.getVoices() || [];
    if (!vozes.length) return;
    var pt = vozes.filter(function (v) { return /^pt/i.test(v.lang || ''); });
    var preferidas = ['luciana', 'google português do brasil', 'francisca', 'felipe', 'fernanda', 'joana'];
    for (var i = 0; i < preferidas.length; i++) {
      var achou = pt.find(function (v) { return (v.name || '').toLowerCase().indexOf(preferidas[i]) > -1; });
      if (achou) { vozPtBr = achou; vozesProntas = true; return; }
    }
    vozPtBr = pt.find(function (v) { return /pt[-_]?br/i.test(v.lang); }) || pt[0] || null;
    vozesProntas = !!vozPtBr;
  }

  if ('speechSynthesis' in window) {
    escolherVoz();
    speechSynthesis.onvoiceschanged = escolherVoz;
  }

  function audioCtx() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* nota simples com envelope suave */
  function nota(freq, inicio, dur, volume, tipo) {
    var c = audioCtx(); if (!c) return;
    var t = c.currentTime + inicio;
    var osc = c.createOscillator();
    var gan = c.createGain();
    osc.type = tipo || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gan.gain.setValueAtTime(0.0001, t);
    gan.gain.exponentialRampToValueAtTime(volume || 0.16, t + 0.02);
    gan.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gan); gan.connect(c.destination);
    osc.start(t); osc.stop(t + dur + 0.03);
  }

  function tocar(nome) {
    if (!ligado) return;
    switch (nome) {
      case 'acerto':                                   // arpejo alegre subindo
        [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { nota(f, i * 0.09, 0.28, 0.18, 'triangle'); });
        break;
      case 'erro':                                     // dois "bops" macios, nada agressivo
        nota(300, 0, 0.16, 0.12, 'sine');
        nota(232, 0.14, 0.22, 0.12, 'sine');
        break;
      case 'estrela':
        [1046.5, 1318.5, 1568].forEach(function (f, i) { nota(f, i * 0.06, 0.2, 0.12, 'sine'); });
        break;
      case 'toque':
        nota(660, 0, 0.09, 0.09, 'triangle');
        break;
      case 'fanfarra':
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) { nota(f, i * 0.12, 0.42, 0.18, 'triangle'); });
        [261.6, 329.6, 392].forEach(function (f, i) { nota(f, 0.55 + i * 0.02, 0.9, 0.12, 'sine'); });
        break;
      case 'zap':
        nota(880, 0, 0.12, 0.1, 'triangle'); nota(1174, 0.1, 0.16, 0.1, 'triangle');
        break;
    }
  }

  /* fala em português com voz de ritmo tranquilo pra criança */
  function falar(texto, opcoes) {
    if (!ligado || !('speechSynthesis' in window) || !texto) return;
    opcoes = opcoes || {};
    try {
      if (!opcoes.enfileirar) speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(texto);
      if (!vozesProntas) escolherVoz();
      if (vozPtBr) u.voice = vozPtBr;
      u.lang = (vozPtBr && vozPtBr.lang) || 'pt-BR';
      u.rate = opcoes.rate || 0.92;
      u.pitch = opcoes.pitch || 1.15;
      u.volume = 1;
      setTimeout(function () { speechSynthesis.speak(u); }, opcoes.atraso || 0);
    } catch (e) { /* silencioso: som é enfeite, não pode quebrar o jogo */ }
  }

  function calar() {
    if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch (e) {} }
  }

  /* precisa de um toque do usuário pra destravar áudio no iOS */
  function destravar() {
    audioCtx();
    if ('speechSynthesis' in window) {
      try {
        var u = new SpeechSynthesisUtterance(' ');
        u.volume = 0; speechSynthesis.speak(u);
      } catch (e) {}
    }
    escolherVoz();
  }

  function alternar() {
    ligado = !ligado;
    localStorage.setItem('lara.som', ligado ? 'on' : 'off');
    if (!ligado) calar(); else tocar('toque');
    return ligado;
  }

  return {
    tocar: tocar, falar: falar, calar: calar, destravar: destravar, alternar: alternar,
    estaLigado: function () { return ligado; }
  };
})();
