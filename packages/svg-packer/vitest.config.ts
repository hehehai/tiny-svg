import { isCI } from "std-env";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: [
      {
        test: {
          include: ["test/*.test.ts"],
          name: "node",
          environment: "node",
        },
      },
      {
        test: {
          setupFiles: "./dist/index.browser.js",
          include: ["test/*.browser.ts"],
          name: "browser",
          browser: {
            enabled: !isCI,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
