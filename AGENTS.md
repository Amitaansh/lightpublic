# AGENTS.md — light-public

Read this before doing anything in this repository. It tells you what this repo is for, what has already been decided, and what you must not put on a public website.

## 1. Purpose of this repository

`light-public` is the **public product showcase website for L.I.G.H.T**. It will be deployed on Vercel.

The site has one job: help **investors, and anyone curious about the product**, understand quickly and accurately what L.I.G.H.T is, why it matters, and why it can be trusted. It is a product-showcase site in the style of a polished MVP launch page. It is **not** the interactive proof-of-concept app; that lives in the sibling folder `../light-guidance-experience`.

This file exists so that any agent picking up the work starts from the same decisions instead of re-deriving them from older material, much of which describes a product that has since changed.

## 2. Current status (2026-11-02)

- **Site v0.1 is built** (11-02), after the founder approved docs 03–05. Next.js app in this folder; how to run it is in the [README](README.md). It is **not deployed**: deploying is outward-facing, so ask first.
- Before publishing: the open items flagged by `npm run check:content` (unchecked market sources, unconfirmed milestones, the About-page draft, the prototype URL) and the open questions in [design brief §11](docs/03_design_brief.md#11-open-questions-for-the-founder). `STRICT=1 npm run check:content` must pass.
- The repo contains this file, a README, the site code, and these docs:
  - [docs/01_prd.md](docs/01_prd.md): Product Requirements v0.7. **Source of truth for what the product is.**
  - [docs/02_trd.md](docs/02_trd.md): Technical Requirements v0.6. Source of truth for how it works.
  - [docs/03_design_brief.md](docs/03_design_brief.md): UI/UX design brief v0.2. The founder briefed the visual direction on 11-02 ("Blue Signal").
  - [docs/04_site_structure.md](docs/04_site_structure.md): pages, chapters, draft copy, 3D baton choreography, contact flow.
  - [docs/05_site_components.md](docs/05_site_components.md): component inventory, tokens, 3D model spec, state, tests.
- **Next step:** the founder reviews the built site, answers the open questions, and supplies the missing content. Then the prototype deploy, then the site deploy.
- Order of work: **design direction → content and renders → build → deploy.**

## 3. The product in one minute

L.I.G.H.T (*LIDAR Integrated Guidance & Handheld Tracker*) is a sensing and guidance **add-on for the white cane**, for blind and visually-impaired people.

- **Form:** **one baton** (about 20 cm × 38 mm, the original L.I.G.H.T form) with an ergonomic grip and a **clip on its body** that attaches it to a white cane. It sits on top of the cane, sensor head toward the tip, and the hand holds the baton grip with the cane's grip nested beneath. Weight target **[OPEN]** (the old 750–800 g budget doesn't fit this size).
- **What it adds to the cane:** warning of obstacles at a distance and **overhead** (which a cane cannot reach), alerts for **fast-approaching threats** ("STOP" plus a strong whole-grip vibration), and **object identification** on request through a single earbud.
- **360° haptic feedback:** a ring of vibration motors around the grip. Where it vibrates = where the obstacle is; how strongly = how close.
- **Reliability first:** an **independent safety core** (its own chip, sensors and battery reserve) keeps basic obstacle warnings working even if the main AI system fails. The system steps down in clear levels and **never fails silently**. If all electronics fail, the user still holds a working cane.
- **Guide Notes:** a sighted assistor (instructor, family, friend) records spoken instructions while walking with the user. The user replays them later, on demand or automatically at the place they were recorded.
- **Route Memory:** the device learns routes the user walks often (taught, or noticed automatically and confirmed), remembers fixed obstacles along them, warns early, and lets the user rehearse a route at home. **Everything works offline.**
- **Privacy:** camera and microphone are processed on the device; recordings and route history stay on the device by default.

Stage: **concept.** A software prototype exists; no hardware has been built.

## 4. Decisions for the website (from the founder, 2026-10-31)

