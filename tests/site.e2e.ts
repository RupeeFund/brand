import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const exports: string[] = JSON.parse(readFileSync("assets.json", "utf8")).exports.map(
  ({ output }: { output: string }) => output.replace(/^exports/, ""),
);
const sections = ["name", "logo", "icon", "colour", "type", "voice", "downloads"];

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

test("shows every section and resolves every nav link", async ({ page }) => {
  await page.goto("/");

  for (const id of sections) {
    await expect(page.locator(`#${id} h2`)).toBeVisible();
  }
  for (const href of await page
    .locator(".nav-links a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")))) {
    await expect(page.locator(href!)).toHaveCount(1);
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
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});

test("fits the viewport width", async ({ page }) => {
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});
