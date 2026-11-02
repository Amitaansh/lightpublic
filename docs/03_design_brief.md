# L.I.G.H.T — Website UI/UX Design Brief (`light-public`)

> **Status:** v0.2 · approved by the founder 11-02 · site v0.1 built · **Last updated:** 2026-11-02
> Companion documents: [PRD v0.7](01_prd.md) (§8 Showcase scope) · [TRD v0.6](02_trd.md) · [Site structure](04_site_structure.md) · [Site components](05_site_components.md)
> Tags: **[OPEN]** = undecided · **[ASSUMPTION]** = inferred, confirm · **[REC]** = recommendation, pending decision · **[DECIDED MM-DD]** = confirmed by founder
> No site code is written until the founder approves this brief and documents 04–05.

## 1. Goal of the site

- **First 10 seconds.** L.I.G.H.T is a sensing baton that clips onto the white cane. It warns of what the cane can't reach: obstacles ahead, things at head height, and anything coming fast. It is a concept in development.
- **By the end.** A visitor should:
  - understand how it works;
  - trust that safety comes first (the reliability chapter);
  - have seen the working software prototype;
  - know where the project stands;
  - want to get in touch.
- **Primary call to action:** **Get in touch** opens the contact pop-up, which takes an email and an optional message. **[DECIDED 11-02]**
- **Secondary:** **Try the software prototype**, which links to the POC app. **[DECIDED 11-02]**
- **Tertiary:** the About page.

## 2. Audience

**[DECIDED 10-31]** Investors, and anyone who wants to learn what L.I.G.H.T is.

| Group | Looking for | What convinces them | Where the site answers |
|---|---|---|---|
| **Investors** | Is it real? Is the team credible? Is there a market? What's next? | Honesty about the stage, a serious reliability design, a working prototype, sourced figures, clear milestones | Chapters 04, 09, 11, 12, 13; About |
| **Curious public, press, accessibility community** | What it is and how it feels to use | The haptic ring and STOP demos, Guide Notes, Route Memory | Chapters 01–08 |
| **Blind and low-vision visitors, O&M instructors** | Whether it respects how they already travel, and whether the site works for them | The whole story in HTML, no information carried only by visuals, reading order = story order, a motion switch | Every chapter |

The site is part of the proof. If it is hard to use with a screen reader, the product claim falls apart.

## 3. Fixed constraints

