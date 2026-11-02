---
layout: ../../layouts/PostLayout.astro
lang: ko
slug: 03-merchant-prep-jitter
alt: /en/posts/03-merchant-prep-jitter/
category: Architecture
title: "사장님이 [60분]을 눌렀을 때, 알고리즘은 사장님을 얼마나 믿을까?"
subtitle: "배달 ETA 2부: 휴먼 인 더 루프(HITL), 매장 편향 보정, 그리고 배차 지터(Jitter) 최적화"
date: "2026.11.02"
---

## 도입: "센서 하나 없는 주방, 유일한 프로브는 사장님의 손가락"

<figure>
  <img src="/images/kitchen-rush.jpg" alt="뜨거운 불길 위에서 요리하는 주방 셰프의 프라이팬" loading="lazy" />
  <figcaption>Photo: 불길과 주문이 쏟아지는 피크타임 주방 현장 (출처: <a href="https://unsplash.com/photos/black-frying-pan-with-fire-581340387417-e188200eb0f0" target="_blank" rel="noopener">Unsplash</a>)</figcaption>
</figure>

비 내리는 금요일 저녁 7시, 동네 돈가스 전문점 주방은 전쟁터입니다. 튀김기 기름은 쉴 새 없이 끓어오르고, 포스(POS)기에서는 1분 간격으로 "배민원 주문!", "쿠팡이츠 주문!" 알림음이 요란하게 울려 퍼집니다.

홀 손님 응대와 고기 손질로 정신이 하나도 없는 사장님은 배달 주문 접수 팝업이 뜨자마자 모니터 앞의 <strong>[60분]</strong> 버튼을 꾹 누릅니다.

여기서 흥미로운 기술적 질문이 시작됩니다.

골목길 식당의 프라이팬이나 튀김기에는 IoT 온도 센서가 달려있지 않습니다. 조리대 위에 설치된 카메라로 돈가스가 몇 퍼센트나 튀겨졌는지 컴퓨터 비전으로 측정하는 것도 아닙니다. 디지털 플랫폼 입장에서 <strong>식당 주방 내부의 물리적 상태를 관측할 수 있는 유일한 센서는 오직 '사장님의 손가락'</strong>뿐입니다.

그렇다면 배달 알고리즘은 사장님이 직접 누른 그 [60분]이라는 숫자를 액면가 그대로 믿을까요? 
만약 시스템이 사장님의 말을 100% 신뢰한다면 어떤 일이 벌어질까요?

---

## 1. 인간의 편향(Bias)과 자가확증 편향의 함정

현실 세계의 플랫폼 엔지니어링에서 인간의 수동 개입(Manual Input)은 가장 다루기 까다로운 신호입니다. 사장님의 입력은 순수한 물리적 팩트(Ground Truth)가 아니라, **극심한 심리적 압박과 주관적 편향이 뒤섞인 노이즈**이기 때문입니다.

DoorDash와 우아한형제들의 기술 블로그를 살펴보면, 식당 점주들의 수동 입력 패턴은 크게 세 가지 유형의 편향으로 갈립니다.

### ① 방어적 과대 편향 (Defensive Over-estimation)
피크타임에 주방이 조금만 밀리면 사장님들은 라이더가 일찍 와서 "음식 언제 나와요?"라며 카운터를 서성이는 상황을 극도로 꺼립니다. 그래서 실제로는 30분이면 충분한 주문에도 심리적 방어막으로 무조건 <strong>[60분]</strong>이나 <strong>[70분]</strong>을 누릅니다.
* **시스템이 이를 곧이곧대로 믿을 경우:** 알고리즘은 60분 뒤에 라이더를 보냅니다. 하지만 음식은 35분 만에 다 튀겨집니다. 결국 갓 튀긴 바삭한 치킨은 주방 선반 위에서 25분 동안 차갑게 식어가고, 고객은 눅눅해진 치킨을 받고 별점 1점을 남깁니다.

