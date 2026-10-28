---
layout: ../../layouts/PostLayout.astro
category: Industrial AI
title: 제조·플랜트 현장의 Physical AI, 실제로는 어디까지 와 있을까?
subtitle: 시연 영상 너머, 로봇이 찍은 데이터가 플랜트 보안망을 거쳐 실제 설비 점검 업무로 이어지기까지의 구조
date: "2026.10.28"
---

 사족보행 로봇이 철제 계단을 오르고, 카메라를 돌려 압력 게이지와 배관 온도를 확인하는 영상은 이제 꽤 익숙합니다. 하지만 플랜트 현장에서 데이터와 시스템을 다루는 입장에서는 시연 영상을 볼 때 조금 다른 질문이 먼저 떠오릅니다.

- 로봇이 순찰하며 찍은 수십 GB의 영상과 센서 데이터는 망분리된 공장 안에서 어디로 전송될까?
- 수증기나 햇빛 반사로 생기는 수많은 열화상 오탐은 어디서 걸러낼까?
- 판독 결과가 기존 설비 관리 시스템(SAP 등)의 작업요청서로 이어지지 않으면 결국 '비싼 사진첩'으로 남을 텐데, 실제 도입 기업들은 이 연결고리를 어떻게 풀었을까?

이 질문들의 답을 찾기 위해, 정유·가스 플랜트 현장에 사족보행 로봇 Spot을 실제 운영 중인 호주 **Woodside Energy**(Pluto LNG 플랜트)와 **BP**(미국 Whiting 정유공장) 사례, 그리고 이를 뒷받침하는 **Boston Dynamics의 산업용 데이터 아키텍처**(Orbit · Site Hub)를 공식 기술 문서 기반으로 살펴봤습니다.

<figure>
  <img src="https://bostondynamics.com/wp-content/uploads/2023/04/woodside2-1024x683.jpg" alt="Woodside LNG 플랜트 현장을 순찰 중인 Boston Dynamics Spot 로봇" loading="lazy" />
  <figcaption>호주 Woodside Energy의 Pluto LNG 플랜트에서 자율 점검 경로를 주행 중인 Spot (출처: <a href="https://bostondynamics.com/case-studies/woodside/" target="_blank" rel="noopener">Boston Dynamics Case Study — Woodside Energy</a>)</figcaption>
</figure>

---

## 1. 왜 실시간 클라우드 스트리밍 대신 '도크 동기화'와 'Site Hub'를 쓸까

외부에서 흔히 상상하는 그림은 로봇이 공장을 걸어 다니며 4K 영상과 열화상 데이터를 실시간으로 퍼블릭 클라우드에 쏘고, 클라우드 AI가 즉시 이상 알람을 띄우는 구조입니다. 하지만 실제 정유·석유화학 플랜트에서 이 방식은 두 가지 장벽에 부딪힙니다.

1. **음영 구역과 무선 대역폭 한계:** 파이프랙(Pipe rack)과 철골 구조물이 빽빽한 구역에서는 무선 신호가 끊기기 쉽고, 고해상도 영상을 상시 스트리밍하기 어렵습니다.
2. **데이터 반출 보안과 망분리:** 국가 중요 시설이거나 보안 등급이 높은 플랜트에서는 현장 설비 영상과 도면 좌표를 외부 클라우드(AWS 등)로 직접 내보내는 것이 엄격히 제한됩니다.

Boston Dynamics의 공식 아키텍처 문서를 보면 이 문제를 풀기 위해 **로봇 로컬 버퍼링 + 충전 도크 동기화 + 공장 내부 전용 서버**(`Site Hub`)라는 구조를 택하고 있습니다.

<figure>
  <img src="/images/spot-sitehub-pipeline.svg" alt="Spot에서 Site Hub를 거쳐 기간계로 이어지는 데이터 파이프라인" />
  <figcaption>Boston Dynamics 공식 기술 문서(Orbit &amp; Site Hub Deployment)를 바탕으로 정리한 플랜트 내부 데이터 흐름</figcaption>
