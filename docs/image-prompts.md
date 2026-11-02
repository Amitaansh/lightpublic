# L.I.G.H.T — Image-Generation Prompts (concept renders)

> **Status:** v0.3 · **Last updated:** 2026-11-01
> Purpose: concept renders of L.I.G.H.T **clipped onto a white cane**, for the `light-public` website.
> **Device [DECIDED 11-01]:** the **original L.I.G.H.T baton**, with its form kept mostly the same. It gets a **more ergonomic grip** and a **mechanical clip on the baton body** that attaches it to a white cane. The hand holds the **baton grip**.
> **Colourway [DECIDED 11-01]:** a neutral refresh. Graphite grey replaces matte black; soft white replaces the cyan ring and the amber light.
> **v0.3 change [DECIDED 11-01]:** the **photographic look matches the existing renders**: low-key studio, dark charcoal paper backdrop, one large soft key light falling off into shadow, crisp rim light. The light-grey look of v0.2 is dropped. The cane's proportions and tip are now spelled out, because models kept drawing it short, thick and cartoonish.
> Every prompt below stands on its own. Paste one whole code block into the image model; don't combine them.
> Animation briefs are in [animations.md](animations.md).

## 0. Before you generate

### Attach two references to every generation

1. **Form reference:** what the device looks like. Use `light-v2-exterior.webp` at first, then your approved result of 00.
2. **Look reference:** the lighting, backdrop and mood. Use one of the existing renders:
   - Studio product shots: `light-v2-exterior.webp`
   - Hand shots: `light-v2-in-hand.webp`
   - Exploded views: `light-exploded.webp`
   - Dock: `light-v2-docked.webp`

All are in `../light-guidance-experience/public/assets/device/`. Tell the model which reference is for form and which is for lighting; the prompts below already say so.

If your model can edit an image (Gemini, ChatGPT/GPT image, Firefly, Flux Kontext and others), **start with prompt 00**. Then use the approved result of 00 as the form reference for the rest.

### Proportions that must be right

Models get these wrong unless they are told plainly. Every prompt states them.

| Thing | Real size | How it should read in the image |
|---|---|---|
| Baton | About 20 cm long, 38 mm in diameter | The main object |
| Cane shaft | 12 mm in diameter | **About one third of the baton's thickness:** a slim rod, like a thick pencil. Never as thick as the baton |
| Cane length | About 120 cm | **About six baton-lengths.** In close-ups the cane always runs **out of frame at both ends** |
| Cane tip | A slim nylon pencil tip, barely wider than the shaft | **Only in full-length shots.** Never in close-ups, never a large ball |
| Red band | A reflective band about 10–15 cm long, just above the tip | **Only in full-length shots**, at the far end, a long way from the device |
| Where the baton sits | At the **top** of the cane, by the cane's grip | The tip is **about 1 m away**, never near the device |

### Design details to confirm

| Detail | Value used in these prompts | Tag |
|---|---|---|
| Baton form | As the original: a 20 cm × 38 mm cylinder with a sensor head (a ring of rectangular windows), a light ring, two pill buttons, a textured grip and an end cap | [DECIDED 11-01] |
| Ergonomic grip | The rear half becomes a contoured soft-touch grip: a slight hourglass waist, a slightly oval cross-section, a fine dimple texture and a soft flare at the end | [ASSUMPTION] |
| Clip | A **low-profile** sprung C-jaw on the underside of the body, just ahead of the grip, in matching aluminium with a black elastomer lining. It should read as part of the body, not a bracket | [ASSUMPTION] |
| How it sits on the cane | Baton on top of the cane, parallel to it, sensor head toward the tip. The cane's grip nests under the baton grip; its rubber end and wrist loop stick out a few centimetres behind the end cap | [ASSUMPTION] |
| Cane tip | A slim pencil tip, not a roller ball (a large smooth ball reads as a cartoon) | [ASSUMPTION] |
| Buttons | Two pill buttons, as in the original. Final count [OPEN] (TRD-HW-012) | [OPEN] |
| Text and logos on the device | None in the render. Add a wordmark in post if needed | [REC] |

### Rules for the site

