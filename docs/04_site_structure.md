# L.I.G.H.T — Site Structure (`light-public`)

> **Status:** DRAFT v0.1 · **Last updated:** 2026-11-02
> Companion documents: [Design brief](03_design_brief.md) · [Site components](05_site_components.md) · [PRD v0.7](01_prd.md) · [TRD v0.6](02_trd.md)
> Tags: **[OPEN]** · **[ASSUMPTION]** · **[REC]** · **[DECIDED MM-DD]** · **[CONFIRM]** = a fact or date the founder must check before publishing
> All copy below is a **working draft** (marked *Draft*). It follows the rules in [AGENTS.md §5](../AGENTS.md) and is finalised after review.

## 1. Sitemap

```
/                      Hero page: 14 chapters, "everything"
/about                 Purpose and motivation, beliefs, founders
/contact               Contact pop-up (dialog over the current page; full page on direct load / no JS)
↗ prototype            The software prototype (POC app), separate Vercel project [OPEN: URL]
/sitemap.xml, /robots.txt, 404
```

| Route | Purpose | Rendering |
|---|---|---|
| `/` | Tells the whole story and ends on "Get in touch" | Static pre-render; 3D added after first paint |
| `/about` | Why the project exists, what we believe, who we are | Static pre-render |
| `/contact` | Email + optional message to the founders' inbox | **Opened from a link** on the site: a dialog over the current page (Next.js intercepting route). **Loaded directly or without JS:** a full page. The form posts to a Server Action either way |
| 404 | "This page isn't here." plus links to `/` and `/about` | Static |

**Privacy notice.** There is no separate privacy page. A short notice sits in the contact pop-up (§6), with one line in the footer.

## 2. Global chrome

### 2.1 Layers, bottom to top

1. **Page background.** White or blue, tweened between chapters.
2. **Hands plate.** An HTML image behind the canvas. Chapters 01 and 14 only.
3. **Scene canvas.** Fixed, full viewport, `aria-hidden="true"`. Holds the baton, cane, DotField and the chapter scenes.
4. **Content.** All HTML: chapters, text and controls. Chapter backgrounds are transparent so the canvas shows through.
5. **Header.**
6. **Viewport frame.**
7. **Cursor follower.**
8. **Dialogs.**
9. **Loader.**
10. **Skip link.** Topmost when focused.

### 2.2 Header

- **Left:** the "L.I.G.H.T" wordmark, which links to `/`.
- **Centre:** the **comma index nav** (R6): *Product, Reliability, Inside, Prototype, Timeline, About, Contact*.

  | Item | Target |
  |---|---|
  | Product | `#what-it-adds` |
  | Reliability | `#reliability` |
  | Inside | `#inside` |
  | Prototype | `#prototype` |
  | Timeline | `#timeline` |
  | About | `/about` |
  | Contact | `/contact` |

  The current chapter's item is underlined and has `aria-current="location"`.
- **Right:** the chapter counter "(03/14)" (`aria-hidden`; the headings carry the structure), then the **Motion toggle**.
  - The toggle is a button with `aria-pressed`, reading "Motion: on" or "Motion: off".
  - Its default follows `prefers-reduced-motion`. The choice is saved in `localStorage`.
- **Behaviour:**
  - The header hides while scrolling down and returns while scrolling up.
  - It always returns when anything inside it receives focus.
  - `scroll-padding-top` keeps focused elements clear of it (2.4.11).
- **Mobile:** the wordmark plus a "Menu" button. The button opens a full-screen blue sheet listing the nav items in large type. Focus is trapped in the sheet and Esc closes it.

### 2.3 Footer (R3: full-bleed blue)

| Column | Content |
|---|---|
| L.I.G.H.T | The wordmark, plus *Draft:* "A sensing baton that clips onto the white cane." |
| The product | Links to chapter anchors |
| The project | About · Try the prototype ↗ · Get in touch |
| Small print | *Draft:* "L.I.G.H.T is a concept in development. Images are concept visuals; product figures are design targets. This site sets no cookies." · © 2026 L.I.G.H.T |

### 2.4 Structure for assistive technology

