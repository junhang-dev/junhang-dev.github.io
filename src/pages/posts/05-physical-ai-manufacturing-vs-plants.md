---
layout: ../../layouts/PostLayout.astro
lang: ko
slug: 05-physical-ai-manufacturing-vs-plants
alt: /en/posts/05-physical-ai-manufacturing-vs-plants/
category: Industrial AI
title: "조립 공장의 휴머노이드와 플랜트 로봇은 왜 전혀 다른 길을 갈까?"
subtitle: "테슬라·BMW부터 중국 니오·유비텍까지 — 제조 현장 실증과 정유·석유화학 플랜트의 공학적 제약 비교"
date: "2026.11.11"
---

## 도입: 제조 라인의 휴머노이드, 플랜트의 4족 보행 로봇

최근 미국과 중국의 완성차 공장에서는 휴머노이드 로봇의 현장 실증이 빠르게 이어지고 있습니다. 테슬라의 옵티머스(Optimus), BMW 스파르탄버그 공장에 투입된 피규어 AI의 피규어 02(Figure 02), 그리고 중국 니오(NIO)와 지커(Zeekr) 조립 라인에 배치된 유비텍(UBTECH)의 워커 S(Walker S)가 대표적입니다.

반면 정유·석유화학 플랜트나 해상 플랫폼, 대형 발전소 현장을 살펴보면 양상이 완전히 다릅니다. 이족보행 휴머노이드는 찾아볼 수 없고, 4족 보행 로봇(Spot, ANYmal X, Deep Robotics X30)이나 특수 점검용 드론(Elios 3)이 현장을 채우고 있습니다.

앞선 글([`01. 제조·플랜트 현장의 Physical AI, 실제로는 어디까지 와 있을까?`](/posts/01-physical-ai-in-plants/))에서 로봇이 수집한 영상과 센서 데이터가 사내 보안망을 거쳐 설비 관리 시스템(SAP PM 등)으로 연결되는 데이터 파이프라인을 다루었다면, 이번에는 **"왜 산업별로 로봇의 형태와 적용 방식이 완전히 다른 길로 갈라지는가?"**라는 질문을 물리적 환경과 안전 규제의 관점에서 정리해 보았습니다.

---

## 1. 반도체 클린룸도 극단적인데, 왜 거긴 로봇 천국일까?

산업 환경을 이야기할 때 자주 나오는 의문이 있습니다.

> *"석유화학 플랜트가 가혹하다고 하지만, 먼지 한 톨도 허용하지 않는 반도체 클린룸이 관리 기준상 훨씬 더 까다롭지 않나? 그런데 왜 반도체 팹(FAB)은 100% 무인 로봇으로 돌아갈까?"*

실제로 반도체 팹은 천장에 설치된 레일을 따라 웨이퍼 박스를 나르는 OHT(Overhead Hoist Transport)와 나노미터 공정 장비 내부에 웨이퍼를 투입하는 EFEM 로봇이 24시간 가동되는, 전 세계에서 가장 무인화가 완성된 공간입니다.

하지만 반도체 클린룸과 석유화학 플랜트는 **물리적 규제의 방향과 취급 대상의 성질이 근본적으로 다릅니다.**

| 구분 | 반도체 클린룸 (Cleanroom) | 정유·석유화학 플랜트 (Process Plant) |
| :--- | :--- | :--- |
| **규제의 방향** | **방진 (Dust-free)**: 로봇이 외부로 미세먼지(Particle)를 뿜지 말 것 (ISO Class 1–4) | **방폭 (Explosion-proof)**: 외부 인화성 가스가 로봇 내부 스파크에 닿지 말 것 (Zone 1) |
| **공기 중 상태** | 청정 공기 강제 순환 (폭발성 가스 없음, 특수 가스는 진공 배관 격리) | 탄화수소 증기, 에틸렌, 수소 등 폭발성 혼합기체가 대기 중에 형성될 수 있는 환경 |
| **바닥 및 동선** | 완벽한 수평 실내 바닥, 고정 레일, 온습도 24시간 일정 | 비바람 노출 야외, 철골 그레이팅 바닥, 45도 급경사 철골 계단, 10미터 파이프랙 |
| **취급 대상과 하중** | 규격화된 웨이퍼 카세트(FOUP)를 충격 없이 이송 (요구 토크 수 Nm 이하) | 수십 년간 고온 유체에 굳어버린 금속 배관 밸브 및 플랜지 (요구 토크 100–200 Nm 이상) |

클린룸은 **"로봇 내부의 마찰 먼지가 밖으로 새어 나오지 않도록"** 무분진 케이블베어와 테플론 씰링, 브러시리스 모터를 적용하면 해결됩니다. 무엇보다 바닥이 평평하고 동선이 사전에 정형화되어 있습니다.

