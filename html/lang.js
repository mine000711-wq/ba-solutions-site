

(function(){
  var KEY = 'ba-lang';
  var root = document.documentElement;

  function valid(l){ return l === 'ko' || l === 'en'; }
  function load(){ try { return localStorage.getItem(KEY); } catch(e) { return null; } }
  function save(l){ try { localStorage.setItem(KEY, l); } catch(e) {} }
  function browserLang(){
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    return /^ko\b/i.test(list[0] || '') ? 'ko' : 'en';
  }

  var m = /[?&]lang=([a-z]{2})\b/i.exec(location.search);
  var fromUrl = m && valid(m[1].toLowerCase()) ? m[1].toLowerCase() : null;
  if (fromUrl) {
    save(fromUrl);
    if (window.history && history.replaceState) {
      var q = location.search.replace(/([?&])lang=[a-z]{2}\b&?/i, '$1').replace(/[?&]$/, '');
      history.replaceState(history.state, '', location.pathname + q + location.hash);
    }
  }
  var saved = load();
  var lang = fromUrl || (valid(saved) ? saved : browserLang());

  var ATTRS = ['aria-label', 'alt', 'title', 'placeholder', 'data-text'];
  function swapAttrs(){
    if (!root.hasAttribute('data-i18n')) return;
    for (var a = 0; a < ATTRS.length; a++) {
      var name = ATTRS[a], els = document.querySelectorAll('[data-ko-' + name + ']');
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (!el.hasAttribute('data-en-' + name)) el.setAttribute('data-en-' + name, el.getAttribute(name) || '');
        el.setAttribute(name, el.getAttribute('data-' + window.BA_LANG + '-' + name));
      }
    }
    var t = document.querySelector('title[data-en], title[data-ko]');
    if (t) {
      var base = t.textContent;
      if (!t.hasAttribute('data-ko')) t.setAttribute('data-ko', base);
      if (!t.hasAttribute('data-en')) t.setAttribute('data-en', base);
      document.title = t.getAttribute('data-' + window.BA_LANG);
    }
  }
  function apply(l){
    window.BA_LANG = l;
    root.setAttribute('data-lang', l);
    if (root.hasAttribute('data-i18n')) root.setAttribute('lang', l);
    swapAttrs();
  }
  apply(lang);

  var css = document.createElement('style');
  css.textContent =
    'html[data-lang="ko"] body [lang="en"],html[data-lang="en"] body [lang="ko"]{display:none!important;}' +
    'html[data-i18n][lang="ko"] body,body [lang="ko"]{word-break:keep-all;}';
  (document.head || root).appendChild(css);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', swapAttrs);

  window.baSetLang = function(l){
    if (!valid(l)) return;
    save(l);
    if (l === window.BA_LANG) return;
    apply(l);
    var ev;
    try { ev = new CustomEvent('ba:lang', {detail: l}); }
    catch(e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent('ba:lang', false, false, l); }
    document.dispatchEvent(ev);
  };

  window.baPair = function(en, ko){
    return ko && root.hasAttribute('data-i18n') ? '<span lang="ko">' + ko + '</span><span lang="en">' + en + '</span>' : en;
  };
})();
