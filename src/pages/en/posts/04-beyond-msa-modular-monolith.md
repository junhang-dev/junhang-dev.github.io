---
layout: ../../../layouts/PostLayout.astro
lang: en
slug: 04-beyond-msa-modular-monolith
alt: /posts/04-beyond-msa-modular-monolith/
category: Architecture
title: "Why Are Amazon and Google Talking About Monoliths Again?"
subtitle: "Why We Split into Microservices, Why We Are Merging Back, and Lessons for My Own Platform"
date: "2026.11.04"
---

## Introduction: When Every Cloud Exam Answer Was "Split It Up"

<figure>
  <img src="/images/datacenter-cables.jpg" alt="Dense fiber optic cables plugged into a datacenter network switch rack" loading="lazy" />
  <figcaption>Photo: Densely wired network switches and fiber optic patch cables inside a datacenter (Source: <a href="https://unsplash.com/photos/1594915440248-1e419eba6611" target="_blank" rel="noopener">Unsplash</a>)</figcaption>
</figure>

Whenever you study for cloud certifications (like AWS MLA-C02) or read standard system design guides, there is a textbook answer that almost always scores full marks:

> "A monolithic system is hard to scale and prone to single points of failure. Therefore, decomposing the system into independent Microservices (MSA) or Serverless functions (Lambda, Step Functions) is the modern best practice."

For nearly a decade, saying "our team migrated from a monolith to microservices" served as a badge of engineering maturity across the industry.

Recently, however, while reading through engineering blogs and systems papers, I ran into a surprising headwind. An engineering team at <strong>Amazon Prime Video</strong>—inside the very company that popularized cloud-native serverless architectures—published a post stating that <strong>they merged their distributed microservices back into a single monolith and cut costs by 90%</strong>. Soon after, researchers at <strong>Google</strong> published a paper pointing out that <strong>splitting applications into microservices from the start carries a massive hidden tax</strong>.

As someone who hasn't personally operated planet-scale consumer traffic, this made me genuinely curious:
Why did monoliths fall out of favor in the first place? Why did microservices emerge, and why are big tech teams suddenly bringing monoliths back? Most importantly, as an engineer building platforms in the field, how should I apply this to my own architecture decisions?

In this post, I want to strip away the dense academic jargon and trace this shift from the ground up in my own words.

---

## 1. Back to Basics: Why Did We Start with Monoliths, and Why Did We Split into MSA?

To understand why the pendulum is swinging back, we first need a clear picture of what a <strong>Monolith</strong> and <strong>Microservices (MSA)</strong> actually are. The simplest analogy is <strong>living together under one roof</strong> versus <strong>building separate guest houses for every room</strong>.

### ① The Monolith: Every Feature Living Under One Roof
In a monolith, login, search, billing, and notifications all live and run inside <strong>a single program (one server process)</strong>.
* <strong>Why is it great?</strong> Because every feature shares the exact same computer memory (RAM), talking to each other is effortless and practically instantaneous. When `Billing` calls `Order Lookup`, it doesn't need to package data into a box and ship it. It simply points a finger at a memory address (a Pointer) and says, "Look right there in RAM!" That handoff takes nanoseconds ($\text{ns}$) and costs zero network bandwidth.
* <strong>Why did people hate it?</strong> As companies grew to hundreds of developers working on that single program, three painful problems emerged:
  1. <strong>Domino Failures:</strong> If a developer introduced a memory leak in a minor 'Notification' feature, the entire process crashed—<strong>taking down the mission-critical 'Billing' feature along with it.</strong>
  2. <strong>All-or-Nothing Scaling:</strong> Suppose traffic spikes 10x on 'Product Search' during a sale. In a monolith, you cannot scale out just the search function; you have to <strong>duplicate the entire giant program across 10 expensive servers.</strong>
  3. <strong>Deployment Gridlock:</strong> Changing a single line of code required rebuilding, testing, and redeploying the entire codebase shared by dozens of teams.

### ② The Rescuer: Microservices Architecture (MSA)
Microservices solved this by <strong>giving each feature its own separate house (an independent container or server)</strong>.

Now, the login server, order server, and AI inference server run in separate containers. If the notification server crashes, billing keeps running smoothly. If heavy AI inference requests surge, <strong>you scale out only the inference container</strong>. This is the exact "Fault Isolation" and "Independent Scalability" we learn as best practices in AWS architecture exams.

---

## 2. So Why Return to the Monolith? — The Forgotten 'Packaging and Shipping Fee'

If microservices solved all those problems, why are Amazon and Google reconsidering them?

The reason is simple: once every feature moved into its own separate house, teams realized that <strong>the 'packaging and shipping fees' (network communication overhead) between houses had grown more expensive than the rent itself.</strong>

