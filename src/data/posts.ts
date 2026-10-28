// 새 글을 추가할 때: 이 목록(최신순)에 항목을 넣고,
// src/pages/posts/<slug>.md (한국어)와 src/pages/en/posts/<slug>.md (영어)를 만듭니다.
export const posts = [
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
    aboutBio: '정유·석유화학 플랜트 현장의 도메인과 디지털·AI 엔지니어링을 연결하는 일을 하고 있습니다.',
    aboutNotice: '상세 포트폴리오 및 이력 소개는 업데이트 예정입니다.',
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
    aboutBio: 'Bridging industrial plant domain engineering with production AI and data architectures.',
    aboutNotice: 'Detailed portfolio and experience will be updated soon.',
    siteDescription: "Junhang Lee's engineering blog — digital service architectures and production AI in industrial plants",
  },
} as const;