### ② 자신감 과잉에 의한 과소 편향 (Overconfident Under-estimation)
반대로 "우리 주방 손이 얼마나 빠른데!"라며 바쁜 피크타임에도 습관적으로 <strong>[15분]</strong>을 누르는 사장님들도 있습니다.
* **시스템이 이를 곧이곧대로 믿을 경우:** 15분 만에 가게에 도착한 라이더는 아직 기름에 들어가지도 않은 닭을 보며 20분 동안 길바닥에서 발을 동동 구릅니다. 라이더에게 시간은 곧 수입입니다. 길바닥 대기 시간이 길어지면 라이더는 배차를 취소하고 해당 매장의 콜을 기피하게 됩니다.

### ③ 레이블 오염(Label Bias)과 자가확증 편향의 파멸 루프
가장 위험한 것은 머신러닝 모델의 학습 파이프라인입니다. 

만약 모델이 <em>"사장님이 60분을 눌렀고, 실제로 라이더 배차도 60분에 맞춰졌으니, 이 주문의 조리시간 레이블은 60분이다"</em>라고 학습(Training)해 버리면 어떻게 될까요?

인간의 비합리적인 방어 기제가 알고리즘의 정답 데이터로 둔갑하고, 모델은 매장의 실제 조리 속도가 아니라 <strong>'사장님의 왜곡된 입력 습관'</strong>을 학습하는 <strong>자가확증 편향(Self-Fulfilling Prophecy)</strong>에 빠집니다.

---

## 2. 사장님을 센서로 대우하되 보정하는 법: Bayesian Bias Correction

이 때문에 DoorDash의 Riviera 프레임워크나 우아한형제들의 조리시간 예측 시스템은 사장님의 수동 입력을 정답이 아닌 <strong>"노이즈가 매우 심한 하나의 피처(Noisy Feature)"</strong>로 취급합니다.

시스템은 사장님의 주관적 주장을 바탕에 두되, 이를 3가지 객관적 물리 컨텍스트로 교차 검증(Cross-validation)하여 보정합니다.

<figure>
  <img src="/images/merchant-bias-calibration.svg" alt="사장님 수동 입력 편향 보정 파이프라인 다이어그램" loading="lazy" />
  <figcaption>Figure 1. 사장님의 수동 입력 [60분]을 3대 컨텍스트 피처로 보정하여 실제 조리시간(38분)을 추정하는 파이프라인</figcaption>
</figure>

### ① 매장별 과거 편향 프로파일 (Store Empirical Bias)
플랫폼의 데이터 레이크하우스는 매장별로 과거 수천 건의 주문에 대해 <strong>[사장님 입력 시간 - 실제 음식 픽업 시점]</strong>의 오차 통계를 축적합니다.
* *"이 식당 사장님은 금요일 저녁에 60분을 누르면 실제로는 평균 38분 만에 음식을 내놓는다 ($\Delta t_{\text{bias}} = -22\text{분}$)."*
* 반면 POS 연동형 KDS(주방 디스플레이)를 갖춘 프랜차이즈 매장은 오차 편향이 $\pm 2$분 이내로 매우 정밀합니다.

### ② 실시간 주방 주문 적체량 (Live Kitchen Backlog)
새벽 통계는 방금 5분 전에 매장에 단체 주문 4건이 들어온 상황을 알 수 없습니다. Kafka 스트림을 타고 흐르는 해당 매장의 실시간 결제 이벤트와 미처리 주문 대기열(Active Order Queue)을 분석하여, 현재 주방 화구(Wok/Fryer)의 물리적 처리 용량이 포화 상태인지 실시간으로 계산합니다.

### ③ 주문 메뉴별 조리 난이도 (Item Recipe Complexity)
단순 조리 메뉴(후라이드 치킨)인지, 복합 조리 메뉴(치즈 돈가스 + 쫄면 세트)인지 메뉴 임베딩 벡터를 통해 순수 물리적 기본 조리 시간(Base Prep Time)의 하한선을 강제합니다.

