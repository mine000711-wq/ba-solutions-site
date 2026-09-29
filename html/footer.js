/* v13 (2026-09-29): 푸터 개선 — 로고를 홈 링크(<a>)로, 링크에 TECH·NEWS 추가(메뉴바와 같은 구성),
        이메일(공식 관리자 메일) 추가, 우편번호 135721 → 13572(공식 사이트 표기), 저작권 연도는 현재 연도 자동,
        ABOUT US http → https. */
/* v12 (2026-09-29): 주소·연락처 안내·통제 품목 문구를 lang.js baPair 로 한/영 병기 — data-i18n 페이지에서만 한국어가 나옴.
        회사명·저작권 줄과 오른쪽 링크(Michroma)는 두 언어 모두 영문. */
/* v11 (2026-09-29): 섹션 인디케이터가 section.sec 외에 [data-sec-label] 요소도 읽음 —
        메인·ba_air/land/sea 의 자체 인디케이터(#sec-indicator)를 없애고 이 자동 생성으로 통일. */
/* v10 (2026-09-28): 로고를 새 락업(로고디자인/비에이솔루션즈로고.png = 로고.ai 대지 11 벡터)으로 교체. nav.js v17 과 동일 SVG. 표시 높이 20px 그대로. */
/* ===================================================================
   BA SOLUTIONS 공용 푸터  —  v9
   v2: E안 락업 인라인 SVG 적용
   v3: 우측 링크 서체를 Michroma 400 (R안: 10.5px / .08em)으로 통일
        주소·카피라이트는 판독성을 위해 Helvetica Neue 유지
        폰트 실물: Claude/fonts/michroma-400.woff2  (SIL OFL 1.1)
   v4: 배경 완전 검정(#000)으로 변경, 상단 경계선 제거
   v5: 페이지와 만나는 지점의 구분선 완전 제거 (border:0 명시)
   v6: 심볼 180도 회전 (images/logo.png · logo_b.png 회전에 맞춤)
   v7: 워드마크를 시안-2 굵기로 (stroke-width 4.8)
   v8: 상세 주소 블록 줄간격 2 → 1.5
        기법은 로고 마스터 v2(BA_E1 = 'Michroma 400 + optical bold')와 동일:
        글자 path 에 stroke 를 덧대 획을 굵힘. 심볼은 손대지 않음.
        굵기 4.8 은 시안-2 이미지와 픽셀 대조로 역산 (IoU 0.914).
        심볼(육각형+Y)만 회전. 워드마크는 그대로 — 글자가 뒤집히면 안 되므로
        앞 4개 path 만 <g transform="rotate(180 ...)"> 로 감쌈.
        각 페이지가 자체 nav{}/footer{} 규칙에 border 를 갖고 있어,
        선언을 지우는 것만으로는 페이지 쪽 규칙이 살아남음.
        ID 선택자에 border:0 을 명시해 17개 페이지 전부를 덮어씀.
   v10: 푸터 ABOUT US 링크를 about.html(존재하지 않는 페이지) → http://basolutions.co.kr 로 변경 (2026-09-16)
   v11: <body data-no-sec-ind> 가 있으면 섹션 인디케이터를 아예 만들지 않음 (aegis.html 요청, 2026-09-16)
   v12: 인디케이터 라벨 전환에 슬롯 효과 — window.baSlotRender (2026-09-17).
        메인·ba_air/land/sea 의 자체 인디케이터도 이 함수를 호출함
        nav.js 의 ABOUT US 링크와 동일한 대상
   v13: 푸터가 뷰포트에 진입하면 로고·텍스트·링크가 아래에서 순차 등장 (2026-09-28)
   v9: 좌우 padding clamp(20px 4.1667vw 60px) → --u 단위 (2026-09-14)
        기존 값은 쉼표가 빠져 선언 전체가 무효였고, 각 페이지의 footer{} 규칙이 대신 적용되고 있었음
        (product-aegis-v-jammer 는 규칙이 없어 좌우 여백 0). 이제 이 값이 전 페이지에 적용됨.
        --u 가 없는 페이지에서도 동작하도록 var(--u, 기본식) 폴백 사용. Homepage/반응형_단위가이드.md
   이 파일 하나만 수정하면 모든 페이지 푸터가 함께 바뀝니다.
   각 HTML의 <footer> 위치에 <script src="footer.js"></script> 만 넣으세요.

   구조 고정:
     BA_Solutions.html  ← 루트 (Claude/)
     html/               ← 그 외 모든 페이지 + nav.js/footer.js
     images/, video/     ← 루트 (Claude/)
   현재 페이지가 html/ 안에 있는지 자동 감지해서 경로를 맞춥니다.
   =================================================================== */
