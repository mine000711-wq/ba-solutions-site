/* v21 (2026-10-08): 외부 ABOUT US를 내부 CONTACT로 변경 — 데스크톱·모바일 공통. */
/* v20 (2026-09-29): 한/영 토글(KO / EN)을 메뉴바·모바일 드로어에서 제거 — 푸터 언어 선택 상자(footer.js v14)로 이동.
        햄버거·드로어 접근성 문구는 계속 선택 언어를 따름('ba:lang' 이벤트). */
/* v19 (2026-09-29): 로고를 div onclick → <a> 홈 링크로(모양 그대로). 새 탭 열기·링크 복사·키보드 이동 가능.
        링크 이름은 aria-label("BA SOLUTIONS home", i18n 페이지에서 한국어), 로고 SVG 는 aria-hidden.
        ABOUT US 링크 http → https. */
/* v18 (2026-09-29): 한/영 전환 토글(KO / EN) — 데스크톱 ABOUT US 오른쪽, 모바일 드로어 하단.
        선택·저장은 lang.js(window.baSetLang). 현재 언어 링크에 aria-current="true".
        햄버거·드로어의 접근성 문구도 선택 언어를 따름. lang.js 가 없으면 ?lang= 링크로 동작. */
/* v17 (2026-09-28): 로고를 새 락업(로고디자인/비에이솔루션즈로고.png = 로고.ai 대지 11 벡터)으로 교체.
        심볼 높이 200 기준 구조 유지 — 심볼 <g> 0~173.2 / 글자 249~1749, 세로 47~153. 표시 높이 22px 그대로. */
