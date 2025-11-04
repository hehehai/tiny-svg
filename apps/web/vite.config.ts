import { cloudflare } from "@cloudflare/vite-plugin";
import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { intlayer, intlayerMiddleware } from "vite-intlayer";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [
    contentCollections(),
    intlayer(),
    intlayerMiddleware(),
    tsconfigPaths(),
    tanstackStart({
      prerender: {
        // Enable prerendering for static pages
        // Cloudflare Pages will serve prerendered HTML files directly
        // Dynamic routes will fall back to SSR via Cloudflare Functions
        enabled: mode === "production",
        crawlLinks: true,
        // FIX: ignore worker error
        failOnError: false,

        // Callback when page is successfully rendered
        onSuccess: ({ page }) => {
          // biome-ignore lint/suspicious/noConsole: logging prerender progress
          console.info(`✓ Prerendered ${page.path}`);
        },
      },
      sitemap: {
        host: "https://tiny-svg.actnow.dev",
      },
    }),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
    mode === "production" &&
      cloudflare({
        viteEnvironment: { name: "ssr" },
        persistState: true,
      }),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Monaco Editor - very large dependency (~500KB)
          if (
            id.includes("@monaco-editor/react") ||
            id.includes("monaco-editor")
          ) {
            return "monaco";
          }
          // Prettier - large dependency (~1.2MB with parsers)
          if (
            id.includes("prettier/standalone") ||
            id.includes("prettier/plugins")
          ) {
            return "prettier";
          }
          // SVGO - only in workers, exclude from main bundle
          if (id.includes("svgo") && !id.includes(".worker")) {
            return "svgo";
          }
          // Radix UI components
          if (id.includes("@radix-ui")) {
            return "ui";
          }
        },
      },
    },
  },
}));
