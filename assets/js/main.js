/*
  Curso oficial de IA · Landing
  Idioma ES/CA, temario, preguntas frecuentes, animaciones de aparición y formulario.
*/
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIGURACIÓN
     endpoint: URL del webhook de entrada del Sistema Advantys que recibe
     las inscripciones (POST, JSON). Mientras esté vacío, el formulario
     funciona en modo demostración: simula el envío y muestra el éxito.
  ------------------------------------------------------------------ */
  var CONFIG = {
    endpoint: "",
    origen: "landing-curso-ia-ccandorra",
    idiomaPorDefecto: "es"
  };

  var I18N = window.I18N;
  var LANGS = ["es", "ca"];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var state = { lang: CONFIG.idiomaPorDefecto, block: 0 };

  function t(key) {
    var dict = I18N[state.lang] || I18N.es;
    return dict[key] != null ? dict[key] : (I18N.es[key] != null ? I18N.es[key] : "");
  }

  function storageGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function storageSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }

  /* ---------------- Idioma ---------------- */
  function detectLang() {
    var param = new URLSearchParams(window.location.search).get("lang");
    if (LANGS.indexOf(param) > -1) return param;
    var saved = storageGet("curso-ia-lang");
    if (LANGS.indexOf(saved) > -1) return saved;
    var nav = (navigator.language || "").toLowerCase();
    if (nav.indexOf("ca") === 0) return "ca";
    return CONFIG.idiomaPorDefecto;
  }

  function applyLang(lang, opts) {
    state.lang = lang;
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n"));
      if (typeof val === "string" && val) el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length === 2) el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });

    var sw = document.querySelector(".lang-switch");
    if (sw) sw.setAttribute("data-active", lang);
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });

    // El idioma del curso en el formulario sigue al de la web si no se ha tocado
    var form = document.querySelector("[data-form]");
    if (form && !form.dataset.langTouched) {
      var radio = form.querySelector('input[name="idioma_curso"][value="' + lang + '"]');
      if (radio) radio.checked = true;
    }

    renderProgram(false);
    renderFaq();
    refreshSuccess();
    renderDemo();

    if (!opts || !opts.initial) {
      storageSet("curso-ia-lang", lang);
      var url = new URL(window.location.href);
      if (lang === CONFIG.idiomaPorDefecto) url.searchParams.delete("lang");
      else url.searchParams.set("lang", lang);
      history.replaceState(null, "", url.toString());
    }
  }

  var mainEl = document.querySelector("main");
  var switchTimer = null;

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-lang");
      if (lang === state.lang) return;
      if (reduceMotion.matches || !mainEl) { applyLang(lang); return; }
      // Fundido breve: baja la opacidad, cambia los textos y vuelve
      window.clearTimeout(switchTimer);
      mainEl.classList.add("is-switching");
      switchTimer = window.setTimeout(function () {
        applyLang(lang);
        mainEl.classList.remove("is-switching");
      }, 120);
    });
  });

  /* ---------------- Temario (pestañas) ---------------- */
  var tabsEl = document.querySelector("[data-program-tabs]");
  var panelEl = document.querySelector("[data-program-panel]");

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function renderTabs() {
    var data = t("program.data");
    tabsEl.innerHTML = data.map(function (b, i) {
      var sel = i === state.block;
      return (
        '<button type="button" role="tab" class="program-tab" id="tab-' + i + '"' +
        ' aria-selected="' + sel + '" aria-controls="program-panel" tabindex="' + (sel ? 0 : -1) + '" data-index="' + i + '">' +
        '<span class="program-tab-num" aria-hidden="true">' + (i + 1) + "</span>" +
        '<span class="program-tab-title">' + esc(b.title) + "</span>" +
        '<span class="program-tab-meta">' + b.videos.length + " " + esc(t("program.videos")) + " · " + b.minutes + " min</span>" +
        "</button>"
      );
    }).join("");
  }

  function panelHtml() {
    var b = t("program.data")[state.block];
    var n = state.block + 1;
    return (
      '<div class="panel-anim">' +
      '<p class="panel-kicker">' + esc(t("program.block")) + " " + n + "</p>" +
      '<h3 class="panel-title">' + esc(b.title) + "</h3>" +
      '<p class="panel-goal">' + esc(b.goal) + "</p>" +
      '<ol class="panel-list">' +
      b.videos.map(function (v, i) {
        return (
          '<li style="--r:' + i + '">' +
          '<span class="v-num">' + n + "." + (i + 1) + "</span>" +
          '<span class="v-title">' + esc(v) + "</span>" +
          '<span class="v-time"><svg aria-hidden="true"><use href="#i-clock"/></svg>10 min</span>' +
          "</li>"
        );
      }).join("") +
      "</ol></div>"
    );
  }

  function renderProgram(animate) {
    if (!tabsEl || !panelEl) return;
    renderTabs();
    panelEl.setAttribute("id", "program-panel");
    panelEl.setAttribute("aria-labelledby", "tab-" + state.block);

    var current = panelEl.querySelector(".panel-anim");
    if (!animate || !current || reduceMotion.matches) {
      panelEl.innerHTML = panelHtml();
      return;
    }
    // Salida breve y entrada del nuevo contenido
    current.classList.add("is-leaving");
    window.setTimeout(function () {
      panelEl.innerHTML = panelHtml();
      var next = panelEl.querySelector(".panel-anim");
      next.classList.add("is-leaving", "is-staggered");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { next.classList.remove("is-leaving"); });
      });
    }, 140);
  }

  function selectBlock(i, focus) {
    if (i === state.block) return;
    state.block = i;
    renderProgram(true);
    var tab = document.getElementById("tab-" + i);
    if (tab) {
      if (focus) tab.focus();
      tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion.matches ? "auto" : "smooth" });
    }
  }

  if (tabsEl) {
    tabsEl.addEventListener("click", function (e) {
      var tab = e.target.closest("[role=tab]");
      if (tab) selectBlock(Number(tab.getAttribute("data-index")), false);
    });
    tabsEl.addEventListener("keydown", function (e) {
      var total = t("program.data").length;
      var i = state.block;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") i = (i + 1) % total;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") i = (i - 1 + total) % total;
      else if (e.key === "Home") i = 0;
      else if (e.key === "End") i = total - 1;
      else return;
      e.preventDefault();
      selectBlock(i, true);
    });
  }

  /* ---------------- Preguntas frecuentes ---------------- */
  var faqEl = document.querySelector("[data-faq]");
  var FAQ_COUNT = 7;

  function renderFaq() {
    if (!faqEl) return;
    var open = [];
    faqEl.querySelectorAll(".faq-q").forEach(function (q, i) {
      if (q.getAttribute("aria-expanded") === "true") open.push(i);
    });
    var html = "";
    for (var i = 1; i <= FAQ_COUNT; i++) {
      var isOpen = open.indexOf(i - 1) > -1;
      html +=
        '<div class="faq-item">' +
        '<button type="button" class="faq-q" id="faq-q-' + i + '" aria-expanded="' + isOpen + '" aria-controls="faq-a-' + i + '">' +
        "<span>" + esc(t("faq." + i + ".q")) + "</span>" +
        '<span class="faq-icon" aria-hidden="true"><svg><use href="#i-plus"/></svg></span>' +
        "</button>" +
        '<div class="faq-a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '"' + (isOpen ? "" : " inert") + ">" +
        "<div><p>" + esc(t("faq." + i + ".a")) + "</p></div>" +
        "</div></div>";
    }
    faqEl.innerHTML = html;
  }

  if (faqEl) {
    faqEl.addEventListener("click", function (e) {
      var q = e.target.closest(".faq-q");
      if (!q) return;
      var open = q.getAttribute("aria-expanded") === "true";
      q.setAttribute("aria-expanded", String(!open));
      var a = document.getElementById(q.getAttribute("aria-controls"));
      if (a) {
        if (open) a.setAttribute("inert", "");
        else a.removeAttribute("inert");
      }
    });
  }

  /* ---------------- Cabecera: línea inferior al hacer scroll ---------------- */
  var header = document.querySelector("[data-header]");
  var sentinel = document.querySelector("[data-header-sentinel]");
  if (header && sentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---------------- Aparición al hacer scroll ---------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Formulario ---------------- */
  var form = document.querySelector("[data-form]");
  var success = document.querySelector("[data-form-success]");
  var successBody = document.querySelector("[data-success-body]");
  var formError = document.querySelector("[data-form-error]");
  var submitBtn = document.querySelector("[data-submit]");
  var submittedEmail = "";

  function refreshSuccess() {
    if (successBody && submittedEmail) {
      successBody.innerHTML = t("form.ok.body").replace("{email}", esc(submittedEmail));
    }
  }

  function setError(input, key) {
    var errId = input.getAttribute("aria-describedby");
    var errEl = errId ? document.getElementById(errId) : null;
    if (key) {
      input.setAttribute("aria-invalid", "true");
      if (errEl) errEl.textContent = t(key);
    } else {
      input.removeAttribute("aria-invalid");
      if (errEl) errEl.textContent = "";
    }
  }

  function validateField(input) {
    if (input.type === "checkbox") {
      if (input.required && !input.checked) { setError(input, "form.err.privacy"); return false; }
      setError(input, null); return true;
    }
    var v = input.value.trim();
    if (input.required && !v) { setError(input, "form.err.required"); return false; }
    if (input.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      setError(input, "form.err.email"); return false;
    }
    setError(input, null); return true;
  }

  if (form) {
    var validated = form.querySelectorAll("[required]");

    validated.forEach(function (input) {
      input.addEventListener("blur", function () {
        if (input.value || input.getAttribute("aria-invalid")) validateField(input);
      });
      input.addEventListener(input.tagName === "SELECT" || input.type === "checkbox" ? "change" : "input", function () {
        if (input.getAttribute("aria-invalid")) validateField(input);
      });
    });

    form.querySelectorAll('input[name="idioma_curso"]').forEach(function (r) {
      r.addEventListener("change", function () { form.dataset.langTouched = "1"; });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formError.hidden = true;

      var firstInvalid = null;
      validated.forEach(function (input) {
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }

      var fd = new FormData(form);
      if (fd.get("web")) return; // bot

      var payload = {
        nombre: String(fd.get("nombre") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        empresa: String(fd.get("empresa") || "").trim(),
        perfil: fd.get("perfil"),
        sector: fd.get("sector"),
        idioma_curso: fd.get("idioma_curso"),
        acepta_privacidad: true,
        acepta_novedades: fd.get("acepta_novedades") === "on",
        idioma_web: state.lang,
        origen: CONFIG.origen,
        fecha: new Date().toISOString()
      };

      submitBtn.classList.add("is-loading");
      submitBtn.setAttribute("aria-busy", "true");
      submitBtn.querySelector(".btn-label").textContent = t("form.sending");

      send(payload).then(function () {
        submittedEmail = payload.email;
        refreshSuccess();
        form.hidden = true;
        success.hidden = false;
        success.focus();
      }).catch(function () {
        formError.textContent = t("form.err.send");
        formError.hidden = false;
      }).then(function () {
        submitBtn.classList.remove("is-loading");
        submitBtn.removeAttribute("aria-busy");
        submitBtn.querySelector(".btn-label").textContent = t("form.submit");
      });
    });
  }

  function send(payload) {
    if (!CONFIG.endpoint) {
      // Modo demostración
      console.info("[Curso IA] Modo demostración. Datos que se enviarían:", payload);
      return new Promise(function (resolve) { window.setTimeout(resolve, 900); });
    }
    return fetch(CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res;
    });
  }

  /* ---------------- Demostración: prompt -> correo ----------------
     Se reproduce una sola vez, cuando el bloque entra en pantalla.
     Con animaciones reducidas (o tras un cambio de idioma) se muestra terminada. */
  var demo = document.querySelector("[data-demo]");
  var demoState = "idle"; // idle | running | done
  var demoTimers = [];
  var TYPE_MS = 16;          // milisegundos por carácter
  var THINK_MS = 650;        // pausa de "la IA está escribiendo"

  function demoClearTimers() {
    demoTimers.forEach(function (id) { window.clearTimeout(id); });
    demoTimers = [];
  }

  function renderDemo() {
    if (!demo) return;
    var prompt = t("demo.prompt");
    var lines = t("demo.answer") || [];
    demo.querySelector("[data-demo-sr]").textContent = t("demo.sr");
    demo.querySelector("[data-demo-ghost]").textContent = prompt;
    demo.querySelector("[data-demo-answer]").innerHTML =
      '<div class="demo-thinking"><span></span><span></span><span></span></div>' +
      lines.map(function (l, i) { return '<p class="demo-line" style="--r:' + i + '">' + l + "</p>"; }).join("");

    // Si ya se estaba reproduciendo o había terminado, se muestra completa en el nuevo idioma
    if (demoState !== "idle") {
      demoClearTimers();
      demoState = "done";
      demoFinal();
    } else {
      demo.querySelector("[data-demo-typed]").textContent = "";
    }
  }

  function demoFinal() {
    demo.querySelector("[data-demo-typed]").textContent = t("demo.prompt");
    demo.classList.remove("is-typing", "is-thinking");
    demo.classList.add("is-answered");
  }

  function playDemo() {
    if (!demo || demoState !== "idle") return;
    if (reduceMotion.matches) { demoState = "done"; demoFinal(); return; }
    demoState = "running";
    var prompt = t("demo.prompt");
    var typed = demo.querySelector("[data-demo-typed]");
    var i = 0;
    demo.classList.add("is-typing");

    (function type() {
      i += 1;
      typed.textContent = prompt.slice(0, i);
      if (i < prompt.length) {
        demoTimers.push(window.setTimeout(type, TYPE_MS));
      } else {
        demo.classList.remove("is-typing");
        demo.classList.add("is-thinking");
        demoTimers.push(window.setTimeout(function () {
          demo.classList.remove("is-thinking");
          demo.classList.add("is-answered");
          demoState = "done";
        }, THINK_MS));
      }
    })();
  }

  if (demo) {
    if ("IntersectionObserver" in window) {
      var demoIo = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          demoIo.disconnect();
          // Pequeña espera para que termine la aparición del bloque
          demoTimers.push(window.setTimeout(playDemo, 350));
        }
      }, { threshold: 0.6 });
      demoIo.observe(demo);
    } else {
      demoState = "done";
    }
  }

  /* ---------------- Inicio ---------------- */
  applyLang(detectLang(), { initial: true });
  if (demo && !("IntersectionObserver" in window)) demoFinal();
})();