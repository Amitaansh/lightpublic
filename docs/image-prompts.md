# L.I.G.H.T — Image-Generation Prompts (concept renders)

> **Status:** v0.1 · **Last updated:** 2026-11-01
> Purpose: concept renders of the **cane-mounted** L.I.G.H.T for the `light-public` website.
> Sources: [PRD v0.6](01_prd.md) §4.2, §8 · [TRD v0.5](02_trd.md) §2, §9.
> Every prompt below stands on its own. Paste one whole code block into the image model; don't combine them.

## 0. Before you generate

### Design choices to confirm

The PRD and TRD say what the device contains, not what it looks like. These prompts fill the gaps with the choices below. Change them here, in §1, before generating, so every render matches.

| Choice | Value used in these prompts | Tag |
|---|---|---|
| Colourway | Warm graphite anodised aluminium + charcoal soft-touch sleeve, on a white cane. No coloured accent light; one soft-white pinhole status light | [ASSUMPTION] |
| Backdrop | Light warm-grey seamless studio. A fresh look: the deck was near-black and gold, the POC app cyan and amber | [ASSUMPTION] |
| Sensor unit shape | Rounded, pebble-like block about 12 × 5.5 × 4 cm, with a smoked glass sensor window angled to face straight ahead at walking angle | [ASSUMPTION] |
| Buttons | Four tactile buttons on a satin collar at the bottom of the sleeve, under the thumb. The Record button sits inside a raised guard ring | [ASSUMPTION] |
| Sleeve-to-unit link | A short black braided cable with a flush magnetic connector. The TRD allows a cable or a contact connector | [OPEN] |
| Sleeve size | About 24 cm long and 32 mm in diameter, over the cane's own grip | [ASSUMPTION] |
| Text and logos on the device | None in the render. Add a wordmark later in post if needed | [REC] |

### Rules for the site

These come from the PRD; they are not instructions for the image model.
- Caption every render as a **concept visual**.
- Don't show the device **replacing** the cane. The cane must always be complete and clearly in use.
- Don't show **standalone** (detached) use. Whether the site mentions it is still [OPEN].
- Exploded and cutaway views show **illustrative** parts, not a final bill of materials.

## 1. Design DNA (already inside every prompt)

This block describes the product. It is already pasted into each prompt below. If you change a choice in §0, change it here and in each prompt.

```text
L.I.G.H.T is a concept assistive device that attaches to a standard white mobility cane for blind and visually impaired people. It has two parts.
(1) HAPTIC GRIP SLEEVE: a slim cylindrical sleeve about 24 cm long and 32 mm in diameter that slides over the cane's own grip. Matte charcoal soft-touch silicone, very fine circumferential seams every few centimetres, gently tapered ends. At its lower end, a thin satin titanium-grey aluminium collar carries four small round tactile buttons in a row on the top face where the thumb rests; each button has a different raised dot pattern, and one sits inside a slightly raised guard ring.
(2) SENSOR UNIT: clamped to the cane shaft just below the sleeve. A compact, rounded, pebble-like body about 12 cm long, 5.5 cm wide and 4 cm deep, in bead-blasted anodised aluminium in warm graphite, with soft radiused edges and no visible screws. Its forward face is a smoked black glass window, angled about 30 degrees upward from the shaft so it faces straight ahead when the cane is held at walking angle; behind the glass, faintly visible, are two small camera lenses, a row of small square depth-sensor apertures and a narrow illuminator strip. A second, smaller glass window on the top edge faces forward and upward. Below the main glass are two small circular perforated grilles (ultrasonic sensors). A tiny pinhole status light glows soft white. The unit holds the shaft with a tool-free quick-release clamp in matching aluminium with a black elastomer insert and a flush lever.
A short black fabric-braided cable with flush magnetic connectors joins the sleeve to the sensor unit.
THE CANE: a real, standard long white cane: matte white shaft about 12 mm in diameter, a reflective red band near the bottom, a white rolling ball tip, and a black elastic wrist loop at the top end. The sleeve completely covers the cane's original grip.
Industrial design language: calm, precise, premium consumer electronics; tight tolerances, consistent radii, honest materials, nothing toy-like, no gamer styling.
```

## 2. Negative prompt (shared)

Use this with every prompt if your model takes a separate negative prompt. Otherwise append it as "Avoid: …".

