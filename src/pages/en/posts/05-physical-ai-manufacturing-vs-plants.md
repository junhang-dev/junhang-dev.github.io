---
layout: ../../../layouts/PostLayout.astro
lang: en
slug: 05-physical-ai-manufacturing-vs-plants
alt: /posts/05-physical-ai-manufacturing-vs-plants/
category: Industrial AI
title: "Why Can't Plant AI Use Robot Data Out of the Box?"
subtitle: "From defining open-ended Physical AI problems to OT/IT boundaries, Data Flywheels, and Asset Context architecture"
date: "2026.11.11"
---

## Introduction: When Will Robotics Have Its "ChatGPT Moment"?

Just as generative AI hit an inflection point with ChatGPT, many expect robotics to soon deliver a similar breakthrough in the physical world. Yet real industrial walls remain stubborn. Even inside automotive assembly lines—with flat floors and standardized parts—humanoids and mobile robots still struggle to clear commercial hurdles due to slow cycle times, insufficient reliability, and high costs.

By 2029–2030, foundation models and robot hardware will undoubtedly advance far beyond today. Still, <strong>text AI (ChatGPT) and field robotics (Physical AI) operate under fundamentally different constraints:</strong>

* <strong>Asymmetric Cost of Failure:</strong> When a text draft or code suggestion is wrong, a human reviews and edits it. When a field robot misgrasps or collides with piping, the result is <strong>unplanned unit trips, equipment damage, or safety incidents.</strong> Deployment depends not on polished demo videos, but on deterministic safe-stop and recovery across lighting shifts, weather, and human proximity.
* <strong>The Gap Between Perception and Execution:</strong> Explaining a scene through a camera is completely different from modulating physical force to complete a task. Meanwhile, onboard compute/power limits and air-gapped plant security require careful division of work between Edge hardware and on-premise enterprise servers.

Physical AI is therefore not an off-the-shelf commodity waiting for a "ChatGPT moment." Teams must actively define <strong>what problem actually exists in their specific plant and where to start solving it</strong> while keeping daily operational overhead realistic.

Building on the dock-sync basics in [`01. Where Does Physical AI Actually Stand in Industrial Plants?`](/en/posts/01-physical-ai-in-plants/) and practical lessons from building an industrial drone inspection platform, this post connects three pieces: <strong>(1) why asset-heavy process plants start from a completely different baseline, (2) hard-earned architectural lessons from overseas refineries, fabs, and power plants, and (3) a pragmatic single mega-site strategy.</strong>

---

## 1. Why the Physical AI Equation Differs in Process Industries

### ① Process AI vs. Asset Inspection Physical AI
In refinery <strong>process optimization AI</strong>, core data pipelines already exist. Real-time sensors (DCS and Historians) and lab assays (LIMS) are queryable immediately, and M2M model delivery works smoothly. The primary challenge there is adding <strong>process ontology</strong>—identifying which fluid, feed, operating mode, and flowsheet topology each tag belongs to.

By contrast, <strong>Physical AI for asset inspection (drones, quadrupeds, vision AI)</strong> starts from empty ground. Routine manual inspection zones have no fixed sensor grids, require traversing <strong>ATEX/IECEx Zone 1 explosion-proof barriers and air-gapped networks</strong>, and even after hard-won image capture, <strong>there is no foundational "Asset Context" layer to interpret what the pixels mean.</strong>

### ② "Robots = Productivity = Survival" vs. "Productivity = Yield = Models"
In discrete automotive lines (Tesla, Hyundai Motor) or semiconductor/battery fabs (such as Korean autonomous factory OS leaders like DAIM Technology), the equation is clear: <strong>"Deploying robots = direct throughput and yield gains = survival."</strong> Because these firms replicate identical lines across multiple global plants, heavy investment in centralized fleet OSs (`xMS`) managing hundreds of robots pays off directly.

Refineries and petrochemical complexes operate under the opposite economics: <strong>distillation towers, reactors, and piping themselves generate revenue</strong>, making <strong>process optimization and yield models (`Productivity = Yield = Models`)</strong> the true profit engine. A single mega-site also has little need to clone fleets across dozens of identical factories.

