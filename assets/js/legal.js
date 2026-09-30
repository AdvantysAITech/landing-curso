/*
  Páginas legales: muestra el texto en castellano o catalán.
  Usa la misma preferencia de idioma que la landing (almacenamiento local "curso-ia-lang").
*/
(function () {
  "use strict";
  var LANGS = ["es", "ca"];

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }

  function detect() {
    var p = new URLSearchParams(location.search).get("lang");
    if (LANGS.indexOf(p) > -1) return p;
    var s = get("curso-ia-lang");
    if (LANGS.indexOf(s) > -1) return s;
    return (navigator.language || "").toLowerCase().indexOf("ca") === 0 ? "ca" : "es";
  }

  var titles = {};
  try { titles = JSON.parse(document.body.getAttribute("data-page-titles")); } catch (e) { /* sin títulos */ }

  function apply(lang, save) {
    document.documentElement.lang = lang;
    if (titles[lang]) document.title = titles[lang];

    document.querySelectorAll("[data-lang-block]").forEach(function (el) {
      el.hidden = el.getAttribute("data-lang-block") !== lang;
    });
    document.querySelectorAll("[data-es]").forEach(function (el) {
      el.textContent = el.getAttribute("data-" + lang);
    });
    document.querySelectorAll("[data-aria-es]").forEach(function (el) {
      el.setAttribute("aria-label", el.getAttribute("data-aria-" + lang));
    });

    var sw = document.querySelector(".lang-switch");
    if (sw) sw.setAttribute("data-active", lang);
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });

    // Los enlaces internos conservan el idioma elegido
    document.querySelectorAll('a:not([href^="http"]):not([href^="mailto"]):not([href^="#"])').forEach(function (a) {
      var url = new URL(a.getAttribute("href"), location.href);
      if (lang === "es") url.searchParams.delete("lang"); else url.searchParams.set("lang", lang);
      var file = url.pathname.split("/").pop() || "./";
      a.setAttribute("href", file + url.search + url.hash);
    });

    if (save) {
      set("curso-ia-lang", lang);
      var u = new URL(location.href);
      if (lang === "es") u.searchParams.delete("lang"); else u.searchParams.set("lang", lang);
      history.replaceState(null, "", u.toString());
    }
  }

  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () { apply(b.getAttribute("data-lang"), true); });
  });

  apply(detect(), false);
})();
