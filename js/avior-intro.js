/* ============================================================
   AVIOR — Portal de entrada
   El logo se dibuja → aparece "Entrar" → al pulsarlo se abre el telón
   ============================================================ */
(function () {
  "use strict";

  var intro = document.getElementById("intro");
  if (!intro) return;

  /* Si el usuario ya entró en esta sesión, saltar el intro entero */
  try {
    if (sessionStorage.getItem("avior-intro-seen") === "1") {
      if (intro.parentNode) intro.parentNode.removeChild(intro);
      document.body.classList.remove("intro-open");
      return;
    }
  } catch (e) {
    /* sessionStorage puede no estar disponible (modo privado en algunos
       navegadores). Si falla, sigue funcionando normal sin persistencia. */
  }

  // A11y: el resto del sitio queda inert mientras el intro está visible.
  // Esto atrapa el foco naturalmente dentro del intro.
  function setSiblingsInert(value) {
    var sels = ['main', 'footer', 'nav', '.skip-link'];
    for (var i = 0; i < sels.length; i++) {
      var els = document.querySelectorAll(sels[i]);
      for (var j = 0; j < els.length; j++) {
        if (value) els[j].setAttribute('inert', '');
        else els[j].removeAttribute('inert');
      }
    }
  }
  setSiblingsInert(true);

  // Foco inicial al botón "Entrar al estudio" para que el primer tab no se pierda
  setTimeout(function () {
    var enterBtn = intro && intro.querySelector('.intro-enter');
    if (enterBtn) enterBtn.focus();
  }, 250);

  /* ---------- el portal aparece siempre antes de la página ---------- */

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motionMin = document.documentElement.getAttribute("data-motion") === "min";
  var quick = reduceMotion || motionMin;

  var enterBtn = intro.querySelector(".intro-enter");

  document.body.classList.add("intro-open");
  /* sólo animamos la entrada si el usuario permite movimiento;
     si no, el portal ya es visible por su estado base */
  if (!quick) intro.classList.add("is-anim");

  /* ---------- atmósfera: motas, destello, halo, flotación ---------- */
  var sheenTimer = null;
  if (!quick) {
    var motes = intro.querySelector(".intro-motes");
    if (motes) {
      for (var i = 0; i < 14; i++) {
        var m = document.createElement("span");
        m.className = "mote";
        var s = (Math.random() * 2.4 + 1.4).toFixed(1);
        var dur = (Math.random() * 8 + 9).toFixed(1);
        m.style.width = s + "px";
        m.style.height = s + "px";
        m.style.left = (Math.random() * 100).toFixed(1) + "%";
        m.style.top = (Math.random() * 100).toFixed(1) + "%";
        m.style.setProperty("--mo", (Math.random() * 0.32 + 0.14).toFixed(2));
        m.style.setProperty("--mx", (Math.random() * 40 - 20).toFixed(0) + "px");
        m.style.animationDuration = dur + "s";
        m.style.animationDelay = (-Math.random() * dur).toFixed(1) + "s";
        motes.appendChild(m);
      }
    }

    var logo = intro.querySelector(".intro-logo");
    var sheen = intro.querySelector(".intro-word .sheen");

    setTimeout(function () {
      if (logo) { logo.classList.add("halo"); logo.classList.add("afloat"); }
    }, 1300);

    function sweep() {
      if (!sheen) return;
      sheen.classList.remove("go");
      void sheen.offsetWidth;            /* reinicia la animación */
      sheen.classList.add("go");
    }
    setTimeout(function () {
      sweep();
      sheenTimer = setInterval(sweep, 7000);   /* destello sutil mientras se lee */
    }, 1900);
  }

  /* ---------- el botón "Entrar" aparece tras dibujarse el logo ---------- */
  function armEnter() { if (enterBtn) enterBtn.classList.add("ready"); }
  if (quick) armEnter();
  else setTimeout(armEnter, 1650);

  /* ---------- red de seguridad ----------
     Si las animaciones de entrada no llegan a ejecutarse (entornos que
     congelan la animación en el primer fotograma, capturas, etc.), quitamos
     .is-anim para que el estado base —ya visible— tome el control.
     En un navegador normal la animación ya terminó para entonces, así que
     no hay salto visible. */
  if (!quick) {
    setTimeout(function () {
      intro.classList.remove("is-anim");
      armEnter();
    }, 3000);
  }

  /* ---------- abrir el telón y entrar ---------- */
  var left = false;
  function enter() {
    if (left) return;
    left = true;
    setSiblingsInert(false);
    try { sessionStorage.setItem("avior-intro-seen", "1"); } catch (e) {}
    if (sheenTimer) { clearInterval(sheenTimer); sheenTimer = null; }
    // etapa 1: el contenido se desvanece
    intro.classList.add("closing");
    document.body.classList.remove("intro-open");
    // etapa 2: las cortinas se abren
    setTimeout(function () {
      intro.classList.add("leaving");
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("scroll"));
    }, quick ? 200 : 430);
    // limpieza
    setTimeout(function () {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
      window.dispatchEvent(new Event("scroll"));
    }, (quick ? 200 : 430) + 1250);
  }

  if (enterBtn) enterBtn.addEventListener("click", enter);
  document.addEventListener("keydown", function (e) {
    // Solo intercede si el intro está visible y no se está cerrando
    if (left) return;
    if (!document.body.classList.contains("intro-open")) return;
    // Y si el foco está en el intro (o en body por default)
    var ae = document.activeElement;
    if (ae && ae !== document.body && intro && !intro.contains(ae)) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      enter();
    }
  });

})();
