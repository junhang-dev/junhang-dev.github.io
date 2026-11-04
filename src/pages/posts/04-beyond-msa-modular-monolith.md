---
layout: ../../layouts/PostLayout.astro
lang: ko
slug: 04-beyond-msa-modular-monolith
alt: /en/posts/04-beyond-msa-modular-monolith/
category: Architecture
title: "아마존과 구글은 왜 다시 '모놀리스'를 이야기할까?"
subtitle: "왜 우리는 MSA로 쪼갰고, 왜 다시 합치고 있는가? (Prime Video 사례와 내 플랫폼 설계의 고민)"
date: "2026.11.04"
---

## 도입: AWS 시험 문제의 정답은 늘 '쪼개기'였는데

<figure>
  <img src="/images/datacenter-cables.jpg" alt="수많은 광케이블이 얽혀 있는 데이터센터 네트워크 스위치 랙" loading="lazy" />
  <figcaption>Photo: 촘촘하게 연결된 데이터센터 네트워크 스위치와 패치 케이블 (출처: <a href="https://unsplash.com/photos/1594915440248-1e419eba6611" target="_blank" rel="noopener">Unsplash</a>)</figcaption>
</figure>

클라우드 자격증(AWS MLA-C02 등)을 공부하거나 아키텍처 책을 펼치면 거의 공식처럼 나오는 모범 답안이 있습니다.

> "하나로 뭉쳐 있는 시스템(Monolith)은 확장하기 어렵고 장애가 전파되기 쉽다. 따라서 기능별로 잘게 쪼개어 독립된 마이크로서비스(MSA)나 서버리스(Lambda, Step Functions)로 분리하는 것이 현대적인 설계다."

실제로 지난 10년 가까이 테크 업계에서 <em>"우리 팀은 모놀리스를 걷어내고 MSA로 전환했습니다"</em>라는 말은 곧 기술 성숙도의 상징처럼 통했습니다.

그런데 최근 해외 기술 블로그와 컨퍼런스를 찾아보다가 꽤 당황스러운 역풍을 마주했습니다. 클라우드의 본산인 <strong>아마존(Amazon Prime Video)</strong> 엔지니어링 팀이 <strong>"잘게 쪼개놓았던 마이크로서비스를 다시 하나의 모놀리스로 합쳐서 비용을 90% 줄였다"</strong>는 글을 발표했고, 뒤이어 <strong>구글(Google)</strong> 연구진까지 논문을 통해 <strong>"처음부터 서비스를 여러 개로 쪼개서 개발하는 방식에는 큰 거품이 끼어 있다"</strong>고 지적한 것입니다.

대규모 글로벌 트래픽을 직접 다뤄보지 않은 입장에서는 문득 궁금해졌습니다.
도대체 처음에는 왜 모놀리스가 미움을 받아서 MSA가 탄생했고, 왜 이제 와서 빅테크들은 다시 '모놀리스'를 부르고 있는 걸까요? 그리고 사내에서 혼자 플랫폼을 설계하고 있는 내 입장에서는 이 흐름을 어떻게 받아들여야 할까요?

이번 글에서는 어려운 시스템 용어를 걷어내고, 그 밑바닥에 있는 아주 단순한 원리부터 차근차근 내 언어로 정리해 보려 합니다.

---

## 1. 먼저 기본부터: 왜 처음엔 모놀리스였고, 왜 MSA로 쪼갰을까?

이 흐름을 이해하려면 먼저 <strong>모놀리스(Monolith)</strong>와 <strong>마이크로서비스(MSA)</strong>가 무엇이 다른지부터 짚고 넘어가는 게 좋습니다. 가장 쉬운 비유는 <strong>'한 집에서 다 같이 살기'</strong>와 <strong>'방마다 별채를 지어 독립하기'</strong>입니다.

