# L.I.G.H.T — Product Requirements Document (PRD)

> **Status:** DRAFT v0.6 rev. 2 (cane add-on pivot, reliability layer, Guide Notes, Route Memory; founder answers of 10-31 applied) · **Last updated:** 2026-10-31
> Supersedes: PRD v0.5 (2026-09-01) in [`../docs/02_prd.md`](../../docs/02_prd.md) (outside this repo)
> Companion document: [TRD](02_trd.md)
> Tags: **[OPEN]** = undecided · **[ASSUMPTION]** = inferred, confirm · **[REC]** = recommendation, pending decision · **[DECIDED 10-31]** = confirmed by founder this pass
> Priority tags: **[v1]** = first product · **[Secondary]** = next · **[Later]**
> Requirement IDs from v0.5 are kept stable. Changed requirements say **(changed v0.6)**; new ones start at PRD-F-016.

## 0. What changed in v0.6

| Area | v0.5 | v0.6 |
|---|---|---|
| **Product form** | Standalone baton that replaces the white cane | **An add-on that clips onto the user's existing white cane**, and detaches to work on its own as a handheld unit **[DECIDED 10-31]** |
| **Positioning** | "Fully replace the white cane" | **Make the cane smarter first.** The cane keeps doing what it already does well (ground contact); L.I.G.H.T adds what it cannot do (distance, overhead, threats, identification, memory) |
| **Reliability** | [OPEN], mid-journey failure fallback undefined | **A defined fallback ladder.** If the whole smart system fails, the user still has a working cane plus an independent basic obstacle sensor. Silent failure is never allowed **[DECIDED 10-31]** |
| **New: Guide Notes** | — | An accompanying assistor records spoken instructions that the user can replay later, on demand or at the place they were recorded **[DECIDED 10-31]** |
| **New: Route Memory** | — | The device learns usual paths and remembers obstacles along them, so feedback and replay work fully offline **[DECIDED 10-31]** |

"Guide Notes" and "Route Memory" are the feature names. **[DECIDED 10-31]**

## 1. Overview & goals

L.I.G.H.T (*LIDAR Integrated Guidance & Handheld Tracker*) is a sensing and guidance unit for blind and visually-impaired people. **The first product clips onto a standard white cane.** It warns about obstacles at a distance and overhead, alerts the user to fast-approaching threats, identifies objects on request, plays back instructions recorded by a sighted assistor, and remembers the routes the user walks often.

The same unit detaches and works as a short handheld device on its own.

**Why the pivot:**
- **It removes the biggest barrier to adoption.** Expert cane users are not asked to give up a tool they trust. They add to it.
- **It answers the hardest safety question.** v0.5 had to match the cane's ground-hazard detection before it could ship. Clipped to a cane, the cane tip still finds curbs, drop-offs and stairs while L.I.G.H.T covers everything above and beyond the tip.
- **It gives the system a fallback that always works.** If every electronic part fails, the user is still holding a working cane.

**Long-term vision (internal only):** a fully trusted standalone device remains the founder's long-term goal. Standalone use earns trust step by step through the reliability layer and Route Memory, rather than being required on day one. **[DECIDED 10-31]** This goal is **not stated on the public site** (§8).

**Success priorities (unchanged):** (1) Safety, (2) User confidence, (3) Adoption.

## 2. Personas

**Persona 1 — The Expert Cane User (beachhead, unchanged).** Totally blind, O&M-trained, highly proficient with the cane, travels independently. Will judge L.I.G.H.T critically. In v0.6 this user **keeps their own cane** and adds L.I.G.H.T to it. Values reliability, speed, dignity, and not having to relearn travel. _[ASSUMPTION: age range, tech comfort — validate in research.]_

**Persona 2 — The Progressive-Loss First-Timer (expansion).** Losing vision later in life, often older, little or no O&M training. Route Memory and Guide Notes are especially valuable here: a family member or instructor teaches a few key routes once, and the device helps repeat them. _[ASSUMPTION — validate.]_

