# L.I.G.H.T — Image-Generation Prompts (concept renders)

> **Status:** v0.2 · **Last updated:** 2026-11-01
> Purpose: concept renders of L.I.G.H.T **clipped onto a white cane**, for the `light-public` website.
> **v0.2 change [DECIDED 11-01]:** the device is the **original L.I.G.H.T baton**, with its form kept mostly the same. Two things change: a **more ergonomic grip**, and a **mechanical clip on the baton body** that attaches it to a white cane. The user's hand holds the **baton grip**. The v0.1 design (grip sleeve plus separate sensor box) is dropped.
> **Colourway [DECIDED 11-01]:** a neutral refresh. Graphite grey replaces matte black; soft white replaces the cyan ring and the amber light.
> Every prompt below stands on its own. Paste one whole code block into the image model; don't combine them.
> Animation briefs are in [animations.md](animations.md).

## 0. Before you generate

### Use the original render as a reference (most important)

Text alone lets the model invent a new device, which is what happened with v0.1. **Attach the original baton render to every generation** and tell the model to keep its shape:

- Best reference: `../light-guidance-experience/public/assets/device/light-v2-exterior.webp`
- Hand reference: `../light-guidance-experience/public/assets/device/light-v2-in-hand.webp`

If your model can edit an image (ChatGPT/GPT image, Gemini, Firefly, Flux Kontext and others), **start with prompt 00**. It edits the original render instead of drawing from scratch. Then use the approved result of 00 as the reference for all the others.

### Design details to confirm

| Detail | Value used in these prompts | Tag |
|---|---|---|
| Baton form | As the original: a 20 cm × 38 mm cylinder with a sensor head (a ring of rectangular windows), a light ring, two pill buttons, a textured grip and an end cap | [DECIDED 11-01] |
| Ergonomic grip | The rear half becomes a contoured soft-touch grip: a slight hourglass waist, a slightly oval cross-section, a fine dimple texture and a soft flare at the end | [ASSUMPTION] |
| Clip | A sprung C-jaw quick-release clip on the **underside of the body, just ahead of the grip**, lined with black elastomer and fitted with a flush release lever | [ASSUMPTION] |
| How it sits on the cane | Baton on **top** of the cane, parallel to it, **sensor head pointing toward the cane tip**. The clip grips the shaft just ahead of the cane's own grip, and the cane's grip nests in a shallow channel under the baton grip, so the hand holds both as one handle | [ASSUMPTION] |
| Buttons | Two pill buttons, as in the original. The TRD lists four functions (Identify, Replay, Record, Status); the final count is [OPEN] | [OPEN] |
| Colourway | Bead-blasted graphite-grey aluminium; a darker graphite soft-touch grip; a soft-white light ring and status light | [DECIDED 11-01] |
| Text and logos on the device | None in the render. Add a wordmark in post if needed | [REC] |

### Rules for the site

These come from the PRD; they are not instructions for the image model.
- Caption every render as a **concept visual**.
- Never show or imply that the device **replaces** the cane. In mounted shots the cane is complete and clearly the main tool.
- Showing the baton **off** the cane (prompt 00 before the edit, the clip-on animation, the dock) hints at standalone use. Whether the site mentions standalone use is still **[OPEN]**: ask the founder before publishing those images.

## 1. Design DNA (already inside every prompt)

This block describes the product. It is already pasted into each prompt below. If you change a detail in §0, change it here and in each prompt.

