---
layout: ../../layouts/PostLayout.astro
lang: ko
slug: 05-physical-ai-manufacturing-vs-plants
alt: /en/posts/05-physical-ai-manufacturing-vs-plants/
category: Industrial AI
title: "로봇을 들여와도 왜 AI가 못 쓸까?"
subtitle: "정답 없는 Physical AI 문제 정의부터 해외 플랜트의 OT·IT 아키텍처, 그리고 설비 Context 설계까지"
date: "2026.11.11"
---

## 도입: 로봇의 'ChatGPT 모멘트'는 언제 올까?

생성형 AI에 'ChatGPT 모멘트'가 왔듯, 로봇 분야에도 조만간 물리적 세계를 단번에 바꾸는 전환점이 올 것이라는 기대가 큽니다. 하지만 실제 산업 현장의 벽은 여전히 높습니다. 바닥이 평평하고 부품이 규격화된 자동차 조립 공장에서조차 느린 작업 속도, 낮은 정확도, 높은 도입·유지 비용 때문에 상용화 문턱을 넘는 데 어려움을 겪고 있습니다.

앞으로 2029–2030년이 되면 모델과 기체 성능은 지금보다 훨씬 올라가겠지만, <strong>텍스트 AI(ChatGPT)와 현장 로봇(Physical AI)은 작동 조건 자체가 근본적으로 다릅니다.</strong>

* <strong>실패 비용이 다름:</strong> 글 초안이나 코드 제안은 틀려도 사람이 보고 고치면 끝납니다. 반면 현장 로봇은 한 번 잘못 잡거나 설비와 부딪히면 곧바로 <strong>설비 정지·작업물 파손·안전 사고</strong>로 이어집니다. 매끈한 데모 영상이 아니라 조명·위치 변화 속에서도 안전하게 정지하고 복구할 수 있는지가 실제 도입 기준이 됩니다.
* <strong>인식과 완수의 간극:</strong> 카메라로 상황을 설명하는 능력과 물리적 힘을 조절해 작업을 끝까지 완수하는 능력은 전혀 다른 문제입니다. 기체 내부 연산·전력 제약과 공장 폐쇄망 보안 환경 때문에 Edge와 사내 서버 간 역할 분담 설계도 필수입니다.

결국 Physical AI는 정해진 정답지('ChatGPT 모멘트')를 기다렸다가 외부에서 사 오는 기술이 아니라, <strong>"우리 공장 환경과 일상 운영 부담을 감안할 때 무엇을 문제로 정의하고 어디부터 풀 것인가"</strong>를 스스로 설계해야 하는 영역입니다.

앞선 글([`01. 제조·플랜트 현장의 Physical AI`](/posts/01-physical-ai-in-plants/))에서 도크 동기화의 기초를 다뤘다면, 이번 글에서는 드론 검사 플랫폼 실증 경험을 출발점으로 삼아 <strong>① 장치 산업의 출발선과 ROI 차이, ② 먼저 부딪힌 해외 선도 플랜트의 시행착오와 OT·IT 아키텍처, ③ 단일 초대형 장치 사이트의 현실적 전략</strong>까지 한 흐름으로 짚어봅니다.

---

## 1. 왜 장치 산업에서는 출발선과 ROI 공식부터 다를까?

### ① 공정 AI vs 설비 Physical AI의 출발선 차이
정유·석유화학 플랜트에서 <strong>공정(Process) AI</strong>를 다룰 때는 기본적인 데이터 파이프라인이 이미 깔려 있습니다. 실시간 센서(DCS·Historian)는 물론이고 실험실(LIMS) 분석값도 등록 즉시 조회되며, 모델 결과를 넘기는 M2M 파이프라인도 비교적 잘 갖춰져 있습니다. 여기서 핵심 과제는 <strong>"이 센서가 어떤 유체·피드와 운전 모드에 속하고 도면상 어떻게 연결되는지"</strong>라는 공정 온톨로지 맥락을 입히는 일입니다.