</figure>

작동 방식은 생각보다 현실적입니다.
- **순찰 중에는 로봇 내부에 저장:** Spot은 사전 정의된 경로(Autowalk)를 돌며 지정된 점검 지점에서만 열화상·음향·광학 이미지를 찍어 로봇 로컬 스토리지에 담아둡니다.
- **Spot Dock 복귀 후 일괄 전송:** 순찰을 마치고 충전 도크에 복귀하면, 사내 인가된 무선망을 통해 해당 회차(Mission)의 데이터를 묶어서 전송합니다. SD카드를 사람이 직접 뽑아 나르던 수작업을 '도킹 순간의 배치 전송'으로 대체한 셈입니다.
- **클라우드 대신 사내 `Site Hub` 어플라이언스:** 관제 및 데이터 수집 소프트웨어인 **Orbit**을 퍼블릭 클라우드가 아닌 공장 방화벽 내부의 전용 서버 장비(**Site Hub**)나 사내 VM에 직접 설치해 운영합니다. 데이터가 공장 밖으로 나가지 않아도 사내 웹 브라우저에서 전체 순찰 결과를 조회할 수 있는 구조입니다.

---

## 2. '비싼 사진첩'을 면하기 위한 두 가지 처리: 설비 태그 매핑과 컨테이너 분석

데이터가 사내 서버(`Site Hub`)까지 들어왔더라도, 그냥 영상 파일로만 쌓인다면 사람이 일일이 돌려보며 캡처해야 하는 상황과 크게 다르지 않습니다. 이를 실제 설비 점검 데이터로 바꾸기 위해 두 가지 계층이 들어갑니다.

<figure>
  <img src="https://bostondynamics.com/wp-content/uploads/2023/07/acoustic-data-scout.jpg" alt="Orbit 화면에서의 설비 열화상 및 음향 이상 판독" loading="lazy" />
  <figcaption>점검 지점별로 수집된 열화상·음향 데이터를 이전 이력과 비교하는 화면 (출처: <a href="https://bostondynamics.com/products/orbit/" target="_blank" rel="noopener">Boston Dynamics Orbit</a>)</figcaption>
</figure>

### ① 공간 좌표가 아니라 '설비 ID(Asset Tag)' 중심의 저장
플랜트 정비팀에게는 "위도·경도 몇 도에서 찍은 사진"이라는 정보보다 **이 사진이 몇 번 펌프의 어느 베어링인가**가 중요합니다.
그래서 경로를 최초 설정할 때 각 촬영 액션(Action)에 설비 마스터의 기능 위치(Functional Location)나 설비 ID를 미리 매핑해 둡니다. Woodside Energy의 경우 이렇게 들어온 로봇 데이터를 자체 디지털 트윈 플랫폼인 **FUSE**의 설비 객체에 자동으로 연결해, 운전원과 엔지니어가 현장 이동에 쓰던 시간(건당 최대 90분)을 줄였다고 밝히고 있습니다.

### ② `Spot Extensions`를 통한 사내 분석과 웹훅(Webhook) 전달
아날로그 게이지 숫자를 읽거나(OCR) 베어링 과열 여부를 판단하는 AI 모델은 외부 클라우드를 부르지 않고, `Site Hub` 내부에서 도커 컨테이너 형태의 **Spot Extensions**로 구동됩니다.

분석이 끝난 뒤 기간계(SAP PM, Maximo 등)로 데이터를 넘길 때도 수 기가바이트짜리 원본 영상을 그대로 넘기지 않습니다. 원본 미디어는 `Site Hub` 스토리지에 두고, 이상 징후가 임계값을 넘었을 때만 **Orbit REST API 및 Webhook**을 통해 가벼운 JSON 메타데이터와 스냅샷 확인용 내부 URL만 설비 시스템으로 호출합니다.

