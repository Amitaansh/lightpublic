# L.I.G.H.T — Technical Requirements Document (TRD)

> **Status:** DRAFT v0.5 (cane add-on pivot, reliability architecture, Guide Notes, Route Memory) · **Last updated:** 2026-10-31
> Supersedes: TRD v0.4 (2026-09-01) in [`../docs/03_trd.md`](../../docs/03_trd.md) (outside this repo)
> Companion document: [PRD](01_prd.md)
> Tags: **[OPEN]** = undecided · **[ASSUMPTION]** = inferred · **[REC]** = engineering recommendation, pending decision · **[PROTO]** = early-prototype choice · **[PROD]** = production direction · **[DECIDED 10-31]** = confirmed by founder this pass
> Hardware IDs TRD-HW-001…013 are kept stable. New hardware starts at TRD-HW-014. New subsystems use TRD-REL (reliability), TRD-GN (Guide Notes) and TRD-MEM (Route Memory). Named parts are **illustrative**, not selected.

## 1. System overview & architecture

L.I.G.H.T is an **offline-first, real-time embedded system in two independent halves** **[DECIDED 10-31: principle]**:

1. **Main system:** sensors, an edge-AI processor, perception, sensor fusion, alert arbitration, Guide Notes and Route Memory.
2. **Safety core:** a small, separate microcontroller with its own proximity sensors, its own power reserve and its own path to the haptics. It runs **all the time**, checks that the main system is alive, and takes over basic obstacle warning if the main system fails.

The physical cane sits below both as the last fallback (PRD §6.2). Clipped to a cane, the unit treats ground level as covered by the cane tip; standalone, ground-level sensing becomes mandatory.

```mermaid
flowchart LR
  subgraph SENSE[Main sensing]
    L[LIDAR / ToF forward + overhead]
    C[Cameras wide-FoV + IR/NIR]
    M[Mic array]
    I[IMU]
    G[GNSS]
  end
  subgraph MAIN[Main compute - edge-AI SoC]
    P[Perception]
    F[Fusion + world model]
    T[Threat path < 50 ms]
    LOC[Localisation on saved routes]
    MEM[Route Memory store]
    GN[Guide Notes store]
    A[Alert arbitration]
  end
  subgraph SAFE[Safety core - independent MCU]
    S[Ultrasonic + ToF proximity]
    W[Watchdog / heartbeat monitor]
    B[Reserved battery rail]
  end
  subgraph OUT[Output]
    H[Haptics]
    E[Earbud TTS + playback]
  end
  CANE[(White cane - physical fallback)]
  APP[Companion app BLE]

  L --> F
  C --> P --> F
  C --> T
  M --> T
  I --> F
  I --> LOC
  G --> LOC
  L --> LOC
  LOC <--> MEM
  LOC --> GN
  F --> MEM
  F --> A
  T --> A
  MEM --> A
  GN --> A
  A --> H
  A --> E
  MAIN -. heartbeat .-> W
  S --> H
  W --> H
  B --> SAFE
  APP <--> GN
  APP <--> MEM
```

## 2. Hardware components

