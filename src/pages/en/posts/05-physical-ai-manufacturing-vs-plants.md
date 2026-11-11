---
layout: ../../../layouts/PostLayout.astro
lang: en
slug: 05-physical-ai-manufacturing-vs-plants
alt: /posts/05-physical-ai-manufacturing-vs-plants/
category: Industrial AI
title: "Why Do Humanoids in Assembly Plants and Robots in Process Facilities Take Completely Different Paths?"
subtitle: "From Tesla & BMW to NIO & UBTECH — Field trials in manufacturing vs. engineering constraints in petrochemical plants"
date: "2026.11.11"
---

## Introduction: Humanoids on Assembly Lines, Quadrupeds in Process Plants

Humanoid robots have recently accelerated their trials in automotive manufacturing across both the United States and China. Notable examples include Tesla's Optimus, Figure AI's Figure 02 piloting at BMW's Spartanburg plant, and UBTECH's Walker S operating along assembly lines at NIO and Zeekr.

Looking at oil refineries, petrochemical complexes, offshore platforms, or large-scale power stations, however, the landscape looks completely different. Bipedal humanoids are virtually absent; instead, quadrupedal robots (Boston Dynamics Spot, ANYbotics ANYmal X, Deep Robotics X30) and specialized caged drones (Flyability Elios 3) dominate the field.

While my previous article ([`01. Where Does Physical AI Actually Stand in Industrial Plants?`](/en/posts/01-physical-ai-in-plants/)) explored the data pipeline connecting robotic telemetry to enterprise maintenance systems (such as SAP PM) across strict plant network security layers, this post explores **why robotics form factors and operational models diverge so sharply across industries**, analyzed through physical environments and safety regulations.

---

## 1. Semiconductor Cleanrooms Are Extreme, So Why Are They Full of Robots?

When discussing industrial environments, an intuitive question often arises:

> *"If petrochemical plants are challenging, isn't a semiconductor cleanroom where not a single dust particle is allowed under far stricter environmental controls? Why are semiconductor fabs nearly 100% automated by robots around the clock?"*

Semiconductor fabs are among the most automated facilities in the world. Overhead Hoist Transport (OHT) vehicles glide along ceiling tracks carrying wafer cassettes, while EFEM (Equipment Front End Module) robotic arms load wafers into nanometer-scale fabrication tools 24/7 without human intervention.

However, semiconductor cleanrooms and petrochemical plants differ fundamentally in **the direction of safety regulation and the mechanical nature of the objects handled**:

| Dimension | Semiconductor Cleanroom | Petrochemical & Process Plant |
| :--- | :--- | :--- |
| **Regulatory Objective** | **Dust-free (Contamination Prevention)**: Prevent robot mechanisms from emitting particles into the room (ISO Class 1–4) | **Explosion-proof (Hazard Prevention)**: Prevent internal electrical sparks or hot surfaces from igniting ambient gas (Zone 1) |
| **Atmospheric State** | Actively recirculated, filtered clean air (no explosive vapor; toxic gases strictly sealed in vacuum lines) | Air may naturally form flammable or explosive gas mixtures (hydrocarbons, ethylene, hydrogen) |
| **Flooring & Pathways** | Perfectly flat indoor flooring, fixed elevated rails, constant temperature and humidity | Outdoor exposure to rain and wind, open steel grating, 45-degree steel stairways, 10-meter pipe racks |
| **Payload & Required Torque** | Standardized, ultra-light wafer cassettes (FOUP) transferred with vibration control (torque under a few Nm) | Metal valves and pipe flanges frozen over decades of thermal cycles (breakaway torque 100–200 Nm or higher) |

In a cleanroom, the engineering problem is solved by **preventing internal friction particles from escaping**—using non-dusting cable carriers, Teflon seals, and brushless DC motors. Crucially, floors are completely flat and transit paths are structured and pre-programmed.