| Topic | Decision |
|---|---|
| Audience | Investors, and anyone who wants to learn what the product is |
| Hosting | Vercel, project name **beyourlight**. No custom domain yet |
| Visual style | **Start fresh.** Do not reuse the pitch deck's style (near-black, gold, IBM Plex) or the POC app's style (Inter, cyan/amber). The founder will brief the style |
| Founders | **May be shown** by name and role (see §6) |
| Partners / research organisations | **Do not mention any**, by name or logo, anywhere on the site |
| Market numbers | **May be shown**, each with its source (see §6) |
| Renders | **New renders are needed** of the cane-mounted form. Prompts: [docs/image-prompts.md](docs/image-prompts.md); animation briefs: [docs/animations.md](docs/animations.md) |
| Device form for renders (11-01) | The **original L.I.G.H.T baton**, form kept mostly the same, with a more ergonomic grip and a **clip on the baton body** that attaches it to a white cane. The hand holds the baton grip. **Neutral colourway**: graphite grey, soft-white light ring; no cyan or amber. Applied to PRD v0.7 and TRD v0.6 |
| Render look (11-01) | Renders keep the **photographic style of the existing `light-v2-*` renders**: low-key studio, dark charcoal paper backdrop, one soft key light falling into shadow, crisp rim. This is about the renders; the site's own visual style is still to be briefed |
| Feature names | "Guide Notes" and "Route Memory" are final |
| Site visual direction (11-02) | Palette **`#FFFFFF` / `#233CCD` / `#DBFE1B`**: white and blue primary, chartreuse as the signal colour. References and rules in [docs/03_design_brief.md](docs/03_design_brief.md). Effects from klimtwine, teatika and kononenko are recreated in our own code, never copied. Fonts: Archivo and Hedvig Letters Serif (free) |
| Pages (11-02) | Three: a hero page with everything, a contact pop-up, and an About page |
| 3D centrepiece (11-02) | Rich interactive WebGL, as progressive enhancement. The baton is **modelled in code** (procedural parts). It **floats free** as the centrepiece and **clips onto a cane** in the cane chapter. The copy never mentions standalone use |
| Contact (11-02) | Pop-up form: **email + optional message, sent to the founders' inbox**. Nothing stored, no cookies |
| Prototype link (11-02) | The site links to the POC app (`../light-guidance-experience`), which needs its own deployment first |

## 5. Rules for anything public

**Never:**
- Claim a manufactured, tested, certified or clinically validated device. Say "concept" plainly.
- Say or imply that L.I.G.H.T **replaces the white cane**, or that a standalone device is the end goal. That goal is internal only.
- Name or show logos of Red Cross, SAVH, NUS Student Accessibility Unit, or any other organisation as a partner, tester or supporter. Older materials do; ignore them.
- Use the old standalone-baton renders as if they show the current product.
- Publish a figure without a source, or a target without labelling it a target.

