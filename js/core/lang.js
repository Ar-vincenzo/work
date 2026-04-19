const Lang = (() => {

  function get() {
    return localStorage.getItem('lang') || 'it';
  }

  function apply(lang) {
    document.documentElement.lang = lang === 'it' ? 'it' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (!el.dataset.original) {
        el.dataset.original = el.innerHTML;
      }
      if (lang === 'en' && Translations[key] !== undefined) {
        el.innerHTML = Translations[key];
      } else if (el.dataset.original !== undefined) {
        el.innerHTML = el.dataset.original;
      }
    });

    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = lang === 'it' ? 'EN' : 'IT';

    const titleMap = {
      'arg-title':  { en: 'Argentina — Milei Program 2024–2025' },
      'home-title': { en: 'Vincenzo Ariete' },
      'iari-title': { en: 'IARI Analysis · Vincenzo Ariete' },
      'lavori-title': { en: 'Works · Vincenzo Ariete' },
    };
    const titleEl = document.querySelector('[data-page-title]');
    if (titleEl) {
      const key = titleEl.dataset.pageTitle;
      if (lang === 'en' && titleMap[key]) {
        document.title = titleMap[key].en;
      } else if (titleEl.dataset.titleOriginal) {
        document.title = titleEl.dataset.titleOriginal;
      }
    }
  }

  function toggle() {
    const next = get() === 'it' ? 'en' : 'it';
    localStorage.setItem('lang', next);
    apply(next);
    document.dispatchEvent(new CustomEvent('lang-change', { detail: { lang: next } }));
  }

  function init() {
    const titleEl = document.querySelector('[data-page-title]');
    if (titleEl) titleEl.dataset.titleOriginal = document.title;
    apply(get());
    const btn = document.getElementById('langToggle');
    if (btn) btn.addEventListener('click', toggle);
  }

  return { get, init };

})();

document.addEventListener('DOMContentLoaded', Lang.init);