### ① 모놀리스(Monolith): 한 지붕 아래 모든 기능이 사는 집
모놀리스는 로그인, 조회, 결제, 알림 같은 모든 기능을 <strong>단 하나의 프로그램(서버 1개)</strong> 안에 다 넣고 돌리는 방식입니다.
* <strong>왜 좋을까?</strong> 모든 기능이 같은 컴퓨터 메모리(RAM) 안에 들어 있기 때문에 서로 대화하기가 엄청나게 쉽고 빠릅니다. `결제` 기능이 `주문 조회` 기능을 부를 때 데이터를 따로 포장해서 보낼 필요가 없습니다. 그냥 <em>"저기 내 메모리 몇 번지에 있는 데이터 봐!"</em> 하고 손가락(메모리 주소, Pointer)만 가리키면 눈 깜짝할 새(수 나노초, $\text{ns}$)에 전달이 끝납니다.
* <strong>그런데 왜 미움을 받았을까?</strong> 서비스가 커지고 개발자가 수십, 수백 명이 되면서 세 가지 큰 문제가 터졌습니다.
  1. <strong>장애의 도미노:</strong> 신입 개발자가 별로 중요하지 않은 '알림' 기능에서 코드 한 줄을 잘못 짜서 메모리가 터졌는데, 한 프로그램에 묶여 있다 보니 <strong>가장 중요한 '결제' 기능까지 서버가 통째로 죽어버립니다.</strong>
  2. <strong>비효율적인 확장(Scale-out):</strong> 이벤트 날이라 '상품 조회'에만 평소보다 10배 많은 사람이 몰렸습니다. 모놀리스에서는 '상품 조회'만 따로 늘릴 수가 없어서, 쓰이지도 않는 결제·관리자 기능까지 포함된 <strong>거대한 프로그램 전체를 통째로 복사해서 비싼 서버 10대에 띄워야 합니다.</strong>
  3. <strong>배포 병목:</strong> 내 코드 한 줄만 고쳐서 올리고 싶은데, 다른 팀 코드까지 전부 합쳐서 빌드하고 테스트하느라 배포 한 번이 거대한 행사가 됩니다.

### ② 그래서 등장한 구원투수, MSA(Microservices Architecture)
이 문제를 해결하기 위해 나온 것이 바로 <strong>MSA</strong>입니다. 한 집에 다 같이 살아서 문제가 생겼으니, 아예 <strong>기능별로 별채(독립된 컨테이너/서버)를 지어서 살림을 따로 차린 것</strong>입니다.

이제 로그인 서버, 주문 서버, 결제 서버가 각자 다른 컨테이너에서 돌아갑니다. 알림 서버가 죽어도 결제는 멀쩡하게 돌아가고, 주문이나 AI 추론처럼 무거운 작업이 몰리면 <strong>그 컨테이너만 골라서 서버를 늘려주면(Scale-out)</strong> 됩니다. 우리가 AWS 아키텍처를 공부할 때 배웠던 '결함 격리(Fault Isolation)'와 '유연한 확장성'이라는 장점이 바로 여기서 나옵니다.

---

## 2. 그런데 왜 다시 모놀리스인가? — 미처 계산하지 못했던 '택배 포장비'

여기까지만 보면 MSA는 완벽한 정답처럼 보입니다. 그런데 왜 최근 아마존과 구글 같은 기업들이 다시 모놀리스 이야기를 꺼낸 걸까요?

이유는 단순합니다. 각자 별채를 지어 독립시켰더니, 한 집에 살 때는 0원이었던 <strong>'집과 집 사이의 택배비와 포장비(네트워크 통신 비용)'</strong>가 집세보다 더 많이 나오기 시작했기 때문입니다.

한 프로세스(모놀리스) 안에 있을 때는 옆 기능에게 데이터를 넘길 때 메모리 주소만 알려주면 끝났습니다. 하지만 두 기능을 별도의 컨테이너(MSA)로 분리하는 순간, 사소한 데이터 하나를 주고받으려 해도 다음과 같은 과정을 매번 거쳐야 합니다.

1. <strong>데이터 포장 (직렬화, Serialization):</strong> 메모리에 있던 데이터 구조를 네트워크 선으로 흘려보낼 수 있도록 JSON 텍스트나 바이트 덩어리(Protobuf 등)로 꼼꼼하게 포장합니다.
2. <strong>검문소와 도로 이동 (네트워크 & 프록시):</strong> 포장된 상자를 들고 운영체제(OS)의 네트워크 통로를 거쳐 다른 서버나 클라우드 저장소(S3 등)로 전송합니다.
3. <strong>데이터 해체 (역직렬화, Deserialization):</strong> 상자를 받은 쪽에서 다시 메모리를 새로 할당하고 포장을 뜯어 원래 데이터 모양으로 조립합니다.