```text
L.I.G.H.T is a concept assistive device for blind and visually impaired people: one slim cylindrical handheld baton that clips onto a standard white mobility cane. It is a single cylinder: no separate box, no sleeve, no screen.
THE BATON: about 20 cm long and 38 mm in diameter, soft radiused ends, bead-blasted anodised aluminium in graphite grey. Three zones along its length:
(1) SENSOR HEAD, the front quarter: a ring of small rectangular dark-glass sensor windows evenly spaced around the full circumference, one small round lens below them, and a flat front face. A thin soft-white light ring separates the head from the body.
(2) BODY, the middle: two pill-shaped tactile buttons in a row along the top, flush with the surface, each with a small raised dot pattern.
(3) ERGONOMIC GRIP, the rear half: darker graphite soft-touch elastomer with a fine dimpled texture, gently contoured with a subtle hourglass waist, a slightly flattened oval cross-section and a soft flare at the rear; it ends in a flat end cap with a tiny soft-white status light slit.
THE CLIP: on the underside of the body, just ahead of the grip, a precise tool-free quick-release clip in matching graphite aluminium with a black elastomer lining: a sprung C-shaped jaw that snaps around the cane shaft, with a small flush release lever. Along the underside of the grip runs a shallow concave channel.
MOUNTED POSITION: the baton sits on top of the cane, parallel to the shaft, sensor head pointing toward the cane tip. The clip grips the shaft just ahead of the cane's own grip; the cane's slim black rubber grip nests in the channel under the baton grip, so the two form one handle; the cane's black elastic wrist loop hangs from the rear end.
THE CANE: a real, standard long white cane, about 120 cm: matte white shaft about 12 mm in diameter, a reflective red band near the bottom, a white rolling ball tip.
Design language: calm, precise, premium consumer electronics; tight tolerances, consistent radii, honest materials; nothing toy-like, no gamer styling.
```

## 2. Negative prompt (shared)

Use this with every prompt if your model takes a separate negative prompt. Otherwise append it as "Avoid: …".

```text
separate sensor box, rectangular camera housing, grip sleeve, screen, display, device mounted below the cane grip as a block, device coaxial with the shaft, text, letters, logos, watermark, labels, UI overlays, cyan or blue light, amber or orange light, gold, neon, RGB lighting, sci-fi, cyberpunk, gamer aesthetic, plastic toy look, cheap glossy plastic, visible screws, cluttered background, lens flare, oversaturated colour, cartoon, illustration, CGI plastic sheen, warped geometry, extra buttons, duplicated parts, bent or broken cane, cane missing its tip, deformed hands, extra fingers, fused fingers, sunglasses cliché, pity imagery
```

## 3. Start here

### 00 — Edit the original render (image-editing models)

**Attach:** `light-v2-exterior.webp`. **Aspect:** 16:9.

```text
Edit the attached product photo. Keep the baton's shape, proportions and layout exactly: the same slim cylinder, the same sensor head with its ring of rectangular windows and small round lens, the same light ring position, the same two pill-shaped braille buttons, the same end cap. Make only these changes:

1. COLOUR: change the whole body from matte black to bead-blasted anodised aluminium in graphite grey. The thin light ring glows soft white instead of cyan. The end-cap light slit glows soft white instead of amber.
2. GRIP: reshape the textured rear half into a more ergonomic grip: darker graphite soft-touch elastomer with a fine dimpled texture, a subtle hourglass waist, a slightly flattened oval cross-section and a soft flare toward the end cap. Keep the overall length.
3. CLIP: add a precise tool-free quick-release clip on the underside of the body, just ahead of the grip: a sprung C-shaped jaw in matching graphite aluminium lined with black elastomer, with a small flush release lever. It should look designed in from the start, not bolted on.
4. CANE: clip the baton onto a real, standard long white mobility cane (matte white shaft about 12 mm thick, reflective red band near the bottom, white rolling ball tip). The baton sits on top of the cane, parallel to the shaft, sensor head toward the cane tip; the clip grips the shaft just ahead of the cane's slim black rubber grip, which nests under the baton grip; the cane's black elastic wrist loop hangs from the rear.
5. BACKGROUND: replace the black background with a seamless warm light-grey studio backdrop (around #E8E6E2), soft large-softbox lighting, a gentle contact shadow.

Photorealistic, Apple-style studio product photography, tack sharp, true-to-life colour. No text, no logos.
```

## 4. Core renders

### 01 — Hero: clipped onto the cane (studio)

**Use:** home page hero. **Aspect:** 16:9 (desktop) and 4:5 (mobile crop). **Attach:** the approved 00 result, or `light-v2-exterior.webp`.

