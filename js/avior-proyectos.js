/* ============================================================
   AVIOR — Proyectos · interacciones extra
   (filtros, reveal con clip, parallax de imagen, magnético)
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function motionMin() { return document.documentElement.getAttribute("data-motion") === "min"; }
  var hover = window.matchMedia("(hover: hover)").matches;

  /* ---------- Auto-count: sincroniza el contador del hero con los cards reales ---------- */
  var heroCount = document.querySelector(".pj-hero-index [data-count]");
  if (heroCount) {
    var total = document.querySelectorAll(".pj-card").length;
    heroCount.setAttribute("data-count", total);
    heroCount.textContent = "0";
  }

  /* ---------- Title line reveal (hero) ---------- */
  var title = document.querySelector(".pj-title");
  if (title) { requestAnimationFrame(function () { setTimeout(function () { title.classList.add("in"); }, 120); }); }

  /* ---------- Card reveal (rect-based, robusto en embeds) ---------- */
  var cards = [].slice.call(document.querySelectorAll(".pj-card"));
  function cardReveal() {
    var vh = window.innerHeight;
    cards.forEach(function (el) {
      if (el.classList.contains("in") || el.classList.contains("hide")) return;
      var r = el.getBoundingClientRect();
      if (r.height > 0 && r.top < vh * 0.9 && r.bottom > 0) el.classList.add("in");
    });
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(cardReveal); }, { passive: true });
  window.addEventListener("resize", cardReveal, { passive: true });
  requestAnimationFrame(cardReveal);
  setTimeout(cardReveal, 250);
  setTimeout(cardReveal, 800);

  /* ---------- Parallax de imagen dentro del marco ---------- */
  var media = [].slice.call(document.querySelectorAll(".pj-media image-slot"));
  // damos un poco de alto extra para que el desplazamiento no muestre bordes
  media.forEach(function (m) { m.style.willChange = "transform"; });
  function mediaParallax() {
    if (motionMin() || reduceMotion) return;
    var vh = window.innerHeight;
    media.forEach(function (m) {
      var card = m.closest(".pj-card");
      if (card && (card.classList.contains("hide") || !card.classList.contains("in"))) return;
      var r = m.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var center = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5 aprox
      var shift = -center * 26; // px
      var hovering = card && card.matches(":hover");
      var scale = hovering ? 1.05 : 1.07; // base un poco mayor para cubrir el shift
      m.style.transform = "translate3d(0," + shift.toFixed(2) + "px,0) scale(" + scale + ")";
    });
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(mediaParallax); }, { passive: true });
  window.addEventListener("resize", mediaParallax, { passive: true });
  mediaParallax();

  /* ---------- Filtros con pastilla deslizante ---------- */
  var filterWrap = document.querySelector(".pj-filters");
  var pill = document.querySelector(".pj-pill");
  var liveCount = document.querySelector(".pj-count-live b");
  if (filterWrap && pill) {
    var btns = [].slice.call(filterWrap.querySelectorAll(".pj-filter"));

    function movePill(btn) {
      pill.style.width = btn.offsetWidth + "px";
      pill.style.transform = "translateX(" + btn.offsetLeft + "px)";
    }

    function applyFilter(cat) {
      var shown = 0;
      cards.forEach(function (c) {
        var cats = (c.getAttribute("data-cat") || "").split(" ");
        var match = cat === "all" || cats.indexOf(cat) !== -1;
        if (match) {
          c.classList.remove("hide");
          // re-disparar reveal + clip
          c.classList.remove("in");
          shown++;
        } else {
          c.classList.add("hide");
        }
      });
      if (liveCount) liveCount.textContent = shown < 10 ? "0" + shown : "" + shown;
      // re-revelar las visibles de forma escalonada
      requestAnimationFrame(function () {
        var vis = cards.filter(function (c) { return !c.classList.contains("hide"); });
        vis.forEach(function (c, i) {
          setTimeout(function () { c.classList.add("in"); requestAnimationFrame(mediaParallax); }, 60 + i * 70);
        });
        requestAnimationFrame(mediaParallax);
      });
    }

    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        btns.forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        movePill(b);
        applyFilter(b.getAttribute("data-cat"));
      });
    });

    // init
    var initial = filterWrap.querySelector(".pj-filter.active") || btns[0];
    if (initial) { initial.classList.add("active"); requestAnimationFrame(function () { movePill(initial); }); }
    window.addEventListener("resize", function () {
      var act = filterWrap.querySelector(".pj-filter.active");
      if (act) movePill(act);
    });
  }

  /* ---------- Botones magnéticos ---------- */
  if (hover && !reduceMotion) {
    var mags = [].slice.call(document.querySelectorAll(".magnetic"));
    mags.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        if (motionMin()) return;
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + x * 0.28 + "px," + y * 0.34 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

})();