### 코넬대 논문이 밝혀낸 충격적인 숫자: 'RPC 세금(RPC Tax)'
미국 코넬대학교 연구진이 실제 기업들의 마이크로서비스 구조를 똑같이 만들어 측정한 유명한 논문([DeathStarBench](https://doi.org/10.1145/3297858.3304013), ASPLOS '19)과 후속 연구([Cerebros](https://doi.org/10.1145/3466752.3480065), MICRO '21)에 따르면, 잘게 쪼개진 마이크로서비스 서버들의 CPU가 무슨 일을 하는지 분석해 봤더니 놀라운 결과가 나왔습니다.

서버 CPU 에너지의 <strong>40%에서 심하게는 80% 이상이 실제 고객을 위한 계산(비즈니스 로직)을 하는 데 쓰이는 게 아니라, 오직 '데이터를 포장하고 네트워크로 보내고 다시 뜯는 과정'에 쓰이고 있었던 것</strong>입니다. 연구자들은 이를 <strong>RPC 세금(RPC Tax, 원격 호출 통행세)</strong>이라고 부릅니다.

---

## 3. 아마존 프라임 비디오는 어떻게 비용을 90%나 줄였을까?

이 '택배비 폭탄'이 실제 비즈니스 현장에서 어떻게 터졌는지 가장 생생하게 보여준 사례가 바로 2023년 화제가 된 [Amazon Prime Video 오디오/비디오 모니터링 팀의 블로그 글](https://web.archive.org/web/20230504060528/https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90)입니다.

이 팀이 만든 서비스는 수천 개의 실시간 생중계 영상에서 화면이 멈추거나 소리가 밀리는 불량을 실시간으로 찾아내는 시스템이었습니다.

<figure>
  <img src="/images/msa-rpc-tax-vs-monolith.svg" alt="아마존 프라임 비디오가 쪼개진 서버리스 구조에서 단일 모놀리스 프로세스로 합쳐 비용을 90% 절감한 구조 비교" loading="lazy" />
  <figcaption>Figure 1. 조각난 서비스들 사이에서 매번 S3 저장소와 네트워크를 거치며 발생하던 비용을 단일 프로세스 메모리 공유로 제거한 과정</figcaption>
</figure>

### ① 처음에 짰던 구조: 교과서대로 잘게 쪼갠 서버리스/MSA
처음에 팀은 AWS가 권장하는 교과서적인 방식으로 세 단계의 서비스를 전부 분리했습니다.
* `영상 변환기`가 생중계 영상을 받아 초당 수십 장의 이미지 프레임으로 자릅니다.
* 잘라낸 무거운 이미지 파일들을 매번 <strong>Amazon S3(클라우드 저장소)</strong>에 업로드합니다.
* 그러면 <strong>AWS Step Functions</strong>가 지휘자 역할을 해서, 따로 떨어져 있는 여러 개의 `결함 감지기(Lambda)`들을 깨워 각자 S3에서 이미지를 다시 다운로드받아 검사하게 했습니다.

### ② 무엇이 문제였을까? — 무거운 데이터의 이동 비용
작게 테스트할 때는 잘 돌아갔지만, 검사할 생중계 채널이 수천 개로 늘어나자 청구서가 폭발했습니다.
정작 인공지능이 영상 불량을 찾아내는 계산 비용보다, <strong>1초에 수십 장씩 쏟아지는 고화질 이미지 파일을 쪼개진 서비스들끼리 주고받느라 S3에 올리고(`PutObject`) 내리는(`GetObject`) 비용과 Step Functions가 단계마다 매기는 호출 요금</strong>이 감당할 수 없을 만큼 커진 것입니다.

### ③ 해결책: 다시 한 집(모놀리스)으로 합치다
팀은 근본적인 질문을 던졌습니다. <em>"잠깐, 어차피 영상 변환기와 결함 감지기들은 항상 똑같은 영상을 순서대로 같이 검사하는 한 몸인데, 왜 굳이 남남처럼 떨어져서 S3로 택배를 주고받고 있지?"</em>

결국 팀은 쪼개져 있던 변환기와 감지기들을 <strong>단 하나의 프로그램(단일 ECS 컨테이너 프로세스)</strong> 안으로 합쳐버렸습니다.
바뀐 구조에서는 영상을 자른 뒤 S3에 올리지 않습니다. 그냥 같은 서버의 메모리(RAM)에 올려두고, 옆에 있는 결함 감지기에게 <strong>"메모리 몇 번지에 사진 있으니 바로 봐!"</strong> 하고 주소만 건네줍니다.

그 결과 S3 통신비와 데이터 포장 비용이 통째로 사라지면서 <strong>인프라 비용이 90% 이상 줄어들었고</strong>, 처리 속도와 용량은 오히려 훨씬 늘어났습니다.

---

## 4. 옛날 스파게티 코드로 돌아가자는 게 아니다: '모듈형 모놀리스'

아마존 사례가 유명해지자 인터넷에서는 <em>"역시 MSA는 거품이었다! 다시 옛날 모놀리스로 돌아가자!"</em>라는 극단적인 반응이 쏟아졌습니다. 하지만 여기서 중심을 잘 잡아야 합니다.

아마존 프라임 비디오 전체가 모놀리스가 된 것이 아닙니다. 결제, 회원 관리, 영상 추천, 그리고 방금 말한 '영상 품질 검사기'는 여전히 각각 분리된 서비스입니다. 그들이 합친 것은 <strong>'영상 품질 검사'라는 하나의 목적 안에서조차 너무 잘게 쪼개놓았던 내부 조각들</strong>이었습니다.

그리고 요즘 트렌드로 뜨는 <strong>모놀리스(Modular Monolith, 모듈형 모놀리스)</strong>는 옛날처럼 모든 코드를 방 구분 없이 거실 바닥에 뒤섞어 놓는 스파게티 코드(Big Ball of Mud)와는 완전히 다릅니다.

<figure>
  <img src="/images/modular-monolith-architecture.svg" alt="레거시 모놀리스, 과도한 MSA, 그리고 모듈형 모놀리스(Modular Monolith)의 구조적 차이 비교" loading="lazy" />
  <figcaption>Figure 2. 무조건 다 섞는 레거시 모놀리스도, 무조건 다 쪼개는 과도한 MSA도 아닌 '모듈형 모놀리스와 선택적 분리'의 타협점</figcaption>
</figure>

핵심은 <strong>"코드를 깔끔하게 나누는 것(논리적 모듈화)과, 서버를 여러 개로 쪼개는 것(물리적 배포 분리)을 혼동하지 말자"</strong>는 것입니다.

* <strong>모듈형 모놀리스(Modular Monolith):</strong> 서버 프로그램은 <strong>하나로 묶어서 배포</strong>해 네트워크 택배비(RPC 세금)와 관리 복잡도를 0으로 만듭니다. 대신 코드 내부에서는 주문 폴더, 결제 폴더, 조회 폴더의 <strong>칸막이(인터페이스 경계)를 엄격하게 나눠서</strong> 서로 남의 데이터베이스나 내부 코드를 함부로 건드리지 못하게 규칙을 강제합니다.
* <strong>구글의 아이디어 (Service Weaver 논문, HotOS '23):</strong> 구글 연구진은 여기서 한 걸음 더 나아갑니다. <em>"개발할 때는 무조건 다루기 쉬운 모듈형 모놀리스 하나로 짜라. 그러다 나중에 실제 서비스를 운영하면서 정말 특정 모듈(예: 무거운 미디어 처리나 AI 추론)에만 부하가 몰리면, 그때 가서 그 모듈만 별도 서버로 떼어내라"</em>는 것입니다.

---

## 5. 내 시선에서의 정리: 혼자 드론 검사 플랫폼을 설계하며 겪은 똑같은 고민

사실 이번 주제를 깊게 찾아보게 된 건, 최근 사내에서 <strong>드론 촬영 영상을 받아 설비 결함을 분석하는 검사 이미지 플랫폼</strong>을 혼자 설계하고 개발하면서 저 역시 똑같은 고민에 부딪혔기 때문입니다.

처음 플랫폼 아키텍처 초안을 그릴 때만 해도, 저는 향후 이 시스템이 사내 메인 서비스로 확장될 것과 컨테이너 기반의 유지보수를 고려해 Docker Compose 환경 위에 역할별로 컨테이너를 아주 잘게 나누어 설계했습니다.
* 앞단에 `api-gateway`를 두고,
* 조회를 담당하는 `query-service`,
* 이미지 업로드를 다루는 `image-service`,
* 딥러닝 모델을 돌리는 `inference-worker`와 `training-service`까지 각각 독립된 마이크로서비스 컨테이너로 쪼갠 것입니다.

교과서적으로 보면 역할이 깔끔하게 분리된 그림이었지만, 막상 <strong>나 혼자서 이 전체 시스템을 개발하고 실제 드론 영상 데이터를 다루려니</strong> 두 가지 현실적인 벽이 다가왔습니다.

1. <strong>데이터의 무게 문제:</strong> 드론이 찍어온 고화질 원본 영상을 통째로 서버에 올리고, 쪼개진 `image-service`와 `inference-worker`가 저장소(MinIO/S3)를 거치며 프레임마다 통신하게 만들면 아마존 프라임 비디오가 겪었던 것처럼 배보다 배꼽이 더 큰 구조가 됩니다. 결국 <strong>"무거운 영상 재생과 프레임 탐색은 사용자의 웹 브라우저(클라이언트) 단에서 먼저 처리하고, 사용자가 분석이 필요한 장면을 골라 [사진 보내기] 버튼을 눌렀을 때만 해당 프레임을 서버로 보내 딥러닝 모델이 결과를 내뱉게 하자"</strong>고 구조를 훨씬 가볍게 바꿨습니다.
2. <strong>1인 개발에서의 경계 설정 문제:</strong> 혼자 개발하는 단계에서 일반 웹 업무 로직까지 `gateway`, `query`, `image` 서비스로 다 쪼개 놓으니, 화면에 버튼 하나를 추가하려 해도 컨테이너 여러 개와 API 명세를 동시에 고쳐야 하는 소모전이 벌어졌습니다.

이번에 아마존과 구글의 사례, 그리고 모듈형 모놀리스 트렌드를 공부하면서 제가 내린 결론은 명확해졌습니다. <strong>"처음부터 모든 것을 다 쪼개는 것도, 반대로 무조건 통짜로 뭉치는 것도 정답이 아니다"</strong>라는 점입니다.

* <strong>하나로 묶을 곳 (모듈형 모놀리스):</strong> 화면과 맞닿아 있는 조회, 이미지 메타데이터 관리, 사용자 액션 처리 같은 <strong>일반 업무 API는 하나의 단단한 백엔드 서버로 묶되 코드 안의 모듈 경계만 깔끔하게 유지</strong>하는 것이 지금의 나에게 가장 빠르고 유지보수하기 좋은 선택입니다.
* <strong>컨테이너로 분리할 곳 (선택적 분리):</strong> 반면 GPU 자원을 써야 하고 무거운 라이브러리가 돌아가는 <strong>딥러닝 추론(`inference`)·학습(`training`) 영역</strong>이나 오픈소스 도구(`Label Studio`, `MLflow`)는 일반 웹 서버와 리소스 성격이 완전히 다르므로, 지금처럼 별도 컨테이너로 깔끔하게 분리해 두어야 나중에 사내 메인 서비스로 확장하거나 다른 팀과 협업할 때 유연하게 대처할 수 있습니다.

결국 아키텍처란 남들이 다 MSA를 한다고 해서 따라 쪼개고, 모놀리스가 뜬다고 해서 다 합치는 유행의 문제가 아니었습니다. <strong>"내가 다루는 데이터가 얼마나 무거운가?"</strong>, 그리고 <strong>"지금 이 시스템을 몇 명이 만들고 어떻게 확장할 것인가?"</strong>를 기준으로 내 서비스에 맞는 경계선을 직접 그어 나가는 과정이었습니다.

---

### 참고 문헌 및 1차 출처
- Marcin Kolny (Amazon Prime Video Tech), [Scaling up the Prime Video audio/video monitoring service and reducing costs by 90% (Web Archive 원문 보존본)](https://web.archive.org/web/20230504060528/https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90), *Prime Video Engineering Blog (2023)*
- Yu Gan et al. (Cornell University), [An Open-Source Benchmark Suite for Microservices and Their Hardware-Software Implications for Cloud & Edge Systems (DeathStarBench)](https://doi.org/10.1145/3297858.3304013), *ACM ASPLOS 2019*
- Arash Pourhabibi et al. (EPFL), [Cerebros: Evading the RPC Tax in Datacenters](https://doi.org/10.1145/3466752.3480065), *IEEE/ACM MICRO 2021*
- Sanjay Ghemawat et al. (Google Research), [Towards Modern Development of Cloud Applications (Service Weaver)](https://doi.org/10.1145/3593856.3595909), *ACM HotOS 2023*
- Kirsten Westeinde (Shopify Engineering), [Deconstructing the Monolith: Designing Software that Maximizes Developer Productivity](https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity), *Shopify Engineering Blog*