Consequently, Physical AI in process plants naturally gravitates toward <strong>the remaining unautomated manual work: asset inspection and maintenance</strong>—where edge cases are far less structured. Even routine patrol routes face outdoor weather, Zone 1 limits, wireless dead zones, and heat-seized valves requiring 100–200 Nm of breakaway torque (well beyond 20–30 Nm robotic arms). Thus, realistic hardware converges on <strong>drones covering wide yards, elevated structures, and confined vessels</strong>, paired with targeted <strong>quadruped deployments</strong> on un-sensorized ground floors and stairs. <em>(Notably, even in semiconductor manufacturing, quadrupeds like Spot are primarily deployed not on main cleanroom tools, but in pipe-and-pump-dense <strong>Sub-fab</strong> utility levels lacking fixed sensors.)</em>

<figure>
  <div class="figure-grid-2">
    <img src="/images/elios-3-tank-inspection.png" alt="Industrial drone inspecting elevated and confined plant infrastructure (Flyability Elios 3)" loading="lazy" />
    <img src="/images/anymal-x-plant-inspection.jpg" alt="ATEX Zone 1 quadruped robot patrolling a petrochemical plant (ANYbotics ANYmal X)" loading="lazy" />
  </div>
  <figcaption>Figure 1. Industrial drones covering wide sites, elevated assets, and confined vessels (left, Elios 3) paired with explosion-proof quadrupeds on plant floors (right, ANYmal X) (Source: MFE Inspection Solutions / ANYbotics)</figcaption>
</figure>

---

## 2. How Leading Plants Actually Solved This in Practice

Because there is no single textbook answer, four real-world deployments offer concrete lessons in bridging field telemetry to plant operations.

### ① Norway's Equinor &amp; Aker BP (× Cognite): "Aligning Field Telemetry with Equipment Status &amp; Ops Context"
* <strong>The Challenge:</strong> Manual inspections in hazardous zones took hours or even days to log corrosion spots or pressure anomalies into actionable tickets, and isolated robot outputs rarely fit daily operator workflows.
* <strong>The Solution:</strong> Rather than creating separate robot dashboards, they routed visual, audio, thermal, and gas telemetry through <strong>Cognite Data Fusion (CDF)</strong>, automatically binding inspection points to <strong>P&amp;IDs, 3D Asset Tags, and live Equipment Status</strong> in one source of truth.
  * <em>Equinor (TCM, Sture, Mongstad):</em> Spot logged <strong>1,000+ autonomous inspection rounds</strong> feeding visual and acoustic data into CDF for anomaly detection and equipment behavior modeling, alongside TRL 4 trials of specialized robots like VÅK.
  * <em>Aker BP (Edvard Grieg offshore platform):</em> After onshore validation at the Fornebu Robot Garden, an ATEX Zone 1 tracked robot (`Taurob Inspector`, integrated under a RaaS model) streams imagery, temperature, and gas readings merged with live operational context to onshore specialists.
* <strong>Takeaway:</strong> Even global leaders remain partly in pilot and qualification phases, yet from day one they prioritized building the pipeline from <strong>raw observation → Asset Context binding → condition-based maintenance (CBM)</strong>.
  * <em>Note on RaaS (Robot as a Service):</em> Instead of buying hardware outright and absorbing maintenance overhead, plants contract hardware, integration, and lifecycle upgrades as an operational service to lower upfront capex and obsolescence risk.

### ② Germany's Shell Rheinland (× Korial): "One Control &amp; AI Layer Across Mixed Robots and Drones"
* <strong>The Challenge:</strong> Inspecting a massive refinery required mixing tracked Zone 1 crawlers (`ExR-2`), non-Ex quadrupeds (`Spot`) on stairs, and automated `Drone-in-a-box` units for tank roofs. Three OEMs meant three consoles and fragmented data formats.
* <strong>The Solution:</strong> Shell placed a hardware-agnostic middleware layer (<strong>Korial</strong>) across the OT/IT boundary. Operators command all three modalities from one screen while a shared AI layer reads gauges, valves, thermal feeds, and ppm gas leaks—forwarding <strong>only baseline-deviation flags</strong> into Shell's operational IT stack.
* <strong>Takeaway:</strong> Decoupling fleet intelligence (control and AI inference) from underlying hardware eliminates vendor lock-in when swapping robots later.