반면 석유화학 플랜트는 **"공기 자체가 언제든 불붙을 수 있는 인화성 혼합물"**인 구역(Zone 1)이 상존합니다. 로봇 모터의 스위칭 아크나 배터리 과열 스파크 하나가 대형 화재로 이어질 수 있어, 로봇 내부를 불활성 가스로 채워 외부 기체 유입을 막는 양압 밀폐(Ex p)나 폭발 압력을 견디는 내압 하우징(Ex d)이 법적으로 강제됩니다.

<figure>
  <img src="/images/discrete-vs-process-plant.svg" alt="조립 제조(Discrete) vs 연속공정 플랜트(Process) 환경 비교" />
  <figcaption>Figure 1. 조립 제조 라인과 연속공정 플랜트가 로봇에 요구하는 물리적 제약 조건 비교</figcaption>
</figure>

---

## 2. 제조 현장의 휴머노이드 실증: 미국과 중국이 확인한 현실의 벽

완성차 및 전자 조립 라인(Discrete Manufacturing)은 부품 치수가 표준화되어 있고 바닥이 평평해, 전 세계 로봇 제조사들이 이족보행 휴머노이드를 가장 먼저 시험하는 무대입니다.

최근 미국과 중국의 주요 완성차 공장 실증에서 확인된 흐름은 다음과 같습니다.

### ① 미국 BMW 스파르탄버그 공장 (Figure 02)
- 2024년, BMW는 차체 웰딩 공정에 피규어 AI의 Figure 02를 투입해 시트 메탈 부품을 섀시 프레임 홈에 밀리미터 단위 오차로 정밀하게 삽입하는 작업을 테스트했습니다.
- 비전-언어-행동(VLA) 모델을 통해 부품 위치가 미세하게 달라져도 로봇이 능동적으로 궤적을 보정하며 부품을 끼워 넣는 데 성공했습니다.
- 그러나 실제 양산 라인의 기준인 **37초 사이클 타임(Takt Time)**을 맞추기에는 신경망 추론과 모터 제어 속도가 숙련공에 미치지 못했고, 금속 부품을 연속으로 조작할 때 발생하는 모터 발열과 배터리(2–3시간) 소진이 상용 배치의 과제로 남았습니다.

### ② 중국 니오(NIO)와 지커(Zeekr) 공장 (UBTECH Walker S / S1)
- 중국 전기차 제조사들은 국가적 차원의 지능형 제조 정책과 맞물려 휴머노이드 도입을 가장 적극적으로 밀어붙이고 있습니다.
- **니오(NIO) F2 공장**: 유비텍의 'Walker S'가 조립 라인에 투입되어 도어락 잠금 검사, 안전벨트 체결 테스트, 헤드라이트 커버 장착 등 사람과 나란히 서서 작업하는 공정을 검증했습니다.
- **지커(Zeekr) 5G 지능형 공장**: 유비텍의 차세대 'Walker S1' 여러 대가 투입되어 산업용 자율이동로봇(AMR)과 함께 물류 박스를 피킹하고 부품을 분류하는 군집 지능(Swarm Intelligence) 기반 협업을 시연했습니다.
- 중국 실증에서도 확인된 공통 결론은, **"외관 검사나 경량 부품의 단순 이송은 가능하지만, 높은 하중이 걸리는 체결 작업이나 초 단위 사이클 타임 유지는 여전히 기술적 검증 단계"**라는 점이었습니다.

---

## 3. 플랜트 현장에서 휴머노이드가 아닌 사족보행과 드론을 택한 이유

정유·석유화학 플랜트가 해결해야 하는 문제는 "인간의 손가락으로 부품을 조립하는 일"이 아닙니다. 사람의 진입이 제한되는 유독·고온 구역에서 설비의 이상 징후를 조기에 감지하는 것입니다.

<figure>
  <img src="/images/observation-vs-manipulation-barrier.svg" alt="관찰(Observation)에서 조작(Manipulation)으로 가는 물리적 장벽" />
  <figcaption>Figure 2. 관찰(Observation)은 상용화 단계에 들어섰지만, 조작(Manipulation)은 초기 단계에 머무는 세 가지 이유</figcaption>
</figure>

### ① 방폭 인증을 통과한 4족 보행 로봇 (ANYmal X & Deep Robotics X30)
석유화학 시설의 위험 구역에 진입하려면 공식 방폭 인증(ATEX/IECEx Zone 1)이 필수적입니다.
- **스위스 ANYbotics의 ANYmal X**: 메인 제어부와 배터리 챔버를 불활성 **질소 가스로 양압 밀폐(Ex p)**하고 관절 모터를 내압 방폭(Ex d)으로 설계하여, 세계 최초로 공식 Zone 1 인증을 통과하고 Shell, BASF 등의 현장에 투입되었습니다.
- **중국 Deep Robotics의 X30**: IP67 방수·방진과 가스 누출 센서, 열화상 카메라를 탑재하고 시노펙(Sinopec) 석유화학 시설 및 닝보 제철소의 고온 구역에서 자율 순찰을 수행하고 있습니다.
- 이 로봇들의 공통점은 복잡한 5지 매니퓰레이터 대신, 열화상·음향·가스 센서를 탑재하고 **비접촉 상태 감시(Observation)**에 집중했다는 점입니다.

