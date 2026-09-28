import { copyFileSync } from "node:fs";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://brand.rupeefund.org",
  publicDir: "exports",
  integrations: [
    {
      name: "headers",
      hooks: {
        "astro:build:done": ({ dir }) => copyFileSync("src/_headers", new URL("_headers", dir)),
      },
    },
  ],
});
