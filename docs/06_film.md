# L.I.G.H.T — Site v0.2 "Night": the film

> **Status:** v0.2 · built 2026-11-02 · **Last updated:** 2026-11-02
> Supersedes the look and page structure of [03_design_brief.md](03_design_brief.md), [04_site_structure.md](04_site_structure.md) and [05_site_components.md](05_site_components.md) wherever they differ. Their accessibility, privacy and public-content rules still apply ([AGENTS.md §5](../AGENTS.md)).

## 1. What changed, and why

The founder reviewed v0.1 (blue/white chapters with copy) and asked for:

- **A dark, cinematic site.** Charcoal like the concept render, white text, cyan accents.
- **No copy.** Animations show how the baton works.
- **More depth** in the render: lighting, texture and shadows.
- **A hand** that picks the baton up and shows how to hold it.
- **Clicking the baton** switches the room lights.
- **Exactly two fonts.**
- **Smoothness** like the APRU portfolio site.

### Founder decisions, 11-02

| Topic | Decision |
|---|---|
| Palette | Charcoal `#151515` (sampled from `assets/device/…png`: #131313 at the corners to #222 in the light), white `#F2F2EF`, cyan `#2EE6FF` |
| Fonts | Hedvig Letters Serif (display, via `next/font/google`) and Switzer (everything else; variable, self-hosted from Fontshare; the founder holds the licence). Nothing else |
| Copy | **No visible text** during the film. Each scene is described for screen readers only |
| Hand | A rigged 3D hand, posed in code |
| Cane | The baton is picked up alone, then guided onto a cane |
| Lights | Clicking the baton = lights out: studio lights fade and the ring becomes the only light |
| Light ring | **Glows cyan** (changes the 11-01 colourway) |
| Playback | Scroll is the timeline (scrubbed, reversible) |
| Other content | Film + contact only. Timeline, market figures and prototype link removed; About keeps purpose and founders |

### Defaults the build chose (founder may change)

- **Hand:** matte light-clay finish, not a specific skin tone.
- **No sound.**
- **Exploded view:** detailed internals with no labels. It ends with the fallback ladder shown as systems powering down.
- **Title cards:** "L.I.G.H.T" at the start and "Be your light." with two buttons at the end are the only words on screen apart from the header.

## 2. The film

Ten scenes. Scroll length is in hundredths of a viewport (`content/film.ts`); the film runs about 26 screens.

| # | Scene | Length | What you see |
|---|---|---|---|
| 1 | Title | 140 | The baton floats in the dark, ring glowing, dust in the light. "L.I.G.H.T" in Hedvig fades out. Slow push-in |
| 2 | The baton, up close | 260 | Macro passes with focus pulls: the dimpled grip, the buttons and ring, the sensor head and lens |
| 3 | Pick it up | 240 | The baton turns to point forward; a hand reaches in from behind and closes around the grip |
| 4 | How to hold it | 200 | The camera circles the hand: fingers around the grip, the thumb on the buttons (which glow), sensor head ahead |
| 5 | Clips onto your cane | 260 | A cane slides in under the baton; the clip jaw opens and snaps shut; the ring pulses; the camera pulls back to show the whole cane |
| 6 | Feel where it is | 380 | Over the shoulder into the dark. A pole (ahead left), a branch (head height) and a person (right) approach as cyan line sketches. A beam of dots runs from the sensor head to each, and the cyan halo around the grip lights on that side, with ripples, stronger as they near. The baton trembles slightly |
| 7 | Remembers your routes | 260 | A dark floor and grid appear; a remembered route draws itself ahead; remembered obstacles are pillars that give a double pulse as you near them; a Guide Note pin's waveform plays as you pass |
| 8 | STOP | 180 | A streak of light crosses fast; every segment of the halo lights at once; one shockwave; the ring flares; calm returns |
| 9 | Inside the baton | 440 | The hand lets go and the cane falls away; the baton turns side-on and separates into its parts. The camera dollies along them with focus pulls. Then the systems power down group by group (the fallback ladder) while the safety core stays lit; it reassembles |
| 10 | Be your light | 220 | Lights out: the ring is the only light, cyan dust drifts. "Be your light." · Get in touch · About |

**WCAG 2.3.1 (three flashes).** Swells and pulses are slow; the STOP moment is a single shockwave, not a flash.

## 3. How it's built

| Piece | Where |
|---|---|
| Scenes, lengths, screen-reader text | `content/film.ts` |
| The film as a pure function of scroll position, `frameAt(T)` | `three/film/shots.ts` |
| The per-frame director: camera, baton pose, explode, fallback power-down, ring, cane and clip, hand, motor strengths, click-to-toggle-lights | `three/film/Director.tsx` |
| Obstacles, motor maths, route data | `three/film/world.ts` |
| Studio: key spotlight with soft shadows, rim, under-fill, light panels for reflections, contact shadow, fog; fades for lights out | `three/Stage.tsx` |
| Depth of field (focus follows the shot), bloom, vignette, grain, AgX tone mapping; Lite tier drops depth of field, grain and shadows | `three/Effects.tsx` |
| Haptic halo, obstacles and beams, route, STOP streak and shockwave, dust | `three/scenes/*` |
| Baton: lathe-built shells; procedural bead-blast and dimple textures; detailed internals with circuit boards whose traces glow while powered | `three/baton/*` |
| Hand: forward kinematics on the WebXR generic hand (all joints are siblings, so fingers are curled by rotating each chain) | `three/hand/handRig.ts`, `public/models/` (MIT, see `LICENSE-hand.md`) |
| The scroll track, title cards, progress line; static-tier stills | `components/film/Film.tsx` |

- **Smoothness:** Lenis (`lerp 0.09`), plus a second damping of the film position in the director. One ease everywhere: `cubic-bezier(.17,.84,.44,1)`. Long transitions on transform and opacity only.
- **Debugging:** `/?t=0.42` jumps to 42 % of the film. With `POSTER_MODE=1`, `/poster?t=<units>` renders one frozen frame.
- **Stills:** `npm run build && npm run posters` writes `public/posters/<scene>.webp`. These are used for motion off, reduced motion, no WebGL and no JavaScript.

## 4. Accessibility

- **Screen readers:**
  - The home page has one `h1` and one `h2` per scene, each with a full description.
  - The canvas is `aria-hidden`.
  - The closing buttons stay focusable at all times. Focusing one jumps the film to the end so they are visible.
- **Keyboard:**
  - Lights out has a header button (`aria-pressed`), as well as clicking the baton.
  - Motion has a header switch. Motion off, or `prefers-reduced-motion`, shows the scene stills instead of the 3D film.
- **Contrast:** white on charcoal and cyan on charcoal both exceed 7:1, and the secondary text (`#A3A6AD`) is above 7:1.
- **Tests:** `tests/*.spec.ts` (axe WCAG 2.2 AA, film structure, lights, keyboard, motion, no-JS, contact, mobile).

## 5. Open

- **Fonts:** Switzer is self-hosted from Fontshare, and the founder confirmed the licence.
- **The hand** is low-poly (about 1,400 vertices). A higher-detail rigged hand could replace it with the same joint names.
- **Sound** (haptic hum, the spoken "STOP") is not in v0.2.
- **About page:** the "Why we started" text is still a draft.
- **Renders and animation briefs** ([image-prompts.md](image-prompts.md), [animations.md](animations.md)) still describe a white ring. Update them to the cyan ring before generating new renders.
