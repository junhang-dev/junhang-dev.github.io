---
layout: ../../layouts/PostLayout.astro
category: Essay
title: 5년 차 엔지니어의 회고, 그리고 기록의 시작
title_en: A 5-Year Retrospective, and Why I Started Writing Here
subtitle: 정유·석유화학 플랜트 현장에서 디지털과 AI를 다루며 느낀 점과 앞으로의 공부 기록
subtitle_en: Reflections on building digital and AI systems inside oil and petrochemical plants, and notes for what comes next
date: "2026.10.28"
---

<div class="lang-ko" markdown="1">

## 5년 차가 되면서 든 생각

직장인으로 일한 지 어느덧 5년 차가 되었습니다.
그동안 국내 정유·석유화학 플랜트에서 현장의 문제를 데이터와 AI로 푸는 일을 해왔습니다. 공정 센서 데이터를 다뤄보기도 했고, 비파괴검사 영상 판독이나 설비 문서 탐색 시스템을 만들어 현업에 적용해 보기도 했습니다.

연차가 쌓이면서 가장 크게 느낀 점은, 우리가 당연하게 쓰는 디지털 서비스나 현장의 시스템 뒤에는 늘 수많은 기술적 선택(Trade-off)이 숨어 있다는 사실입니다.

## AI가 발전할수록 더 중요해지는 것

요즘은 AI가 코드도 짜주고 초안도 만들어 주는 시대입니다. 그러다 보니 문득 "내가 밑바닥의 개념과 시스템 구조를 일일이 공부할 필요가 있을까?" 하는 질문이 들 때도 있습니다.

하지만 현장에서 부딪히며 내린 결론은 반대였습니다.
AI라는 도구가 강력해질수록, 문제를 어떻게 정의할지, 어떤 구조를 선택할지, 결과가 맞는지 판단할 수 있는 **기본기**가 더 단단해야 그 도구를 제대로 쓸 수 있었습니다.

AI는 제 역할을 작은 범위로 가두는 대신, 제가 공부하고 이해한 만큼 역할을 넓혀주는 도구였습니다.

## 현장의 현실과 우리가 고민해야 할 문제들

최근 제조·플랜트 업계에서는 사족보행 로봇이나 자율비행 드론 같은 Physical AI에 관심이 많습니다. 겉으로 보면 당장이라도 무인화 공장(다크팩토리)이 완성될 것처럼 보입니다.

하지만 실제 현장을 들여다보면 아직 풀어야 할 현실적인 숙제가 많습니다.
- 정해진 경로를 돌고 온 드론·로봇에서 SD카드로 데이터를 뽑아 클라우드에 벌크로 올려두기만 하고 활용하지 못하는 경우
- 보안 규정상 GPS 사용이 제한되거나, 도크(Dock)에서 Wi-Fi로 데이터를 전송하는 것조차 보안성 검토와 망분리 장벽을 넘어야 하는 현실
- 수집된 데이터를 어떤 파이프라인으로 분석하고, 기존 업무 시스템과 어떻게 연결해 실제 가치를 만들 것인가에 대한 고민 부재

돈을 들여 외부 컨설팅으로 모든 인프라를 한 번에 갈아엎는 것이 가장 편해 보일지 몰라도, 현실의 조직은 그렇게 움직이지 않습니다. 오히려 **현장의 도메인 제약을 이해하면서 디지털 아키텍처를 설계할 수 있는 사람**이 해야 할 일이 여기에 있다고 생각합니다.

## 이 블로그에 기록할 것들

예전에도 GitHub에 `TIL` 저장소를 만들어 단편적인 개념을 정리하려다 멈춘 적이 있습니다.

그래서 이곳에는 조금 다른 방식으로 공부한 내용을 남기려 합니다.
1. **우리가 일상에서 쓰는 디지털 서비스들의 기술적 구조와 선택**
2. **플랜트·제조 현장에서 AI와 데이터 파이프라인을 실제로 작동하게 만드는 고민**

거창한 포장 없이, 꾸준히 배우고 고민한 흔적을 차곡차곡 기록해 보겠습니다.

</div>

<div class="lang-en" markdown="1">

## Entering Year Five

I recently entered my fifth year working as an engineer in the refining and petrochemical industry.
Over the past several years, my work has revolved around solving plant-floor problems with data and AI—ranging from real-time process yield optimization across a thousand sensors to computer vision for radiographic pipe inspection and retrieval systems for engineering contracts.

The biggest lesson from these years is simple: behind every digital service we take for granted—and every industrial system that actually survives in production—lies a chain of deliberate architectural trade-offs.

## What Matters More as AI Gets Stronger

In an era where AI can draft code and generate system outlines in seconds, it is easy to wonder whether studying foundational concepts and system internals still matters.

My experience on the ground pointed in the opposite direction.
The more capable AI tools become, the firmer your **fundamentals** need to be—so you can frame the right problem, choose a realistic architecture, and judge whether an output will hold up under real constraints.

Instead of narrowing my role, AI has expanded what a single engineer who understands both the domain and the digital stack can build.

## The Reality on the Plant Floor

Across manufacturing and process industries, Physical AI—quadruped robots and autonomous drones—has become a major focus. On the surface, fully autonomous "dark factories" look just around the corner.

Yet when you look closely at actual plant operations, very practical hurdles remain:
- Drones and robots complete their rounds, only for someone to manually pull an SD card, upload bulk video files to storage, and leave them unused—or manually screenshot frames for reports.
- Strict security rules restrict GPS usage, and even transferring data over Wi-Fi from a docking station requires clearing IT/OT network segregation and security reviews.
- Above all, there is often a missing link between raw sensor capture, automated analysis, and the legacy maintenance systems (such as SAP PM) where real work happens.

Bringing in external consultants to replace everything from scratch sounds appealing in theory, but real organizations rarely work that way. That gap is precisely where engineers who understand both plant constraints and modern software architecture can make a difference.

## What I Will Document Here

I once started a `TIL` repository on GitHub to jot down isolated technical terms, only to stop a few months later.

Here, I want to take a more enduring approach:
1. **Unpacking the technical architecture and trade-offs behind everyday digital services**
2. **Sharing practical engineering notes on making AI and data pipelines work in industrial plants**

No grand slogans—just a steady record of learning and building.

</div>