In petrochemical plants, however, core operational areas are classified as **Zone 1** (explosive gas atmospheres likely to occur during normal operations). An electrical switching arc or thermal spike from a battery pack can trigger a catastrophic facility fire. Consequently, equipment is legally mandated to employ positive-pressure inert gas enclosures (Ex p) or flameproof, pressure-resistant housings (Ex d) to eliminate ignition sources.

<figure>
  <img src="/images/discrete-vs-process-plant.svg" alt="Discrete Manufacturing vs Continuous Process Plant Environment Comparison" />
  <figcaption>Figure 1. Comparison of physical environmental constraints between discrete assembly lines and continuous process plants</figcaption>
</figure>

---

## 2. Humanoid Pilots in Discrete Manufacturing: Reality Checks from the US and China

Discrete manufacturing environments (automotive and electronics assembly) feature standardized component geometries and flat indoor flooring, making them the primary proving ground for bipedal humanoids.

Recent factory trials in the US and China highlight both real progress and technical bottlenecks:

### ① BMW Spartanburg Plant, USA (Figure 02)
- In 2024, BMW tested Figure AI's Figure 02 in sheet metal framing, placing sheet metal components into chassis fixtures with sub-millimeter precision.
- Utilizing Vision-Language-Action (VLA) models, the robot autonomously adjusted its trajectory when component positions varied slightly.
- However, matching the automotive assembly line's relentless **37-second Takt time** proved challenging: neural network inference latencies and multi-axis joint actuation could not yet match the fluid speed of seasoned line workers. Additionally, thermal buildup in joint actuators and limited battery life (2–3 hours) during continuous manipulation presented hurdles for high-volume deployment.

### ② NIO and Zeekr Plants, China (UBTECH Walker S / S1)
- Chinese EV manufacturers have aggressively integrated humanoids into smart manufacturing initiatives:
- **NIO F2 Factory**: UBTECH's Walker S was deployed along the final assembly line to perform door-lock quality inspections, seatbelt fastening checks, and headlight cover installations alongside human technicians.
- **Zeekr 5G Intelligent Factory**: Multiple Walker S1 humanoids collaborated with Autonomous Mobile Robots (AMRs) using Swarm Intelligence to pick and transport logistics bins.
- The shared takeaway from these Chinese trials: **visual quality inspection and lightweight parts transfer are viable today, but high-torque fastening tasks and sub-minute cycle times remain in early validation stages.**

---

## 3. Why Process Plants Chose Quadrupeds and Caged Drones Over Humanoids

The primary challenge in continuous-process facilities is not fine-grained manipulation with artificial fingers, but safely detecting early equipment anomalies in hazardous, high-temperature, or toxic areas where human entry is restricted.

<figure>
  <img src="/images/observation-vs-manipulation-barrier.svg" alt="Physical Barriers from Observation to Manipulation" />
  <figcaption>Figure 2. Why Observation is entering commercial scale while Manipulation remains in early proof-of-concept stages</figcaption>
</figure>

### ① Explosion-Proof Quadrupeds (ANYmal X & Deep Robotics X30)
Operating inside petrochemical facilities requires formal hazardous location certification (ATEX/IECEx Zone 1):
- **ANYbotics ANYmal X (Switzerland)**: Its central compute and battery bays are pressurized with **inert nitrogen gas (Ex p)**, while joint actuators are housed in explosion-proof flameproof casings (Ex d). It achieved the world's first IECEx/ATEX Zone 1 certification for a legged robot and is deployed at Shell, BASF, and Petronas sites.
- **Deep Robotics X30 (China)**: Equipped with IP67 ingress protection, gas leak sensors, and optical gas imaging (OGI) cameras, the X30 performs autonomous patrols at Sinopec refining complexes and Ningbo Steel facilities.
- Both systems deliberately forego multi-finger manipulation hands. Instead, they focus strictly on **non-contact telemetry (Observation)** via thermal, acoustic, and gas detectors.

