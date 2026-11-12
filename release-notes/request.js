// Sends a feature request, from the box at the top of the release notes, to
// the website's own database, which is not the app's. The key below is the
// publishable one: it is meant to be public, and all it can do is call the
// one function that takes a request. The table behind it grants nothing, so
// nobody can read what was sent with it. The function and its limits are in
// the app's repository, Tools/site.
(function () {
  var ENDPOINT = "https://sevwmqmzawqldbnoyeng.supabase.co/rest/v1/rpc/infomercial_request_feature";
  var KEY = "sb_publishable_GYYPD8WhHH8K-CwCmSwtvA_AXjINfCp";

  var form = document.getElementById("request");
  var words = document.getElementById("words");
  var trap = document.getElementById("website");
  var key = document.getElementById("send");
  var said = document.getElementById("said");
  if (!form) return;
  var sending = false;

  function say(text, fault) {
    said.textContent = text;
    said.className = fault ? "said fault" : "said";
  }

  // The box is as tall as what is in it, two lines at the least, and
  // scrolls once it reaches the most its style allows.
  function fit() {
    words.style.height = "auto";
    var edges = words.offsetHeight - words.clientHeight;
    var most = parseFloat(getComputedStyle(words).maxHeight) || Infinity;
    var tall = words.scrollHeight + edges;
    words.style.height = Math.min(tall, most) + "px";
    words.style.overflowY = tall > most ? "auto" : "hidden";
  }

  function sent() {
    words.value = "";
    fit();
    say("Sent. Thanks for the idea.");
  }

  // Typing grows the box, and clears what the last press said.
  words.addEventListener("input", function () {
    fit();
    if (said.textContent) say("");
  });
  window.addEventListener("resize", fit);
  fit();

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (sending) return;
    // Something filled in the field nobody can see: say it went, send nothing.
    if (trap.value) { sent(); return; }

    var body = words.value.trim();
    if (body.length < 3) {
      say("Say a little more first.", true);
      words.focus();
      return;
    }

    sending = true;
    key.disabled = true;
    key.textContent = "Sending";
    say("");

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "apikey": KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ p_body: body })
    })
      .then(function (response) {
        if (response.ok) return;
        return response.json().catch(function () { return {}; }).then(function (error) { throw error || {}; });
      })
      .then(sent)
      .catch(function (error) {
        say(error && error.code === "53400"
          ? "Lots coming in right now. Try again in a bit."
          : "That didn't send. Try again.", true);
      })
      .then(function () {
        sending = false;
        key.disabled = false;
        key.textContent = "Send";
      });
  });
})();
