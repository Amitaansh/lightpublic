# light-public

The public product showcase website for **L.I.G.H.T**: a sensing and guidance add-on for the white cane.

> **Status:** Site v0.1 built (2026-11-02) from the approved design docs. Not deployed. Some content still needs the founders (see "Before publishing").
> L.I.G.H.T is a concept-stage product. Nothing on the site may claim a manufactured, tested or certified device.

## Run it

```bash
npm ci
npm run dev            # http://localhost:3000
```

Production build, the way Vercel runs it:

```bash
npm run build
npm start              # restart this after every build
```

### Contact form

The contact pop-up sends through [Resend](https://resend.com). Copy `.env.example` to `.env.local` and set `RESEND_API_KEY`, `CONTACT_TO` and `CONTACT_FROM` (set the same in the Vercel project). With `CONTACT_DRY_RUN=1` the form accepts messages and sends nothing.

### Checks

```bash
npm run check:content          # public-content rules (AGENTS.md §5); STRICT=1 before deploying
npm run typecheck
npm test                       # content check + Playwright (axe WCAG 2.2 AA, keyboard, no-JS, contact, mobile)
```

`npm test` builds nothing: run `npm run build` first. If Playwright's own browser isn't installed, set `PLAYWRIGHT_CHROMIUM_PATH` to an installed Chromium.

### Posters

The static tier (reduced motion, no WebGL, no JavaScript) and two gallery images are rendered from the 3D scene:

```bash
npm run build && npm run posters
```

Re-run after changing `three/rig/choreography.ts` or the baton model.

## How it's put together

| Path | What it is |
|---|---|
| `app/` | Pages: `/` (14 chapters), `/about`, `/contact` (a dialog over the page via an intercepting route; a full page on direct load), the contact Server Action, `/poster` (renders only with `POSTER_MODE=1`) |
| `components/shell/` | Header, comma index nav, Motion toggle, loader, cursor follower, page wipe, smooth scroll, chapter tracker, footer |
| `components/chapters/` | One component per chapter (docs/04 §3) |
| `components/ui/`, `components/contact/` | Buttons, labels, line reveal, counters, posters; the contact dialog and form |
| `content/` | **All public copy**, typed: chapters, ladder, parts, stats with sources, milestones, About, contact, gallery |
| `three/` | The persistent canvas: the procedural baton and cane, the scroll-driven rig and its keyframes, the dot field, sensing cones, lighting |
| `lib/` | Shared state (zustand), chapter registry, haptics maths, scroll |
| `scripts/` | `check-content.mjs`, `render-posters.mjs` |
| `tests/` | Playwright specs |
| `public/posters/`, `public/media/` | Generated posters and gallery images |

## Before publishing

`STRICT=1 npm run check:content` lists what's left. Currently:

- **Market figures:** re-check each source, then set `url` and `checked` in `content/stats.ts`.
- **Milestones:** confirm the "Now" item and add dates for "Next" and "Later" in `content/milestones.ts`.
- **About:** replace the "Why we started" draft with the founders' own words (`content/about.ts`); confirm founder titles and photos.
- **Prototype:** deploy `../light-guidance-experience` as its own Vercel project, then set `prototypeUrl` in `content/site.ts`. Optionally add `public/media/prototype.webp` (a screenshot), which chapter 11 picks up automatically.
- **Email:** set up Resend (see `.env.example`; without a custom domain, the test sender only delivers to the account owner's address).
- The rest of the open questions: [design brief §11](docs/03_design_brief.md#11-open-questions-for-the-founder).

## Docs

| Path | What it is |
|---|---|
| [AGENTS.md](AGENTS.md) | Handoff for agents: purpose, decisions, public-content rules, approved facts, working notes. `CLAUDE.md` imports it |
| [docs/01_prd.md](docs/01_prd.md) | Product Requirements, v0.7 |
| [docs/02_trd.md](docs/02_trd.md) | Technical Requirements, v0.6 |
| [docs/03_design_brief.md](docs/03_design_brief.md) | Website UI/UX design brief, v0.2: the "Blue Signal" direction |
| [docs/04_site_structure.md](docs/04_site_structure.md) | Site structure: pages, chapters, draft copy, baton choreography, contact flow |
| [docs/05_site_components.md](docs/05_site_components.md) | Site components, with build notes on where the build differs |
| [docs/image-prompts.md](docs/image-prompts.md) | Prompts for concept renders (still assume the dark backdrop; a light variant is a follow-up) |
| [docs/animations.md](docs/animations.md) | Animation briefs (A1–A3 are now real-time 3D) |

## Rules for public content

- Concept stage is stated plainly, and renders are labelled as concept visuals.
- Market figures carry their sources; product numbers are labelled as targets.
- No partner or research-organisation names or logos.
- The site does not say the product replaces the cane, and does not mention standalone use.
- No personal contact details without the founders' sign-off.

## Related folders (not in this repo)

- `../light-guidance-experience`: the interactive proof-of-concept app (live detection, map walk, device views).
- `../docs`: original Concept Brief, PRD v0.5, TRD v0.4, research plan, pitch brief.
- `../poc`: pitch deck, product brief, earlier HTML demos.
