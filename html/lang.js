/* ===================================================================
   BA SOLUTIONS 언어 선택 (한/영)  —  v3 (2026-09-29)
   v3: <title data-ko data-en> 제목 전환, data-text 속성(CTA 폭 예약용)도 속성 번역 대상에 추가 (TECH 병기)
   v2: baPair 는 data-i18n 페이지에서만 병기(번역 전 페이지에 한글이 섞이지 않게),
       속성 번역 data-ko-aria-label / data-ko-alt / data-ko-title / data-ko-placeholder 추가

   방식(C안): 한 HTML 안에 두 언어 본문을 나란히 두고, 고르지 않은 쪽을 숨긴다.
     <p><span lang="ko">한국어 문장</span><span lang="en">English sentence</span></p>
   - <body> 안에서 lang 속성은 이 병기 쌍에만 쓴다. lang="en" 요소는 한국어 선택 시 숨겨진다.
   - 로고·메뉴·섹션 라벨/타이틀·슬로건·제품명(Michroma 표시층)은 두 언어 모두 영문 그대로 — 병기하지 않는다.
   - 두 언어가 모두 준비된 페이지만 <html data-i18n> 을 단다. 그래야 <html lang> 도 선택 언어로 바뀐다.
     (번역 전 페이지는 lang 을 원래 본문 언어로 유지 — 영어 페이지에 lang="ko" 가 붙지 않게)

   언어 결정 순서: 주소의 ?lang=ko|en  →  저장된 선택(localStorage)  →  브라우저 첫 번째 언어(ko면 한국어, 그 외 영어)

   로드: 모든 페이지 <head> 의 <html> 태그 뒤에서 동기 로드(defer/async 금지 — 첫 화면 전에 언어가 정해져야 깜빡이지 않음).
     메인  <script src="html/lang.js"></script>   /   html/ 하위  <script src="lang.js"></script>

   공개 API
     window.BA_LANG            현재 언어 'ko' | 'en'
     window.baSetLang(l)       언어 변경 + 저장. 새로고침 없이 바뀌고 document 에 'ba:lang' 이벤트 발생
     window.baPair(en, ko)     JS로 그리는 문구용. data-i18n 페이지이고 ko 가 있으면 병기 마크업, 아니면 en 그대로

   속성 번역: 병기할 수 없는 속성은 영어 값을 그대로 두고 한국어를 data-ko-<속성> 에 적는다.
     <div aria-label="Related products" data-ko-aria-label="관련 제품">  (data-i18n 페이지에서만 바뀜)
   페이지 제목: <title data-en="English | BA Solutions">한국어 | BA Solutions</title> 처럼 반대 언어를 속성에 둔다
     (본문 textContent 는 검색엔진이 읽는 기본값 — 한국어 원문 페이지는 한국어를 기본으로 둔다).
   =================================================================== */
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

  /* 공유 링크의 ?lang= 은 한 번 반영·저장한 뒤 주소에서 지운다.
     남겨두면 이후 토글로 바꾼 선택을 새로고침할 때마다 되돌려 버린다. */
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

  /* 병기 숨김 규칙 + 한국어 줄바꿈. 번역 전 페이지(body 안에 lang 쌍이 없음)에는 영향이 없다. */
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