<figure>
  <img src="/images/shell-rheinland-korial-architecture.en.svg" alt="Shell Rheinland Autonomous Inspection Architecture across OT fleet, OT/IT middleware, and Enterprise Ops" />
  <figcaption>Figure 2. Shell Rheinland's architecture separating mixed OT hardware from unified control and AI diagnostics at the OT/IT boundary</figcaption>
</figure>

### ③ US GlobalFoundries &amp; Japan's Kirin Brewery (× Boston Dynamics): "Mobile Patrols Over Fixed Sensors, Wired into Maintenance Systems"
* <strong>The Challenge:</strong>
  * <em>GlobalFoundries (Semiconductors):</em> Legacy 200mm fabs (Burlington, VT) and global `Sub-fab` levels house thousands of long-lived pumps, motors, compressed gas lines, and analog gauges—making ubiquitous fixed IoT sensors uneconomical.
  * <em>Kirin Brewery (Chitose Plant):</em> Facing an aging workforce, the plant needed to cut manual rounds while preserving long-term trend histories for aging brewing equipment.
* <strong>The Solution:</strong>
  * <em>GlobalFoundries (× Levatas):</em> Automated patrol missions were set up in <strong>roughly half a day without halting production</strong>, while computer-vision partner `Levatas` added cognitive intelligence to read gauges digitally and flag thermal trends. Expanding across Singapore and global `Sub-fabs`, Spot pairs logged <strong>over 900 km and 90,000+ inspections at a 99% success rate</strong>, paving the way for early humanoid pilots.
  * <em>Kirin Brewery (× TECO):</em> Using `AutoWalk`, Spot inspects <strong>100 assets across 5 routes</strong> (with PTZ optical zoom, thermal, and ultrasonic sensors), targeting <strong>~650 labor hours saved per year</strong>. Crucially, `Orbit` feeds directly into the existing plant inspection platform <strong>`AIMOS-DX`</strong> for long-term history tracking and automated reporting.
* <strong>Takeaway:</strong> Predictive maintenance AI depends less on raw photo volume than on <strong>capturing every inspection from the exact same angle and lighting consistently over time</strong> without data gaps—and presenting <em>Asset – Status – Latest Photo – History</em> inside tools engineers already use.

### ④ Austria's Wien Energie (× Boston Dynamics): "Custom Narrow AI &amp; Small Data Flywheels Over Waiting for Data Lakes"
* <strong>The Challenge:</strong>
  * <em>Drone Limits Indoors:</em> Austria's largest Simmering power plant initially trialed <strong>six drones</strong> indoors, but collision risks in tight spaces and <strong>propellers kicking up dust</strong> forced a switch to floor-and-stair quadrupeds (`Spot`: 1 unit completed <strong>4,000+ patrols and 1,600 km</strong>, scaling to 5 units by 2027).
  * <em>Niche Criteria &amp; Onsite Compliance:</em> Reading 7–8 facility-specific items—analog dials, oil sight-glasses, fire extinguisher presence, heat exchangers—could not rely on broad generic AI models. EU compliance also prohibited cloud offloading or remote teleoperation, forcing <strong>100% onsite local processing</strong>.
* <strong>The Solution:</strong>
  * <em>Custom Task AI + SCADA Cross-Verification:</em> An internal robotics team built small custom vision models per inspection type and cross-checked <strong>Spot thermal motor hotspots against abnormal current draw in the plant's main SCADA monitoring system</strong> to confirm developing bearing faults early.
  * <em>Asset-Centric Incremental Integration (Orbit 5.2 Blueprint):</em> As Boston Dynamics' Orbit leadership highlighted in <em>Breaking Down Data Silos in the Physical World</em>, waiting years for a monolithic enterprise data lake stalls ROI. Instead, teams organize data around <strong>Asset Hierarchies + metadata</strong> (routing alerts strictly to pump owners), wire bidirectional <strong>API/Webhook/MCP</strong> workflows with PLC/SCADA triggers, and compound value incrementally via a <strong>Data Flywheel</strong>.