These come from the PRD; they are not instructions for the image model.
- Caption every render as a **concept visual**.
- Never show or imply that the device **replaces** the cane.
- Showing the baton **off** the cane (00's source image, the dock, the clip-on animation) hints at standalone use. Whether the site mentions standalone use is still **[OPEN]**: ask the founder before publishing those images.

## 1. Design DNA (already inside every prompt)

This block describes the product and the look. It is already pasted into each prompt below. If you change a detail in §0, change it here and in each prompt.

```text
DEVICE: L.I.G.H.T, a concept assistive device for blind and visually impaired people: one slim cylindrical baton, about 20 cm long and 38 mm in diameter, that clips onto a white mobility cane. One single cylinder: no separate box, no sleeve, no screen. Bead-blasted anodised aluminium in graphite grey, soft radiused ends. Front quarter: a sensor head with a ring of small rectangular dark-glass windows evenly spaced around the circumference and one small round lens. A thin soft-white light ring separates the head from the body. Middle: two flush pill-shaped tactile buttons in a row on top, each with a small raised dot pattern. Rear half: an ergonomic grip in darker graphite soft-touch elastomer with a fine dimpled texture, a subtle hourglass waist and a soft flare, ending in a flat end cap with a tiny soft-white light slit.
CLIP: a low-profile sprung C-shaped jaw on the underside of the body, just ahead of the grip, in matching graphite aluminium with a black elastomer lining, hugging the cane shaft. It looks machined as part of the body, not like a separate bracket.
ON THE CANE: the baton lies on top of the cane, parallel to the shaft, sensor head toward the cane tip, at the top end of the cane by its grip. The cane's slim black rubber grip nests under the baton grip; its rubber end and black elastic wrist loop stick out a few centimetres behind the baton's end cap.
CANE PROPORTIONS: a real long white cane, about 120 cm, six times the baton's length. The shaft is slim, 12 mm, about one third of the baton's diameter, like a thick pencil next to it. Matte white with a faint satin sheen. Near the far bottom end only: a 10–15 cm reflective red band and a slim nylon pencil tip barely wider than the shaft.
LOOK: low-key studio product photography matching the reference renders: a seamless charcoal paper backdrop (deep grey around #1A1A1A with subtle paper texture, never pure black); one large overhead softbox feathered so the light pools on the product and falls off into darkness toward the edges; a thin strip light giving a crisp rim along the far edges; deep, soft, natural shadows; gentle vignette; rich blacks with full shadow detail; true-to-life colour; medium-format commercial photography, tack sharp, 8K detail.
```

## 2. Negative prompt (shared)

Use this with every prompt if your model takes a separate negative prompt. Otherwise append it as "Avoid: …". Some models (Gemini included) pay more attention to the positive description than to a long "avoid" list. The key constraints are therefore also written positively in every prompt.

```text
thick cane, short cane, stubby cane, cane as thick as the device, large ball tip, white sphere tip, cartoon sphere, cane tip near the device, red band near the device, flat even lighting, overcast lighting, beige background, light grey background, white background, bright high-key look, separate sensor box, rectangular camera housing, bulky bracket, grip sleeve, screen, display, text, letters, logos, watermark, labels, cyan or blue light, amber or orange light, neon, RGB lighting, sci-fi, gamer aesthetic, plastic toy look, glossy plastic, visible screws, lens flare, oversaturated colour, cartoon, illustration, CGI plastic sheen, warped geometry, extra buttons, duplicated parts, bent cane, deformed hands, extra fingers
```

## 3. Start here

### 00 — Edit the original render (image-editing models)

**Attach:** `light-v2-exterior.webp`. **Aspect:** 3:2 (the original's). Keeping its framing and lighting is the surest way to keep the look.

```text
Edit the attached product photo. Keep everything about the photograph exactly as it is: the dark charcoal paper backdrop, the low-key overhead soft lighting, the shadows, the camera angle and the baton's position in the frame. Keep the baton's shape, proportions and layout exactly: the same slim cylinder, the same sensor head with its ring of rectangular windows and small round lens, the same light-ring position, the same two pill-shaped braille buttons, the same end cap. Make only these changes:

1. COLOUR: the body becomes bead-blasted anodised aluminium in graphite grey, a few shades lighter than the background so it still reads clearly. The thin light ring glows soft white instead of cyan. The end-cap light slit glows soft white instead of amber.
2. GRIP: the textured rear half becomes a more ergonomic grip: darker graphite soft-touch elastomer with a fine dimpled texture, a subtle hourglass waist and a soft flare toward the end cap. Same overall length.
3. CLIP: add a low-profile sprung C-shaped clip on the underside of the body, just ahead of the grip, in matching graphite aluminium with a black elastomer lining. It looks machined as part of the body, not a bracket.
4. CANE: add a white mobility cane running diagonally across the whole frame, parallel to the baton and directly beneath it, entering and leaving the frame at both edges. The baton is clipped on top of it, sensor head pointing the way the cane runs out toward the lower left. The cane shaft is slim, about one third of the baton's thickness, like a thick pencil, matte white with a faint satin sheen. Behind the baton's end cap, a few centimetres of the cane's black rubber grip end and a black elastic wrist loop are visible. No cane tip and no red band in this frame: the cane continues far out of frame.

Photorealistic, same studio lighting as the original. No text, no logos.
```

## 4. Core renders

### 01 — Hero: clipped onto the cane

**Use:** home page hero. **Aspect:** 16:9 (desktop) and 4:5 (mobile crop). **Attach:** the approved 00 result (form) and `light-v2-exterior.webp` (look).

```text
Ultra-realistic low-key studio product photograph, premium launch-film quality: L.I.G.H.T, a concept assistive device, clipped onto a white mobility cane. Match the device's form to the first reference image and the lighting and mood to the second.

DEVICE: one slim cylindrical baton, about 20 cm long and 38 mm in diameter, in bead-blasted graphite-grey anodised aluminium. Its front quarter is a sensor head with a ring of small rectangular dark-glass windows around the circumference and one small round lens; a thin soft-white light ring separates head from body; two flush pill-shaped tactile buttons sit on top of the body; the rear half is an ergonomic grip in darker graphite soft-touch elastomer with a fine dimple texture, a subtle hourglass waist and a soft flare, ending in a flat end cap with a tiny soft-white light slit. A low-profile graphite C-shaped clip on the underside, just ahead of the grip, hugs the cane shaft and looks machined as part of the body.

CANE: a real white mobility cane, directly beneath the baton and parallel to it. Its shaft is slim, about one third of the baton's thickness, like a thick pencil next to it, matte white with a faint satin sheen. The cane runs out of the frame at both ends; behind the baton's end cap, a few centimetres of the cane's black rubber grip end and a black elastic wrist loop are visible. The cane's tip and red band are far out of frame and not visible.

COMPOSITION: seen from above at about 45 degrees, the baton and cane lie diagonally across the frame from lower left to upper right, the baton in the centre-left, the sensor head toward the lower left. Plenty of dark negative space on the right for headline text.

LIGHTING AND SET: a seamless charcoal paper backdrop with a subtle paper texture, deep grey, never pure black; one large overhead softbox pooling light on the device and falling off into darkness toward the edges; a thin strip light giving a crisp rim along the far edge of the aluminium; a deep, soft natural shadow beneath; a gentle vignette. Rich blacks with full shadow detail.

CAMERA: medium-format camera, 120 mm macro lens, f/11, tack sharp, true-to-life colour, high-end commercial product photography, 8K detail.

No text, no logos, no labels.
```

### 02 — Full length: the whole cane

**Use:** the "Works with the cane you already trust" section, to show how small the device is next to the cane. **Aspect:** 21:9 (wide band) or 9:16. **Attach:** the approved 00 or 01 result (form) and `light-v2-exterior.webp` (look).

```text
Ultra-realistic low-key studio product photograph, premium launch-film quality. A complete long white mobility cane, about 120 cm, lying on a large seamless charcoal paper surface, seen from above at a slight angle, shown in full from end to end, with the L.I.G.H.T concept baton clipped on at its top end. Match the device's form to the first reference image and the lighting to the second.

SCALE: the baton is about 20 cm long, one sixth of the cane's length; it sits at the top end of the cane, by the cane's grip. The cane's shaft is slim, about one third of the baton's thickness. At the opposite, far end of the cane, about one metre from the device: a 10–15 cm reflective red band and then a slim black nylon pencil tip, barely wider than the shaft, slightly scuffed from use. No ball tip.

DEVICE: a slim graphite-grey bead-blasted aluminium baton with a sensor head (a ring of small rectangular dark-glass windows, a thin soft-white light ring) pointing along the cane toward the tip; its rear half is a darker graphite soft-touch ergonomic grip; a low-profile graphite clip on its underside hugs the shaft; behind its end cap, the cane's black rubber grip end and elastic wrist loop stick out a few centimetres.

COMPOSITION: the cane lies in a long, shallow diagonal across the whole width of the frame, with even margins at both ends. The device sits at the left, the tip at the right. The device reads as small and integrated; the cane is clearly the main tool.

LIGHTING AND SET: one long overhead strip softbox along the length of the cane, pooling light on it and falling off into darkness at the top and bottom of the frame; a subtle rim along the shaft; a soft natural shadow; gentle vignette; rich blacks with full shadow detail.

CAMERA: medium-format camera, 80 mm lens, f/16, everything sharp, true-to-life colour. Photorealistic high-end commercial product photography.

No text, no logos, no labels.
```

### 03 — The clip (macro)

**Use:** the "Clips on without tools" message. **Aspect:** 3:2 or 1:1. **Attach:** the approved 00 or 01 result (form) and `light-v2-exterior.webp` (look).

```text
Ultra-realistic low-key macro product photograph, premium launch-film quality, of the clip that attaches the L.I.G.H.T concept baton to a white mobility cane. Match the device's form to the first reference image and the lighting to the second.

SUBJECT: a close-up of the underside of a slim cylindrical baton, 38 mm in diameter, in bead-blasted graphite-grey anodised aluminium. A low-profile sprung C-shaped clip in matching aluminium, machined as part of the body and lined with black elastomer, hugs the slim matte white cane shaft beneath it; the shaft is about one third of the baton's thickness. A small flush release lever on the side of the clip. Behind the clip, the start of the darker graphite soft-touch grip with its fine dimple texture. The cane shaft runs out of frame at both sides.

COMPOSITION: a tight three-quarter macro from slightly below and to the side; the clip jaw and lever in the sharpest focus, a gentle focus falloff along the baton and the shaft.

LIGHTING AND SET: a seamless charcoal backdrop falling into darkness; one large soft key light from above; a thin specular highlight running along the aluminium chamfers; the bead-blast texture and the elastomer grain clearly visible; deep, soft shadows. Precise, engineered, premium.

CAMERA: 100 mm macro lens, f/8, focus stacked, true-to-life colour. Photorealistic high-end commercial photography.

No text, no logos, no labels.
```

### 04 — In hand (studio)

**Use:** human scale, and the grip as the place where the haptics are felt. **Aspect:** 3:2 or 4:5. **Attach:** the approved 00 or 01 result (form) and `light-v2-in-hand.webp` (look and hand pose).

```text
Ultra-realistic low-key studio product photograph, premium launch-film quality. An adult's right hand holds a white mobility cane with the L.I.G.H.T concept baton clipped on top. Match the device's form to the first reference image, and the lighting, backdrop and hand style to the second.

SUBJECT: the hand wraps the ergonomic rear grip of a slim cylindrical baton, 38 mm in diameter, in darker graphite soft-touch elastomer with a fine dimple texture, with the cane's slim black rubber grip nested beneath it, so the hand holds both as one handle. The thumb rests on top, just behind two flush pill-shaped tactile buttons on the graphite-grey bead-blasted aluminium body. Ahead of the hand, a low-profile graphite clip hugs the slim matte white cane shaft, which is about one third of the baton's thickness; the baton's sensor head (a ring of small rectangular dark-glass windows behind a thin soft-white light ring) points forward along the cane. The cane runs diagonally out of the frame; its tip is far out of frame. A black elastic wrist loop circles the wrist. Natural skin texture; an anatomically correct hand with five fingers.

COMPOSITION: the hand enters from the lower left; the baton angles up to the right across the centre of the frame, as in the reference.

LIGHTING AND SET: a seamless charcoal backdrop, never pure black; one large soft key light from above left falling off into darkness; a subtle rim along the aluminium; soft natural shadows on the hand.

CAMERA: medium-format camera, 100 mm lens, f/8, tack sharp, true-to-life colour and skin tones, high-end commercial photography.

No text, no logos, no labels.
```

### 05 — Exploded technical view

**Use:** the "How it works" / technology section. **Aspect:** 16:9 or 21:9. **Attach:** the approved 00 or 01 result (form) and `light-exploded.webp` (layout and look).

```text
Ultra-realistic technical exploded-view render, premium launch-film quality, of the L.I.G.H.T concept baton, a slim cylindrical device that clips onto a white mobility cane. Match the layout, lighting and dark gradient background of the second reference image; match the device's finish to the first.

LAYOUT: a clean axial explosion along one straight horizontal axis through the centre of the frame, a slight three-quarter view, every part concentric, evenly spaced with generous gaps, in assembly order from left to right:
(1) the ergonomic grip shell in darker graphite soft-touch elastomer with a fine dimple texture and a subtle hourglass waist;
(2) the haptic ring: a flexible circuit wrapped into a cylinder carrying a ring of eight small coin-shaped vibration actuators evenly spaced around its circumference;
(3) a cylindrical lithium battery pack in a matte grey wrap;
(4) the main compute board, a narrow dark circuit board with a processor under a copper heat spreader;
(5) a separate, smaller safety-core board with its own microcontroller, clearly a distinct module;
(6) a slim microphone-array board;
(7) the body tube in graphite-grey aluminium with two pill-shaped tactile buttons and, on its underside, the low-profile C-shaped clip;
(8) the thin soft-white light ring;
(9) a small camera module with one round lens and a tiny infrared illuminator;
(10) a ring-shaped sensor carrier holding small square time-of-flight depth sensors all the way around and two small round ultrasonic transducers;
(11) the sensor-head cap with its ring of small rectangular dark-glass windows;
(12) a flat copper wireless-charging coil and the end cap with a tiny light slit, at the far right.

STYLE: a dark charcoal gradient background, lighter grey in the centre falling to near-black at the edges, as in the reference; soft overhead studio light; subtle reflections and soft shadows; accurate materials: anodised aluminium, elastomer, glass, copper, FR4 circuit boards with fine, real-looking components. True-to-life colour; the only light sources visible are the soft-white light ring and the end-cap slit, softly lit, not glowing. Everything tack sharp; high-end 3D product visualisation indistinguishable from photography, 8K detail.

No text, no labels, no callout lines, no logos.
```

### 06 — The grip: where you feel it

**Use:** explains the 360° haptic feedback ("where it vibrates = where the obstacle is"). **Aspect:** 16:9. **Attach:** the approved 00 or 01 result (form) and `light-v2-exterior.webp` (look).

```text
Ultra-realistic low-key product visualisation, premium launch-film quality, of the ergonomic grip of the L.I.G.H.T concept baton, clipped onto a white mobility cane, with a partial see-through view. Match the device's form to the first reference image and the lighting to the second.

SUBJECT: the rear half of a slim cylindrical baton, 38 mm in diameter, in three-quarter view: the darker graphite soft-touch ergonomic grip with a fine dimple texture, a subtle hourglass waist and a soft flare, its end cap with a tiny soft-white light slit, and ahead of it the graphite-grey aluminium body with two flush pill-shaped tactile buttons. Beneath it, the slim matte white cane shaft, about one third of the baton's thickness, held by a low-profile graphite clip, running out of frame. The grip's outer elastomer is rendered as smoked translucent material, revealing a ring of eight small coin-shaped vibration actuators evenly spaced around the inside of the grip on a thin flexible circuit, so the 360-degree layout reads clearly. Everything else is fully opaque.

LIGHTING AND SET: a seamless charcoal backdrop falling into darkness; one large soft overhead key light and a crisp rim; the actuators catch small, precise highlights. Emphasis comes from translucency and light, not glow or colour.

CAMERA: medium-format camera, 120 mm macro lens, f/11, tack sharp, true-to-life colour. High-end 3D product visualisation indistinguishable from photography.

No text, no labels, no callout lines, no logos.
```

## 5. Optional renders

### 07 — See-through view: the safety core

**Use:** the reliability section ("basic warnings keep working even if the main system fails"). **Aspect:** 16:9. **Attach:** the approved 00 or 01 result (form) and `light-exploded.webp` (look).

```text
Ultra-realistic low-key product visualisation, premium launch-film quality, of the L.I.G.H.T concept baton clipped onto a slim white mobility cane shaft, rendered with a see-through housing.

SUBJECT: a slim cylindrical baton, about 20 cm long and 38 mm in diameter, in three-quarter view, lying on top of the cane shaft (about one third of its thickness) and held by a low-profile graphite clip; the shaft runs out of frame at both ends. The graphite aluminium shell is rendered as smoked translucent glass, so the inside is visible: the main compute board with a copper heat spreader, a cylindrical battery, the ring of sensors in the head, the ring of vibration actuators in the grip. One component is emphasised: a small, separate safety-core board with its own microcontroller, its own two small ultrasonic sensors in the head and its own thin wiring path to the actuator ring, rendered fully opaque and crisply lit, while everything else is ghosted at lower contrast.

LIGHTING AND SET: a dark charcoal gradient background, lighter in the centre falling to near-black at the edges; soft overhead studio light; emphasis comes from opacity and light, never glow or colour. Precise, calm, trustworthy. High-end 3D product visualisation, 8K detail.

No text, no labels, no callout lines, no logos.
```

### 08 — Lifestyle: walking a familiar route

**Use:** the Route Memory and Guide Notes story, or section breaks. **Aspect:** 21:9 or 16:9. **Attach:** the approved 00 or 01 result (form).

```text
Ultra-realistic cinematic editorial photograph, premium campaign quality: a blind person in their thirties walks confidently along a quiet European street at dusk, using a long white mobility cane with a slim graphite-grey cylindrical device clipped on top of it at the grip end; their hand holds the device's grip and the cane together as one handle. The cane is full-length and correctly proportioned: a slim white shaft about as long as from their hip to well ahead of their feet, a red reflective band near the bottom and a slim pencil tip on the paving stones. A single small wireless earbud sits in one ear; the other ear is open. Understated dark clothing. Relaxed, purposeful posture.

COMPOSITION: medium-wide shot from a slight front three-quarter angle at eye level; the person on the left third, the street ahead in soft focus with warm shopfront lights and a low-hanging tree branch. The device is visible but small: part of the scene, not an advert.

LIGHT AND GRADE: cinematic low-key dusk light: deep blue-grey shadows, warm practical lights from the shopfronts, a soft rim on the person and the cane, natural skin tones, subtle film grain. Authentic, dignified, independent; not staged, not pitying.

CAMERA: 50 mm lens, f/2, shallow depth of field, natural perspective. Photorealistic.

No text, no logos, no sunglasses cliché.
```

### 09 — On the charging dock

**Use:** the battery and charging section. **Aspect:** 3:2. **Attach:** the approved 00 result (form) and `light-v2-docked.webp` (look and composition). Shows the baton off the cane, so check the standalone rule in §0 first.

```text
Ultra-realistic low-key studio product photograph, premium launch-film quality. Match the composition, lighting and backdrop of the second reference image exactly, and the device's form and finish to the first. The L.I.G.H.T concept baton, a slim graphite-grey bead-blasted aluminium cylinder with a sensor head, a thin soft-white light ring, two flush pill buttons and a darker graphite ergonomic grip, stands upright in a round cup-shaped wireless charging dock in matching graphite aluminium with a tiny soft-white charging light. A seamless charcoal backdrop; one large overhead softbox falling off into darkness; a crisp rim; deep soft shadows. Medium-format camera, 100 mm lens, f/11, tack sharp, true-to-life colour.

No text, no logos, no labels.
```

## 6. Fix-up edits

If one detail is wrong but the image is otherwise good, don't regenerate. Send a short edit in the same chat:

| Problem | Edit prompt |
|---|---|
| Cane too thick | "Make the cane shaft much slimmer: about one third of the device's thickness, like a thick pencil. Change nothing else." |
| Cane too short, or tip near the device | "Remove the cane's tip and red band from this frame. The cane continues straight out of the frame at both ends. Change nothing else." |
| Cartoon ball tip (full-length shot) | "Replace the ball tip with a slim black nylon pencil tip, barely wider than the shaft, slightly scuffed. Change nothing else." |
| Flat or bright lighting | "Relight as low-key studio photography: a dark charcoal paper backdrop, one large overhead softbox falling off into darkness at the edges, a crisp rim light on the aluminium, deep soft shadows. Keep the product and composition identical." |
| Clip looks like a bulky bracket | "Make the clip low-profile: a slim C-shaped jaw machined into the underside of the body in matching aluminium, hugging the shaft, about half its current size. Change nothing else." |
| Device reshaped | "Keep the device's silhouette and proportions identical to the reference image; only the colour, grip and clip differ." |

## 7. Getting consistent, high-end results

- **Always attach two references:** one for form and one for the look (§0). Without them, models drift to flat, bright lighting.
- **Iterate by editing.** Once an image is close, use the §6 edits instead of starting again.
- **Exploded views are the hardest.** Generate several and pick the cleanest. Check the parts are in order and the axis is straight. If it's crowded, delete items from the list.
- **Braille, text and small details come out garbled.** Fix the button dot patterns and any wordmark in retouching, or keep them out of focus.
- **Check the cane on every render.** Slim shaft, the tip and red band only in full-length shots and a long way from the device, nothing cut or bent. Blind readers' sighted friends, O&M instructors and investors will all notice a wrong cane.
- **Check hands.** Five fingers, wrapping the baton grip and the cane grip together.
- **Watermarks.** Some Gemini plans add a visible sparkle mark in the corner (as in the 11-01 test image). Check which output you'll publish, and generate without it rather than covering it up.
- **Delivery.** Ask for the largest size the model offers; heroes need 2400 px wide or more, exported later as AVIF/WebP.
- **Once renders are chosen:** record them in the design brief ([03_design_brief.md](03_design_brief.md) §9), and caption each on the site as a concept visual.
