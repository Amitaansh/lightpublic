# L.I.G.H.T — Product Animation Briefs and Prompts

> **Status:** v0.1 · **Last updated:** 2026-11-01
> Purpose: high-quality product animations for the `light-public` website, in the style of an Apple product page.
> The product is the **L.I.G.H.T baton clipped onto a white cane**, as described in [image-prompts.md](image-prompts.md) §1. Approve the still renders there first: every animation starts from them.
> Each animation has a **brief** (for you or a motion designer) and, where AI video suits it, a **prompt** to paste into an image-to-video model (Veo, Sora, Runway, Kling, Luma or similar).

## 0. How to produce these

Each animation is tagged with the route that suits it best:

| Route | Good for | Why |
|---|---|---|
| **AI video** (image-to-video) | Slow camera moves around a finished render; lifestyle shots | Fast and photoreal, but can't keep a part count or precise mechanics consistent |
| **3D** (Blender, Cinema 4D, KeyShot) | Exploded views, the clip mechanism, see-through views, anything scroll-driven | Exact geometry, frame-accurate control, renders as an image sequence for scroll scrubbing |
| **Motion graphics in code** (SVG/CSS/Canvas, or Lottie/Rive) | Diagrams: haptic ring, fallback ladder, Route Memory, Guide Notes | Tiny files, sharp at any size, real HTML text that screen readers can read, easy reduced-motion versions |

**Recommendation:** use AI video for A1 and A9, 3D for A2 and A3 (AI video only as a draft), and motion graphics in code for A4–A8. The 3D route needs a proper model of the baton and clip. That model is also worth having for the hardware work, so consider building it once from the approved renders.

## 1. Rules for every animation

