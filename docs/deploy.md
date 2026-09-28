# Deployment

The site at `brand.rupeefund.org` is an assets-only Cloudflare Worker, `brand`. `wrangler.jsonc` holds its configuration.

## 1. The branch model

| Branch       | Site                                                | Trigger   |
| ------------ | --------------------------------------------------- | --------- |
| `main`       | `brand.rupeefund.org`                               | each push |
| other branch | a Preview, `<branch>-brand.<subdomain>.workers.dev` | each push |

`main` is the only branch that goes out. Unlike the site repository, this repository has no `live` branch.

Set these values in Cloudflare Workers Builds:

- Production branch: `main`.
- Build command: `pnpm run build`.
- Deploy command: `npx wrangler deploy`.
- Preview builds: on. Preview command: `npx wrangler preview`.

Workers Builds adds the Preview URL to the pull request as a comment. A `workers.dev` Preview sends `X-Robots-Tag: noindex`, so search engines do not index it.

Do not run `wrangler deploy` by hand. It uploads whatever `dist` holds.

## 2. How to prove a change

```sh
pnpm check        # masters, fidelity, contrast
pnpm build        # exports, then the site in dist
pnpm test:e2e     # Playwright against the local build
pnpm wrangler dev # serve dist as the Worker does
```

Then open a pull request and check its Preview URL.

## 3. How to release

Merge the pull request into `main`. The push to `main` deploys the site.

To go back, run `pnpm wrangler rollback`. Then add a revert commit to `main`. If you do not, the next push to `main` deploys the bad change again.