반면 설비 점검 영역의 <strong>Physical AI(드론·로봇개·비전 AI)</strong>는 출발선부터 비어 있습니다. 애초에 수동 순찰 구역에는 고정 센서망이 깔려 있지 않고, <strong>방폭(Zone 1)과 폐쇄망</strong>이라는 물리적 제약까지 넘어야 합니다. 무엇보다 어렵게 영상·사진을 찍어 와도, 그 파일을 담아 해석할 <strong>'설비 문맥(Asset Context)' 자체가 없는 상태</strong>에서 시작합니다.

### ② '로봇 = 생산성 = 생존' vs '생산성 = 수율 = 모델'
테슬라·현대차 같은 완성차 라인이나 반도체·배터리 공장(다임테크놀로지 등의 군집 로봇 사례)에서는 <strong>"로봇 투입 = 곧 생산성·수율 향상 = 기업의 생존"</strong>이라는 공식이 성립합니다. 게다가 여러 글로벌 공장에 동일한 라인을 복제해야 하므로, 수백 대의 로봇을 묶는 통합 관제 OS(`xMS`)와 무인화 투자의 ROI가 명확하게 나옵니다.

반면 정유·석유화학 같은 장치 산업은 <strong>증류탑·반응기·배관 같은 거대한 장치 자체가 매출을 만드는 구조</strong>입니다. 여기서는 로봇이 아니라 <strong>공정 최적화와 수율 모델(`생산성 = 수율 = 모델`)</strong>이 핵심 경쟁력입니다. 단일 초대형 사이트 특성상 타 공장으로 라인을 복제·확산할 니즈도 적습니다.

자연스럽게 플랜트에서 Physical AI는 생산 라인 자체가 아니라 <strong>미처 자동화 전환이 안 된 수작업 영역(설비 점검·보수)</strong>으로 흘러가게 되며, 비정형 변수가 훨씬 많습니다. 그나마 정형화가 가능한 '순찰·검사'조차 야외(외부계)·방폭(Zone 1)·무선 음영·고착 밸브 토크(100–200 Nm vs 로봇 팔 20–30 Nm) 제약을 받기 때문에, 휴머노이드가 아니라 <strong>광역·고소·밀폐 구간을 맡는 드론</strong>과 <strong>고정 센서 없는 설비를 순찰하는 4족보행 로봇</strong> 위주로 접근할 수밖에 없습니다. *(실제 반도체 공장에서도 메인 클린룸이 아니라 배관·펌프가 밀집한 하부 보조설비 공간인 `Sub-fab`에서 4족보행 로봇 순찰이 활발히 쓰이고 있습니다.)*

<figure>
  <div class="figure-grid-2">
    <img src="/images/elios-3-tank-inspection.png" alt="고소·협소 및 밀폐 구간 점검에 활용되는 산업용 드론(Flyability Elios 3)" loading="lazy" />
    <img src="/images/anymal-x-plant-inspection.jpg" alt="정유·석유화학 플랜트 현장을 순찰하는 방폭 4족보행 로봇(ANYbotics ANYmal X)" loading="lazy" />
  </div>
  <figcaption>Figure 1. 넓은 플랜트 부지와 고소·협소·밀폐 구역을 커버하는 점검용 드론(좌, Elios 3)과 지상·계단 순찰용 방폭 4족보행 로봇(우, ANYmal X) (출처: MFE Inspection Solutions / ANYbotics)</figcaption>
</figure>

---

## 2. 먼저 부딪힌 해외 현장은 실제로 어떻게 풀었나?

정답지가 없는 영역인 만큼, 비슷한 현장 제약을 먼저 겪고 실전 아키텍처를 닦은 해외 4가지 사례에서 현실적인 힌트를 얻을 수 있습니다.

