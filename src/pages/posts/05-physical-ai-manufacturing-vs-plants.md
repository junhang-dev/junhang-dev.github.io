---
layout: ../../layouts/PostLayout.astro
lang: ko
slug: 05-physical-ai-manufacturing-vs-plants
alt: /en/posts/05-physical-ai-manufacturing-vs-plants/
category: Industrial AI
title: "로봇을 들여와도 왜 AI가 못 쓸까? — 플랜트 Physical AI와 'AI Ready Data' 바구니 만들기"
subtitle: "방폭·망분리 제약을 넘어, 3D 맵·스마트 P&ID·정비 이력을 하나로 엮는 글로벌 선도 사례와 아키텍처 방향"
date: "2026.11.11"
---

## 도입: 공정 데이터와 설비 점검 데이터는 출발선부터 다르다

정유·석유화학 플랜트에서 공정(Process) 영역의 AI 과제를 다룰 때는 데이터 수집 파이프라인 자체가 어느 정도 갖춰져 있는 경우가 많습니다. 압력·온도·유량 같은 실시간 센서 데이터가 시계열 DB(DCS/PI)에 초 단위로 쌓이고 있고, 센서가 없는 항목도 실험실(LIMS) 분석값이 등록될 때마다 시스템에 기록되어 마치 센서처럼 M2M(Machine-to-Machine) 파이프라인을 타고 AI 모델의 입력과 결과 전달까지 비교적 매끄럽게 흘러갑니다. 오히려 공정 쪽에서 정말 어렵고 계속 필요한 작업은 <strong>"온톨로지(Ontology) 관점에서 이 센서가 전체 공정 흐름의 어디에 있는지, 어떤 유체와 피드(Feed)를 처리하며 어떤 운전 모드 중인지, 도면상 From–To 연결이 어떻게 되는지"</strong> 같은 공정 맥락을 입히는 일입니다.

반면 설비 점검 영역으로 넘어와 <strong>Physical AI(사족보행 로봇·자율비행 드론·비전 AI)</strong>를 현장에 적용하려고 하면, 문제의 차원이 완전히 달라집니다. 공정처럼 데이터가 저절로 들어오는 센서망이 깔려 있는 것도 아닐뿐더러, <strong>방폭과 폐쇄망이라는 물리적 제약</strong>을 넘어 어렵게 영상과 사진을 찍어 와도 <strong>그 데이터를 담아서 AI가 이해할 수 있게 만드는 '바구니(Context)' 자체부터 비어 있기 때문</strong>입니다.

앞선 글([`01. 제조·플랜트 현장의 Physical AI, 실제로는 어디까지 와 있을까?`](/posts/01-physical-ai-in-plants/))에서 Spot이 찍은 데이터를 도크 동기화로 사내 서버(`Site Hub`)에 모으는 기초 파이프라인을 살펴봤다면, 이번 글에서는 한 걸음 더 들어가 <strong>"현장에 Physical AI를 깔고 실제 'AI Ready Data'로 써먹기까지 왜 이렇게 어려우며, 글로벌 선도 기업들은 이 연결 문제를 어떻게 풀고 있고, 앞으로 우리는 어떤 방향을 참고해야 하는지"</strong>를 정리해 보았습니다.

---

## 1. 플랜트 Physical AI가 유독 어려운 3가지 벽

유튜브나 테크 뉴스에서는 테슬라 옵티머스(Optimus), BMW 스파르탄버그 공장의 피규어 02(Figure 02), 중국 니오(NIO)·지커(Zeekr) 조립 라인의 유비텍(UBTECH) Walker S 같은 휴머노이드 실증이 연일 화제입니다. 하지만 정유·석유화학 플랜트 현장에서 Physical AI를 굴려보려 하면 크게 세 가지 벽을 마주하게 됩니다.

