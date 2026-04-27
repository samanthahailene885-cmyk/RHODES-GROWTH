(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    var LANG_KEY = 'rg_lang';
    var langSwitch = document.querySelector('.lang-switch');
    if (langSwitch) {
      var langButtons = Array.prototype.slice.call(langSwitch.querySelectorAll('button'));

      function normalizeLang(v) {
        var s = (v || '').toString().trim().toLowerCase();
        if (s === 'fr' || s === 'en') return s;
        return 'fr';
      }

      function setLang(nextLang) {
        var lang = normalizeLang(nextLang);
        try {
          window.localStorage.setItem(LANG_KEY, lang);
        } catch (e) {}

        langButtons.forEach(function (btn) {
          var btnLang = normalizeLang(btn.textContent);
          var isActive = btnLang === lang;
          btn.classList.toggle('is-active', isActive);
          btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('data-lang', lang);

        var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
        nodes.forEach(function (el) {
          var key = el.getAttribute('data-i18n');
          if (!key) return;
          var v = el.getAttribute('data-i18n-' + lang);
          if (v == null) return;

          var attr = el.getAttribute('data-i18n-attr');
          if (attr) {
            el.setAttribute(attr, v);
          } else {
            el.innerHTML = v;
          }
        });

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      }

      var saved = 'fr';
      try {
        saved = normalizeLang(window.localStorage.getItem(LANG_KEY));
      } catch (e) {}
      setLang(saved);

      langButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          setLang(btn.textContent);
        });
      });
    }

    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav]');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      nav.addEventListener('click', function (e) {
        var target = e.target;
        if (target && target.classList && target.classList.contains('nav-link')) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    var list = document.querySelector('[data-training-list]');
    var searchInput = document.querySelector('[data-training-search]');
    var themeSelect = document.querySelector('[data-training-theme]');
    var durationSelect = document.querySelector('[data-training-duration]');
    var pills = Array.prototype.slice.call(document.querySelectorAll('[data-pill]'));

    function normalize(s) {
      return (s || '').toString().toLowerCase().trim();
    }

    function applyFilters() {
      if (!list) return;

      var q = normalize(searchInput && searchInput.value);
      var theme = normalize(themeSelect && themeSelect.value);
      var duration = normalize(durationSelect && durationSelect.value);

      var rows = Array.prototype.slice.call(list.querySelectorAll('.training-row'));
      rows.forEach(function (row) {
        var rowTheme = normalize(row.getAttribute('data-theme'));
        var rowDuration = normalize(row.getAttribute('data-duration'));
        var rowTitle = normalize(row.getAttribute('data-title'));

        var ok = true;
        if (q) {
          ok = ok && (rowTitle.indexOf(q) !== -1);
        }
        if (theme) {
          ok = ok && rowTheme === theme;
        }
        if (duration) {
          ok = ok && rowDuration === duration;
        }

        row.style.display = ok ? '' : 'none';
      });
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (themeSelect) themeSelect.addEventListener('change', function () {
      pills.forEach(function (p) {
        p.classList.toggle('is-active', normalize(p.getAttribute('data-pill')) === normalize(themeSelect.value));
      });
      applyFilters();
    });
    if (durationSelect) durationSelect.addEventListener('change', applyFilters);

    if (pills.length) {
      pills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          var v = normalize(pill.getAttribute('data-pill'));
          if (themeSelect) themeSelect.value = v;
          pills.forEach(function (p) { p.classList.remove('is-active'); });
          pill.classList.add('is-active');
          applyFilters();
        });
      });
    }

    var contactForm = document.querySelector('[data-contact-form]');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var status = document.querySelector('[data-contact-status]');
        if (status) {
          status.textContent = "Message prêt à être envoyé. Pour activer l’envoi réel, branche un endpoint (ex: Formspree) ou un backend.";
        }
      });
    }

    var heroImg = document.querySelector('.hero-media-img[data-slides]');
    if (heroImg) {
      var raw = heroImg.getAttribute('data-slides') || '';
      var slides = raw.split(',').map(function (s) { return (s || '').trim(); }).filter(Boolean);
      if (slides.length > 1) {
        var currentIndex = Math.max(0, slides.indexOf(heroImg.getAttribute('src')));
        var delayMs = 4200;
        var fadeMs = 450;
        window.setInterval(function () {
          currentIndex = (currentIndex + 1) % slides.length;
          var next = slides[currentIndex];
          heroImg.classList.add('is-fading');
          window.setTimeout(function () {
            heroImg.setAttribute('src', next);
            heroImg.classList.remove('is-fading');
          }, fadeMs);
        }, delayMs);
      }
    }
  });
})();