```text
Ultra-realistic studio product photograph in the style of an Apple product launch page: L.I.G.H.T, a concept assistive device, clipped onto a standard white mobility cane. Keep the device's shape exactly as in the reference image.

PRODUCT: One slim cylindrical baton, about 20 cm long and 38 mm in diameter, in bead-blasted graphite-grey anodised aluminium. Its front quarter is a sensor head with a ring of small rectangular dark-glass windows around the full circumference and one small round lens; a thin soft-white light ring separates the head from the body; two flush pill-shaped tactile buttons with raised dots sit on top of the body; the rear half is an ergonomic grip in darker graphite soft-touch elastomer with a fine dimple texture, a subtle hourglass waist and a soft flare, ending in a flat end cap with a tiny soft-white light slit. A precise graphite quick-release clip with a black elastomer lining, on the underside of the body just ahead of the grip, holds the cane shaft. The baton sits on top of the cane, parallel to it, sensor head toward the cane tip; the cane's slim black rubber grip nests under the baton grip; the black elastic wrist loop hangs from the rear.

THE CANE: a real standard long white cane: matte white shaft about 12 mm thick, reflective red band near the bottom, white rolling ball tip.

COMPOSITION: The cane floats diagonally from upper left to lower right; the baton sits in the upper-left third, sharply in focus; the shaft runs out to the lower right with the red band and ball tip in frame. A three-quarter view showing the buttons, the sensor windows and the clip. Generous negative space on the right for headline text.

LIGHTING AND SET: Seamless warm light-grey backdrop (around #E8E6E2) with a soft gradient; a large softbox key light from the upper left, gentle fill, a crisp rim light along the aluminium; a soft, realistic shadow below.

CAMERA: 100 mm lens, f/8, tack sharp, no distortion, true-to-life colour. Photorealistic high-end commercial product photography, 8K detail.

No text, no logos, no labels.
```

### 02 — Full length: the whole cane

**Use:** the "Works with the cane you already trust" section, to show how small the device is next to the cane. **Aspect:** 9:16 or 21:9. **Attach:** the approved 00 or 01 result.

```text
Ultra-realistic studio product photograph, Apple-style minimalism. A complete standard long white mobility cane, about 120 cm, shown in full from the wrist loop to the tip, with the L.I.G.H.T concept baton clipped on near the top. Keep the device's shape exactly as in the reference image.

PRODUCT: A slim graphite-grey aluminium baton, about 20 cm long, sits on top of the cane, parallel to the shaft, its sensor head (a ring of small rectangular dark-glass windows and a thin soft-white light ring) pointing down toward the tip; its rear half is a darker graphite soft-touch ergonomic grip; a graphite quick-release clip on its underside holds the shaft just ahead of the cane's slim black rubber grip, which nests under the baton grip; the black elastic wrist loop hangs from the top end.

THE CANE: accurate and realistic: matte white shaft about 12 mm thick, reflective red band near the bottom, white rolling ball tip, intact and unmodified.

COMPOSITION: The cane stands perfectly upright in the centre of a tall frame, tip touching the floor. The baton occupies the top fifth of the frame and reads as small and integrated; the cane is clearly the main tool.

LIGHTING AND SET: Seamless warm light-grey studio sweep (around #E8E6E2), soft overhead and side softboxes, a subtle floor reflection and a soft contact shadow at the tip. Calm, airy, premium.

CAMERA: 85 mm lens, f/11, everything sharp, true-to-life colour. Photorealistic high-end commercial product photography.

No text, no logos, no labels.
```

### 03 — The clip (macro)

**Use:** the "Clips on without tools" message. **Aspect:** 3:2 or 1:1. **Attach:** the approved 00 or 01 result.