### ② 밸브 조작(Manipulation) 대신 전동 구동기를 택하는 공학적 경제성
현장의 금속 배관 밸브는 수십 년간의 운전 이력으로 굳어 있어, 작업자가 긴 파이프(치터 바)를 걸고 온 체중을 실어야 돌아가는 경우가 흔합니다. 이때 필요한 순간 토크는 **100–200 Nm 이상**에 달합니다.

현재 개발된 대부분의 로봇 팔은 연속 토크가 20–30 Nm 수준입니다. 고착된 밸브를 무리하게 돌리려다가는 감속기가 파손될 뿐 아니라, 마찰 스파크가 방폭 구역의 점화원이 될 위험이 있습니다.

무엇보다 경제성의 기준이 다릅니다.
> *"수억 원대의 로봇 팔을 현장에 보내 밸브를 돌리게 만드는 것보다, 수백만 원짜리 전동 모터 구동기(MOV)나 공압 액추에이터(AOV)를 밸브 헤드에 영구 직결하고 제어실(DCS)에서 원격 조작하는 편이 안전성과 신뢰성 측면에서 훨씬 합리적입니다."*

### ③ 비계를 없앤 밀폐 드론의 확실한 투자 회수 (Flyability Elios 3)
플랜트 정기보수(TA) 때 수십 미터 높이의 대형 저장탱크 내부를 비파괴검사하려면, 종전에는 **탱크 안에 수억 원을 들여 철골 비계(족장)를 설치하고 해체하는 데만 2–3주**가 걸렸습니다.

<figure>
  <img src="/images/elios-3-tank-inspection.png" alt="Flyability Elios 3 밀폐공간 검사용 케이지 드론" loading="lazy" />
  <figcaption>Figure 3. 충돌 방지 케이지와 LiDAR SLAM, 초음파 두께 측정(UT) 센서를 탑재하고 탱크 내부를 비행하는 Elios 3 (출처: MFE Inspection Solutions)</figcaption>
</figure>

Flyability의 **Elios 3**는 탄소섬유 보호 케이지와 3D LiDAR SLAM, 초음파 두께 측정(UT) 센서를 결합해 비계 설치 자체를 없앴습니다. GPS가 없는 어두운 탱크 안을 자율 비행하며 배관 두께를 0.1mm 단위로 측정합니다.

비계 공사비를 절감하고 정기보수 기간을 단축하며, 작업자가 밀폐 탱크 내부로 들어가는 위험을 원천 차단한다는 점에서 명확한 도입 효과를 입증했습니다.

---

## 마치며: 산업별 제약이 결정하는 현실적인 로드맵

로봇 기술은 하나의 규격으로 모든 산업을 통일하는 방향으로 움직이지 않습니다. 각 산업이 가진 물리적 환경과 안전 규제에 맞춰 가장 경제적인 형태로 분화하고 있습니다.

```
[산업별 Physical AI 도입 흐름]

1. 조립 제조 (Discrete):
   - 평평한 실내 라인 중심
   - 파운데이션 모델(VLA) 경량화 및 Takt Time 단축 중심의 휴머노이드 실증 확대

2. 연속공정 플랜트 (Process):
   - Step 1: Eye (방폭 4족보행 로봇 & 밀폐 드론 기반 비접촉 순찰·점검 무인화) ──▶ TRL 8–9 (상용화)
   - Step 2: Brain (로봇 수집 센서 데이터와 DCS 공정 시계열 결합, 설비 예지보전) ──▶ TRL 6–7 (확대 중)
   - Step 3: Hand (AOV/MOV 대체가 불가능한 유독물 시료 채취 등 특수 구역 원격 조작) ──▶ TRL 3–5 (장기 과제)
```

현장의 제약 조건을 객관적으로 분석하고, 기술의 외형에 휘둘리지 않고 작업 특성에 맞는 최적의 하드웨어와 데이터 흐름을 연결하는 일이 산업 AI 엔지니어링의 본질이라고 생각합니다.

---

### 참고 자료 및 출처
- [BMW Group Press — Humanoid Robots in Automotive Production: Figure 02 Pilot at Plant Spartanburg](https://www.bmwgroup.com)
- [UBTECH Robotics — Walker S Humanoid Robot Deployed in NIO & Zeekr Smart Factories](https://www.ubtrobot.com)
- [ANYbotics — ANYmal X: The World's First Ex-Certified Legged Inspection Robot](https://www.anybotics.com)
- [Deep Robotics — Jueying X30 Industrial Quadruped Robot for Petrochemical Inspections](https://www.deeprobotics.cn)
- [Flyability — Elios 3 Confined Space Drone & Ultrasonic Thickness Testing (UT)](https://www.flyability.com)
- [ISO 14644-1 Cleanrooms and Associated Controlled Environments / IECEx Standards](https://www.iso.org)
