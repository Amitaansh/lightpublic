# AGENTS.md — light-public

Read this before doing anything in this repository. It tells you what this repo is for, what has already been decided, and what you must not put on a public website.

## 1. Purpose of this repository

`light-public` is the **public product showcase website for L.I.G.H.T**. It will be deployed on Vercel.

The site has one job: help **investors, and anyone curious about the product**, understand quickly and accurately what L.I.G.H.T is, why it matters, and why it can be trusted. It is a product-showcase site in the style of a polished MVP launch page. It is **not** the interactive proof-of-concept app; that lives in the sibling folder `../light-guidance-experience`.

This file exists so that any agent picking up the work starts from the same decisions instead of re-deriving them from older material, much of which describes a product that has since changed.

## 2. Current status (2026-10-31)

- **No site code exists yet. Do not write any until the founder approves a design direction.**
- The repo contains only this file, a README, and the product docs:
  - [docs/01_prd.md](docs/01_prd.md): Product Requirements v0.6 rev. 2. **Source of truth for what the product is.**
  - [docs/02_trd.md](docs/02_trd.md): Technical Requirements v0.5 rev. 2. Source of truth for how it works.
- **Next step:** the founder will open a session in this directory and give more context about the website (visual style, references, structure) and about the new renders needed. Your first deliverable is a **design brief** at `docs/03_design_brief.md` with 2–3 distinct visual directions for the founder to choose from. Ask questions before writing it if the founder's brief leaves gaps.
- Order of work: **design direction → content and renders → build → deploy.**

## 3. The product in one minute

L.I.G.H.T (*LIDAR Integrated Guidance & Handheld Tracker*) is a sensing and guidance **add-on for the white cane**, for blind and visually-impaired people.

- **Form:** a **haptic grip sleeve** that wraps the cane's grip, plus a **sensor unit** clamped just below it. Total weight budget up to 750–800 g (target).
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
| Renders | **New renders are needed** for the cane-mounted form with the grip sleeve. The founder will brief them |
| Feature names | "Guide Notes" and "Route Memory" are final |

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
- Adding analytics, forms, or anything that collects data.

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
| `../light-guidance-experience/public/assets/device/` | Device renders (`light-v2-*` are the newest) | Show the **old standalone baton**. Not the current product |
| `../light-guidance-experience/public/media/` | Five "day in the life" frames | Show the old baton; check with the founder before use |
| `../light-guidance-experience/src/content/product.ts` | Device and story copy | Written for the old baton; adapt, don't copy |
| `../light-guidance-experience` (running app) | Live detection, haptic ring, STOP alert | Good source for screen recordings of the working software |

## 8. Working in this environment

- **Windows 11.** Shells: PowerShell 5.1 and Git Bash. In Node scripts, never `spawn("npm", ...)`; npm is a shell script on Windows. Run tool binaries through `process.execPath`, as `../light-guidance-experience/scripts/local-processes.mjs` does.
- Line endings are normalised to LF by `.gitattributes`.
- **Git:** branch `main`, no remote yet. Commit messages follow Conventional Commits (`docs:`, `feat:`, `fix:`). Commit only when the founder asks.
- Framework and tooling are **not chosen yet**. Propose options in the design brief with a recommendation; the deploy target is Vercel.
- Keep [docs/01_prd.md](docs/01_prd.md) and [docs/02_trd.md](docs/02_trd.md) in step with any product decisions the founder makes in later sessions. Use their tags (`[OPEN]`, `[DECIDED MM-DD]`, `[REC]`, `[ASSUMPTION]`) and keep requirement IDs stable.
