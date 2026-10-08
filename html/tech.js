

(function(){
var section=document.getElementById(location.hash.slice(1));
if(section && section.classList.contains('service'))section.open=true;
var navLinks=document.querySelectorAll('#ba-nav a[href="it-services.html"],#ba-menu a[href="it-services.html"]');
for(var n=0;n<navLinks.length;n++)navLinks[n].setAttribute('aria-current','location');
var form=document.getElementById('brief-form');if(!form)return;
var status=document.getElementById('brief-status');
function ko(){return window.BA_LANG!=='en';}
var T={
  topic:{ko:'문의 분야',en:'Service area'},
  env:{ko:'현재 환경',en:'Current environment'},
  support:{ko:'필요한 지원',en:'Support needed'},
  company:{ko:'회사명',en:'Company'},
  name:{ko:'담당자',en:'Contact person'},
  phone:{ko:'연락처',en:'Phone or email'},
  none:{ko:'선택 안 함',en:'Not selected'},
  blank:{ko:'(미입력)',en:'(not provided)'},
  subject:{ko:'[IT 서비스 문의] ',en:'[IT services inquiry] '},
  mailed:{ko:'메일 앱에서 내용을 확인하고 직접 보내주세요. 앱이 열리지 않으면 초안을 복사해 대표 이메일로 보내실 수 있습니다.',
          en:'Review the message in your email app and send it yourself. If the app does not open, copy the draft and send it to our main email address.'},
  copied:{ko:'문의 초안을 복사했습니다.',en:'Inquiry draft copied.'},
  manual:{ko:'아래 초안의 선택된 내용을 복사해 주세요. 선택한 내용은 그대로 유지됩니다.',
          en:'Please copy the selected draft below. Your selections are kept as is.'}
};
function t(k){return T[k][ko()?'ko':'en'];}

function chipText(input){var c=input.nextElementSibling,s=c.querySelector('[lang="'+(ko()?'ko':'en')+'"]');return (s||c).textContent.trim();}
function picked(name){var a=[],els=form.querySelectorAll('input[name="'+name+'"]:checked');for(var i=0;i<els.length;i++)a.push(chipText(els[i]));return a;}
function val(id){var v=document.getElementById(id).value.trim();return v||t('blank');}
function line(k,list){return t(k)+': '+(list.length?list.join(', '):t('none'));}
function draft(){return [line('topic',picked('topic')),line('env',picked('env')),line('support',picked('support')),'',
  t('company')+': '+val('brief-company'),t('name')+': '+val('brief-name'),t('phone')+': '+val('brief-phone')].join('\n');}
var compose=document.getElementById('compose-mail');
function updateMail(){compose.href='mailto:babystar@basolutions.co.kr?subject='+encodeURIComponent(t('subject')+(picked('topic')[0]||''))+'&body='+encodeURIComponent(draft());}
function refresh(){updateMail();}
refresh();
form.addEventListener('change',updateMail);
form.addEventListener('input',updateMail);
document.addEventListener('ba:lang',function(){refresh();status.textContent='';});
form.addEventListener('submit',function(event){event.preventDefault();});
compose.addEventListener('click',function(){status.textContent=t('mailed');});
document.getElementById('copy-brief').addEventListener('click',function(){var text=draft();if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(function(){status.textContent=t('copied');},fallback);}else fallback();function fallback(){var panel=document.getElementById('copy-panel'),output=document.getElementById('copy-output');panel.hidden=false;output.value=text;output.focus();output.select();status.textContent=t('manual');}});
})();
