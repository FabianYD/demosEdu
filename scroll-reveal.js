(function () {
  'use strict';

  var ROOT_MARGIN = '0px 0px -80px 0px';
  var DEFAULT_THRESHOLD = 0.12;

  /* ===================================================================
     SCROLL REVEAL — IntersectionObserver-based reveal
     =================================================================== */
  function getThreshold(el) {
    var t = el.getAttribute('data-reveal-threshold');
    return t ? parseFloat(t) : DEFAULT_THRESHOLD;
  }
  function getDelay(el) {
    var d = el.getAttribute('data-reveal-delay');
    return d ? parseInt(d, 10) : 0;
  }

  function initScrollReveal() {
    var targets = document.querySelectorAll('.sr-init');
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = getDelay(el);
          var baseDelay = 0;
          var parent = el.closest('[data-reveal-stagger]');
          if (parent) {
            var idx = Array.prototype.indexOf.call(parent.querySelectorAll('.sr-init'), el);
            baseDelay = idx * 70;
          }
          var totalDelay = delay || baseDelay;
          if (totalDelay > 0) el.style.transitionDelay = totalDelay + 'ms';
          el.classList.remove('sr-hidden');
          void el.offsetWidth;
          el.classList.add('sr-visible');
          observer.unobserve(el);
        }
      });
    }, { rootMargin: ROOT_MARGIN, threshold: DEFAULT_THRESHOLD });

    targets.forEach(function (el) {
      el.classList.add('sr-hidden');
      observer.observe(el);
    });
  }

  /* ===================================================================
     3D Mouse Parallax — elements with .p3d-float
     =================================================================== */
  function init3DFloat() {
    var els = document.querySelectorAll('.p3d-float');
    if (!els.length) return;
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;

    document.addEventListener('mousemove', function (e) {
      var rx = (e.clientX - cx) / cx;
      var ry = (e.clientY - cy) / cy;
      els.forEach(function (el) {
        var strength = parseFloat(el.getAttribute('data-float') || '20');
        var tx = rx * strength;
        var ty = ry * strength;
        var rotX = ry * 8;
        var rotY = rx * 8;
        el.style.setProperty('--p3d-x', tx + 'px');
        el.style.setProperty('--p3d-y', ty + 'px');
        el.style.setProperty('--p3d-rx', rotX + 'deg');
        el.style.setProperty('--p3d-ry', rotY + 'deg');
      });
    }, { passive: true });

    window.addEventListener('resize', function () {
      cx = window.innerWidth / 2;
      cy = window.innerHeight / 2;
    }, { passive: true });
  }

  /* ===================================================================
     Scroll-driven 3D Parallax — .p3d-scroll parallax layers
     =================================================================== */
  function initScroll3D() {
    var layers = document.querySelectorAll('.p3d-scroll');
    if (!layers.length) return;
    var ticking = false;

    function onScroll() {
      var sy = window.scrollY;
      var vh = window.innerHeight;
      layers.forEach(function (el) {
        var depth = parseFloat(el.getAttribute('data-depth') || '0.1');
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var progress = (vh / 2 - center) / vh;
        var limit = parseFloat(el.getAttribute('data-limit') || '20');
        var rotateLimit = parseFloat(el.getAttribute('data-rotate') || '5');
        var tx = progress * depth * window.innerWidth * 0.15;
        var ty = progress * depth * vh * 0.1;
        var rotY = progress * rotateLimit;
        var rotX = progress * rotateLimit * 0.5;
        el.style.setProperty('--s3d-tx', tx + 'px');
        el.style.setProperty('--s3d-ty', ty + 'px');
        el.style.setProperty('--s3d-ry', rotY + 'deg');
        el.style.setProperty('--s3d-rx', rotX + 'deg');
      });
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () { ticking = false; onScroll(); });
        ticking = true;
      }
    }, { passive: true });
    onScroll();
  }

  /* ===================================================================
     3D Card Tilt — enhanced
     =================================================================== */
  function initTilt3D() {
    var cards = document.querySelectorAll('.tilt-3d');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var tiltX = (y - 0.5) * -14;
        var tiltY = (x - 0.5) * 14;
        var sx = 1 + (0.03 - Math.abs(x - 0.5) * 0.06);
        var sy = 1 + (0.03 - Math.abs(y - 0.5) * 0.06);
        card.style.transform =
          'perspective(900px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) scale3d(' + sx + ',' + sy + ',1)';
        card.style.setProperty('--tilt-shade', (x - 0.5) * 20 + 'px');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.setProperty('--tilt-shade', '0px');
      });
    });
  }

  /* ===================================================================
     3D Particles — canvas-based geometric shapes in hero
     =================================================================== */
  var particleInstance = null;

  function init3DParticles(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H;
    var particles = [];
    var mouse = { x: 0, y: 0 };
    var COUNT = 60;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function Particle() {
      this.reset();
    }
    Particle.prototype.reset = function () {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.z = Math.random() * 800 + 200;
      this.size = Math.random() * 4 + 1.5;
      this.speedZ = Math.random() * 1.2 + 0.4;
      this.shape = Math.random() > 0.6 ? 'rect' : (Math.random() > 0.5 ? 'ring' : 'dot');
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.25 + 0.08;
      this.hue = Math.random() > 0.7 ? 255 : 210;
    };

    for (var i = 0; i < COUNT; i++) {
      var p = new Particle();
      p.x = Math.random() * W;
      p.y = Math.random() * H;
      particles.push(p);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      var mouseInfluenceX = (mouse.x - W / 2) / W * 2;
      var mouseInfluenceY = (mouse.y - H / 2) / H * 2;
      var time = Date.now() * 0.0003;

      particles.forEach(function (p) {
        p.z -= p.speedZ;
        p.rot += p.rotSpeed;
        if (p.z < 0) { p.reset(); p.z = 800 + Math.random() * 200; }

        var scale = 800 / (p.z + 200);
        var px = (p.x - W / 2) * scale + W / 2 + mouseInfluenceX * 30 * scale;
        var py = (p.y - H / 2) * scale + H / 2 + mouseInfluenceY * 20 * scale;
        var r = p.size * scale;
        var a = p.opacity * (1 - p.z / 1000) * 1.8;

        ctx.save();
        ctx.globalAlpha = Math.min(a, 0.5);
        ctx.translate(px, py);
        ctx.rotate(p.rot + time);

        var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 3);
        grad.addColorStop(0, 'oklch(70% 0.15 ' + p.hue + ' / 0.4)');
        grad.addColorStop(1, 'oklch(70% 0.15 ' + p.hue + ' / 0)');

        if (p.shape === 'rect') {
          ctx.fillStyle = 'oklch(75% 0.12 ' + p.hue + ' / ' + a + ')';
          ctx.fillRect(-r, -r, r * 2, r * 2);
          ctx.strokeStyle = 'oklch(80% 0.10 ' + p.hue + ' / ' + (a * 0.6) + ')';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(-r, -r, r * 2, r * 2);
        } else if (p.shape === 'ring') {
          ctx.strokeStyle = 'oklch(75% 0.12 ' + p.hue + ' / ' + a + ')';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      requestAnimationFrame(draw);
    }

    resize();
    draw();

    document.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    window.addEventListener('resize', resize, { passive: true });
    particleInstance = { resize: resize };
  }

  /* ===================================================================
     Count-up
     =================================================================== */
  function initCountUp() {
    var vals = document.querySelectorAll('.stat-card .value, .summary-stat .count, .resumen-eval .val');
    if (!vals.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var raw = el.textContent.trim();
          var match = raw.match(/^(\d+)/);
          if (match) {
            var target = parseInt(match[1], 10);
            var suffix = raw.replace(match[1], '');
            var duration = 1000;
            var start = performance.now();
            el.classList.add('count-animate');
            function tick(now) {
              var progress = Math.min((now - start) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.round(target * eased) + suffix;
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    vals.forEach(function (el) { observer.observe(el); });
  }

  /* ===================================================================
     Progress bars
     =================================================================== */
  function initProgressBars() {
    var bars = document.querySelectorAll('.progress-bar .fill');
    if (!bars.length) return;
    bars.forEach(function (fill) {
      var targetWidth = fill.style.width;
      fill.style.width = '0%';
      fill.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () { fill.style.width = targetWidth; }, 200);
            observer.unobserve(fill);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(fill);
    });
  }

  /* ===================================================================
     Chart bars
     =================================================================== */
  function initChartBars() {
    var segs = document.querySelectorAll('.seg');
    if (!segs.length) return;
    segs.forEach(function (seg) {
      var targetWidth = seg.style.width;
      seg.style.width = '0%';
      seg.style.transition = 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = Array.prototype.indexOf.call(
              seg.closest('.bars').querySelectorAll('.seg'), seg
            ) * 120;
            setTimeout(function () { seg.style.width = targetWidth; }, 200 + delay);
            observer.unobserve(seg);
          }
        });
      }, { threshold: 0.3 });
      observer.observe(seg);
    });
  }

  /* ===================================================================
     Boot
     =================================================================== */
  function boot() {
    initScrollReveal();
    initTilt3D();
    init3DParticles('hero-particles');
    init3DFloat();
    initScroll3D();
    initCountUp();
    initProgressBars();
    initChartBars();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
