# AGENTS.md

The brand website, `src/pages/index.astro`, is the single source of truth for the brand rules. Write each rule there and nowhere else. `README.md` lists the files and the commands.

## Scope

- A rule on the brand website applies to every surface of The Rupee Fund. A rule, a sample or a file that one website or app alone needs stays in the repository of that surface.
- The layout of this page is its own. It is not a template for other surfaces.

## Design

- Keep the look. Change it only for a defect, a new rule or a request from the maintainer.
- Reuse a pattern before you add one:
  - `Section.astro`: one numbered section. Tones alternate paper and white. Voice is ink.
  - `.demo`: a paper panel with a live sample above a `.rules` list.
  - `.rules`: a term and one or two sentences. A list of 3, 4 or 6 items fills its rows. Put a list of another count in `.split`: its subhead beside a list of one column.
  - `.swatch`, `.pair`, `.download`, `.voice`, `.card-sample`: the patterns of their sections.
- Line up content with the nav. It starts and ends on `--gutter`.
- Put a card on the other light tone: paper on white, white on paper.
- Take every colour from a token, `var(--color-*)`. Add each text pair that the page shows to `scripts/colour.mjs`.
- Keep the signature motion: the logo build in the hero, the section marks, the scroll reveal, the button lift, and the card lift when the pointer is on a link in the card. Put all motion under `prefers-reduced-motion: no-preference`. A hover takes 300 ms or less.
- The page works without JavaScript.
- Check each visual change in a browser at 390 and 1440 px, then show it to the maintainer as a page.

## Assets

- Change a master, a token or `assets.json`, then run the build and commit the result. The build owns `exports/`.
- Outline all text in a master. A master holds only paths and token colours: no `<text>`, no `<image>`.
- Redraw the current logo. Keep its design. `logo/logo-rupee-fund.png` is the fidelity reference for `scripts/fidelity.mjs`.
- Use only fonts under the OFL or an equal licence. Record the source and the licence of each glyph.
- Self-host every file. Load nothing from a Google service.

## Writing

- Page copy follows the Voice section of the page.
- Write docs in ASD-STE100.