When two features lived inside one process (a monolith), passing data meant sharing a memory address. The moment you split them into separate containers (MSA), even the smallest data handoff requires a heavy multi-step delivery pipeline:

1. <strong>Packaging the Data (Serialization):</strong> You must convert in-memory data structures into JSON text or byte arrays (like Protobuf) so they can travel over a wire.
2. <strong>Security Checkpoints & Road Transit (Network & Proxies):</strong> The packaged bytes must pass through operating system network stacks, proxies, or cloud storage buckets (like S3) to reach the other server.
3. <strong>Unpacking the Box (Deserialization):</strong> The receiving server must allocate fresh memory, tear open the package, and reconstruct the data structure from scratch.

### Cornell University's Surprising Metric: The 'RPC Tax'
Researchers at Cornell University built realistic microservice benchmarks ([DeathStarBench](https://doi.org/10.1145/3297858.3304013), ASPLOS '19) and, alongside follow-up hardware studies ([Cerebros](https://doi.org/10.1145/3466752.3480065), MICRO '21), measured what microservice CPUs actually spend their time doing.

The result was eye-opening: <strong>between 40% and 80% of total CPU energy in fine-grained microservices was spent not on actual business logic, but purely on packaging, shipping, and unpacking data between services.</strong> In systems research, this is called the <strong>RPC Tax (Remote Procedure Call Tax)</strong>.

---

## 3. How Amazon Prime Video Cut Costs by 90%

The most vivid real-world example of this "shipping fee explosion" came in 2023 from the [Amazon Prime Video Audio/Video Monitoring team](https://web.archive.org/web/20230504060528/https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90).

Their system's job was to watch thousands of live video streams in real time and automatically catch quality defects like frozen screens or audio sync drift.

<figure>
  <img src="/images/msa-rpc-tax-vs-monolith.en.svg" alt="Comparison of Amazon Prime Video's fragmented serverless architecture versus its consolidated monolithic process that reduced costs by 90%" loading="lazy" />
  <figcaption>Figure 1. Eliminating repeated S3 storage hops and network packaging overhead by merging tightly coupled steps into a single process sharing memory</figcaption>
</figure>

### ① The Initial Setup: Textbook Serverless & Microservices
Initially, the team followed textbook cloud-native design and split the workflow into separate components:
* A `Media Converter` ingested live video streams and sliced them into dozens of image frames per second.
* It uploaded those heavy image frames to <strong>Amazon S3 (cloud storage)</strong>.
* <strong>AWS Step Functions</strong> acted as the coordinator, waking up separate `Defect Detector` services (AWS Lambda) so each could download the frames from S3 and inspect them.

### ② What Went Wrong? — The Weight of Moving Heavy Data
At small scale it worked fine, but as the team scaled toward thousands of live streams, the cloud bill skyrocketed.
The actual computation of checking a frame for defects wasn't the problem. Instead, <strong>uploading (`PutObject`) and downloading (`GetObject`) dozens of high-resolution video frames per second across S3—plus paying Step Functions for every single state transition between split services—created a massive cost bottleneck.</strong>

### ③ The Solution: Moving Back Under One Roof (Monolith)
The engineers asked a simple question: *"Wait—the media converter and the defect detectors always run together on the exact same video frames. Why are they acting like strangers shipping packages through S3?"*

So they packed the converter and the detectors back into <strong>a single program (one Amazon ECS container process)</strong>.
In the new setup, extracted video frames are never uploaded to S3. They sit right inside the server's memory (RAM), and the converter simply <strong>hands the memory address (pointer) to the detector threads</strong> sitting next door.

With S3 network hops and Step Functions fees completely removed, <strong>their infrastructure cost dropped by over 90%</strong>, while streaming capacity per server actually increased.

---

## 4. Not a Retreat to Spaghetti Code: The 'Modular Monolith'

When the Prime Video story broke, hot takes across the internet declared, "Microservices were a mistake! Back to legacy monoliths!" But swinging from one extreme to the other misses the entire point.

Amazon Prime Video as a whole did not become a giant monolith. Billing, catalog search, user profiles, and the video monitoring tool itself are still separate services. What they merged were <strong>the overly fragmented pieces inside a single workflow</strong>.

More importantly, the modern <strong>Modular Monolith</strong> trend is fundamentally different from the legacy "spaghetti monolith" where every file was tangled together without boundaries.

<figure>
  <img src="/images/modular-monolith-architecture.en.svg" alt="Structural comparison between a Legacy Monolith, Over-split Microservices, and a Modular Monolith with selective separation" loading="lazy" />
  <figcaption>Figure 2. Finding the middle ground: avoiding both tangled legacy code and excessive network taxes through a Modular Monolith with selective container separation</figcaption>
</figure>

The core lesson is: <strong>Do not confuse keeping code cleanly separated (Logical Modularity) with splitting servers across a network (Physical Distribution).</strong>

* <strong>Modular Monolith:</strong> You deploy the core application as <strong>a single server binary</strong> so communication happens in memory at zero network cost. Inside the codebase, however, you enforce <strong>strict room dividers (module interfaces)</strong> between `Order`, `Billing`, and `Query` packages so they cannot reach into each other's internal tables or create spaghetti dependencies.
* **Google's Idea (*Service Weaver*, HotOS '23):** Google researchers proposed taking this even further: *"Write your application as a clean Modular Monolith first. Then, in production, only if a specific module (like heavy media processing or AI inference) becomes a resource bottleneck, peel just that module out onto a separate server without rewriting your code."*

---

## 5. My Takeaway: Wrestling with the Exact Same Question While Designing a Drone Inspection Platform

The reason this topic resonated so deeply with me is that I recently ran into the exact same architectural dilemma while designing and building an <strong>in-house drone inspection image platform</strong> on my own.

The platform takes video footage captured by plant inspection drones and allows users to analyze frames with deep learning models to detect equipment defects. When I first sketched the architecture—thinking ahead to container-based maintainability and eventual expansion into a company-wide production service—I split the backend into fine-grained microservices on Docker Compose:
* An `api-gateway` in front,
* A separate `query-service` for lookups,
* An `image-service` for uploads and metadata,
* And separate `inference-worker` and `training-service` containers for the deep learning models.

On paper, the separation of roles looked textbook-clean. Yet as <strong>a solo developer building the platform while handling heavy drone video files</strong>, I quickly hit two very real walls:

1. <strong>The Weight of Video Data:</strong> Uploading entire raw drone videos to the backend and passing frames back and forth between `image-service`, storage (`MinIO`/`S3`), and `inference-worker` created the exact same "shipping fee" problem Amazon Prime Video faced. Realizing this, I redesigned the flow: <strong>the client web browser handles the heavy video playback and frame scrubbing locally, and only when the user clicks [Send Frame] on a specific scene does that single frame cross the API to run deep learning inference.</strong>
2. <strong>Boundary Overhead for a Solo Developer:</strong> When one person is building the system, splitting everyday web CRUD logic into `gateway`, `query`, and `image` containers meant that adding a single button on the UI required updating multiple repositories, API contracts, and containers simultaneously.

Studying Amazon and Google's retrospectives helped me find a clear, practical middle ground for my own platform:

* <strong>Where to Merge (Modular Monolith):</strong> Everyday business APIs—queries, metadata management, and user review workflows—belong together inside <strong>a single, well-structured backend service</strong> with clean internal module boundaries. For a solo or small team, that eliminates unnecessary container communication overhead and keeps development fast.
* <strong>Where to Split (Selective Container Separation):</strong> On the other hand, the <strong>deep learning model (`inference` / `training`)</strong> and MLOps tools (`Label Studio`, `MLflow`) require GPU resources and heavy Python dependencies that are completely different from a web API. Keeping *those* isolated in separate containers makes total sense—both for resource stability today and for handing off or scaling the platform across teams tomorrow.

Ultimately, architecture isn't about following a trend of splitting everything or merging everything. It comes down to asking two honest questions: <strong>"How heavy is the data crossing this boundary?"</strong> and <strong>"Who is building and maintaining this system right now?"</strong>

---

### References & Primary Sources
- Marcin Kolny (Amazon Prime Video Tech), [Scaling up the Prime Video audio/video monitoring service and reducing costs by 90% (Web Archive)](https://web.archive.org/web/20230504060528/https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90), *Prime Video Engineering Blog (2023)*
- Yu Gan et al. (Cornell University), [An Open-Source Benchmark Suite for Microservices and Their Hardware-Software Implications for Cloud & Edge Systems (DeathStarBench)](https://doi.org/10.1145/3297858.3304013), *ACM ASPLOS 2019*
- Arash Pourhabibi et al. (EPFL), [Cerebros: Evading the RPC Tax in Datacenters](https://doi.org/10.1145/3466752.3480065), *IEEE/ACM MICRO 2021*
- Sanjay Ghemawat et al. (Google Research), [Towards Modern Development of Cloud Applications (Service Weaver)](https://doi.org/10.1145/3593856.3595909), *ACM HotOS 2023*
- Kirsten Westeinde (Shopify Engineering), [Deconstructing the Monolith: Designing Software that Maximizes Developer Productivity](https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity), *Shopify Engineering Blog*
