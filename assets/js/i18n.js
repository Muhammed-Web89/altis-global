/**
 * Altis Global — i18n System
 * inline translations (no fetch, works on file:// and servers)
 */

const I18N = (() => {
  const LANGUAGES = {
    tr: { name: 'Türkçe',    flag: '🇹🇷' },
    uz: { name: "O'zbekcha", flag: '🇺🇿' },
    ru: { name: 'Русский',   flag: '🇷🇺' },
    en: { name: 'English',   flag: '🇬🇧' },
  };

  let currentLang    = 'tr';
  let translations   = {};

  function detectLanguage() {
    const stored = localStorage.getItem('altis-lang');
    if (stored && LANGUAGES[stored]) return stored;
    const browser = (navigator.language || 'tr').split('-')[0].toLowerCase();
    return LANGUAGES[browser] ? browser : 'tr';
  }

  function getNestedValue(obj, key) {
    return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedValue(translations, key);
      if (val === null) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.innerHTML = val;
      }
    });
    document.documentElement.lang = currentLang;
    document.documentElement.dir  = translations.dir || 'ltr';
  }

  function updateLangUI() {
    const info = LANGUAGES[currentLang];
    const btnFlag = document.querySelector('.lang-btn .flag');
    const btnCode = document.querySelector('.lang-btn .lang-code');
    if (btnFlag) btnFlag.textContent = info.flag;
    if (btnCode) btnCode.textContent = currentLang.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.lang === currentLang);
    });
  }

  function setLanguage(lang) {
    if (!LANGUAGES[lang] || !TRANSLATIONS[lang]) return;
    translations = TRANSLATIONS[lang];
    currentLang  = lang;
    localStorage.setItem('altis-lang', lang);
    applyTranslations();
    updateLangUI();
    document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
  }

  function t(key) {
    return getNestedValue(translations, key) || key;
  }

  function init() {
    const lang = detectLanguage();
    setLanguage(lang);
  }

  return { init, setLanguage, t, get currentLang() { return currentLang; }, LANGUAGES };
})();