### ① 노르웨이 Equinor · Aker BP (× Cognite): "수집한 현장 데이터를 설비 상태·운영 데이터와 정렬하기"
* <strong>문제:</strong> 위험 구역 수동 점검에서는 부식이나 압력 이상을 기록·조치하는 데 몇 시간에서 며칠씩 지연이 발생했고, 로봇을 도입해도 기존 운영 시스템과 일상 업무 워크플로우에 녹여내기 어려웠습니다.
* <strong>실제 해법:</strong> 로봇 전용 화면을 따로 보게 하는 대신, <strong>`Cognite Data Fusion(CDF)`</strong>을 중심으로 현장 관측 데이터(시각·오디오·온도·가스)를 <strong>설비 상태(Equipment Status) 및 운영 문맥(P&amp;ID·3D `Asset Tag`)과 자동으로 연결</strong>해 단일 기준 시스템에 표준화했습니다.
  * <em>Equinor (TCM · Sture · Mongstad):</em> `Spot`이 <strong>1,000회 이상 자율 순찰</strong>하며 모은 시각·오디오 데이터를 플랫폼에 올려 이상 탐지 및 설비 거동 학습에 활용 중입니다. *(폐수 샘플링 로봇 VÅK는 TRL 4 단계 검증 병행)*
  * <em>Aker BP (Edvard Grieg 해상 플랫폼):</em> 육상(`Fornebu Robot Garden`) 시뮬레이션 검증 후 ATEX Zone 1 방폭 로봇(`Taurob Inspector`, RaaS 계약 모델)을 투입해 이미지·온도·가스 측정값을 실시간 운영 정보와 결합해 육상 전문가에게 전달합니다.
* <strong>시사점:</strong> 해외 선도 에너지 기업 역시 아직 파일럿·검증 단계가 섞여 있지만, 처음부터 <strong>관측 데이터 → 설비 문맥 정렬 → 상태 기반 유지보수(CBM)</strong>로 이어지는 데이터 기반부터 구축하고 있습니다.
  * <em>※ RaaS(Robot as a Service):</em> 로봇 하드웨어를 직접 구매해 유지보수까지 떠안는 대신, 기체·시스템 통합·유지관리를 하나의 구독·서비스 계약으로 공급받아 초기 투자와 기체 노후화·교체 리스크를 줄이는 도입 모델입니다.

### ② 독일 Shell 라인란트 (× Korial): "이기종 로봇·드론을 단일 관제·AI 분석 레이어로 통합"
* <strong>문제:</strong> 대규모 정유단지를 돌려면 위험 구역용 궤도 로봇(`ExR-2`), 비방폭 계단용 `Spot`, 탱크 지붕·고소용 자동 드론(`Drone-in-a-box`)을 섞어 써야 했습니다. 하지만 제조사(OEM)마다 관제 UI와 데이터 모델이 달라 규모가 커질수록 관리가 파편화되었습니다.
* <strong>실제 해법:</strong> 단일 통합 소프트웨어(<strong>`Korial`</strong>)를 OT/IT 경계의 중간 레이어로 두어, 제어실 단일 화면에서 이기종 기체를 통합 지휘하고 공통 AI 엔진이 게이지·밸브·열화상·ppm 가스 누출을 판독한 뒤 <strong>기준치(Baseline) 이탈 플래그만 Shell 사내 IT 시스템으로 전달</strong>합니다.
* <strong>시사점:</strong> 기체 지능(관제·AI 분석)을 하드웨어에서 분리(Decoupling)해 두어 특정 제조사 종속을 차단하고 기체 교체 유연성을 확보했습니다.

<figure>
  <img src="/images/shell-rheinland-korial-architecture.svg" alt="Shell 라인란트(Rheinland) 자율 점검 아키텍처: OT 현장 기체, OT/IT 경계 Korial 플랫폼, IT 운영 연계" />
  <figcaption>Figure 2. 이기종 기체(궤도·보행·드론)의 관제와 AI 분석을 OT/IT 경계의 단일 레이어(Korial)로 분리·통합한 Shell 라인란트 구조</figcaption>
</figure>