```json
{
  "mission_id": "CDU2-MORNING-ROUND",
  "captured_at": "2026-10-28T06:15:22Z",
  "asset_tag": "FLOC-CDU2-PUMP-104B",
  "inspection_type": "THERMAL_ROI",
  "measured_value_c": 91.4,
  "threshold_c": 80.0,
  "status": "ALERT",
  "evidence_url": "https://sitehub.internal.plant/api/v0/images/9f82a1.jpg"
}
```

이 페이로드를 받은 사내 시스템이 보수 알림(Notification) 초안을 띄우면, 담당 엔지니어가 첨부된 스냅샷 링크만 눌러 오탐 여부를 최종 확인한 뒤 실제 보수 작업요청(Work Order)으로 전환하는 흐름입니다.

---

## 3. 로봇과 드론이 여러 대가 될 때의 고민: Shell 라인란트 정유공장 사례

단일 로봇을 넘어 사족보행 로봇, 바퀴형 방폭 로봇, 자율비행 드론을 한 공장에서 동시에 굴리기 시작하면 또 다른 문제가 생깁니다. **하드웨어 제조사마다 관제 화면도 다르고 데이터 포맷도 제각각**이라는 점입니다.

독일 최대 정유단지 중 하나인 **Shell Energy and Chemicals Park Rheinland**는 이 문제를 풀기 위해 하드웨어에 종속되지 않는 통합 소프트웨어 계층(**Korial**, 구 Energy Robotics)을 중간에 두는 방식을 택했습니다.

- 지상에서는 방폭(ATEX) 인증을 받은 로봇이 배관과 게이지를 점검하고, 상공에서는 드론이 탱크 지붕과 고소 설비를 촬영합니다.
- 제조사가 다른 로봇·드론들이 각자의 도크로 복귀해 데이터를 올리면, 중간 플랫폼이 이를 단일 규격으로 표준화해 게이지 판독·가스 누출·열화상 이상 여부를 분석한 뒤 Shell의 중앙 관제실과 설비 관리 시스템으로 전달합니다.

---

## 정리하며: 결국 승부처는 로봇 다음의 '파이프라인'

실제 플랜트에 적용된 글로벌 사례들을 뜯어보면, 성공적으로 안착한 곳들의 공통점은 명확합니다. 로봇 하드웨어 도입 그 자체로 끝내지 않고, 현장의 제약 조건에 맞춰 **데이터가 이동하고 걸러지는 길**을 함께 설계했다는 점입니다.

1. 망분리와 음영 구역이라는 현실을 인정하고 **도크 기반 동기화 + 온프레미스 서버(`Site Hub`)** 구조를 택할 것
2. 여러 장비에서 쏟아지는 영상을 그대로 쌓아두지 않고 **설비 ID(Asset Tag) 매핑과 예외 중심(Exception-based) 필터링**을 거칠 것
3. 마지막에는 반드시 현업 엔지니어가 쓰는 **기존 설비 관리 시스템의 작업 흐름** 안으로 결과를 밀어 넣어줄 것

우리 현장에 로봇과 드론을 도입할 때도 "어떤 장비를 살까"만큼이나, **도크에 복귀한 뒤의 데이터를 어떤 보안 경로와 파이프라인으로 흘려보내 현업의 일감을 줄여줄 것인가**를 먼저 그려보는 일이 필요해 보입니다.

---

### 참고 자료 및 출처
- [Boston Dynamics Support — Orbit Architecture & Site Hub Deployment](https://support.bostondynamics.com/)
- [Boston Dynamics Case Study — Woodside Energy: Deploying Spot for Autonomous LNG Inspection](https://bostondynamics.com/case-studies/woodside/)
- [Offshore Technology / NRI Digital — How BP tested Boston Dynamics' Spot at Whiting Refinery and Mad Dog](https://www.offshore-technology.com/)
- [Korial (formerly Energy Robotics) & Shell Rheinland Refinery — Mixed Fleet Autonomous Inspection](https://www.energy-robotics.com/)