결과적으로 편향 보정 엔진(Calibration Core)은 다음과 같은 베이지안 보정을 거쳐 사장님의 60분 주장을 걷어냅니다.

$$\hat{T}_{\text{prep}} = T_{\text{input}} + \Delta t_{\text{bias\_adjusted}} = 60\text{분} - 22\text{분} = \mathbf{38\text{분}}$$

알고리즘은 사장님의 감정적 60분을 무시하고, <strong>"이 주문은 정확히 38분 뒤에 포장이 끝난다"</strong>라는 정량적 숫자를 배차 엔진(Dispatch Engine)에 스케줄링 이벤트로 넘깁니다.

---

## 3. 배차의 딜레마: 음식 식는 시간 vs 라이더 길바닥 대기 시간

정제된 조리 완료 시간($\hat{T}_{\text{prep}} = 38\text{분}$)이 나왔다면, 라이더는 언제 불러야 할까요? 

단순히 생각하면 주문이 들어온 순간($t=0$) 가게 바로 앞 100m 거리에 서 있는 가장 가까운 라이더를 매칭(Greedy Nearest-Neighbor)하면 될 것 같습니다. 하지만 이것은 배달 플랫폼 운영에서 가장 피해야 할 최악의 배차입니다.

### 두 가지 상반된 악(The Two Evil Costs)
배차 알고리즘은 본질적으로 양립할 수 없는 두 가지 비용 사이의 줄타기입니다.

1. **음식 식는 시간 ($T_{\text{food\_cold}}$):** 조리가 끝난 후 라이더가 도착할 때까지 음식이 식어가는 시간. (고객 불만, 식은 피자, 재구매율 하락)
2. **라이더 길바닥 대기 시간 ($T_{\text{rider\_wait}}$):** 라이더가 매장에 도착한 뒤 조리가 끝나기를 기다리는 시간. (라이더 수입 감소, 배달 기피, 배달 단가 폭등)

두 비용은 완벽한 **제로섬(Zero-Sum) 트레이드오프**입니다. 라이더를 일찍 보내면 음식은 따뜻하지만 라이더가 분통을 터뜨리고, 라이더를 늦게 보내면 라이더는 바로 픽업하지만 고객은 식은 음식을 먹게 됩니다.

<figure>
  <img src="/images/dispatch-jitter-tradeoff.svg" alt="배차 동기화 타임라인과 비대칭 손실 함수 곡선 다이어그램" loading="lazy" />
  <figcaption>Figure 2. 즉각 배차와 지연 배차의 현장 동기화 비교(상단) 및 라이더 호출 시점에 따른 비대칭 손실 함수(하단)</figcaption>
</figure>

---

## 4. 현실의 불확실성: 지연 배차(Delayed Dispatch)와 배차 지터(Jitter)

이 딜레마를 풀기 위해 우버이츠, 도어대시, 배민 등 현대 음식 배달 플랫폼은 <strong>지연 배차(Delayed / Staged Dispatch)</strong>를 기본 전략으로 채택합니다.

음식 조리가 38분 걸리고 주변 라이더의 매장 이동 시간이 평균 12분이라면, 주문이 들어온 즉시 배차하지 않고 <strong>주문 접수 후 26분 동안 배차를 일부러 보류(Holding)</strong>합니다. 그리고 조리 완료 12분 전인 $t=26$분에 비로소 라이더에게 콜을 보냅니다.

하지만 현실의 도심은 공장 컨베이어 벨트처럼 정밀하게 움직이지 않습니다. 여기서 <strong>배차 지터(Dispatch Jitter)</strong>라는 거대한 확률적 변동이 발생합니다.

