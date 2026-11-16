---
layout: ../../layouts/PostLayout.astro
lang: ko
slug: 05-physical-ai-manufacturing-vs-plants
alt: /en/posts/05-physical-ai-manufacturing-vs-plants/
category: Industrial AI
title: "로봇을 들여와도 왜 AI가 못 쓸까?"
subtitle: "장치 산업의 현실적 제약, 그리고 3D 맵·스마트 P&ID·정비 이력을 잇는 설비 문맥(Asset Context) 설계"
date: "2026.11.11"
---

## 도입: 공정 데이터와 설비 데이터는 출발선부터 다르다

정유·석유화학 플랜트에서 공정(Process) AI를 다룰 때는 기본적인 데이터 흐름이 이미 갖춰져 있습니다. 실시간 센서(DCS·Historian)는 물론이고, 실험실(LIMS) 분석값까지 등록 즉시 조회되며, 모델 결과를 전달하는 M2M 파이프라인도 비교적 매끄럽습니다. 여기서 진짜 어려운 숙제는 <strong>"이 센서가 어떤 유체·피드와 운전 모드에 속하고 도면상 어떻게 연결되는지"</strong>라는 공정 온톨로지 맥락을 입히는 일입니다.

반면 설비 점검 영역의 <strong>Physical AI(드론·로봇개·비전 AI)</strong>는 출발선 자체가 다릅니다. <strong>방폭과 폐쇄망이라는 물리적 제약</strong>을 뚫고 어렵게 영상을 찍어 와도, 그 데이터를 담아 해석할 <strong>'설비 문맥(Asset Context)' 자체부터 비어 있기 때문</strong>입니다.

앞선 글([`01. 제조·플랜트 현장의 Physical AI`](/posts/01-physical-ai-in-plants/))에서 도크 동기화의 기초를 다뤘다면, 이번 글에서는 <strong>조립 공장과 다른 장치 산업의 현실 속에서 왜 설비 문맥 설계가 우선인지</strong> 정리해 보았습니다.

---

## 1. 왜 장치 산업에서는 Physical AI의 공식이 다를까?

### ① '로봇 = 생산성 = 생존' vs '생산성 = 수율 = 모델'
테슬라·현대차 같은 완성차 라인이나 국내 반도체·배터리 공장(다임테크놀로지 등의 군집 로봇 사례)에서는 <strong>"로봇 투입 = 곧 생산성·수율 향상 = 기업의 생존"</strong>이라는 공식이 성립합니다. 게다가 여러 공장에 똑같은 라인을 복제해 깔아야 하므로, 수백–수천 대의 이기종 로봇을 묶는 거대 통합 관제 OS(`xMS`)와 디지털 트윈 가상 공장에 막대한 예산을 투자할 명확한 ROI가 나옵니다.

반면 정유·석유화학 같은 장치 산업은 <strong>증류탑·반응기·배관 같은 거대한 장치 자체가 매출을 만드는 구조</strong>입니다. 여기서는 로봇이 아니라 <strong>공정 운전 최적화와 수율 모델(`생산성 = 수율 = 모델`)</strong>이 핵심 경쟁력입니다. 그러다 보니 장치 산업에서 Physical AI가 들어갈 영역은 생산 라인 자체가 아니라 <strong>미처 자동화 전환이 안 된 수작업 영역, 즉 설비 점검과 보수 작업</strong> 위주로 흘러가게 됩니다. 자연히 작업 환경도 정형화된 조립 라인보다 훨씬 비정형적인 변수가 많습니다.

### ② 정형화 가능한 '검사'마저 부딪히는 외부계의 벽
그나마 순찰·검사(Inspection) 영역은 일정한 경로로 정형화할 수 있는 여지가 있지만, 이를 실내 공장이 아닌 플랜트 <strong>외부계(야외 공정 구역)</strong>에서 수행하려면 만만치 않은 현실 장벽을 만납니다.
* <strong>방진(클린룸)이 아닌 방폭(Zone 1):</strong> 먼지 배출만 막으면 되는 반도체 클린룸과 달리, 플랜트는 외부 가연성 가스가 내부 스파크(0.2 mJ)에 닿지 않게 하는 양압(Ex p)·내압(Ex d) 방폭 인증이 필수입니다.
* <strong>지형과 조작 한계:</strong> 철골 그레이팅과 45도 급경사 계단이 즐비하고, 수십 년간 굳어버린 밸브를 돌리는 데는 100–200 Nm의 토크가 필요해 20–30 Nm 수준인 로봇 팔보다 전동·공압 구동기(MOV/AOV) 직결이 훨씬 합리적입니다.
* <strong>폐쇄망과 무선 음영:</strong> 두꺼운 파이프랙 때문에 실시간 4K 스트리밍이 어려워, 도크(Dock) 복귀 후 사내망·클라우드로 일괄 동기화하는 구조가 기본입니다.

