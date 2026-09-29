/* BA SOLUTIONS 뉴스 데이터 — 단일 원본 (2026-09-29)
   대문(BA_Solutions.html, 앞 3건)과 뉴스 목록(html/news.html, 전체)이 함께 읽는다.
   뉴스를 추가·수정할 때는 이 파일만 고친다. 최신 항목이 맨 앞.
   - date: 'YYYY-MM-DD'. 표시 형식(2026.07.29 / 2026 / 07 / 29)은 각 페이지가 바꾼다.
   - href: html/ 폴더 기준 파일명. 대문은 'html/'을 앞에 붙여 쓴다. 상세 페이지가 없으면 생략.
   - ko: 한국어 제목(선택). data-i18n 페이지는 baPair 로 병기, 번역 전 페이지는 영어만 쓴다.
   - image: 외부 절대 URL. 로컬 이미지를 쓸 경우 경로 기준이 페이지마다 다르므로 주의. */
window.BA_NEWS = [
  {
    tag: 'ANNOUNCEMENT',
    title: 'ROK Army Drone Combat Challenge 2026',
    ko: '2026 대한민국 드론 공방전 본선 진출',
    date: '2026-07-29',
    excerpt: 'We advance to the finals in the ROK Army Drone Combat Challenge.',
    image: 'https://jamkor.co.kr/wp-content/uploads/2023/06/105038_105891_415.png',
    href: 'news-drone-combat-challenge.html'
  },
  {
    tag: 'DEPLOYMENT',
    title: 'ROK Police SOU (Special Operation Unit) Drone Defense System',
    ko: '경찰특공대(SOU) 드론 방어 체계',
    date: '2025-11-10',
    excerpt: 'Since 2024, we have been supplying our cutting-edge vehicle-mounted drone defense systems.',
    image: 'https://jamkor.co.kr/wp-content/uploads/2025/11/SOU-logo.png'
  },
  {
    tag: 'ANNOUNCEMENT',
    title: 'Supply of RCIED vehicle jammers to U.N',
    ko: 'UN에 차량용 RCIED 재머 공급',
    date: '2023-06-29',
    excerpt: 'Successful completion of the 2nd project: advancing RCIED jammer supply.',
    image: 'https://jamkor.co.kr/wp-content/uploads/2023/06/20220324_1526231.jpg'
  },
  {
    tag: 'MEDIA',
    title: 'Anti-drone technology for public safety purposes \u2013 KBS news',
    ko: '공공 안전을 위한 안티드론 기술 — KBS 뉴스',
    date: '2020-08-16',
    excerpt: 'In order to protect major facilities such as nuclear power plants from drone threats.',
    image: 'https://jamkor.co.kr/wp-content/uploads/2017/04/A004S.png'
  },
  {
    tag: 'PRODUCT',
    title: 'New Product Announce [DTMF signal generator]',
    ko: '신제품 출시 [DTMF 신호 발생기]',
    date: '2020-03-19',
    excerpt: 'Successful testing of our innovative vehicle-based platform system.',
    image: 'https://jamkor.co.kr/wp-content/uploads/2020/03/DT0021.png'
  },
  {
    tag: 'DEMO',
    title: 'Incheon International Airport Drone Sniper Demo',
    ko: '인천국제공항 드론 스나이퍼 시연',
    date: '2018-12-07',
    excerpt: 'Drone sniper was demonstrated at Incheon International Airport.',
    image: 'https://jamkor.co.kr/wp-content/uploads/2018/12/INCHEON01.jpg'
  },
  {
    tag: 'PRODUCT',
    title: 'Portable Drone Jammer (Drone Sniper) Intro',
    ko: '휴대형 드론 재머(드론 스나이퍼) 소개',
    date: '2018-07-26',
    excerpt: 'Introducing our portable drone jammer, the Drone Sniper.',
    image: 'https://jamkor.co.kr/wp-content/uploads/2014/08/B005s.jpg'
  },
  {
    tag: 'DEMO',
    title: 'Drone Sniper Demo in France',
    ko: '프랑스 드론 스나이퍼 시연',
    date: '2018-07-26',
    excerpt: 'A demonstration of our partners in France.',
    image: 'https://jamkor.co.kr/wp-content/uploads/2018/07/DS0011.jpg'
  },
  {
    tag: 'TEST',
    title: 'Cooling performance test at 60 degrees Celsius high temperature',
    ko: '섭씨 60도 고온 냉각 성능 시험',
    date: '2017-05-02',
    excerpt: 'Extreme high-temperature cooling performance test of our jammer system.',
    image: 'https://jamkor.co.kr/wp-content/uploads/2014/08/C002.png'
  },
  {
    tag: 'EXHIBITION',
    title: 'IDEX 2017 Review',
    ko: 'IDEX 2017 참가 후기',
    date: '2017-04-14',
    excerpt: 'We participated in IDEX 2017 held in Abu Dhabi.',
    image: 'https://jamkor.co.kr/wp-content/uploads/2017/04/S_DSC01780.jpg'
  },
  {
    tag: 'EXHIBITION',
    title: 'AEGIS Jammers in Korea Defense Technology Exhibition 2014',
    ko: '2014 국방기술 전시회에 선보인 AEGIS 재머',
    date: '2014-08-06',
    excerpt: 'AEGIS Jammers of BA Solutions shown at the Korea Defense Technology Exhibition 2014.',
    image: 'https://jamkor.co.kr/wp-content/uploads/2014/08/kdtf-banner_2-269x200.jpg'
  },
];