**Accessibility (WCAG 2.2 AA; the site's audience includes blind people):**
- **No flashing.** Nothing flashes more than 3 times a second (WCAG 2.3.1). Show haptic pulses as soft swells, not strobes.
- **Pause control.** Anything that moves for more than 5 seconds has a visible, keyboard-reachable pause button (WCAG 2.2.2).
- **Reduced motion.** With `prefers-reduced-motion`, show a still poster frame or a simple crossfade, never the motion.
- **No sound on autoplay.** Videos are muted. If a version has narration, it gets captions and a transcript.
- **Text goes in HTML, not in the video.** Headlines, labels and ladder levels go on the page over or beside the animation, so screen readers, translation and zoom all work. The video itself has no text.
- **Every animation has a text alternative** that says what it shows (written with the copy, not in the video).

**Look:**
- Same set as the stills: seamless warm light grey (around `#E8E6E2`), soft studio light, graphite device, soft-white light ring. No cyan, amber, neon or glow.
- Motion is **slow, smooth and physical**: long ease-in-out curves, no camera shake, no whip pans, no speed ramps, no lens flares. Think of a quiet product reveal, not a trailer.
- Diagram colours follow the palette chosen in the design brief ([03_design_brief.md](03_design_brief.md) §6). Until then, use graphite lines on warm grey, with soft white for "active".

**Delivery:**
- Master at 4K (3840 × 2160 or the matching aspect), 24 or 30 fps, ProRes or PNG sequence.
- Web exports: AV1/WebM and H.264/MP4, about 2–4 MB per loop for heroes and under 1 MB for small loops. Supply a poster frame (AVIF/WebP) for each.
- Scroll-driven pieces: a numbered image sequence (WebP/AVIF, about 120–180 frames) or a short all-keyframe MP4.
- Loops must loop seamlessly: the last frame matches the first.

**Content rules (from the PRD):** caption as concept visuals; never show the device replacing the cane; showing the baton off the cane (A2 start, dock shots) touches standalone use, which is still [OPEN], so check with the founder before publishing.

## 2. Animations

### A1 — Hero reveal

| | |
|---|---|
| **Where** | Home page hero, behind or beside the headline |
| **Length** | 6–8 s, seamless loop |
| **Route** | AI video from render 01, or 3D |
| **Start / end frame** | Render 01 (hero) |

**Brief.** The page opens on the hero still, which then comes to life very gently. The camera drifts slowly about 15° around the baton and back, while the light glides along the graphite aluminium, picks up the bead-blast texture, and catches the clip and the sensor windows. The soft-white light ring breathes once: a slow swell and fade over about 2 s. Nothing else moves; the cane stays still. The overall feeling: calm, precise, expensive.

**AI video prompt** (image-to-video, attach render 01 as the first frame; also as the last frame if the model supports it):

```text
Slow, elegant product reveal in the style of an Apple launch film. The camera drifts smoothly about 15 degrees around the graphite-grey aluminium baton clipped onto the white mobility cane, then eases back to the starting angle. A soft studio light sweeps slowly along the bead-blasted aluminium, revealing its texture, the quick-release clip and the ring of dark-glass sensor windows. The thin soft-white light ring around the baton swells gently once and fades. The device and cane keep their exact shape; nothing deforms, nothing else moves. Seamless warm light-grey studio backdrop, soft shadows, photorealistic, 4K, smooth ease-in-out motion, no camera shake, no text.
```

**Reduced motion:** render 01 as a still.

### A2 — Clips on in seconds

| | |
|---|---|
| **Where** | "Works with the cane you already trust" section |
| **Length** | 5–6 s, plays once when scrolled into view, then holds the last frame |
| **Route** | 3D (recommended). AI video with first and last frames for a draft |
| **Start / end frame** | Baton floating just above the cane / render 01 |

**Brief.** This shows that the device adds to the user's own cane, without tools, in seconds.

| Time | What happens |
|---|---|
| 0.0–1.0 s | A white cane lies diagonally across the frame, as in render 01, with no device on it. The baton floats just above it, parallel, clip open. |
| 1.0–2.5 s | The baton lowers smoothly onto the shaft. The cane's own grip slides into the channel under the baton grip. |
| 2.5–3.0 s | The clip jaw closes around the shaft with a small, crisp, physical snap: a tiny settle of about 1 mm, no bounce. |
| 3.0–4.0 s | The light ring swells once in soft white, confirming it's attached. (On the real device this is a sound and a haptic pattern. Say so in the page copy.) |
| 4.0–6.0 s | The camera eases in slightly and holds on render 01's composition. |

**3D notes:** model the clip with a real hinge or spring path; the jaw's elastomer lining compresses slightly at closing. The cane must never flex.

**AI video prompt** (draft only; attach the "baton above the cane" still as the first frame and render 01 as the last):

```text
Clean product animation, Apple style. A slim graphite-grey aluminium baton floats just above a white mobility cane lying diagonally in a warm light-grey studio. The baton lowers smoothly and precisely onto the cane, parallel to the shaft, sensor head toward the cane tip; its quick-release clip closes around the white shaft with a small, crisp settle; the cane's black rubber grip slides into place beneath the baton's grip. The thin light ring on the baton glows soft white once to confirm. The camera eases in slightly and holds. Exact shapes, no deformation, smooth physical motion, soft shadows, photorealistic, 4K, no text.
```

**Reduced motion:** render 01, with the copy describing the clip-on.

### A3 — Exploded view, scroll-driven

| | |
|---|---|
| **Where** | "How it works" section. The visitor's scrolling drives the animation |
| **Length** | About 150 frames, scrubbed by scroll |
| **Route** | 3D only |
| **End frame** | Render 05 (exploded view) |

**Brief.** Scrolling separates the baton into its parts and then reassembles it. HTML labels appear beside the parts as each group is reached.

| Scroll | What happens | Label in HTML beside it |
|---|---|---|
| 0–15 % | The assembled baton clipped to the cane, three-quarter view. The cane fades away to a short shaft section | — |
| 15–45 % | Parts slide apart along the axis in assembly order (see render 05). The clip drops straight down | — |
| 45–60 % | Hold on the sensor-head group: ToF ring, ultrasonic sensors, camera | "Sees ahead and overhead, day and night" |
| 60–70 % | Hold on the main board and the separate safety-core board, with the safety core slightly highlighted (brighter, not glowing) | "A second, independent safety system" |
| 70–80 % | Hold on the haptic ring inside the grip | "Feel where obstacles are" |
| 80–100 % | Parts reassemble; the clip snaps back on; return to the assembled view | — |

**3D notes:** a smooth orthographic or long-lens camera, a fixed light rig, the same backdrop as the stills. Parts move on straight lines with ease-in-out, staggered by about 3 frames. Ask for the PNG sequence plus a 1080p preview video.

**Reduced motion:** render 05 as a still, with the labels as a list.

### A4 — 360° haptics: feel where it is

| | |
|---|---|
| **Where** | The haptic feedback section |
| **Length** | 8–10 s loop |
| **Route** | Motion graphics in code over a still of render 06; or 3D |

**Brief.** This explains "where it vibrates = where the obstacle is; how strongly = how close".

- **Left half:** a calm top-down diagram of the user walking (a simple figure or a dot with a heading arrow). Obstacles appear as soft shapes around it: first a pole ahead-left, then a person approaching from the right.
- **Right half:** an end-on view of the grip with its ring of eight actuators. The actuator pointing toward each obstacle swells in soft white, larger and brighter as the obstacle gets closer, then fades as it passes.
- With two obstacles at once, both actuators are active; the nearer one is stronger.
- The pulses are slow swells (≥ 300 ms each), never strobes.

HTML caption alongside, for example: "Pole, ahead left: the left-front of the grip vibrates, stronger as you get closer."

**Reduced motion:** two still states (one obstacle, then two), shown side by side.

### A5 — STOP: when something comes fast

| | |
|---|---|
| **Where** | The threat-alert section |
| **Length** | 6 s, plays once in view, can be replayed with a button |
| **Route** | Motion graphics in code (recommended); 3D optional |

**Brief.** Shows the one alert that interrupts everything.

| Time | What happens |
|---|---|
| 0–2 s | Top-down diagram: the user walking calmly, with a few quiet haptic cues as in A4 |
| 2–3 s | A cyclist shape approaches fast from the side |
| 3–4.5 s | All the other cues stop. The **whole** grip ring swells together in one strong, slow pulse (a single swell, not a flash). The word **STOP** appears **in HTML** beside the device, standing for the earbud's spoken "STOP" |
| 4.5–6 s | The user stops; the cyclist passes; the calm cues return |

**Rules:** no red flashing, no shake, no alarm visuals. Make it urgent through stillness and contrast. If the design brief adds a warning colour, use it here only, as a steady fill.

**Reduced motion:** a three-step still sequence with captions.

### A6 — Never fails silently: the fallback ladder

| | |
|---|---|
| **Where** | The reliability section (a headline feature, PRD §8) |
| **Length** | 12–15 s, stepped by the visitor (buttons or scroll), not autoplay |
| **Route** | Motion graphics in code, with a still of render 07 (safety-core see-through) |

**Brief.** Makes the fallback ladder easy to understand. There are five steps. At each step the device view dims the parts that stopped and keeps what still works fully visible. A short HTML line says what the user notices.

| Step | Device view | HTML line (draft) |
|---|---|---|
| **Full** | Everything lit | "Everything on: sensing, identification, memory, guidance." |
| **Reduced** | Identification and navigation dim | "Battery or heat limits: smart extras pause first." |
| **Memory and distance** | Cameras dim; distance sensors and Route Memory stay on | "Cameras out: distance sensing and remembered obstacles keep working." |
| **Safety core** | Everything dims except the safety-core board, its sensors and the haptic ring | "Main system down: an independent safety system still warns of obstacles." |
| **Cane** | The whole device dims; the cane stays bright | "And your cane still works, as it always has." |

Every step down comes with a visible "announced" cue: a single soft swell of the light ring, standing for the haptic and spoken notice. The ladder must read as **calm and designed**, not as a failure.

**Reduced motion:** the five steps as a static vertical list, each with a small still.

### A7 — Route Memory

| | |
|---|---|
| **Where** | The Route Memory section |
| **Length** | 10–12 s loop |
| **Route** | Motion graphics in code |

**Brief.**
1. A simple, abstract street map in graphite lines. A path draws itself from "Home" to a destination as the user walks it.
2. Fixed obstacles along the way (a pole, a step, a low branch) drop in as small markers and stay: *remembered*.
3. A second walk along the same path: as the walker gets near each marker, a soft early cue (a double swell, PRD's "from memory" pattern) plays a little before the obstacle.
4. A temporary obstacle (a parked bike) appears and is *not* kept as a marker after it passes.
5. End on the saved route, with a small "works offline" indicator in HTML.

Labels such as "Learns your usual routes" and "Remembers fixed obstacles" go in HTML.

**Reduced motion:** the final map state as a still.

### A8 — Guide Notes

| | |
|---|---|
| **Where** | The Guide Notes section |
| **Length** | 10 s loop |
| **Route** | Motion graphics in code; optional AI-video lifestyle plate behind it |

**Brief.**
1. **Recording:** two people walk side by side (simple figures or a lifestyle plate). The sighted companion speaks: a soft waveform rises and settles into a note pinned at that spot on the path ("Door is the second one after the bench").
2. **Later, alone:** the user reaches the same spot. The pin opens and the waveform plays back, travelling to a single earbud.
3. The note's text appears **in HTML** as a caption, not inside the animation.

**Reduced motion:** two stills, "Recorded here" and "Played back here".

### A9 — Lifestyle walk (optional)

| | |
|---|---|
| **Where** | A section break or the closing section |
| **Length** | 6–8 s loop |
| **Route** | AI video from render 08 |

**AI video prompt** (attach render 08 as the first frame):

```text
Cinematic, premium, Apple-campaign style. A blind person walks calmly and confidently along a quiet tree-lined European street at golden hour, sweeping a long white mobility cane with a slim graphite-grey device clipped on top near the grip. The camera tracks slowly alongside at walking pace, steady and smooth. Natural motion, soft backlight, warm shopfront lights, gentle film grain. The person, cane and device keep their exact appearance; dignified, independent, unhurried. Photorealistic, 4K, no text, no logos.
```

**Reduced motion:** render 08 as a still.

## 3. Tips for AI video

- **Always start from an approved still** (image-to-video). Text-to-video will invent a new device.
- **Use first and last frames** where the model supports them (A1, A2). This stops the device drifting out of shape.
- **One shot, one move.** Ask for a single continuous camera move per clip. Build longer pieces from several clips in an editor.
- **Generate several takes** and check every frame: the clip shape, the number of buttons, the cane's red band and tip, and hands. Reject any take where the device warps.
- **Upscale and grade together.** Run the chosen clips through the same upscaler and colour grade so they match the stills.

## 4. Order of work

1. Approve renders 00 and 01 ([image-prompts.md](image-prompts.md)).
2. A1 (hero) as AI video, to set the motion feel.
3. Decide whether to commission a 3D model of the baton and clip, for A2 and A3.
4. A4–A8 are built with the site, in code, once the design direction and palette are chosen.