이 때문에 플랜트에서는 휴머노이드 대신 <strong>광활한 부지와 플레어·배관 등 고소 설비, 협소·밀폐 구간을 커버하는 점검용 드론</strong>과, 지상·계단 순찰을 시도하는 <strong>4족보행 로봇</strong> 조합이 현실적인 대안으로 쓰이고 있습니다.

<figure>
  <div class="figure-grid-2">
    <img src="/images/elios-3-tank-inspection.png" alt="고소·협소 및 밀폐 구간 점검에 활용되는 산업용 드론(Flyability Elios 3)" loading="lazy" />
    <img src="/images/anymal-x-plant-inspection.jpg" alt="정유·석유화학 플랜트 현장을 순찰하는 방폭 4족보행 로봇(ANYbotics ANYmal X)" loading="lazy" />
  </div>
  <figcaption>Figure 1. 넓은 플랜트 부지와 고소·협소·밀폐 구역을 커버하는 점검용 드론(좌, Elios 3)과 지상·계단 순찰용 방폭 4족보행 로봇(우, ANYmal X) (출처: MFE Inspection Solutions / ANYbotics)</figcaption>
</figure>

---

## 2. 점검 데이터의 완성: '설비 문맥(Asset Context)' 통합과 선순환

실제 플랜트 현장을 보면 이미 여러 디지털 과제들이 각자 진행되고 있습니다. 기간계 <strong>통합 설비관리 시스템</strong>과 마스터 데이터 정비가 이루어지고 있고, 공장 <strong>3D Map</strong> 구축과 함께 좌표 기반 모니터링 포인트가 생기며, <strong>스마트 P&amp;ID</strong> PoC와 개별 AI 비전 판독 모델, 드론·로봇개 테스트도 각각 돌아갑니다.

하지만 <strong>이 조각들이 하나의 문맥으로 연결되지 않으면</strong> 로봇이 아무리 선명한 영상을 찍어 와도 AI 입장에서는 정체불명의 동영상 파일에 불과합니다. 핵심은 로봇이나 모델보다 먼저 <strong>'통합 설비 문맥(Asset Context)'</strong>을 설계하는 것입니다.

<figure>
  <img src="/images/physical-ai-context-loop.svg" alt="설비 문맥(Asset Context) 기반 플랜트 Physical AI 데이터 문맥화 및 선순환 루프" />
  <figcaption>Figure 2. 설비 마스터·3D 맵·스마트 P&amp;ID가 하나의 설비 문맥으로 연결되어 만드는 AI Ready Data 선순환 구조</figcaption>
</figure>

이 구조가 연결되면 데이터는 다음과 같은 4단계 선순환(Closed-Loop)을 타게 됩니다.

1. <strong>통합 설비 문맥 구축 (현실 – 3D Map – 도면 연결):</strong> 설비번호(Asset Tag), 3D Map 모니터링 좌표, 스마트 P&amp;ID 도면 위치가 현실 설비와 1:1로 묶이면 검사 데이터를 수용하는 단단한 기준 구조가 만들어집니다.
2. <strong>문맥 입히기 (Contextualization → AI Ready Data):</strong> 이 위에 과거 정비 이력과 촬영 영상이 결합되면 비로소 AI가 이해하는 문맥이 생깁니다.
   > <em>"이 영상은 몇 월 며칠 어느 공장 파이프랙(3D 좌표)에서 찍힌 설비번호 OOO(P&amp;ID 위치)이며, 내부 유체와 연식·재질·두께 기준 및 과거 보수 이력은 이렇다."</em>