```text
text, letters, logos, watermark, brand names, labels, UI overlays, glowing neon, cyan or blue accent light, gold, RGB lighting, sci-fi, cyberpunk, gamer aesthetic, plastic toy look, cheap glossy plastic, visible screws, sharp unfinished edges, cluttered background, dramatic lens flare, oversaturated colour, cartoon, illustration, CGI-looking plastic sheen, warped or melted geometry, extra buttons, duplicated parts, bent or broken cane, cane missing its tip, deformed hands, extra fingers, fused fingers, sunglasses cliché, pity imagery
```

## 3. Core renders

### 01 — Hero: device on the cane (studio)

**Use:** home page hero. **Aspect:** 16:9 (desktop) and 4:5 (mobile crop).

```text
Ultra-realistic studio product photograph in the style of an Apple product launch page. The subject is L.I.G.H.T, a concept assistive device mounted on a standard white mobility cane.

PRODUCT: A slim haptic grip sleeve in matte charcoal soft-touch silicone, about 24 cm long and 32 mm in diameter, covers the cane's grip; at its lower end a thin satin titanium-grey aluminium collar carries four small round tactile buttons with raised dot patterns, one inside a raised guard ring. Directly below it, a compact rounded pebble-like sensor unit, about 12 cm long, in bead-blasted warm graphite anodised aluminium, is clamped to the shaft with a tool-free quick-release aluminium clamp. Its forward face is a smoked black glass window angled about 30 degrees upward from the shaft, faintly revealing two small camera lenses and small square depth-sensor apertures; two small perforated circular grilles sit below the glass; a tiny pinhole light glows soft white. A short black braided cable with flush magnetic connectors joins sleeve and unit. The cane is a real standard long white cane: matte white shaft about 12 mm thick, black elastic wrist loop at the top.

COMPOSITION: The cane floats diagonally across the frame from upper left to lower right, the device in the left-centre third and sharply in focus; the shaft continues out of frame at the lower right. Three-quarter view showing the sensor glass and the button collar. Generous negative space on the right for headline text.

LIGHTING AND SET: Seamless warm light-grey backdrop (around #E8E6E2) with a soft gradient toward the bottom; large softbox key light from upper left, gentle fill, crisp rim light tracing the aluminium edges; a soft, realistic contact shadow on the backdrop below. Accurate material rendering: fine bead-blast texture on the aluminium, velvety matte silicone, deep reflections in the smoked glass.

CAMERA: 100 mm macro-style product lens, f/8, every edge tack sharp, true-to-life colour, no distortion. Photorealistic, high-end commercial product photography, 8K detail.

No text, no logos, no labels.
```

### 02 — Full length: the whole cane

**Use:** "Works with the cane you already trust" section, to show the device's scale against the full cane. **Aspect:** 9:16 (vertical) or 21:9 (horizontal band).

```text
Ultra-realistic studio product photograph, Apple-style minimalism. A complete standard long white mobility cane, about 120 cm long, shown in full from wrist loop to tip, with the L.I.G.H.T concept device mounted near the top.

PRODUCT: At the top of the cane, a slim haptic grip sleeve in matte charcoal soft-touch silicone covers the grip, with a thin satin titanium-grey aluminium collar at its lower end carrying four small tactile buttons. Just below it, a compact rounded sensor unit in bead-blasted warm graphite anodised aluminium is clamped to the shaft by a tool-free aluminium quick-release clamp; its smoked black glass sensor window faces forward and slightly upward. A short black braided cable joins sleeve and unit. The cane itself is accurate and realistic: matte white shaft about 12 mm in diameter, a reflective red band near the bottom, a white rolling ball tip, a black elastic wrist loop at the top.

COMPOSITION: The cane stands perfectly upright in the centre of a tall frame, tip just touching the floor, as if balanced on its own. The device occupies the upper fifth of the frame and must read as small and integrated relative to the cane; the cane is clearly the main tool, intact and unmodified below the clamp.

LIGHTING AND SET: Seamless warm light-grey studio sweep (around #E8E6E2), soft overhead and side softboxes, a subtle floor reflection and a soft contact shadow at the tip. Calm, airy, premium.

CAMERA: 85 mm lens, f/11, everything sharp, true-to-life colour. Photorealistic high-end commercial product photography.

No text, no logos, no labels.
```

### 03 — Attachment detail (macro)

**Use:** "No tools, under 10 seconds" message and the mounting detail. **Aspect:** 3:2 or 1:1.