### ② The Engineering Economics of Motorized Actuators (MOV/AOV) vs. Robot Manipulation
Plant pipeline valves, exposed to years of outdoor weather and thermal expansion, often seize. Field operators routinely use cheater bars (extension pipes) with their full body weight to apply **100 to 200 Nm or more of breakaway torque**.

Most existing robotic arms provide continuous torques of only 20 to 30 Nm. Forcing open a frozen valve risks stripping harmonic drive gearboxes and creating dangerous mechanical friction sparks in hazardous zones.

More fundamentally, the financial and operational calculus is clear:
> *"Rather than dispatching a multimillion-dollar robotic arm to manually crank stubborn valves, mounting a Motor Operated Valve (MOV) or Air Operated Valve (AOV) directly onto the valve stem and controlling it from the central Distributed Control System (DCS) is far safer, faster, and more reliable."*

### ③ Rapid ROI from Scaffolding-Free Confined Space Drones (Flyability Elios 3)
During plant turnaround (TA) maintenance, inspecting the internal shell walls of massive storage tanks non-destructively previously required **weeks of labor and substantial capital just to erect and dismantle internal steel scaffolding (staging)**.

<figure>
  <img src="/images/elios-3-tank-inspection.png" alt="Flyability Elios 3 caged drone for confined space inspection" loading="lazy" />
  <figcaption>Figure 3. The Elios 3 caged drone equipped with collision-tolerant roll-cage, LiDAR SLAM, and ultrasonic thickness measurement (UT) payloads (Source: MFE Inspection Solutions)</figcaption>
</figure>

Flyability's **Elios 3** replaces internal scaffolding by enclosing its propellers in a carbon-fiber cage and navigating GPS-denied tanks using 3D LiDAR SLAM while taking ultrasonic wall thickness readings to 0.1 mm precision.

By eliminating scaffolding erection costs, shaving weeks off turnaround schedules, and keeping human inspectors out of oxygen-deficient confined tanks, **it delivers a clear, rapid return on investment.**

---

## Conclusion: Realistic Roadmaps Shaped by Industrial Constraints

Robotics is not converging into a single universal form factor. Instead, systems are diversifying into the most practical and cost-effective architectures dictated by each industry's physical environment and regulatory boundaries:

```
[Physical AI Adoption Paths by Industry]

1. Discrete Manufacturing (Automotive, Electronics):
   - Structured, flat indoor production floors
   - Focus on foundation models (VLA), inference acceleration, and cycle time reduction

2. Continuous Process Plants (Refinery, Petrochemical, Utilities):
   - Step 1: Eye (Autonomous non-contact patrol via Zone 1 quadrupeds & caged drones) ──▶ TRL 8–9 (Commercialized)
   - Step 2: Brain (Integrating robot sensor streams into DCS/historians for predictive maintenance) ──▶ TRL 6–7 (Scaling)
   - Step 3: Hand (Specialized remote teleoperation for toxic sampling where AOV/MOV retrofits are infeasible) ──▶ TRL 3–5 (Long-Term R&D)
```

Objectively analyzing real-world physical constraints and connecting the right hardware with reliable data workflows—rather than being swayed by promotional aesthetics—is the foundation of practical industrial AI engineering.

---

### References & Official Sources
- [BMW Group Press — Humanoid Robots in Automotive Production: Figure 02 Pilot at Plant Spartanburg](https://www.bmwgroup.com)
- [UBTECH Robotics — Walker S Humanoid Robot Deployed in NIO & Zeekr Smart Factories](https://www.ubtrobot.com)
- [ANYbotics — ANYmal X: The World's First Ex-Certified Legged Inspection Robot](https://www.anybotics.com)
- [Deep Robotics — Jueying X30 Industrial Quadruped Robot for Petrochemical Inspections](https://www.deeprobotics.cn)
- [Flyability — Elios 3 Confined Space Drone & Ultrasonic Thickness Testing (UT)](https://www.flyability.com)
- [ISO 14644-1 Cleanrooms and Associated Controlled Environments / IECEx Standards](https://www.iso.org)
