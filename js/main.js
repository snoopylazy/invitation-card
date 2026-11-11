/* Envelope, opening sequence, cover, language and music.
   Needs GSAP (CDN) for the opening; without it the page skips straight to the cover.
   ?still=1 freezes the envelope screen (layout checks only).
   ?to=Name shows a guest name on the cover. */
(function () {
  'use strict';

  var D = window.INVITE, I = window.I18N, g = window.gsap;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var params = new URLSearchParams(location.search);
  var still = params.has('still');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var weak = reduce ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2);

  document.documentElement.classList.add('js');

  var lang = 'kh';
  try { lang = localStorage.getItem('lang') === 'en' ? 'en' : 'kh'; } catch (e) { lang = 'kh'; }

  var body = document.body;
  var intro = $('#intro'), stage = $('#stage'), tiltEl = $('#tilt');
  var card = $('#card'), seal = $('#seal'), sealShadow = $('#sealShadow');
  var flap = $('#flap'), flapShadow = $('#flapShadow'), front = $('#front');
  var back = $('.env-back'), hint = $('.in-hint');
  var audio = $('#bgm');
  var opened = false, idleTween = null;

  /* ---------- helpers ---------- */
  function toKhmerDigits(s) { return String(s).replace(/\d/g, function (d) { return '០១២៣៤៥៦៧៨៩'.charAt(d); }); }
  function numerals(s) { return lang === 'kh' ? toKhmerDigits(s) : String(s); }
  function get(obj, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function content(path) { var v = get(D, path); return v && v[lang] != null ? v[lang] : ''; }

  window.App = { lang: function () { return lang; }, num: numerals, content: content, reduce: reduce, weak: weak };

  /* ---------- name logo (HTML text layered over SVG decorations; never SVG <text>) ---------- */
  function logoHTML(theme) {
    var ink = theme === 'ink';
    var cls = 'lg-n foil' + (ink ? ' foil-ink' : '');
    return '<div class="logo' + (ink ? ' ink' : '') + '">' +
      '<img class="lg-crest" src="assets/svg/crest.svg" alt="">' +
      '<span class="' + cls + ' lg-n1" data-ln="0"></span>' +
      '<span class="' + cls + ' lg-n2" data-ln="1"></span>' +
      '<svg class="lg-flourish" viewBox="0 0 200 39" preserveAspectRatio="none" aria-hidden="true">' +
      '<path pathLength="1" style="stroke-dasharray:1" d="M2 31 C30 6 60 8 86 20"/>' +
      '<path pathLength="1" style="stroke-dasharray:1" d="M114 20 C140 32 172 33 198 8"/></svg>' +
      '<svg class="lg-heart" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21C-5 9 3-3 12 6 21-3 29 9 12 21Z"/></svg>' +
      '<img class="lg-bfly" src="assets/svg/butterfly.svg" alt="">' +
      '</div>';
  }
  $$('[data-logo]').forEach(function (h) { h.innerHTML = logoHTML(h.getAttribute('data-logo')); });

  /* ---------- guest name from ?to= (shown as plain text only) ---------- */
  var guest = (params.get('to') || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 60);
  if (guest) { var gn = $('#guestName'); gn.textContent = guest; gn.hidden = false; }

  /* ---------- optional photos ---------- */
  var P = window.PHOTOS || {};
  var coverPhoto = D.coverPhoto || P.cover || '';
  var wordsPhoto = D.wordsPhoto || P.words || '';
  if (coverPhoto) { document.documentElement.style.setProperty('--photo', 'url("' + new URL(coverPhoto, document.baseURI).href + '")'); }
  if (wordsPhoto) { var ai = $('#archImg'); ai.src = wordsPhoto; ai.hidden = false; }

  /* ---------- language ---------- */
  function applyLang() {
    document.documentElement.lang = lang === 'kh' ? 'km' : 'en';
    body.setAttribute('data-lang', lang);
    var dict = I[lang];
    $$('[data-i18n]').forEach(function (el) { el.textContent = dict[el.getAttribute('data-i18n')] || ''; });
    $$('[data-c]').forEach(function (el) { el.textContent = content(el.getAttribute('data-c')); });
    $$('[data-raw]').forEach(function (el) { el.textContent = D[el.getAttribute('data-raw')] || ''; });
    $$('[data-ln]').forEach(function (el) { el.textContent = D.logo[lang][+el.getAttribute('data-ln')]; });
    var lb = $('#btn-lang'); lb.textContent = dict.langBtn;
    lb.setAttribute('aria-label', lang === 'kh' ? 'Switch to English' : 'ប្តូរទៅភាសាខ្មែរ');
    syncMusicLabel();
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }
  $('#btn-lang').addEventListener('click', function () {
    lang = lang === 'kh' ? 'en' : 'kh';
    try { localStorage.setItem('lang', lang); } catch (e) { /* storage unavailable */ }
    applyLang();
  });

  /* ---------- music (only when a file is configured) ---------- */
  var musicBtn = $('#btn-music'), wantMusic = true;
  function syncMusicLabel() {
    var playing = !audio.paused;
    musicBtn.classList.toggle('is-off', !playing);
    musicBtn.setAttribute('aria-label', playing ? I[lang].musicOn : I[lang].musicOff);
  }
  if (D.music) {
    audio.src = D.music; musicBtn.hidden = false;
    musicBtn.addEventListener('click', function () {
      if (audio.paused) { wantMusic = true; audio.play().catch(function () {}); }
      else { wantMusic = false; audio.pause(); }
      syncMusicLabel();
    });
    audio.addEventListener('play', syncMusicLabel);
    audio.addEventListener('pause', syncMusicLabel);
  }
  function startMusic() { if (D.music && wantMusic) { audio.play().catch(function () {}); } }

  /* ---------- top bar background once scrolled ---------- */
  var tb = $('#topbar');
  function onScroll() { tb.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- scalloped flap geometry (one source for clip-path and the foil line) ---------- */
  function scallopPoints() {
    var w = 1000, h = 422, n = 11;
    var T = [500, h - 18];
    var pts = [[0, 0]];
    [[[0, 0], T], [T, [w, 0]]].forEach(function (edge) {
      var A = edge[0], B = edge[1];
      var dx = B[0] - A[0], dy = B[1] - A[1], len = Math.sqrt(dx * dx + dy * dy);
      var nx = -dy / len, ny = dx / len;
      var seg = len / n, bump = seg * 0.3;
      for (var k = 0; k < n; k++) {
        for (var s = 1; s <= 10; s++) {
          var t = (k + s / 10) / n, b = bump * Math.sin(Math.PI * s / 10);
          pts.push([A[0] + dx * t + nx * b, A[1] + dy * t + ny * b]);
        }
      }
    });
    pts.push([w, 0]);
    return pts;
  }
  function buildFlap() {
    var pts = scallopPoints();
    var poly = 'polygon(' + pts.map(function (p) { return (p[0] / 10).toFixed(2) + '% ' + (p[1] / 4.22).toFixed(2) + '%'; }).join(',') + ')';
    stage.style.setProperty('--flap-poly', poly);
    var edge = pts.slice(1, -1);
    function d(scale) {
      return 'M' + edge.map(function (p) {
        return (500 + (p[0] - 500) * scale).toFixed(1) + ' ' + (p[1] * scale).toFixed(1);
      }).join('L');
    }
    $('#flapLineOuter').setAttribute('d', d(0.955));
    $('#flapLineInner').setAttribute('d', d(0.915));
  }
  buildFlap();

  /* ---------- the card is built at camera size, then scaled to sit in the envelope ---------- */
  var cardNatural = 420, cardScale0 = 0.5;
  function sizeCard() {
    var sw = stage.offsetWidth || 320;
    cardNatural = Math.min(window.innerWidth * 0.92, 640, (window.innerHeight * 0.84) / 0.78);
    card.style.setProperty('--cw', cardNatural + 'px');
    cardScale0 = (sw * 0.76) / cardNatural;
    if (g) { g.set(card, { xPercent: -50, yPercent: -50, scale: cardScale0 }); }
    else { card.style.transform = 'translate(-50%,-50%) scale(' + cardScale0 + ')'; }
  }

  /* ---------- logo animation (names reveal L→R, flourish draws, heart pops, butterfly flies in) ---------- */
  function animateLogo(host, delay) {
    var tl = g.timeline({ delay: delay || 0 });
    var names = $$('.lg-n', host), paths = $$('.lg-flourish path', host);
    var heart = $('.lg-heart', host), bf = $('.lg-bfly', host), cr = $('.lg-crest', host);
    if (cr) { tl.from(cr, { opacity: 0, y: -8, duration: 0.7, ease: 'power2.out' }, 0); }
    tl.fromTo(names, { clipPath: 'inset(-40% 110% -40% -10%)' },
      { clipPath: 'inset(-40% -10% -40% -10%)', duration: 1.0, stagger: 0.35, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.1);
    tl.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' }, 0.5);
    tl.from(heart, { scale: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2.6)' }, 1.25);
    tl.from(bf, { x: -70, y: 34, rotation: -25, opacity: 0, duration: 1.2, ease: 'power2.out' }, 1.2);
    return tl;
  }

  /* ---------- cover entrance ---------- */
  function playCover() {
    if (!g || reduce) { return; }
    var tl = g.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.cv-corner', { opacity: 0, scale: 0.85, duration: 1.2, stagger: 0.12, ease: 'power2.out' }, 0)
      .from('.cv-crest', { opacity: 0, y: -14, duration: 0.9 }, 0.2)
      .fromTo('.cv-title .foil', { clipPath: 'inset(-40% 110% -40% -10%)' },
        { clipPath: 'inset(-40% -10% -40% -10%)', duration: 1.3, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.35)
      .add(animateLogo($('.cv-logo .logo'), 0), 0.7)
      .from('.cv-event, .cv-en', { opacity: 0, y: 12, duration: 0.9, stagger: 0.1 }, 1.6)
      .from('.cv-invite, .cv-guest', { opacity: 0, duration: 0.9 }, 1.9)
      .from('.dc', { opacity: 0, y: 16, duration: 0.8, stagger: 0.12 }, 2.0)
      .from('.cv-lunar, .cv-time, .cv-venue', { opacity: 0, y: 10, duration: 0.8, stagger: 0.1 }, 2.5)
      .from('.cv-cue', { opacity: 0, duration: 0.8 }, 3.0);
  }

  function finish() {
    body.classList.remove('is-locked');
    body.classList.add('is-open');
    intro.style.display = 'none';
    window.scrollTo(0, 0);
    onScroll();
  }

  /* ---------- the opening, ~5.5 s, slow and "by hand" ---------- */
  function openEnvelope() {
    if (opened) { return; }
    opened = true;
    startMusic();
    if (idleTween) { idleTween.kill(); }
    if (!g || reduce) {
      if (g) { g.to(intro, { autoAlpha: 0, duration: 0.5, onComplete: function () { finish(); } }); } else { finish(); }
      return;
    }
    g.to(hint, { autoAlpha: 0, duration: 0.4 });
    g.to(tiltEl, { rotationX: 0, rotationY: 0, duration: 0.5, ease: 'power2.out' });
    g.to(stage, { y: 0, duration: 0.5, ease: 'power2.out' });
    seal.disabled = true;

    var sw = stage.offsetWidth, sh = stage.offsetHeight;
    var env = [back, front, flap];
    var swapped = false;
    g.set(flap, { transformPerspective: 1100 });

    var tl = g.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: function () {
      g.to(intro, { autoAlpha: 0, duration: 0.8, ease: 'power1.inOut', onStart: playCover, onComplete: finish });
    } });

    // 1) seal pressed, lifted (growing shadow), set aside off screen
    tl.to(seal, { scale: 0.92, duration: 0.35, ease: 'power2.out' }, 0)
      .to(sealShadow, { scale: 0.9, opacity: 0.5, duration: 0.35, ease: 'power2.out' }, 0)
      .to(seal, { scale: 1.12, y: -14, rotation: -6, duration: 0.7, ease: 'power2.out' }, 0.35)
      .to(sealShadow, { scale: 1.45, x: 10, y: 22, opacity: 0.25, duration: 0.7, ease: 'power2.out' }, 0.35)
      .to([seal, sealShadow], { x: sw * 1.1, y: sh * 0.9, rotation: 28, autoAlpha: 0, duration: 0.9, ease: 'power2.in' }, 1.05)

    // 2) flap folds back 180° in 3D, its shadow lifting; behind the card once past 90°
      .to(flapShadow, { opacity: 0, scaleY: 0.55, duration: 0.9, ease: 'power1.out' }, 1.5)
      .to(flap, { rotationX: -180, duration: 1.25, ease: 'power2.inOut', onUpdate: function () {
        if (!swapped && g.getProperty(flap, 'rotationX') <= -90) { swapped = true; flap.style.zIndex = 1; }
      } }, 1.5)

    // 3) card drawn out of the pocket at a slight angle; envelope moves down a little
      .to(card, { y: -sh * 0.62, rotation: -2.5, duration: 1.2 }, 2.6)
      .to(env, { y: sh * 0.08, duration: 1.0 }, 2.6)

    // 4) envelope dropped out of frame
      .to(env, { y: window.innerHeight * 1.1, duration: 0.8, ease: 'power2.in' }, 3.8)

    // 5) card comes to the camera
      .to(card, { y: function () {
        var r = stage.getBoundingClientRect();
        return window.innerHeight / 2 - (r.top + r.height / 2);
      }, rotation: 0, scale: 1, duration: 0.9, ease: 'power3.inOut' }, 4.3)

    // 6) fade through dark into the cover
      .to(card, { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, 5.1);
  }

  seal.addEventListener('click', function (e) { e.stopPropagation(); openEnvelope(); });
  stage.addEventListener('click', openEnvelope);

  /* ---------- idle float + pointer tilt ---------- */
  function startIdle() {
    if (!g || still || reduce) { return; }
    g.set(tiltEl, { transformPerspective: 900 });
    idleTween = g.to(stage, { y: -6, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    if (!weak) {
      var rx = g.quickTo(tiltEl, 'rotationX', { duration: 0.8, ease: 'power3.out' });
      var ry = g.quickTo(tiltEl, 'rotationY', { duration: 0.8, ease: 'power3.out' });
      window.addEventListener('pointermove', function (e) {
        if (opened) { return; }
        ry(((e.clientX / window.innerWidth) - 0.5) * 10);
        rx(-((e.clientY / window.innerHeight) - 0.5) * 8);
      }, { passive: true });
    }
  }

  /* ---------- boot ---------- */
  applyLang();
  if (!g && !still) {
    console.warn('GSAP did not load; skipping the envelope animation.');
    finish();
  } else {
    sizeCard();
    window.addEventListener('resize', function () { if (!opened) { sizeCard(); } });
    startIdle();
  }
})();
