---
layout: ../../../layouts/PostLayout.astro
lang: en
slug: 02-baemin-eta-60min
alt: /posts/02-baemin-eta-60min/
category: Architecture
title: "Why Did the Food Delivery App Show 60 Minutes on a Rainy Friday?"
subtitle: "Dual Feature Stores, Data Drift, and Quantile Regression Behind Food Delivery ETA"
date: "2026.10.29"
---

## Introduction: "It Took 48 Minutes, So Why Did It Say 60?"

<figure>
  <img src="/images/rainy-delivery.jpg" alt="A delivery scooter riding through heavy rain on a city street" loading="lazy" />
  <figcaption>Photo: A courier riding through a heavy downpour on urban streets (Source: <a href="https://unsplash.com/photos/scooter-rider-in-heavy-rain-on-a-city-street-PtDEHmdL7ik" target="_blank" rel="noopener">Unsplash</a>)</figcaption>
</figure>

On a rainy Friday evening, opening a food delivery app like Baemin, Coupang Eats, or UberEats reveals an immediate shift. The neighborhood chicken joint that usually promises "30 to 40 minutes" suddenly displays a blunt estimate: **"Estimated Arrival: 60 min"**.

Hungry and impatient, you place the order. Yet when the courier actually rings the doorbell, only 48 minutes have passed. Nobody called the restaurant's kitchen to ask, *"What is the oil temperature right now, and how many tickets are in front of this order?"* How did the platform anticipate bottlenecks in both the kitchen and the streets to display 60 minutes in advance? And why did it present a generous 60-minute window rather than the exact 48 minutes?

Tracing the answers to these questions uncovers several canonical design patterns in modern production machine learning systems.

From an **Offline Feature Store** aggregating long-term historical baselines, to an **Online Feature Store** streaming live kitchen backlogs and road network conditions in milliseconds; from **Data Drift** shifting feature distributions during heavy rain, to **Quantile Regression** safeguarding against asymmetric business costs.

The challenges of managing physical transport delays (dead-time) across kilometers of chemical plant piping and the methods used by food delivery platforms to clear Friday evening bottlenecks share a striking engineering symmetry.

---

## 1. The Optical Illusion of Straight Lines and the OSRM Routing Engine

Deconstructing total delivery duration ($T_{total}$) yields three distinct operational phases:

$$T_{total} = T_{prep}\text{ (Kitchen prep)} + T_{pickup}\text{ (Courier travel to merchant)} + T_{dropoff}\text{ (Courier transit to customer)}$$

(For bundled multi-order delivery services like Coupang Eats or Baemin Delivery, this equation is further extended by vehicle routing problem algorithms optimizing intermediate drop-off waypoints.)

Even the seemingly straightforward transit leg, $T_{dropoff}$, cannot be solved with planar map coordinates alone. A straight-line distance of 1.5 km between a storefront and an apartment does not mean a courier can ride 1.5 km.