/* v16 (2026-09-28): IT SERVICES 메뉴 표기를 TECH로 단축. */
/* v15 (2026-09-21): IT SERVICES 메뉴 추가, 메뉴 충돌 방지 전환점 1100px. */
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
        --u 가 없는 페이지에서도 동작하도록 var(--u, 기본식) 폴백 사용. 문서/가이드/반응형_단위가이드.md
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
  var logoSvg = '<svg class="ba-lockup" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1749.41 200" fill="currentColor" role="img" aria-label="BA SOLUTIONS"><g><path d="M 156.94,59.39 L 156.94,140.61 L 86.6,181.22 L 16.26,140.61 L 16.26,59.39 L 86.6,18.78 Z M 86.6,0 L 2.84E-14,50 L 2.84E-14,150 L 86.6,200 L 173.2,150.25 L 173.21,50.24 Z"/><path d="M 90.67,111.74 L 140.68,140.61 L 148.81,135.92 L 148.81,126.53 L 98.93,97.73 L 90.67,102.5 Z"/><path d="M 24.39,126.53 L 24.39,135.92 L 32.53,140.61 L 82.53,111.74 L 82.53,102.5 L 74.27,97.73 Z"/><path d="M 78.47,32.86 L 78.47,90.76 L 86.6,95.46 L 94.73,90.76 L 94.73,32.86 L 86.6,28.17 Z"/></g><path d="M 1734.67,120.6 C 1734.67,116.83 1734.37,113.86 1733.78,111.7 C 1733.19,109.54 1731.85,107.94 1729.78,106.9 C 1727.7,105.86 1724.48,105.18 1720.11,104.87 C 1715.75,104.55 1709.77,104.32 1702.18,104.2 L 1666.83,103.69 C 1658.1,103.56 1651.09,103.03 1645.79,102.1 C 1640.49,101.17 1636.49,99.69 1633.78,97.68 C 1631.06,95.67 1629.25,92.97 1628.34,89.58 C 1627.43,86.18 1626.97,81.95 1626.97,76.86 C 1626.97,71.31 1627.6,66.73 1628.85,63.13 C 1630.1,59.52 1632.37,56.71 1635.65,54.67 C 1638.94,52.64 1643.59,51.21 1649.61,50.38 C 1655.62,49.55 1663.4,49.14 1672.94,49.14 L 1700.15,49.14 C 1708.8,49.14 1716,49.42 1721.76,49.97 C 1727.53,50.52 1732.11,51.79 1735.5,53.78 C 1738.89,55.77 1741.31,58.87 1742.78,63.06 C 1744.24,67.26 1744.97,73.02 1744.97,80.36 L 1732.76,80.36 C 1732.76,74.68 1732.22,70.39 1731.14,67.48 C 1730.06,64.58 1728.28,62.6 1725.8,61.54 C 1723.32,60.48 1719.99,59.91 1715.79,59.82 C 1711.59,59.74 1706.38,59.69 1700.15,59.69 L 1673.57,59.69 C 1665.99,59.69 1659.92,59.84 1655.36,60.14 C 1650.8,60.44 1647.36,61.11 1645.03,62.17 C 1642.7,63.23 1641.14,64.93 1640.36,67.26 C 1639.57,69.59 1639.18,72.79 1639.18,76.86 C 1639.18,80.29 1639.45,83.05 1640.01,85.12 C 1640.56,87.2 1641.8,88.78 1643.73,89.86 C 1645.65,90.94 1648.63,91.68 1652.66,92.09 C 1656.68,92.49 1662.17,92.73 1669.12,92.82 L 1707.01,93.33 C 1715.92,93.45 1723.03,93.97 1728.35,94.88 C 1733.66,95.8 1737.65,97.27 1740.3,99.3 C 1742.95,101.34 1744.71,104.08 1745.57,107.54 C 1746.44,110.99 1746.88,115.34 1746.88,120.6 C 1746.88,126.32 1746.34,131.12 1745.26,135 C 1744.18,138.88 1742.09,141.98 1738.99,144.31 C 1735.9,146.65 1731.43,148.32 1725.58,149.34 C 1719.73,150.35 1712.04,150.86 1702.5,150.86 L 1672.75,150.86 C 1664.06,150.86 1656.77,150.48 1650.88,149.72 C 1644.99,148.96 1640.29,147.42 1636.79,145.11 C 1633.3,142.8 1630.79,139.36 1629.26,134.78 C 1627.74,130.2 1626.97,124.1 1626.97,116.47 L 1639.18,116.47 C 1639.18,122.44 1639.67,127.06 1640.64,130.33 C 1641.62,133.59 1643.32,135.93 1645.76,137.35 C 1648.2,138.77 1651.61,139.62 1655.99,139.9 C 1660.38,140.17 1665.97,140.31 1672.75,140.31 L 1701.87,140.31 C 1709.45,140.31 1715.45,140.07 1719.86,139.58 C 1724.27,139.09 1727.53,138.16 1729.65,136.78 C 1731.77,135.4 1733.13,133.42 1733.75,130.84 C 1734.36,128.25 1734.67,124.84 1734.67,120.6 M 1472.75,148.83 L 1472.75,51.17 L 1485.46,51.17 L 1583.56,133.76 L 1583.69,133.76 L 1583.69,51.17 L 1595.89,51.17 L 1595.89,148.83 L 1583.18,148.83 L 1485.08,65.54 L 1484.95,65.54 L 1484.95,148.83 Z M 1369.13,140.31 L 1394.75,140.31 C 1400.81,140.31 1405.92,140.1 1410.07,139.67 C 1414.22,139.25 1417.6,138.34 1420.21,136.94 C 1422.82,135.54 1424.81,133.42 1426.19,130.58 C 1427.56,127.74 1428.51,123.95 1429.02,119.2 C 1429.52,114.45 1429.78,108.48 1429.78,101.27 L 1429.78,98.73 C 1429.78,91.27 1429.52,85.12 1429.02,80.29 C 1428.51,75.46 1427.56,71.65 1426.19,68.85 C 1424.81,66.05 1422.82,64.01 1420.21,62.71 C 1417.6,61.42 1414.22,60.59 1410.07,60.23 C 1405.92,59.87 1400.81,59.69 1394.75,59.69 L 1369.13,59.69 C 1363.07,59.69 1357.96,59.87 1353.81,60.23 C 1349.65,60.59 1346.27,61.42 1343.66,62.71 C 1341.06,64.01 1339.07,66.05 1337.69,68.85 C 1336.31,71.65 1335.37,75.46 1334.86,80.29 C 1334.35,85.12 1334.1,91.27 1334.1,98.73 L 1334.1,101.27 C 1334.1,108.48 1334.35,114.45 1334.86,119.2 C 1335.37,123.95 1336.31,127.74 1337.69,130.58 C 1339.07,133.42 1341.06,135.54 1343.66,136.94 C 1346.27,138.34 1349.65,139.25 1353.81,139.67 C 1357.96,140.1 1363.07,140.31 1369.13,140.31 M 1369.13,150.86 C 1359.59,150.86 1351.75,150.22 1345.6,148.92 C 1339.46,147.63 1334.66,145.25 1331.2,141.77 C 1327.75,138.3 1325.33,133.29 1323.96,126.77 C 1322.58,120.24 1321.89,111.74 1321.89,101.27 L 1321.89,98.73 C 1321.89,90.08 1322.31,82.83 1323.16,76.96 C 1324.01,71.09 1325.47,66.31 1327.55,62.62 C 1329.63,58.93 1332.45,56.11 1336.04,54.16 C 1339.62,52.21 1344.12,50.89 1349.55,50.19 C 1354.97,49.49 1361.5,49.14 1369.13,49.14 L 1394.75,49.14 C 1402.38,49.14 1408.9,49.49 1414.33,50.19 C 1419.75,50.89 1424.26,52.21 1427.84,54.16 C 1431.42,56.11 1434.25,58.93 1436.33,62.62 C 1438.4,66.31 1439.87,71.09 1440.71,76.96 C 1441.56,82.83 1441.99,90.08 1441.99,98.73 L 1441.99,101.27 C 1441.99,111.74 1441.3,120.24 1439.92,126.77 C 1438.54,133.29 1436.13,138.3 1432.67,141.77 C 1429.22,145.25 1424.42,147.63 1418.27,148.92 C 1412.13,150.22 1404.28,150.86 1394.75,150.86 Z M 1278.92,51.17 L 1291.13,51.17 L 1291.13,148.83 L 1278.92,148.83 Z M 1189.29,148.83 L 1189.29,61.35 L 1140.46,61.35 L 1140.46,51.17 L 1250.32,51.17 L 1250.32,61.35 L 1201.5,61.35 L 1201.5,148.83 Z M 1045.17,150.86 C 1035.64,150.86 1027.79,150.22 1021.65,148.92 C 1015.5,147.63 1010.7,145.25 1007.25,141.77 C 1003.79,138.3 1001.38,133.29 1000,126.77 C 998.62,120.24 997.93,111.74 997.93,101.27 L 997.93,51.17 L 1010.14,51.17 L 1010.14,101.27 C 1010.14,108.48 1010.4,114.45 1010.9,119.2 C 1011.41,123.95 1012.37,127.74 1013.77,130.58 C 1015.16,133.42 1017.17,135.54 1019.77,136.94 C 1022.38,138.34 1025.76,139.25 1029.91,139.67 C 1034.07,140.1 1039.15,140.31 1045.17,140.31 L 1068.19,140.31 C 1074.25,140.31 1079.34,140.1 1083.48,139.67 C 1087.61,139.25 1090.98,138.34 1093.59,136.94 C 1096.19,135.54 1098.2,133.42 1099.59,130.58 C 1100.99,127.74 1101.95,123.95 1102.45,119.2 C 1102.96,114.45 1103.22,108.48 1103.22,101.27 L 1103.22,51.17 L 1115.42,51.17 L 1115.42,101.27 C 1115.42,111.74 1114.74,120.24 1113.36,126.77 C 1111.98,133.29 1109.56,138.3 1106.11,141.77 C 1102.66,145.25 1097.86,147.63 1091.71,148.92 C 1085.56,150.22 1077.72,150.86 1068.19,150.86 Z M 885.29,148.83 L 885.29,51.17 L 897.49,51.17 L 897.49,138.66 L 974.8,138.66 L 974.8,148.83 Z M 781.67,140.31 L 807.29,140.31 C 813.35,140.31 818.46,140.1 822.61,139.67 C 826.77,139.25 830.15,138.34 832.75,136.94 C 835.36,135.54 837.35,133.42 838.73,130.58 C 840.11,127.74 841.05,123.95 841.56,119.2 C 842.07,114.45 842.32,108.48 842.32,101.27 L 842.32,98.73 C 842.32,91.27 842.07,85.12 841.56,80.29 C 841.05,75.46 840.11,71.65 838.73,68.85 C 837.35,66.05 835.36,64.01 832.75,62.71 C 830.15,61.42 826.77,60.59 822.61,60.23 C 818.46,59.87 813.35,59.69 807.29,59.69 L 781.67,59.69 C 775.61,59.69 770.5,59.87 766.35,60.23 C 762.19,60.59 758.81,61.42 756.21,62.71 C 753.6,64.01 751.61,66.05 750.23,68.85 C 748.85,71.65 747.91,75.46 747.4,80.29 C 746.89,85.12 746.64,91.27 746.64,98.73 L 746.64,101.27 C 746.64,108.48 746.89,114.45 747.4,119.2 C 747.91,123.95 748.85,127.74 750.23,130.58 C 751.61,133.42 753.6,135.54 756.21,136.94 C 758.81,138.34 762.19,139.25 766.35,139.67 C 770.5,140.1 775.61,140.31 781.67,140.31 M 781.67,150.86 C 772.13,150.86 764.29,150.22 758.15,148.92 C 752,147.63 747.2,145.25 743.75,141.77 C 740.29,138.3 737.87,133.29 736.5,126.77 C 735.12,120.24 734.43,111.74 734.43,101.27 L 734.43,98.73 C 734.43,90.08 734.85,82.83 735.7,76.96 C 736.55,71.09 738.01,66.31 740.09,62.62 C 742.17,58.93 745,56.11 748.58,54.16 C 752.16,52.21 756.66,50.89 762.09,50.19 C 767.51,49.49 774.04,49.14 781.67,49.14 L 807.29,49.14 C 814.92,49.14 821.45,49.49 826.87,50.19 C 832.3,50.89 836.8,52.21 840.38,54.16 C 843.96,56.11 846.79,58.93 848.87,62.62 C 850.95,66.31 852.41,71.09 853.26,76.96 C 854.1,82.83 854.53,90.08 854.53,98.73 L 854.53,101.27 C 854.53,111.74 853.84,120.24 852.46,126.77 C 851.08,133.29 848.67,138.3 845.21,141.77 C 841.76,145.25 836.96,147.63 830.81,148.92 C 824.67,150.22 816.83,150.86 807.29,150.86 Z M 695.85,120.6 C 695.85,116.83 695.55,113.86 694.96,111.7 C 694.37,109.54 693.03,107.94 690.96,106.9 C 688.88,105.86 685.66,105.18 681.29,104.87 C 676.93,104.55 670.95,104.32 663.36,104.2 L 628.01,103.69 C 619.28,103.56 612.27,103.03 606.97,102.1 C 601.67,101.17 597.67,99.69 594.95,97.68 C 592.24,95.67 590.43,92.97 589.52,89.58 C 588.61,86.18 588.15,81.95 588.15,76.86 C 588.15,71.31 588.78,66.73 590.03,63.13 C 591.28,59.52 593.55,56.71 596.83,54.67 C 600.12,52.64 604.77,51.21 610.78,50.38 C 616.8,49.55 624.58,49.14 634.12,49.14 L 661.33,49.14 C 669.98,49.14 677.18,49.42 682.94,49.97 C 688.71,50.52 693.29,51.79 696.68,53.78 C 700.07,55.77 702.49,58.87 703.96,63.06 C 705.42,67.26 706.15,73.02 706.15,80.36 L 693.94,80.36 C 693.94,74.68 693.4,70.39 692.32,67.48 C 691.24,64.58 689.46,62.6 686.98,61.54 C 684.5,60.48 681.16,59.91 676.97,59.82 C 672.77,59.74 667.56,59.69 661.33,59.69 L 634.75,59.69 C 627.17,59.69 621.1,59.84 616.54,60.14 C 611.98,60.44 608.54,61.11 606.21,62.17 C 603.88,63.23 602.32,64.93 601.54,67.26 C 600.75,69.59 600.36,72.79 600.36,76.86 C 600.36,80.29 600.63,83.05 601.18,85.12 C 601.74,87.2 602.98,88.78 604.9,89.86 C 606.83,90.94 609.81,91.68 613.84,92.09 C 617.86,92.49 623.35,92.73 630.3,92.82 L 668.19,93.33 C 677.1,93.45 684.21,93.97 689.52,94.88 C 694.84,95.8 698.83,97.27 701.48,99.3 C 704.13,101.34 705.88,104.08 706.75,107.54 C 707.62,110.99 708.06,115.34 708.06,120.6 C 708.06,126.32 707.52,131.12 706.44,135 C 705.35,138.88 703.27,141.98 700.17,144.31 C 697.08,146.65 692.61,148.32 686.76,149.34 C 680.91,150.35 673.22,150.86 663.68,150.86 L 633.93,150.86 C 625.24,150.86 617.95,150.48 612.06,149.72 C 606.17,148.96 601.47,147.42 597.97,145.11 C 594.48,142.8 591.97,139.36 590.44,134.78 C 588.92,130.2 588.15,124.1 588.15,116.47 L 600.36,116.47 C 600.36,122.44 600.85,127.06 601.82,130.33 C 602.8,133.59 604.5,135.93 606.94,137.35 C 609.38,138.77 612.79,139.62 617.17,139.9 C 621.56,140.17 627.15,140.31 633.93,140.31 L 663.05,140.31 C 670.63,140.31 676.63,140.07 681.04,139.58 C 685.45,139.09 688.71,138.16 690.83,136.78 C 692.95,135.4 694.31,133.42 694.93,130.84 C 695.54,128.25 695.85,124.84 695.85,120.6 M 420.14,116.28 L 485.24,116.28 L 452.69,59.31 Z M 387.59,148.83 L 444.55,51.17 L 460.83,51.17 L 517.79,148.83 L 503.55,148.83 L 491.35,126.45 L 414.04,126.45 L 401.83,148.83 Z M 263.24,138.66 L 323.45,138.66 C 329.26,138.66 334.06,138.51 337.85,138.21 C 341.64,137.91 344.63,137.19 346.81,136.05 C 349,134.9 350.53,133.09 351.42,130.61 C 352.31,128.13 352.76,124.71 352.76,120.35 C 352.76,115.85 351.92,112.36 350.25,109.86 C 348.57,107.36 346.24,105.55 343.25,104.45 C 340.27,103.35 336.8,102.67 332.86,102.42 C 328.92,102.16 324.68,102.04 320.14,102.04 L 263.24,102.04 Z M 263.24,91.86 L 320.14,91.86 C 326.71,91.86 332.1,91.63 336.29,91.16 C 340.49,90.7 343.6,89.32 345.64,87.03 C 347.67,84.74 348.69,80.86 348.69,75.4 C 348.69,71.12 348.09,67.98 346.88,65.99 C 345.67,64 343.63,62.72 340.74,62.17 C 337.86,61.62 333.9,61.35 328.85,61.35 L 263.24,61.35 Z M 251.04,148.83 L 251.04,51.17 L 328.85,51.17 C 336.23,51.17 342.28,51.86 347.01,53.24 C 351.73,54.62 355.23,57.06 357.5,60.55 C 359.76,64.05 360.9,69 360.9,75.4 C 360.9,81.16 359.56,85.93 356.89,89.7 C 354.22,93.47 350.13,95.55 344.62,95.93 C 351.83,96.65 357.02,99.23 360.2,103.66 C 363.38,108.09 364.97,113.65 364.97,120.35 C 364.97,126.15 364.3,130.92 362.96,134.65 C 361.63,138.38 359.39,141.27 356.26,143.33 C 353.12,145.38 348.87,146.82 343.51,147.62 C 338.15,148.43 331.46,148.83 323.45,148.83 Z" stroke="currentColor" stroke-width="4.06" stroke-miterlimit="4"/></svg>';

  var inSub = /\/html\//.test(location.pathname);
  var assetBase = inSub ? '../' : '';
  var pageBase  = inSub ? '' : 'html/';
  var homeHref  = inSub ? '../BA_Solutions.html' : 'BA_Solutions.html';
  var contactCurrent = /\/contact\.html$/.test(location.pathname) ? ' aria-current="page"' : '';

  var links = [
    ['AIR','ba_air.html'],
    ['LAND','ba_land.html'],
    ['SEA','ba_sea.html'],
    ['AEGIS','aegis.html'],
    ['TECH','it-services.html']
  ];
  var li = links.map(function(l){
    return '<li><a href="'+pageBase+l[1]+'">'+l[0]+'</a></li>';
  }).join('');
  var mLinks = [
    ['AIR','ba_air.html'],
    ['LAND','ba_land.html'],
    ['SEA','ba_sea.html'],
    ['AEGIS','aegis.html'],
    ['TECH','it-services.html'],
    ['NEWS','news.html']
  ];
  var isKo = function(){ return window.BA_LANG === 'ko'; };
  var mli = mLinks.map(function(l){
    return '<li><a href="'+pageBase+l[1]+'">'+l[0]+'</a></li>';
  }).join('');


  document.write(
  '<style>'+
  /* 햄버거 메뉴 열 때 overflow:hidden 로 스크롤바가 사라져 콘텐츠가 밀리는 현상 방지: 스크롤바 자리 항상 예약 */
  'html{scrollbar-gutter:stable;}'+
  '@font-face{font-family:"Michroma";src:url("'+assetBase+'fonts/michroma-400.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap;}'+
  '#ba-nav{position:fixed;top:0;left:0;right:0;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 max(20px, calc(40 * var(--u, calc(min(100vw, 1440px) / 1440))));z-index:1000001;background:#000;border:0;backdrop-filter:none;-webkit-backdrop-filter:none;box-sizing:border-box;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;}'+
  '#ba-nav .logo-wrap{display:flex;align-items:center;cursor:pointer;color:#F0EDE8;text-decoration:none;}'+
  '#ba-nav .logo-wrap:focus-visible,#ba-nav a:focus-visible{outline:1px solid currentColor;outline-offset:4px;}'+
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
  '@media (max-width:1100px){#ba-nav .nav-links,#ba-nav .nav-about{display:none;}#ba-toggle{display:flex;}}'+
  '@media (min-width:1101px){#ba-menu{display:none;}}'+
  '</style>'+
  '<nav id="ba-nav">'+
    '<a class="logo-wrap" href="'+homeHref+'" aria-label="BA SOLUTIONS home" data-ko-aria-label="BA SOLUTIONS 홈">'+
      logoSvg.replace('role="img" aria-label="BA SOLUTIONS"','aria-hidden="true" focusable="false"')+
    '</a>'+
    '<ul class="nav-links">'+li+'</ul>'+
    '<div class="nav-right">'+
      '<a href="'+pageBase+'news.html" class="nav-about">NEWS</a>'+
      '<a href="'+pageBase+'contact.html" class="nav-about"'+contactCurrent+'>CONTACT</a>'+
    '</div>'+
  '</nav>'+
  '<button id="ba-toggle" type="button" aria-expanded="false" aria-controls="ba-menu" aria-label="'+(isKo()?'메뉴 열기':'Open menu')+'"><span></span></button>'+
  '<div id="ba-menu" role="dialog" aria-modal="true" aria-label="'+(isKo()?'메뉴':'Menu')+'">'+
    '<div class="panel">'+
      '<ul>'+mli+'</ul>'+
      '<a href="'+pageBase+'contact.html" class="about"'+contactCurrent+'>CONTACT</a>'+
    '</div>'+
  '</div>'
  );

  /* 공통 화면 모서리: 본문 < 장식 < 푸터 < 인디케이터 < 메뉴.
     페이지별 --pad와 무관하게 화면 가장자리 기준으로 위치를 통일한다. */
  document.write('<style>'+
    '#ba-corners{position:fixed;inset:0;z-index:999997;pointer-events:none;user-select:none;'+
      '--corner-inset:24px;color:#fff;}' +
    /* 불투명 백색 고정: 반투명이면 배경이 비쳐 위치마다 색이 달라 보인다.
       얇은 선은 뒤 배경과 섞여 밝기가 달라 보이므로 옅은 검은 번짐으로 배경과 분리한다.
       17px 칸 + 0.75px 선을 정중앙(8.125px)에 둔다. */
    '#ba-corners .ba-corner{position:absolute;width:17px;height:17px;filter:drop-shadow(0 0 1px rgba(0,0,0,.45));}' +
    '#ba-corners .ba-corner::before,#ba-corners .ba-corner::after{content:"";position:absolute;background:currentColor;}' +
    '#ba-corners .ba-corner::before{width:17px;height:.75px;left:0;top:8.125px;}' +
    '#ba-corners .ba-corner::after{width:.75px;height:17px;left:8.125px;top:0;}' +
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
    btn.setAttribute('aria-label', isKo() ? (on ? '메뉴 닫기' : '메뉴 열기') : (on ? 'Close menu' : 'Open menu'));
    document.documentElement.style.overflow = on ? 'hidden' : '';
  }

  btn.addEventListener('click', function(){ setOpen(!btn.classList.contains('open')); });
  menuEl.addEventListener('click', function(e){
    if(e.target.closest('a')){ setOpen(false); return; }
    if(!e.target.closest('.panel')) setOpen(false);   /* 패널 바깥(스크림) 클릭 */
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', function(){ if(window.innerWidth > 1100) setOpen(false); });

  /* ---- 언어 변경 시 접근성 문구 갱신 (전환 UI 는 footer.js) ---- */
  function syncLang(){
    btn.setAttribute('aria-label', isKo() ? (btn.classList.contains('open') ? '메뉴 닫기' : '메뉴 열기') : (btn.classList.contains('open') ? 'Close menu' : 'Open menu'));
    menuEl.setAttribute('aria-label', isKo() ? '메뉴' : 'Menu');
  }
  syncLang();
  document.addEventListener('ba:lang', syncLang);
})();
