import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { Locales } from "intlayer";
import { nitro } from "nitro/vite";
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
      sitemap: {
        host: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3001",
      },
      prerender: {
        // Only enable static pre-rendering in production builds
        enabled: mode === "production",

        // Extract and prerender links found in HTML
        crawlLinks: true,

        // Filter which routes to prerender
        // Only prerender about and blog pages in production
        filter: ({ path }) => {
          // Prerender about page for all locales
          if (path.includes("/about")) {
            return true;
          }

          // Prerender blog list and detail pages for all locales
          if (path.includes("/blog")) {
            return true;
          }

          // Don't prerender other pages (like /optimize which has dynamic functionality)
          return false;
        },
        failOnError: true,
      },
      pages: [
        ...[
          Locales.ENGLISH,
          Locales.CHINESE,
          Locales.KOREAN,
          Locales.GERMAN,
        ].map((locale) => ({
          path: `/${locale}/blog`,
          prerender: { enabled: true },
        })),
      ],
    }),
    nitro(),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Shiki - syntax highlighting (~300KB)
          if (id.includes("shiki")) {
            return "shiki";
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
