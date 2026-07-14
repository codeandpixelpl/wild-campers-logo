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
