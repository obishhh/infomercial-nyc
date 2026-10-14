// Early access. The way in is not written in this file: it is locked with
// the password, and only the right one opens it.
(function () {
  var LOCK = {"salt": "M6RQsE23OgzuP/Rz0FS+/g==", "iv": "85j0pQ1QeKjwI/rZ", "data": "AFpHc8mHPEQ0OlsdgpO+N98qOO14jRfZnsyioP2xBvlCgxbAsfMOONUDPg/8AOgB6vtLmlHTOvmfkg==", "rounds": 600000};

  var row = document.getElementById('row');
  var door = document.getElementById('early');
  var box = document.getElementById('word');
  var go = document.getElementById('go');
  var way = document.getElementById('in');
  if (!row || !window.crypto || !crypto.subtle) return;

  function bytes(text) {
    var raw = atob(text), out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }
  function show(state) {
    row.dataset.state = state;
    door.setAttribute('aria-expanded', state === 'soon' ? 'false' : 'true');
    if (state === 'ask') box.focus();
  }
  // The key in the small print opens the box, and puts it away again.
  door.addEventListener('click', function () {
    if (row.dataset.state === 'open') return;
    show(row.dataset.state === 'soon' ? 'ask' : 'soon');
  });

  function answer(line) {
    box.value = '';
    box.placeholder = line;
    box.classList.add('no');
    box.focus();
  }
  function tryIt() {
    // A phone capitalises the first letter of anything typed.
    var word = box.value.trim().toLowerCase();
    if (!word) { answer('Type it first.'); return; }
    go.disabled = true;
    go.classList.add('busy');
    crypto.subtle.importKey('raw', new TextEncoder().encode(word), 'PBKDF2', false, ['deriveKey'])
      .then(function (base) {
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: bytes(LOCK.salt), iterations: LOCK.rounds, hash: 'SHA-256' },
          base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      })
      .then(function (key) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(LOCK.iv) }, key, bytes(LOCK.data)); })
      .then(function (plain) {
        var link = new TextDecoder().decode(plain);
        if (link.indexOf('https://testflight.apple.com/') !== 0) throw new Error('not the way in');
        way.href = link;
        show('open');
      })
      .catch(function () { answer("That's not it."); })
      .then(function () { go.disabled = false; go.classList.remove('busy'); });
  }
  go.addEventListener('click', tryIt);
  box.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); tryIt(); } });
  box.addEventListener('input', function () { box.classList.remove('no'); });
})();