(function(){
  /* E안 가로형 락업 (BA_E_01_horizontal, bone #F0EDE8) — currentColor로 색 제어 */
  var logoSvg = '<svg class="ba-lockup" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1749.41 200" fill="currentColor" role="img" aria-label="BA SOLUTIONS"><g><path d="M 156.94,59.39 L 156.94,140.61 L 86.6,181.22 L 16.26,140.61 L 16.26,59.39 L 86.6,18.78 Z M 86.6,0 L 2.84E-14,50 L 2.84E-14,150 L 86.6,200 L 173.2,150.25 L 173.21,50.24 Z"/><path d="M 90.67,111.74 L 140.68,140.61 L 148.81,135.92 L 148.81,126.53 L 98.93,97.73 L 90.67,102.5 Z"/><path d="M 24.39,126.53 L 24.39,135.92 L 32.53,140.61 L 82.53,111.74 L 82.53,102.5 L 74.27,97.73 Z"/><path d="M 78.47,32.86 L 78.47,90.76 L 86.6,95.46 L 94.73,90.76 L 94.73,32.86 L 86.6,28.17 Z"/></g><path d="M 1734.67,120.6 C 1734.67,116.83 1734.37,113.86 1733.78,111.7 C 1733.19,109.54 1731.85,107.94 1729.78,106.9 C 1727.7,105.86 1724.48,105.18 1720.11,104.87 C 1715.75,104.55 1709.77,104.32 1702.18,104.2 L 1666.83,103.69 C 1658.1,103.56 1651.09,103.03 1645.79,102.1 C 1640.49,101.17 1636.49,99.69 1633.78,97.68 C 1631.06,95.67 1629.25,92.97 1628.34,89.58 C 1627.43,86.18 1626.97,81.95 1626.97,76.86 C 1626.97,71.31 1627.6,66.73 1628.85,63.13 C 1630.1,59.52 1632.37,56.71 1635.65,54.67 C 1638.94,52.64 1643.59,51.21 1649.61,50.38 C 1655.62,49.55 1663.4,49.14 1672.94,49.14 L 1700.15,49.14 C 1708.8,49.14 1716,49.42 1721.76,49.97 C 1727.53,50.52 1732.11,51.79 1735.5,53.78 C 1738.89,55.77 1741.31,58.87 1742.78,63.06 C 1744.24,67.26 1744.97,73.02 1744.97,80.36 L 1732.76,80.36 C 1732.76,74.68 1732.22,70.39 1731.14,67.48 C 1730.06,64.58 1728.28,62.6 1725.8,61.54 C 1723.32,60.48 1719.99,59.91 1715.79,59.82 C 1711.59,59.74 1706.38,59.69 1700.15,59.69 L 1673.57,59.69 C 1665.99,59.69 1659.92,59.84 1655.36,60.14 C 1650.8,60.44 1647.36,61.11 1645.03,62.17 C 1642.7,63.23 1641.14,64.93 1640.36,67.26 C 1639.57,69.59 1639.18,72.79 1639.18,76.86 C 1639.18,80.29 1639.45,83.05 1640.01,85.12 C 1640.56,87.2 1641.8,88.78 1643.73,89.86 C 1645.65,90.94 1648.63,91.68 1652.66,92.09 C 1656.68,92.49 1662.17,92.73 1669.12,92.82 L 1707.01,93.33 C 1715.92,93.45 1723.03,93.97 1728.35,94.88 C 1733.66,95.8 1737.65,97.27 1740.3,99.3 C 1742.95,101.34 1744.71,104.08 1745.57,107.54 C 1746.44,110.99 1746.88,115.34 1746.88,120.6 C 1746.88,126.32 1746.34,131.12 1745.26,135 C 1744.18,138.88 1742.09,141.98 1738.99,144.31 C 1735.9,146.65 1731.43,148.32 1725.58,149.34 C 1719.73,150.35 1712.04,150.86 1702.5,150.86 L 1672.75,150.86 C 1664.06,150.86 1656.77,150.48 1650.88,149.72 C 1644.99,148.96 1640.29,147.42 1636.79,145.11 C 1633.3,142.8 1630.79,139.36 1629.26,134.78 C 1627.74,130.2 1626.97,124.1 1626.97,116.47 L 1639.18,116.47 C 1639.18,122.44 1639.67,127.06 1640.64,130.33 C 1641.62,133.59 1643.32,135.93 1645.76,137.35 C 1648.2,138.77 1651.61,139.62 1655.99,139.9 C 1660.38,140.17 1665.97,140.31 1672.75,140.31 L 1701.87,140.31 C 1709.45,140.31 1715.45,140.07 1719.86,139.58 C 1724.27,139.09 1727.53,138.16 1729.65,136.78 C 1731.77,135.4 1733.13,133.42 1733.75,130.84 C 1734.36,128.25 1734.67,124.84 1734.67,120.6 M 1472.75,148.83 L 1472.75,51.17 L 1485.46,51.17 L 1583.56,133.76 L 1583.69,133.76 L 1583.69,51.17 L 1595.89,51.17 L 1595.89,148.83 L 1583.18,148.83 L 1485.08,65.54 L 1484.95,65.54 L 1484.95,148.83 Z M 1369.13,140.31 L 1394.75,140.31 C 1400.81,140.31 1405.92,140.1 1410.07,139.67 C 1414.22,139.25 1417.6,138.34 1420.21,136.94 C 1422.82,135.54 1424.81,133.42 1426.19,130.58 C 1427.56,127.74 1428.51,123.95 1429.02,119.2 C 1429.52,114.45 1429.78,108.48 1429.78,101.27 L 1429.78,98.73 C 1429.78,91.27 1429.52,85.12 1429.02,80.29 C 1428.51,75.46 1427.56,71.65 1426.19,68.85 C 1424.81,66.05 1422.82,64.01 1420.21,62.71 C 1417.6,61.42 1414.22,60.59 1410.07,60.23 C 1405.92,59.87 1400.81,59.69 1394.75,59.69 L 1369.13,59.69 C 1363.07,59.69 1357.96,59.87 1353.81,60.23 C 1349.65,60.59 1346.27,61.42 1343.66,62.71 C 1341.06,64.01 1339.07,66.05 1337.69,68.85 C 1336.31,71.65 1335.37,75.46 1334.86,80.29 C 1334.35,85.12 1334.1,91.27 1334.1,98.73 L 1334.1,101.27 C 1334.1,108.48 1334.35,114.45 1334.86,119.2 C 1335.37,123.95 1336.31,127.74 1337.69,130.58 C 1339.07,133.42 1341.06,135.54 1343.66,136.94 C 1346.27,138.34 1349.65,139.25 1353.81,139.67 C 1357.96,140.1 1363.07,140.31 1369.13,140.31 M 1369.13,150.86 C 1359.59,150.86 1351.75,150.22 1345.6,148.92 C 1339.46,147.63 1334.66,145.25 1331.2,141.77 C 1327.75,138.3 1325.33,133.29 1323.96,126.77 C 1322.58,120.24 1321.89,111.74 1321.89,101.27 L 1321.89,98.73 C 1321.89,90.08 1322.31,82.83 1323.16,76.96 C 1324.01,71.09 1325.47,66.31 1327.55,62.62 C 1329.63,58.93 1332.45,56.11 1336.04,54.16 C 1339.62,52.21 1344.12,50.89 1349.55,50.19 C 1354.97,49.49 1361.5,49.14 1369.13,49.14 L 1394.75,49.14 C 1402.38,49.14 1408.9,49.49 1414.33,50.19 C 1419.75,50.89 1424.26,52.21 1427.84,54.16 C 1431.42,56.11 1434.25,58.93 1436.33,62.62 C 1438.4,66.31 1439.87,71.09 1440.71,76.96 C 1441.56,82.83 1441.99,90.08 1441.99,98.73 L 1441.99,101.27 C 1441.99,111.74 1441.3,120.24 1439.92,126.77 C 1438.54,133.29 1436.13,138.3 1432.67,141.77 C 1429.22,145.25 1424.42,147.63 1418.27,148.92 C 1412.13,150.22 1404.28,150.86 1394.75,150.86 Z M 1278.92,51.17 L 1291.13,51.17 L 1291.13,148.83 L 1278.92,148.83 Z M 1189.29,148.83 L 1189.29,61.35 L 1140.46,61.35 L 1140.46,51.17 L 1250.32,51.17 L 1250.32,61.35 L 1201.5,61.35 L 1201.5,148.83 Z M 1045.17,150.86 C 1035.64,150.86 1027.79,150.22 1021.65,148.92 C 1015.5,147.63 1010.7,145.25 1007.25,141.77 C 1003.79,138.3 1001.38,133.29 1000,126.77 C 998.62,120.24 997.93,111.74 997.93,101.27 L 997.93,51.17 L 1010.14,51.17 L 1010.14,101.27 C 1010.14,108.48 1010.4,114.45 1010.9,119.2 C 1011.41,123.95 1012.37,127.74 1013.77,130.58 C 1015.16,133.42 1017.17,135.54 1019.77,136.94 C 1022.38,138.34 1025.76,139.25 1029.91,139.67 C 1034.07,140.1 1039.15,140.31 1045.17,140.31 L 1068.19,140.31 C 1074.25,140.31 1079.34,140.1 1083.48,139.67 C 1087.61,139.25 1090.98,138.34 1093.59,136.94 C 1096.19,135.54 1098.2,133.42 1099.59,130.58 C 1100.99,127.74 1101.95,123.95 1102.45,119.2 C 1102.96,114.45 1103.22,108.48 1103.22,101.27 L 1103.22,51.17 L 1115.42,51.17 L 1115.42,101.27 C 1115.42,111.74 1114.74,120.24 1113.36,126.77 C 1111.98,133.29 1109.56,138.3 1106.11,141.77 C 1102.66,145.25 1097.86,147.63 1091.71,148.92 C 1085.56,150.22 1077.72,150.86 1068.19,150.86 Z M 885.29,148.83 L 885.29,51.17 L 897.49,51.17 L 897.49,138.66 L 974.8,138.66 L 974.8,148.83 Z M 781.67,140.31 L 807.29,140.31 C 813.35,140.31 818.46,140.1 822.61,139.67 C 826.77,139.25 830.15,138.34 832.75,136.94 C 835.36,135.54 837.35,133.42 838.73,130.58 C 840.11,127.74 841.05,123.95 841.56,119.2 C 842.07,114.45 842.32,108.48 842.32,101.27 L 842.32,98.73 C 842.32,91.27 842.07,85.12 841.56,80.29 C 841.05,75.46 840.11,71.65 838.73,68.85 C 837.35,66.05 835.36,64.01 832.75,62.71 C 830.15,61.42 826.77,60.59 822.61,60.23 C 818.46,59.87 813.35,59.69 807.29,59.69 L 781.67,59.69 C 775.61,59.69 770.5,59.87 766.35,60.23 C 762.19,60.59 758.81,61.42 756.21,62.71 C 753.6,64.01 751.61,66.05 750.23,68.85 C 748.85,71.65 747.91,75.46 747.4,80.29 C 746.89,85.12 746.64,91.27 746.64,98.73 L 746.64,101.27 C 746.64,108.48 746.89,114.45 747.4,119.2 C 747.91,123.95 748.85,127.74 750.23,130.58 C 751.61,133.42 753.6,135.54 756.21,136.94 C 758.81,138.34 762.19,139.25 766.35,139.67 C 770.5,140.1 775.61,140.31 781.67,140.31 M 781.67,150.86 C 772.13,150.86 764.29,150.22 758.15,148.92 C 752,147.63 747.2,145.25 743.75,141.77 C 740.29,138.3 737.87,133.29 736.5,126.77 C 735.12,120.24 734.43,111.74 734.43,101.27 L 734.43,98.73 C 734.43,90.08 734.85,82.83 735.7,76.96 C 736.55,71.09 738.01,66.31 740.09,62.62 C 742.17,58.93 745,56.11 748.58,54.16 C 752.16,52.21 756.66,50.89 762.09,50.19 C 767.51,49.49 774.04,49.14 781.67,49.14 L 807.29,49.14 C 814.92,49.14 821.45,49.49 826.87,50.19 C 832.3,50.89 836.8,52.21 840.38,54.16 C 843.96,56.11 846.79,58.93 848.87,62.62 C 850.95,66.31 852.41,71.09 853.26,76.96 C 854.1,82.83 854.53,90.08 854.53,98.73 L 854.53,101.27 C 854.53,111.74 853.84,120.24 852.46,126.77 C 851.08,133.29 848.67,138.3 845.21,141.77 C 841.76,145.25 836.96,147.63 830.81,148.92 C 824.67,150.22 816.83,150.86 807.29,150.86 Z M 695.85,120.6 C 695.85,116.83 695.55,113.86 694.96,111.7 C 694.37,109.54 693.03,107.94 690.96,106.9 C 688.88,105.86 685.66,105.18 681.29,104.87 C 676.93,104.55 670.95,104.32 663.36,104.2 L 628.01,103.69 C 619.28,103.56 612.27,103.03 606.97,102.1 C 601.67,101.17 597.67,99.69 594.95,97.68 C 592.24,95.67 590.43,92.97 589.52,89.58 C 588.61,86.18 588.15,81.95 588.15,76.86 C 588.15,71.31 588.78,66.73 590.03,63.13 C 591.28,59.52 593.55,56.71 596.83,54.67 C 600.12,52.64 604.77,51.21 610.78,50.38 C 616.8,49.55 624.58,49.14 634.12,49.14 L 661.33,49.14 C 669.98,49.14 677.18,49.42 682.94,49.97 C 688.71,50.52 693.29,51.79 696.68,53.78 C 700.07,55.77 702.49,58.87 703.96,63.06 C 705.42,67.26 706.15,73.02 706.15,80.36 L 693.94,80.36 C 693.94,74.68 693.4,70.39 692.32,67.48 C 691.24,64.58 689.46,62.6 686.98,61.54 C 684.5,60.48 681.16,59.91 676.97,59.82 C 672.77,59.74 667.56,59.69 661.33,59.69 L 634.75,59.69 C 627.17,59.69 621.1,59.84 616.54,60.14 C 611.98,60.44 608.54,61.11 606.21,62.17 C 603.88,63.23 602.32,64.93 601.54,67.26 C 600.75,69.59 600.36,72.79 600.36,76.86 C 600.36,80.29 600.63,83.05 601.18,85.12 C 601.74,87.2 602.98,88.78 604.9,89.86 C 606.83,90.94 609.81,91.68 613.84,92.09 C 617.86,92.49 623.35,92.73 630.3,92.82 L 668.19,93.33 C 677.1,93.45 684.21,93.97 689.52,94.88 C 694.84,95.8 698.83,97.27 701.48,99.3 C 704.13,101.34 705.88,104.08 706.75,107.54 C 707.62,110.99 708.06,115.34 708.06,120.6 C 708.06,126.32 707.52,131.12 706.44,135 C 705.35,138.88 703.27,141.98 700.17,144.31 C 697.08,146.65 692.61,148.32 686.76,149.34 C 680.91,150.35 673.22,150.86 663.68,150.86 L 633.93,150.86 C 625.24,150.86 617.95,150.48 612.06,149.72 C 606.17,148.96 601.47,147.42 597.97,145.11 C 594.48,142.8 591.97,139.36 590.44,134.78 C 588.92,130.2 588.15,124.1 588.15,116.47 L 600.36,116.47 C 600.36,122.44 600.85,127.06 601.82,130.33 C 602.8,133.59 604.5,135.93 606.94,137.35 C 609.38,138.77 612.79,139.62 617.17,139.9 C 621.56,140.17 627.15,140.31 633.93,140.31 L 663.05,140.31 C 670.63,140.31 676.63,140.07 681.04,139.58 C 685.45,139.09 688.71,138.16 690.83,136.78 C 692.95,135.4 694.31,133.42 694.93,130.84 C 695.54,128.25 695.85,124.84 695.85,120.6 M 420.14,116.28 L 485.24,116.28 L 452.69,59.31 Z M 387.59,148.83 L 444.55,51.17 L 460.83,51.17 L 517.79,148.83 L 503.55,148.83 L 491.35,126.45 L 414.04,126.45 L 401.83,148.83 Z M 263.24,138.66 L 323.45,138.66 C 329.26,138.66 334.06,138.51 337.85,138.21 C 341.64,137.91 344.63,137.19 346.81,136.05 C 349,134.9 350.53,133.09 351.42,130.61 C 352.31,128.13 352.76,124.71 352.76,120.35 C 352.76,115.85 351.92,112.36 350.25,109.86 C 348.57,107.36 346.24,105.55 343.25,104.45 C 340.27,103.35 336.8,102.67 332.86,102.42 C 328.92,102.16 324.68,102.04 320.14,102.04 L 263.24,102.04 Z M 263.24,91.86 L 320.14,91.86 C 326.71,91.86 332.1,91.63 336.29,91.16 C 340.49,90.7 343.6,89.32 345.64,87.03 C 347.67,84.74 348.69,80.86 348.69,75.4 C 348.69,71.12 348.09,67.98 346.88,65.99 C 345.67,64 343.63,62.72 340.74,62.17 C 337.86,61.62 333.9,61.35 328.85,61.35 L 263.24,61.35 Z M 251.04,148.83 L 251.04,51.17 L 328.85,51.17 C 336.23,51.17 342.28,51.86 347.01,53.24 C 351.73,54.62 355.23,57.06 357.5,60.55 C 359.76,64.05 360.9,69 360.9,75.4 C 360.9,81.16 359.56,85.93 356.89,89.7 C 354.22,93.47 350.13,95.55 344.62,95.93 C 351.83,96.65 357.02,99.23 360.2,103.66 C 363.38,108.09 364.97,113.65 364.97,120.35 C 364.97,126.15 364.3,130.92 362.96,134.65 C 361.63,138.38 359.39,141.27 356.26,143.33 C 353.12,145.38 348.87,146.82 343.51,147.62 C 338.15,148.43 331.46,148.83 323.45,148.83 Z" stroke="currentColor" stroke-width="4.06" stroke-miterlimit="4"/></svg>';

  var inSub = /\/html\//.test(location.pathname);
  var assetBase = inSub ? '../' : '';
  var pageBase  = inSub ? '' : 'html/';
  var homeHref  = inSub ? '../BA_Solutions.html' : 'BA_Solutions.html';
  var year = new Date().getFullYear();
  var P = window.baPair || function(en){ return en; };

  document.write(`
<style>
@font-face{font-family:"Michroma";src:url("${assetBase}fonts/michroma-400.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap;}
#ba-footer{position:relative;z-index:999998;background:#000;border:0;
  padding:72px max(20px, calc(60 * var(--u, calc(min(100vw, 1440px) / 1440)))) 56px;display:flex;justify-content:space-between;align-items:flex-start;
  font-family:inherit;box-sizing:border-box;}
#ba-footer .logo-wrap{display:flex;width:fit-content;align-items:center;margin-bottom:28px;color:#F0EDE8;text-decoration:none;}
#ba-footer a:focus-visible{outline:1px solid currentColor;outline-offset:4px;}
#ba-footer .foot-addr a{color:inherit;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.2);transition:color .3s,border-color .3s;}
#ba-footer .foot-addr a:hover{color:#F0EDE8;border-color:rgba(240,237,232,.6);}
#ba-footer .logo-wrap svg{height:20px;width:auto;display:block;}
#ba-footer .foot-addr{font-size:11px;color:rgba(255,255,255,.35);line-height:1.5;letter-spacing:.04em;}
#ba-footer .foot-copy{font-size:10px;color:rgba(255,255,255,.2);letter-spacing:.04em;margin-top:24px;line-height:1.8;}
#ba-footer .flinks{display:flex;flex-direction:column;gap:12px;align-items:flex-end;}
#ba-footer .flinks a{font-family:"Michroma","Helvetica Neue",Helvetica,Arial,sans-serif;font-size:10.5px;letter-spacing:.08em;
  color:rgba(240,237,232,.45);text-decoration:none;transition:color .3s;white-space:nowrap;}
#ba-footer .flinks a:hover{color:#F0EDE8;}
#ba-footer.ba-footer-reveal-ready .ba-footer-reveal{opacity:0;transform:translateY(26px);}
#ba-footer.ba-footer-reveal-ready.is-revealed .ba-footer-reveal{opacity:1;transform:translateY(0);
  transition:opacity .72s cubic-bezier(.2,.7,.2,1),transform .72s cubic-bezier(.2,.7,.2,1);
  transition-delay:var(--ba-footer-delay, 0ms);}
#ba-footer.ba-footer-reveal-ready.is-revealed .flinks a.ba-footer-reveal{
  transition:color .3s,opacity .72s cubic-bezier(.2,.7,.2,1),transform .72s cubic-bezier(.2,.7,.2,1);
  transition-delay:0ms,var(--ba-footer-delay, 0ms),var(--ba-footer-delay, 0ms);}
@media (prefers-reduced-motion:reduce){
  #ba-footer.ba-footer-reveal-ready .ba-footer-reveal{opacity:1;transform:none;transition:none;}
}
</style>
<footer id="ba-footer">
  <div>
    <a class="logo-wrap" href="${homeHref}" aria-label="BA SOLUTIONS home" data-ko-aria-label="BA SOLUTIONS 홈">
      ${logoSvg.replace('role="img" aria-label="BA SOLUTIONS"','aria-hidden="true" focusable="false"')}
    </a>
    <div class="foot-addr">BA SOLUTIONS, Co., Ltd.<br>${P('56 Angol-ro, Bundang-gu<br>Seongnam-si, Gyeonggi-do<br>South Korea 13572', '경기도 성남시 분당구 안골로 56<br>(13572)')}<br><br>${P('Tel', '전화')}: +82-2-576-5295<br>${P('Fax', '팩스')}: +82-31-707-7943<br>${P('Email', '이메일')}: <a href="mailto:babystar@basolutions.co.kr">babystar@basolutions.co.kr</a></div>
    <div class="foot-copy">© 2004 ~ ${year} BA Solutions, Co., Ltd. All rights reserved.<br>${P('The Jammer is the strategic item and is under control of Korean government.', '재머는 전략물자로 대한민국 정부의 통제를 받습니다.')}</div>
  </div>
  <div class="flinks">
    <a href="${pageBase}ba_air.html">AIR POWER</a>
    <a href="${pageBase}ba_land.html">LAND POWER</a>
    <a href="${pageBase}ba_sea.html">SEA POWER</a>
    <a href="${pageBase}aegis.html">AEGIS</a>
    <a href="${pageBase}it-services.html">TECH</a>
    <a href="${pageBase}news.html" style="margin-top:36px;">NEWS</a>
    <a href="https://basolutions.co.kr">ABOUT US</a>
  </div>
</footer>
`);
})();

