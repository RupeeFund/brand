import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const exports: string[] = JSON.parse(readFileSync("assets.json", "utf8")).exports.map(
  ({ output }: { output: string }) => output.replace(/^exports/, ""),
);

test("loads only same-origin files and logs no errors", async ({ page, baseURL }) => {
  const origins = new Set<string>();
  const errors: string[] = [];
  page.on("request", (request) => origins.add(new URL(request.url()).origin));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  expect([...origins]).toEqual([new URL(baseURL!).origin]);
  expect(errors).toEqual([]);
});

test("links every section from the nav", async ({ page }) => {
  await page.goto("/");

  const sections = await page
    .locator("main section[id]")
    .evaluateAll((nodes) => nodes.map((node) => `#${node.id}`));
  const links = await page
    .locator(".nav-links a")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
  expect(links).toEqual(sections);
  for (const id of sections) {
    await expect(page.locator(`${id} h2`)).toBeVisible();
  }
});

test("serves every download and head icon", async ({ page, request }) => {
  await page.goto("/");
  const downloads = await page
    .locator("a[download]")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  const icons = await page
    .locator("link[rel*=icon]")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));

  expect(downloads.toSorted()).toEqual(exports.toSorted());
  for (const path of [...downloads, ...icons]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect((await response.body()).length, path).toBeGreaterThan(0);
  }
});

test("serves the design tokens", async ({ request }) => {
  const response = await request.get("/tokens.json");

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(JSON.parse(readFileSync("tokens/tokens.json", "utf8")));
});

test("loads every image with alt text", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const images = await page.locator("img").evaluateAll((nodes) =>
    nodes.map((node) => {
      const image = node as HTMLImageElement;
      return { src: image.src, alt: image.getAttribute("alt"), width: image.naturalWidth };
    }),
  );
  for (const image of images) {
    expect(image.alt, image.src).not.toBeNull();
    expect(image.width, image.src).toBeGreaterThan(0);
  }
});

test("does not animate with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const animated = await page.evaluate(
    () =>
      [...document.querySelectorAll("*")].filter(
        (node) => getComputedStyle(node).animationName !== "none",
      ).length,
  );
  expect(animated).toBe(0);
  const transitioned = await page.evaluate(
    () =>
      [...document.querySelectorAll("*")].filter((node) =>
        getComputedStyle(node)
          .transitionDuration.split(", ")
          .some((duration) => duration !== "0s"),
      ).length,
  );
  expect(transitioned).toBe(0);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});

test("fits the viewport width", async ({ page }) => {
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test("shows the not-found page", async ({ page }) => {
  const response = await page.goto("/no-such-page");

  expect(response?.status()).toBe(404);

  await expect(page.locator("h1")).toHaveText("This page does not exist.");
  await expect(page.locator("a[href='/']")).toBeVisible();
});

test("sends the security headers", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["strict-transport-security"]).toContain("max-age=");
});