```text
Ultra-realistic macro product photograph, Apple-style detail shot, of the clip that attaches the L.I.G.H.T concept baton to a white mobility cane. Keep the device's shape and finish exactly as in the reference image.

SUBJECT: A close-up of the underside of a slim cylindrical baton in bead-blasted graphite-grey anodised aluminium, where a precise tool-free quick-release clip holds the matte white shaft of a standard white cane, about 12 mm thick. The clip is a sprung C-shaped jaw in matching aluminium, lined with black elastomer that hugs the shaft, with a small flush release lever pressed halfway to show the mechanism. Behind the clip, the start of the darker graphite soft-touch grip with its fine dimple texture and the shallow channel along its underside, with the cane's slim black rubber grip nested in it. One edge of a pill-shaped tactile button is visible on top.

COMPOSITION: A tight three-quarter macro from slightly below; the clip jaw and lever are in the sharpest focus, with a gentle falloff along the shaft. Clean and uncluttered.

LIGHTING AND SET: Seamless warm light-grey background (around #E8E6E2); a large diffused key light with a thin specular highlight along the aluminium chamfers; the bead-blast texture and the elastomer grain are visible. Precise, engineered, premium.

CAMERA: 100 mm macro lens, f/5.6, focus stacked, true-to-life colour. Photorealistic high-end commercial photography.

No text, no logos, no labels.
```

### 04 — In hand, on the street

**Use:** human scale, and the grip as the place where the haptics are felt. **Aspect:** 16:9 or 4:5. **Attach:** the approved 00 or 01 result, plus `light-v2-in-hand.webp` for the hand pose.

```text
Ultra-realistic editorial product photograph, Apple-campaign style, natural and dignified. A close-up of an adult's right hand holding a white mobility cane with the L.I.G.H.T concept baton clipped on, while walking on a city pavement. Keep the device's shape exactly as in the reference image.

SUBJECT: The hand wraps the ergonomic rear grip of a slim cylindrical baton in darker graphite soft-touch elastomer, with the cane's slim black rubber grip nested beneath it, so the hand holds both as one handle; the thumb rests on top, just behind two flush pill-shaped tactile buttons on the graphite-grey aluminium body. Ahead of the hand, a graphite quick-release clip holds the matte white cane shaft, and the baton's sensor head (a ring of small rectangular dark-glass windows behind a thin soft-white light ring) points forward and down along the cane toward the pavement. A black elastic wrist loop circles the wrist. Natural skin texture; an anatomically correct hand with five fingers. Understated clothing: the cuff of a dark wool coat.

COMPOSITION: The hand and baton sharp in the left-centre of the frame; the white shaft angles down and forward out of frame. The background is a softly blurred European city street in morning light: stone pavement, warm facades, distant pedestrians as soft shapes.

LIGHTING: Soft overcast daylight with a gentle warm rim from a low sun; realistic shadows; the aluminium catches a subtle highlight.

CAMERA: 85 mm lens, f/2.0, shallow depth of field, natural colour grade, subtle film grain. Photorealistic premium lifestyle photography, not stock-photo looking.

No text, no logos, no labels.
```

### 05 — Exploded technical view

**Use:** the "How it works" / technology section. **Aspect:** 21:9 or 16:9. **Attach:** the approved 00 or 01 result. The old `light-exploded.webp` is a good layout reference; the new render uses the graphite colours and a light background.

```text
Ultra-realistic technical exploded-view render in the style of an Apple product page, of the L.I.G.H.T concept baton, a slim cylindrical device that clips onto a white mobility cane. Precise, engineered, beautiful photoreal materials, not a diagram.

LAYOUT: A clean axial explosion along one straight horizontal axis, three-quarter view, every part concentric, evenly spaced with generous gaps, in assembly order from front (left) to rear (right):
(1) the sensor-head cap in bead-blasted graphite-grey aluminium, with a ring of small rectangular dark-glass windows around its circumference;
(2) a ring-shaped sensor carrier holding small square time-of-flight depth sensors all the way around, and two small round ultrasonic transducers;
(3) a small camera module with one round lens and a tiny infrared illuminator;
(4) the thin soft-white light ring;
(5) a slim microphone-array board;
(6) the main compute board, a long narrow dark circuit board with a processor under a copper vapour-chamber heat spreader;
(7) a separate, smaller safety-core board with its own microcontroller, clearly a distinct module;
(8) the body tube in graphite-grey aluminium with two pill-shaped tactile buttons;
(9) a cylindrical lithium battery pack in a matte grey wrap;
(10) the haptic ring: a flexible circuit wrapped into a cylinder carrying a ring of eight small coin-shaped vibration actuators evenly spaced around its circumference;
(11) the ergonomic grip shell in darker graphite soft-touch elastomer with a fine dimple texture and a subtle hourglass waist;
(12) a flat copper wireless-charging coil;
(13) the end cap with a tiny light slit.
Below the axis, exploded straight downward from the body: (14) the quick-release clip, a sprung C-shaped jaw in graphite aluminium with a black elastomer lining and a small lever, and below it a short section of matte white cane shaft, showing where it clips.

STYLE: Seamless warm light-grey background (around #E8E6E2) with a very soft gradient; soft even studio lighting from above; subtle soft shadows under each part; accurate materials: anodised aluminium, elastomer, glass, copper, FR4 circuit boards with fine, real-looking components. Neutral, true-to-life colour, no glow, no neon. Everything tack sharp; high-end 3D product visualisation indistinguishable from photography, 8K detail.

No text, no labels, no callout lines, no logos.
```