/* 푸터가 처음 화면에 들어올 때만 콘텐츠를 아래에서 순차적으로 노출한다.
   JS가 실행된 뒤에만 ready 클래스를 붙여, 스크립트 오류 시 푸터가 숨지 않게 한다. */
(function(){
  var footer=document.getElementById('ba-footer');
  if(!footer)return;
  var items=[
    footer.querySelector('.logo-wrap'),
    footer.querySelector('.foot-addr'),
    footer.querySelector('.foot-copy')
  ];
  var links=footer.querySelectorAll('.flinks a');
  for(var i=0;i<links.length;i++)items.push(links[i]);
  for(i=0;i<items.length;i++){
    if(!items[i])continue;
    items[i].classList.add('ba-footer-reveal');
    var delay=i<3?i*80:40+(i-3)*60;
    items[i].style.setProperty('--ba-footer-delay',delay+'ms');
  }
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  footer.classList.add('ba-footer-reveal-ready');
  if(reduce||!('IntersectionObserver' in window)){
    footer.classList.add('is-revealed');
    return;
  }
  var observer=new IntersectionObserver(function(entries){
    if(!entries[0].isIntersecting)return;
    footer.classList.add('is-revealed');
    observer.disconnect();
  },{threshold:.2});
  observer.observe(footer);
})();