**Persona 3 — The Assistor (new, secondary user).** An O&M instructor, family member, friend or carer who sometimes walks with the user. They **record Guide Notes** and help **teach routes**. Is sighted, may not be technical, and will use the device only briefly. Needs the recording flow to be obvious and quick. _[ASSUMPTION — validate with O&M instructors.]_

## 3. User stories & jobs-to-be-done

**Core sensing (carried from v0.5)**
- As an expert cane user, I want **warning of obstacles before my cane or body touches them**, especially overhead ones my cane cannot reach.
- I want **advance warning of fast-approaching hazards**, so I can stop *before* a collision.
- I want to know **what** an obstacle is, so I can decide how to react.
- I want to **operate everything without sight**.

**Cane add-on and reliability (new)**
- I want to **attach L.I.G.H.T to the cane I already use**, without tools and without changing how I hold or sweep it.
- I want to **know immediately if any part of the system stops working**, and what I can still rely on.
- I want to **detach it and use it on its own** for short trips or indoors when I don't want to carry the cane.

**Guide Notes (new)**
- As a user, I want my instructor or a family member to **record directions in their own voice** while we walk together, so I can **replay them** when I walk the route alone.
- I want a note to **play automatically when I reach the place it was recorded** ("the crossing button is on the pole to your right").
- As an assistor, I want to **record a note with one obvious action**, hear that it was saved, and be able to redo it.

**Route Memory (new)**
- I want the device to **learn the routes I walk often** (home to the station, to work, to the shop).
- On a familiar route, I want **early warning of obstacles it remembers** (a low branch, a bollard, a step), even before its sensors detect them.
- I want to **rehearse a route at home** by replaying it as sound and touch before I walk it.
- I want all of this to **work with no internet connection**.

## 4. Functional requirements

### 4.1 Sensing, feedback and alerts (v0.5 IDs kept)

| ID | Requirement | Priority / status |
|---|---|---|
| **PRD-F-001** | **360° directional haptic feedback** (changed v0.6). A **haptic grip sleeve** that wraps the whole cane grip carries a full ring of actuators around the hand, so all-around feedback works as designed: **position on the ring = obstacle direction**, **intensity rises as distance falls**, continuous and real-time. The direction is **stabilised to the user's walking heading**, not to the sweeping or rotating cane. | **[v1]** · **[DECIDED 10-31: full grip sleeve]** |
| **PRD-F-002** | **Multi-obstacle prioritization.** Convey the **top 3** obstacles at once. Live ranking: threats first (left to right), then nearest first (carried from the POC, TRD-CV-005). | **[v1]** |
| **PRD-F-003** | **Obstacle detection & ranging** (changed v0.6). **Cane mode:** forward and overhead coverage is the priority. Ground level is handled by the cane tip, with sensor coverage as a backup. **Standalone mode:** coverage must include ground level. Full 360° remains a goal. | **[v1]** · [OPEN: 360° in cane mode] |
| **PRD-F-004** | **Object identification (point-to-identify).** The user points the unit at an obstacle and the earbud says what it is. On demand. | **[v1]** · [OPEN: non-visual aiming] |
| **PRD-F-005** | **Audio narration policy.** Relevant-only by default; the user can change verbosity. Only a threat speaks without being asked. | **[v1]** |
| **PRD-F-006** | **Proactive threat detection & alert.** On a threat: the earbud says **"STOP"** and the handle gives a **heavy whole-unit vibration**, clearly different from every other cue. | **[v1]** · Safety-critical |
| **PRD-F-007** | **Alert arbitration** (changed v0.6). A threat **always interrupts** everything. Then system-health alerts (§4.3), then user-configurable order between navigation, object ID, Guide Notes and Route Memory cues. Multiple emergencies are ordered left to right. | **[v1]** |
| **PRD-F-008** | **Turn-by-turn outdoor navigation** by voice. | **[Secondary]** |
| **PRD-F-009** | **Non-visual command & input** via braille-labelled buttons, voice assistant, companion app. | Buttons **[v1]**; voice + app **[Secondary]** |
| **PRD-F-010** | **Companion phone app** (changed v0.6). Setup; manage Guide Notes and saved routes; opt-in progressive-loss analytics. | Route and note management **[v1]**; analytics **[Later]** |
| **PRD-F-011** | **Fully non-visual operability** of every primary function, including recording and managing Guide Notes and routes. | **[v1]** |