<figure>
  <img src="/images/bd-data-flywheel-architecture.en.svg" alt="Boston Dynamics (Orbit) Bidirectional Loop & Data Flywheel Architecture" />
  <figcaption>Figure 3. Skipping multi-year data lake waits: bidirectional PLC/SCADA triggers, Orbit asset hierarchy routing, and EAM/AI agent integration</figcaption>
</figure>

* <strong>Different Vendors, Same Architectural Convergence:</strong> Whether looking at ATEX Zone 1 quadrupeds (<code>ANYbotics ANYmal X</code> at BASF and PETRONAS), collision-tolerant tank drones (<code>Flyability Elios 3 UT</code> tagging wall-thickness readings directly on 3D LiDAR point clouds), or automated perimeter drones (<code>Percepto</code> at Shell and Chevron), the winning pattern is identical: <strong>(1) 3D/Asset-Tag contextualization, (2) hardware-decoupled ingestion, and (3) direct integration into EAM and process monitoring workflows.</strong>

---

## 3. Completing Inspection Data: The "Asset Context" Closed Loop

Inside many plants today, key digital pillars already advance in silos: enterprise <strong>asset management systems (EAM)</strong> and master data cleanup, plant <strong>3D Maps</strong> with monitoring coordinates, <strong>Smart P&amp;IDs</strong>, vision AI models, and drone/quadruped trials.

Without wiring these pillars together, drone and robot footage remains an isolated media folder. Applying the lessons above yields two prerequisite design rules:

1. <strong>Decouple Field Ingestion from Asset Context:</strong> Keep OT field collection (robots, drones, dock offload) independent of hardware vendors so internal Asset Context schemas stay intact across future hardware replacements.
2. <strong>Skip the All-Encompassing Data Lake — Spin One Unit's Flywheel First:</strong> Connect <code>Asset Tag + 3D Map + Smart P&amp;ID</code> end-to-end on one pilot unit, then pair on-premise task inference with <code>DCS/PI</code> process cross-checks inside the air-gapped network.

<figure>
  <img src="/images/physical-ai-context-loop.en.svg" alt="Asset Context Architecture and Closed Loop for Plant Physical AI" />
  <figcaption>Figure 4. Connecting asset masters, 3D maps, smart P&amp;IDs, and maintenance history into a closed-loop AI Ready Data architecture</figcaption>
</figure>

Once connected, inspection data enters a four-stage closed loop:

1. <strong>Unified Asset Context Binding:</strong> Map EAM <code>Asset Tags</code>, 3D Map coordinates, and smart P&amp;ID nodes 1:1 to physical assets (unifying drone 3D LiDAR tags and quadruped patrol waypoints under the same ID).
2. <strong>AI Ready Contextualization:</strong> Enrich footage with fluid specs, metallurgy, nominal wall thickness, prior repairs, and operating context:
   > <em>"Captured at pipe-rack coordinate [X, Y, Z], mapped to Asset Tag [ID] and P&amp;ID node [Node]—carrying [fluid], [age] years old, nominal thickness [mm], with current process conditions and repair history."</em>
3. <strong>Dock Sync, Inference &amp; EAM Action:</strong> After dock upload, tailored on-premise AI proposes suspect checkpoints; engineers review and emit EAM work orders directly.
4. <strong>Path Recommendation &amp; Retraining:</strong> Accumulated contextual history recommends next-round inspection priorities while feeding confirmed labels back into model retraining.

---

## 4. Pragmatic Conclusion: Strategy for a Single Mega-Site Process Plant

Unlike multi-site discrete manufacturers cloning identical lines globally, a <strong>single mega-site refinery or petrochemical complex</strong> risks stalling at PoCs if it tries to build a massive custom fleet OS from scratch or commercialize an internal platform across peers with wildly different legacy data.

Looking toward 2030, three pragmatic priorities stand out:

