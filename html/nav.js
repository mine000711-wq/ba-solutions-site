/* ===================================================================
   BA SOLUTIONS 공용 상단 메뉴바  —  v14
   v3: E안 락업 인라인 SVG 적용
   v4: 메뉴/ABOUT US 서체를 Michroma 400 (B안: 11.5px / .1em)으로 통일
        폰트 실물: Claude/fonts/michroma-400.woff2  (SIL OFL 1.1)
   v5: 배경 완전 검정(#000) 불투명 처리, 하단 경계선 제거
        (반투명 + backdrop-filter blur 도 함께 제거 — 불투명 배경에서는 무효)
   v6: 페이지와 만나는 지점의 구분선 완전 제거 (border:0 명시)
       + 페이지 쪽 backdrop-filter 도 none 으로 무력화 (같은 이유)
   v7: 심볼 180도 회전 (images/logo.png · logo_b.png 회전에 맞춤)
   v8: 워드마크를 시안-2 굵기로 (stroke-width 4.8)
        기법은 로고 마스터 v2(BA_E1 = 'Michroma 400 + optical bold')와 동일:
        글자 path 에 stroke 를 덧대 획을 굵힘. 심볼은 손대지 않음.
        굵기 4.8 은 시안-2 이미지와 픽셀 대조로 역산 (IoU 0.914).
   v9: 좁은 화면 대응 — 820px 이하에서 햄버거 + 전체화면 오버레이로 전환
        기존: 중앙 메뉴가 position:absolute 라 flex 흐름 밖에 있어
        765px 이하에서 로고와, 620px 이하에서 ABOUT US 와 겹쳤음.
        브레이크포인트 820 은 겹침 시작(765)보다 약간 위로 잡아 여유를 둔 값.
        햄버거 색은 currentColor — 뉴스 페이지 같은 밝은 메뉴바는
        페이지 쪽에서 #ba-nav .nav-toggle{color:...} 로 덮어쓰면 됨.
   v10: 전체화면 오버레이 → 우측 드로어(폭 180px, 좌측 정렬)로 변경
        + 스크림에 backdrop-filter 로 뒷배경 블러 (현재 값은 아래 #ba-menu 규칙 참조)
        + 스크림(패널 바깥) 클릭으로도 닫힘
        메뉴바(z-index 100)는 스크림(99) 위라 블러에 영향받지 않음.
   v11: 메뉴바도 블러 대상에 포함 + 드로어가 메뉴바를 덮도록 변경
        스크림 z-index 99 → 101 (메뉴바 100 위), 드로어 top 56px → 0.
        토글 버튼은 nav 안에 두면 부모의 stacking context 에 갇혀
        스크림 위로 못 올라오므로, nav 바깥 최상위 #ba-toggle(z-index 102)로 분리.
        위치는 fixed 로 기존 자리와 동일하게 고정 — 열고 닫아도 X 가 안 움직임.
   v12: v11 의 '메뉴바 블러'는 요청 착오였으므로 되돌림.
        대신 좌측 섹션 인디케이터(#sec-indicator, z-index:999999)가
        블러·차폐 대상이 되도록 스택 순서를 재정의:
          인디케이터 999999  <  스크림 1000000  <  메뉴바 1000001  <  토글 1000002
        인디케이터를 쓰는 4개 페이지(BA_Solutions·ba_air·ba_land·ba_sea)를
        건드리지 않고 nav.js 한 곳에서 해결하기 위해 이 방식을 택함.
        드로어는 다시 메뉴바 아래(top:56px)에서 시작.
        심볼(육각형+Y)만 회전. 워드마크는 그대로 — 글자가 뒤집히면 안 되므로
        앞 4개 path 만 <g transform="rotate(180 ...)"> 로 감쌈.
        각 페이지가 자체 nav{}/footer{} 규칙에 border 를 갖고 있어,
        선언을 지우는 것만으로는 페이지 쪽 규칙이 살아남음.
        ID 선택자에 border:0 을 명시해 17개 페이지 전부를 덮어씀.
   v13: 좌우 padding·토글 위치 clamp(20px, 4.1667vw, 40px) → --u 단위 (2026-09-14)
        --u 가 없는 페이지에서도 동작하도록 var(--u, 기본식) 폴백 사용. Homepage/반응형_단위가이드.md
   v14: 데스크톱 메뉴바 ABOUT US 좌측에 NEWS 추가 (2026-09-15)
        같은 .nav-about 클래스를 써서 news 페이지 등의 밝은 메뉴바 덮어쓰기도 그대로 적용됨.
   이 파일 하나만 수정하면 모든 페이지 메뉴바가 함께 바뀝니다.
   각 HTML의 <nav> 위치에 <script src="nav.js"></script> 만 넣으세요.

   구조 고정:
     BA_Solutions.html  ← 루트 (Claude/)
     html/               ← 그 외 모든 페이지 + nav.js/footer.js
     images/, video/     ← 루트 (Claude/)
   이 스크립트는 현재 페이지가 html/ 안에 있는지 자동 감지해서
   경로를 알아서 맞춰줍니다.
   =================================================================== */
