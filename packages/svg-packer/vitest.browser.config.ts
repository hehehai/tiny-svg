import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/*.browser.ts"],
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