### ① 하드웨어와 규제의 벽: 방폭(Zone 1)과 물리적 조작의 한계
자주 나오는 질문 중 하나가 <em>"먼지 한 톨 허용하지 않는 반도체 클린룸도 100% 로봇으로 돌아가는데, 왜 석유화학 플랜트만 로봇 도입이 더딘가?"</em>입니다. 둘 다 가혹한 산업 환경이지만, 규제의 방향과 현장 조건이 정반대입니다.

| 구분 | 반도체 클린룸 (Cleanroom) | 정유·석유화학 플랜트 (Process Plant) |
| :--- | :--- | :--- |
| <strong>규제의 방향</strong> | <strong>방진(Dust-free):</strong> 로봇 내부의 마찰 먼지가 외부 청정 공기로 나오지 말 것 (ISO Class 1–4) | <strong>방폭(Explosion-proof):</strong> 외부 가연성 가스가 로봇 내부 스파크·열원에 닿지 말 것 (ATEX Zone 1) |
| <strong>바닥과 동선</strong> | 완벽한 수평 실내 바닥, 천장 고정 레일(OHT), 온습도 일정 | 야외 노출, 철골 그레이팅, 45도 급경사 철골 계단, 10m 파이프랙 |
| <strong>작업과 하중</strong> | 규격화된 웨이퍼 카세트(FOUP) 이송 (요구 토크 수 Nm 이하) | 고온·부식에 굳어버린 배관 밸브 조작 (요구 토크 100–200 Nm 이상) |

클린룸은 무분진 케이블베어와 브러시리스 모터로 먼지 배출만 막으면 해결됩니다. 반면 플랜트 핵심 구역은 정상 운전이나 누출 시 폭발 한계(LEL) 내의 가연성 혼합기체가 대기 중에 형성될 수 있는 <strong>방폭 구역(Zone 1)</strong>입니다. 로봇 내부 배터리 아크나 정전기 스파크(0.2 mJ 수준)가 곧바로 대형 화재의 점화원이 될 수 있어, 내부를 불활성 질소 가스로 채우는 양압 밀폐(Ex p)나 내압 방폭 하우징(Ex d) 인증이 필수입니다.

<figure>
  <img src="/images/discrete-vs-process-plant.svg" alt="조립 제조(Discrete) vs 연속공정 플랜트(Process) 환경 비교" />
  <figcaption>Figure 1. 정형화된 부품 조립 라인과 연속공정 플랜트가 로봇에 요구하는 물리적 제약 조건 비교</figcaption>
</figure>

여기에 수십 년간 굳어버린 배관 밸브를 돌리는 데 필요한 <strong>100–200 Nm의 거대한 토크</strong>를 생각하면 답이 나옵니다. 20–30 Nm 수준의 휴머노이드 로봇 팔로 밸브를 억지로 돌리는 것보다, 밸브 헤드에 전동 구동기(MOV)나 공압 액추에이터(AOV)를 직결해 제어실(DCS)에서 여닫는 편이 100배 안전하고 경제적입니다.

<figure>
  <img src="/images/observation-vs-manipulation-barrier.svg" alt="관찰(Observation)에서 조작(Manipulation)으로 가는 물리적 장벽" />
  <figcaption>Figure 2. 비접촉 점검(Observation)은 상용화 단계인 반면, 물리적 조작(Manipulation)이 초기 단계에 머무는 이유</figcaption>
</figure>

이 때문에 자동차 조립 라인(BMW Figure 02, 중국 NIO/Zeekr Walker S)에서는 부품 치수와 평탄한 바닥을 활용해 휴머노이드의 택트 타임(Takt Time) 단축을 시험하는 반면, 플랜트에서는 휴머노이드가 아닌 <strong>방폭 4족보행 로봇(ANYmal X, Deep Robotics X30)</strong>과 <strong>비계(족장)를 대체하는 밀폐공간 케이지 드론(Flyability Elios 3)</strong>을 통한 <strong>비접촉 상태 감시(Observation)</strong>가 주류를 이룹니다.

