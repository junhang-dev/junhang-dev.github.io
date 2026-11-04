// 새 글을 추가할 때: 이 목록(최신순)에 항목을 넣고,
// src/pages/posts/<slug>.md (한국어)와 src/pages/en/posts/<slug>.md (영어)를 만듭니다.
export const posts = [
  {
    slug: '04-beyond-msa-modular-monolith',
    category: 'Architecture',
    date: '2026.11.04',
    ko: {
      title: "아마존과 구글은 왜 다시 '모놀리스'를 이야기할까?",
      summary:
        '왜 우리는 MSA로 쪼갰고, 왜 다시 합치고 있는가? (Prime Video 사례와 내 플랫폼 설계의 고민)',
    },
    en: {
      title: 'Why Are Amazon and Google Talking About Monoliths Again?',
      summary:
        'Why We Split into Microservices, Why We Are Merging Back, and Lessons for My Own Platform',
    },
  },
  {
    slug: '03-merchant-prep-jitter',
    category: 'Architecture',
    date: '2026.11.02',
    ko: {
      title: '사장님이 [60분]을 눌렀을 때, 알고리즘은 사장님을 얼마나 믿을까?',
      summary:
        '배달 ETA 2부: 휴먼 인 더 루프(HITL), 매장 편향 보정, 그리고 배차 지터(Jitter) 최적화',
    },
    en: {
      title: 'When the Merchant Taps [60 min], How Much Does the Algorithm Actually Trust Them?',
      summary:
        'Delivery ETA Part 2: Human-in-the-loop (HITL), Merchant Bias Calibration, and Dispatch Jitter Optimization',
    },
  },
  {
    slug: '02-baemin-eta-60min',
    category: 'Architecture',
    date: '2026.10.29',
    ko: {
      title: '비 오는 금요일 저녁, 배민은 왜 60분을 띄웠을까?',
      summary:
        '배달 시간 뒤에서 작동하는 Feature Store 이원화와 데이터 드리프트(Data Drift)',
    },
    en: {
      title: 'Why Did the Food Delivery App Show 60 Minutes on a Rainy Friday?',
      summary:
        'Dual Feature Stores, Data Drift, and Quantile Regression Behind Food Delivery ETA',
    },
  },
  {
    slug: '01-physical-ai-in-plants',
    category: 'Industrial AI',
    date: '2026.10.28',
    ko: {
      title: '제조·플랜트 현장의 Physical AI, 실제로는 어디까지 와 있을까?',
      summary:
        '시연 영상 너머, 로봇이 찍은 데이터가 플랜트 보안망을 거쳐 실제 설비 점검 업무로 이어지기까지의 구조',
    },
    en: {
      title: 'Where Does Physical AI Actually Stand in Industrial Plants?',
      summary:
        'Beyond demo videos — how field robot telemetry crosses plant security boundaries to trigger real maintenance workflows',
    },
  },
  {
    slug: '00-prologue',
    category: 'Essay',
    date: '2026.10.28',
    ko: {
      title: '5년 차 엔지니어의 회고, 그리고 기록의 시작',
      summary: '정유·석유화학 플랜트 현장에서 디지털과 AI를 다루며 느낀 점과 앞으로의 공부 기록',
    },
    en: {
      title: 'A 5-Year Retrospective, and Why I Started Writing Here',
      summary:
        'Reflections on building digital and AI systems inside oil and petrochemical plants, and notes for what comes next',
    },
  },
];

export type Lang = 'ko' | 'en';

export const ui = {
  ko: {
    articles: '아티클',
    allArticles: '전체 아티클',
    tagline: '디지털 서비스의 구조와 산업 현장의 AI 엔지니어링을 공부하고 기록합니다.',
    author: '이준행',
    toc: '목차',
    copy: '🔗 아티클 링크 복사',
    copied: '✓ 링크가 복사되었습니다',
    aboutName: '이준행 (Junhang Lee)',
    aboutBio:
      '기계공학과 정유·석유화학 플랜트 현장 경험을 바탕으로 공정·설비 문제를 데이터와 AI로 해결합니다. 수율 최적화와 공정 이상탐지 프로젝트를 리드·개발하고, 데이터 기반 분석을 현업에 적용해 왔습니다. RAG 기반 설비투자 검색 에이전트를 구현하고, RT 필름 판독 자동화와 드론 검사 플랫폼도 개발·개선하고 있습니다. Seeq 플랫폼 운영과 데이터 연계, 대시보드·웹 화면 개발까지 맡아 분석 결과가 실제 업무 흐름에 연결되도록 합니다.',
    siteDescription: '이준행의 기술 블로그 — 디지털 서비스 구조와 산업 현장의 AI 엔지니어링',
  },
  en: {
    articles: 'Articles',
    allArticles: 'All Articles',
    tagline: 'Engineering notes on digital service architectures and production AI in industrial plants.',
    author: 'Junhang Lee',
    toc: 'On this page',
    copy: '🔗 Copy Article Link',
    copied: '✓ Link Copied!',
    aboutName: 'Junhang Lee',
    aboutBio:
      'With a mechanical engineering background and hands-on experience in refinery and petrochemical operations, I apply data and AI to process and equipment challenges. I have led projects in process yield optimization and process anomaly detection, bringing data-driven analysis into plant operations. I also built a RAG-based agent for equipment-investment search and continue to develop RT film inspection automation and a drone-inspection platform. Alongside project work, I manage the Seeq analytics platform, integrate data, and build dashboards and web interfaces that connect analysis to operational workflows.',
    siteDescription: "Junhang Lee's engineering blog — digital service architectures and production AI in industrial plants",
  },
} as const;
