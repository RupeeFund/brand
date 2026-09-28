# AGENTS.md

This repository keeps the brand of The Rupee Fund: vector masters, design tokens, and the exports that the build makes from them.

## Layout

| Path                               | Content                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `masters/`                         | Hand-drawn SVG masters: `lockup.svg`, `mark.svg`, `mark-small.svg`      |
| `tokens/tokens.json`               | Design tokens in the W3C DTCG format                                    |
| `assets.json`                      | The export manifest: source, variant, size, format, output path         |
| `scripts/`                         | The build and the checks                                                |
| `exports/`                         | Build output only                                                       |
| `src/`                             | The brand website (Astro). `exports/` is its public directory.          |
| `tests/`                           | Playwright E2E tests for the site                                       |
| `docs/deploy.md`                   | How the site deploys to Cloudflare                                      |
| `GUIDELINES.md`                    | Usage rules                                                             |
| `logo/`, `icon/`, `illustrations/` | Seed copies from the site. `logo/logo-rupee-fund.png` is the reference. |

A directory comes into the tree with its first file.

## Rules

- Do not edit a file in `exports/`. Change a master, a token or `assets.json`, then run the build and commit the result.
- Outline all text in a master. A master holds no `<text>` and no `<image>`, and only token colours.
- Redraw the current logo. Do not redesign it. `logo/logo-rupee-fund.png` is the fidelity reference.
- Use only fonts under the OFL or an equal licence. Record the source and the licence of each glyph.
- Do not fetch or load anything from a Google service. Get Inter from the upstream `rsms/inter` release.
- Write "The Rupee Fund" in text. Use `₹fund` only in the logo. Use `RupeeFund` only for code, repositories and handles.
- Every credit and copyright line names FOSS United Community.
- The assets are under CC BY-ND 4.0 (`LICENSE`).
- Show each visual change to the maintainer as a page in a browser. Run `pnpm dev`.
- The site works without JavaScript. Motion is CSS only, and `prefers-reduced-motion: reduce` turns it off.
- Write docs in ASD-STE100.