### ③ 미국 GlobalFoundries · 일본 Kirin Brewery (× Boston Dynamics): "고정 센서 대신 이동형 순찰로 데이터 쌓고 기존 점검 시스템에 붙이기"
* <strong>문제:</strong>
  * <em>GlobalFoundries(반도체):</em> 버몬트 200mm 노후 팹 및 글로벌 `Sub-fab`(배관·펌프 밀집 하부 설비)에는 수명이 길고 변화가 느린 펌프·모터·압축가스 배관·아날로그 게이지가 수천 개 깔려 있어 고정 IoT 센서를 전부 달 수 없었습니다.
  * <em>Kirin Brewery(치토세 양조 공장):</em> 숙련 인력 감소·은퇴에 대비해 반복 순찰 공수를 줄여야 했으나, 이동 중 설비 상태와 게이지를 기록해 장기 이력으로 남길 수단이 마땅치 않았습니다.
* <strong>실제 해법:</strong>
  * <em>GlobalFoundries (× Levatas):</em> 공장을 세우지 않고 <strong>약 반나절 만에 자동 순찰 미션</strong>을 구축한 뒤, 파트너 비전 AI(`Levatas`)가 Spot의 '눈'에 <strong>인지 지능(게이지 디지털 판독·열화상 이상 추세 감지)</strong>을 결합했습니다. 이후 싱가포르 등 글로벌 `Sub-fab`으로 확대해 Spot 2대가 <strong>900km 이상·9만 건 순찰(성공률 99%)</strong>을 기록했고 차세대 휴머노이드 테스트까지 확장 중입니다.
  * <em>Kirin Brewery (× TECO):</em> `AutoWalk`로 <strong>5개 경로·약 100개 설비</strong>를 자율 순찰(PTZ 광학 줌·열화상·초음파 카메라 탑재)해 <strong>연간 약 650시간</strong> 공수를 절감했습니다. 특히 `Orbit` 데이터를 기존 설비 점검 시스템(<strong>`AIMOS-DX`</strong>)과 직접 연동해 장기 이력 조회와 리포트 자동화까지 일상 업무로 연결했습니다.
* <strong>시사점:</strong> AI 예지보전이 작동하려면 사진 양보다 <strong>매 순찰마다 동일한 각도와 조건으로 일관되게(Consistent) 찍어 데이터 누락 없이 시계열로 쌓는 것</strong>이 핵심입니다. 또한 개별 이미지 파일이 아니라 <strong>'설비 항목–상태–최신 사진–과거 이력'</strong>이 한 화면에 묶이고 기존 점검 시스템으로 흘러가야 현업이 씁니다.

### ④ 오스트리아 Wien Energie (× Boston Dynamics): "만능 AI·데이터 레이크를 기다리지 않고 현장 맞춤형 모델·운전 데이터로 작게 시작하기"
* <strong>문제:</strong>
  * <em>드론의 한계:</em> 오스트리아 최대 Simmering 발전소는 처음에 실내·설비 점검에 <strong>드론 6대</strong>를 먼저 도입했으나, 협소 구역 충돌 위험과 <strong>프로펠러가 먼지를 일으키는(dust) 안전 문제</strong>로 결국 계단·바닥 이동이 가능한 Spot으로 전환했습니다. *(1대가 <strong>4,000회 이상·1,600km</strong> 순찰 완료, 2027년까지 총 5대로 확대 예정)*
  * <em>현장 특화 기준 &amp; 로컬 처리 제약:</em> 아날로그 게이지·오일 레벨·소화기 정위치·열교환기 등 7~8가지 현장 특화 점검 항목은 공장마다 기준이 달라 일반 데이터로 학습된 범용 AI 모델을 그대로 쓸 수 없었습니다. 또한 EU 규정상 외부 클라우드 전송이나 원격 조종 없이 <strong>모든 데이터를 현장(Onsite)에서 로컬 처리</strong>해야 했습니다.
