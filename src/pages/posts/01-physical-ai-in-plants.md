---
layout: ../../layouts/PostLayout.astro
lang: ko
slug: 01-physical-ai-in-plants
alt: /en/posts/01-physical-ai-in-plants/
category: Industrial AI
title: "제조·플랜트 현장의 Physical AI, 실제로는 어디까지 와 있을까?"
subtitle: "시연 영상 너머, 로봇이 찍은 데이터가 플랜트 보안망을 거쳐 실제 설비 점검 업무로 이어지기까지의 구조"
date: "2026.10.28"
---

## 도입: 로봇이 계단을 오르는 영상 너머의 질문

정유·석유화학 플랜트에서 공정 센서 분석이나 비파괴검사(RT) 영상 판독 과제를 현업에 적용하며 가장 크게 배운 점이 있습니다. 모델을 만드는 일보다 훨씬 많은 시간과 에너지를 쓰게 되는 곳은 따로 있다는 사실입니다.

데이터가 현장의 폐쇄적인 보안망을 통과하게 만드는 일, 수시로 바뀌는 현장 환경 속에서 오탐(False Positive)을 줄여 운전원과 정비 엔지니어가 시스템을 신뢰하게 만드는 일, 그리고 분석 결과를 기존 기간계(SAP 등) 화면 안으로 자연스럽게 밀어 넣는 일입니다. 이 연결고리가 빠지면 아무리 좋은 모델도 몇 달 뒤 현업에서 쓰이지 않게 됩니다.

요즘 현장에서도 사족보행 로봇이나 자율비행 드론 같은 Physical AI 도입 논의가 활발합니다. 로봇이 철제 계단을 오르고 카메라로 게이지를 비추는 시연 영상은 인상적이지만, 현업 엔지니어 입장에서 진짜 궁금한 건 그다음입니다.

- 로봇이 순찰하며 찍은 수십 GB의 영상은 망분리된 공장 안에서 어디로, 어떻게 전송될까?
- 배관 주변의 수증기(Steam)나 햇빛 반사로 생기는 수많은 열화상 오탐은 어디서 걸러낼까?
- 판독 결과가 설비 관리 시스템의 보수 작업요청으로 이어지지 않으면 결국 사람이 SD카드를 뽑아 영상을 돌려보는 '비싼 사진첩'이 될 텐데, 먼저 도입한 기업들은 이 구조를 어떻게 짰을까?

이 질문들의 답을 찾기 위해, 실제 LNG·정유 플랜트에 사족보행 로봇 Spot을 상시 운영 중인 호주 **Woodside Energy**(Pluto LNG 플랜트)와 **BP**(미국 Whiting 정유공장) 사례, 그리고 이를 뒷받침하는 **Boston Dynamics의 산업용 데이터 아키텍처**(Orbit · Site Hub)를 공식 기술 문서 기반으로 파헤쳐 봤습니다.

<figure>
  <img src="https://bostondynamics.com/wp-content/uploads/2023/04/woodside2-1024x683.jpg" alt="Woodside LNG 플랜트 현장을 순찰 중인 Boston Dynamics Spot 로봇" loading="lazy" />
  <figcaption>Figure 1. 호주 Woodside Energy의 Pluto LNG 플랜트에서 자율 점검 경로를 주행 중인 Spot (출처: <a href="https://bostondynamics.com/case-studies/woodside/" target="_blank" rel="noopener">Boston Dynamics Case Study — Woodside Energy</a>)</figcaption>
</figure>

---

## 1. 실시간 클라우드 스트리밍 대신 '도크 동기화'와 'Site Hub'를 택한 이유

외부 제안서에서 흔히 보는 이상적인 그림은 로봇이 공장을 걸어 다니며 4K 영상과 열화상 데이터를 실시간으로 퍼블릭 클라우드에 쏘고, 클라우드 AI가 즉시 알람을 띄우는 구조입니다. 하지만 실제 플랜트 현장에서 이 구조는 작동하기 어렵습니다.

파이프랙(Pipe rack)과 철골 구조물이 빽빽해 무선 음영 구역이 많을 뿐 아니라, 보안 규정상 현장 설비 영상과 좌표를 외부 클라우드로 직접 내보내는 것이 엄격히 제한되기 때문입니다.

Boston Dynamics의 공식 배포 아키텍처를 보면, 이 현실적인 제약을 인정하고 **로봇 로컬 버퍼링 + 충전 도크 동기화 + 공장 내부 전용 서버**(`Site Hub`)라는 구조를 표준으로 가져가고 있습니다.