```text
Ultra-realistic macro product photograph, Apple-style detail shot, of how the L.I.G.H.T concept device attaches to a white mobility cane.

SUBJECT: A close-up of the point where a compact sensor unit in bead-blasted warm graphite anodised aluminium clamps onto the matte white shaft of a standard white cane, about 12 mm in diameter. The tool-free quick-release clamp, in matching aluminium with a precise black elastomer insert hugging the shaft, has a flush lever partly open, showing its precise mechanism. Just above, the lower end of a matte charcoal soft-touch silicone grip sleeve ends in a thin satin titanium-grey aluminium collar; a short black fabric-braided cable runs from the collar to the sensor unit, where it seats in a flush round magnetic connector. One edge of the unit's smoked black glass sensor window is visible.

COMPOSITION: Tight three-quarter macro, the clamp lever and magnetic connector in sharpest focus, a shallow falloff of focus along the shaft. Clean and uncluttered.

LIGHTING AND SET: Seamless warm light-grey background (around #E8E6E2), a large diffused key light with a thin specular highlight running along the aluminium chamfers, and fine visible bead-blast texture and braid weave. Precise, engineered, premium.

CAMERA: 100 mm macro lens, f/5.6, focus stacked for crisp detail, true-to-life colour. Photorealistic high-end commercial photography.

No text, no logos, no labels.
```

### 04 — In hand, on the street

**Use:** the human scale of the device, and the 360° haptic sleeve under the hand. **Aspect:** 16:9 or 4:5.

```text
Ultra-realistic editorial product photograph, Apple-campaign style, natural and dignified. A close-up of an adult's right hand holding a white mobility cane fitted with the L.I.G.H.T concept device, while walking on a city pavement.

SUBJECT: The hand wraps a slim haptic grip sleeve in matte charcoal soft-touch silicone that covers the cane's grip, in the standard cane technique: index finger extended straight down along the side of the grip, the other fingers wrapped around, the thumb resting near a thin satin titanium-grey aluminium collar with four small tactile buttons. Just below the hand, a compact rounded sensor unit in bead-blasted warm graphite anodised aluminium is clamped to the matte white cane shaft, its smoked black glass sensor window facing forward along the direction of walking. A short black braided cable joins sleeve and unit. A black elastic wrist loop circles the wrist. Natural skin texture and a correct, anatomically accurate hand with five fingers. Casual, understated clothing: the cuff of a dark wool coat.

COMPOSITION: The hand and device are sharp in the left-centre of the frame; the white shaft angles down and forward out of frame toward the pavement. The background is a softly blurred European city street in morning light: stone pavement, warm building facades, a few distant pedestrians as soft shapes.

LIGHTING: Soft overcast daylight with a gentle warm rim from low morning sun; realistic shadows; the aluminium catches a subtle highlight.

CAMERA: 85 mm lens, f/2.0, shallow depth of field, natural colour grade, subtle film-like grain. Photorealistic, premium lifestyle photography, not stock-photo looking.

No text, no logos, no labels.
```

### 05 — Exploded technical view: whole system

**Use:** the "How it works" / technology section. **Aspect:** 21:9 or 16:9.

```text
Ultra-realistic technical exploded-view render in the style of an Apple product page, of the L.I.G.H.T concept device for the white mobility cane. Precise, engineered, beautiful, photoreal materials, not a diagram.

LAYOUT: A clean axial explosion along one straight horizontal axis that follows a short section of matte white cane shaft, about 12 mm in diameter. Every part floats along this axis in assembly order, evenly spaced with generous gaps, perfectly aligned and concentric, slightly rotated toward the viewer in a three-quarter view so the depth of each part is readable.

LEFT GROUP — HAPTIC GRIP SLEEVE (left to right): (1) the matte charcoal soft-touch silicone outer skin, a hollow cylinder about 24 cm long; (2) a thin flexible printed circuit wrapped as a cylinder, carrying two evenly spaced rings of eight small coin-shaped vibration actuators (LRAs) around its circumference; (3) a tiny motion-sensor board; (4) a rigid inner liner tube that slides over the cane's grip; (5) the satin titanium-grey aluminium collar with four small tactile buttons, one in a raised guard ring.

CONNECTOR: a short black fabric-braided cable with flush round magnetic connectors at both ends.

RIGHT GROUP — SENSOR UNIT (left to right): (6) the rear shell, bead-blasted warm graphite anodised aluminium, a rounded pebble shape about 12 cm long; (7) a flat rectangular lithium battery pack in a matte grey wrap; (8) the main compute board, a dense dark-green-black circuit board with a large processor under a copper vapour-chamber heat spreader; (9) a separate, smaller safety-core board with its own microcontroller, clearly a distinct module mounted apart from the main board; (10) a sensor carrier holding two small camera modules, three small square time-of-flight depth sensors, a narrow infrared illuminator strip and two round ultrasonic transducers; (11) a small microphone-array board with four tiny microphone ports; (12) a flat copper wireless-charging coil; (13) the front shell with its smoked black glass sensor window, angled upward; (14) the tool-free quick-release clamp in matching aluminium with a black elastomer insert around the shaft.

STYLE: Seamless warm light-grey background (around #E8E6E2) with a very soft gradient; soft, even studio lighting from above; subtle soft shadows under each part; accurate materials: anodised aluminium, silicone, glass, copper, FR4 circuit boards with fine real-looking components. Neutral, true-to-life colour; no glow effects. Everything tack sharp, high-end 3D product visualisation indistinguishable from photography, 8K detail.

No text, no labels, no callout lines, no logos.
```

