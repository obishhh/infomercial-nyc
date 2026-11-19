// An invitation's page. The code is in the address (?c=), eight of the
// app's letters. Step 1 copies the whole link, so setup's Paste invite has
// it; step 2 goes to the App Store, copying it again on the way in case 1
// was skipped. Somebody who has the app already opens it with the code.
(function () {
  var code = (new URLSearchParams(location.search).get('c') || '').toLowerCase();
  var $ = function (id) { return document.getElementById(id); };
  if (!/^[2-9a-hjkmnp-z]{8}$/.test(code)) {
    // No invitation in it: the page is only the way to the app.
    $('steps').hidden = true;
    $('getonly').hidden = false;
    return;
  }
  var link = 'https://infomercial.nyc/i?c=' + code;
  $('open').href = 'infomercial://i?c=' + code;
  $('have').hidden = false;

  function copy() {
    if (!navigator.clipboard || !navigator.clipboard.writeText) return Promise.reject();
    return navigator.clipboard.writeText(link);
  }
  var get = $('get');
  var button = $('copy');
  button.addEventListener('click', function () {
    copy().then(function () {
      // Step 1 is done and steps back; step 2 is the one to press now.
      button.textContent = 'Copied';
      button.classList.remove('loud');
      button.classList.add('plain');
      get.classList.remove('plain');
      get.classList.add('loud');
    }, function () {
      $('copied').textContent = 'Couldn’t copy it here. Go back to your message, press and hold the link, and choose Copy.';
      $('copied').hidden = false;
    });
  });
  get.addEventListener('click', function (event) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) return;
    event.preventDefault();
    var go = function () { location.href = get.href; };
    copy().then(go, go);
  });
})();
