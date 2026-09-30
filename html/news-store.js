/* News repository v1. Paths in stored images are relative to the site root. */
(function () {
  'use strict';
  var script = document.currentScript;
  var root = new URL('../', script.src);
  var params = new URLSearchParams(location.search);
  var mode = params.get('newsMode') || 'static';
  var key = 'ba-news-demo-v1:' + root.pathname;
  var allowed = ['draft', 'published', 'trashed'];
  function copy(value) { return JSON.parse(JSON.stringify(value)); }
  function fail(message) { throw new Error(message); }
  function asyncCall(fn) { return Promise.resolve().then(fn); }
  function seed() {
    return window.BA_NEWS.map(function (n) {
      return Object.assign({body:'', imageAlt:n.title, status:'published', createdAt:null, updatedAt:null, publishedAt:null, deletedAt:null, previousStatus:null}, copy(n), {legacyHref:n.href || ''});
    });
  }
  function imageURL(value) {
    if (!value) return '';
    if (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value)) return value;
    var u = new URL(value, root);
    if (!/^https?:$/.test(u.protocol) || u.username || u.password) fail('이미지는 http/https 주소 또는 PNG·JPEG·WebP 파일만 사용할 수 있습니다.');
    return u.href;
  }
  function externalURL(value) {
    var u=new URL(value);
    if (!/^https?:$/.test(u.protocol) || u.username || u.password) fail("외부 자료 주소가 올바르지 않습니다.");
    return u.href;
  }
  function validate(n) {
    if (!n || typeof n !== 'object') fail('글 형식이 올바르지 않습니다.');
    ['id','title','ko','tag','excerpt','body','image','imageAlt','date','legacyHref'].forEach(function (k) {
      if (n[k] != null && typeof n[k] !== 'string') fail(k + ': 문자열이 필요합니다.');
    });
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(n.id || '')) fail('글 ID가 올바르지 않습니다.');
    if (!n.title || !n.title.trim() || n.title.length > 300) fail('제목을 1~300자로 입력해 주세요.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date || '') || isNaN(Date.parse(n.date)) || new Date(n.date).toISOString().slice(0,10) !== n.date) fail('유효한 표시 날짜를 입력해 주세요.');
    if (allowed.indexOf(n.status) < 0) fail('글 상태가 올바르지 않습니다.');
    if ((n.body || '').length > 100000 || (n.excerpt || '').length > 2000 || (n.tag || '').length > 100 || (n.ko || '').length > 300 || (n.imageAlt || '').length > 500) fail('입력 내용이 너무 깁니다.');
    if ((n.image || '').length > 1500000) fail('이미지는 1MB 이하 파일을 사용해 주세요.');
    imageURL(n.image);
    if(n.sourceURL)externalURL(n.sourceURL);
    ['gallery','videos'].forEach(function(k){if(n[k]!=null){if(!Array.isArray(n[k]) || n[k].length>30)fail('첨부 자료 형식이 올바르지 않습니다.');n[k].forEach(function(m){if(!m || typeof m.url!=='string' || (m.alt!=null && typeof m.alt!=='string') || (m.label!=null && typeof m.label!=='string'))fail('첨부 자료 형식이 올바르지 않습니다.');externalURL(m.url);});}});
    if (n.legacyHref && !/^news-[a-z0-9-]+\.html$/.test(n.legacyHref)) fail('기존 기사 경로가 올바르지 않습니다.');
    if (n.previousStatus != null && ['draft','published'].indexOf(n.previousStatus) < 0) fail('복구 상태가 올바르지 않습니다.');
    ['createdAt','updatedAt','publishedAt','deletedAt'].forEach(function(k){if(n[k] != null && (typeof n[k] !== 'string' || isNaN(Date.parse(n[k])))) fail('작업 시각이 올바르지 않습니다.');});
    return n;
  }
  function read() {
    if (mode === 'static') return seed();
    if (mode !== 'demo') fail('지원하지 않는 뉴스 모드입니다.');
    var raw;
    try { raw = localStorage.getItem(key); } catch (e) { fail('브라우저 저장소에 접근할 수 없습니다. 저장 허용 설정을 확인해 주세요.'); }
    if (!raw) return seed();
    var data;
    try { data = JSON.parse(raw); } catch (e) { fail('시연 데이터가 손상되었습니다. 내보낸 자료로 복원해 주세요.'); }
    if (data.schemaVersion !== 1 || !Array.isArray(data.items)) fail('지원하지 않는 시연 자료입니다.');
    var originals=seed();
    return data.items.map(function(n){
      validate(n);
      var latest=originals.filter(function(x){return x.id===n.id;})[0];
      // Only refresh untouched seed records. User edits, drafts and trash remain intact.
      return latest && !n.updatedAt && n.status==='published' && !n.contentRevision ? latest : n;
    });
  }
  function write(items) {
    if (mode !== 'demo') fail('시연 모드에서만 브라우저에 저장할 수 있습니다.');
    items.forEach(validate);
    try { localStorage.setItem(key, JSON.stringify({schemaVersion:1, items:items})); }
    catch (e) { fail('저장 실패: 브라우저 저장 공간 또는 저장 허용 설정을 확인해 주세요. 입력 내용은 화면에 남아 있습니다.'); }
  }
  function sort(items) { return items.sort(function(a,b){return b.date.localeCompare(a.date) || a.id.localeCompare(b.id);}); }
  function api(method, args) {
    var adapter = window.BA_NEWS_API;
    if (!adapter || typeof adapter[method] !== 'function') return Promise.reject(new Error('실제 API가 연결되지 않았습니다. 담당자가 BA_NEWS_API 연결부를 설정해야 합니다.'));
    return asyncCall(function(){return adapter[method].apply(adapter,args);});
  }
  function run(method, args, fn) { return mode === 'api' ? api(method,args) : asyncCall(fn); }
  function pack(items) { return {schemaVersion:1, exportedAt:new Date().toISOString(), imageEncoding:'embedded-data-url-or-site-relative-or-https', items:copy(items)}; }
  var store = {
    mode:mode,
    root:root.href,
    imageURL:imageURL,
    externalURL:externalURL,
    link:function(n){
      var file = n.body ? (n.legacyHref || 'news-detail.html?id=' + encodeURIComponent(n.id)) : '';
      return file ? store.url('html/' + file) : '';
    },
    url:function(path){var u=new URL(path,root); if(mode!=='static')u.searchParams.set('newsMode',mode);return u.href;},
    list:function(options){options=options||{};return run('list',[options],function(){return sort(read().filter(function(n){return options.admin || n.status==='published';}));});},
    get:function(id,options){options=options||{};return run('get',[id,options],function(){return read().filter(function(n){return n.id===id && (options.admin || n.status==='published');})[0] || null;});},
    saveDraft:function(input){return run('saveDraft',[input],function(){
      var items=read(), old=items.filter(function(n){return n.id===input.id;})[0];
      if(input.id && !old)fail('다른 창에서 자료가 교체되었습니다. 입력을 보관하고 새로고침해 주세요.');
      if(old && input.expectedUpdatedAt !== old.updatedAt)fail('다른 창에서 글이 변경되었습니다. 입력을 보관하고 최신 글을 다시 불러와 주세요.');
      if(old && old.status==='trashed')fail('휴지통의 글은 먼저 복구해 주세요.');
      var now=new Date().toISOString();
      var n=old?copy(old):{id:'news-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10),status:'draft',createdAt:now,publishedAt:null,deletedAt:null,previousStatus:null,legacyHref:''};
      ['title','ko','tag','excerpt','body','image','imageAlt','date'].forEach(function(k){n[k]=input[k] || '';});
      n.updatedAt=now;validate(n);
      if(old) items[items.indexOf(old)]=n; else items.push(n);
      write(items);return copy(n);
    });},
    transition:function(id,action){return run('transition',[id,action],function(){
      var items=read(), n=items.filter(function(x){return x.id===id;})[0];if(!n)fail('글을 찾을 수 없습니다.');
      var now=new Date().toISOString();
      if(action==='restore' && n.status==='trashed'){n.status=n.previousStatus || 'draft';n.previousStatus=null;n.deletedAt=null;}
      else if(action==='trash' && n.status!=='trashed'){n.previousStatus=n.status;n.status='trashed';n.deletedAt=now;}
      else if(action==='publish' && n.status==='draft'){if(!(n.body||'').trim())fail('본문이 없는 글은 새로 게시할 수 없습니다.');n.status='published';n.publishedAt=n.publishedAt||now;}
      else if(action==='unpublish' && n.status==='published')n.status='draft';
      else fail('현재 상태에서 실행할 수 없는 작업입니다.');
      n.updatedAt=now;write(items);return copy(n);
    });},
    exportData:function(){return run('exportData',[],function(){return pack(read());});},
    importData:function(data){return run('importData',[data],function(){
      if(!data || data.schemaVersion!==1 || !Array.isArray(data.items) || data.items.length>1000)fail('schemaVersion 1의 뉴스 JSON을 선택해 주세요(최대 1,000건).');
      var seen={};data.items.forEach(function(n){validate(n);if(seen[n.id])fail('중복된 글 ID가 있습니다.');seen[n.id]=true;});
      write(copy(data.items));return data.items.length;
    });},
    reset:function(){return run('reset',[],function(){write(seed());});},
    readImage:function(file){return new Promise(function(resolve,reject){
      if(!file || !/^image\/(png|jpeg|webp)$/.test(file.type) || file.size>1048576){reject(new Error('1MB 이하 PNG·JPEG·WebP 파일을 선택해 주세요.'));return;}
      var reader=new FileReader();reader.onerror=function(){reject(new Error('이미지 파일을 읽지 못했습니다.'));};reader.onload=function(){var img=new Image();img.onerror=function(){reject(new Error('손상되었거나 지원하지 않는 이미지입니다.'));};img.onload=function(){if(img.width*img.height>16000000){reject(new Error('이미지는 1,600만 화소 이하로 준비해 주세요.'));return;}resolve(reader.result);};img.src=reader.result;};reader.readAsDataURL(file);
    });}
  };
  window.BANews=store;
  if(mode!=='static')document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('a[href]').forEach(function(a){var u=new URL(a.href,location.href);if(u.origin===root.origin && /\/(BA_Solutions|news|news-detail|news-drone-combat-challenge)\.html$/.test(u.pathname)){u.searchParams.set('newsMode',mode);a.href=u.href;}});
    if(document.getElementById('news-mode-notice'))return;
    var bar=document.createElement('div');bar.id='news-mode-notice';bar.textContent=mode==='demo'?'시연 · 이 브라우저의 데이터 / 실제 서버에 게시되지 않음':'API 모드 · 서버 연결 필요';
    bar.style.cssText='position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#f0ede8;color:#111;padding:10px 20px;font:14px sans-serif;text-align:center';document.body.appendChild(bar);document.body.style.paddingBottom='52px';
  });
}());