- **Landmarks:** the skip link ("Skip to content") comes first, then the `header`, `nav`, `main` and `footer` landmarks.
- **Headings:**
  - One `h1` per page.
  - Each chapter is a `section` with an `h2`.
  - The chapter number sits in the eyebrow, e.g. "(04) reliability".
- **Reading order:** the DOM order is the story order. The 3D layer never carries information that the HTML lacks.
- **Visual descriptions:** each chapter with a visual demo has a short "What the animation shows" paragraph next to it. It is visible as a caption, not hidden.

## 3. Hero page (`/`): chapters

Story order follows [PRD §8](01_prd.md#8-showcase-scope-light-public): cane add-on → reliability → Guide Notes and Route Memory → advanced sensing. After that come the parts, the evidence, the market, the timeline and the call to action.

### Summary

Backgrounds alternate: **W** = white, **B** = blue.

| # | Anchor | Bg | Chapter | Baton | Signature interaction |
|---|---|---|---|---|---|
| 00 | — | B | Loader | Ring ignites | — |
| 01 | `#top` | W | Hero | Floats at centre, idle spin | I1 rotate |
| 02 | `#what-it-adds` | B | What the cane can't reach | Right rail, twists in; sensing cones | Cones light per item |
| 03 | `#cane` | W | Clips onto the cane you already trust | Cane enters; clip closes | I2 clip-on (pinned) |
| 04 | `#reliability` | B | Never fails silently | Close-up in x-ray, with cane | I3 fallback ladder |
| 05 | `#guide-notes` | W | Guide Notes | Small, lower left, with cane | I4 play the note |
| 06 | `#route-memory` | B | Route Memory | Hovers over a 3D map | I5 walk it again |
| 07 | `#haptics` | W | Feel where it is | End-on view of the grip; cane fades out | I6 place the obstacle |
| 08 | `#stop` | B → chartreuse | STOP | Whole ring swells | I7 STOP with replay |
| 09 | `#inside` | W | Inside the baton | Horizontal; explodes and reassembles | I8 hotspots (pinned) |
| 10 | `#mockups` | B | Concept visuals | Docks into the first gallery card | I9 gallery |
| 11 | `#prototype` | W | Try the software prototype | Sensor head turns toward the card | Link out |
| 12 | `#why` | B | Why it matters | Small, top right | Count-ups, dot grid |
| 13 | `#timeline` | W | Where we are | Rides down the timeline line | Line draws on scroll |
| 14 | `#contact-cta` | B | Get in touch | Back at centre; ring steady | Opens the dialog |

### 01 · Hero (`#top`, white)

- **Visual:**
  - The baton floats at centre, after R1, with a slow idle spin.
  - Soft-focus hands reach toward it from above and below.
  - The DotField is faint in the margins.
  - A "Concept visual · real-time 3D" label sits bottom left.
- **Copy** (*Draft*):
  - Eyebrow: "concept · in development".
  - `h1`: "Be your light."
  - Lead: "L.I.G.H.T is a sensing baton that clips onto your white cane. It warns you about what the cane can't reach: obstacles ahead, things at head height, and anything coming at you fast."
  - Behind the content, decorative cropped type reads "be your light" (`aria-hidden`).
- **Actions:**
  - **Get in touch:** primary; opens the dialog.
  - **Try the software prototype ↗:** secondary.
  - "scroll to explore" cue (R4).
- **Interaction (I1):**
  - Drag sideways to spin the baton. There are visible "Rotate left / right" buttons. The cursor shows "drag".
  - The pointer tilts the baton by up to ±8°.
  - Touch: horizontal drag only, so vertical scrolling is never captured (`touch-action: pan-y`).
- **Sources:** PRD §1, PRD-F-003, PRD-F-006.

### 02 · What the cane can't reach (`#what-it-adds`, blue)

- **Copy** (*Draft*):
  - `h2`: "Your cane finds the ground. L.I.G.H.T looks further."
  - Four numbered items (R6):
    1. **Ahead.** "Obstacles at a distance, before your cane or your body touches them."
    2. **Overhead.** "Branches, signs and mirrors at head height, which a cane can't reach."
    3. **Coming fast.** "Bikes and cars approaching quickly: a spoken 'STOP' and a strong vibration through the whole grip."
    4. **What it is.** "Point and ask. A single earbud tells you what's there."
- **Visual:**
  - The baton twists 180° as it glides to the right rail.
  - Chartreuse **sensing cones**, made of DotField dots, open from the sensor head, one per item as each is reached.
- **Static tier:** one poster showing all four cones.
- **Sources:** PRD §3, PRD-F-003, PRD-F-004, PRD-F-006, PRD-NF-009.

### 03 · Clips onto the cane you already trust (`#cane`, white, pinned about 200 vh)

- **Copy** (*Draft*):
  - `h2`: "Clips onto the cane you already trust."
  - Body: "There's no new technique to learn. L.I.G.H.T clips onto your own white cane without tools. Your cane's grip nests under the baton's grip, so your hand holds both as one handle. The cane keeps doing what it does best: finding the ground."
  - Facts (labelled): "Clips on in under 10 seconds (design target)" · "Attaching is confirmed with a sound and a vibration" · "Designed for common long canes" **[CONFIRM: supported cane types are still open, PRD §10]**.
- **Visual (I2):** scroll scrubs these steps.

  | Step | What happens |
  |---|---|
  | 1 | A white cane slides in diagonally from the bottom left |
  | 2 | The baton turns parallel to the shaft and lowers onto it |
  | 3 | The clip closes with a 1 mm settle |
  | 4 | The light ring swells once |
  | 5 | The camera eases back to show the pair |

- **What the animation shows:** "The baton lowers onto a white cane, its clip closes around the shaft, and its light ring glows once to confirm."
- **Static tier:** three stills (above, closing, attached).
- **Sources:** PRD-F-016, PRD-F-017, PRD-F-019; TRD-HW-014.

### 04 · Never fails silently (`#reliability`, blue)

- **Copy** (*Draft*):
  - `h2`: "Never fails silently."
  - Lead (serif): "If something stops working, L.I.G.H.T tells you, steps down to what still works, and keeps warning you. If every electronic part stops, you are still holding your cane."
- **Fallback ladder (I3).** A five-level stepper: a tablist on desktop, stacked on mobile. The 3D view dims the parts that stop and keeps the working parts lit. Each step down plays one light-ring swell.

  | Level | 3D state | Panel text (*Draft*, from [animations.md A6](animations.md)) |
  |---|---|---|
  | Full | Everything lit | "Everything on: sensing, identification, memory, guidance." |
  | Reduced | Identification and navigation dim | "Low battery or heat: the smart extras pause first." |
  | Memory and distance | Cameras dim; distance sensors and memory stay lit | "Cameras out: distance sensing and remembered obstacles keep working." |
  | Safety core | Everything dims except the safety-core board (chartreuse), its sensors and the haptic ring | "Main system down: a separate safety system still warns you of obstacles." |
  | Cane | The whole device dims; the cane stays bright | "And your cane still works, as it always has." |

- **Three supporting facts:**
  - **Independent safety core:** its own chip, its own sensors, its own reserved battery.
  - **Smart features switch off first:** the battery keeps a reserve only for basic warnings.
  - **Never silent:** every step down is announced by touch and voice.
- **Visual:** the baton and cane sit on the left rail, close up, in **x-ray**. The shell goes translucent and the internals are drawn in diagram style.
- **Static tier:** one poster per level (5).
- **Sources:** PRD §6.2, PRD-F-020 to PRD-F-024; TRD §4, TRD-HW-015 to TRD-HW-017.

### 05 · Guide Notes (`#guide-notes`, white)

- **Copy** (*Draft*):
  - `h2`: "Directions, in a voice you know."
  - Body: "Walk a route once with your instructor, a friend or family. They record short spoken notes along the way. Later, walking alone, you hear each note again when you ask, or automatically when you reach the place it was recorded."
  - Example note, shown as a caption: "The crossing button is on the pole to your right."
  - Privacy line: "Recording only starts when someone presses record. Notes stay on the device."
- **Visual:**
  - A blue path line crosses the chapter, with two line-drawn figures walking.
  - A waveform rises and settles into a **pin**: chartreuse with a blue edge, following the rule for signals on white.
  - Later, a single figure reaches the pin. It opens, and the waveform travels to an earbud.
  - The baton and cane sit small, lower left. The light ring pulses while the note plays.
- **Interaction (I4):**
  - A "Play the note" button.
  - If a real recording is supplied **[OPEN]**, it plays (user-started only, never autoplay) with the transcript shown.
- **Static tier:** two stills, "Recorded here" and "Played back here".
- **Sources:** PRD-F-025 to PRD-F-030.

### 06 · Route Memory (`#route-memory`, blue)

- **Copy** (*Draft*):
  - `h2`: "Learns the routes you walk."
  - Body: "L.I.G.H.T learns the routes you walk often, and asks before saving one. It remembers fixed obstacles along them, like a bollard, a step or a low branch, and warns you early next time. You can rehearse a route at home before you walk it."
  - Badges: "Works offline" · "Stays on the device".
  - Safety line: "Memory only adds warnings. It never switches off a live one."
- **Visual (I5):**
  - A 3D street-map plane tilts in beneath the baton, drawn in thin white lines.
  - The route draws itself in chartreuse.
  - Fixed obstacles drop in as markers and stay.
  - On a second walk, each marker gets an early **double swell**.
  - A parked bike appears and is *not* kept.
- **"Walk it again"** replays the sequence.
- **Screen reader:** an ordered list of events ("Pole remembered", "Step remembered", "Parked bike: temporary, not remembered").
- **Static tier:** a still of the final map.
- **Sources:** PRD-F-033 to PRD-F-041 (PRD-F-036 for the safety line), PRD-NF-002.

### 07 · Feel where it is (`#haptics`, white)

- **Copy** (*Draft*):
  - `h2`: "Feel where it is."
  - Body: "A ring of small motors inside the grip vibrates on the side where the obstacle is, and more strongly as it gets closer. It follows the direction you're walking, not the swing of the cane. When there's more than one obstacle, you feel up to three at once, nearest strongest."
- **Visual:**
  - The camera moves to look along the baton from the end cap.
  - The cane fades out here and does not return.
  - The grip turns x-ray, showing 8 actuators as a ring of dots.
  - Note: "Illustration shows 8 motors; the design calls for 8 to 16."
- **Interaction (I6):**
  - A top-down radar sits beside the grip, with the walker at the centre.
  - The visitor places an obstacle by dragging, clicking one of 8 positions, or using arrow keys (+/− for distance).
  - The matching actuators swell. Swells last at least 300 ms.
  - Live text: "Pole, ahead left, close: the front-left of the grip vibrates strongly."
- **Static tier:** two stills (one obstacle; two obstacles).
- **Sources:** PRD-F-001, PRD-F-002; TRD-HW-005, TRD-HW-006.

### 08 · STOP (`#stop`, blue → chartreuse)

- **Copy** (*Draft*):
  - `h2`: "When something comes fast: STOP."
  - Body: "Everything else goes quiet. Your earbud says 'STOP', and the whole grip gives one strong vibration, unlike any other cue."
  - Fact: "Designed to warn in under 50 milliseconds (target)."
- **Visual (I7).** Plays once when 60 % of the chapter is in view.

  | Time | What happens |
  |---|---|
  | 0–2 s | Calm cues on the radar |
  | 2–3 s | A cyclist approaches from the side |
  | 3–4.5 s | All cues stop. The **whole ring swells once**. The chapter background turns to a steady chartreuse, with a giant blue "STOP" (`aria-hidden`; the `h2` carries the word) |
  | 4.5–6 s | The cyclist passes and calm returns |

  The colour change is one slow 600 ms transition, never a flash. There is a **Replay** button.
- **Static tier:** three stills with captions.
- **Sources:** PRD-F-006, PRD-F-007, PRD-NF-001.

### 09 · Inside the baton (`#inside`, white, pinned about 300 vh)

- **Copy** (*Draft*):
  - `h2`: "Inside the baton."
  - Lead: "About 20 cm long and 38 mm across (design targets). This is what's inside, in the current concept."
  - Footnote: "Concept layout, for illustration. Component choices are still open."
- **Visual (I8):**
  1. The baton turns horizontal.
  2. Scrolling separates it along its axis in assembly order and holds on each group.
  3. Hotspots appear beside the parts.
  4. It reassembles at the end, and the clip snaps back.
- **Hotspots** are focusable buttons in assembly order. Each opens a small panel. Wording follows the TRD tags, so recommendations read as "planned".

  | Group | Hotspots (*Draft* labels) | Sources |
  |---|---|---|
  | Sensor head | Distance sensors (multi-zone ToF/LIDAR) · Wide-angle cameras with night vision · Ultrasonic sensors for the safety core · Microphones | TRD-HW-002, TRD-HW-003, TRD-HW-013, TRD-HW-016, TRD-HW-004 |
  | Light ring | Status light | — |
  | Body | Braille buttons: identify, replay, record, status · Cane clip with mode sensor · Main computer with AI accelerator · Independent safety-core chip · Motion sensor and satellite positioning | TRD-HW-012, TRD-HW-014, TRD-HW-001, TRD-HW-015, TRD-HW-006, TRD-HW-007 |
  | Grip | Ring of haptic motors · Battery, with a reserve for the safety core · Encrypted storage | TRD-HW-005, TRD-HW-009, TRD-HW-017, TRD-HW-018 |
  | End cap | Wireless charging | TRD-HW-009 |

- **Screen reader and Static tier:** the same list as plain HTML, plus one exploded poster.

### 10 · Concept visuals (`#mockups`, blue)

- **Copy:** `h2`: "Concept visuals." Lead (*Draft*): "How L.I.G.H.T might look and work. Every image here is a concept."
- **Gallery (I9).** Horizontal, with drag, scroll and previous/next buttons.
  1. The **live baton**: the 3D baton docks into the first card as a turntable.
  2. Stills: on the cane, in the hand, the clip close-up, the grip, a lifestyle walk.
  3. Companion-app concept screens: Guide Notes list, saved routes, "What's working?".
- **Every card:** a caption, alt text, and a "Concept visual" label.
- **Static tier:** a grid.
- **Assets:** see [design brief §9](03_design_brief.md#9-content-and-assets).

### 11 · Try the software prototype (`#prototype`, white)

- **Copy** (*Draft*):
  - `h2`: "Try the software prototype."
  - Body: "Our browser prototype runs real object detection on your camera or on a sample walk, and shows how the haptic ring and the STOP alert respond. It was built for an earlier, handheld version of the device, so it shows the older design. Camera frames stay in your browser."
  - Last sentence source: POC README, "Try live awareness".
- **Media:** a muted, looping screen recording of 20–30 s, with a **Pause** button and a text description.
- **Action:** "Open the prototype ↗". It opens in a new tab, and the link text says so to screen readers. **[OPEN: URL, once deployed]**
- **Visual:** the baton turns its sensor head toward the card.
- **Before linking, confirm:**
  - the POC is deployed (separate Vercel project, frontend only);
  - it has no partner names (none found in `src/` on 11-02);
  - its optional backend narration is off.

### 12 · Why it matters (`#why`, blue)

- **Copy:** `h2`: "Why it matters."
- **Stats.** Count-up, tabular. Each is a `figure` with its source as a visible `figcaption` link. Every source is **[CONFIRM: re-check before publishing]**.

  | Stat | Source |
  |---|---|
  | **2.55 million** blind people in Europe | WHO, via the European Blind Union |
  | **59 %** of severely visually impaired people in France use no mobility aid. Shown as a 100-dot grid with 59 chartreuse dots, plus the sentence in text | Étude Homère, via Institut de la Vision |
  | **$6.87B → $12.71B**: assistive technology for visual impairment, 2025 → 2030, 13.1 % a year | The Business Research Company, *Assistive Technologies for Visually Impaired Global Market Report 2026* |
  | *Optional:* **~€43,500** lifetime cost of a guide dog | Scale Dogs (BE) |

- **Not shown:** the "~€250M/yr" figure, which depends on a target price (AGENTS.md §6).
- **Visual:** the baton is small in the top right, with the ring breathing.

### 13 · Where we are (`#timeline`, white)

- **Copy:** `h2`: "Where we are."
- **Layout:** XOXO-style schedule rows (R3).
  - **Left column:** date (tabular) and a status chip: done · now · next · later.
  - **Right column:** title and one line.
  - **Visual:** a vertical blue line draws itself with scroll. The "now" node is chartreuse inside a blue ring. The baton rides down the line as the progress marker.

| When | Status | Title (*Draft*) | Line (*Draft*) |
|---|---|---|---|
| Sep 2026 | done | Concept and requirements | Product and technical requirements written, and a user-research plan drafted |
| Sep 2026 | done | Software prototype | Live object detection and a simulated haptic ring, running in the browser |
| Nov 2026 | done | Clip-on design | Redesigned as a baton that clips onto the white cane, with an independent safety core |
| Now | now | Listening to cane users and instructors **[CONFIRM]** | Interviews with cane users and O&M instructors |
| Next **[OPEN: date]** | next | First hardware prototype | Sensing, the haptic ring and the safety core, in one baton |
| Later **[OPEN: date]** | later | Small pilot | Trying it with experienced cane users |

**No organisation names**, including in "Now". The old pitch timeline named partners; it is not reused.

### 14 · Get in touch (`#contact-cta`, blue)

- **Visual:**
  - Giant cropped lowercase "be your light" (`aria-hidden`).
  - The baton returns to the centre, upright, its ring steady.
  - The hands plate echoes the hero (optional).
- **Copy** (*Draft*):
  - `h2`: "Let's talk."
  - Body: "Investors, orientation and mobility instructors, cane users, or just curious: we'd like to hear from you."
- **Actions:**
  - Primary (chartreuse on blue): **Get in touch** opens the dialog.
  - Team teaser: "Built by Amitaansh Grover and Shrishti Bothra." → **About the project**.

## 4. Baton choreography

This table describes the intent for the 3D rig ([05 §4.6](05_site_components.md#46-rig-and-choreography)). The rig reads the keyframe for the current chapter and blends to the next one across the boundary. **The values were tuned by eye during the build (11-02); the live values are in `three/rig/choreography.ts`.** The main changes: in chapters 04 and 05 the baton tilts the other way, so the cane runs away from the copy; in 07 and 08 it is seen at 72° rather than fully end-on, with all shells see-through.

**Conventions:**
- **Position** is on a normalised stage: x from −1 (left edge) to 1 (right edge); y from −1 (bottom) to 1 (top).
- **Tilt** is the long axis's angle from vertical. Positive tilts the end cap to the right.
- **Spin** is rotation about the long axis. 0° means the buttons face the camera.
- **Scale** is relative to the hero size, where the baton is about 60 % of viewport height.
- **Explode** and **X-ray** run from 0 to 1.

| Ch | Position | Tilt | Spin | Scale | Cane | Explode | X-ray | Ring | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 01 | (0, 0.02) | 12° | idle +6°/s; drag adds spin | 1.00 | — | 0 | 0 | breathe (4 s) | Pointer tilt ±8°; contact shadow |
| 02 | (0.42, 0) | 70° | +180° on entry (the twist) | 0.85 | — | 0 | 0 | steady | Sensing cones from the head, one per item |
| 03 | (0.10, −0.10) → (0.15, 0.05) | 35° (matches the cane) | 0° | 0.90 → 0.75 | slides in, clips at 70 % progress | 0 | 0 | swell at clip | Camera eases back |
| 04 | (−0.35, 0) | 35° | −25° (buttons side) | 1.10 | on | 0 | 1 (shell 15 % opacity) | swell per level | Per-level dimming; the cane is lit only at "Cane" |
| 05 | (−0.55, −0.45) | 35° | 0° | 0.55 | on | 0 | 0 | swell while the note plays | — |
| 06 | (0, 0.30) | 55° (leans over the map) | 15° | 0.60 | on | 0 | 0 | double swell at markers | Map plane rotates in below |
| 07 | (0.35, 0) | axis toward the camera (end-on) | 0° (actuator 0 = ahead) | 1.20 | fades out | 0 | grip only | off | Actuators driven by I6 |
| 08 | (0.35, 0) | end-on | 0° | 1.20 | — | 0 | grip only | whole-ring swell (900 ms) | — |
| 09 | (0, 0) | 90° (horizontal) | 20° | fits 80 % of width | — | 0 → 1 → 0 | 0 | steady | Holds on each group; clip snaps back at the end |
| 10 | first gallery card (about (−0.6, 0)) | 20° | idle | 0.45 | — | 0 | 0 | breathe | Follows the gallery's horizontal offset |
| 11 | (0.45, 0.10) | 60°, head toward the card | 0° | 0.70 | — | 0 | 0 | steady | — |
| 12 | (0.60, −0.55) | 15° | idle | 0.40 | — | 0 | 0 | breathe | — |
| 13 | (−0.75, +0.8 → −0.8 with scroll) | 90° | 0° | 0.35 | — | 0 | 0 | swell at "now" | Rides the timeline line |
| 14 | (0, 0.05) | 12° | idle | 1.00 | — | 0 | 0 | steady (brighter) | Mirrors the hero |
| About | (0.55, 0.35) | 20° | idle | 0.60 | — | 0 | 0 | breathe | Flies here during the page wipe |
| Dialog open | holds its pose | — | — | — | — | — | — | — | Canvas dims behind the scrim; rendering pauses |

- **Transitions:**
  - Each blend runs over the last 30 % of the outgoing chapter and the first 20 % of the incoming one. A **twist** combines a spin change of 90° or more with a tilt change.
  - The rig follows its targets on a critically damped spring, which gives klimt's soft lag.
- **Mobile:** x collapses to 0, y moves to the top band (+0.35), and scale is multiplied by 0.8. Pinned lengths are halved.
- **Static tier:** one poster per row (01–14, About), rendered from the same keyframes.

## 5. About page (`/about`)

The persistent canvas keeps the baton across the page change. It flies to the "About" pose during the blue wipe.

| # | Section | Bg | Content (*Draft*) | Source |
|---|---|---|---|---|
| A1 | Statement | B | Eyebrow "about the project". Large serif (R3): "We started L.I.G.H.T because the white cane is brilliant at one thing, finding the ground, and leaves the rest to you." | Founder voice **[CONFIRM]** |
| A2 | Why we started | W | 1–2 paragraphs in the founders' own words **[OPEN]**. Supporting points: the cane only reports what it touches; it can't reach head height; it gives no warning of things coming fast; it can't say what something is. Many people who lose their sight later in life never get cane training | [Concept brief §2](../../docs/01_concept_brief.md) (reworded; its "replace the cane" vision is **not** used) |
| A3 | What we believe | B | Numbered principles (R6): 01 Safety first, and never silent. 02 Add to the cane; don't ask anyone to give it up. 03 Easy to learn. 04 Dignity in public. 05 Private by design: processed on the device. 06 Works offline. 07 Every claim testable against the cane | Concept brief §9; PRD §1, PRD-NF-003 |
| A4 | The name | W | "L.I.G.H.T stands for LIDAR Integrated Guidance & Handheld Tracker." plus the tagline | README |
| A5 | Who we are | W | Founders: **Amitaansh Grover**, co-founder, Electrical Engineering, NUS (hardware, embedded systems, sensing, power; robotics software with the NUS Mars Rover Team). **Shrishti Bothra**, co-founder, Business Analytics, NUS (data, product, frontend design, pricing and go-to-market). Photos **[CONFIRM]** | [AGENTS.md §6](../AGENTS.md) |
| A6 | Where we are | B | "L.I.G.H.T is a concept. A software prototype exists; no hardware has been built yet." Links to `/#timeline` and the prototype | PRD status |
| A7 | Get in touch | B | Same call to action as chapter 14 | — |

## 6. Contact pop-up

### 6.1 Triggers and URL

- Every "Get in touch" and "Contact" control is a real link to `/contact`.
- **With JavaScript:**
  - It opens as a **dialog over the current page** (intercepting route), and the URL becomes `/contact`.
  - Closing it returns to the previous URL and scroll position.
- **Direct load or no JavaScript:** a full page with the same form.
- **Background:** Lenis stops, the page behind is `inert`, and the 3D canvas pauses.

### 6.2 Content (*Draft*)

- **Heading:** "Get in touch".
- **Lead:** "Investors, instructors, cane users, or just curious: write to us."
- **Fields:**
  - **Email** (required): `type="email"`, `autocomplete="email"`.
  - **Message** (optional): a textarea of 2000 characters at most, with a polite character counter.
  - A honeypot field, hidden from everyone (`aria-hidden`, `tabindex="-1"`, off screen).
- **Privacy line** (visible, under the button): "We'll only use your email to reply. Your message goes to the founders' inbox through our email provider. This site doesn't store it or set cookies."
- **Buttons:** **Send** (primary) · **Close** (also Esc).

### 6.3 States

| State | What the visitor sees | Focus | Screen reader |
|---|---|---|---|
| Open | The form slides up 24 px and fades in (instant under reduced motion) | Email field | The dialog's name, from its heading |
| Invalid | An inline message under each field: "Enter an email address, like name@example.com." | First invalid field | `aria-invalid`, plus the message through `aria-describedby` |
| Sending | The button reads "Sending…" and is disabled | Stays put | `aria-busy`; polite status "Sending" |
| Sent | "Thanks. We'll reply to *you@…*." A **Close** button | The heading "Message sent" | Announced on focus |
| Failed | "That didn't send. Please try again in a moment." Fields keep their content | The error message | `role="alert"` |

### 6.4 Server behaviour

1. Validate on the server: email format, and message length of 2000 characters or less.
2. If the honeypot is filled, or the form was submitted less than 3 s after opening, return the "Sent" state silently and send nothing.
3. Send through Resend to the recipient in a server environment variable, with `reply-to` set to the visitor and the subject "L.I.G.H.T site: message from …".
4. Store nothing. Never log message content: log success or failure only.

## 7. Anchors and navigation

| Anchor | Chapter | In the nav as |
|---|---|---|
| `#top` | 01 Hero | — (wordmark) |
| `#what-it-adds` | 02 | Product |
| `#cane` | 03 | — |
| `#reliability` | 04 | Reliability |
| `#guide-notes` | 05 | — |
| `#route-memory` | 06 | — |
| `#haptics` | 07 | — |
| `#stop` | 08 | — |
| `#inside` | 09 | Inside |
| `#mockups` | 10 | — |
| `#prototype` | 11 | Prototype |
| `#why` | 12 | — |
| `#timeline` | 13 | Timeline |
| `#contact-cta` | 14 | — (Contact goes to the dialog) |

- Deep links work on load. Each chapter has a `scroll-margin-top`.
- **Jumping to a chapter** (from the nav or a link), the baton jumps straight to that chapter's keyframe. Under reduced motion it never animates through the chapters in between.

## 8. Metadata

| Page | Title (*Draft*) | Description (*Draft*) |
|---|---|---|
| `/` | L.I.G.H.T: a sensing baton for the white cane | A concept for a baton that clips onto the white cane and warns of obstacles ahead, overhead and coming fast. |
| `/about` | About L.I.G.H.T | Why we're building L.I.G.H.T, what we believe, and who we are. |
| `/contact` | Get in touch · L.I.G.H.T | Write to the L.I.G.H.T founders. |

- **Page:** `lang="en-GB"` (the docs use British spelling), with a 3D-baton favicon made from the wordmark dot.
- **Social preview:** an Open Graph image of the baton on blue (1200 × 630), rendered from the scene.
- **Crawling:** `sitemap.xml`, plus `robots.txt` allowing all.
- No tracking tags.

## 9. Content sources and gaps

| Content | Source | Status |
|---|---|---|
| Product facts | [PRD v0.7](01_prd.md), [TRD v0.6](02_trd.md) | Ready; copy drafted above |
| Fallback ladder text | PRD §6.2, [animations.md A6](animations.md) | Ready |
| Market figures | [AGENTS.md §6](../AGENTS.md) | **[CONFIRM]** re-check each source |
| Founders | AGENTS.md §6 | **[CONFIRM]** photos, titles, year |
| About motivation | Founders | **[OPEN]** |
| Milestones | Founder | **[OPEN]** future dates; **[CONFIRM]** "Now" |
| Prototype URL | Deploy `../light-guidance-experience` | **[OPEN]** |
| Concept stills, hands plate, app screens | [Design brief §9](03_design_brief.md#9-content-and-assets) | To make |
| Guide Note audio | Founder | **[OPEN]**, optional |