### 4.2 Cane add-on and standalone (new)

| ID | Requirement | Priority / status |
|---|---|---|
| **PRD-F-016** | **Cane-mount mode.** Two parts fit a standard white cane **without tools**: the **haptic grip sleeve** slides over the cane's grip, and the **sensor unit** clamps to the shaft just below it. Fitting takes under a minute the first time and under 10 seconds after that, without changing the user's grip or sweep technique. **[REC]** | **[v1]** · [OPEN: supported cane types, see §10] |
| **PRD-F-017** | **Fits common canes.** Works with common rigid and folding long canes, and does not stop a folding cane from folding (or detaches quickly before folding). | **[v1]** · [ASSUMPTION: shaft size range to be measured] |
| **PRD-F-018** | **Standalone mode.** Detached, the unit works as a handheld device with the same feedback, alerts, Guide Notes and Route Memory; the grip sleeve becomes its handle **[REC]**. The unit **knows which mode it is in** and adjusts its sensing (ground-level coverage is required in standalone). **In v1, standalone is recommended for familiar routes and indoor settings only**, until ground-hazard detection is validated. | **[v1]** hardware · **[DECIDED 10-31]** · not featured on the public site (§8) |
| **PRD-F-019** | **Mode announcement.** Attaching, detaching, and the current mode are confirmed by a short sound and haptic pattern. | **[v1]** |

### 4.3 Reliability and fallback (new)

| ID | Requirement | Priority / status |
|---|---|---|
| **PRD-F-020** | **Fallback ladder.** The system degrades in defined steps instead of failing all at once (see §6.2). Each step has its own haptic pattern and, when audio works, a short spoken notice. | **[v1]** · Safety-critical |
| **PRD-F-021** | **Independent safety core.** A basic obstacle-proximity warning (forward and overhead) keeps working **even if the main computer, cameras or software fail**. It runs on separate hardware with its own reserved battery. | **[v1]** · Safety-critical |
| **PRD-F-022** | **No silent failure.** Any loss of a function the user relies on is announced within a set time (target in TRD). The device never just goes quiet. | **[v1]** · Safety-critical |
| **PRD-F-023** | **Self-check on start** and a "what's working?" button query that reports health by sound and touch. | **[v1]** |
| **PRD-F-024** | **Battery reserve for safety.** The last part of the battery is kept only for the safety core, so a low battery turns off smart features first, never basic warnings first. | **[v1]** |

### 4.4 Guide Notes — assistor-recorded instructions (new)

| ID | Requirement | Priority / status |
|---|---|---|
| **PRD-F-025** | **Record a note.** An assistor records a spoken instruction with one clear action on the device (a dedicated button or button combination) **or** from the companion app. Recording start and stop are confirmed by sound. | **[v1]** |
| **PRD-F-026** | **Automatic tagging.** Each note is saved with where it was recorded, which saved route it belongs to (if any), and when. | **[v1]** |
| **PRD-F-027** | **Replay on demand.** The user can replay the latest note, the notes for the current spot, or step through notes for a route. | **[v1]** |
| **PRD-F-028** | **Replay at a place.** A note can be set to play automatically when the user next reaches the place it was recorded. On by default for notes recorded during a route teach session. | **[v1]** |
| **PRD-F-029** | **Manage notes.** The user can listen, rename, re-record, move to another route, or delete notes from the device or app, without sight. | **[v1]** device basics; app **[v1]** |
| **PRD-F-030** | **Recording consent and boundaries.** Recording only happens when someone deliberately starts it; the device **never records surrounding audio in the background** for Guide Notes. Notes stay on the device by default. | **[v1]** · Privacy |
| **PRD-F-031** | **Note search by text.** On-device transcription so notes can be found and read in the app. | **[Later]** |
| **PRD-F-032** | **Remote notes.** An assistor records a note from their own phone for a saved route, without walking it. | **[Later]** · [OPEN] |