**Ask the founder first before:**
- Mentioning **standalone use** at all. The unit can detach and work on its own, but whether the site mentions it is undecided.
- Publishing **pricing, BOM, margin, LTV or revenue projections** (they exist in the older pitch material but are not approved for the site).
- Naming **competitors** or showing competitor prices.
- Publishing **contact details** (emails, phone). Not decided yet.
- Adding analytics, forms, or anything that collects data. **Exception (11-02):** the contact pop-up (email + optional message to the founders' inbox) is approved.

**Always:**
- Make the site itself exemplary on accessibility: **WCAG 2.2 AA minimum**, full keyboard and screen-reader use, visible focus, `prefers-reduced-motion` respected, no autoplaying sound, captions or transcripts for any video, meaningful alt text. The audience includes blind people; the site is part of the proof.
- Label renders as concept visuals.
- Keep it fast and light: static output, optimised images, minimal JavaScript.
- Keep it privacy-respecting: no cookies by default; if analytics is approved, use a cookie-free option so no consent banner is needed.

## 6. Approved facts you may use

**Founders**
- **Amitaansh Grover** — Co-founder · Electrical Engineering, NUS. Hardware, embedded systems, sensing, power, robotics software (NUS Mars Rover Team).
- **Shrishti Bothra** — Co-founder · Business Analytics, NUS. Data and analytics, product, frontend design, pricing and go-to-market.
- Confirm current year of study, photos and exact titles with the founder before publishing.

**Market figures** (from the earlier pitch brief, `../docs/07_vip_pitch_design_prompt.md`). Re-check each against its source before publishing.

| Figure | Value | Source |
|---|---|---|
| Global assistive technology for the visually impaired | $6.87B (2025) → $12.71B (2030), 13.1% CAGR | The Business Research Company, *Assistive Technologies for Visually Impaired Global Market Report 2026* |
| Western Europe share | $1.56B (2025) | Same report |
| Blind people in Europe | 2.55M | WHO, via European Blind Union |
| Share of severely visually impaired using no mobility aid (France) | 59% | Étude Homère, via Institut de la Vision |
| Western European blind adults who travel with a mobility aid | ~615,000 | Derived: 2.55M × ~70% Western Europe/EEA × 41% |
| Guide dog lifetime cost | ~€43,500 | Scale Dogs (BE) |

The pitch brief also gives "~€250M/yr" next to the 615,000 users. That number comes from multiplying by a **target** device price, so either label it as derived from a target price or leave it out.

## 7. Material you can adapt (outside this repo)

| Where | What | Caveat |
|---|---|---|
| `../docs/01_concept_brief.md` | Problem statement (what the cane cannot do), personas, principles | **Out of date:** still says "fully replace the cane" and "no prototype". The PRD here wins |
| `../docs/07_vip_pitch_design_prompt.md` | Market sizing, team, milestones narrative | Mentions partner organisations: do not reuse those parts |
| `../poc/` | Pitch deck (.pptx), product brief PDF, earlier HTML pages | Old standalone-baton positioning |
| `../light-guidance-experience/public/assets/device/` | Device renders (`light-v2-*` are the newest) | Show the baton's **form**, which is kept (11-01), but in the old colours and without the cane clip. Use as **reference images** for new renders, not on the site as-is |
| `../light-guidance-experience/public/media/` | Five "day in the life" frames | Show the old baton; check with the founder before use |
| `../light-guidance-experience/src/content/product.ts` | Device and story copy | Written for the old baton; adapt, don't copy |
| `../light-guidance-experience` (running app) | Live detection, haptic ring, STOP alert | Good source for screen recordings of the working software |

## 8. Working in this environment

- **Windows 11.** Shells: PowerShell 5.1 and Git Bash. In Node scripts, never `spawn("npm", ...)`; npm is a shell script on Windows. Run tool binaries through `process.execPath`, as `../light-guidance-experience/scripts/local-processes.mjs` does.
- Line endings are normalised to LF by `.gitattributes`.
- **Git:** branch `main`, no remote yet. Commit messages follow Conventional Commits (`docs:`, `feat:`, `fix:`). Commit only when the founder asks.
- **Stack (11-02):** Next.js 16 (App Router), React 19, TypeScript **6** (TypeScript 7 has no JS API and breaks `next build`; keep `typescript@^6`), React Three Fiber + drei + three, GSAP, Lenis, zustand, Tailwind 4, Resend, zod. Deploy target: Vercel.
- **Copy lives in `content/*.ts`.** Never put public text in components. `npm run check:content` enforces §5.
- **After every `npm run build`, restart `next start`.** A server left running on an older build makes client navigation fall back to full page reloads, which looks like a bug but isn't one.
- **Playwright:** `@playwright/test` 1.64 expects a browser build that may not be installed. Either run `npx playwright install chromium` (a download: ask first), or point `PLAYWRIGHT_CHROMIUM_PATH` at an installed Chromium (for example `%LOCALAPPDATA%\ms-playwright\chromium-1228\chrome-win64\chrome.exe`).
- **Posters** (static tier and gallery renders) are generated from the 3D scene: `npm run build && npm run posters`. Re-run after changing `three/rig/choreography.ts` or the baton model.
- Keep [docs/01_prd.md](docs/01_prd.md) and [docs/02_trd.md](docs/02_trd.md) in step with any product decisions the founder makes in later sessions. Use their tags (`[OPEN]`, `[DECIDED MM-DD]`, `[REC]`, `[ASSUMPTION]`) and keep requirement IDs stable.
