import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:4322";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "no-js", use: { ...devices["Desktop Chrome"], javaScriptEnabled: false } },
  ],
  webServer: {
    command: "pnpm preview --ignore-lock --port 4322",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
