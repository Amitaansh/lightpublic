# light-public

The public product showcase website for **L.I.G.H.T**: a sensing and guidance add-on for the white cane.

> **Status:** Site v0.2 "Night" (2026-11-02): a dark, scroll-driven 3D film with no visible copy. See [docs/06_film.md](docs/06_film.md). `main` deploys to Vercel.
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

### Stills

One still per scene, for motion off, reduced motion, no WebGL and no JavaScript, rendered from the 3D scene:

```bash
npm run build && npm run posters
```

Re-run after changing `three/film/shots.ts` or the baton model. To look at any moment of the film, open `/?t=0.42` (fraction of the film).

## How it's put together

| Path | What it is |
|---|---|
| `app/` | Pages: `/` (the film), `/about`, `/contact` (a dialog over the page via an intercepting route; a full page on direct load), the contact Server Action, `/poster` (frozen frames, only with `POSTER_MODE=1`) |
| `content/film.ts` | The ten scenes: scroll lengths and the screen-reader description of each |
| `three/film/` | `shots.ts` (the film as a function of scroll position), `Director.tsx` (applies it every frame), `world.ts` (obstacles, motors, route) |
| `three/baton/`, `three/hand/`, `three/cane/` | The procedural baton (shells, textures, detailed internals), the hand rig, the cane |
| `three/Stage.tsx`, `three/Effects.tsx`, `three/scenes/` | Lights and shadows, post-processing, the haptic halo, obstacles, route, STOP, dust |
| `components/film/`, `components/shell/`, `components/contact/`, `components/ui/` | The scroll track and title cards; header, loader, cursor, smooth scroll; the contact dialog and form; buttons |
| `public/models/` | The hand model (MIT, see `LICENSE-hand.md`) |
| `public/posters/` | Generated scene stills |
| `scripts/`, `tests/` | Content check, still renderer; Playwright specs |

## Before publishing

- **About:** replace the "Why we started" draft with the founders' own words (`content/about.ts`); confirm founder titles.
- **Email:** set up Resend (see `.env.example`; without a custom domain, the test sender only delivers to the account owner's address).
- `STRICT=1 npm run check:content` must pass.

## Docs

| Path | What it is |
|---|---|
| [AGENTS.md](AGENTS.md) | Handoff for agents: purpose, decisions, public-content rules, approved facts, working notes. `CLAUDE.md` imports it |
| [docs/01_prd.md](docs/01_prd.md) | Product Requirements, v0.7 |
| [docs/02_trd.md](docs/02_trd.md) | Technical Requirements, v0.6 |
| [docs/03_design_brief.md](docs/03_design_brief.md) | Website UI/UX design brief (v0.1, "Blue Signal"); its accessibility and content rules still apply |
| [docs/04_site_structure.md](docs/04_site_structure.md) | Site structure (v0.1); the contact flow still applies |
| [docs/05_site_components.md](docs/05_site_components.md) | Site components (v0.1) |
| [docs/06_film.md](docs/06_film.md) | **v0.2 "Night"**: the film, its scenes, how it's built. Supersedes 03–05 where they differ |
| [docs/image-prompts.md](docs/image-prompts.md) | Prompts for concept renders (still assume the dark backdrop; a light variant is a follow-up) |
| [docs/animations.md](docs/animations.md) | Animation briefs (A1–A3 are now real-time 3D) |

## Rules for public content

- Concept stage is stated plainly, and renders are labelled as concept visuals.
- Market figures carry their sources; product numbers are labelled as targets.
- No partner or research-organisation names or logos.
- The site does not say the product replaces the cane, and does not mention standalone use.
- The film has no visible copy, so every scene's description must stay complete in `content/film.ts` (screen readers rely on it).
- No personal contact details without the founders' sign-off.

## Related folders (not in this repo)

- `../light-guidance-experience`: the interactive proof-of-concept app (live detection, map walk, device views).
- `../docs`: original Concept Brief, PRD v0.5, TRD v0.4, research plan, pitch brief.
- `../poc`: pitch deck, product brief, earlier HTML demos.