### 4.5 Route Memory — learned paths and remembered obstacles (new)

| ID | Requirement | Priority / status |
|---|---|---|
| **PRD-F-033** | **Teach a route.** The user (often with an assistor) starts a teach session, walks the route, and saves it with a name. Guide Notes recorded during the session attach to that route. | **[v1]** |
| **PRD-F-034** | **Learn usual routes automatically.** The device notices journeys repeated often and offers to save them. It never saves a route without the user's confirmation. | **[v1]** · **[DECIDED 10-31]** |
| **PRD-F-035** | **Remembered obstacles.** Along saved routes, the device stores **fixed obstacles** it detected (poles, bollards, steps, low branches, kerbs, benches) and gives **early feedback** as the user approaches them. | **[v1]** |
| **PRD-F-036** | **Memory adds caution, never removes it.** A remembered obstacle can trigger a warning; the absence of a memory **never suppresses** a live sensor warning. Live sensing always wins. | **[v1]** · Safety-critical |
| **PRD-F-037** | **Memory keeps itself current.** Obstacles not seen again over several trips fade out; new fixed obstacles are added; temporary ones (people, parked cars, bins) are not remembered as fixed. | **[v1]** |
| **PRD-F-038** | **Memory as a fallback.** If the cameras or main sensors fail on a saved route, remembered obstacles still produce feedback, with a distinct "from memory" cue. | **[v1]** · Ties to PRD-F-020 |
| **PRD-F-039** | **Route replay and rehearsal.** The user can replay a saved route at home: turns, distances, remembered obstacles and Guide Notes, as audio and haptics, step by step or continuously. | **[v1]** |
| **PRD-F-040** | **On-route guidance.** On a saved route, the device confirms the user is on track and warns if they drift off it. | **[Secondary]** |
| **PRD-F-041** | **Fully offline.** Teaching, remembered obstacles, replay and Guide Notes all work with no network. | **[v1]** |
| **PRD-F-042** | **Memory privacy.** Route and location history stays on the device, encrypted, deletable route by route or all at once. Optional encrypted backup only with explicit opt-in. | **[v1]** on-device; backup **[OPEN]** |

## 5. Non-functional requirements

- **PRD-NF-001 Threat-alert latency** — detection → alert **< 50 ms** on the main path. **Safety core** proximity warning **< 100 ms** **[REC]**.
- **PRD-NF-002 Offline core** (changed v0.6) — sensing, threat alerts, haptics, **Guide Notes and Route Memory** all work with no network.
- **PRD-NF-003 Privacy by design** — EU/GDPR; on-device processing; raw camera and audio never leave the device. **Recorded voice (Guide Notes) and location history (Route Memory) are personal data** and stay on-device by default.
- **PRD-NF-004 Form factor & ergonomics** (changed v0.6) — weight budget **up to 750–800 g** for the complete add-on (grip sleeve + sensor unit) **[DECIDED 10-31]**. Lighter is better: mass sits close to the grip to keep cane balance and limit wrist fatigue, to be validated with users. Standalone size: about 20 cm plus the sleeve as handle, one-handed. **[OPEN]**
- **PRD-NF-005 Battery & charging** (changed v0.6) — **[ASSUMPTION]** full features for **at least one full day**, with the safety core lasting much longer from its reserve. The 750–800 g budget leaves room for a larger battery, so **[REC]** aim for 2–3 days and confirm with the power budget. Wireless charging dock retained. **[OPEN]**
- **PRD-NF-006 All-environment operation** — rain, cold, day and night. NIR + IR cameras at night; LIDAR/ToF for geometry. The safety core must work in **darkness and bright sun**.
- **PRD-NF-007 Reliability / graceful failure** (defined v0.6) — no single failure removes basic obstacle warning; no silent failure; defined fallback ladder (§6.2). Targets in TRD §9.
- **PRD-NF-008 Low training burden** — a user already trained on a cane should be using v1 cane mode within **one session** **[ASSUMPTION]**. An assistor should record a first Guide Note **without instructions**.
- **PRD-NF-009 In-ear module** — single wireless earbud, one ear open.
- **PRD-NF-010 Robustness on a cane** (new) — survives the knocks, vibration, and sweeping of daily cane use, and drops from hand height. **[OPEN: drop and impact spec]**
- **PRD-NF-011 Storage** (new) — enough on-device storage for **[ASSUMPTION]** at least 50 saved routes and several hours of Guide Notes.