<figure>
  <img src="/images/elios-3-tank-inspection.png" alt="Flyability Elios 3 밀폐공간 검사용 케이지 드론" loading="lazy" />
  <figcaption>Figure 3. 저장탱크 내부의 철골 비계 설치 없이 LiDAR SLAM과 초음파 두께 측정(UT)을 수행하는 Elios 3 (출처: MFE Inspection Solutions)</figcaption>
</figure>

### ② 폐쇄망 데이터 전송과 이기종 파편화의 벽
하드웨어 문제를 피해 방폭 로봇이나 점검 드론을 현장에 띄워도 바로 다음 난관이 기다립니다. 플랜트는 두꺼운 철골 파이프랙으로 인한 무선 음영 구역이 많고, OT 보안망이 철저히 분리되어 있어 실시간 4K 영상 스트리밍이 거의 불가능합니다. 결국 로봇이나 드론이 순찰을 마치고 <strong>충전 도크(Dock)로 복귀했을 때 사내 인가망이나 전용 저장소로 일괄 동기화하는 구조</strong>를 타야 합니다. 게다가 지상 로봇(크롤러·4족보행)과 상공 드론의 제조사가 제각각이면 관제 화면과 데이터 포맷마저 흩어집니다.

### ③ 가장 큰 벽: 조각난 인프라와 'AI Ready Data' 바구니의 부재
실제 현장에서 일하다 보면 흥미로운 현상을 발견하게 됩니다. 많은 플랜트 조직 안에서 이미 여러 디지털 조각들이 <strong>각자 꽤 열심히</strong> 움직이고 있다는 점입니다.
* 기간계 <strong>통합 설비관리 시스템</strong>이 운영 중이고, 그 안의 설비 마스터 데이터 정비도 조금씩 진행되고 있습니다.
* 공장을 스캔해 <strong>3D Map</strong>을 구축하면서 <strong>좌표 기반 모니터링 포인트</strong>라는 개념이 생겨나고 있습니다.
* 도면 디지털화를 위한 <strong>스마트 P&ID(배관계장도)</strong> PoC도 추진됩니다.
* 현장에서는 드론이나 로봇 하드웨어 실증이, 연구실에서는 부식·균열·열화상 <strong>AI 비전 판독 모델</strong> 개발이 따로 돌아가고 있습니다.

문제는 <strong>이 조각들이 하나의 데이터 흐름으로 연결되어 있지 않다</strong>는 데 있습니다. 서로 연결되지 않은 상태에서 로봇이나 드론이 아무리 선명한 영상을 찍어 와도, 그것은 AI 입장에서는 여전히 <em>"몇 월 며칠에 찍힌 정체불명의 동영상 파일 1"</em>에 불과합니다. 설비 문맥과 위치 맥락이 붙지 않은 원시 파일은 AI 모델을 학습시키거나 현업 의사결정에 바로 투입할 수 있는 <strong>AI Ready Data</strong>가 될 수 없습니다.

---

## 2. 이상적인 그림: 데이터를 담는 '바구니'와 선순환 루프

그렇다면 흩어져 있는 조각들을 어떻게 꿰어야 비로소 현장이 살아 움직이는 Physical AI 아키텍처가 될까요? 핵심은 모델이나 로봇보다 먼저 <strong>'데이터를 담을 에셋 바구니(Asset & Spatial Context)'</strong>를 만드는 것입니다.

<figure>
  <img src="/images/physical-ai-context-loop.svg" alt="에셋 바구니 기반 플랜트 Physical AI 데이터 문맥화 및 선순환 루프" />
  <figcaption>Figure 4. 설비 마스터·3D 맵·스마트 P&amp;ID가 하나의 바구니로 연결되어 만드는 AI Ready Data 선순환 구조</figcaption>
</figure>

이 구조가 완성되면 데이터는 다음과 같은 4단계 선순환(Closed-Loop)을 타게 됩니다.