* <strong>실제 해법:</strong>
  * <em>목적별 맞춤형 AI + 기존 운전 데이터 교차 검증:</em> 사내 로보틱스 팀(`robotics field engineer` 직무 신설)이 점검 목적별 소형 맞춤형 AI 모델을 직접 구축해 구조화 데이터를 추출합니다. 특히 <strong>Spot 열화상이 잡은 모터 과열</strong>과 <strong>발전소 기존 모니터링 시스템(SCADA)의 이상 전류 상승</strong>을 교차 검증해 베어링 결함을 조기에 확정했습니다.
  * <em>설비 중심 점진 연결(Orbit 5.2 방향성):</em> Boston Dynamics 아키텍처 블로그(<em>Breaking Down Data Silos</em>)에서도 강조하듯, 전사 Data Lake 구축에는 수년이 걸리므로 완성을 기다리지 말고 <strong>① `Asset Hierarchy + 메타데이터`로 설비별 담당자 라우팅 → ② PLC/SCADA와 양방향 이벤트 연동(API/Webhook/MCP) → ③ 1개 시설·1개 AI 앱부터 시작해 키우는 Data Flywheel</strong> 구조로 접근해야 합니다.

<figure>
  <img src="/images/bd-data-flywheel-architecture.svg" alt="Boston Dynamics (Orbit) 양방향 연동 및 Data Flywheel 아키텍처" />
  <figcaption>Figure 3. 전사 Data Lake 완성을 기다리지 않고 PLC/SCADA 이벤트와 EAM·AI Agent를 양방향으로 묶는 Data Flywheel 구조</figcaption>
</figure>

* <strong>※ 다른 기체·드론 사례를 봐도 수렴 지점은 동일함:</strong> 위 사례 외에도 방폭 4족보행 로봇(`ANYbotics ANYmal X`, BASF·PETRONAS), 밀폐 탱크·스택 내부 비계를 대체하는 점검 드론(`Flyability Elios 3 UT` — 온보드 LiDAR 3D 포인트클라우드 위 두께·결함 좌표 태깅), 외곽 상시 순찰 드론(`Percepto`, Shell·Chevron 등)처럼 기체는 달라도 성패를 가르는 본질은 <strong>① `3D 좌표·설비 Tag` 중심 문맥화, ② 기체 교체에 흔들리지 않는 연계 레이어, ③ 기존 설비관리·운전 데이터와 연결된 일상 워크플로우</strong>로 동일합니다.

---

## 3. 설비 Context 통합과 Closed-Loop 설계

실제 플랜트 내부를 들여다보면 이미 여러 디지털 조각들이 각자 진행되고 있습니다. 전사 <strong>설비관리 시스템(EAM) 및 마스터 정비</strong>가 이루어지고 있고, 공장 <strong>3D Map</strong> 구축과 함께 좌표 기반 모니터링 포인트가 생기며, <strong>스마트 P&amp;ID</strong>, 드론·로봇개 실증, 개별 비전 AI 모델도 각각 돌아갑니다.

하지만 <strong>이 조각들이 하나의 데이터 흐름으로 연결되지 않으면</strong> 로봇·드론 영상은 여전히 일회성 동영상 파일에 불과합니다. 사외 레퍼런스를 반영해 다음 두 가지 설계 원칙을 먼저 잡아야 합니다.

1. <strong>수집(기체)과 문맥(설비 시스템)의 분리:</strong> 드론이나 로봇개 제조사가 바뀌어도 뒷단 데이터가 끊기지 않도록, 현장 OT 영역(기체·도크 업로드)과 사내 설비 Context·정비 연계 레이어를 분리해 설계합니다.
2. <strong>Data Lake 대기 X → 시범 유닛부터 작은 Data Flywheel 가동:</strong> 전사 통합 데이터 레이크가 완성될 때까지 기다리지 않고, 시범 유닛 1곳에서 <strong>`Asset Tag + 3D Map + 스마트 P&amp;ID`</strong>를 1:1로 먼저 관통시킨 뒤, 사내 폐쇄망(On-prem) 안에서 맞춤형 판독 모델과 기존 공정 운전 데이터(`DCS·PI`) 교차 검증까지 붙여 점진적으로 키웁니다.