## 6. Interaction model

### 6.1 Channels
- **The cane (physical)** = ground contact. Unchanged, always available.
- **Haptics (in hand)** = where things are and how close. Always-on layer.
- **Earbud (voice)** = meaning: object ID, "STOP", Guide Notes, route replay, system-health notices.
- **Buttons** = control. A small set of braille-labelled buttons covers identify, replay, record, and "what's working?".

### 6.2 Fallback ladder **[DECIDED 10-31: principle; levels are REC]**

| Level | What still works | What the user feels and hears |
|---|---|---|
| **L4 — Full** | Everything: sensing, threat, object ID, Guide Notes, Route Memory, navigation | Normal |
| **L3 — Reduced smart** | Sensing and threat alerts; no object ID or navigation (e.g. low battery, high temperature, part of the vision system down) | One "reduced" pattern + short spoken notice |
| **L2 — Memory + geometry** | Distance sensing (LIDAR/ToF) and remembered obstacles on saved routes; no camera-based threat classification | "Reduced" pattern + notice that threat detection is off |
| **L1 — Safety core** | Basic forward/overhead proximity warning from the independent safety core only | Distinct "basic mode" pattern repeated at intervals |
| **L0 — Cane** | The physical cane | A final "L.I.G.H.T off" pattern before the electronics stop |

**Standalone mode:** L0 does not exist. When the unit drops to L1 in standalone mode, it tells the user clearly and repeatedly. **[REC]**

### 6.3 Emergency behaviour
A threat overrides everything: spoken "STOP" plus a heavy whole-unit vibration. Recording and replay pause and resume after.

## 7. Scope — v1 vs. later

- **v1 (first product):** cane-mount mode with the 360° haptic grip sleeve, plus standalone use for familiar and indoor settings; forward and overhead sensing; threat alerts; object ID on demand; the reliability layer (fallback ladder, safety core, no silent failure, battery reserve); **Guide Notes** (record, tag, replay on demand and at a place, manage); **Route Memory** (teach a route, automatic learning of repeated trips with confirmation, remembered obstacles, replay and rehearsal, fully offline); braille buttons; companion app for managing notes and routes.
- **Secondary:** on-route guidance; turn-by-turn navigation; voice assistant; fuller 360° coverage in cane mode.
- **Later:** remote Guide Notes; note transcription and search; progressive-loss analytics; indoor navigation; standalone mode validated for unfamiliar outdoor travel.

## 8. Showcase scope (`light-public`)

This repository holds the public product showcase website. **[DECIDED 10-31]** unless marked otherwise.