1. <strong>기반 바구니 만들기 (현실 – 3D Map – 도면 연결):</strong> 통합 설비관리 시스템의 설비번호(Asset Tag), 3D Map 상의 모니터링 포인트 좌표, 그리고 스마트 P&amp;ID 상의 도면 위치가 현실 플랜트 설비와 1:1로 묶이면 비로소 검사 데이터를 담을 수 있는 단단한 '바구니'가 만들어집니다.
2. <strong>문맥 입히기 (Contextualization → AI Ready Data):</strong> 이 바구니에 과거 정비·보수 이력과 이번에 촬영한 영상·사진이 함께 담기면, 단순한 이미지 파일에 비로소 엔지니어링 문맥이 생깁니다. AI와 엔지니어가 데이터를 보는 순간 이런 맥락이 한 번에 읽혀야 합니다.
   > <em>"이 영상은 몇 월 며칠에 어느 공장 몇 번 파이프랙(3D 좌표)에서 찍은 건데, 설비번호는 무엇이고 P&amp;ID 도면상으로는 여기 구간이야. 게다가 여기는 어떤 유체가 흐르고, 설비 연식이 몇 년 됐으며 재질과 설계 두께 기준이 이래."</em>
3. <strong>도크 동기화 · AI 인퍼런스 · 정비 시스템 직결:</strong> 드론이나 로봇이 임무를 마치고 도크(Dock)에 복귀해 데이터를 올리면(클라우드 또는 사내 서버), 미리 배포된 AI 추론 서비스가 돌아가며 결함이 의심되거나 확인이 필요한 체크포인트를 추천해 줍니다. 엔지니어는 과거 정비 이력과 대조해 본 뒤, 사내 설비관리 시스템을 통해 곧바로 정비요청(Work Order)과 점검 이력을 남깁니다.
4. <strong>경로 추천과 모델 개선의 선순환:</strong> 이렇게 위치와 맥락이 붙은 데이터와 조치 이력이 '에셋 바구니'에 계속 쌓이면 두 가지가 가능해집니다.
   * <strong>점검 경로 추천:</strong> <em>"지난 순찰에서 이 구역에서 결함이 발견됐고, 이번 검사 계획의 목적은 두께 측정/보온재 손상 확인이니 이번에는 이 경로와 체크포인트 위주로 점검하세요"</em>라고 다음 미션 경로 자체를 제안해 줍니다.
   * <strong>AI 모델 자가 개선:</strong> 현업 엔지니어가 최종 확인·보정한 판독 결과는 바구니 속 정답 라벨로 남아 AI 비전 모델의 재학습과 성능 고도화에 다시 투입됩니다.

---

## 3. 글로벌 선도 기업들은 이 구조를 어떻게 풀고 있을까?

우리와 똑같은 고민을 먼저 겪은 해외 에너지·석유화학 기업들은 <strong>'로봇 도입 이후의 데이터 바구니와 연결성'</strong>을 어떤 아키텍처로 구현했을까요? 앞으로 우리가 벤치마킹할 때 참고할 만한 대표적인 3가지 축입니다.

### ① [에셋 바구니와 AI Ready Data의 교과서] Equinor · Aker BP × Cognite Data Fusion
노르웨이의 <strong>Equinor</strong>(Mongstad 정유공장, Sture 원유 터미널)와 <strong>Aker BP</strong>(Skarv FPSO, Valhall 해상 플랫폼)는 Spot과 방폭 로봇 ANYmal X를 가장 적극적으로 현업에 녹여낸 사례로 꼽힙니다. 이들이 수많은 로봇 PoC 중에서도 유독 '실전 운영'까지 간 비결은 산업용 DataOps 플랫폼인 <strong>Cognite Data Fusion(CDF)</strong>으로 데이터 바구니를 먼저 짰기 때문입니다.