### 06 — Exploded technical view: sensor unit only

**Use:** sensing and reliability detail. **Aspect:** 16:9 or 4:5.

```text
Ultra-realistic technical exploded-view render, Apple product-page style, of the sensor unit of the L.I.G.H.T concept device for the white mobility cane.

LAYOUT: A vertical exploded stack seen from a three-quarter top-front angle. The layers float one above another along a single vertical axis, evenly spaced, perfectly aligned. From top to bottom: (1) the front shell with a smoked black glass sensor window, a compact rounded pebble-shaped housing about 12 cm long in bead-blasted warm graphite anodised aluminium; (2) a sensor carrier with two small camera modules with tiny glass lenses, three small square time-of-flight depth-sensor modules, a narrow infrared illuminator strip and two round ultrasonic transducers with fine mesh faces; (3) a small microphone-array board with four tiny ports; (4) the main compute board: a dense dark circuit board with a large processor package, memory chips and a small antenna module, topped by a thin copper vapour-chamber heat spreader; (5) a separate, smaller safety-core board with its own microcontroller and its own small sensor connectors, visibly independent of the main board and sitting in its own compartment; (6) a flat rectangular lithium battery pack in a matte grey wrap; (7) a flat copper wireless-charging coil; (8) the rear shell in matching aluminium; (9) the tool-free quick-release clamp with a black elastomer insert, shown open.

STYLE: Seamless warm light-grey background (around #E8E6E2); soft overhead studio light with subtle soft shadows under each layer; highly realistic materials: bead-blasted aluminium, glass, copper, gold-plated contacts, FR4 boards with fine real-looking components. Neutral, true-to-life colour, no glow, no neon. Every layer tack sharp. High-end 3D product visualisation indistinguishable from photography, 8K detail.

No text, no labels, no callout lines, no logos.
```

### 07 — Exploded view: haptic grip sleeve

**Use:** explains 360° haptic feedback ("where it vibrates = where the obstacle is"). **Aspect:** 16:9.

```text
Ultra-realistic technical exploded-view render, Apple product-page style, of the haptic grip sleeve of the L.I.G.H.T concept device, which slides over the grip of a white mobility cane.

LAYOUT: A horizontal axial explosion, three-quarter view, all parts concentric and evenly spaced along one axis that runs through the top section of a matte white cane shaft with a black elastic wrist loop at its end. From the outside in: (1) the outer skin, a hollow cylinder about 24 cm long and 32 mm in diameter in matte charcoal soft-touch silicone with very fine circumferential seams; (2) a flexible printed circuit wrapped into a cylinder, carrying two rings of eight small coin-shaped vibration actuators (LRAs) evenly spaced all the way around its circumference, so the 360-degree layout reads clearly; (3) a tiny motion-sensor board; (4) a rigid inner liner tube; (5) at the lower end, a thin satin titanium-grey aluminium collar with four small round tactile buttons with raised dot patterns, one inside a raised guard ring; (6) a short black fabric-braided cable with a flush round magnetic connector.

STYLE: Seamless warm light-grey background (around #E8E6E2), soft even studio lighting, subtle soft shadows; realistic silicone, aluminium, polished steel actuator cans, flexible amber-coloured circuit film. Neutral, true-to-life colour, no glow. Tack sharp, high-end 3D product visualisation indistinguishable from photography.

No text, no labels, no callout lines, no logos.
```

## 4. Optional renders

### 08 — See-through view: the safety core

**Use:** reliability section ("basic warnings keep working even if the main system fails"). **Aspect:** 16:9.