3. <strong>도크 동기화 · AI 인퍼런스 · 정비 연계:</strong> 도크(Dock) 업로드 후 AI 추론이 이상 의심 체크포인트를 제안하면, 엔지니어가 검토 후 설비관리 시스템으로 곧바로 정비요청과 이력을 남깁니다.
4. <strong>경로 추천과 모델 개선:</strong> 누적된 문맥 이력을 바탕으로 <strong>다음 검사 목적에 맞는 순찰 경로를 추천</strong>하고, 현업이 확정한 라벨을 AI 모델 재학습에 다시 투입하는 선순환이 완성됩니다.

---

## 3. 먼저 해본 해외 플랜트는 실제로 어떻게 풀었을까?

많은 기업 이름을 나열하기보다, 우리 주제인 <strong>'설비 문맥 연결'</strong>과 <strong>'장비 교체에 흔들리지 않는 수집 구조'</strong>를 실제로 현장에 안착시킨 핵심 두 사례만 뜯어보면 해법이 명확해집니다.

<figure>
  <img src="/images/global-plant-robotics-architecture.svg" alt="해외 선도 사례의 4계층 구조: 수집과 문맥 연결의 분리" />
  <figcaption>Figure 3. 기체 교체에 흔들리지 않는 공통 수집 통로(Shell)와 기존 화면에 꽂아주는 설비 문맥(Equinor) 계층</figcaption>
</figure>

### ① 노르웨이 Equinor · Aker BP: "로봇 사진을 3D 화면과 도면에 바로 꽂아 넣다"
노르웨이 정유공장(몽스타드)과 북해 해상 플랫폼에 Spot과 방폭 로봇(ANYmal X)을 도입할 때 가장 큰 문제는 <strong>"로봇이 찍어오는 수십 GB의 게이지 사진·열화상·소리 파일이 별도 폴더에 쌓이기만 해서 현장 운전원이 안 본다"</strong>는 점이었습니다.

이들은 로봇 전용 대시보드를 따로 띄우는 대신, <strong>이미 현업이 보던 3D 화면과 설비 데이터 시스템(Cognite 플랫폼)</strong>으로 데이터를 바로 밀어 넣었습니다.
* <strong>촬영 지점 사전 연결:</strong> 순찰 경로를 짤 때부터 "여기서 찍은 사진은 P&amp;ID 도면의 어느 배관이고, 3D 화면 속 몇 번 펌프(Asset Tag)다"라고 촬영 지점과 설비번호를 미리 1:1로 묶어 두었습니다.
* <strong>파일이 아니라 '상태 변화' 보여주기:</strong> 순찰이 끝나면 로봇 사진이 폴더에 저장되지 않고, 기존 3D 화면에서 해당 펌프를 클릭했을 때 <em>"어제보다 베어링 온도가 20°C 올랐음"</em>처럼 공정 운전 데이터·과거 정비 이력과 나란히 뜨게 만들었습니다. 덕분에 로봇을 모르는 일반 운전원도 평소에 보던 화면에서 바로 이상 여부를 확인하고 정비로 넘길 수 있게 되었습니다.

### ② 독일 Shell 라인란트 정유단지: "드론·로봇이 섞여도 데이터 통로는 하나만 둔다"
대규모 정유공장을 돌다 보니 한 종류의 로봇으로는 부족했습니다. 가스가 찰 수 있는 방폭 구역(Zone 1)에는 궤도형 방폭 로봇을, 계단이 많은 곳에는 로봇개를, 탱크 지붕과 높은 배관에는 드론을 섞어 써야 했습니다. 문제는 <strong>제조사가 다 다르니 관제 화면도 3개, 파일 형식도 3개로 쪼개졌다</strong>는 점입니다.

Shell은 제조사가 주는 전용 앱을 쓰지 않고, 중간에 <strong>공통 번역기 역할을 하는 소프트웨어(Korial)</strong> 하나만 두었습니다. 현장에서는 구역 특성에 맞는 로봇·드론을 마음대로 섞어 쓰되, 도크로 돌아와 데이터를 올리면 중간 소프트웨어가 이를 <strong>똑같은 표준 형식(시간·위치·측정값·이미지)</strong>으로 바꿔 사내 시스템으로 넘겨줍니다. 덕분에 나중에 더 좋은 드론이나 로봇개로 기체를 교체해도, 뒷단 데이터 구조와 AI 모델은 손댈 필요가 없어졌습니다.

