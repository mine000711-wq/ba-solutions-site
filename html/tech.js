/* TECH 5개 공용 스크립트 — 해시로 서비스 펼침, 메뉴 현재 위치, 문의 초안(메일/복사). 2026-09-29 분리.
   2026-09-29: 한/영 전환 — 선택 목록·입력 안내·메일 제목/본문·상태 안내가 lang.js 의 선택 언어(BA_LANG)를 따른다.
   <option> 은 안에 병기 쌍을 넣을 수 없어 여기서 문구를 바꿔 넣는다. 'ba:lang' 이벤트로 즉시 갱신.
   <body> 끝에서 동기 로드(defer 금지). */
(function(){
var section=document.getElementById(location.hash.slice(1));
if(section && section.classList.contains('service'))section.open=true;
var navLinks=document.querySelectorAll('#ba-nav a[href="it-services.html"],#ba-menu a[href="it-services.html"]');
for(var n=0;n<navLinks.length;n++)navLinks[n].setAttribute('aria-current','location');
var form=document.getElementById('brief-form');if(!form)return;
var field=document.getElementById('brief-topic'),area=document.getElementById('brief-text'),status=document.getElementById('brief-status');
function ko(){return window.BA_LANG!=='en';}
var topics={
  infrastructure:{ko:'인프라 설계·구축',en:'Infrastructure design & build'},
  security:{ko:'데이터·시스템 보안',en:'Data & system security'},
  continuity:{ko:'이중화·재해복구·전환',en:'HA, DR & migration'},
  operations:{ko:'운영·개발·기술지원',en:'Operations, development & support'}
};
var prompts={
  infrastructure:{ko:['현재 서버·OS·스토리지 구성','주요 업무와 성능 병목','설치 장소·전력·냉각 조건','도입 일정과 예산 범위'],
                  en:['Current server, OS and storage configuration','Key workloads and performance bottlenecks','Installation site, power and cooling conditions','Timeline and budget range']},
  security:{ko:['보호 대상 DB·데이터와 업무 범위','현재 보안 구성과 적용 목적','프로그램 수정·테스트 환경 유무','허용 가능한 성능 영향과 적용 일정'],
            en:['Databases and data to protect, and the business scope','Current security setup and the goal of the project','Whether programs can be modified and a test environment exists','Acceptable performance impact and timeline']},
  continuity:{ko:['대상 시스템과 업무 간 의존관계','목표 RTO·RPO 또는 허용 중단시간','데이터 용량·일일 변경량·회선 구성','전환 가능 시간과 원복 조건'],
              en:['Target systems and business dependencies','Target RTO and RPO, or acceptable downtime','Data volume, daily change rate and network links','Available switchover window and rollback conditions']},
  operations:{ko:['시스템·WAS·DB 버전과 구성','발생 증상·시각·빈도·영향 범위','최근 변경과 기존 점검 내용','희망 지원 범위와 원격 접근 가능 여부'],
              en:['System, WAS and DB versions and configuration','Symptoms, timing, frequency and impact','Recent changes and checks already made','Desired support scope and whether remote access is possible']}
};
var T={
  topic:{ko:'문의 분야: ',en:'Service area: '},
  more:{ko:'[추가로 공유 가능한 정보]',en:'[Additional information we can share]'},
  sign:{ko:'회사 / 담당자 / 회신 연락처: ',en:'Company / Contact person / Reply-to: '},
  subject:{ko:'[IT 서비스 문의] ',en:'[IT services inquiry] '},
  mailed:{ko:'메일 앱에서 내용을 확인하고 직접 보내주세요. 앱이 열리지 않으면 초안을 복사해 대표 이메일로 보내실 수 있습니다.',
          en:'Review the message in your email app and send it yourself. If the app does not open, copy the draft and send it to our main email address.'},
  copied:{ko:'문의 초안을 복사했습니다.',en:'Inquiry draft copied.'},
  manual:{ko:'아래 초안의 선택된 내용을 복사해 주세요. 작성한 요청 사항은 그대로 유지됩니다.',
          en:'Please copy the selected draft below. What you have written is kept as is.'}
};
function t(k){return T[k][ko()?'ko':'en'];}
function topicText(){return topics[field.value][ko()?'ko':'en'];}
function lines(){return prompts[field.value][ko()?'ko':'en'];}
function setOptions(){for(var i=0;i<field.options.length;i++){var o=field.options[i];if(topics[o.value])o.text=topics[o.value][ko()?'ko':'en'];}}
function setPrompt(){area.placeholder=lines().join('\n');}
function draft(){return t('topic')+topicText()+'\n\n'+area.value+'\n\n'+t('more')+'\n'+lines().join('\n')+'\n\n'+t('sign');}
var compose=document.getElementById('compose-mail');
function updateMail(){compose.href='mailto:babystar@basolutions.co.kr?subject='+encodeURIComponent(t('subject')+topicText())+'&body='+encodeURIComponent(draft());}
function refresh(){setOptions();setPrompt();updateMail();}
refresh();
field.addEventListener('change',function(){setPrompt();updateMail();});
area.addEventListener('input',updateMail);
document.addEventListener('ba:lang',function(){refresh();status.textContent='';});
form.addEventListener('submit',function(event){event.preventDefault();});
compose.addEventListener('click',function(){status.textContent=t('mailed');});
document.getElementById('copy-brief').addEventListener('click',function(){var text=draft();if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(function(){status.textContent=t('copied');},fallback);}else fallback();function fallback(){var panel=document.getElementById('copy-panel'),output=document.getElementById('copy-output');panel.hidden=false;output.value=text;output.focus();output.select();status.textContent=t('manual');}});
})();