| ID | Component | Decision / recommendation |
|---|---|---|
| **TRD-HW-001** | **Main compute** (changed v0.5) | **[REC]** a **low-power** edge-AI SoC with an NPU. The v0.4 Jetson Orin Nano-class part is too heavy and power-hungry for a ≤ 150 g clip-on (PRD-NF-004). Candidates: NXP i.MX 8M Plus-, Qualcomm QCS-, Rockchip RK3588S-class SoCs, or a small host plus a Hailo-class NPU. **[OPEN]** **Option:** run object ID (not safety) on the paired phone to save weight and power, see §11. |
| **TRD-HW-002** | **LIDAR / ToF ranging** (changed v0.5) | **Cane mode:** forward and overhead priority. **[REC]** 2–4 solid-state multi-zone ToF modules (forward, forward-up, left, right). **Standalone:** add a ground-facing module for drop-offs and kerbs. No spinning parts on a cane that gets knocked. |
| **TRD-HW-003** | **Cameras** | **[REC]** 1–2 wide-FoV, IR-capable cameras facing forward, ≥ 30 fps. Full 360° camera coverage moves to **[Secondary]** for cane mode, since the user's body blocks the rear. |
| **TRD-HW-004** | **Microphone array** | Acoustic threat cues with direction-of-arrival. **Also records Guide Notes** (TRD-GN-001); beamforming toward the speaker improves note quality. |
| **TRD-HW-005** | **Haptic actuators** (changed v0.5) | LRA-class actuators, **[REC]** 6–8 in cane mode (fewer than v0.4's 8–16 to save weight). **Placement [OPEN]:** (a) grip sleeve that replaces or covers the cane grip, (b) a pad under the index finger, (c) a wrist band. Must be drivable by **both** the main system and the safety core (TRD-HW-015). |
| **TRD-HW-006** | **IMU (accel + gyro + mag)** | **Essential, more so than in v0.4.** On a cane the unit swings with every sweep; the IMU stabilises the world model and the haptic direction to the user's **walking heading**, and drives step-based dead reckoning for Route Memory (TRD-MEM-002). |
| **TRD-HW-007** | **GNSS** | GPS/Galileo. Coarse position for Route Memory and navigation. Not enough alone for obstacle-level memory (TRD-MEM-002). |
| **TRD-HW-008** | **In-ear module** | Single wireless earbud, one ear open. Plays TTS, alerts, Guide Notes and route replay. |
| **TRD-HW-009** | **Battery + wireless charging** (changed v0.5) | Main battery plus a **reserved partition** for the safety core (TRD-HW-017). **[ASSUMPTION]** ≥ 1 full day of full features; much longer for the safety core alone. Wireless charging dock retained. |
| **TRD-HW-010** | **Connectivity** | BLE to earbud and phone. Every core function, **including Guide Notes and Route Memory**, works offline. |
| **TRD-HW-011** | **Enclosure** (changed v0.5) | IP-rated (**[REC]** IP54 minimum, **[OPEN]**); built for cane knocks, vibration and drops (PRD-NF-010). |
| **TRD-HW-012** | **Physical controls** (changed v0.5) | Braille-labelled buttons: **Identify**, **Replay**, **Record** (press-and-hold, with a guard against accidental presses), **Status** ("what's working?"). **[OPEN]** final count and layout. |
| **TRD-HW-013** | **Night-vision path** | NIR illuminator + IR-capable cameras. The safety core's ultrasonic sensors do not depend on light. |
| **TRD-HW-014** | **Cane mount and mode detection** (new) | Tool-free quick-release clamp with swappable inserts for different shaft sizes **[ASSUMPTION: range to be measured]**. A magnet in the clamp and a Hall sensor in the unit detect **cane mode vs. standalone** (PRD-F-018/019). Standalone needs a grip shell or handle cover. **[OPEN]** |
| **TRD-HW-015** | **Safety-core MCU** (new) | Low-power microcontroller (**illustrative:** Cortex-M4/M33 class), physically separate from the main SoC. Own firmware, own clock, hardware watchdog. Direct line to the haptic driver, so it can vibrate the actuators even if the main SoC is dead. |
| **TRD-HW-016** | **Safety-core sensors** (new) | **[REC]** 1–2 ultrasonic sensors (work in darkness and sunlight, and detect glass) plus 1 single-zone ToF (overhead). Wired only to the safety core. Forward and overhead coverage. |
| **TRD-HW-017** | **Power partition** (new) | A separate regulator and power path from the battery to the safety core. When the battery reaches the reserve threshold, the main system is shut down first (PRD-F-024). **[REC]** reserve sized for **≥ 4 hours** of safety-core-only operation. **[ASSUMPTION]** |
| **TRD-HW-018** | **On-device storage** (new) | Encrypted flash (**[REC]** 16–32 GB eMMC/UFS) for Guide Notes, route data, and models. Encryption key held in a secure element or the SoC's secure enclave. |

## 3. Sensing & perception

- **[PROD/REC]** quantized on-device detectors (YOLO-class) on the NPU. The POC's web pipeline (TRD-CV-001…005: YOLOv8n, Depth Anything V2 Small, tracking, tiered fallback to COCO-SSD) carries forward as the reference behaviour.
- **Threat classification** is fused from cameras, microphones and ranging motion.
- **Cane-mode compensation:** perception runs on IMU-stabilised frames; detections are placed in a heading-stable frame, so a sweeping cane does not make obstacles appear to jump left and right.
- **Priority classes:** vehicles, people, cyclists, poles/bollards, walls, doors, overhanging branches and signs, stairs, kerbs/drop-offs, animals. In cane mode, ground classes are a backup to the cane; in standalone mode they are required.
- **Fixed vs. temporary classification** (new) — every tracked obstacle is labelled **fixed** (pole, bollard, step, wall, bench, branch) or **temporary** (person, vehicle, animal, bin, parked bike). Only fixed obstacles may be stored in Route Memory (TRD-MEM-004).

## 4. Reliability architecture

### 4.1 Principles **[DECIDED 10-31]**
- **No single failure removes basic obstacle warning.** The safety core shares no processor, firmware, sensor or power regulator with the main system.
- **No silent failure.** Every loss of a function is announced.
- **Fail toward caution.** When unsure, warn. Memory and models may add warnings but may never suppress a live sensor warning.

### 4.2 Requirements

| ID | Requirement |
|---|---|
| **TRD-REL-001** | **Heartbeat.** The main SoC sends a heartbeat to the safety core **[REC]** every 50 ms over a dedicated line. Missing **[REC]** 300 ms of heartbeats triggers safety-core takeover (L1). |
| **TRD-REL-002** | **Always-on cross-check.** The safety core runs its proximity sensing at every level, not only after a failure. Persistent disagreement with the main system's world model (e.g. safety core sees a close obstacle the main system does not) raises a warning and is logged. |
| **TRD-REL-003** | **Health monitor.** The main system tracks the health of each subsystem (each camera, each ToF, IMU, GNSS, NPU, earbud link, temperature, battery) and steps down the fallback ladder (PRD §6.2) when a dependency fails. |
| **TRD-REL-004** | **Announcement time.** Any step down the ladder is announced by haptics within **[REC]** 500 ms, and by voice when the earbud is connected. |
| **TRD-REL-005** | **Earbud loss.** If the earbud disconnects, haptics continue and a distinct pattern tells the user that audio is lost. Threat "STOP" falls back to the haptic pattern alone. |
| **TRD-REL-006** | **Power-on self-test** of every sensor, actuator and the safety core; result reported by sound and haptics (PRD-F-023). |
| **TRD-REL-007** | **Thermal and battery step-down.** Smart features shed in a fixed order: navigation → object ID → camera threat classification → main system off; the safety core keeps running. |
| **TRD-REL-008** | **Fault log.** A local, privacy-safe log of level changes and disagreements (no images, no audio), exportable for support only with user consent. |
| **TRD-REL-009** | **Mode-aware fallback.** In standalone mode there is no cane below L1; L1 entry is announced with a stronger, repeated pattern **[REC]**. |

### 4.3 Fallback ladder, technical view

| Level | Running | Trigger to enter |
|---|---|---|
| L4 Full | Main system complete + safety core | Normal |
| L3 Reduced smart | Ranging, cameras, threat path; object ID and navigation off | Battery or thermal threshold; NPU overload; GNSS loss (navigation only) |
| L2 Memory + geometry | Ranging + Route Memory (localised by GNSS + IMU + ToF scan match); camera threat classification off | Camera or perception failure; night with NIR failure |
| L1 Safety core | Safety-core sensors → haptics only | Heartbeat lost; main battery at reserve; main SoC fault |
| L0 Cane | Nothing electronic | Reserve exhausted (final pattern first) |

## 5. Guide Notes (assistor-recorded instructions)

| ID | Requirement |
|---|---|
| **TRD-GN-001** | **Capture.** Press-and-hold **Record** on the device records from the mic array with beamforming. Release stops. **[REC]** max 2 min per note; record start/stop earcons. |
| **TRD-GN-002** | **App capture.** The companion app can record on the phone and transfer the note to the device over BLE. The note is stored and played from the device, not the phone. |
| **TRD-GN-003** | **Encoding.** Opus, **[REC]** ~24 kbps mono (≈ 11 MB per hour of notes). |
| **TRD-GN-004** | **Tagging.** Each note stores: ID, timestamp, GNSS fix, saved-route ID and position along the route (if on a saved route or teach session), duration, optional name. No surrounding audio beyond the note itself. |
| **TRD-GN-005** | **Place trigger.** When the localiser (TRD-MEM-002) places the user within **[REC]** 5 m along-route of a note's position on the same route, or within **[REC]** 10 m by GNSS off-route, the note is queued for playback once per pass. |
| **TRD-GN-006** | **Playback arbitration.** Notes are lower priority than threats and system-health notices; their priority relative to navigation and object ID is user-configurable (PRD-F-007). A threat pauses playback; playback resumes from the start of the sentence after. |
| **TRD-GN-007** | **Storage and privacy.** Encrypted at rest (TRD-HW-018). Never uploaded by default. Deletion removes the audio file and its index entry. |
| **TRD-GN-008** | **Transcription (Later).** On-device speech-to-text for search and an in-app text view. |

## 6. Route Memory (learned paths, remembered obstacles)

| ID | Requirement |
|---|---|
| **TRD-MEM-001** | **Route model.** A saved route is an ordered chain of **waypoints** (every **[REC]** 2–5 m), each holding a GNSS fix, heading, distance along route, and a compact **place signature** (geometric features from ToF/LIDAR plus compact visual descriptors). **No raw images or video are stored.** |
| **TRD-MEM-002** | **Localisation on a route.** Fuse GNSS, IMU step-based dead reckoning, and matching against place signatures to estimate position along the route. **[ASSUMPTION]** target ±2 m along-route on saved routes. Must still work, less precisely, with cameras off (L2) using GNSS + IMU + ToF only; warning zones widen when precision drops. |
| **TRD-MEM-003** | **Teach session.** Start → walk → stop → name (by voice or app). Guide Notes recorded during the session attach to their waypoint. The route is saved only after confirmation. |
| **TRD-MEM-004** | **Obstacle memory.** Each remembered obstacle stores: route ID, distance along route, side offset, height band (ground / body / head), class, confidence, first seen, last seen, times seen. **Only "fixed" classes** (§3). |
| **TRD-MEM-005** | **Confidence update.** Each pass where the obstacle is seen raises confidence; each pass where its spot is clearly observed and it is absent lowers it. Below a threshold it is removed. New fixed obstacles seen on **[REC]** 2 passes are added. |
| **TRD-MEM-006** | **Early warning.** Approaching a remembered obstacle triggers a haptic cue earlier than live sensing would, with a **distinct "from memory" texture**, plus an optional spoken label. |
| **TRD-MEM-007** | **Live sensing always wins.** Memory may add a warning; it may never cancel, delay, or weaken a live sensor or safety-core warning (PRD-F-036). |
| **TRD-MEM-008** | **Replay and rehearsal.** A saved route plays back as an ordered event stream (start, turns, distances, remembered obstacles, Guide Notes, arrival) on the earbud and haptics. Step-by-step or continuous, with adjustable speed. Works with no network. |
| **TRD-MEM-009** | **Automatic route learning (Secondary).** Detect repeated journeys from coarse GNSS traces, then **ask** the user before saving. Coarse traces older than **[REC]** 30 days are deleted if not saved. |
| **TRD-MEM-010** | **Privacy.** Encrypted at rest; per-route and full wipe; no upload by default. Optional encrypted backup to the user's phone or cloud only by explicit opt-in **[OPEN]**. |
| **TRD-MEM-011** | **Capacity.** **[ASSUMPTION]** ≥ 50 routes of ≤ 5 km each; place signatures sized so all routes fit in **[REC]** < 2 GB. |

## 7. Feedback & arbitration

- **Haptic encoding:** position = direction (heading-stabilised), intensity = proximity, top 3 at once. Threat = heavy whole-unit pattern. **New textures** **[REC]**: "from memory" (softer, double pulse), "reduced mode", "basic mode (safety core)", "audio lost", "recording". All must be distinguishable by touch alone; validate with users.
- **Arbitration order [DECIDED 10-31: top two fixed]:** (1) threat, (2) system-health notices, then user-configurable order between navigation, object ID, Guide Notes, and Route Memory labels. The safety core's haptics can always break through.

## 8. Connectivity, companion app & cloud

- BLE to the phone and the earbud. No function in the PRD's v1 scope needs the internet.
- **Companion app (v1):** pair; settings; list, play, rename, re-record, delete Guide Notes; list, rename, delete, replay routes; record notes on the phone (TRD-GN-002); health report.
- **Cloud:** none in v1 by default. Progressive-loss analytics stays opt-in and moves to [Later]. Backup of notes and routes is **[OPEN]**.

## 9. Power, thermal & form factor

- **Central tension (sharper than v0.4):** ≤ 150 g clip-on vs. sensors + NPU + cameras + NIR + a day of battery. **[REC]** treat the power budget as the first engineering task; consider offloading object ID to the phone.
- The safety core plus its sensors should draw **[REC]** < 100 mW.
- Thermal: continuous inference in a sealed unit held near the hand. Surface temperature limit for skin contact applies. **[OPEN]**
- Weight sits close to the grip to keep cane balance; the clamp position is adjustable. **[OPEN]**

## 10. Data, privacy & safety

- **On-device by default** for camera, microphone, Guide Notes and Route Memory. Raw camera and microphone streams never leave the device (TRD-CV-004).
- **Guide Notes** contain the assistor's voice: deliberate start only, audible recording cue, on-device storage, deletable. **[OPEN]** legal review on recording third parties in public across EU member states.
- **Route Memory** is location history: encrypted, deletable, no upload by default. Treat as sensitive personal data.
- **Opt-in cloud analytics (Later):** GDPR Art. 9 explicit consent for health-adjacent data, DPA with provider, encryption in transit and at rest, EU data residency **[REC]**.
- **Safety:** fallback ladder (§4), no silent failure, memory never suppresses live warnings, cane as physical fallback.
- **Regulatory [OPEN]:** whether the product is a general accessibility device or a medical device under EU MDR affects testing and claims. Getting advice is a v1 task.

## 11. Open technical questions & assumptions

**New in v0.5**
- **Haptic placement** on a cane: sleeve, finger pad or wrist (TRD-HW-005).
- **Weight budget** ≤ 150 g vs. compute, sensors and battery (TRD-HW-001/009).
- **Phone offload** for object ID: saves weight and power, but adds a dependency on the phone for a non-safety feature. Safety functions must never depend on the phone. **[OPEN]**
- **Cane compatibility range** and clamp design (TRD-HW-014).
- **Localisation accuracy** on saved routes without cameras (TRD-MEM-002).
- **Haptic texture vocabulary:** how many distinct patterns users can reliably tell apart (§7).
- **Safety-core sensor choice** and false-alarm rate on a sweeping cane (TRD-HW-016).
- **Backup** of notes and routes: none, phone-only, or opt-in cloud (TRD-MEM-010).

**Carried from v0.4**
- Compute for < 50 ms threat inference (TRD-HW-001).
- 360° night coverage and NIR power (TRD-HW-013).
- Point-to-identify aiming (PRD-F-004).
- Exact analytics data and GDPR lawful basis (Later).