/* ===================================================================
   스크롤바 숨김 + 섹션 인디케이터 (v9) — 메인(BA_Solutions)과 동일 사양
   각 페이지의 섹션(.sec-label / #hero / #brochure / footer)을 자동으로 읽어
   오른쪽 세로 라벨로 표시. 이미 자체 인디케이터(#sec-indicator)가 있는
   페이지(메인·도메인)는 가드로 건너뛰고, 스타일 충돌을 피하려 별도 id 사용.
   =================================================================== */
document.write('<style>'
+'html{scrollbar-width:none;-ms-overflow-style:none;}'
+'html::-webkit-scrollbar{width:0;height:0;display:none;}'
+'#ba-sec-ind{position:fixed;right:10px;top:50%;transform:translateY(-50%);overflow:hidden;z-index:999999;pointer-events:none;font-family:"Michroma","Helvetica Neue",Helvetica,Arial,sans-serif;}'
/* 히어로 구간에서는 숨김. 박스는 제자리에 두고 내용만 박스 폭 안에서 우→좌로 밀려 들어온다
   (화면 끝에서 오는 게 아니라 박스 범위 안에서만 이동 — overflow:hidden 이 잘라냄). */
+'#ba-sec-ind .ba-sec-box{display:flex;flex-direction:row;gap:2px;transform:translateX(100%);transition:transform .45s cubic-bezier(.2,.7,.2,1);}'
+'#ba-sec-ind.is-visible .ba-sec-box{transform:translateX(0);}'
+'#ba-sec-ind .ba-sec-word{writing-mode:vertical-rl;text-orientation:mixed;background:#f0ede8;padding:14px 5px 11px;font-size:10px;font-weight:400;color:#0a0a0c;letter-spacing:.3em;line-height:1;white-space:nowrap;}'
/* v12 슬롯 전환: 글자마다 칸(.ba-slot)을 만들어 릴처럼 돌린다. 라벨은 세로쓰기라 글자가 시계방향 90° 누워 있으므로,
   글자 기준 '아래로 내려감 / 위에서 내려옴' = 화면 기준 '왼쪽으로 빠짐 / 오른쪽에서 들어옴'(translateX).
   칸 높이(글자 진행 방향)는 JS가 이전 글자 → 새 글자 크기로 함께 보간하고, 칸 밖은 잘라낸다. */
+'.ba-slot{display:inline-block;position:relative;clip-path:inset(0);}'
+'.ba-slot-ph{visibility:hidden;}'
+'.ba-slot-out,.ba-slot-in{position:absolute;top:0;right:0;bottom:0;left:0;}'
+'.ba-slot-out{animation:baSlotOut .42s cubic-bezier(.55,0,.25,1) both;}'
+'.ba-slot-in{animation:baSlotIn .42s cubic-bezier(.2,.7,.2,1) both;}'
+'@keyframes baSlotOut{from{transform:translateX(0)}to{transform:translateX(-100%)}}'
+'@keyframes baSlotIn{from{transform:translateX(100%)}to{transform:translateX(0)}}'
+'</style>');
/* 인디케이터 라벨 슬롯 전환. box 안을 <div class="cls">to</div> 로 바꾸되, from 이 있으면
   글자 하나씩(위→아래 순서로 STEP 간격) 이전 글자가 (누운 글자 기준) 아래로 빠지고 새 글자가 위에서 내려온다
   — 화면으로는 왼쪽으로 빠지고 오른쪽에서 들어옴.
   글자마다 폭이 달라(P→I 등) 칸 높이를 이전 글자 크기에서 새 글자 크기로 같이 줄이거나 늘린다 —
   그래서 시작 프레임은 이전 단어, 끝 프레임은 새 단어와 크기가 같고 박스도 부드럽게 길이가 바뀐다.
   애니메이션이 끝나면 평문으로 되돌려 원래 자간·크기를 그대로 유지한다. */