- **Audience:** investors, and anyone who wants to understand what L.I.G.H.T is.
- **Hosting:** Vercel, project name **beyourlight**. No custom domain yet.
- **Visual style:** a fresh design, not the pitch deck's or the POC app's styling. The founder will brief it separately in this repository.
- **Concept stage, said plainly.** No claim of a manufactured, tested or certified device. Renders are labelled as concept visuals.
- **Lead with the cane add-on.** "Works with the cane you already trust", then reliability, then Guide Notes and Route Memory, then the advanced sensing.
- **Reliability is a headline feature**, not small print. The fallback ladder (§6.2) should be easy to understand visually.
- **Founders are shown** by name and role.
- **Market figures may be shown**, each with its source. Product numbers (price, weight, battery) are labelled as targets.
- **Do not mention any partner or research organisation**, by name or logo.
- **Do not present standalone use as the end goal**, and do not say the product replaces the cane. Whether to mention standalone use at all is **[OPEN]**: ask the founder before including it.
- **New renders are needed** for the cane-mounted form with the grip sleeve; existing renders show the old standalone baton. The founder will brief the renders separately.
- **Accessibility is the proof.** The site itself meets WCAG 2.2 AA at minimum and works fully with a screen reader and keyboard.

## 9. Success metrics

Priority order: **Safety > User confidence > Adoption.**
- **Safety:** with L.I.G.H.T attached, no more incidents than with the cane alone; correct advance warnings for overhead and fast-approaching hazards; **zero silent failures in testing**. _[OPEN: thresholds]_
- **Confidence:** users report equal or greater confidence than the cane alone, on familiar and unfamiliar routes. _[OPEN: instrument]_
- **Adoption:** share of trial users who keep L.I.G.H.T on their cane after the trial; number of routes taught and Guide Notes recorded per user. _[OPEN: targets]_

## 10. Risks, assumptions & open questions

**New in v0.6**
- **Grip sleeve on different canes.** Cane grips vary in shape, length and material (rubber, golf-style, cork, crook). The sleeve has to fit them snugly enough that vibration reaches the hand clearly. **[OPEN: sizes or adapters]**
- **Rotating grip.** Users roll the cane in the hand while sweeping, so the actuator under a given finger keeps changing. The sleeve must track its own rotation (IMU) to keep "left" on the left.
- **Weight and balance.** A 750–800 g add-on is heavy relative to a long cane **[ASSUMPTION: typical canes weigh a few hundred grams]**. Mass near the grip limits the effect on sweep, but wrist fatigue over a long walk must be tested with users early.
- **Sensors on a sweeping cane.** The unit moves with every sweep; the IMU must stabilise everything to walking direction. Rear coverage is blocked by the user's body in cane mode.
- **Standalone mode safety.** Without the cane tip, ground hazards depend on sensors only. v1 recommends standalone for familiar and indoor settings only (PRD-F-018).
- **Cane compatibility.** Shaft diameters and shapes vary (rigid, folding, telescopic, graphite, aluminium). **[ASSUMPTION: measure common models]**
- **Remembered obstacles going stale.** A remembered obstacle that has moved creates false alarms; one that has appeared is caught by live sensing only. PRD-F-036 keeps this safe; tuning PRD-F-037 is the open work.
- **Recording other people.** Guide Notes record the assistor's voice and may capture bystanders. Explicit start, clear recording sound, on-device storage. **[OPEN: legal review]**
- **Location history.** Route Memory stores where the user goes. On-device, encrypted, deletable. **[OPEN: whether any backup is offered]**

**Carried from v0.5**
- **< 50 ms latency** feasibility depends on compute choice.
- **Night threat classification** across 360° remains hard.
- **Point-to-identify aiming** is unsolved.
- **Companion-app health data** raises consent and ethics duties (now [Later]).

**Resolved in v0.6**
- ~~Mid-journey failure fallback (PRD-NF-007)~~ → the cane plus the fallback ladder.
- ~~Full-replacement ground-hazard safety bar gates v1~~ → the cane covers ground level in v1; the bar now applies to standalone validation (Later).
- ~~Haptic placement on a cane~~ → a full 360° grip sleeve (PRD-F-001).
- ~~Standalone recommendation~~ → familiar and indoor settings only in v1 (PRD-F-018).
- ~~Automatic route learning in v1~~ → yes, with confirmation before saving (PRD-F-034).