<figure>
  <img src="/images/physical-ai-context-loop.svg" alt="설비 문맥(Asset Context) 기반 플랜트 Physical AI 데이터 문맥화 및 선순환 루프" />
  <figcaption>Figure 4. 설비 마스터·3D 맵·스마트 P&amp;ID가 하나의 설비 문맥으로 연결되어 만드는 AI Ready Data 선순환(Closed-Loop) 구조</figcaption>
</figure>

이 구조가 연결되면 점검 데이터는 4단계 선순환을 타게 됩니다.

1. <strong>설비 Context 연결 (현실 – 3D Map – 도면 매핑):</strong> 통합 설비관리(`Asset Tag`), 3D Map 좌표, 스마트 P&amp;ID 도면 위치를 현실 설비와 1:1로 묶습니다. *(드론의 3D LiDAR 결함 태깅이나 지상 로봇 순찰 포인트 모두 같은 `Asset Tag`로 귀결됩니다.)*
2. <strong>AI Ready Data화:</strong> 촬영 영상에 유체·연식·재질·두께 기준 및 과거 정비 이력·공정 운전 데이터를 결합해 설비 단위 문맥을 완성합니다.
   > <em>"이 영상은 몇 월 며칠 어느 구역 파이프랙(3D 좌표)에서 찍힌 설비번호 OOO(P&amp;ID 위치)이며, 내부 유체와 재질·두께 기준 및 과거 보수 이력과 현재 운전 조건은 이렇다."</em>
3. <strong>도크 동기화 · 추론 · 정비 연계:</strong> 도크(Dock) 업로드 후 현장 맞춤형 AI 추론이 이상 체크포인트를 제안하면, 담당자 검토 후 사내 설비관리 시스템(EAM)으로 곧바로 정비요청과 이력을 발행합니다.
4. <strong>경로 추천 및 모델 재학습:</strong> 누적된 문맥 이력을 바탕으로 다음 검사 목적에 맞는 순찰 경로를 추천하고, 현업이 확정한 라벨을 AI 모델 재학습에 다시 투입합니다.

---

## 4. 현실적 결론: 단일 초대형 장치 사이트의 전략

다중 공장 복제가 가능한 조립·반도체 기업과 달리, <strong>단일 초대형 사이트 중심의 정유·석유화학 플랜트</strong>에서 거액의 인력과 예산을 들여 수백 대용 통합 관제 OS를 자체 개발하거나 내부 플랫폼을 만들어 동종 업계 구독형 사업으로 확장하려는 모델은 사이트별 설비 상태와 데이터 편차 때문에 PoC에 그칠 위험이 큽니다.

2030년을 바라보며 지금 현장에서 취할 수 있는 가장 현실적인 전략은 세 가지로 압축됩니다.

1. <strong>거대 플랫폼·전사 Data Lake 신설 대신, 기존 설비 시스템에 '이동형 센서 1종'처럼 얹기</strong>
   * 로봇 전용 OS를 새로 띄우기보다 이미 굴러가고 있는 설비관리(EAM)·3D Map·스마트 P&amp;ID 위에 드론·로봇개 데이터를 가볍게 연결해, <strong>시범 유닛 1곳에서 `Tag + 3D + P&amp;ID` End-to-End 연결부터 관통</strong>시켜 작은 Data Flywheel을 먼저 돌려봅니다.
2. <strong>로봇 기체와 범용 모델은 2030년에 사 오고, '설비 Context 데이터'는 지금 우리가 정리</strong>
   * 최근 로봇 벤더들이 몇 분 만에 주행 경로를 잡고 기본 누수·게이지 판독을 띄워주는 '빠른 온보딩'을 고도화할수록, 역설적으로 <strong>남는 마지막 병목은 우리 공장의 `설비 Context`와 판정 기준</strong>입니다. 하드웨어와 범용 비전 모델은 시간이 갈수록 외부 상용품으로 싸지지만, 공장의 설비·도면·3D·정비이력을 1:1로 엮어 두는 작업은 외부 업체가 대신해 줄 수 없습니다.
