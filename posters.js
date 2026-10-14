// The launch posters: one up at a time, and the keys either side slide the
// next one on. Round and round: after the last comes the first.
(function () {
  var stage = document.getElementById('stage');
  if (!stage) return;
  var slots = Array.prototype.slice.call(stage.querySelectorAll('.slot'));
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var n = slots.length;
  if (n < 2) return;
  var at = 0, running = [], leaving = null;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A poster's picture is fetched once it is next in line, not before.
  function load(i) {
    var img = slots[(i + n) % n].querySelector('img[data-src]');
    if (img) { img.src = img.getAttribute('data-src'); img.removeAttribute('data-src'); }
  }
  function ahead() { load(at + 1); load(at - 1); }

  // A slide still going is finished at once: the one leaving goes, and the
  // one coming on is where it was going.
  function settle() {
    running.forEach(function (a) { a.cancel(); });
    running = [];
    if (leaving) { leaving.hidden = true; leaving = null; }
  }

  function go(step) {
    settle();
    var from = slots[at];
    at = (at + step + n) % n;
    var to = slots[at];
    load(at);
    to.hidden = false;
    ahead();
    if (still || !from.animate) { from.hidden = true; return; }
    // Far enough that each is off the screen at the far end of its slide.
    var far = window.innerWidth / 2 + stage.offsetWidth / 2 + 40;
    var timing = { duration: 460, easing: 'cubic-bezier(.22, .8, .24, 1)' };
    var out = from.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(' + (-step * far) + 'px)' }],
      { duration: timing.duration, easing: timing.easing, fill: 'forwards' });
    var on = to.animate([{ transform: 'translateX(' + (step * far) + 'px)' }, { transform: 'translateX(0)' }], timing);
    leaving = from;
    running = [out, on];
    out.onfinish = function () { if (leaving === from) settle(); };
  }

  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });
  prev.hidden = false;
  next.hidden = false;

  // The arrow keys do the same, unless somebody is typing.
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });

  // And so does a swipe across the poster on a phone.
  var x0 = null, y0 = 0;
  stage.addEventListener('touchstart', function (e) {
    x0 = e.touches.length === 1 ? e.touches[0].clientX : null;
    y0 = e.touches.length === 1 ? e.touches[0].clientY : 0;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  });

  // The two either side of the first are fetched once the page is in.
  if (document.readyState === 'complete') ahead();
  else window.addEventListener('load', ahead);
})();
