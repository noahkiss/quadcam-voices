// Reads index.json and lists each pack with its facts and preview lines.
(function () {
  "use strict";

  var INDEX = "index.json";
  var PLAY = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1l9 5-9 5z"/></svg>';
  var STOP = '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="2" width="8" height="8"/></svg>';
  var PROVIDERS = { elevenlabs: "ElevenLabs", openai: "OpenAI-compatible server", say: "macOS say" };

  var player = document.getElementById("player");
  var status = document.getElementById("status");
  var list = document.getElementById("packs");
  var playing = null;

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  }

  function size(bytes) {
    if (!bytes) return "";
    if (bytes >= 1e9) return (bytes / 1e9).toFixed(1) + " GB";
    if (bytes >= 1e6) return (bytes / 1e6).toFixed(1) + " MB";
    return Math.max(1, Math.round(bytes / 1e3)) + " KB";
  }

  function fact(dl, term, value) {
    if (!value) return;
    var d = el("div");
    d.appendChild(el("dt", null, term));
    d.appendChild(el("dd", null, value));
    dl.appendChild(d);
  }

  function resolve(file) {
    return new URL(file, new URL(INDEX, document.baseURI)).href;
  }

  function stop() {
    if (!playing) return;
    playing.setAttribute("aria-pressed", "false");
    playing.querySelector("span.icon").innerHTML = PLAY;
    playing = null;
    player.pause();
  }

  function play(button, url) {
    var same = playing === button;
    stop();
    if (same) return;
    playing = button;
    button.setAttribute("aria-pressed", "true");
    button.querySelector("span.icon").innerHTML = STOP;
    player.src = url;
    player.play().catch(function () {
      stop();
      status.textContent = "This browser could not play the preview.";
    });
  }

  player.addEventListener("ended", stop);

  function card(p) {
    var li = el("li", { class: "pack" });
    var head = el("div", { class: "pack-head" });
    head.appendChild(el("h3", null, p.voice || p.id));
    head.appendChild(el("span", { class: "pack-id" }, p.id + (p.version ? " · v" + p.version : "")));
    li.appendChild(head);

    var dl = el("dl", { class: "facts" });
    var provider = PROVIDERS[p.provider] || p.provider;
    fact(dl, "Provider", provider);
    fact(dl, "Model", p.model);
    fact(dl, "Language", p.lang);
    fact(dl, "Lines", p.lines ? String(p.lines) : "");
    fact(dl, "Download", size(p.zip_bytes));
    fact(dl, "On the card", size(p.bytes));
    fact(dl, "License", p.license);
    fact(dl, "Released", p.date);
    li.appendChild(dl);

    if (p.attribution) li.appendChild(el("p", { class: "attribution" }, p.attribution));

    var previews = p.preview || [];
    if (previews.length) {
      var ul = el("ul", { class: "previews", "aria-label": "Preview lines of " + (p.voice || p.id) });
      previews.forEach(function (line) {
        var item = el("li");
        var b = el("button", { type: "button", class: "play", "aria-pressed": "false" });
        var icon = el("span", { class: "icon" });
        icon.innerHTML = PLAY;
        b.appendChild(icon);
        b.appendChild(el("span", null, line.text));
        b.addEventListener("click", function () { play(b, resolve(line.file)); });
        item.appendChild(b);
        ul.appendChild(item);
      });
      li.appendChild(ul);
    }

    var actions = el("div", { class: "actions" });
    if (p.url) actions.appendChild(el("a", { class: "download", href: p.url }, "Download zip"));
    actions.appendChild(el("span", { class: "hint" }, "Or install it in QuadCam: Gear > Voices > Get voice packs."));
    li.appendChild(actions);
    return li;
  }

  fetch(INDEX, { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function (idx) {
      var packs = (idx.packs || []).slice().sort(function (a, b) {
        return (a.voice || a.id).localeCompare(b.voice || b.id);
      });
      if (!packs.length) {
        status.textContent = "No packs yet.";
        return;
      }
      status.textContent = packs.length === 1 ? "1 pack." : packs.length + " packs.";
      packs.forEach(function (p) { list.appendChild(card(p)); });
    })
    .catch(function () {
      status.textContent = "The pack list did not load. Try again later.";
    });
})();
