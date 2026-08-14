/* ============================================================
   Dylan Tran — interactions
   No dependencies: 2D canvas signal field, IntersectionObserver
   reveals and JS line splitting.
   ============================================================ */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     Hero: a grid of pads displaced by travelling waves, the way
     a signal looks on a scope before you get it under control.
     ---------------------------------------------------------- */
  function initHero() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0;
    var h = 0;
    var cols = 0;
    var rows = 0;
    var gap = 26;
    var mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    var scrollFade = 0;
    var start = performance.now();

    // brand hues, sampled across the field
    var hues = ["#fa6104", "#fa5ca6", "#3788ff", "#982ced"];

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = w < 700 ? 22 : 28;
      cols = Math.ceil(w / gap) + 2;
      rows = Math.ceil(h / gap) + 2;
    }

    function draw(now) {
      var t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      var fade = 1 - Math.min(scrollFade, 1);
      if (fade <= 0.01) {
        if (!reduced) requestAnimationFrame(draw);
        return;
      }

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var x = c * gap;
          var y = r * gap;

          // layered travelling waves
          var e =
            Math.sin(x * 0.012 + t * 0.55) * 0.55 +
            Math.sin(y * 0.02 + t * 0.77) * 0.35 +
            Math.sin((x + y) * 0.008 + t * 0.44) * 0.45;

          // a swell that follows the cursor
          var dx = x - mouse.x;
          var dy = y - mouse.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          var near = Math.max(0, 1 - d / 190);
          e += near * near * 1.6;

          var a = (0.10 + Math.max(0, e) * 0.20) * fade;
          if (a < 0.012) continue;

          var size = 1.1 + Math.max(0, e) * 1.5 + near * 1.6;

          // colour only where the wave peaks, ink everywhere else
          if (e > 0.85 || near > 0.25) {
            ctx.fillStyle = hues[(r + c) % hues.length];
            ctx.globalAlpha = Math.min(a * 2.1, 0.75);
          } else {
            ctx.fillStyle = "#141414";
            ctx.globalAlpha = a;
          }

          ctx.beginPath();
          ctx.arc(x, y - e * 6, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      draw(performance.now() + 1);
      return;
    }

    window.addEventListener(
      "pointermove",
      function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.tx = e.clientX - rect.left;
        mouse.ty = e.clientY - rect.top;
      },
      { passive: true }
    );

    window.addEventListener(
      "scroll",
      function () {
        scrollFade = window.scrollY / Math.max(window.innerHeight * 0.85, 1);
      },
      { passive: true }
    );

    requestAnimationFrame(draw);
  }

  /* ----------------------------------------------------------
     Split a heading into lines so each can be masked and lifted
     independently. Re-run on resize, since the line breaks move.
     ---------------------------------------------------------- */
  function splitHeading(el) {
    if (!el.dataset.splitText) el.dataset.splitText = el.textContent.trim();
    var text = el.dataset.splitText;

    el.innerHTML = text
      .split(/\s+/)
      .map(function (word) {
        return '<span class="split-word">' + word + "</span>";
      })
      .join(" ");

    var words = Array.prototype.slice.call(el.querySelectorAll(".split-word"));
    if (!words.length) return;

    // group words by their vertical offset — that is a rendered line
    var lines = [];
    var currentTop = null;
    words.forEach(function (word) {
      var top = word.offsetTop;
      if (currentTop === null || Math.abs(top - currentTop) > 4) {
        currentTop = top;
        lines.push([]);
      }
      lines[lines.length - 1].push(word.textContent);
    });

    el.innerHTML = lines
      .map(function (line) {
        return (
          '<span class="split-line"><span class="split-line__inner">' +
          line.join(" ") +
          "</span></span>"
        );
      })
      .join("");
  }

  function initSplits() {
    var heads = Array.prototype.slice.call(document.querySelectorAll("[data-split]"));
    if (!heads.length) return;

    heads.forEach(splitHeading);

    var resizeTimer;
    var lastWidth = window.innerWidth;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        heads.forEach(function (el) {
          var wasVisible = el.classList.contains("is-visible");
          splitHeading(el);
          if (wasVisible) el.classList.add("is-visible");
        });
      }, 200);
    });

    return heads;
  }

  /* ----------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------- */
  function initReveals() {
    // Observe the masking wrapper, never the .anim-line inside it: the line
    // starts translated fully outside its overflow:hidden parent, and
    // IntersectionObserver clips a target against ancestor overflow, so the
    // line would report 0% visible and never be revealed.
    var targets = document.querySelectorAll(
      ".anim-fade, .anim-line-wrap, .hero__title-line, [data-split], .tile, .board"
    );

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    Array.prototype.forEach.call(targets, function (el) {
      io.observe(el);
    });
  }

  /* ----------------------------------------------------------
     The hero is above the fold by definition, so it plays on load
     rather than waiting for a scroll. Without this the tagline and
     scroll cue sit inside the observer's bottom rootMargin dead-zone
     and stay hidden until the first scroll.
     ---------------------------------------------------------- */
  function initHeroReveal() {
    var els = document.querySelectorAll(".hero__title-line, .hero .anim-fade");
    // two frames, so the initial hidden styles are committed and the
    // transition actually runs instead of being skipped
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        Array.prototype.forEach.call(els, function (el) {
          el.classList.add("is-visible");
        });
      });
    });
  }

  /* ----------------------------------------------------------
     Anchor navigation that respects reduced motion
     ---------------------------------------------------------- */
  function initNav() {
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        var hash = link.getAttribute("href");
        if (!hash || hash.charAt(0) !== "#") return;
        var target = hash === "#top" ? document.body : document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
        });
        if (history.replaceState) history.replaceState(null, "", hash);
      });
    });
  }

  function boot() {
    initSplits();
    initReveals();
    initHeroReveal();
    initNav();
    initHero();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // fonts change line breaks — re-split once they land
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      document.querySelectorAll("[data-split]").forEach(function (el) {
        var wasVisible = el.classList.contains("is-visible");
        splitHeading(el);
        if (wasVisible) el.classList.add("is-visible");
      });
    });
  }
})();
