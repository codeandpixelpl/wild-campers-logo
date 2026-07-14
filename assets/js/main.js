/* WILD CAMPERS — interactions */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Mark track horizontal scroll (right → left) ---------- */
  var section = document.getElementById('logo');
  var track = document.getElementById('logosTrack');
  var bar = document.getElementById('logosBar');
  var travel = 0;
  var curr = 0, target = 0;

  function measure() {
    if (!track) return;
    var over = track.scrollWidth - window.innerWidth;
    travel = over > 0 ? over : 0;
  }

  function progress() {
    if (!section) return 0;
    var rect = section.getBoundingClientRect();
    var scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    var p = (-rect.top) / scrollable;
    return Math.max(0, Math.min(1, p));
  }

  function loop() {
    var p = progress();
    target = -travel * p;                 // advance variants left → right
    curr += (target - curr) * (reduce ? 1 : 0.12);
    if (track) track.style.transform = 'translate3d(' + curr.toFixed(2) + 'px,0,0)';
    if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  if (track) {
    var imgs = track.querySelectorAll('img');
    var pending = imgs.length;
    if (!pending) measure();
    imgs.forEach(function (im) {
      if (im.complete) { if (--pending === 0) measure(); }
      else im.addEventListener('load', function () { if (--pending === 0) measure(); });
    });
  }
  measure();
  requestAnimationFrame(loop);

  /* ---------- Color swatches — 3D tilt on hover ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    var MAX = 12; // deg
    document.querySelectorAll('.swatch[data-tilt]').forEach(function (fig) {
      var chip = fig.querySelector('.swatch__chip');
      if (!chip) return;
      fig.addEventListener('mousemove', function (e) {
        var r = chip.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;   // 0..1
        var py = (e.clientY - r.top) / r.height;   // 0..1
        var ry = (px - 0.5) * 2 * MAX;             // rotateY
        var rx = (0.5 - py) * 2 * MAX;             // rotateX
        chip.style.transform =
          'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateZ(24px) scale(1.03)';
      });
      fig.addEventListener('mouseleave', function () {
        chip.style.transform = '';
      });
    });
  }
})();