---

## 4. 현실적 결론: 단일 초대형 장치 산업은 어떻게 준비해야 할까?

조립·반도체 기업처럼 여러 공장에 플랫폼을 복사해 깔아야 하는 멀티 사이트 환경과 달리, <strong>단일 초대형 사이트 중심의 정유·석유화학 플랜트</strong>는 입장이 다릅니다. 당장 거액의 인력과 예산을 들여 수백 대용 통합 관제 OS를 자체 개발하거나, 내부 TF로 만든 플랫폼을 동종 업계에 구독형 사업으로 팔려 해도 사이트별 설비 상태와 데이터 편차 때문에 몇 번의 PoC에 그칠 위험이 큽니다.

결국 2030년을 바라보는 단일 장치 산업 현장에서 취할 수 있는 가장 현실적이고 현명한 전략은 세 가지로 압축됩니다.

1. <strong>거대 플랫폼 신설이 아니라, 기존 설비 시스템에 '이동형 센서 1종'처럼 얹기</strong>
   * 로봇 전용 OS를 새로 띄우기보다, 이미 굴러가고 있는 설비관리(EAM)·3D Map·스마트 P&amp;ID 위에 드론·로봇개 데이터를 가볍게 연결하는 <strong>설비 문맥 스키마(설비번호 + 3D 좌표 + P&amp;ID 키)</strong>부터 시범 유닛 하나에 End-to-End로 관통시켜야 합니다.
2. <strong>로봇 기체는 2030년에 사 오면 되지만, '문맥 데이터'는 지금 우리만 정리할 수 있다</strong>
   * 하드웨어와 AI 비전 모델은 시간이 갈수록 싸지고 똑똑해져 외부에서 사 오면 되지만, <strong>우리 공장의 설비·도면·3D·정비이력을 1:1로 엮어 두는 작업</strong>은 외부 업체가 대신해 줄 수 없습니다. 미래에 어떤 기체가 들어와도 바로 꽂아 쓸 수 있는 설비 문맥 데이터만 착실히 닦아 두는 것이 가장 저비용의 준비입니다.
3. <strong>단일 사이트 내 '고비용·고위험 1–2개 페인포인트'부터 실리 챙기기</strong>
   * 전사 무인화나 외부 사업화라는 거창한 목표 대신, 비계(족장) 공사비 절감이나 고소·방폭 구역 순찰처럼 로봇 1–2대만으로도 단일 사이트 안에서 본전이 확실히 뽑히는 영역부터 좁혀서 실전 경험을 내재화하는 편이 낫습니다.

*(덧붙여 향후 점검이라는 '눈'을 넘어 현장 특화 조작이라는 '손'까지 공장에 맞게 파인튜닝해야 할 단계가 오면, 숙련자 시연 기반 모방학습(`LeRobot`/`ACT`), 시뮬레이션(`MuJoCo`/`Isaac Sim`) 검증, 그리고 기체 간 데이터 호환성과 독립된 안전 인터락을 관리하는 <strong>Orchestrator</strong> 관점이 자연스럽게 다음 확장 과제로 이어질 것입니다.)*

---

### 참고 자료 및 출처
* [Cognite Customer Story — Equinor: Robotics &amp; AI for Safer Field Operations](https://www.cognite.com/en/resources/customer-stories/cognite-and-equinor-leverage-robotics-and-ai-to-reinvent-safer-smarter-field-operations)
* [Cognite Customer Story — Aker BP: Advancing Offshore Robotics &amp; Remote Operations](https://www.cognite.com/en/resources/customer-stories/aker-solutions-aker-bp-and-cognite-advance-robotics-for-the-yggdrasil-development)
* [Korial Case Study — Shell Energy and Chemicals Park Rheinland](https://www.korial.com/customer-stories/shell-rheinland)
* [Flyability — Elios 3 Ultrasonic Thickness (UT) Inspection Payload](https://www.flyability.com/elios-3-ut-payload)
* [ANYbotics Case — ANYmal X Deployment at BASF Chemical Plant](https://www.anybotics.com/news/anymal-case-basf-chemical-plant/)
* [KBS 다큐 인사이트 294회 「AI, 놀이는 끝났다 : 골리앗의 시간」 (YouTube)](https://youtu.be/TsiNuMoqg-Y)
