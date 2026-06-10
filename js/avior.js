/* ============================================================
   AVIOR — interacciones
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function motionMin() { return document.documentElement.getAttribute("data-motion") === "min"; }

  /* ---------- NAV scroll state ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Custom cursor ---------- */
  var dot = document.querySelector(".cursor-dot");
  var ring = document.querySelector(".cursor-ring");
  if (dot && ring && window.matchMedia("(hover: hover)").matches) {
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    });
    function ringLoop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(ringLoop);
    }
    ringLoop();
    var hoverSel = "a, button, .svc-row, .proj, .channel, .price-card, .testi-card, input, textarea, image-slot";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(hoverSel)) ring.classList.add("hover");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hoverSel)) ring.classList.remove("hover");
    });
    document.addEventListener("mouseleave", function () { dot.style.opacity = ring.style.opacity = "0"; });
    document.addEventListener("mouseenter", function () { dot.style.opacity = ring.style.opacity = "1"; });
  }

  /* ---------- Reveal on scroll (rect-based: robust across embeds) ---------- */
  var revealEls = [].slice.call(document.querySelectorAll("[data-reveal], .line-reveal"));
  function revealCheck() {
    var vh = window.innerHeight;
    for (var i = revealEls.length - 1; i >= 0; i--) {
      var el = revealEls[i];
      var r = el.getBoundingClientRect();
      // visible (laid out) and top within ~92% of viewport
      if (r.height > 0 && r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add("in");
        revealEls.splice(i, 1);
      }
    }
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(revealCheck); }, { passive: true });
  window.addEventListener("resize", revealCheck, { passive: true });
  requestAnimationFrame(revealCheck);
  // safety: nothing should ever stay hidden if it's on screen
  setTimeout(revealCheck, 200);
  setTimeout(revealCheck, 800);

  /* ---------- Parallax (float tags + data-parallax) ---------- */
  var parEls = [].slice.call(document.querySelectorAll("[data-parallax]"));
  function parallax() {
    if (motionMin() || reduceMotion) return;
    var vh = window.innerHeight;
    parEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
      var r = el.getBoundingClientRect();
      var center = r.top + r.height / 2 - vh / 2;
      el.style.transform = "translate3d(0," + (-center * speed) + "px,0)";
    });
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(parallax); }, { passive: true });
  parallax();

  /* ---------- Pointer parallax for hero float tags ---------- */
  var floatTags = [].slice.call(document.querySelectorAll(".float-tag"));
  if (floatTags.length && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", function (e) {
      if (motionMin() || reduceMotion) return;
      var dx = (e.clientX / window.innerWidth - 0.5);
      var dy = (e.clientY / window.innerHeight - 0.5);
      floatTags.forEach(function (t, i) {
        var depth = (i % 3 + 1) * 14;
        t.style.transform = "translate(" + (dx * depth) + "px," + (dy * depth) + "px)";
      });
    });
  }

  /* ---------- HERO C word swap ---------- */
  var swapTrack = document.querySelector(".hero-c .swap-track");
  if (swapTrack) {
    var words = ["páginas web", "apps", "catálogos", "e-commerce", "automatización"];
    var i = 0;
    var wEl = swapTrack.querySelector(".w");
    function nextWord() {
      if (motionMin() || reduceMotion) return;
      i = (i + 1) % words.length;
      wEl.style.transition = "transform .5s cubic-bezier(.65,0,.35,1), opacity .4s";
      wEl.style.transform = "translateY(-100%)"; wEl.style.opacity = "0";
      setTimeout(function () {
        wEl.style.transition = "none";
        wEl.style.transform = "translateY(100%)";
        wEl.textContent = words[i];
        void wEl.offsetWidth;
        wEl.style.transition = "transform .5s cubic-bezier(.65,0,.35,1), opacity .4s";
        wEl.style.transform = "translateY(0)"; wEl.style.opacity = "1";
      }, 480);
    }
    setInterval(nextWord, 2200);
  }

  /* ---------- HERO B rotator ---------- */
  var rotWord = document.querySelector(".hero-b-rotator .rot-word");
  if (rotWord) {
    var rWords = ["páginas web", "tiendas online", "apps a medida", "catálogos digitales"];
    var ri = 0;
    setInterval(function () {
      if (motionMin() || reduceMotion) return;
      ri = (ri + 1) % rWords.length;
      rotWord.style.opacity = "0";
      setTimeout(function () { rotWord.textContent = rWords[ri]; rotWord.style.opacity = "1"; }, 250);
    }, 2400);
  }

  /* ---------- Stat counters (rect-based) ---------- */
  var counters = [].slice.call(document.querySelectorAll("[data-count]"));
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (motionMin() || reduceMotion) { el.textContent = (target % 1 === 0) ? target : target.toFixed(1); return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = (target % 1 === 0) ? Math.round(val) : val.toFixed(1);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (target % 1 === 0) ? target : target.toFixed(1);
    }
    requestAnimationFrame(step);
  }
  function countCheck() {
    var vh = window.innerHeight;
    for (var i = counters.length - 1; i >= 0; i--) {
      var el = counters[i];
      var r = el.getBoundingClientRect();
      if (r.height > 0 && r.top < vh * 0.85 && r.bottom > 0) {
        animateCount(el);
        counters.splice(i, 1);
      }
    }
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(countCheck); }, { passive: true });
  setTimeout(countCheck, 300);

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (menuBtn && mobileMenu) {
    var mmCloseBtn = mobileMenu.querySelector(".mm-close");
    var lastFocused = null;

    function openMenu() {
      lastFocused = document.activeElement;
      mobileMenu.classList.add("open");
      mobileMenu.removeAttribute("aria-hidden");
      mobileMenu.inert = false;
      menuBtn.setAttribute("aria-expanded", "true");
      if (mmCloseBtn) mmCloseBtn.focus();
    }

    function closeMenu() {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      mobileMenu.inert = true;
      menuBtn.setAttribute("aria-expanded", "false");
      if (lastFocused && typeof lastFocused.focus === "function" && document.contains(lastFocused)) {
        lastFocused.focus();
      } else {
        menuBtn.focus();
      }
    }

    menuBtn.addEventListener("click", openMenu);
    if (mmCloseBtn) mmCloseBtn.addEventListener("click", closeMenu);

    var menuLinks = mobileMenu.querySelectorAll("a");
    for (var i = 0; i < menuLinks.length; i++) {
      menuLinks[i].addEventListener("click", closeMenu);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
        closeMenu();
      }
    });

    mobileMenu.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      if (!mobileMenu.classList.contains("open")) return;

      var focusables = mobileMenu.querySelectorAll("a[href], button:not([disabled])");
      if (focusables.length === 0) return;

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector('#contact-form');
  if (form) {
    var btn = form.querySelector('button[type="submit"]');
    var status = form.querySelector('.form-msg');
    var btnLabel = btn ? btn.textContent : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.getAttribute('aria-busy') === 'true') return;

      // Limpiar estado anterior
      if (status) {
        status.textContent = '';
        status.className = 'form-msg';
        status.setAttribute('role', 'status');
      }

      var data = {
        access_key: (form.elements['access_key'] || {}).value || '',
        subject:    (form.elements['subject']    || {}).value || 'Nueva consulta desde Avior',
        from_name:  (form.elements['from_name']  || {}).value || 'Avior — Formulario web',
        nombre:     (form.elements['nombre']     || {}).value || '',
        contacto:   (form.elements['contacto']   || {}).value || '',
        mensaje:    (form.elements['mensaje']    || {}).value || '',
        botcheck:   (form.elements['botcheck']   || {}).value || '',
        _honeypot:  (form.elements['_honeypot']  || {}).value || ''
      };

      // Validación client-side con aria-invalid
      var hasError = !data.nombre.trim() || !data.contacto.trim() || !data.mensaje.trim();
      if (form.elements['nombre']) {
        if (!data.nombre.trim()) form.elements['nombre'].setAttribute('aria-invalid', 'true');
        else form.elements['nombre'].removeAttribute('aria-invalid');
      }
      if (form.elements['contacto']) {
        if (!data.contacto.trim()) form.elements['contacto'].setAttribute('aria-invalid', 'true');
        else form.elements['contacto'].removeAttribute('aria-invalid');
      }
      if (form.elements['mensaje']) {
        if (!data.mensaje.trim()) form.elements['mensaje'].setAttribute('aria-invalid', 'true');
        else form.elements['mensaje'].removeAttribute('aria-invalid');
      }
      if (hasError) {
        if (status) {
          status.setAttribute('role', 'alert');
          status.textContent = 'Completá todos los campos antes de enviar.';
          status.className = 'form-msg is-error';
        }
        return;
      }

      // Loading state
      form.setAttribute('aria-busy', 'true');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Enviando…';
      }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().then(function (body) {
            return { httpOk: res.ok, body: body };
          });
        })
        .then(function (r) {
          form.setAttribute('aria-busy', 'false');
          if (btn) {
            btn.disabled = false;
            btn.textContent = btnLabel;
          }

          if (r.httpOk && r.body && r.body.success === true) {
            form.reset();
            var fields = ['nombre', 'contacto', 'mensaje'];
            for (var k = 0; k < fields.length; k++) {
              if (form.elements[fields[k]]) form.elements[fields[k]].removeAttribute('aria-invalid');
            }
            if (status) {
              status.setAttribute('role', 'status');
              status.textContent = '¡Mensaje enviado! Te respondemos en menos de 24 hs.';
              status.className = 'form-msg is-success';
            }
            return;
          }

          // Error: mostrar mensaje contextual si Web3Forms lo dio
          var msg = 'Hubo un problema al enviar. Probá de nuevo o escribinos por WhatsApp.';
          if (r.body && r.body.message) {
            if (/honeypot|bot|spam|invalid/i.test(r.body.message)) {
              msg = 'Hubo un problema al validar el envío. Recargá la página y volvé a intentar.';
            }
          }
          if (status) {
            status.setAttribute('role', 'alert');
            status.textContent = msg;
            status.className = 'form-msg is-error';
          }
        })
        .catch(function () {
          form.setAttribute('aria-busy', 'false');
          if (btn) {
            btn.disabled = false;
            btn.textContent = btnLabel;
          }
          if (status) {
            status.setAttribute('role', 'alert');
            status.textContent = 'No pudimos conectar. Verificá tu internet o escribinos por WhatsApp.';
            status.className = 'form-msg is-error';
          }
        });
    });
  }

  /* ---------- Active nav link on scroll (rect-based) ---------- */
  var sections = [].slice.call(document.querySelectorAll("section[id]"));
  var navLinks = [].slice.call(document.querySelectorAll(".nav-links a"));
  function activeNav() {
    var best = null, bestDist = Infinity;
    var anchor = window.innerHeight * 0.35;
    sections.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= anchor && r.bottom >= anchor) { best = s.id; }
    });
    navLinks.forEach(function (a) {
      a.style.color = a.getAttribute("href") === "#" + best ? "var(--cream)" : "";
    });
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(activeNav); }, { passive: true });
  activeNav();

  var disabledChannels = document.querySelectorAll('a.channel[aria-disabled="true"]');
  for (var i = 0; i < disabledChannels.length; i++) {
    disabledChannels[i].addEventListener('click', function (e) { e.preventDefault(); });
  }

})();