* **호출 거절(Rejection) 지터:** 1차로 콜을 보낸 라이더가 배달료가 낮거나 목적지가 마음에 들지 않아 콜을 거절(Reject)하면, 2차 후보 라이더를 탐색하는 데 1~2분의 지연이 발생합니다.
* **이동 시간(Transit) 지터:** 호출을 수락한 라이더가 신호등에 연속으로 걸리거나 골목길 일방통행을 우회하면서 도착 예정 시간이 출렁입니다.

### 다목적 손실 함수(Multi-objective Loss Function)
플랫폼 엔지니어들은 이 확률적 지터를 흡수하기 위해 비대칭 손실 함수를 최적화합니다.

$$\text{Loss} = \alpha \cdot T_{\text{rider\_wait}} + \beta \cdot T_{\text{food\_cold}}$$

여기서 중요한 점은 <strong>라이더의 대기 비용 가중치($\alpha$)가 음식 식음 비용 가중치($\beta$)보다 훨씬 민감하게 작용한다</strong>는 사실입니다. 보온팩에 담긴 치킨은 3~5분 정도의 대기를 견뎌낼 수 있지만, 라이더가 식당 문앞에서 5분 이상 대기하는 순간 분당 이탈률이 기하급수적으로 치솟기 때문입니다.

따라서 최적화 엔진은 배차 지터의 분산을 고려하여, 수학적 정시점($t=26$)보다 아주 살짝 앞선 시점에 보수적으로 라이더를 호출하도록 안전 마진을 설계합니다.

---

## 5. 불완전한 인간과 공존하는 프로덕션 MLOps

우리는 흔히 머신러닝과 AI를 이야기할 때 완벽한 센서 데이터와 무결한 알고리즘의 세계를 상상합니다.

하지만 골목길 배달 서비스처럼 가장 역동적인 물리 세계를 다루는 플랫폼의 본질은, <strong>"현장의 인간은 언제나 불완전하고 주관적이며, 시스템의 통제를 벗어나 자기만의 방식으로 움직인다"</strong>는 현실을 인정하는 데 있습니다.

* 사장님은 바쁘면 본능적으로 60분을 누릅니다.
* 라이더는 비가 오면 본능적으로 속도를 줄이고 위험한 배차를 거절합니다.

진정한 프로덕션 머신러닝 시스템 디자인은 이 인간의 불완전성을 배제하거나 일방적으로 훈계하려 들지 않습니다. 
인간의 주관적 신호를 통계적 베이지안 사전 확률로 받아들이고, 3대 물리 컨텍스트로 편향을 깎아내며, 배차 지터의 파도 속에서 두 가지 대기 손실의 균형점을 정밀하게 찾아내는 것. 

그것이 바로 우리가 매일 저녁 스마트폰 화면에서 마주하는 "도착 예정 시간"의 이면에 숨겨진 현대 분산 MLOps의 진짜 얼굴입니다.

---

### 참고 문헌 및 1차 출처
- DoorDash Engineering Blog, [Lifecycle of a Successful ML Product: Reducing Dasher Wait Times](https://careersatdoordash.com/blog/lifecycle-of-a-successful-ml-product-reducing-dasher-wait-times/)
- DoorDash Engineering Blog, [Using ML and Optimization to Solve DoorDash's Dispatch Problem](https://careersatdoordash.com/blog/using-ml-and-optimization-to-solve-doordashs-dispatch-problem/)
- 우아한형제들 기술블로그, [B마트 출고예정시각 예측 모델 및 OMS 고도화 사례](https://techblog.woowahan.com/)
- 우아한형제들 기술블로그, [배차 정확도를 높이는 실거리 시스템 구축하기: OSRM, Kafka, 그리고 Redis](https://techblog.woowahan.com/22396/)
- Uber Engineering Blog, [Food Discovery and Delivery: Engineering the Uber Eats Platform](https://www.uber.com/en-US/blog/engineering-uber-eats/)