1. <strong>Plug Into Existing Asset Systems Like "One More Mobile Sensor"</strong>
   * Rather than spinning up a heavyweight new robotics OS or waiting on a giant data lake, thread a lightweight <strong>Asset Context schema (`Asset Tag + 3D + P&amp;ID`)</strong> end-to-end across a single pilot unit on top of existing EAM, 3D Map, and Smart P&amp;ID infrastructure to start the Data Flywheel.
2. <strong>Buy Robots Later in 2030 — Only We Can Build Our Asset Context Today</strong>
   * As vendors increasingly push "minutes-to-deploy" autonomous navigation and zero-shot VLM checks, <strong>the remaining bottleneck paradoxically shifts entirely to our internal Asset Context and acceptance criteria.</strong> Hardware and generic vision models will commoditize; mapping our specific tags, drawings, 3D coordinates, and repair histories cannot be outsourced.
3. <strong>Prove Clear Single-Site ROI on 1–2 Niches with Real Operational Runway</strong>
   * Focus on high-payback niches inside the fence—such as scaffolding-free tank/elevated drone inspections, hazardous Ex-zone patrols, or Shut-down/Start-up transition checks (the <em>Woodside</em> approach)—and give deployments at least a multi-month operational runway inside real workflows so they become daily tools rather than novelty demos (<em>bp</em>'s three-month offshore lesson).

<em>(And when future scope expands from perception ("Eyes") into fine-tuning field manipulation ("Hands"), expert-demonstration imitation learning (`LeRobot`/`ACT`), physics simulation (`MuJoCo`/`Isaac Sim`) validation, and an <strong>Orchestrator</strong> separating execution workflows from independent safety interlocks will naturally form the next engineering chapter.)</em>

---

### References &amp; Official Sources
* [Hankook Kyungje China Watch — Reality Check on Humanoid Factory Deployments](https://www.hankyung.com/article/202611135386i)
* [Cognite Customer Story — Equinor: Robotics &amp; AI for Safer Field Operations](https://www.cognite.com/en/resources/customer-stories/cognite-and-equinor-leverage-robotics-and-ai-to-reinvent-safer-smarter-field-operations)
* [Cognite Customer Story — Aker BP: Advancing Offshore Robotics &amp; Remote Operations](https://www.cognite.com/en/resources/customer-stories/aker-solutions-aker-bp-and-cognite-advance-robotics-for-the-yggdrasil-development)
* [Korial Case Study — Autonomous Inspection at Shell Rheinland](https://www.korial.com/customer-stories/shell-rheinland)
* [Boston Dynamics Case Study — GlobalFoundries (200mm Fab)](https://bostondynamics.com/case-studies/globalfoundries/) / [Yonhap News — GlobalFoundries Sub-fab &amp; Atlas Expansion](https://www.yna.co.kr/view/AKR20261118035400003)
* [Boston Dynamics Case Study — Kirin Brewery's Chitose Plant (`Orbit + AIMOS-DX`)](https://bostondynamics.com/case-studies/kirin-brewerys-chitose-plant-begins-full-scale-deployment-of-spot/)
* [Boston Dynamics Case Study — Wien Energie: Spot Working at More Austrian Power Plants](https://bostondynamics.com/case-studies/spot-working-at-more-austrian-power-plants/)
* [Boston Dynamics Tech Blog — A New Approach to Predictive Maintenance Challenges](https://bostondynamics.com/blog/a-new-approach-to-predictive-maintenance-challenges/)
* [Boston Dynamics Tech Blog — Breaking Down Data Silos in the Physical World](https://bostondynamics.com/blog/breaking-down-data-silos-in-the-physical-world/)
* [Boston Dynamics Case Study — bp Offshore Robotics Deployment](https://bostondynamics.com/case-studies/bp/) / [Woodside Energy Case Study](https://bostondynamics.com/case-studies/woodside/)
* [Flyability — Elios 3 Ultrasonic Thickness (UT) Inspection Payload](https://www.flyability.com/elios-3-ut-payload)
* [ANYbotics Case — ANYmal X Deployment at BASF Chemical Plant](https://www.anybotics.com/news/anymal-case-basf-chemical-plant/)
* [KBS Docu Insight Ep. 294 "AI: Playtime Is Over" (YouTube)](https://youtu.be/TsiNuMoqg-Y)
