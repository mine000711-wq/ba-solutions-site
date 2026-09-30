(function(){
'use strict';
var S=window.BANews, params=new URLSearchParams(location.search), id=params.get('id')||document.body.getAttribute('data-news-id');
var preview=params.get('preview')==='1' && (S.mode==='demo'||S.mode==='api');
function set(selector,value){document.querySelector(selector).textContent=value||'';}
function load(){
  var navigation=document.querySelector('.news-pagination');navigation.textContent='';navigation.hidden=true;
  Promise.all([S.get(id,{admin:preview}),S.list()]).then(function(result){
  var n=result[0],items=result[1].filter(function(item){return item.status==='published' && S.link(item);});
  var content=document.querySelector('.art-content'),image=document.querySelector('#art-image img');content.textContent='';
  if(!n || n.status==='trashed' || (!preview && n.status!=='published')){set('#article-header h1','Article not found');set('.art-tag','');set('.art-date','');set('.art-subtitle','');document.getElementById('art-image').hidden=true;document.title='BA Solutions - Article not found';return;}
  document.title='BA Solutions - '+n.title;set('#article-header h1',n.title);set('.art-tag',n.tag);set('.art-date',n.date.replace(/-/g,' / '));set('.art-subtitle',n.subtitle||n.excerpt);
  document.getElementById('art-image').hidden=!n.image;image.hidden=false;if(n.image)image.src=S.imageURL(n.image);else image.removeAttribute('src');image.alt=n.imageAlt||n.title;image.onerror=function(){document.getElementById('art-image').hidden=true;};
  (n.body?n.body.split(/\n\s*\n/):['The full article is not available in the current archive.']).forEach(function(text){var p=document.createElement('p');p.textContent=text;p.style.whiteSpace='pre-wrap';content.appendChild(p);});
  (n.gallery||[]).forEach(function(m){var figure=document.createElement('figure'),img=document.createElement('img');figure.style.cssText='margin:32px 0';img.src=S.externalURL(m.url);img.alt=m.alt||n.title;img.loading='lazy';img.style.cssText='display:block;max-width:100%;height:auto;margin:auto';img.onerror=function(){figure.hidden=true;};figure.appendChild(img);content.appendChild(figure);});
  function reference(url,label){var p=document.createElement('p'),a=document.createElement('a');a.href=S.externalURL(url);a.textContent=label+' ↗';a.target='_blank';a.rel='noopener noreferrer';a.style.cssText='color:inherit;text-decoration:underline';p.appendChild(a);content.appendChild(p);}
  (n.videos||[]).forEach(function(m){reference(m.url,m.label||'Watch video');});
  var index=items.map(function(item){return item.id;}).indexOf(id);
  if(index>=0 && items.length>1){
    function neighbor(item,label,empty){var a=document.createElement(item?'a':'div'),small=document.createElement('span'),title=document.createElement('strong');a.className='news-neighbor';small.textContent=label;title.textContent=item?item.title:empty;if(item)a.href=S.link(item);else a.setAttribute('aria-disabled','true');a.appendChild(small);a.appendChild(title);navigation.appendChild(a);}
    neighbor(items[index+1],'← PREVIOUS NEWS','No earlier news');
    neighbor(items[index-1],'NEXT NEWS →','No newer news');
    navigation.hidden=false;
  }
  if(preview){var note=document.createElement('p');note.textContent='저장본 미리보기 · '+(n.status==='draft'?'초안':'게시')+(S.mode==='demo'?' / 실제 서버에 게시되지 않음':' / 관리자 인증 필요');content.insertBefore(note,content.firstChild);}
}).catch(function(e){document.querySelector('.art-content').textContent='';document.getElementById('art-image').hidden=true;set('.art-tag','');set('.art-date','');set('#article-header h1','News could not be loaded');set('.art-subtitle',e.message);});}
document.querySelector('.back-link').href=S.url('html/news.html');document.getElementById('art-body').classList.add('visible');load();window.addEventListener('storage',load);window.addEventListener('pageshow',load);
}());
