---
layout: ../../../layouts/PostLayout.astro
lang: en
slug: 00-prologue
alt: /posts/00-prologue/
category: Essay
title: "A 5-Year Retrospective, and Why I Started Writing Here"
subtitle: "Reflections on building digital and AI systems inside oil and petrochemical plants, and notes for what comes next"
date: "2026.10.28"
---

## Entering Year Five

I recently entered my fifth year working as an engineer in the refining and petrochemical industry.
Over the past several years, my work has revolved around solving plant-floor problems with data and AI—ranging from real-time process yield optimization across a thousand sensors to computer vision for radiographic pipe inspection and retrieval systems for engineering contracts.

The biggest lesson from these years is simple: behind every digital service we take for granted—and every industrial system that actually survives in production—lies a chain of deliberate architectural trade-offs.

## What Matters More as AI Gets Stronger

In an era where AI can draft code and generate system outlines in seconds, it is easy to wonder whether studying foundational concepts and system internals still matters.

My experience on the ground pointed in the opposite direction.
The more capable AI tools become, the firmer your **fundamentals** need to be—so you can frame the right problem, choose a realistic architecture, and judge whether an output will hold up under real constraints.

Instead of narrowing my role, AI has expanded what a single engineer who understands both the domain and the digital stack can build.

## The Reality on the Plant Floor

Across manufacturing and process industries, Physical AI—quadruped robots and autonomous drones—has become a major focus. On the surface, fully autonomous "dark factories" look just around the corner.

Yet when you look closely at actual plant operations, very practical hurdles remain:
- Drones and robots complete their rounds, only for someone to manually pull an SD card, upload bulk video files to storage, and leave them unused—or manually screenshot frames for reports.
- Strict security rules restrict GPS usage, and even transferring data over Wi-Fi from a docking station requires clearing IT/OT network segregation and security reviews.
- Above all, there is often a missing link between raw sensor capture, automated analysis, and the legacy maintenance systems (such as SAP PM) where real work happens.

Bringing in external consultants to replace everything from scratch sounds appealing in theory, but real organizations rarely work that way. That gap is precisely where engineers who understand both plant constraints and modern software architecture can make a difference.

## What I Will Document Here

I once started a `TIL` repository on GitHub to jot down isolated technical terms, only to stop a few months later.

Here, I want to take a more enduring approach:
1. **Unpacking the technical architecture and trade-offs behind everyday digital services**
2. **Sharing practical engineering notes on making AI and data pipelines work in industrial plants**

No grand slogans—just a steady record of learning and building.
