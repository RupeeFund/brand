<picture>
  <source media="(prefers-color-scheme: dark)" srcset="exports/lockup-dark.svg" />
  <img src="exports/lockup-light.svg" alt="The Rupee Fund" width="230" />
</picture>

# The Rupee Fund brand

The brand guidelines and the files are at [brand.rupeefund.org](https://brand.rupeefund.org). This repository holds the sources of that website.

## Files

| Path                 | Content                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `masters/`           | The vector masters of the logo and the icons                              |
| `tokens/tokens.json` | The colours, in the W3C design tokens format                              |
| `assets.json`        | The list of exported files                                                |
| `exports/`           | The exported files. The build writes them. Do not edit them.              |
| `src/`               | The brand website. `src/fonts/` holds Inter 4.1 and its licence (OFL 1.1) |
| `logo/`              | The earlier logo, the reference for the fidelity check                    |

## Commands

Use Node 24 and pnpm.

```sh
pnpm install
pnpm dev          # the website on your machine
pnpm check        # the masters, the logo fidelity and the colour contrast
pnpm build        # the exports, then the website in dist/
pnpm test:e2e     # the browser tests
```

No CI runs these checks. Run `pnpm check`, `pnpm build` and `pnpm test:e2e` before you push. `docs/deploy.md` tells how the website deploys.

## Licence

The assets are under [CC BY-ND 4.0](LICENSE). The scripts in `scripts/` are under the [MIT licence](scripts/LICENSE).
