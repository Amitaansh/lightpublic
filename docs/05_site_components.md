# L.I.G.H.T — Site Components (`light-public`)

> **Status:** DRAFT v0.1 · **Last updated:** 2026-11-02
> Companion documents: [Design brief](03_design_brief.md) · [Site structure](04_site_structure.md)
> Tags: **[OPEN]** · **[ASSUMPTION]** · **[REC]** · **[DECIDED MM-DD]**
> This is the build inventory for the stack recommended in [design brief §10](03_design_brief.md#10-technical-approach-rec).

## 0. Build notes (v0.1, 2026-11-02)

The site was built from this document. Where the build differs from the plan below, the build wins:

| Planned | Built | Why |
|---|---|---|
| `RouteMapPlane` in WebGL | **SVG map with a CSS 3D tilt** (`components/chapters/RouteMemory.tsx`) | Crisp, accessible, and it also works in the static tier |
| One ScrollTrigger per chapter (`useChapterProgress`) | **`ChapterTracker`** reads every `[data-chapter]` section on scroll and writes progress, pin progress, blend and theme to the store | Pinned chapters use CSS `position: sticky`, so one measurement covers everything |
| Hotspots that follow the 3D parts on screen | **A list of part buttons under the parts**, in assembly order. Opening one highlights its group in 3D | Simpler and fully keyboard and screen-reader friendly |
| `/api/contact` route handler | **Server Action** `app/actions/contact.ts` | Works without JavaScript |
| Controllers as separate modules | Folded into **`three/rig/BatonRig.tsx`** (explode, x-ray, haptic ring, light ring, cane) | One per-frame loop |
| DotField as a full grid | A **halo of dots around the baton**, which moves with it | Keeps dots away from text on blue chapters |
| Posters from `/?poster=…` | `/poster?name=…`, only when `POSTER_MODE=1` | Never public |
| POC screen recording in chapter 11 | Not yet. The chapter shows a screenshot if `public/media/prototype.webp` exists | Needs the prototype running |

Keyframe values were tuned by eye during the build. The live values are in `three/rig/choreography.ts`; [structure §4](04_site_structure.md#4-baton-choreography) describes the intent.

## 1. Folder structure (proposed)

```
light-public/
  app/
    layout.tsx                    RootLayout: fonts, providers, shell, persistent <SceneCanvas/>, {modal} slot
    page.tsx                      Hero page: chapters 01–14
    about/page.tsx
    contact/page.tsx              Full-page contact (direct load / no JS)
    @modal/(.)contact/page.tsx    Contact as a dialog (intercepted route)
    @modal/default.tsx            Renders nothing
    actions/contact.ts            Server Action: validate + send
    not-found.tsx · sitemap.ts · robots.ts · opengraph-image.png
  components/
    shell/      ViewportFrame, Header, IndexNav, MobileMenu, ChapterCounter, MotionToggle,
                SkipLink, Footer, Loader, PageTransition, CursorFollower, SmoothScroll
    ui/         Button, MagneticButton, TextLink, Eyebrow, ConceptLabel, Stat, SourceNote,
                LineReveal, Counter, Stepper, Hotspot, Gallery, Dialog, Field, TextArea,
                FormStatus, PauseButton, VisuallyHidden, AnimationNote
    chapters/   Hero, WhatItAdds, CaneClip, Reliability, GuideNotes, RouteMemory, Haptics,
                Stop, Inside, Mockups, Prototype, WhyItMatters, Timeline, Closing
    about/      Statement, WhyWeStarted, Principles, TheName, Founders, WhereWeAre
    contact/    ContactDialog, ContactForm
  three/
    SceneCanvas.tsx · QualityTier.ts · Lighting.tsx
    baton/      Baton.tsx · dimensions.ts · materials.ts · parts/* · internals/*
    cane/       Cane.tsx
    rig/        BatonRig.tsx · choreography.ts · useChapterProgress.ts
    controllers/ ExplodeController.ts · XRayController.ts · HapticRingController.ts · LightRingController.ts
    scenes/     DotField.tsx · SensingCones.tsx · RouteMapPlane.tsx · RadarScene.tsx
    fallback/   StaticPoster.tsx
  content/      site.ts · chapters.ts · reliability.ts · inside.ts · stats.ts · milestones.ts · about.ts · contact.ts
  lib/          store.ts (zustand) · motion.ts · scroll.ts (Lenis ↔ ScrollTrigger) · a11y.ts
  styles/       tokens.css · globals.css
  public/       posters/*.avif|webp · media/* (hands plate, stills, POC recording)
  scripts/      render-posters.mjs · check-content.mjs
  tests/        a11y.spec.ts · keyboard.spec.ts · reduced-motion.spec.ts · no-webgl.spec.ts · contact.spec.ts
```

**Scripts on Windows.** Scripts follow [AGENTS.md §8](../AGENTS.md): never `spawn("npm")`. Run tool binaries through `process.execPath`, as `../light-guidance-experience/scripts/local-processes.mjs` does.

## 2. Design tokens

All tokens live in `styles/tokens.css` and are exposed to Tailwind v4 through `@theme`. The values come from [design brief §6](03_design_brief.md#6-visual-direction--blue-signal-decided-11-02).

| Group | Tokens |
|---|---|
| **Colour** | `--c-white #FFFFFF` · `--c-blue #233CCD` · `--c-chartreuse #DBFE1B` · `--c-blue-80 #4F63D7` (secondary text on white) · `--c-white-80 #D3D8F5` (secondary text on blue) · `--c-blue-tint` (surface on white) · `--c-graphite #2B2D33` (3D only) |
| **Chapter themes** | `[data-theme="white"]` → `--bg: white`, `--fg: blue`, `--signal-edge: blue`, `--focus: blue` · `[data-theme="blue"]` → `--bg: blue`, `--fg: white`, `--signal-edge: none`, `--focus: chartreuse` |
| **Type** | `--font-sans: Archivo` · `--font-serif: Hedvig Letters Serif` · scale `statement`, `h1`, `h2`, `h3`, `lead-serif`, `body`, `body-serif`, `label` (sizes in brief §6.3) · `font-variant-numeric: tabular-nums` on `.numeral` |
| **Spacing** | 4 px base · `--section-pad: clamp(6rem, 12vh, 10rem)` · `--margin: clamp(20px, 4vw, 64px)` · `--gutter: clamp(16px, 2vw, 32px)` · `--frame: 10px` (6 px below `md`) |
| **Shape** | `--radius-pill: 999px` · cards and images 0 · `--rule: 1px solid currentColor` · `--focus-ring: 3px solid var(--focus)` with 3 px offset |
| **Motion** | `--ease-out: cubic-bezier(0.16,1,0.3,1)` · `--ease-in-out: cubic-bezier(0.65,0,0.35,1)` · `--dur-fast 150ms` · `--dur-ui 300ms` · `--dur-reveal 600ms` · `--dur-line 900ms` · `--dur-page 800ms` · `--swell-min 300ms` |
| **Z-index** | content 10 · header 50 · frame 60 · cursor 90 · dialog 100 · loader 110 · skip link 120 (canvas 0, hands plate −1) |
| **Breakpoints** | `sm 480` · `md 768` · `lg 1024` · `xl 1440` |

**Reduced motion in CSS.** `[data-motion="off"]` on `<html>`, set by `MotionToggle` and on first paint from `prefers-reduced-motion`, zeroes every motion duration and turns off every transform-based reveal.

## 3. Shell components

| Component | Responsibility | Key props / state | Motion; reduced motion | Accessibility |
|---|---|---|---|---|
| `RootLayout` | Fonts, `<html lang="en-GB" data-motion data-theme>`, providers, shell, the persistent `SceneCanvas`, the `modal` slot | — | — | Landmarks; one `main` |
| `SmoothScroll` | Starts Lenis and drives ScrollTrigger from Lenis's RAF | `enabled` (motion on) | Off under reduced motion; native scroll | Keyboard scrolling, find-in-page and anchor jumps keep working |
| `ViewportFrame` | Fixed blue border (R2) | — | — | `aria-hidden`; pointer-events none |
| `Header` | Wordmark, `IndexNav`, `ChapterCounter`, `MotionToggle`; mobile "Menu" | `hidden` (scroll direction) | Slides out and back in; instant under reduced motion | Shows whenever it holds focus; `scroll-padding-top` set to its height |
| `IndexNav` | Comma-separated links (R6) | `current` chapter | Underline grows | `nav aria-label="Sections"`; `aria-current="location"` |
| `MobileMenu` | Full-screen blue sheet | `open` | Wipe; instant under reduced motion | Dialog semantics; focus trap; Esc closes; focus returns to "Menu" |
| `ChapterCounter` | "(03/14)" | `current`, `total` | Digits roll | `aria-hidden` (headings carry the structure) |
| `MotionToggle` | Global motion on/off | `motion` in store; saved in `localStorage` | — | `button aria-pressed`; text "Motion: on/off" |
| `SkipLink` | "Skip to content" | — | — | First focusable element; visible on focus |
| `Footer` | Columns (structure §2.3) | — | Stroke drawing | `footer` landmark; real links |
| `Loader` | Blue field, wordmark, hairline bar, one line; the ring ignites at the end | `progress` 0–1 (fonts + 3D chunk + environment), `done` | Wipes up; capped at 2.5 s; skipped once per session; 200 ms fade under reduced motion | `aria-hidden`; never traps focus; the content behind is already in the DOM |
| `PageTransition` | Blue panel wipe between `/` and `/about`; tells the rig to fly to the next pose | `from`, `to` | 800 ms; instant under reduced motion | Moves focus to the new page's `h1`; announces the title |
| `CursorFollower` | A 28 px ring that follows the native cursor; grows to about 64 px with a verb label over `[data-cursor]` targets | `variant`: default · drag · open · play · step | Lerped; off on touch, reduced motion, `forced-colors`, or Motion off | Never hides the system cursor; `aria-hidden`; pointer-events none |

## 4. 3D layer

### 4.1 `SceneCanvas`

- **One instance.** A single R3F `<Canvas>` in `RootLayout`, so the baton persists across routes.
  - Fixed, full viewport, `aria-hidden="true"`, transparent (`alpha: true`) over the page background.
  - `pointer-events: none`. Interaction is always caught by HTML elements, which write to the store (§8).
- **Loading:** through `next/dynamic` with `ssr: false`, after first paint (`requestIdleCallback`). It never blocks LCP.
- **Rendering:**
  - `frameloop="demand"`. Controllers call `invalidate()` while something is moving.
  - Rendering stops when the tab is hidden or `dialogOpen` is true.
  - DPR: `[1, 1.75]` on the Full tier, `1` on Lite.
  - Colour: sRGB output, AgX or ACES tone mapping.
- **Render error:** if it throws, the store sets the tier to `static`.

### 4.2 `QualityTier`

| Tier | Chosen when | Effect |
|---|---|---|
| `full` | WebGL2, at least 4 cores, `deviceMemory` of 4 or more (when reported), viewport `md` or wider, motion on | Everything; optional bloom on the light ring |
| `lite` | Mobile or low-spec, or drei `PerformanceMonitor` drops below its threshold | DPR 1, no post-processing, a third of the DotField, simple internals (boxes) |
| `static` | No WebGL, reduced motion, Motion off, or a render error | The canvas is not mounted; `StaticPoster` per chapter |

The tier can go down at runtime but never back up in the same session, to avoid flicker.

### 4.3 `Lighting`

- **Studio light, with no download:** drei `<Environment resolution={256}>` built from `<Lightformer>`s.
  - A large overhead softbox (key).
  - Two thin vertical rim strips.
  - A low white floor bounce.
- **Optional:** a 1k CC0 Poly Haven studio HDR, self-hosted, for richer reflections on Full. Adopt only if it clearly improves the look.
- **Shadows:** `<ContactShadows>` under the baton on white chapters (R1); off on blue chapters and on Lite.
- **Blue chapters:** a faint cool blue fill light.

### 4.4 `Baton`: procedural model **[DECIDED 11-02]**

Units are metres. Positions run along the long axis from the sensor-head tip (0 mm) to the end cap (200 mm), Ø 38 mm (PRD-NF-004).

**[ASSUMPTION]** These proportions were read off `assets/device/Vertical L.I.G.H.T. Baton and Cane.png`. Tune them by eye against that render.

| Part (mesh name) | Span (mm) | Geometry | Detail |
|---|---|---|---|
| `head.shell` | 0–58 | `LatheGeometry`, 1.5 mm chamfers | Ring of 4 rectangular windows (about 9 × 12 mm) at 18–44 mm |
| `head.lens` | front face | Disc Ø 16 + glass dome | Camera lens with an inner iris |
| `head.windows` | 18–44 | Inset boxes | Dark glass |
| `head.button` | about 50 | Cylinder Ø 6 | Small round button on top |
| `ring` | 58–61 | Thin cylinder, Ø 38.4 | **Light ring**, emissive |
| `body.shell` | 61–118 | Cylinder | Bead-blasted graphite |
| `body.buttons` | 72–112 | Two drei `RoundedBox` pills (16 × 9 × 0.8 mm) | Raised braille dots (small spheres) on each |
| `clip` | 64–96, underside | `ExtrudeGeometry` C-profile around a Ø 12 mm shaft | Sprung jaw, flush release lever, black elastomer insert (TRD-HW-014). Animates open to closed |
| `grip.shell` | 118–188 | `LatheGeometry`, hourglass Ø 38 → 35 → 38, slight oval 1 : 0.94 | Soft-touch, dimpled (normal map). Channel underneath for the cane's grip (TRD-HW-005) |
| `cap` | 188–200 | Cylinder with a fillet | Thin white status slit on the end face |

**Materials** (`materials.ts`):

| Material | Settings |
|---|---|
| Anodised graphite | `MeshPhysicalMaterial`: colour `#2B2D33`, metalness 0.85, roughness 0.5, clearcoat 0.1 |
| Soft-touch grip | `MeshStandardMaterial`: colour `#26282D`, metalness 0, roughness 0.85, plus a **dimple normal map generated at runtime** on a canvas (about 1.2 mm dimples, 2.5 mm pitch), so there is no texture download |
| Dark glass (windows, lens) | `MeshPhysicalMaterial`: colour `#0B0C10`, roughness 0.05, clearcoat 1, no transmission (cheaper) |
| Light ring | `MeshStandardMaterial`: emissive `#F4F6FF`, intensity driven by `LightRingController` |
| Elastomer | `MeshStandardMaterial`: colour `#111214`, roughness 0.9 |

**Internals.** These are shown only in x-ray and explode views. They are **drawn in diagram style**, not photoreal:
- flat plates and simple shapes;
- white or blue line edges (`EdgesGeometry`);
- the highlighted part filled in chartreuse.

They are illustrative, and the copy says so.

| Internal (mesh name) | Group | Source |
|---|---|---|
| `int.tof` ×4 | Head | TRD-HW-002 |
| `int.ultrasonic` ×2 | Head (safety core) | TRD-HW-016 |
| `int.camera`, `int.nir` | Head | TRD-HW-003, TRD-HW-013 |
| `int.mics` ×4 | Head | TRD-HW-004 |
| `int.mainBoard` | Body | TRD-HW-001 |
| `int.safetyCore` | Body | TRD-HW-015 |
| `int.imuGnss` | Body | TRD-HW-006, TRD-HW-007 |
| `int.actuators` ×8 | Grip | TRD-HW-005 (the copy says the design calls for 8–16) |
| `int.battery` (main + `int.batteryReserve`) | Grip | TRD-HW-009, TRD-HW-017 |
| `int.storage` | Grip | TRD-HW-018 |
| `int.coil` | Cap | TRD-HW-009 |

**Explode data.** Each part and internal has an `explodeOffset` (mostly along the axis, with a small radial push for internals) and a `stagger` index in assembly order. These live in `dimensions.ts`.

**Swapping in a GLB.** `Baton.tsx` exposes the same named groups, so a future GLB with matching node names can replace the procedural parts without touching the controllers.

### 4.5 `Cane`

- **Shaft:** Ø 12 mm, about 1.2 m long. Only about 0.6 m is ever in frame, and it runs out of frame.
- **Colours:** white `#F2F2EE`, with a **small red band** near the tip. The band is the real cane's colour, not a UI colour.
- **Tip:** a rubber roller tip.
- **Grip:** a black rubber golf-style grip that nests under the baton's grip.
- **Animation:**
  - `enter` progress 0–1 slides it in diagonally (chapter 03).
  - `opacity` fades it out (chapter 07).
  - `lit` keeps it bright while everything else dims (the ladder's "Cane" level).

### 4.6 Rig and choreography

| Module | Responsibility |
|---|---|
| `choreography.ts` | A typed copy of [structure §4](04_site_structure.md#4-baton-choreography): one `Keyframe` per chapter (`pos`, `tilt`, `spin`, `spinRate`, `scale`, `cane`, `explode`, `xray`, `ring`). Includes a `mobile()` mapping |
| `useChapterProgress` | One ScrollTrigger per chapter. Writes `chapter` and `chapterProgress` to the store |
| `BatonRig` | Each frame: picks the outgoing and incoming keyframes, blends them over the boundary window (the last 30 % of one chapter and the first 20 % of the next), then eases the live pose toward the target with **critically damped springs** (`maath/easing` `damp3`, `dampE`; settle time about 0.35 s). Adds the hero's pointer tilt (±8°) and drag spin (velocity with friction). Anchor jumps snap straight to the target chapter |
| Static tier | Not mounted. `StaticPoster` reads the same chapter ids |

### 4.7 Controllers

| Controller | Input (from the store) | Output | Rules |
|---|---|---|---|
| `ExplodeController` | `explode` 0–1 | Part positions from `explodeOffset × ease(explode − stagger)` | Straight lines, ease-in-out, a stagger of about 3 % per part; the clip drops straight down |
| `XRayController` | `xray` 0–1, `ladderLevel`, `xrayScope` (`all` or `grip`) | Shell opacity (down to 15 %), internals visible, per-part lit or dim | Level maps to lit sets: **Full** all · **Reduced** minus identification and navigation · **Memory** minus cameras · **Safety core** only `int.safetyCore`, `int.ultrasonic`, single ToF, actuators · **Cane** none, with the cane lit |
| `HapticRingController` | `obstacles[]` (angle, distance, kind), `stopPulse` | Intensity 0–1 for each of the 8 actuators | Angle to the nearest actuator, with a cosine falloff to its neighbours; intensity rises as distance falls; top 3 obstacles only (PRD-F-002); swells of at least 300 ms; `stopPulse` swells all to 1.0 once over 900 ms and silences everything else |
| `LightRingController` | `ring` mode | Emissive intensity | Modes: `off`, `breathe` (4 s), `swell` (one, 600 ms), `double` (two swells 250 ms apart), `steady`. Never more than 3 peaks per second (2.3.1) |

### 4.8 Scenes

| Scene | Where | What | Lite | Static |
|---|---|---|---|---|
| `DotField` | 01, 02 and blue chapters | An `InstancedMesh` grid of chartreuse discs on a plane behind the content (12 px dots, 24 px pitch). A shader swells dots near the pointer and near the baton head's screen position | A third of the dots; pointer only | CSS `radial-gradient` dot background |
| `SensingCones` | 02 | Four dot-built cones from the sensor head (ahead, overhead, side approach, pointing beam). Each lights as its list item is reached | Fewer dots | Included in the poster |
| `RouteMapPlane` | 06 | A tilted plane of white street lines. Route drawn as a `Line2` with a `drawProgress` uniform. Obstacle markers drop in; a walker dot runs the path; a temporary bike appears and fades | Same, no shadows | Final-state poster |
| `RadarScene` | 07, 08 | **HTML/SVG, not WebGL** (so it stays crisp and fully accessible): a walker, 8 positions, a draggable obstacle, the STOP cyclist | Same | Two or three stills |

### 4.9 `StaticPoster`

- `<picture>` with AVIF and WebP, one per chapter state (`/posters/ch01.avif` … `ch14`, `about`, plus one per ladder level and STOP step).
- Alt text is empty when the chapter's own text already describes the image; otherwise it describes it.
- Rendered by `scripts/render-posters.mjs` (`npm run posters`, after `npm run build`): it starts the built site with `POSTER_MODE=1`, opens `/poster?name=…` for each state, the rig snaps to that keyframe, and the script saves a transparent WebP. Regenerate the posters whenever `choreography.ts` changes.

## 5. Chapter components

Each chapter is a `<section id data-theme aria-labelledby>` with an `h2`. Its copy comes from `content/`. It writes 3D state only through the store.

| Component | Anchor | Content file | Primitives used | Writes to store | Interaction | Fallback / screen reader |
|---|---|---|---|---|---|---|
| `Hero` | `#top` | `chapters.ts` | Eyebrow, LineReveal, Button ×2, ConceptLabel | `dragSpin` | I1: rotate buttons + drag surface | Poster; product described in text |
| `WhatItAdds` | `#what-it-adds` | `chapters.ts` | Eyebrow, numbered list, LineReveal | `activeCone` | Scroll-linked | Poster with all cones |
| `CaneClip` | `#cane` | `chapters.ts` | AnimationNote, ConceptLabel, facts list | `caneEnter`, `clipClosed` | I2: pinned scrub | Three stills |
| `Reliability` | `#reliability` | `reliability.ts` | Stepper (tablist), AnimationNote | `ladderLevel`, `xray` | I3 | One poster per level; panels are text |
| `GuideNotes` | `#guide-notes` | `chapters.ts` | Button (play), PauseButton, transcript | `notePlaying` | I4 (user-started audio only) | Two stills + transcript |
| `RouteMemory` | `#route-memory` | `chapters.ts` | Button ("Walk it again"), badges, event list | `routeProgress`, `routeRun` | I5 | Final-map poster; ordered event list |
| `Haptics` | `#haptics` | `chapters.ts` | RadarScene, live region | `obstacles[]`, `xrayScope="grip"` | I6: drag / click / arrow keys | Two stills; live text |
| `Stop` | `#stop` | `chapters.ts` | Button (Replay), AnimationNote | `stopPulse`, theme → chartreuse | I7: plays once in view | Three stills with captions |
| `Inside` | `#inside` | `inside.ts` | Hotspot list, SourceNote | `explode`, `focusGroup` | I8: pinned scrub + hotspots | Exploded poster; full list |
| `Mockups` | `#mockups` | `chapters.ts` | Gallery, ConceptLabel | `galleryOffset` | I9 | Grid |
| `Prototype` | `#prototype` | `site.ts` (URL) | Video + PauseButton, Button (external) | — | Link out | Text description of the recording |
| `WhyItMatters` | `#why` | `stats.ts` | Stat, Counter, dot-grid SVG, SourceNote | — | Count-ups | Final numbers |
| `Timeline` | `#timeline` | `milestones.ts` | Schedule rows, SVG line | `timelineProgress` | Line draws | Drawn line |
| `Closing` | `#contact-cta` | `chapters.ts` | Button (primary), TextLink | — | Opens the dialog | — |
| About sections | `/about` | `about.ts` | LineReveal, numbered list, founder cards | — | — | — |

## 6. UI primitives

| Primitive | Purpose | Notes |
|---|---|---|
| `Button` | Pill button: `primary` (blue on white; chartreuse on blue), `secondary` (outline) | At least 44 px tall; `[data-cursor]` verb; visible focus ring |
| `MagneticButton` | Wraps `Button`; pulls up to 6 px toward the pointer | Off under reduced motion and on touch |
| `TextLink` | Inline link with an underline that slides in | External links get ↗ plus visually hidden "opens in a new tab" |
| `Eyebrow` | "(04) reliability" | Lowercase label style |
| `ConceptLabel` | "Concept visual" tag on every render, 3D view and mockup | Real text, not inside the image |
| `Stat` | Big numeral + label + source | `figure` / `figcaption`; a source is **required** by type |
| `SourceNote` | Footnote-style source line with a link | Used by `Stat` and `Inside` |
| `LineReveal` | Splits a heading into lines (GSAP SplitText) and raises each from a mask (R6) | The original text node stays for screen readers; plain text under reduced motion |
| `Counter` | Counts up to a value once in view | Final value in the DOM from the start; `aria-hidden` on the animating digits |
| `Stepper` | Accessible tablist (fallback ladder) | Arrow keys, Home and End; `aria-selected`; the panel is the text equivalent |
| `Hotspot` | Numbered dot button beside a 3D part; opens a small panel | Real `button`; `aria-expanded`; follows the 3D part's projected position, and drops back to the list on Static |
| `Gallery` | Horizontal track with drag, wheel and buttons | Previous/next buttons (2.5.7); focusable cards; not a carousel that moves by itself |
| `Dialog` | Modal shell: native `<dialog>` with `showModal()` | Labelled by its heading; Esc closes; focus trap and return; background `inert` |
| `Field`, `TextArea` | Labelled inputs with hint and error | Visible labels (never placeholder-only); `aria-describedby`; `aria-invalid` |
| `FormStatus` | Sending / sent / error messages | `role="status"` for progress; `role="alert"` for errors |
| `PauseButton` | Pause/play for anything moving more than 5 s (video, loops) | `aria-pressed`; also stops when Motion is off |
| `AnimationNote` | The visible "What the animation shows" caption | Required next to every visual-only demo |
| `VisuallyHidden` | Screen-reader-only text | — |

## 7. Contact

| Piece | Responsibility |
|---|---|
| `ContactDialog` | `@modal/(.)contact` route. Wraps `ContactForm` in `Dialog`. Closing calls `router.back()`. Sets `dialogOpen` in the store (pauses the canvas and Lenis) |
| `contact/page.tsx` | The same `ContactForm` as a full page, for direct loads and no-JS |
| `ContactForm` | A `<form action={sendContact}>` using `useActionState`. Fields: `email`, `message`, honeypot `company`, hidden `openedAt`. Handles the states in [structure §6.3](04_site_structure.md#63-states) |
| `actions/contact.ts` | Server Action. A zod schema: `email` (an email, 254 characters or less) and `message` (optional, 2000 characters or less). Honeypot or a submit faster than 3 s → silent success. Sends with `resend.emails.send({ from: CONTACT_FROM, to: CONTACT_TO, replyTo: email, subject, text })`. Returns `{ ok }` or `{ errors }`. Never logs the message content |
| Environment variables | `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`: server-only, set in Vercel, never `NEXT_PUBLIC_` |

## 8. Shared state (`lib/store.ts`, zustand)

| Field | Type | Written by | Read by |
|---|---|---|---|
| `motion` | `'on' \| 'off'` | `MotionToggle`, first paint | Everything that animates |
| `tier` | `'full' \| 'lite' \| 'static'` | `QualityTier`, render errors | `SceneCanvas`, `StaticPoster` |
| `loaderDone` | boolean | `Loader` | `BatonRig` (ring ignite) |
| `chapter`, `chapterProgress` | id, 0–1 | `useChapterProgress` | `BatonRig`, `Header`, `ChapterCounter` |
| `dragSpin` | number (velocity) | `Hero` | `BatonRig` |
| `activeCone` | 0–3 or null | `WhatItAdds` | `SensingCones` |
| `caneEnter`, `clipClosed` | 0–1, boolean | `CaneClip` | `Cane`, `Baton` |
| `ladderLevel` | 0–4 | `Reliability` | `XRayController`, `LightRingController` |
| `xray`, `xrayScope` | 0–1, `'all' \| 'grip'` | Chapters 04, 07, 08 | `XRayController` |
| `notePlaying` | boolean | `GuideNotes` | `LightRingController` |
| `routeProgress`, `routeRun` | 0–1, number | `RouteMemory` | `RouteMapPlane` |
| `obstacles` | `{angle, distance, kind}[]` | `Haptics` | `HapticRingController`, `RadarScene` |
| `stopPulse` | number (increments trigger it) | `Stop` | `HapticRingController` |
| `explode`, `focusGroup` | 0–1, group id | `Inside` | `ExplodeController`, `Hotspot` |
| `galleryOffset` | number | `Gallery` | `BatonRig` (chapter 10 docking) |
| `timelineProgress` | 0–1 | `Timeline` | `BatonRig` (chapter 13) |
| `dialogOpen` | boolean | `ContactDialog` | `SceneCanvas`, `SmoothScroll` |

## 9. Content model (`content/*.ts`)

Copy lives in typed files, so copy edits never touch components.

```ts
type Source = { name: string; url: string; checked: string | null }   // checked = ISO date, null = not yet re-checked
type Stat = { value: string; label: string; source: Source }          // source required
type Milestone = { when: string; status: 'done' | 'now' | 'next' | 'later'; title: string; line: string; confirmed: boolean }
type Chapter = { id: string; n: number; theme: 'white' | 'blue'; eyebrow: string; title: string; lead?: string;
                 body: string[]; facts?: { text: string; isTarget?: boolean }[]; animationNote?: string; conceptVisual?: boolean }
type Hotspot = { id: string; group: 'head' | 'ring' | 'body' | 'grip' | 'cap'; label: string; detail: string; trd: string[] }
```

**`scripts/check-content.mjs`** runs in `npm test` and fails the build when:
- the copy contains forbidden terms: partner names from AGENTS.md §5, "replace(s) the cane", "standalone", "cure", "guaranteed";
- a `Stat` has no source, or its `checked` is `null` (warning in development, error in production builds);
- a product number in `facts` lacks `isTarget`;
- a `Milestone` with `confirmed: false` would be published.

## 10. Dependencies

| Package | Role |
|---|---|
| `next`, `react`, `react-dom`, `typescript` | Framework |
| `three`, `@react-three/fiber`, `@react-three/drei` | 3D. `maath` comes with drei and is used for the damping |
| `@react-three/postprocessing` | Optional: bloom on the light ring, Full tier only |
| `gsap` (ScrollTrigger, SplitText) | Scroll choreography, line reveals |
| `lenis` | Smooth scroll |
| `zustand` | Shared state between HTML and 3D |
| `tailwindcss` v4, `@tailwindcss/postcss` | Styling and tokens |
| `zod` | Contact validation |
| `resend` | Sending contact emails |
| Dev: `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`, `eslint` | Tests, accessibility, performance budgets |

No analytics, tag-manager, cookie or font-CDN packages.

## 11. Testing and acceptance

| Check | How | Pass when |
|---|---|---|
| Accessibility scan | `@axe-core/playwright` on `/`, `/about`, `/contact`, with the dialog open and the mobile menu open, in both themes | No violations |
| Keyboard | Playwright walks every interaction I1–I11 by keyboard alone | Every function reachable; focus always visible and never obscured |
| Reduced motion | Emulate `prefers-reduced-motion: reduce` | No Lenis; Static tier; posters shown; no transforms animating |
| No WebGL | Launch with WebGL disabled | All content and interactions work; posters shown |
| Contact | Action tests with Resend mocked: valid, invalid, honeypot, too-fast submit; plus a no-JS form post | The right state each time; nothing sent for spam |
| Content rules | `check-content.mjs` | No forbidden terms; every stat sourced; targets labelled |
| Performance | Lighthouse CI on mobile | The budgets in [brief §10.3](03_design_brief.md#103-budgets-targets) |
| Screen readers (manual) | NVDA + Firefox and Chrome on Windows; VoiceOver + Safari on macOS and iOS; TalkBack + Chrome | The story reads in order; the dialog and stepper are announced correctly; "L.I.G.H.T" sounds right |
| Zoom, reflow, contrast modes (manual) | 200 % and 400 % zoom, 320 px width, Windows contrast themes (`forced-colors`) | No loss of content; focus rings and controls still visible |