window.baSlotRender=function(box,cls,from,to){
  var STEP=45,DUR=420;
  function plain(){box.innerHTML='<div class="'+cls+'">'+to+'</div>';}
  var tok=box._baSlotTok=(box._baSlotTok||0)+1;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!from||from===to||reduce){plain();return;}
  var n=Math.max(from.length,to.length),h='';
  for(var i=0;i<n;i++){
    var o=from.charAt(i),t=to.charAt(i),d='animation-delay:'+(i*STEP)+'ms';
    h+='<span class="ba-slot"><span class="ba-slot-ph">'+(o||t)+'</span>'
      +(o?'<span class="ba-slot-out" style="'+d+'">'+o+'</span>':'')
      +(t?'<span class="ba-slot-in" style="'+d+'">'+t+'</span>':'')+'</span>';
  }
  box.innerHTML='<div class="'+cls+'">'+h+'</div>';
  var cells=box.firstChild.children,sz=[];
  for(i=0;i<n;i++){
    var ph=cells[i].firstChild,o2=from.charAt(i),t2=to.charAt(i);
    ph.textContent=o2;var ho=o2?ph.getBoundingClientRect().height:0;
    ph.textContent=t2;var ht=t2?ph.getBoundingClientRect().height:0;
    ph.textContent=o2||t2;sz.push(ht);
    cells[i].style.height=ho+'px';
  }
  box.firstChild.getBoundingClientRect();
  for(i=0;i<n;i++){
    cells[i].style.transition='height '+DUR+'ms cubic-bezier(.2,.7,.2,1) '+(i*STEP)+'ms';
    cells[i].style.height=sz[i]+'px';
  }
  setTimeout(function(){if(box._baSlotTok===tok)plain();},(n-1)*STEP+DUR+30);
};
(function(){
  function shorten(t){
    t=(t||'').trim().toUpperCase();
    var map={'TECHNICAL SPECIFICATIONS':'SPECS','OTHER VARIANTS':'VARIANTS','WORLD-FIRST LIQUID COOLING':'COOLING','DOCUMENTATION':'DOCS','OVERVIEW':'OVERVIEW'};
    var base=t.split(/\s+[—-]\s+/)[0].trim();
    if(map[base])return map[base];
    if(map[t])return map[t];
    if(base.length>11&&base.indexOf(' ')>-1)base=base.split(' ')[0];
    return base;
  }
  function init(){
    if(document.getElementById('sec-indicator')||document.getElementById('ba-sec-ind'))return;
    /* 인디케이터를 원하지 않는 페이지는 <body data-no-sec-ind> 로 끈다 (aegis.html). */
    if(document.body&&document.body.hasAttribute('data-no-sec-ind'))return;
    var items=[];
    var hero=document.getElementById('hero');
    if(hero)items.push({el:hero,name:'TOP'});
    document.querySelectorAll('section.sec, section#brochure, [data-sec-label]').forEach(function(sec){
      if(sec.id==='brochure'){items.push({el:sec,name:'DOCS'});return;}
      /* 라벨 출처: data-sec-label 속성 우선, 없으면 화면에 보이는 .sec-label.
         .sec-label 은 눈에 보이는 요소라, 인디케이터에만 이름을 주고 싶은 섹션은
         data-sec-label 로 지정한다 (aegis.html 처럼 눈에 보이는 라벨이 없는 경우). */
      var attr=sec.getAttribute('data-sec-label');
      if(attr){items.push({el:sec,name:shorten(attr)});return;}
      var lbl=sec.querySelector('.sec-label');
      if(lbl)items.push({el:sec,name:shorten(lbl.textContent)});
    });
    var f=document.getElementById('ba-footer')||document.querySelector('footer');
    if(f)items.push({el:f,name:'CONTACT'});
    if(items.length<2)return;
    var ind=document.createElement('div');ind.id='ba-sec-ind';
    ind.innerHTML='<div class="ba-sec-box"></div>';
    document.body.appendChild(ind);
    var box=ind.firstChild,cur='';
    function render(n,prev){if(window.baSlotRender)window.baSlotRender(box,'ba-sec-word',prev,n);else box.innerHTML='<div class="ba-sec-word">'+n+'</div>';}
    /* 히어로 이름(TOP)은 라벨에 쓰지 않는다 — 히어로로 올라올 때 숨는 것과 동시에
       이름이 바뀌면 슬라이드아웃 0.45초 동안 바뀐 이름이 스쳐 보이기 때문.
       시작 시 첫 비히어로 항목 이름을 미리 그려 박스 폭을 확보해 둔다
       (라벨이 비면 폭이 0이라 translateX(100%) 도 0이 되어 안 움직임). */
    for(var fi=0;fi<items.length;fi++){ if(items[fi].el!==hero){cur=items[fi].name;render(cur);break;} }
    function update(){
      var cy=window.innerHeight/2,found=items[0];
      for(var i=0;i<items.length;i++){var r=items[i].el.getBoundingClientRect();
        if(r.top<=cy&&r.bottom>=cy){found=items[i];break;}
        if(r.top>cy)break;found=items[i];}
      var inHero = (hero && found.el===hero);
      if(inHero) ind.classList.remove('is-visible'); else ind.classList.add('is-visible');
      if(!inHero && found.name!==cur){var prev=cur;cur=found.name;render(cur,prev);}
    }
    var ly=-1;(function loop(){var y=window.scrollY||0;if(y!==ly){ly=y;update();}requestAnimationFrame(loop);})();
    window.addEventListener('resize',update);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