* <strong>자동 문맥화(Contextualization):</strong> 로봇이 수집한 고화질 사진, 열화상, 음향 오디오 데이터를 그냥 파일 서버에 쌓지 않고 CDF로 밀어 넣습니다. CDF는 이를 기존의 <strong>P&amp;ID 도면, 3D 디지털 트윈, 설비 마스터(Asset Hierarchy), 공정 시계열(PI)과 산업용 지식 그래프(Knowledge Graph)로 자동 연결</strong>합니다.
* <strong>현업 중심의 인터페이스(`Cognite InRobot`):</strong> 그 결과, 로봇 공학 전문가가 아닌 일반 운전원과 정비 엔지니어도 3D 트윈 화면이나 `InRobot` 대시보드에서 특정 펌프나 배관 태그를 클릭해 로봇이 찍은 최신 상태와 AI 이상 탐지 리포트를 바로 조회하고 정비 업무로 연결할 수 있습니다. Aker BP는 육상 관제실에서 3D 트윈을 보며 해상 플랫폼에 있는 로봇의 점검 미션을 원격 제어하는 폐쇄 루프(Closed-Loop)까지 구현했습니다.

### ② [이기종 하드웨어 통합과 데이터 규격 표준화] Shell 라인란트 × Korial
독일 최대 정유단지 중 하나인 <strong>Shell Energy and Chemicals Park Rheinland</strong>는 한 종류의 로봇으로 플랜트 전체를 커버하려 하지 않았습니다.
* ATEX Zone 1 방폭 구역에는 궤도형 방폭 로봇(ExRobotics ExR-2),
* 비방폭 복합 계단 구역에는 Boston Dynamics Spot,
* 탱크 지붕이나 고소 파이프랙에는 상공용 DJI 드론을 각각 투입했습니다.

대신 제조사마다 관제 화면과 데이터 포맷이 파편화되는 문제를 막기 위해, <strong>Korial(구 Energy Robotics)이라는 하드웨어 독립적 미들웨어</strong>를 중간 계층에 세웠습니다. 어떤 회사 로봇이 도크에 복귀해 데이터를 올리든 단일 미들웨어가 이를 받아 표준 포맷으로 변환한 뒤 중앙 관제와 사내 IT/OT 시스템으로 넘겨주는 구조입니다. 특정 하드웨어 벤더에 종속되지 않으려면 반드시 참고해야 할 분리 설계입니다.

### ③ [AI 에이전트 결합 &amp; 고위험 순찰 ROI 선점] ADNOC · BASF · Sinopec
중동과 유럽, 중국의 대형 플랜트 역시 로봇 도입을 데이터 플랫폼 통합 및 즉각적인 안전·비용 ROI 영역에 집중하고 있습니다.
* <strong>ADNOC (아부다비 국영석유):</strong> Taurob 방폭 로봇과 Gecko Robotics의 3D LiDAR·초음파·열화상 데이터를 중앙 통합 관제(<strong>Panorama</strong>) 및 에이전틱 AI 시스템(<strong>ENERGYai</strong>)과 연결해, 엔지니어가 자연어로 설비 상태와 점검 데이터를 질의하고 리포트를 받아볼 수 있게 통합했습니다.
* <strong>BASF · Petronas · Sinopec:</strong> BASF(루트비히스하펜 스팀크래커), Petronas는 <strong>ANYmal X</strong>로, 중국 시노펙(Sinopec)은 IP67·열화상·가스 센서를 탑재한 <strong>Deep Robotics X30</strong>으로 Zone 1 및 고온 구역 비접촉 순찰을 표준화하며 설비 건전성 데이터를 축적하고 있습니다.

---

## 4. 내 시선에서의 정리: 우리가 앞으로 참고하고 나아갈 방향

지금 현장을 둘러보면, <strong>필요한 재료들은 이미 각자의 자리에서 조금씩 만들어지고 있습니다.</strong> 설비관리 시스템과 마스터 데이터 정비가 진행되고 있고, 3D Map 좌표 포인트와 스마트 P&amp;ID도 시도되고 있으며, 드론·로봇 현장 테스트와 비전 AI 모델 개발도 개별적으로 이루어지고 있습니다.