<figure>
  <img src="/images/spot-sitehub-pipeline.svg" alt="플랜트 로봇 데이터 파이프라인 한눈에 보기" />
  <figcaption>Figure 2. Boston Dynamics 공식 기술 문서(Orbit &amp; Site Hub Deployment)를 바탕으로 재구성한 사내 데이터 흐름</figcaption>
</figure>

핵심은 데이터를 실시간으로 다 쏘려 하지 않는다는 점입니다.
1. **순찰 중에는 로봇 내부에 저장:** Spot은 사전 정의된 경로(Autowalk)를 돌며 지정된 점검 지점에서만 열화상·음향·광학 이미지를 찍어 로봇 내부 스토리지에 담아둡니다.
2. **Spot Dock 복귀 후 일괄 전송:** 순찰을 마치고 충전 도크에 복귀하면, 사내 인가된 무선망을 통해 해당 회차(Mission)의 데이터를 묶어서 전송합니다. 사람이 SD카드를 뽑아 나르던 일을 '도킹 순간의 자동 배치 동기화'로 바꾼 것입니다.
3. **퍼블릭 클라우드 대신 온프레미스 `Site Hub`:** 관제 및 데이터 수집 소프트웨어인 **Orbit**을 외부 클라우드가 아닌 공장 방화벽 내부의 전용 서버 어플라이언스(**Site Hub**)에 설치해 운영합니다. 원본 데이터가 공장 밖으로 나가지 않으면서도 사내망 브라우저에서 전체 순찰 결과를 관리할 수 있습니다.

---

## 2. 현업이 알람을 끄지 않게 만드는 법: 설비 태그 매핑과 오탐 필터링

데이터가 사내 서버(`Site Hub`)까지 자동으로 들어왔더라도, 여기서부터가 진짜 엔지니어링의 영역입니다. 현장에 알람 시스템을 넣어보면 가장 무서운 적은 '탐지 누락' 못지않게 **잦은 오탐으로 인한 현업의 알람 피로도**이기 때문입니다.

플랜트 야외 설비는 낮 시간대 태양광 반사나 주변 스팀 배관의 수증기, 비바람 때문에 단순 열화상 온도 임계값(예: 80°C 초과 시 알람)만 걸어두면 하루에도 수십 건씩 거짓 알람이 울립니다. 이런 일이 일주일만 반복되면 정비팀은 아예 알람 수신을 꺼버립니다.

<figure>
  <img src="/images/alarm-threshold-concept.svg" alt="단순 온도 임계값과 문맥 기반 필터 임계값 비교 개념도" />
  <figcaption>Figure 3. 현장 노이즈로 인한 오탐을 줄이기 위해 단순 온도치가 아닌 설비별 과거 이력 편차와 신뢰도 기준을 함께 적용하는 구조</figcaption>
</figure>

선두 도입 사례들이 '비싼 사진첩'과 '알람 피로도'를 피하기 위해 설계한 장치는 크게 두 가지입니다.

### ① 공간 좌표가 아니라 '설비 ID(Asset Tag)'와 과거 이력에 매핑
정비 엔지니어에게는 "위도·경도 몇 도에서 찍은 사진"보다 **이 사진이 몇 번 펌프(`PUMP-104B`)의 어느 베어링인가**가 중요합니다.
그래서 경로를 설정할 때 각 촬영 포인트를 설비 마스터의 기능 위치(Functional Location)에 1:1로 묶어둡니다. 이렇게 하면 오늘 찍은 열화상 온도를 절대 수치로만 보지 않고, **같은 설비의 지난 30일간 온도 추이**와 비교해 실제 이상 징후인지 걸러낼 수 있습니다.

<figure>
  <img src="https://bostondynamics.com/wp-content/uploads/2023/07/acoustic-data-scout.jpg" alt="Orbit 화면에서의 설비 열화상 및 음향 추이 비교" loading="lazy" />
  <figcaption>Figure 4. 동일 설비 태그에 누적된 열화상·음향 측정값 추이를 비교해 이상 여부를 판별하는 화면 (출처: <a href="https://bostondynamics.com/products/orbit/" target="_blank" rel="noopener">Boston Dynamics Orbit</a>)</figcaption>
</figure>

### ② 원본 영상은 내부에 두고, 기간계로는 가벼운 JSON과 스냅샷 링크만 전달
아날로그 게이지 숫자를 읽거나(OCR) 이상 여부를 판별하는 모델은 `Site Hub` 내부의 컨테이너(**Spot Extensions**)에서 돌아갑니다.
그리고 임계값을 넘은 이상 징후가 확인되었을 때만 **Orbit REST API 및 Webhook**을 통해 설비 관리 시스템(SAP PM 등)이나 디지털 트윈(Woodside의 **FUSE**)으로 아래처럼 가벼운 JSON 메타데이터를 보냅니다.

