// The word across the band runs from one edge to the other and no further,
// whatever face the phone sets it in, the way the app sizes a channel's
// word: measured once at a size, then scaled to the room. Its line stands
// a touch under the band's foot, so the foot cuts it there.
(function () {
  var band = document.getElementById("band");
  var word = document.getElementById("word");
  if (!band || !word) return;
  var base = word.querySelector(".base");
  var INSET = 12, SINK = 2, PROBE = 100;

  function fit() {
    var room = band.clientWidth - 2 * INSET;
    var most = band.clientHeight * 0.96;
    word.style.fontSize = PROBE + "px";
    var wide = word.getBoundingClientRect().width;
    if (!wide || !room) return;
    var size = Math.min(most, PROBE * room / wide);
    word.style.fontSize = size + "px";
    word.style.bottom = "0px";
    // How far the word's line stands above the foot, set so it stands
    // SINK under it instead.
    var foot = band.getBoundingClientRect().bottom;
    var line = base.getBoundingClientRect().bottom;
    word.style.bottom = (line - foot - SINK) + "px";
  }

  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  if (window.ResizeObserver) new ResizeObserver(fit).observe(band);
  else window.addEventListener("resize", fit);
})();