```text
Ultra-realistic product visualisation, Apple product-page style, of the L.I.G.H.T concept sensor unit clamped to a matte white mobility cane shaft, rendered with a see-through housing.

SUBJECT: The compact rounded sensor unit, about 12 cm long, shown in three-quarter view. Its bead-blasted warm graphite aluminium shell is rendered as frosted translucent glass so the inside is visible: the larger main compute board with its copper heat spreader, a flat battery pack, camera and depth-sensor modules behind the smoked front glass. One component is emphasised: a small, separate safety-core board with its own microcontroller, its own two round ultrasonic sensors and its own thin wiring path running up to the grip sleeve, rendered fully opaque and crisply lit, while everything else is softly ghosted at lower contrast. Above the unit, the lower part of the matte charcoal silicone grip sleeve and its satin aluminium collar are visible, joined by a short black braided cable.

STYLE: Seamless warm light-grey background (around #E8E6E2), soft studio lighting, true-to-life colour. Emphasis comes from opacity and contrast only, not from glow or colour. Precise, calm, trustworthy. High-end 3D product visualisation, 8K detail.

No text, no labels, no callout lines, no logos.
```

### 09 — Lifestyle: walking a familiar route

**Use:** Route Memory and Guide Notes story, or section breaks. **Aspect:** 21:9 or 16:9.

```text
Ultra-realistic editorial photograph in a premium Apple-campaign style: a blind person in their thirties walks confidently along a quiet tree-lined European street in soft early-evening light, using a long white mobility cane fitted with a small, discreet device near the grip: a matte charcoal grip sleeve and a compact warm graphite aluminium sensor unit just below it. A single small wireless earbud sits in one ear; the other ear is open. They wear well-fitted, understated clothing in muted neutral tones. Their posture is relaxed and purposeful; the cane sweeps ahead with its white rolling tip on the paving stones.

COMPOSITION: Medium-wide shot from a slight front three-quarter angle at eye level; the person sits on the left third, with the street, warm shopfront lights and a low-hanging tree branch ahead in soft focus. The device is visible but small: it is part of the scene, not an advert.

LIGHT AND GRADE: Golden-hour backlight with soft natural fill, gentle contrast, natural skin tones, subtle film grain. Authentic, dignified, independent; not staged, not pitying.

CAMERA: 50 mm lens, f/2.8, natural perspective. Photorealistic.

No text, no logos, no sunglasses cliché.
```

### 10 — Dark variant of the hero

**Use:** a dark section or social media, if the site uses a dark band. **Aspect:** 16:9.

```text
Ultra-realistic studio product photograph, Apple-launch style, of the L.I.G.H.T concept device mounted on a white mobility cane, on a deep charcoal background.

PRODUCT: A slim matte charcoal soft-touch silicone grip sleeve with a thin satin titanium-grey aluminium collar carrying four small tactile buttons; directly below it, a compact rounded sensor unit in bead-blasted warm graphite anodised aluminium, clamped to the matte white shaft with a tool-free aluminium quick-release clamp; its smoked black glass window faces forward and slightly up, and a tiny pinhole light glows soft white. A short black braided cable joins the two parts. The white cane shaft, with its black elastic wrist loop at the top, runs diagonally through the frame.

LIGHTING AND SET: A seamless deep charcoal background (around #1C1C1E), never pure black; a single large overhead softbox and two thin strip lights tracing the silhouette in clean white rim light; the white cane shaft glows softly in the light. No coloured light.

CAMERA: 100 mm lens, f/8, tack sharp, true-to-life colour, high-end commercial product photography, 8K detail.

No text, no logos, no labels.
```

## 5. Getting consistent, high-end results

- **Generate 01 first.** Once you have a hero you like, use it as the image or style reference for every other prompt (image-to-image, "style reference", "character/object reference", depending on the model). This keeps the shape, colour and materials the same across renders.
- **Exploded views are the hardest.** Generate several and pick the cleanest. Count the parts and check the axis is straight. If the model crowds the parts, delete items from the list rather than accepting a messy result.
- **Braille, text and small details come out garbled.** Fix the button dot patterns and any wordmark in retouching, or keep them out of focus.
- **Check the cane on every render.** White shaft, red band near the bottom, rolling ball tip, wrist loop at the top, nothing cut or bent. Cane users, O&M instructors and anyone who knows one will notice a wrong cane.
- **Check hands.** Five fingers, and the index finger extended along the grip (the standard cane grip).
- **Delivery.** Ask for the largest size the model offers. The site needs 2400 px wide or more for heroes, exported later as AVIF/WebP. Keep the backdrop colour the same across renders so they sit on the page without visible seams.
- **Model-specific flags** (optional). Midjourney: append `--ar 16:9 --style raw` and use the current version. For models with a separate negative-prompt field, paste §2 there.
- **Once renders are chosen:** record them in the design brief ([03_design_brief.md](03_design_brief.md) §9), and caption each on the site as a concept visual.