```json
{
  "mission_id": "CDU2-MORNING-ROUND",
  "captured_at": "2026-10-28T06:15:22Z",
  "asset_tag": "FLOC-CDU2-PUMP-104B",
  "inspection_type": "THERMAL_ROI",
  "measured_value_c": 91.4,
  "baseline_30d_avg_c": 68.2,
  "status": "ALERT",
  "evidence_url": "https://sitehub.internal.plant/api/v0/images/9f82a1.jpg"
}
```

기간계 데이터베이스에 무거운 영상을 넣지 않고도, 담당 엔지니어가 사내 작업요청 화면에서 `evidence_url` 링크만 눌러 현장 스냅샷을 1초 만에 확인하고 보수 작업지시(Work Order) 여부를 결정할 수 있게 만든 것입니다.

---

## 3. 로봇과 드론이 늘어날 때의 다음 숙제: Shell 라인란트 정유공장

사족보행 로봇 한두 대를 넘어 바퀴형 방폭 로봇과 자율비행 드론까지 현장에 섞이기 시작하면 또 다른 문제가 생깁니다. **장비 제조사마다 관제 화면도 다르고 데이터 규격도 제각각**이라는 점입니다. 정유공장 운전원에게 로봇 A용 화면, 드론 B용 화면을 따로 보라고 할 수는 없습니다.

독일 최대 정유단지 중 하나인 **Shell Energy and Chemicals Park Rheinland**는 이 문제를 풀기 위해 하드웨어에 종속되지 않는 통합 미들웨어(**Korial**, 구 Energy Robotics)를 중간 계층으로 두었습니다. 지상에서는 방폭(ATEX) 로봇이 게이지와 가스 누출을 점검하고 상공에서는 드론이 고소 설비를 촬영하되, 각 장비가 도크로 복귀해 올린 데이터는 단일 파이프라인에서 표준화되어 중앙 관제실과 설비 시스템으로 들어가도록 묶어낸 것입니다.

---

## 마치며: 하드웨어 도입 이후를 결정하는 세 가지 질문

글로벌 플랜트들의 실제 적용 구조를 뜯어보며 다시금 확인하게 되는 건, 현장의 변화를 만드는 건 로봇 하드웨어 자체가 아니라 **그 뒤를 받치는 데이터 파이프라인**이라는 점입니다.

우리 현장에 드론과 로봇을 도입하고 확산할 때도, 장비 스펙 검토와 함께 아래 세 가지 질문에 대한 설계가 먼저 이루어져야 합니다.

1. **전송과 보안:** 실시간 스트리밍이라는 환상을 덜어내고, 도크(Dock) 복귀 시점의 데이터를 사내 보안망 내부 서버로 어떻게 안전하고 자동화되게 동기화할 것인가?
2. **문맥과 오탐 통제:** 촬영된 영상을 설비 마스터 ID(Tag)와 어떻게 매핑하고, 현장 노이즈로 인한 오탐을 걸러내어 현업의 신뢰를 지킬 것인가?
3. **업무 연결:** 분석 결과를 별도의 고립된 대시보드에 가두지 않고, 엔지니어가 매일 쓰는 기존 설비 관리 시스템의 작업 흐름 안으로 어떻게 밀어 넣을 것인가?

결국 현장의 도메인 제약을 이해하면서 이 파이프라인의 빈칸을 메우는 일이, 앞으로 플랜트 현장에서 엔지니어가 풀어야 할 가장 실질적인 과제라고 생각합니다.

---

### 참고 자료 및 출처
- [Boston Dynamics Support — Orbit Architecture & Site Hub Deployment](https://support.bostondynamics.com/)
- [Boston Dynamics Case Study — Woodside Energy: Deploying Spot for Autonomous LNG Inspection](https://bostondynamics.com/case-studies/woodside/)
- [Boston Dynamics Product Overview — Orbit Fleet Management & Data Pipeline](https://bostondynamics.com/products/orbit/)
- [Offshore Technology — How BP Tested Boston Dynamics' Spot at Whiting Refinery and Mad Dog](https://www.offshore-technology.com/)
- [Korial (formerly Energy Robotics) — Shell Rheinland Refinery Mixed Fleet Inspection](https://www.energy-robotics.com/)