These hold for everything below. Sources: [PRD §8](01_prd.md#8-showcase-scope-light-public) and [AGENTS.md](../AGENTS.md).

- **Fresh visual style.** Not the pitch deck's (near-black, gold, IBM Plex) or the POC app's (Inter, cyan/amber). Now briefed in §6.
- **Concept stage, said plainly.** Renders and 3D are labelled as concept visuals. Product numbers are labelled as targets.
- **Story order:** works with the cane you already trust → reliability → Guide Notes and Route Memory → advanced sensing.
- **Reliability is a headline feature.** The fallback ladder must be easy to understand visually.
- **Never** say it replaces the cane. **No** partner or research-organisation names or logos.
- **Standalone use is not mentioned.** **[DECIDED 11-02]** The baton may be shown floating on its own as a product shot. The copy never says it works without the cane.
- **Accessibility is the proof:** WCAG 2.2 AA minimum, full keyboard and screen-reader use, visible focus, `prefers-reduced-motion` respected, no autoplaying sound, captions/transcripts, meaningful alt text.
- **Rich WebGL, as progressive enhancement.** **[DECIDED 11-02; replaces "minimal JavaScript"]**
  - Every piece of content and every function is plain HTML, and works without WebGL or scroll animation.
  - The 3D layer loads after the text.
  - It steps down through three quality tiers (§10.2).
- **Privacy:** no cookies. The motion preference is kept in `localStorage`. No analytics unless the founder approves a cookie-free option.
- **Hosting:** Vercel, project `beyourlight`.

## 4. References

The founder's images are R1–R3 (image 3 was a duplicate of image 2). The sites are R4–R6. Rows R4–R6 were checked against each site's own HTML and JavaScript bundles on 2026-11-02.

| # | Reference | What to take from it | What to avoid |
|---|---|---|---|
| R1 | Serum bottle floating on white, soft-focus hands reaching in from above and below | One product as the single hero object, floating at centre. Airy white space. Blurred human hands add scale and warmth, and suggest touch and help | The amber product palette. Hands that look as if they are taking the device away: they reach **toward** it |
| R2 | "getting there" lecture-series poster | Thick, even blue line drawings with rounded caps. Chartreuse dot grids overlapping the drawings. Oversized lowercase type cropped by the frame. A heavy blue border. Small multi-column info blocks in bold lowercase | Clutter: one drawing per chapter, at most. Cropped type that crops real information: the full word must also exist as readable text |
| R3 | XOXO 2015 festival site | Full-bleed blue header and footer. White serif statements on blue. Schedule rows (time and place on the left, title and description on the right) as the template for the timeline. Thin rules. Chartreuse geometric strokes drawn over content. Small round arrow buttons | Chartreuse strokes crossing body text. Keep them behind text or in the margins |
| R4 | [klimtwine.com/en](https://klimtwine.com/en) | **The motion model:** one 3D product carried through the whole page, spinning, gliding between left and right rails, and twisting on its axis between chapters, all scrubbed by scroll. A text loader, a "Scroll to explore" cue, and studio-lit physical materials. Built with Next.js, React Three Fiber, drei and GSAP ScrollTrigger, with a Draco GLB and small HDRs | The wine-luxury tone. Tag-manager tracking |
| R5 | [teatika.com/en](https://teatika.com/en) | **The loader:** a centred wordmark over a hairline progress bar that fills in the brand colour. A "Drag to rotate" invitation on 3D. Honesty about file weight. Archivo type and Lenis smooth scroll | The dark-gold palette. Sales tone |
| R6 | [kononenkogroup.com](https://kononenkogroup.com/) | A comma-separated index nav ("Index, Work, About, Contact"). Line-by-line masked text reveals. Numbered lists ("01–08") and counters ("(8+)"). Big stat numerals. A serif plus grotesk pairing. Restrained, smooth motion | Tiny, low-contrast labels |

**How we "borrow".** We recreate these effects in our own code. We don't copy code, images or font files from these sites. Where a reference uses a free font, we use that font (§6.3).

## 5. Brand and tone

- **Personality:** calm · precise · optimistic · tactile · honest.
- **Voice:**
  - Plain, short sentences, in the second person ("you", "your cane").
  - Confident about the design, honest about the stage.
  - Treat the cane user as the expert, never as a patient.
  - Write "blind and partially sighted people" or "people who are blind or have low vision". Never use "the blind" as a noun, and never "suffering from".
- **Words to use:** concept, designed to, target, your cane, warns, feel, remembers, offline, on the device.
- **Words to avoid:**
  - replaces the cane, standalone;
  - cure, guaranteed, 100% safe, revolutionary;
  - "lets you see";
  - any medical or clinical claim;
  - any partner or organisation name.
- **Numbers:** metric. Every product number is labelled "target" or "design target".
- **Name:**
  - Always "L.I.G.H.T" in running text.
  - Give the full name, *LIDAR Integrated Guidance & Handheld Tracker*, once per page.
  - **[OPEN]** Check how NVDA and VoiceOver pronounce "L.I.G.H.T". If it reads badly, give the visual wordmark `aria-hidden` and pair it with visually hidden text.
- **Working tagline:** "Be your light", from the Vercel project name. **[OPEN]**
- **Wordmark:** **[OPEN]** Interim: "L.I.G.H.T" set in Archivo, expanded width, extra-bold. The dots are chartreuse on blue and blue on white.

## 6. Visual direction — "Blue Signal" **[DECIDED 11-02]**

The founder set the palette and references directly, so this brief describes one direction instead of the skeleton's 2–3 alternatives.

**In one line:** a calm, Swiss, white-and-blue page where a single graphite baton floats, and **chartreuse marks every moment the device senses, signals or speaks.**

**The signal rule.** Chartreuse means *signal*. Each of these is something L.I.G.H.T senses or tells you, so each is chartreuse:
- a haptic actuator firing;
- a sensing zone;
- a Guide Note;
- a remembered obstacle;
- STOP.

The one exception is the primary button on blue chapters. Everything else is blue or white.

### 6.1 Colour

| Token | Hex | Role |
|---|---|---|
| `white` | `#FFFFFF` | Page and "product" chapters; text on blue |
| `blue` | `#233CCD` | Text on white; "story" chapters; frame; rules; line drawings |
| `chartreuse` | `#DBFE1B` | Signal (see the rule above); the primary button on blue; focus ring on blue |

Derived tints only, never new hues:
- `blue-80` `#4F63D7`: secondary text on white.
- `white-80` `#D3D8F5`: secondary text on blue.
- A pale blue surface tint, for cards on white.
- Graphite `#2B2D33`: for the **3D baton material only**.

The cane's small red band in 3D is a realism detail, not a UI colour.

**Contrast** (WCAG relative luminance, computed 11-02):

| Pair | Ratio | Use |
|---|---|---|
| Blue on white, white on blue | **8.1 : 1** | All text sizes |
| Chartreuse on blue, blue on chartreuse | **7.0 : 1** | Text, icons, focus ring on blue, the STOP field |
| `blue-80` on white | 5.1 : 1 | Secondary text |
| `white-80` on blue | 5.7 : 1 | Secondary text |
| **Chartreuse on white** | **1.15 : 1** | **Fails everything.** Never carries meaning on white |

**Rules:**
- **On white,** chartreuse is either decorative (dot grids, R2) or a fill inside a blue outline. A signal on a white chapter is a chartreuse dot with a 2 px blue edge.
- **Focus ring:** 3 px. Blue on white, chartreuse on blue, offset 3 px. Always visible, never removed.
- **Chapter rhythm:**
  - White "product" chapters, after R1, where the baton is the subject.
  - Full-bleed blue "story" chapters, after R3, where the idea is the subject.
  - The page background **tweens** between the two as chapters change, the way klimt does. Under reduced motion it switches with a hard cut.
- **STOP** (chapter 08) is a steady chartreuse field on blue. There is no red, and nothing flashes.

### 6.2 Layout and grid

- 12-column grid.
- Margins: `clamp(20px, 4vw, 64px)`. Gutters: `clamp(16px, 2vw, 32px)`.
- **Two rails.** On wide screens the copy sits on one rail (5–6 columns) and the baton takes the other. The baton changes rail between chapters (§6.7).
- **Viewport frame** (R2): a fixed blue border, 10 px on desktop and 6 px on mobile. On blue chapters it merges into the background.
- **Mobile:** the baton sits in a band across the top (about 45 % of the viewport height), with the copy below. There is no side-by-side layout.
- **Shape:**
  - Square corners on cards and images (Swiss).
  - Pill-shaped buttons, with a round arrow glyph (R3).
  - 1 px hairline rules between rows.

### 6.3 Typography

| Role | Family | Licence | Notes |
|---|---|---|---|
| Display and UI | **Archivo** (variable: weight 100–900, width 62–125) | SIL OFL, Google Fonts | The font teatika uses. Expanded widths for oversized lowercase statements (R2) |
| Editorial serif | **Hedvig Letters Serif** (24 pt optical size for display) | SIL OFL, Google Fonts | The serif kononenko uses. Large statements on blue (R3) and About-page long-form |
| Optional upgrade | PP Neue Montreal | Paid web licence (Pangram Pangram) | kononenko's grotesk. Could replace Archivo for UI text. **[OPEN]**; default is no |
| Not used | Canela, ABC Monument Grotesk | Paid | klimt's fonts |

Fonts are self-hosted at build time through `next/font`, so no request goes to Google when someone visits.

| Style | Family, weight, width | Size | Line height | Tracking |
|---|---|---|---|---|
| `statement` (cropped, decorative) | Archivo 800, width 125, lowercase | `clamp(5rem, 18vw, 22rem)` | 0.82 | −0.04 em |
| `h1` | Archivo 700, width 100 | `clamp(2.75rem, 6vw, 6rem)` | 0.95 | −0.02 em |
| `h2` (chapter title) | Archivo 700 | `clamp(2.25rem, 4.5vw, 4.5rem)` | 1.0 | −0.02 em |
| `h3` | Archivo 600 | `clamp(1.375rem, 2vw, 1.75rem)` | 1.15 | −0.01 em |
| `lead-serif` | Hedvig Letters Serif | `clamp(1.5rem, 2.6vw, 2.5rem)` | 1.2 | 0 |
| `body` | Archivo 400 | 1.125rem (18 px) | 1.55 | 0 |
| `body-serif` (About) | Hedvig Letters Serif | 1.25rem (20 px) | 1.5 | 0 |
| `label` / eyebrow | Archivo 600, lowercase, with a number such as "(03)" | 0.875rem (14 px) minimum | 1.3 | 0.02 em |
| `numeral` | Archivo 700, tabular numbers | Matches context | — | — |

**Rules:**
- **Cropped statement type is decorative.** It is `aria-hidden`, and a normal-size real heading carries the same words.
- **Measure:** lines of 45–75 characters.
- **Sizes:** body text never below 16 px, and labels never below 14 px.
- **Text spacing overrides** (WCAG 1.4.12) must not break the layout.

### 6.4 Graphic motifs

1. **Line drawings** (R2):
   - Even 6 px strokes (scaling with size), with rounded caps and joins.
   - Blue on white, white on blue.
   - One per chapter, drawn on scroll.
   - Set: cane, overhead branch, cyclist, pole, earbud, waveform and pin, path and map, battery, chip, ring of dots.
2. **Dot grids → DotField** (R2):
   - Chartreuse dots about 12 px across, on a 24 px pitch.
   - They stand for **braille cells and haptic actuators.**
   - In WebGL the dots swell as the pointer or the baton's sensor head comes near, the way haptics strengthen as an obstacle nears.
   - On white they are decorative only.
3. **Gestural strokes** (R3): thick, open, geometric strokes (an arc, a chevron, a line), drawn on scroll. Chartreuse on blue chapters, blue on white chapters.
4. **Viewport frame and hairline rules** (R2, R3).

### 6.5 Imagery

- **The centrepiece is the real-time 3D baton.** It is built in code ([05 §4](05_site_components.md#4-3d-layer)).
  - Graphite anodised body, a soft-touch dimpled grip, dark-glass sensor windows, and a **soft-white light ring** (the 11-01 colourway is kept).
  - Lit by a soft studio environment: an overhead key, rim strips, and a white floor bounce.
  - On white chapters it sits over a soft contact shadow (R1). On blue chapters it picks up a cool blue reflection.
  - Under the "Static" tier it is replaced by pre-rendered posters of the same scene.
- **The light ring is the baton's voice.**
  - It **breathes** when idle.
  - It **swells** once to confirm (clip-on, each fallback step).
  - It **double-swells** for a remembered obstacle.
  - It holds **steady** at the close.
- **Hands plate** (R1): two soft-focus hands reaching toward the baton, one from above and one from below. They read as a sighted helper and a user, and echo Guide Notes. It is a photographic plate on white, generated from a new prompt. Because the hands are blurred, they never show an identifiable person.
- **Still renders and mockups** are restaged on a light, seamless backdrop so they sit on white chapters (this is a follow-up to [image-prompts.md](image-prompts.md), §9). Every image carries a **"Concept visual"** label.
- **Companion-app screens** are concept designs in the site palette, labelled as concepts.
- **POC recording:** a real screen recording of the software prototype. Its caption says it shows an earlier device form.
- **Avoid:** stock photos of blind people, pity imagery, and hands grabbing the device from the user.

### 6.6 Motion principles

- **Slow, physical, calm.** Long ease-in-out curves. No shake, no whip pans, no lens flare (carried over from [animations.md §1](animations.md#1-rules-for-every-animation)).
- **Motion explains.** Every move maps to a product idea: twisting shows the sides, exploding shows the parts, dimming shows the fallback.
- **Scroll is the timeline.** Choreography is scrubbed and reversible. Nothing important happens on a timer, except the STOP demo, which has a replay button.
- **One thing moves at a time.** When the baton moves, the text is still, and the other way round.
- **Safety:**
  - Nothing flashes more than 3 times a second (2.3.1).
  - Haptic visuals are swells of at least 300 ms.
  - No parallax on text.
  - No autoplaying sound.
  - Anything that moves for more than 5 seconds gets a pause control (2.2.2).
  - A global **Motion toggle** sits in the header.

| Token | Value | Use |
|---|---|---|
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals, UI |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | 3D transitions, wipes |
| `dur-fast` / `dur-ui` | 150 ms / 300 ms | Hover, buttons |
| `dur-reveal` / `dur-line` | 600 ms / 900 ms | Fade-ups, line-mask reveals |
| `dur-page` | 800 ms | Blue page wipe |
| `swell` | ≥ 300 ms up + ≥ 300 ms down | Haptic and light-ring swells |
| `rig-damping` | critically damped spring, about 0.35 s to settle | Baton follows scroll targets with a soft lag (klimt feel) |

### 6.7 Techniques

| Technique | From | Where | Under reduced motion |
|---|---|---|---|
| Smooth scroll (Lenis) | R5, R6 | Whole site | Off: native scroll |
| **Baton choreography**: spin, glide between rails, twist, explode, x-ray. Scroll-scrubbed, damped | R4 | Every chapter ([04 §4](04_site_structure.md#4-baton-choreography)) | Static posters |
| Background colour tween, white ↔ blue | R4 | Chapter changes | Hard cut |
| Line-mask text reveals (headline lines rise from a mask) | R6 | Chapter titles, statements | Shown at once |
| Count-up numerals | R6 | Stats, timeline | Final values |
| Clip-path image reveals | R6 | Gallery, posters | Shown at once |
| Stroke drawing (SVG `stroke-dashoffset`) | R2, R3 | Line drawings, gestural strokes, timeline line | Drawn |
| DotField | R2 | Hero, blue chapters | Static dots |
| Magnetic buttons (pull of 6 px at most) | R6 | Primary buttons | Off |
| Page transition: blue panel wipe while the baton flies to the next page's pose | R4 | `/` ↔ `/about` | Instant |

### 6.8 Loader

Combines R5's layout with R4's text loader.

- **Layout:** a full blue field with the "L.I.G.H.T" wordmark at centre. Below it, a 160 px hairline bar fills in chartreuse from **real** load progress (fonts, the 3D chunk, the environment), with one quiet line underneath ("finding the light…").
- **On completion:**
  1. The baton's light ring **ignites** (one swell).
  2. The blue field wipes upward into the hero.
- **Limits:**
  - The loader shows for **2.5 s at most.** If 3D isn't ready by then, the page shows with the static poster and swaps in 3D when it arrives.
  - It is skipped on repeat visits in the same session (`sessionStorage`).
  - Under reduced motion it is a 200 ms fade.
- **Accessibility:**
  - The loader is visual only (`aria-hidden`). The content is in the DOM from the start, so screen readers can read it straight away.
  - The loader never traps focus.

### 6.9 Cursor

Recreates the follower cursors on R4 and R6, with one change for accessibility.

- **What it is:** a 28 px ring that follows the native cursor with a soft lag.
  - **It does not hide or replace the system cursor.** Low-vision users often enlarge their OS cursor.
  - Blue on white chapters, chartreuse on blue.
- **Over targets:** it grows to about 64 px and shows a short verb: "drag" (rotating the baton, the gallery), "open", "play", "step".
- Over the DotField, nearby dots swell.
- **Disabled:** on touch devices, under `prefers-reduced-motion`, in `forced-colors` mode, and when the Motion toggle is off.
- **Accessibility:**
  - Its verb labels are decorative duplicates of real labels, so they are `aria-hidden`.
  - It never covers focus outlines (2.4.11).

## 7. Information architecture

**[DECIDED 11-02]** Three pages. Full detail is in [04_site_structure.md](04_site_structure.md).

- **`/`, the hero page.** It holds everything, in 14 chapters:
  1. Hero
  2. What the cane can't reach
  3. Clips onto your cane
  4. Never fails silently
  5. Guide Notes
  6. Route Memory
  7. Feel where it is
  8. STOP
  9. Inside the baton
  10. Concept visuals
  11. Try the prototype
  12. Why it matters
  13. Where we are
  14. Get in touch
- **`/about`.** Purpose and motivation, what we believe, and the founders.
- **`/contact`.** The pop-up. It opens as a dialog over the current page, and as a full page when loaded directly or without JavaScript.
- **Navigation:** a comma-separated index (R6): *Product, Reliability, Inside, Prototype, Timeline, About, Contact*. Next to it sit a chapter counter "(03/14)" and the Motion toggle.

## 8. Key interactions

Each interaction has a keyboard or single-pointer version, a screen-reader equivalent, and a reduced-motion version.

| # | Interaction | Chapter | Pointer | Keyboard / single pointer (2.5.7) | Screen reader | Reduced motion / Static tier |
|---|---|---|---|---|---|---|
| I1 | **Rotate the baton** | 01 | Drag sideways, with inertia. "drag" cursor | "Rotate left" and "Rotate right" buttons | The canvas is hidden. The text describes the product | Poster, no rotation |
| I2 | **Clip-on** | 03 | Scroll scrubs it | Scroll and keys | Three-step text | Three stills |
| I3 | **Fallback ladder** | 04 | Click a level | A tablist of five levels, arrow keys | Each level's panel text | One still per level |
| I4 | **Guide Note playback** | 05 | "Play the note". Plays a short recorded note if one is supplied (§11) | Button | Visible transcript | No animation; transcript |
| I5 | **Route Memory walk** | 06 | Scroll draws the route; "Walk it again" | Button | An ordered list of route events | Final map still |
| I6 | **Place the obstacle** (360° haptics) | 07 | Drag the obstacle around the walker, or click one of 8 positions | Arrow keys move it in 8 directions; +/− change its distance | `aria-live="polite"`: "Pole, ahead left, close: the front-left of the grip vibrates strongly." | Two still states |
| I7 | **STOP** | 08 | Plays once when in view; "Replay" | Button | Three-step text | Three stills |
| I8 | **Exploded view** | 09 | Scroll explodes it; hotspots open details | Hotspots are buttons in assembly order | A list of components with descriptions | Exploded still plus the list |
| I9 | **Concept gallery** | 10 | Drag or scroll sideways | Previous/next buttons; focusable cards | Alt text and captions | Static grid |
| I10 | **DotField** | Global | Dots swell near the pointer | — (decorative) | `aria-hidden` | Static dots |
| I11 | **Contact pop-up** | Global | Opens from any "Get in touch" | Full keyboard; Esc closes; focus is trapped | Dialog semantics | No animation |

**WCAG 2.2 points that need care on this site:**
- **2.5.7 Dragging Movements:** every drag has a single-pointer alternative.
- **2.5.8 Target Size:** at least 24 px, and the site uses at least 44 px.
- **2.4.11 Focus Not Obscured:** the sticky header, frame and cursor never cover the focused element. Use `scroll-padding-top`.
- **2.2.2 Pause, Stop, Hide.**
- **2.3.1 Three Flashes.**
- **1.4.10 Reflow** at 320 px.
- **1.4.11 Non-text Contrast:** UI controls and focus rings at 3 : 1 or more.
- **1.4.12 Text Spacing.**

## 9. Content and assets

| Asset | Status | Source / owner |
|---|---|---|
| 3D baton, procedural, with separate parts and internals | To build in code ([05 §4](05_site_components.md#4-3d-layer)) | Build |
| 3D cane | To build in code | Build |
| Studio lighting | drei `Lightformer`s, so nothing to download. A CC0 Poly Haven studio HDR is optional | Build |
| Hands plate (hero, closing) | To generate. A new prompt is needed in [image-prompts.md](image-prompts.md) | Founder |
| Concept stills (on the cane, in hand, clip macro, grip, lifestyle) | Restage on a light backdrop (follow-up) | Founder |
| Companion-app concept screens (Guide Notes, routes, "What's working?") | To design | Design |
| POC screen recording: 20–30 s, muted, with a text description | To record from `../light-guidance-experience` | Build |
| Guide Note sample audio, about 8 s, with transcript | Optional **[OPEN]** | Founder records |
| Milestones and dates | **To update.** The old pitch timeline dates from Sept 2026 and names partners | Founder |
| Founder photos, titles, year of study | To confirm (AGENTS.md §6) | Founders |
| About-page motivation, in the founders' own words | To write | Founders |
| Market figures | Approved list in [AGENTS.md §6](../AGENTS.md); re-check each source | Build |
| Copy | Working drafts in [04](04_site_structure.md); final after review | Founder + build |

**Follow-ups for the older briefs.** Both assume the dark charcoal look.
- [image-prompts.md](image-prompts.md) needs a light-backdrop variant.
- In [animations.md](animations.md):
  - A1–A3 (hero reveal, clip-on, exploded view) are **replaced by the real-time 3D**.
  - A4–A8 are built in code in the new palette.
  - A9 (lifestyle walk) stays optional.

## 10. Technical approach **[REC]**

### 10.1 Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js** (App Router, TypeScript), current stable | Same family as R4 and R5. Pages are pre-rendered statically. A persistent canvas in the root layout survives page changes, so the baton can fly from `/` to `/about`. Intercepting routes give the contact dialog its own URL. Native on Vercel |
| 3D | **three** + **React Three Fiber** + **drei** | R4's stack. Declarative scene, `Lightformer`s, `ContactShadows`, `PerformanceMonitor` |
| Scroll and animation | **GSAP** with ScrollTrigger and SplitText (all GSAP plugins are now free), plus **Lenis** | R4 and R6 |
| Shared state | **zustand** | HTML controls (stepper, obstacle, gallery) drive the 3D scene without re-rendering React |
| Styling | **Tailwind CSS v4**, with tokens in `@theme` ([05 §2](05_site_components.md#2-design-tokens)) | Same as R5. Tokens in one place |
| Fonts | `next/font/google`, Archivo and Hedvig Letters Serif, self-hosted at build | No runtime requests to third parties |
| Contact | **Next.js Server Action** → **Resend** email API → the founders' inbox | Works without JavaScript (progressive enhancement). Nothing is stored |
| Testing | Playwright, axe-core, Lighthouse CI | Playwright is already used in the POC |

### 10.2 Quality tiers

| Tier | When | What renders |
|---|---|---|
| **Full** | WebGL2, a capable device, motion on | Everything. DPR up to 1.75. Optional soft bloom on the light ring only |
| **Lite** | Mobile, low memory or few cores, or `PerformanceMonitor` drops | DPR 1. No post-processing. A third of the DotField dots. Simpler internals |
| **Static** | No WebGL, `prefers-reduced-motion`, or Motion off | No canvas. One pre-rendered poster (AVIF/WebP) per chapter state. Every interaction still works as HTML |

### 10.3 Budgets (targets)

- **LCP** is HTML text, under **2.5 s** on a mid-range phone over 4G. It never waits for WebGL.
- **JavaScript** before 3D: about 120 KB gzip or less.
- **3D chunk:** about 350 KB gzip or less. It loads after first paint, during idle time.
- **Download:** about 1.5 MB or less before the visitor scrolls, posters included. Videos load lazily.
- **Rendering:**
  - DPR is clamped.
  - Rendering stops when the tab is hidden or the dialog is open, and drops to on-demand frames in still chapters.
  - Interaction to Next Paint stays under 200 ms.
- **CLS** under 0.05.

### 10.4 Contact data handling

- **Fields:** email (required) and message (optional, 2000 characters at most).
- **Spam protection, without a CAPTCHA** (CAPTCHAs are an accessibility barrier):
  - A hidden honeypot field.
  - A time-to-submit check.
  - A platform rate-limit rule, if the Vercel plan offers one.
- **Delivery:**
  - Validated on the server (zod).
  - Sent through Resend to a recipient address kept in a **server-side environment variable**, so it is never in the page.
  - `reply-to` is the visitor's address.
- **Retention:** nothing is stored by the site, no cookies are set, and message content is never logged.
- **[OPEN] Sending domain.** There is no custom domain yet. Resend's test sender can (to be confirmed at setup) only deliver to the account owner's own address. Either create the Resend account on the inbox that should receive messages, or add a domain.
- A privacy line in the pop-up says what happens to the email (wording in [04 §6](04_site_structure.md#6-contact-pop-up)).

### 10.5 Privacy

- No cookies, no third-party embeds, and no tag manager.
- Fonts are self-hosted.
- The motion preference is kept in `localStorage`.
- Analytics: none by default. If approved, only a cookie-free option, so no consent banner is needed.

## 11. Open questions for the founder

Each has a default the build will use unless you decide otherwise.

1. **Milestones** for chapter 13: dates and wording. *Default:* only past milestones with real dates. Future items marked "Next" and "Later", without dates.
2. **Founder photos, titles and year of study.** *Default:* names and roles only.
3. **About-page motivation** in your own words, 1–2 paragraphs. *Default:* a draft built from the concept brief for you to edit.
4. **Hero headline.** *Default:* "Be your light."
5. **PP Neue Montreal licence.** *Default:* no; Archivo throughout.
6. **Hands plate.** *Default:* generate one; if it isn't good enough, launch the hero without it.
7. **Analytics.** *Default:* none.
8. **Email sending setup.** See §10.4. *Default:* create the Resend account on the founders' inbox.
9. **Prototype deployment.** A separate Vercel project for `../light-guidance-experience`, frontend only, with the optional backend narration off. Check how Vercel handles its roughly 93 MB of model files. *Default:* the link stays a placeholder until it is live.
10. **Guide Note sample.** Record one real 8-second note? *Default:* transcript and animation only.
11. **Prototype caption.** The POC shows the earlier handheld design. *Default:* link it, captioned as "built for an earlier version of the device".
12. **Light-ring colour in 3D.** *Default:* it stays soft white (the 11-01 colourway). Chartreuse appears only in the site's diagrams and UI, never on the device itself.

## 12. Decision log

| Date | Decision |
|---|---|
| 10-31 | Audience: investors and anyone curious. Vercel project `beyourlight`. Fresh visual style. Founders may be shown. No partner names. Market figures with sources |
| 11-01 | Device form: the original baton with a cane clip. Neutral colourway (graphite, soft-white light ring) |
| 11-02 | Palette `#FFFFFF` / `#233CCD` / `#DBFE1B`, with chartreuse as the signal colour |
| 11-02 | References R1–R6. Effects recreated in our own code. Free fonts from the references: Archivo, Hedvig Letters Serif |
| 11-02 | Three pages: the hero page (everything), the contact pop-up, About |
| 11-02 | Rich interactive WebGL, as progressive enhancement. The baton is the centrepiece throughout |
| 11-02 | The 3D baton is **built in code** (procedural parts), and can be swapped for a GLB later |
| 11-02 | The baton **floats free**, then **clips onto a cane** in chapter 03. Standalone use is never mentioned |
| 11-02 | Contact: **email + optional message → founders' inbox**. Nothing stored. Forms approved for this use only |
| 11-02 | The "Try the software prototype" link goes to the POC app, which needs its own deployment |
| 11-02 | Founder approved docs 03–05. Site v0.1 built to them; open questions in §11 use their defaults until answered |
