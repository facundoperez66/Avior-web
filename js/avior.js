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
    menuBtn.addEventListener("click", function () { mobileMenu.classList.add("open"); });
    mobileMenu.querySelector(".mm-close").addEventListener("click", function () { mobileMenu.classList.remove("open"); });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mobileMenu.classList.remove("open"); });
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      var name = (form.querySelector('[name="nombre"]') || {}).value || "";
      msg.textContent = "✓ ¡Gracias" + (name ? ", " + name.split(" ")[0] : "") + "! Te escribimos en menos de 24 h.";
      form.querySelectorAll("input, textarea").forEach(function (f) { f.value = ""; });
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

})();
