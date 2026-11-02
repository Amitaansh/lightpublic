# AGENTS.md — light-public

Read this before doing anything in this repository. It tells you what this repo is for, what has already been decided, and what you must not put on a public website.

## 1. Purpose of this repository

`light-public` is the **public product showcase website for L.I.G.H.T**. It will be deployed on Vercel.

The site has one job: help **investors, and anyone curious about the product**, understand quickly and accurately what L.I.G.H.T is, why it matters, and why it can be trusted. It is a product-showcase site in the style of a polished MVP launch page. It is **not** the interactive proof-of-concept app; that lives in the sibling folder `../light-guidance-experience`.

This file exists so that any agent picking up the work starts from the same decisions instead of re-deriving them from older material, much of which describes a product that has since changed.

## 2. Current status (2026-11-02)

- **Site v0.2 ("Night") is built** (11-02). The founder rejected v0.1's blue/white chapter page the same day and asked for a dark, cinematic, scroll-driven **film** with no visible copy. The design docs 03–05 describe v0.1; [docs/06_film.md](docs/06_film.md) describes v0.2 and **supersedes them where they differ**. Next.js app in this folder; how to run it is in the [README](README.md). `main` deploys to Vercel production: ask before pushing.
- Before publishing: the open items flagged by `npm run check:content` (unchecked market sources, unconfirmed milestones, the About-page draft, the prototype URL) and the open questions in [design brief §11](docs/03_design_brief.md#11-open-questions-for-the-founder). `STRICT=1 npm run check:content` must pass.
- The repo contains this file, a README, the site code, and these docs:
  - [docs/01_prd.md](docs/01_prd.md): Product Requirements v0.7. **Source of truth for what the product is.**
  - [docs/02_trd.md](docs/02_trd.md): Technical Requirements v0.6. Source of truth for how it works.
  - [docs/03_design_brief.md](docs/03_design_brief.md): UI/UX design brief for v0.1 ("Blue Signal"). Superseded in look and structure by docs/06; its accessibility, privacy and content rules still apply.
  - [docs/06_film.md](docs/06_film.md): **v0.2 "Night"**: palette, fonts, the ten scenes, the hand, lights-out, how the film is built.
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
| Visual style | **Start fresh.** Do not reuse the pitch deck's style (near-black, gold, IBM Plex) or the POC app's style (Inter, cyan/amber). The founder will brief the style. **Updated 11-02:** the founder chose charcoal, white and cyan for v0.2 (see below); the POC's Inter and amber stay out |
| Founders | **May be shown** by name and role (see §6) |
| Partners / research organisations | **Do not mention any**, by name or logo, anywhere on the site |
| Market numbers | **May be shown**, each with its source (see §6) |
| Renders | **New renders are needed** of the cane-mounted form. Prompts: [docs/image-prompts.md](docs/image-prompts.md); animation briefs: [docs/animations.md](docs/animations.md) |
| Device form for renders (11-01) | The **original L.I.G.H.T baton**, form kept mostly the same, with a more ergonomic grip and a **clip on the baton body** that attaches it to a white cane. The hand holds the baton grip. **Neutral colourway**: graphite grey, soft-white light ring; no cyan or amber. Applied to PRD v0.7 and TRD v0.6. **Changed 11-02: the light ring glows cyan** |
| Render look (11-01) | Renders keep the **photographic style of the existing `light-v2-*` renders**: low-key studio, dark charcoal paper backdrop, one soft key light falling into shadow, crisp rim. This is about the renders; the site's own visual style is still to be briefed |
| Feature names | "Guide Notes" and "Route Memory" are final |
| Site visual direction (11-02, v0.2) | **Charcoal `#151515` (from the concept render), white text, cyan `#2EE6FF` accents.** Replaces v0.1's blue/white/chartreuse. Cinematic: real shadows, depth of field, bloom, grain, fog. Effects from the reference sites are recreated in our own code, never copied |
| Fonts (11-02, v0.2) | **Two only: Hedvig Letters Serif and Switzer** (Switzer as on the APRU site; the founder holds the licence; self-hosted from Fontshare). No third font |
| Home page (11-02, v0.2) | **A scroll-driven film, no visible copy.** Ten scenes: title, macro close-ups, a hand picks it up, how to hold it, clips onto a cane, vibration demo, Route Memory, STOP, exploded view with the fallback ladder, lights-out finale. Each scene's description is in the page for screen readers only. Timeline, market figures and the prototype link are **removed** from the site |
| Light ring colour (11-02) | **The ring glows cyan** (changes the 11-01 neutral colourway; renders and PRD follow) |
| Lights out (11-02) | Clicking the baton (or the header's Lights out button) turns the room lights off; the ring becomes the only light |
| Hand (11-02) | A rigged 3D hand (WebXR generic hand, MIT), posed in code, matte clay finish. It picks the baton up alone, then guides it onto a cane |
| 3D centrepiece (11-02) | The baton is **modelled in code** (procedural parts, procedural textures, detailed internals). Copy never mentions standalone use |
| Contact (11-02) | Pop-up form: **email + optional message, sent to the founders' inbox**. Nothing stored, no cookies |
| Pages (11-02, v0.2) | Home (the film), a contact pop-up, and an About page with purpose and founders only |

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
- **Stack (11-02):** Next.js 16 (App Router), React 19, TypeScript **6** (TypeScript 7 has no JS API and breaks `next build`; keep `typescript@^6`), React Three Fiber + drei + three, @react-three/postprocessing, GSAP (SplitText), Lenis, zustand, Tailwind 4, Resend, zod. Deploy target: Vercel (`vercel.json` pins the Next.js preset).
- **The film** is a pure function of scroll position: `three/film/shots.ts` (`frameAt(T)`), applied each frame by `three/film/Director.tsx`. Scene lengths and screen-reader text: `content/film.ts`. Debug any moment with `/?t=0.42` (fraction of the film).
- **Copy lives in `content/*.ts`.** Never put public text in components. `npm run check:content` enforces §5.
- **After every `npm run build`, restart `next start`.** A server left running on an older build makes client navigation fall back to full page reloads, which looks like a bug but isn't one.
- **Playwright:** `@playwright/test` 1.64 expects a browser build that may not be installed. Either run `npx playwright install chromium` (a download: ask first), or point `PLAYWRIGHT_CHROMIUM_PATH` at an installed Chromium (for example `%LOCALAPPDATA%\ms-playwright\chromium-1228\chrome-win64\chrome.exe`).
- **Posters** (one still per scene, for reduced motion, no WebGL and no JS) are rendered from the 3D scene: `npm run build && npm run posters`. Re-run after changing `three/film/shots.ts` or the baton model.
- **Only one `next dev` per folder** (Next 16). If the founder's dev server is running, don't kill it: iterate with `next build` + `next start` on another port.
- Keep [docs/01_prd.md](docs/01_prd.md) and [docs/02_trd.md](docs/02_trd.md) in step with any product decisions the founder makes in later sessions. Use their tags (`[OPEN]`, `[DECIDED MM-DD]`, `[REC]`, `[ASSUMPTION]`) and keep requirement IDs stable.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