### 06 — The grip: where you feel it

**Use:** explains the 360° haptic feedback ("where it vibrates = where the obstacle is"). **Aspect:** 16:9. **Attach:** the approved 00 or 01 result.

```text
Ultra-realistic product visualisation, Apple product-page style, of the ergonomic grip of the L.I.G.H.T concept baton, clipped onto a white mobility cane, with a partial see-through view.

SUBJECT: The rear half of a slim cylindrical baton in three-quarter view: the darker graphite soft-touch ergonomic grip with a fine dimple texture, a subtle hourglass waist and a soft flare, its end cap with a tiny soft-white light slit, and ahead of it the graphite-grey aluminium body with two flush pill-shaped tactile buttons. The cane's slim black rubber grip nests under the baton grip; a graphite quick-release clip holds the matte white shaft ahead of it. The outer elastomer of the grip is rendered as frosted translucent material, revealing a ring of eight small coin-shaped vibration actuators evenly spaced around the inside of the grip on a thin flexible circuit, so the 360-degree layout reads clearly. Everything else is fully opaque.

STYLE: Seamless warm light-grey background (around #E8E6E2), soft studio lighting, true-to-life colour; emphasis comes from translucency and contrast only, not glow. Precise, calm, premium. High-end 3D product visualisation indistinguishable from photography.

No text, no labels, no callout lines, no logos.
```

## 5. Optional renders

### 07 — See-through view: the safety core

**Use:** the reliability section ("basic warnings keep working even if the main system fails"). **Aspect:** 16:9. **Attach:** the approved 00 or 01 result.

```text
Ultra-realistic product visualisation, Apple product-page style, of the L.I.G.H.T concept baton clipped onto a matte white mobility cane shaft, rendered with a see-through housing.

SUBJECT: A slim cylindrical baton, about 20 cm long, in three-quarter view, sitting on top of the cane and held by a graphite quick-release clip. Its graphite-grey aluminium shell is rendered as frosted translucent glass so the inside is visible: the long main compute board with a copper heat spreader, a cylindrical battery, the ring of sensors in the head, the ring of vibration actuators in the grip. One component is emphasised: a small, separate safety-core board with its own microcontroller, its own two small ultrasonic sensors in the head and its own thin wiring path to the actuator ring, rendered fully opaque and crisply lit, while everything else is ghosted at lower contrast.

STYLE: Seamless warm light-grey background (around #E8E6E2), soft studio lighting, true-to-life colour. Emphasis comes from opacity and contrast only, never glow or colour. Precise, calm, trustworthy. High-end 3D product visualisation, 8K detail.

No text, no labels, no callout lines, no logos.
```

### 08 — Lifestyle: walking a familiar route

**Use:** the Route Memory and Guide Notes story, or section breaks. **Aspect:** 21:9 or 16:9. **Attach:** the approved 00 or 01 result.

