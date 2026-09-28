<picture>
  <source media="(prefers-color-scheme: dark)" srcset="exports/lockup-dark.svg" />
  <img src="exports/lockup-light.svg" alt="The Rupee Fund" width="230" />
</picture>

# The Rupee Fund brand

This repository keeps the brand assets of The Rupee Fund and the brand website, [brand.rupeefund.org](https://brand.rupeefund.org). Read the guidelines and download the files there.

## Files

| Path                     | Content                                                      |
| ------------------------ | ------------------------------------------------------------ |
| `masters/`               | The vector masters: the logo, the icon and the small icon    |
| `tokens/tokens.json`     | The colours, in the W3C design tokens format                 |
| `assets.json`            | The list of exported files                                   |
| `exports/`               | The exported files. The build writes them. Do not edit them. |
| `src/`                   | The brand website                                            |
| `GUIDELINES.md`          | A summary of the usage rules                                 |
| `logo/`, `icon/`         | The earlier files from `rupeefund.org`, kept for reference   |
| `illustrations/seasons/` | The four season sprites, SVG                                 |

## Commands

Use Node 24 and pnpm.

```sh
pnpm install
pnpm dev          # the website on your machine
pnpm check        # the masters, the logo fidelity and the colour contrast
pnpm build        # the exports, then the website in dist/
pnpm test:e2e     # the browser tests
```

`docs/deploy.md` tells how the website deploys.

## Type

The logo and the site use [Inter](https://rsms.me/inter/). `src/fonts/` keeps `InterVariable.woff2` from the Inter 4.1 release, with its licence (SIL Open Font License 1.1).

## Licence

The assets are under [CC BY-ND 4.0](LICENSE). You can share them unchanged, with credit to FOSS United Community. Do not share a changed version.

The scripts in `scripts/` are under the [MIT licence](scripts/LICENSE).
