// The front page's one demonstration: say how far you are, and anything
// written from further on is snow. The same rule the app runs on, on two
// made-up reviews.
(function () {
  var TOTAL = 10;
  var at = 4;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var track = document.getElementById('track');
  var read = document.getElementById('read');
  var catchUp = document.getElementById('catch');
  var rows = Array.prototype.slice.call(document.querySelectorAll('.rv[data-at]'));

  function count(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }
  function clamp(n) { return Math.max(1, Math.min(TOTAL, n)); }

  function draw() {
    var blocks = '';
    for (var i = 1; i <= TOTAL; i++) blocks += '<i class="' + (i === at ? 'at' : i < at ? 'on' : '') + '"></i>';
    track.innerHTML = blocks;
    track.setAttribute('aria-valuenow', at);
    track.setAttribute('aria-valuetext', 'Episode ' + at + ' of ' + TOTAL);
    read.textContent = 'Ep ' + at + '/' + TOTAL;

    // How far off the nearest scrambled review is, never what it says.
    var nearest = 0;
    rows.forEach(function (row) {
      var from = +row.dataset.at;
      var ahead = from > at;
      var tuned = row.hasAttribute('data-tuned');
      var veil = row.querySelector('.veil');
      row.querySelector('[data-away]').textContent = count(from - at, 'episode') + ' ahead';
      veil.hidden = !ahead || tuned;
      veil.classList.remove('off');
      row.querySelector('.read').hidden = ahead && !tuned;
      // Caught up, the tag goes: the review is simply yours to read.
      row.querySelector('.flag').hidden = !(ahead && tuned);
      if (ahead && !tuned && (!nearest || from - at < nearest)) nearest = from - at;
    });
    catchUp.textContent = nearest ? count(nearest, 'episode') + ' → 1 unlock' : 'All clear';
  }

  // A track answers a tap and a drag, and never a brush: a drag moves by how
  // far the finger travelled, and a tap puts the reader on the block tapped.
  var drag = null;
  track.addEventListener('pointerdown', function (e) {
    drag = { x: e.clientX, from: at, moved: false };
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    if (Math.abs(dx) > 6) drag.moved = true;
    if (!drag.moved) return;
    var next = clamp(drag.from + Math.round(dx / (track.offsetWidth / TOTAL)));
    if (next !== at) { at = next; draw(); }
  });
  track.addEventListener('pointerup', function (e) {
    if (drag && !drag.moved) {
      var box = track.getBoundingClientRect();
      at = clamp(Math.floor((e.clientX - box.left) / (box.width / TOTAL)) + 1);
      draw();
    }
    drag = null;
  });
  track.addEventListener('pointercancel', function () { drag = null; });
  track.addEventListener('keydown', function (e) {
    var next = at;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = at + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = at - 1;
    else if (e.key === 'Home') next = 1;
    else if (e.key === 'End') next = TOTAL;
    else return;
    e.preventDefault();
    next = clamp(next);
    if (next !== at) { at = next; draw(); }
  });

  // Tuning in is the reader's call.
  rows.forEach(function (row) {
    var veil = row.querySelector('.veil');
    function tune() { row.setAttribute('data-tuned', ''); draw(); }
    veil.addEventListener('click', function () {
      if (still) { tune(); return; }
      veil.classList.add('off');
      veil.addEventListener('animationend', tune, { once: true });
    });
  });

  // Snow has no direction. A short reel of frames is made once, and each tick
  // shows another of them at another offset, so there is nothing to follow.
  var reel = [];
  (function () {
    var size = 64;
    for (var f = 0; f < 6; f++) {
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      var ctx = canvas.getContext('2d');
      var image = ctx.createImageData(size, size);
      for (var p = 0; p < size * size; p++) {
        var v = Math.random();
        image.data[p * 4] = image.data[p * 4 + 1] = image.data[p * 4 + 2] = 255;
        image.data[p * 4 + 3] = v > 0.8 ? Math.round((v - 0.8) / 0.2 * 120) : 0;
      }
      ctx.putImageData(image, 0, 0);
      reel.push('url(' + canvas.toDataURL() + ')');
    }
  })();
  function roll() {
    var veils = document.querySelectorAll('.veil:not([hidden])');
    for (var i = 0; i < veils.length; i++) {
      veils[i].style.backgroundImage = reel[Math.floor(Math.random() * reel.length)];
      veils[i].style.backgroundPosition = Math.floor(Math.random() * 128) + 'px ' + Math.floor(Math.random() * 128) + 'px';
    }
  }
  var rolling = null;
  function run(on) {
    if (on && !rolling && !still) rolling = setInterval(roll, 1000 / 16);
    if (!on && rolling) { clearInterval(rolling); rolling = null; }
  }
  // It stands still while it is off the screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { run(entries[0].isIntersecting); }).observe(document.querySelector('.demo'));
  } else {
    run(true);
  }

  // The phone-in closes at midnight, on the reader's own clock. Hours, until
  // the last one.
  var closes = document.getElementById('closes');
  if (closes) {
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var minutes = Math.ceil((midnight - now) / 60000);
    closes.textContent = 'Closes in ' + (minutes > 60 ? Math.ceil(minutes / 60) + 'h' : minutes + 'm');
  }

  draw();
  roll();
})();
