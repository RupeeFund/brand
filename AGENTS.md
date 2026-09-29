# AGENTS.md

The brand website, `src/pages/index.astro`, is the single source of truth for the brand rules. Write each rule there and nowhere else. `README.md` lists the files and the commands.

## Rules

- Scope: a rule on the brand website applies to every surface of The Rupee Fund. A rule, a sample or a file that only one website or app needs stays in the repository of that surface.
- Change a master, a token or `assets.json`, then run the build and commit the result. The build owns `exports/`.
- Outline all text in a master. A master holds only paths and token colours: no `<text>`, no `<image>`.
- Redraw the current logo. Keep its design. `logo/logo-rupee-fund.png` is the fidelity reference for `scripts/fidelity.mjs`.
- Use only fonts under the OFL or an equal licence. Record the source and the licence of each glyph.
- Self-host every file. Load nothing from a Google service.
- Show each visual change to the maintainer as a page in a browser. Run `pnpm dev`.
- The site works without JavaScript. Motion is CSS only.
- Write docs in ASD-STE100.
