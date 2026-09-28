# Deployment

The site at `brand.rupeefund.org` is an assets-only Cloudflare Worker, `rupeefund-brand`. `wrangler.jsonc` holds its configuration.

## 1. The branch model

| Branch | Site                  | Trigger                 |
| ------ | --------------------- | ----------------------- |
| `main` | none                  | never                   |
| `live` | `brand.rupeefund.org` | the maintainer, by hand |

Cloudflare Workers Builds watches `live`. Set its build command to `pnpm run build` and its deploy command to `npx wrangler deploy`. Keep non-production branch builds off.

Do not run `wrangler deploy` by hand. It uploads whatever `dist` holds.

## 2. How to prove a change

```sh
pnpm check        # masters, fidelity, contrast
pnpm build        # exports, then the site in dist
pnpm test:e2e     # Playwright against the local build
pnpm wrangler dev # serve dist as the Worker does
```

## 3. How to promote

Make sure the checks pass on the commit. Then fast-forward `live`:

```sh
git fetch origin
git push origin <sha>:live
```

Do not force the push. To go back, run `pnpm wrangler rollback`.