3. <strong>단일 사이트 내 '고비용·고위험 1–2건'부터 실리 확보 &amp; 장기 정착 호흡 유지</strong>
   * 비계(족장) 공사비 절감(탱크·고소 배관 드론 검사), 방폭·고위험 구역 순찰, Shut-down / Start-up 전환 구간 점검(`Woodside` 사례)처럼 1–2대만으로도 본전이 확실히 나오는 페인포인트에 집중합니다. 동시에 단발성 데모가 아니라 최소 수개월 이상 현업 워크플로우 안에서 다듬어 '장난감이 아닌 일상 도구'로 안착시키는 호흡(`bp` 3개월 실증 교훈)이 필요합니다.

*(덧붙여 향후 단순 점검('눈')을 넘어 현장 특수 조작('손')을 공장에 맞게 파인튜닝할 단계가 오면, 숙련자 시연 기반 모방학습(`LeRobot`/`ACT`), 물리 시뮬레이션(`MuJoCo`/`Isaac Sim`) 검증, 그리고 안전 인터락과 분리된 <strong>Orchestrator</strong> 관점이 자연스럽게 다음 확장 과제로 이어질 것입니다.)*

---

### 참고 자료 및 출처
* [한국경제 차이나 워치 — "공장에 투입했더니 이럴 수가"…中 로봇 줄줄이 '굴욕'](https://www.hankyung.com/article/202611135386i)
* [Cognite Customer Story — Equinor: Robotics &amp; AI for Safer Field Operations](https://www.cognite.com/en/resources/customer-stories/cognite-and-equinor-leverage-robotics-and-ai-to-reinvent-safer-smarter-field-operations)
* [Cognite Customer Story — Aker BP: Advancing Offshore Robotics &amp; Remote Operations](https://www.cognite.com/en/resources/customer-stories/aker-solutions-aker-bp-and-cognite-advance-robotics-for-the-yggdrasil-development)
* [Korial Case Study — Autonomous Inspection at Shell Rheinland](https://www.korial.com/customer-stories/shell-rheinland)
* [Boston Dynamics Case Study — GlobalFoundries (200mm Fab)](https://bostondynamics.com/case-studies/globalfoundries/) / [연합뉴스 — 글로벌파운드리 Sub-fab·아틀라스 확장 보도](https://www.yna.co.kr/view/AKR20261118035400003)
* [Boston Dynamics Case Study — Kirin Brewery's Chitose Plant (`Orbit + AIMOS-DX`)](https://bostondynamics.com/case-studies/kirin-brewerys-chitose-plant-begins-full-scale-deployment-of-spot/)
* [Boston Dynamics Case Study — Wien Energie: Spot Working at More Austrian Power Plants](https://bostondynamics.com/case-studies/spot-working-at-more-austrian-power-plants/)
* [Boston Dynamics Tech Blog — A New Approach to Predictive Maintenance Challenges](https://bostondynamics.com/blog/a-new-approach-to-predictive-maintenance-challenges/)
* [Boston Dynamics Tech Blog — Breaking Down Data Silos in the Physical World](https://bostondynamics.com/blog/breaking-down-data-silos-in-the-physical-world/)
* [Boston Dynamics Case Study — bp Offshore Robotics Deployment](https://bostondynamics.com/case-studies/bp/) / [Woodside Energy Case Study](https://bostondynamics.com/case-studies/woodside/)
* [Flyability — Elios 3 Ultrasonic Thickness (UT) Inspection Payload](https://www.flyability.com/elios-3-ut-payload)
* [ANYbotics Case — ANYmal X Deployment at BASF Chemical Plant](https://www.anybotics.com/news/anymal-case-basf-chemical-plant/)
* [KBS 다큐 인사이트 294회 「AI, 놀이는 끝났다 : 골리앗의 시간」 (YouTube)](https://youtu.be/TsiNuMoqg-Y)