```text
Ultra-realistic editorial photograph in a premium Apple-campaign style: a blind person in their thirties walks confidently along a quiet tree-lined European street in soft early-evening light, using a long white mobility cane with a slim graphite-grey cylindrical device clipped on top of it near the grip; their hand holds the device's grip and the cane together as one handle. A single small wireless earbud sits in one ear; the other ear is open. Well-fitted, understated clothing in muted neutral tones. The posture is relaxed and purposeful; the cane sweeps ahead with its white rolling tip on the paving stones.

COMPOSITION: Medium-wide shot from a slight front three-quarter angle at eye level; the person on the left third, the street ahead in soft focus with warm shopfront lights and a low-hanging tree branch. The device is visible but small: it is part of the scene, not an advert.

LIGHT AND GRADE: Golden-hour backlight with soft natural fill, gentle contrast, natural skin tones, subtle film grain. Authentic, dignified, independent; not staged, not pitying.

CAMERA: 50 mm lens, f/2.8, natural perspective. Photorealistic.

No text, no logos, no sunglasses cliché.
```

### 09 — Dark variant of the hero

**Use:** a dark section or social media. **Aspect:** 16:9. **Attach:** the approved 01 result.

```text
Ultra-realistic studio product photograph, Apple-launch style, of the L.I.G.H.T concept baton clipped onto a white mobility cane, on a deep charcoal background. Keep the device and composition exactly as in the reference image; change only the set and lighting.

SET AND LIGHTING: A seamless deep charcoal background (around #1C1C1E), never pure black; one large overhead softbox and two thin strip lights tracing the silhouette in clean white rim light; the graphite aluminium shows its bead-blast texture; the soft-white light ring and end-cap slit glow gently; the white cane shaft glows softly in the light. No coloured light.

CAMERA: 100 mm lens, f/8, tack sharp, true-to-life colour, high-end commercial product photography, 8K detail.

No text, no logos, no labels.
```

### 10 — At home: on the charging dock

**Use:** the battery and charging section. **Aspect:** 4:5 or 16:9. **Attach:** `light-v2-docked.webp` and the approved 00 result. Shows the baton off the cane, so check the standalone rule in §0 first.

```text
Ultra-realistic lifestyle product photograph, Apple style. The L.I.G.H.T concept baton, a slim graphite-grey aluminium cylinder with a sensor head, a thin soft-white light ring and a darker graphite ergonomic grip, stands upright in a round cup-shaped wireless charging dock in matching graphite aluminium with a tiny soft-white charging light, on a light oak sideboard by a front door in morning light. A folded white mobility cane lies beside it, and a single small wireless earbud rests in front. Keep the baton's shape exactly as in the reference image.

COMPOSITION: Eye level, the dock in the left-centre of the frame, a softly blurred warm interior with a linen-coloured wall behind. Calm, domestic, premium.

LIGHT: Soft window light from the left, gentle shadows, natural colour.

CAMERA: 85 mm lens, f/4, true-to-life colour, photorealistic.

No text, no logos, no labels.
```

## 6. Getting consistent, high-end results

- **Always attach a reference image.** Use the original render for 00, then the approved 00 or 01 result for everything else. Use the model's image-reference or "keep this product" feature.
- **If the model reshapes the device**, add this line to the top of the prompt: "Keep the device's silhouette and proportions identical to the reference; only change what is listed."
- **Exploded views are the hardest.** Generate several and pick the cleanest. Check the parts are in order and the axis is straight. If it's crowded, delete items from the list rather than accepting a messy result.
- **Braille, text and small details come out garbled.** Fix the button dot patterns and any wordmark in retouching, or keep them out of focus.
- **Check the cane on every render.** White shaft, red band near the bottom, rolling ball tip, wrist loop at the top end, nothing cut or bent. Blind readers' sighted friends, O&M instructors and investors will all notice a wrong cane.
- **Check hands.** Five fingers, wrapping the baton grip and the cane grip together.
- **Delivery.** Ask for the largest size the model offers; heroes need 2400 px wide or more, exported later as AVIF/WebP. Keep the backdrop colour the same across renders so they sit on the page without visible seams.
- **Model flags (optional).** Midjourney: append `--ar 16:9 --style raw` and use the image as `--cref`/`--sref` or an omni-reference. For models with a negative-prompt field, paste §2 there.
- **Once renders are chosen:** record them in the design brief ([03_design_brief.md](03_design_brief.md) §9), and caption each on the site as a concept visual.