아직 이 요소들이 매끄럽게 연결되지 않고 실시간 송수신이나 마스터 데이터 완성도에 숙제가 남아 있을 뿐, <strong>우리가 바라보고 있는 큰 방향성 자체는 글로벌 선도 사례들이 밟아온 궤적과 정확히 일치합니다.</strong> 오히려 앞으로 팀 내에서 우선순위를 잡고 다음 단계를 기획할 때는 아래 세 가지 원칙을 나침반으로 삼는 것이 중요해 보입니다.

1. <strong>'AI 모델 고도화'보다 '에셋 바구니 스키마 연결'을 먼저 챙기기</strong>
   * 공정 시계열 데이터에 온톨로지(흐름·유체·운전 모드·도면 From–To)가 필요하듯, 설비 점검 데이터에는 <strong>'설비번호 + 3D 좌표 + 스마트 P&amp;ID 위치'가 서로 참조할 수 있는 공통 키(Key) 체계</strong>가 먼저입니다.
   * 완벽한 전 공장 매핑을 기다리기보다, 시범 유닛 하나를 정해 <em>Equinor · Aker BP(Cognite)</em>처럼 이 연결 고리를 끝까지(End-to-End) 관통시켜 보는 것이 가장 빠릅니다.
2. <strong>하드웨어 교체에 흔들리지 않도록 수집 계층과 문맥/AI 계층을 분리하기</strong>
   * 드론이나 로봇 기체는 1–2년마다 더 좋은 제품으로 바뀔 수 있습니다. <em>Shell(Korial)</em> 사례처럼 도크 동기화 이후 데이터를 저장하고 추론해 에셋 바구니에 담는 소프트웨어 파이프라인은 특정 장비 벤더에 묶이지 않도록 표준 인터페이스로 분리해 두어야 합니다.
3. <strong>단발성 결함 탐지가 아닌 '경로 추천 – 정비 연계 – 재학습' 루프로 설계하기</strong>
   * AI 인퍼런스 결과를 별도 대시보드에 띄우는 데서 그치면 현업은 결국 쓰지 않습니다. 기존 설비관리 시스템의 정비요청·이력 화면과 자연스럽게 이어지게 하고, 쌓인 이력이 다시 <strong>다음 점검 경로 추천과 모델 성능 개선</strong>으로 돌아오게 만들어야 비로소 현장에 살아남는 Physical AI가 됩니다.

결국 플랜트 Physical AI의 경쟁력은 <em>"어떤 최신 로봇을 사 왔는가"</em>가 아니라, <strong>"사내에 흩어진 설비·도면·3D·이력 데이터를 얼마나 단단한 하나의 문맥 바구니로 엮어내느냐"</strong>에서 결정됩니다. 각자의 위치에서 만들고 있는 조각들을 이 하나의 그림 위로 연결해 나간다면, 다른 어느 현장 못지않은 실전적인 레퍼런스를 만들 수 있을 것이라 확신합니다.

---

### 참고 자료 및 출처
* [Cognite — Autonomous Inspection &amp; Contextualization with Equinor and Aker BP (Cognite Data Fusion / InRobot)](https://www.cognite.com)
* [ANYbotics — ANYmal X: Ex-Certified Autonomous Inspection at Petronas, BASF, and Aker BP](https://www.anybotics.com)
* [Korial (formerly Energy Robotics) — Hardware-Agnostic Fleet Software at Shell Energy and Chemicals Park Rheinland](https://www.korial.com)
* [ADNOC — Scaling Physical Intelligence &amp; Integrating Robotics Telemetry with Panorama and ENERGYai](https://www.adnoc.ae)
* [Deep Robotics — Jueying X30 Industrial Quadruped Robot for Petrochemical Inspections](https://www.deeprobotics.cn)
* [Flyability — Elios 3 Confined Space Drone &amp; Ultrasonic Thickness Testing (UT)](https://www.flyability.com)
