/* Sections below the cover. Plain JS (no libraries): reveals, countdown, programme thread,
   gallery + viewer, venue map + calendar file, candles, share buttons. */
(function () {
  'use strict';

  var D = window.INVITE, I = window.I18N, App = window.App;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var lang = function () { return App.lang(); };
  var reduce = App.reduce;
  function t(key) { return I[lang()][key] || ''; }

  /* =================== line icons for the programme (original, simple) =================== */
  var ICONS = {
    home:  ['M7 23 L24 9 L41 23', 'M11 20 V39 H37 V20', 'M21 39 V29 H27 V39', 'M24 3 C22 6 25 7 24 10'],
    lotus: ['M24 6 C30 14 30 28 24 36 C18 28 18 14 24 6 Z', 'M24 36 C15 33 9 25 10 15 C17 19 22 26 24 36 Z',
            'M24 36 C33 33 39 25 38 15 C31 19 26 26 24 36 Z', 'M8 42 Q24 37 40 42'],
    gift:  ['M9 21 H39 V41 H9 Z', 'M7 14 H41 V21 H7 Z', 'M24 14 V41', 'M24 14 C18 5 11 8 16 13', 'M24 14 C30 5 37 8 32 13'],
    water: ['M24 6 C16 18 14 24 14 29 A10 10 0 0 0 34 29 C34 24 32 18 24 6 Z', 'M38 12 C35 17 34 19 34 21 A4 4 0 0 0 42 21 C42 19 41 17 38 12 Z'],
    bell:  ['M24 6 V11', 'M13 35 C13 22 17 12 24 12 C31 12 35 22 35 35 Z', 'M8 35 H40', 'M20 39 A4 4 0 0 0 28 39'],
    bowl:  ['M7 23 H41 C41 34 33 41 24 41 C15 41 7 34 7 23 Z', 'M17 41 H31', 'M16 17 C18 13 18 11 16 7', 'M24 17 C26 13 26 11 24 7', 'M32 17 C34 13 34 11 32 7'],
    merit: ['M18 24 A6 6 0 1 0 30 24 A6 6 0 1 0 18 24 Z', 'M24 6 V13', 'M24 35 V42', 'M6 24 H13', 'M35 24 H42',
            'M11 11 L16 16', 'M32 32 L37 37', 'M37 11 L32 16', 'M16 32 L11 37']
  };
  function iconSVG(name) {
    var p = ICONS[name] || ICONS.merit;
    return '<svg viewBox="0 0 48 48" aria-hidden="true">' + p.map(function (d) { return '<path pathLength="1" d="' + d + '"/>'; }).join('') + '</svg>';
  }

  /* =================== reveal on scroll =================== */
  var CLIPPED = { wipe: 1, arch: 1, map: 1, logo: 1 };
  function reveal(el) {
    if (el.classList.contains('in')) { return; }
    el.classList.add('in');
    var kind = el.getAttribute('data-rv');
    if (CLIPPED[kind]) {
      // clip-paths are cleared once the reveal has finished so shadows and marks are never cut
      setTimeout(function () { el.classList.add('done'); }, 2800);
    }
  }
  function setupReveals() {
    var els = $$('[data-rv]');
    els.forEach(function (el) {
      if (el.hasAttribute('data-i')) { el.style.setProperty('--i', el.getAttribute('data-i')); }
    });
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in', 'done'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* =================== words: hosts on two lines =================== */
  function renderHosts() {
    var l = D.hosts.lines[lang()];
    $('#hostL1').textContent = l[0];
    $('#hostL2').textContent = l[1];
  }

  /* =================== countdown + blessing marquee =================== */
  var target = new Date(D.eventISO).getTime();
  var prev = {};
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function setUnit(u, val) {
    var el = $('[data-u="' + u + '"]');
    var s = App.num(two(val));
    if (prev[u] === s) { return; }
    prev[u] = s;
    el.textContent = s;
    if (!reduce) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
  }
  var cdTimer = null;
  function tickCD() {
    var diff = target - Date.now();
    if (isNaN(target)) { return; }
    if (diff <= 0) {
      $('#cdGrid').hidden = true; $('#cdDone').hidden = false;
      if (cdTimer) { clearInterval(cdTimer); cdTimer = null; }
      return;
    }
    var s = Math.floor(diff / 1000);
    setUnit('d', Math.floor(s / 86400));
    setUnit('h', Math.floor(s % 86400 / 3600));
    setUnit('m', Math.floor(s % 3600 / 60));
    setUnit('s', s % 60);
  }
  function startCD() {
    tickCD();
    cdTimer = setInterval(function () { if (!document.hidden) { tickCD(); } }, 1000);
  }
  function renderMarquee() {
    var txt = D.blessing[lang()];
    var one = '';
    for (var i = 0; i < 4; i++) { one += '<span>' + txt + '</span>'; }
    $('#mq').innerHTML = '<div class="mq-half">' + one + '</div><div class="mq-half" aria-hidden="true">' + one + '</div>';
  }

  /* =================== programme: thread + icons =================== */
  var pgItems = [];
  function buildProgram() {
    var ol = $('#pgList');
    D.program.items.forEach(function (it, i) {
      var li = document.createElement('li');
      li.className = 'pg-li';
      li.innerHTML = '<span class="pg-ico">' + iconSVG(it.icon) + '</span>' +
        '<div class="pg-txt"><span class="pg-n"></span><p></p></div>';
      ol.appendChild(li);
      pgItems.push({ li: li, ico: $('.pg-ico', li), n: $('.pg-n', li), p: $('p', li), data: it, idx: i });
    });
  }
  function renderProgram() {
    pgItems.forEach(function (o) {
      o.n.textContent = App.num(o.idx + 1);
      o.p.textContent = o.data[lang()];
    });
    layoutThread();
  }
  function layoutThread() {
    if (!pgItems.length) { return; }
    var ol = $('#pgList'), first = pgItems[0].ico, last = pgItems[pgItems.length - 1].ico;
    var o = ol.getBoundingClientRect();
    var a = first.getBoundingClientRect(), b = last.getBoundingClientRect();
    var top = a.top + a.height / 2 - o.top, bottom = b.top + b.height / 2 - o.top;
    var th = $('.pg-thread', ol);
    th.style.top = top + 'px';
    th.style.height = Math.max(0, bottom - top) + 'px';
  }
  var ticking = false;
  function onScrollProgram() {
    if (ticking) { return; }
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (!pgItems.length) { return; }
      var anchor = window.innerHeight * 0.62;
      var th = $('.pg-thread'), fill = $('#threadFill');
      var tr = th.getBoundingClientRect();
      var p = tr.height > 0 ? Math.min(1, Math.max(0, (anchor - tr.top) / tr.height)) : 0;
      fill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      pgItems.forEach(function (o) {
        var r = o.ico.getBoundingClientRect();
        var lit = r.top + r.height / 2 < anchor;
        if (lit !== o.li.classList.contains('lit')) { o.li.classList.toggle('lit', lit); }
      });
    });
  }

  /* =================== gallery + full-screen viewer =================== */
  var gl = window.GALLERY || [], cur = 0, lbOpen = false;
  function buildGallery() {
    var sec = $('#gallery');
    if (!gl.length) { sec.hidden = true; return; }
    sec.hidden = false;
    var grid = $('.g-grid', sec);
    gl.forEach(function (it, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'g-item'; b.setAttribute('data-rv', 'blur'); b.setAttribute('data-i', String(i % 4));
      var im = new Image();
      im.src = it.thumb || it.src; im.alt = it.alt || ''; im.loading = 'lazy'; im.decoding = 'async';
      if (it.w && it.h) { im.width = it.w; im.height = it.h; }
      b.appendChild(im);
      b.addEventListener('click', function () { openLB(i); });
      grid.appendChild(b);
    });
  }
  function showLB(dir) {
    var it = gl[cur], img = $('#lbImg');
    img.classList.remove('from-r', 'from-l');
    img.src = it.full || it.src; img.alt = it.alt || '';
    if (dir && !reduce) { void img.offsetWidth; img.classList.add(dir > 0 ? 'from-r' : 'from-l'); }
    $('#lbCount').textContent = App.num(cur + 1) + ' / ' + App.num(gl.length);
    $('#lbP').hidden = $('#lbN').hidden = gl.length < 2;
  }
  function openLB(i) {
    cur = i; lbOpen = true;
    $('#lb').hidden = false; document.body.style.overflow = 'hidden';
    showLB(0); $('#lbX').focus();
  }
  function closeLB() { lbOpen = false; $('#lb').hidden = true; document.body.style.overflow = ''; }
  function step(d) { cur = (cur + d + gl.length) % gl.length; showLB(d); }
  function setupLB() {
    $('#lbX').addEventListener('click', closeLB);
    $('#lbP').addEventListener('click', function () { step(-1); });
    $('#lbN').addEventListener('click', function () { step(1); });
    document.addEventListener('keydown', function (e) {
      if (!lbOpen) { return; }
      if (e.key === 'Escape') { closeLB(); } else if (e.key === 'ArrowRight') { step(1); } else if (e.key === 'ArrowLeft') { step(-1); }
    });
    var sx = null, stage = $('.lb-stage');
    stage.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    stage.addEventListener('pointerup', function (e) {
      if (sx === null) { return; }
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) { step(dx < 0 ? 1 : -1); } else if (e.target === stage) { closeLB(); }
    });
    stage.addEventListener('pointercancel', function () { sx = null; });
    $('#lb').addEventListener('click', function (e) { if (e.target === $('#lb')) { closeLB(); } });
  }

  /* =================== venue: map, Google Maps button, calendar file =================== */
  function hasCoords() { return typeof D.venue.lat === 'number' && typeof D.venue.lng === 'number'; }
  function mapsLink() {
    if (D.venue.mapsUrl) { return D.venue.mapsUrl; }
    if (hasCoords()) { return 'https://www.google.com/maps/search/?api=1&query=' + D.venue.lat + ',' + D.venue.lng; }
    return '';
  }
  function renderMap() {
    var box = $('#vnMap'), btn = $('#btnMaps');
    var link = mapsLink();
    if (link) { btn.href = link; btn.classList.remove('is-disabled'); btn.removeAttribute('aria-disabled'); }
    else { btn.removeAttribute('href'); btn.classList.add('is-disabled'); btn.setAttribute('aria-disabled', 'true'); }
    if (hasCoords()) {
      if (!$('iframe', box)) {
        box.innerHTML = '<iframe title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen ' +
          'src="https://maps.google.com/maps?q=' + D.venue.lat + ',' + D.venue.lng + '&z=16&output=embed"></iframe>';
      }
    } else {
      box.innerHTML = '<div class="vn-ph"><img src="assets/svg/lotus.svg" alt=""><p>' + t('mapSoon') + '</p></div>';
    }
  }
  function icsEscape(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); }
  function icsDate(ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z'); }
  function saveICS() {
    var start = new Date(D.eventISO).getTime();
    if (isNaN(start)) { return; }
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitation//KH//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:' + start + '-invitation@local', 'DTSTAMP:' + icsDate(Date.now()), 'DTSTART:' + icsDate(start)];
    if (D.endISO && !isNaN(new Date(D.endISO).getTime())) { lines.push('DTEND:' + icsDate(new Date(D.endISO).getTime())); }
    lines.push('SUMMARY:' + icsEscape(D.event[lang()]));
    lines.push('LOCATION:' + icsEscape([D.venue.name[lang()], D.venue.address[lang()]].join(', ')));
    var m = mapsLink(); if (m) { lines.push('DESCRIPTION:' + icsEscape(m)); }
    lines.push('END:VEVENT', 'END:VCALENDAR');
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'invitation.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  /* =================== thank you: candles + share =================== */
  function buildCandles() {
    var heights = [78, 96, 112, 96, 78], box = $('#candles');
    box.innerHTML = heights.map(function (h) {
      return '<div class="candle" style="--h:' + h + 'px">' +
        '<svg viewBox="0 0 40 150" aria-hidden="true">' +
        '<defs><radialGradient id="gl' + h + '"><stop offset="0" stop-color="#fff6d8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient></defs>' +
        '<circle class="c-glow" cx="20" cy="' + (150 - h - 20) + '" r="34" fill="url(#gl' + h + ')"/>' +
        '<path class="c-flame" d="M20 ' + (150 - h - 34) + ' C28 ' + (150 - h - 22) + ' 27 ' + (150 - h - 8) + ' 20 ' + (150 - h - 6) + ' C13 ' + (150 - h - 8) + ' 12 ' + (150 - h - 22) + ' 20 ' + (150 - h - 34) + ' Z" fill="#ffe6a3"/>' +
        '<path d="M20 ' + (150 - h - 6) + ' V' + (150 - h) + '" stroke="#55648a" stroke-width="1.6" stroke-linecap="round"/>' +
        '<rect x="8" y="' + (150 - h) + '" width="24" height="' + h + '" rx="2" fill="url(#lg-foil)"/>' +
        '</svg></div>';
    }).join('');
    var io = null;
    function light() {
      $$('.candle', box).forEach(function (c, i) { setTimeout(function () { c.classList.add('lit'); }, reduce ? 0 : i * 520); });
    }
    if (reduce || !('IntersectionObserver' in window)) { light(); return; }
    io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { light(); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(box);
  }

  var SHARE_ICONS = {
    telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M20.7 4.3 3.3 11c-1.2.5-1.2 1.2-.2 1.5l4.4 1.4 1.7 5.2c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.1-2 4.4 3.2c.8.4 1.4.2 1.6-.7l2.9-13.7c.3-1.2-.4-1.7-1.2-1.9z"/></svg>',
    messenger: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 2C6.5 2 2 6.2 2 11.5c0 2.9 1.3 5.4 3.4 7.1V22l3.1-1.7c1 .3 2.2.4 3.5.4 5.5 0 10-4.2 10-9.5S17.5 2 12 2z"/><path fill="#1a6dff" d="M5.8 14.2l4.3-4.6 2.4 2.4 4.1-2.4-4.3 4.6-2.4-2.4z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M14 8.5V6.7c0-.8.2-1.2 1.3-1.2H17V2.2C16.6 2.15 15.6 2 14.5 2 12 2 10.3 3.5 10.3 6.3v2.2H7.5v3.4h2.8V22H14V11.9h2.7l.4-3.4z"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'
  };
  function shareUrl() { return location.origin + location.pathname; }   // never carries ?to=
  function buildShare() {
    var row = $('#shRow');
    var defs = [
      { k: 'telegram', label: 'shTelegram', cls: 'sh-tg' },
      { k: 'messenger', label: 'shMessenger', cls: 'sh-ms' },
      { k: 'facebook', label: 'shFacebook', cls: 'sh-fb' },
      { k: 'link', label: 'shCopy', cls: 'sh-cp' }
    ];
    row.innerHTML = defs.map(function (d) {
      return '<button type="button" class="sh-btn ' + d.cls + '" data-k="' + d.k + '"><span class="sh-ico">' + SHARE_ICONS[d.k] + '</span><span class="sh-lb" data-i18n="' + d.label + '"></span></button>';
    }).join('');
    row.addEventListener('click', function (e) {
      var b = e.target.closest('.sh-btn'); if (!b) { return; }
      var k = b.getAttribute('data-k'), u = encodeURIComponent(shareUrl()), txt = encodeURIComponent(D.shareText[lang()]);
      if (k === 'telegram') { window.open('https://t.me/share/url?url=' + u + '&text=' + txt, '_blank', 'noopener'); }
      else if (k === 'facebook') { window.open('https://www.facebook.com/sharer/sharer.php?u=' + u, '_blank', 'noopener'); }
      else if (k === 'messenger') { location.href = 'fb-messenger://share/?link=' + u; }
      else { copyLink(); }
    });
  }
  var toastTimer = null;
  function toast(msg) {
    var el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }
  function copyLink() {
    var url = shareUrl();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = url; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) { /* ignore */ }
      ta.remove(); toast(t('copied'));
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { toast(t('copied')); }, fallback);
    } else { fallback(); }
  }

  /* =================== language re-render + boot =================== */
  function renderAll() {
    renderHosts(); renderMarquee(); renderProgram(); renderMap();
    prev = {}; tickCD();
    // texts created here carry data-i18n, so fill them in
    var dict = I[lang()];
    $$('#shRow [data-i18n]').forEach(function (el) { el.textContent = dict[el.getAttribute('data-i18n')] || ''; });
    if (lbOpen) { showLB(0); }
  }

  function init() {
    buildProgram(); buildGallery(); buildCandles(); buildShare(); setupLB();
    $('#btnIcs').addEventListener('click', saveICS);
    $('#btnMaps').addEventListener('click', function (e) { if (this.classList.contains('is-disabled')) { e.preventDefault(); } });
    document.addEventListener('langchange', renderAll);
    renderAll();
    startCD();
    setupReveals();
    window.addEventListener('scroll', onScrollProgram, { passive: true });
    window.addEventListener('resize', function () { layoutThread(); onScrollProgram(); });
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { layoutThread(); onScrollProgram(); }); }
    onScrollProgram();
  }
  init();
})();