Rivers require bridges and major detours; apartment complexes feature one-way access gates and pedestrian flyovers; urban highways strictly prohibit scooters. In a technical retrospective by Woowahan Brothers (the operators of Baemin), [Building a Real-Road Distance System to Improve Dispatch Accuracy: OSRM, Kafka, and Redis](https://techblog.woowahan.com/22396/), the engineering team detailed their transition away from Euclidean distance toward a real-road calculation engine powered by **OSRM (Open Source Routing Machine)**.

By leveraging OpenStreetMap topology to compute actual turn restrictions, elevations, and road networks, buffering tens of thousands of routing queries per second during peak hours with **Kafka**, and caching frequent segment traversals in an in-memory **Redis** cluster, the system serves precise route distances in sub-millisecond latencies.

Yet knowing exact road distances still leaves the 60-minute puzzle unsolved. More than half of total delivery duration is governed not by road transit, but by **kitchen bottlenecks** ($T_{prep}$) and **courier supply-demand imbalances**.

---

## 2. Dual Feature Stores: 7-Day Baselines vs. The Past Hour's Surge

How long does it take to fry a batch of chicken? There is no single deterministic answer.

On a quiet Tuesday at 3 PM, 15 minutes is plenty. During peak dinner hours at 7 PM on Friday, that same order might take 40 minutes. For an ML model to infer prep delay in real time, it requires two fundamentally different categories of data simultaneously.

As detailed across Woowahan Brothers' [Polars Adoption Case Study](https://techblog.woowahan.com/18632/) and [AI Services and MLOps](https://techblog.woowahan.com/11582/), alongside landmark papers from Uber Engineering ([Meet Michelangelo](https://www.uber.com/us/en/blog/michelangelo-machine-learning-platform/)) and DoorDash ([Building Riviera](https://careersatdoordash.com/blog/building-a-declarative-real-time-feature-engineering-framework/)), the universal architectural solution is a **Dual Feature Store (Offline vs. Online)**.

<figure>
  <img src="/images/eta-feature-store.en.svg" alt="Dual Feature Store Architecture for Delivery ETA Prediction" />
  <figcaption>Figure 1. Dual Feature Store architecture merging high-throughput batch historical baselines (Offline) with sub-millisecond streaming telemetry (Online)</figcaption>
</figure>

### ① Offline Batch Features (Data Lakehouse Tier)
* **Example Features:** *"Average Friday evening prep duration for this merchant over the past 7 days"*, *"Historical preparation complexity factor for bundle sets vs. single items"*
* **Characteristics:** Derived from tens of millions of historical order slips and receipt logs within a data lakehouse (Snowflake, BigQuery, etc.). Given the sheer data volume, streaming updates on minute-level cadences are cost-prohibitive. Instead, batch engines (such as Polars at Baemin, or Spark across global peers) precompute these aggregations nightly. These features establish the merchant's **baseline operational capability**.

### ② Online Streaming Features (Kafka + Redis / In-Memory Tier)
* **Example Features:** *"Unfinished orders accepted by this restaurant in the last 30 minutes"*, *"Active idle courier density within a 1 km radius"*, *"Live OSRM transit delay on surrounding segments"*
* **Characteristics:** Precomputed 7-day averages are blind to sudden events, like five large catering tickets placed ten minutes ago. Utilizing stream processing frameworks (such as DoorDash's Riviera over Apache Flink or Kafka streaming pipelines), order events and courier telemetry are continuously aggregated and written to ultra-low-latency in-memory stores like **Redis**.

The moment a user taps on a restaurant or opens the checkout sheet, the inference service pulls the **live 1-hour operational indicators from Redis (Online)** and joins them with the **cached 7-day merchant profile (Offline)** within 10 milliseconds, feeding the unified vector into the gradient-boosted tree model (LightGBM / XGBoost).

This is how the platform detects kitchen backlogs without ever dialing the merchant's phone.

---

## 3. Rainy Day Data Drift and Why 60 Minutes Was Served

This leaves the final mystery: if the model estimated an actual delivery duration of approximately 48 minutes, why did the app display **"Estimated Arrival: 60 min"**?

The answer lies at the intersection of **asymmetric business costs** and **Quantile Regression**.

<figure>
  <img src="/images/eta-drift-quantile.en.svg" alt="Rainfall Data Drift &amp; Quantile Regression Safety Margins" />
  <figcaption>Figure 2. Distribution shift under rainy weather conditions and conservative P85 quantile safety margins</figcaption>
</figure>

### ① The Distribution Shift of Weather (Data Drift)
Sudden rainfall drastically alters the input feature distributions of the model:
* **Demand side:** Delivery orders surge as consumers avoid going outside.
* **Supply side:** Couriers log off to avoid slippery road hazards, drastically reducing available fleet density.
* **Transit side:** Reduced visibility and wet asphalt force average scooter travel speeds down by 20% to 30%.

While clear-day delivery durations follow a tight, low-variance Gaussian curve centered around 30 minutes, rainy Friday evenings cause the distribution to stretch heavily to the right, introducing a high-variance, fat-tailed distribution. In machine learning, this shift in input conditions is known as **Data Drift**.

### ② "40 Min Promised, Arrived in 60" vs. "60 Min Promised, Arrived in 48"
In the presence of this high variance, what happens if the model serves the conditional mean (P50), which sits at **48 minutes**?

By statistical definition, exactly 50% of orders will arrive past the 48-minute mark. Because users treat the displayed ETA as a formal service-level agreement (SLA), an order arriving at minute 55 after a 48-minute promise triggers acute frustration, customer support tickets, and platform churn.

Conversely, what happens when the app promises **60 minutes** and the meal arrives in **48 minutes**? No customer complains about receiving their warm dinner 12 minutes early; rather, they feel relief that the food beat the rain.

In digital platform operations, **the business penalty of an under-prediction (tardiness) vastly exceeds the penalty of an over-prediction (early arrival).**

Consequently, production inference services discard symmetric loss functions like Mean Squared Error (MSE) in favor of **Quantile Regression** powered by asymmetric pinball loss. 

On clear, predictable days, the service presents tight P50–P60 estimates. When heavy rainfall expands variance, the system deliberately serves an upper quantile—such as the **85th percentile (P85)** at **60 minutes**—guaranteeing that 85% of deliveries arrive comfortably on or ahead of schedule.

---

## 4. A Plant Engineer's Perspective: Why Don't Industrial Plants Have Feature Stores?

Working in process control across petrochemical and refining plants naturally prompts a question: *"Industrial plants also feature intricately interconnected piping networks, where turning a single valve takes significant physical time before downstream sensors respond. Why don't factories build real-time feature stores like Baemin or Uber?"*

Delving into this question reveals the starkly contrasting engineering approaches demanded by a factory's **'Closed System'** versus a consumer platform's **'Open System'**.

### ① The Plant's Way: APC (Advanced Process Control) and Energy Convergence
In a plant, ML feature stores are not used to maintain target product specifications (On-spec). Instead, plant dynamics are governed by **PID tuning and APC (Advanced Process Control / Model Predictive Control)**.
* Piping and reactors are organically coupled; adjusting a manipulated variable (MV) inevitably incurs a time delay (time constant) before the controlled variable (CV) responds.
* In response, plant controllers do not perform 10ms-scale inference lookups. Rather, to reach target specs rapidly, they follow a control loop that **deliberately inputs aggressive initial energy to trigger a prompt reaction, observes downstream sensor feedback, and gradually throttles back to achieve smooth settling and stabilization**.
* In continuous units such as distillation columns, where operating baselines are strictly established, control adjustments (such as reflux ratios or reboiler duties) propagate through vapor-liquid equilibrium profiles almost immediately. The primary role of machine learning in such plants is not high-throughput feature stores, but rather **Soft Sensors** (virtual analyzers predicting unmeasured stream qualities in real time) or predictive equipment failure detection.

### ② Why Delivery Platforms Built the "Feature Store Beast"
An industrial plant is a **'Closed System'** contained within heavy steel piping and pressure vessels, strictly governed by physical and thermodynamic transport equations. Even when transport lag occurs, it remains deterministic and modelable under physical laws.

A food delivery platform, by contrast, operates across sprawling urban street networks—a quintessential **'Open System'**:
* Stochastic weather disturbances (sudden downpours),
* Abrupt kitchen bottlenecks and kitchen equipment failures,
* Spontaneous courier decisions to halt riding due to road hazards.

Events in an open system cannot be described by differential equations. To rein in massive stochastic uncertainty where the environment and human actors fluctuate unpredictably, software engineers had to engineer an entirely different architecture: an **ultra-low-latency Feature Store** that anchors baselines with 7 days of batch statistics (Offline) while continuously joining the latest 1 hour of event streams (Online), paired with **Quantile Regression** to defend against asymmetric tardiness costs.

Industrial APC stabilizing closed physical systems, and dual Feature Stores taming open-world uncertainty. While the domains are fundamentally different, the engineering endeavor to conquer physical space and time through mathematics and software remains deeply aligned.

---

## What Comes Next: When the Merchant Taps [60 min]

This brings us to an equally critical question:

> *"What if the fryer suddenly broke down, or an unexpected wave of dine-in customers walked in, prompting the merchant to manually mash the [60 min] button on their Baemin or Coupang Eats tablet? Does the algorithm take their word at face value?"*

In a kitchen devoid of IoT sensors, the sole digital telemetry point revealing hidden ground truth is **the merchant's finger**. Yet human input is rarely unbiased.

In the upcoming post, **〈[Part 2] When the Merchant Taps [60 min], How Much Does the Algorithm Actually Trust Them?〉**, we will explore the **Human-in-the-loop** architecture that digests manual overrides as live ML features, and the **dispatch jitter optimization** required to minimize both food cooling time and courier street idling.

---

### References & Primary Sources
- Woowahan Brothers Tech Blog, [Building a Real-Road Distance System to Improve Dispatch Accuracy: OSRM, Kafka, and Redis](https://techblog.woowahan.com/22396/)
- Woowahan Brothers Tech Blog, [Accelerating Data Processing with Polars: Real-World Adoption Case](https://techblog.woowahan.com/18632/)
- Woowahan Brothers Tech Blog, [AI Services Inside Baemin: MLOps and Serving Adoption](https://techblog.woowahan.com/11582/)
- Uber Engineering Blog, [Meet Michelangelo: Uber's Machine Learning Platform](https://www.uber.com/us/en/blog/michelangelo-machine-learning-platform/)
- DoorDash Engineering Blog, [Building Riviera: A Declarative Real-Time Feature Engineering Framework](https://careersatdoordash.com/blog/building-a-declarative-real-time-feature-engineering-framework/)
