# light-public

The public product showcase website for **L.I.G.H.T**: a sensing and guidance add-on for the white cane that can also be used on its own.

> **Status:** Pre-design. There is no site code yet. The visual style, UX and page structure are agreed first, then the build starts.
> L.I.G.H.T is a concept-stage product. Nothing on the site may claim a manufactured, tested or certified device.

## What's here

| Path | What it is |
|---|---|
| [AGENTS.md](AGENTS.md) | Handoff for agents: purpose, decisions, public-content rules, approved facts, source material. `CLAUDE.md` imports it |
| [docs/01_prd.md](docs/01_prd.md) | Product Requirements, v0.7: the baton with a cane clip, reliability layer, Guide Notes, Route Memory |
| [docs/02_trd.md](docs/02_trd.md) | Technical Requirements, v0.6: one baton with a cane clip; two-half architecture with an independent safety core, Guide Notes and Route Memory design |
| [docs/03_design_brief.md](docs/03_design_brief.md) | Website UI/UX design brief: skeleton, waiting for the founder's references |
| [docs/image-prompts.md](docs/image-prompts.md) | Prompts for concept renders of the baton clipped onto a white cane (hero, in-hand, exploded views) |
| [docs/animations.md](docs/animations.md) | Briefs and prompts for product animations |

## Plan

1. **Design direction** — visual style, tone, page structure and key interactions (next).
2. **Content** — copy and assets adapted from the existing deck, docs and renders in the sibling folders `../docs`, `../poc` and `../light-guidance-experience/public`.
3. **Build** — a fast static site. WCAG 2.2 AA minimum, fully usable with a screen reader and keyboard.
4. **Deploy** — Vercel, project `beyourlight`.

## Rules for public content

- Concept stage is stated plainly, and renders are labelled as concept visuals.
- Market figures carry their sources; product numbers are labelled as targets.
- No partner or research-organisation names or logos.
- The site does not say the product replaces the cane.
- No personal contact details without the founders' sign-off.

## Related folders (not in this repo)

- `../light-guidance-experience` — the interactive proof-of-concept app (live detection, map walk, device views).
- `../docs` — original Concept Brief, PRD v0.5, TRD v0.4, research plan, pitch brief.
- `../poc` — pitch deck, product brief, earlier HTML demos.
