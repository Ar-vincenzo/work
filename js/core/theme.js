const Theme = (() => {

  function get() {
    return localStorage.getItem('theme') || 'dark';
  }

  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-label', t === 'dark' ? 'Passa alla modalità chiara' : 'Passa alla modalità scura');
  }

  function toggle() {
    const next = get() === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    apply(next);
    document.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: next } }));
  }

  function init() {
    apply(get());
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', toggle);
  }

  return { get, init };

})();

document.addEventListener('DOMContentLoaded', Theme.init);