(function(){
  /* E안 가로형 락업 (BA_E_01_horizontal, bone #F0EDE8) — currentColor로 색 제어 */
  var logoSvg = '<svg class="ba-lockup" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1765.45 200" fill="currentColor" role="img" aria-label="BA SOLUTIONS"><g transform="rotate(180 86.60300 100.00000)"><path d="M 86.605,0 L 0.003,49.999 L 0,150.001 L 86.605,200 L 173.206,150.001 L 173.206,50.002 L 86.605,0 M 86.605,14.424 L 160.716,57.213 L 160.716,142.79 L 86.605,185.576 L 12.493,142.787 L 12.493,57.213 L 86.605,14.424"/><path d="M 73.98,99.924 L 80.358,96.239 L 80.358,89.185 L 31.227,60.819 L 24.983,64.423 L 24.983,71.636 L 73.98,99.924"/><path d="M 92.848,167.549 L 92.848,110.663 L 86.605,107.056 L 80.358,110.663 L 80.358,167.549 L 86.605,171.153 L 92.848,167.549"/><path d="M 141.979,60.819 L 92.851,89.185 L 92.851,96.239 L 99.229,99.924 L 148.226,71.636 L 148.226,64.423 L 141.979,60.819"/></g><path d="M254.988 150V50H334.676Q346.004 50 353.263 52.116Q360.522 54.232 364.005 59.603Q367.488 64.974 367.488 74.805Q367.488 83.659 363.387 89.453Q359.285 95.247 350.822 95.833Q361.889 96.94 366.772 103.743Q371.655 110.547 371.655 120.833Q371.655 129.753 369.604 135.482Q367.554 141.211 362.736 144.368Q357.918 147.526 349.682 148.763Q341.447 150 329.142 150ZM267.488 91.667H325.757Q335.848 91.667 342.293 90.951Q348.738 90.234 351.863 86.719Q354.988 83.203 354.988 74.805Q354.988 68.229 353.133 65.169Q351.278 62.109 346.85 61.263Q342.423 60.417 334.676 60.417H267.488ZM267.488 139.583H329.142Q338.061 139.583 343.888 139.128Q349.715 138.672 353.068 136.914Q356.421 135.156 357.788 131.348Q359.155 127.539 359.155 120.833Q359.155 113.932 356.583 110.091Q354.012 106.25 349.422 104.557Q344.832 102.865 338.778 102.474Q332.723 102.083 325.757 102.083H267.488Z M392.155 150 450.488 50H467.155L525.488 150H510.905L498.405 127.083H419.238L406.738 150ZM425.488 116.667H492.155L458.822 58.333Z M702.491 121.094Q702.491 115.299 701.58 111.979Q700.668 108.659 697.478 107.064Q694.288 105.469 687.582 104.98Q680.876 104.492 669.223 104.297L633.025 103.776Q619.613 103.581 611.475 102.148Q603.337 100.716 599.171 97.624Q595.004 94.531 593.604 89.323Q592.205 84.115 592.205 76.302Q592.205 67.773 594.125 62.24Q596.046 56.706 601.091 53.581Q606.137 50.456 615.382 49.186Q624.626 47.917 639.275 47.917H667.139Q680.421 47.917 689.275 48.763Q698.129 49.609 703.337 52.669Q708.546 55.729 710.792 62.174Q713.038 68.62 713.038 79.883H700.538Q700.538 71.159 698.878 66.699Q697.218 62.24 693.409 60.612Q689.6 58.984 683.155 58.854Q676.71 58.724 667.139 58.724H639.926Q628.272 58.724 621.274 59.18Q614.275 59.635 610.694 61.263Q607.113 62.891 605.909 66.471Q604.705 70.052 604.705 76.302Q604.705 81.576 605.551 84.766Q606.397 87.956 609.36 89.616Q612.322 91.276 618.507 91.895Q624.692 92.513 635.369 92.643L674.171 93.164Q687.843 93.359 696.013 94.759Q704.184 96.159 708.253 99.284Q712.322 102.409 713.656 107.715Q714.991 113.021 714.991 121.094Q714.991 129.883 713.331 135.84Q711.671 141.797 706.918 145.378Q702.166 148.958 693.181 150.521Q684.197 152.083 669.548 152.083H639.08Q625.733 152.083 616.684 150.911Q607.634 149.74 602.263 146.191Q596.892 142.643 594.548 135.612Q592.205 128.581 592.205 116.862H604.705Q604.705 126.042 606.202 131.055Q607.699 136.068 611.443 138.249Q615.186 140.43 621.925 140.853Q628.663 141.276 639.08 141.276H668.897Q680.551 141.276 687.322 140.527Q694.093 139.779 697.348 137.663Q700.603 135.547 701.547 131.576Q702.491 127.604 702.491 121.094Z M787.705 152.083Q773.056 152.083 763.616 150.098Q754.176 148.112 748.87 142.773Q743.564 137.435 741.448 127.409Q739.332 117.383 739.332 101.302V98.698Q739.332 85.417 740.634 76.4Q741.936 67.383 745.126 61.719Q748.317 56.055 753.818 53.06Q759.319 50.065 767.653 48.991Q775.986 47.917 787.705 47.917H813.942Q825.66 47.917 833.994 48.991Q842.327 50.065 847.828 53.06Q853.33 56.055 856.52 61.719Q859.71 67.383 861.012 76.4Q862.314 85.417 862.314 98.698V101.302Q862.314 117.383 860.198 127.409Q858.082 137.435 852.776 142.773Q847.47 148.112 838.03 150.098Q828.59 152.083 813.942 152.083ZM787.705 141.276H813.942Q823.251 141.276 829.632 140.625Q836.012 139.974 840.016 137.826Q844.02 135.677 846.136 131.315Q848.251 126.953 849.033 119.661Q849.814 112.37 849.814 101.302V98.698Q849.814 87.24 849.033 79.818Q848.251 72.396 846.136 68.099Q844.02 63.802 840.016 61.816Q836.012 59.831 829.632 59.277Q823.251 58.724 813.942 58.724H787.705Q778.395 58.724 772.014 59.277Q765.634 59.831 761.63 61.816Q757.626 63.802 755.511 68.099Q753.395 72.396 752.613 79.818Q751.832 87.24 751.832 98.698V101.302Q751.832 112.37 752.613 119.661Q753.395 126.953 755.511 131.315Q757.626 135.677 761.63 137.826Q765.634 139.974 772.014 140.625Q778.395 141.276 787.705 141.276Z M891.147 150V50H903.647V139.583H982.814V150Z M1052.207 152.083Q1037.559 152.083 1028.119 150.098Q1018.679 148.112 1013.373 142.773Q1008.067 137.435 1005.951 127.409Q1003.835 117.383 1003.835 101.302V50H1016.335V101.302Q1016.335 112.37 1017.116 119.661Q1017.897 126.953 1020.046 131.315Q1022.194 135.677 1026.198 137.826Q1030.202 139.974 1036.582 140.625Q1042.962 141.276 1052.207 141.276H1075.775Q1085.085 141.276 1091.432 140.625Q1097.78 139.974 1101.784 137.826Q1105.788 135.677 1107.936 131.315Q1110.085 126.953 1110.866 119.661Q1111.647 112.37 1111.647 101.302V50H1124.147V101.302Q1124.147 117.383 1122.031 127.409Q1119.916 137.435 1114.61 142.773Q1109.304 148.112 1099.863 150.098Q1090.423 152.083 1075.775 152.083Z M1197.121 150V60.417H1147.121V50H1259.621V60.417H1209.621V150Z M1286.241 150V50H1298.741V150Z M1375.947 152.083Q1361.298 152.083 1351.858 150.098Q1342.418 148.112 1337.112 142.773Q1331.806 137.435 1329.69 127.409Q1327.574 117.383 1327.574 101.302V98.698Q1327.574 85.417 1328.876 76.4Q1330.179 67.383 1333.369 61.719Q1336.559 56.055 1342.06 53.06Q1347.561 50.065 1355.895 48.991Q1364.228 47.917 1375.947 47.917H1402.184Q1413.903 47.917 1422.236 48.991Q1430.569 50.065 1436.07 53.06Q1441.572 56.055 1444.762 61.719Q1447.952 67.383 1449.254 76.4Q1450.556 85.417 1450.556 98.698V101.302Q1450.556 117.383 1448.44 127.409Q1446.324 137.435 1441.018 142.773Q1435.712 148.112 1426.272 150.098Q1416.832 152.083 1402.184 152.083ZM1375.947 141.276H1402.184Q1411.494 141.276 1417.874 140.625Q1424.254 139.974 1428.258 137.826Q1432.262 135.677 1434.378 131.315Q1436.494 126.953 1437.275 119.661Q1438.056 112.37 1438.056 101.302V98.698Q1438.056 87.24 1437.275 79.818Q1436.494 72.396 1434.378 68.099Q1432.262 63.802 1428.258 61.816Q1424.254 59.831 1417.874 59.277Q1411.494 58.724 1402.184 58.724H1375.947Q1366.637 58.724 1360.257 59.277Q1353.876 59.831 1349.873 61.816Q1345.869 63.802 1343.753 68.099Q1341.637 72.396 1340.856 79.818Q1340.074 87.24 1340.074 98.698V101.302Q1340.074 112.37 1340.856 119.661Q1341.637 126.953 1343.753 131.315Q1345.869 135.677 1349.873 137.826Q1353.876 139.974 1360.257 140.625Q1366.637 141.276 1375.947 141.276Z M1479.389 150V50H1492.41L1592.866 134.57H1592.996V50H1605.496V150H1592.475L1492.02 64.714H1491.889V150Z M1744.942 121.094Q1744.942 115.299 1744.03 111.979Q1743.119 108.659 1739.929 107.064Q1736.738 105.469 1730.033 104.98Q1723.327 104.492 1711.673 104.297L1675.475 103.776Q1662.064 103.581 1653.926 102.148Q1645.788 100.716 1641.621 97.624Q1637.455 94.531 1636.055 89.323Q1634.655 84.115 1634.655 76.302Q1634.655 67.773 1636.576 62.24Q1638.496 56.706 1643.542 53.581Q1648.587 50.456 1657.832 49.186Q1667.077 47.917 1681.725 47.917H1709.59Q1722.871 47.917 1731.725 48.763Q1740.58 49.609 1745.788 52.669Q1750.996 55.729 1753.242 62.174Q1755.488 68.62 1755.488 79.883H1742.988Q1742.988 71.159 1741.328 66.699Q1739.668 62.24 1735.86 60.612Q1732.051 58.984 1725.606 58.854Q1719.16 58.724 1709.59 58.724H1682.376Q1670.723 58.724 1663.724 59.18Q1656.725 59.635 1653.145 61.263Q1649.564 62.891 1648.36 66.471Q1647.155 70.052 1647.155 76.302Q1647.155 81.576 1648.001 84.766Q1648.848 87.956 1651.81 89.616Q1654.772 91.276 1660.957 91.895Q1667.142 92.513 1677.819 92.643L1716.621 93.164Q1730.293 93.359 1738.464 94.759Q1746.634 96.159 1750.703 99.284Q1754.772 102.409 1756.107 107.715Q1757.442 113.021 1757.442 121.094Q1757.442 129.883 1755.781 135.84Q1754.121 141.797 1749.369 145.378Q1744.616 148.958 1735.632 150.521Q1726.647 152.083 1711.999 152.083H1681.53Q1668.184 152.083 1659.134 150.911Q1650.085 149.74 1644.714 146.191Q1639.343 142.643 1636.999 135.612Q1634.655 128.581 1634.655 116.862H1647.155Q1647.155 126.042 1648.653 131.055Q1650.15 136.068 1653.893 138.249Q1657.637 140.43 1664.375 140.853Q1671.113 141.276 1681.53 141.276H1711.348Q1723.001 141.276 1729.772 140.527Q1736.543 139.779 1739.798 137.663Q1743.054 135.547 1743.998 131.576Q1744.942 127.604 1744.942 121.094Z" stroke="currentColor" stroke-width="4.8" stroke-linejoin="round"/></svg>';

  var inSub = /\/html\//.test(location.pathname);
  var assetBase = inSub ? '../' : '';
  var pageBase  = inSub ? '' : 'html/';
  var homeHref  = inSub ? '../BA_Solutions.html' : 'BA_Solutions.html';

  var links = [
    ['AIR','ba_air.html'],
    ['LAND','ba_land.html'],
    ['SEA','ba_sea.html'],
    ['AEGIS','aegis.html']
  ];
  var li = links.map(function(l){
    return '<li><a href="'+pageBase+l[1]+'">'+l[0]+'</a></li>';
  }).join('');
  var mLinks = [
    ['AIR','ba_air.html'],
    ['LAND','ba_land.html'],
    ['SEA','ba_sea.html'],
    ['AEGIS','aegis.html'],
    ['NEWS','news.html']
  ];
  var mli = mLinks.map(function(l){
    return '<li><a href="'+pageBase+l[1]+'">'+l[0]+'</a></li>';
  }).join('');


  document.write(
  '<style>'+
  /* 햄버거 메뉴 열 때 overflow:hidden 로 스크롤바가 사라져 콘텐츠가 밀리는 현상 방지: 스크롤바 자리 항상 예약 */
  'html{scrollbar-gutter:stable;}'+
  '@font-face{font-family:"Michroma";src:url("'+assetBase+'fonts/michroma-400.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap;}'+
  '#ba-nav{position:fixed;top:0;left:0;right:0;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 max(20px, calc(40 * var(--u, calc(min(100vw, 1440px) / 1440))));z-index:1000001;background:#000;border:0;backdrop-filter:none;-webkit-backdrop-filter:none;box-sizing:border-box;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;}'+
  '#ba-nav .logo-wrap{display:flex;align-items:center;cursor:pointer;color:#F0EDE8;}'+
  '#ba-nav .logo-wrap svg{height:22px;width:auto;display:block;}'+
  
  '#ba-nav .nav-links{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:8px;list-style:none;margin:0;padding:0;}'+
  '#ba-nav .nav-links a{display:block;padding:18px 13px;font-family:"Michroma","Helvetica Neue",Helvetica,Arial,sans-serif;font-size:11.5px;letter-spacing:.1em;color:rgba(240,237,232,.4);text-decoration:none;transition:color .3s;white-space:nowrap;}'+
  '#ba-nav .nav-links a:hover{color:#F0EDE8;}'+
  '#ba-nav .nav-about{display:block;padding:18px 13px;font-family:"Michroma","Helvetica Neue",Helvetica,Arial,sans-serif;font-size:11.5px;letter-spacing:.1em;color:rgba(240,237,232,.4);text-decoration:none;transition:color .3s;border:none;background:transparent;white-space:nowrap;}'+
  '#ba-nav .nav-about:hover{color:#F0EDE8;background:transparent;}'+
  '#ba-nav .nav-right{display:flex;align-items:center;}'+
  /* 토글 버튼은 nav 바깥의 최상위 요소 — 메뉴바가 블러·차폐돼도 항상 또렷하고 누를 수 있음 */
  '#ba-toggle{display:none;position:fixed;top:11px;right:calc(max(20px, calc(40 * var(--u, calc(min(100vw, 1440px) / 1440)))) - 6px);z-index:1000002;width:34px;height:34px;align-items:center;justify-content:center;padding:0;background:transparent;border:0;cursor:pointer;color:#F0EDE8;}'+
  '#ba-toggle span{display:block;position:relative;width:22px;height:1.5px;background:currentColor;transition:background .2s ease;}'+
  '#ba-toggle span::before,#ba-toggle span::after{content:"";position:absolute;left:0;width:22px;height:1.5px;background:currentColor;transition:transform .3s ease;}'+
  '#ba-toggle span::before{top:-7px;}'+
  '#ba-toggle span::after{top:7px;}'+
  '#ba-toggle.open span{background:transparent;}'+
  '#ba-toggle.open span::before{transform:translateY(7px) rotate(45deg);}'+
  '#ba-toggle.open span::after{transform:translateY(-7px) rotate(-45deg);}'+
  /* 스크림: 뒷배경 블러 + 클릭 시 닫힘 */
  '#ba-menu{position:fixed;inset:0;z-index:1000000;opacity:0;visibility:hidden;background:rgba(0,0,0,.35);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);transition:opacity .32s ease,visibility .32s;}'+
  '#ba-menu.open{opacity:1;visibility:visible;}'+
  /* 우측 드로어: 메뉴바 아래에서 시작, 폭 180px 고정, 좌측 정렬 */
  '#ba-menu .panel{position:absolute;top:56px;right:0;bottom:0;width:180px;box-sizing:border-box;background:#000;display:flex;flex-direction:column;align-items:flex-start;padding:30px 16px 30px 24px;transform:translateX(100%);transition:transform .34s cubic-bezier(.4,0,.2,1);}'+
  '#ba-menu.open .panel{transform:translateX(0);}'+
  '#ba-menu ul{list-style:none;margin:0;padding:0;width:100%;}'+
  '#ba-menu a{display:block;font-family:"Michroma","Helvetica Neue",Helvetica,Arial,sans-serif;letter-spacing:.08em;color:rgba(240,237,232,.55);text-decoration:none;transition:color .3s;white-space:nowrap;}'+
  '#ba-menu ul a{font-size:13px;padding:13px 0;}'+
  '#ba-menu .about{margin-top:20px;font-size:10.5px;letter-spacing:.14em;padding:12px 0;}'+
  '#ba-menu a:hover,#ba-menu a:focus-visible{color:#F0EDE8;}'+
  '@media (max-width:820px){#ba-nav .nav-links,#ba-nav .nav-about{display:none;}#ba-toggle{display:flex;}}'+
  '@media (min-width:821px){#ba-menu{display:none;}}'+
  '</style>'+
  '<nav id="ba-nav">'+
    '<div class="logo-wrap" onclick="location.href=\''+homeHref+'\'">'+
      logoSvg+
    '</div>'+
    '<ul class="nav-links">'+li+'</ul>'+
    '<div class="nav-right">'+
      '<a href="'+pageBase+'news.html" class="nav-about">NEWS</a>'+
      '<a href="http://basolutions.co.kr" class="nav-about">ABOUT US</a>'+
    '</div>'+
  '</nav>'+
  '<button id="ba-toggle" type="button" aria-expanded="false" aria-controls="ba-menu" aria-label="메뉴 열기"><span></span></button>'+
  '<div id="ba-menu" role="dialog" aria-modal="true" aria-label="메뉴">'+
    '<div class="panel">'+
      '<ul>'+mli+'</ul>'+
      '<a href="http://basolutions.co.kr" class="about">ABOUT US</a>'+
    '</div>'+
  '</div>'
  );

  /* 공통 화면 모서리: 본문 < 장식 < 푸터 < 인디케이터 < 메뉴.
     페이지별 --pad와 무관하게 화면 가장자리 기준으로 위치를 통일한다. */
  document.write('<style>'+
    '#ba-corners{position:fixed;inset:0;z-index:999997;pointer-events:none;user-select:none;'+
      '--corner-inset:24px;color:var(--ink, #f0ede8);opacity:.38;}' +
    /* 홀수 크기 + 1px 중심선: 네 팔을 각각 6px로 맞춘다. */
    '#ba-corners .ba-corner{position:absolute;width:13px;height:13px;}' +
    '#ba-corners .ba-corner::before,#ba-corners .ba-corner::after{content:"";position:absolute;background:currentColor;}' +
    '#ba-corners .ba-corner::before{width:13px;height:1px;left:0;top:6px;}' +
    '#ba-corners .ba-corner::after{width:1px;height:13px;left:6px;top:0;}' +
    '#ba-corners .ba-corner-tl,#ba-corners .ba-corner-tr{top:80px;}' +
    '#ba-corners .ba-corner-bl,#ba-corners .ba-corner-br{bottom:24px;}' +
    '#ba-corners .ba-corner-tl,#ba-corners .ba-corner-bl{left:var(--corner-inset);}' +
    '#ba-corners .ba-corner-tr,#ba-corners .ba-corner-br{right:var(--corner-inset);}' +
    '@media(max-width:820px),(max-height:400px){#ba-corners{display:none;}}' +
    '@media print{#ba-corners{display:none;}}' +
    '</style><div id="ba-corners" aria-hidden="true">'+
    '<span class="ba-corner ba-corner-tl"></span><span class="ba-corner ba-corner-tr"></span>'+
    '<span class="ba-corner ba-corner-bl"></span><span class="ba-corner ba-corner-br"></span></div>');

  /* ---- 햄버거 토글 (820px 이하) ---- */
  var menuEl = document.getElementById('ba-menu');
  var btn    = document.getElementById('ba-toggle');

  function setOpen(on){
    btn.classList.toggle('open', on);
    menuEl.classList.toggle('open', on);
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? '메뉴 닫기' : '메뉴 열기');
    document.documentElement.style.overflow = on ? 'hidden' : '';
  }

  btn.addEventListener('click', function(){ setOpen(!btn.classList.contains('open')); });
  menuEl.addEventListener('click', function(e){
    if(e.target.closest('a')){ setOpen(false); return; }
    if(!e.target.closest('.panel')) setOpen(false);   /* 패널 바깥(스크림) 클릭 */
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', function(){ if(window.innerWidth > 820) setOpen(false); });
})();
