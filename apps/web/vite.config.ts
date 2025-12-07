import contentCollections from "@content-collections/vite";
import tailwindcss from "@tailwindcss/vite";
import takumiPackageJson from "@takumi-rs/core/package.json" with {
  type: "json",
};
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { Locales } from "intlayer";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { intlayer, intlayerProxy } from "vite-intlayer";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// PWA runtime caching patterns
const GOOGLE_FONTS_PATTERN = /^https:\/\/fonts\.googleapis\.com\/.*/i;
const GSTATIC_FONTS_PATTERN = /^https:\/\/fonts\.gstatic\.com\/.*/i;

export default defineConfig(({ mode }) => ({
  plugins: [
    contentCollections(),
    intlayer(),
    intlayerProxy(),
    tsconfigPaths(),
    tanstackStart({
      sitemap: {
        host:
          mode === "production"
            ? "https://tiny-svg.actnow.dev"
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
        failOnError: false,
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
    ...VitePWA({
      registerType: "prompt", // User-controlled updates
      includeAssets: ["*.png", "*.svg", "robots.txt", "sitemap.xml"],
      manifest: false, // Use existing site.webmanifest
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2}"],
        runtimeCaching: [
          {
            urlPattern: GOOGLE_FONTS_PATTERN,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: GSTATIC_FONTS_PATTERN,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        navigateFallback: null, // TanStack Start handles routing
        skipWaiting: false, // User-controlled updates
        clientsClaim: false,
      },
      devOptions: {
        enabled: false, // Disable in dev for faster iteration
      },
    }),
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
  optimizeDeps: {
    exclude: ["@takumi-rs/core"],
  },
  nitro: {
    preset: "vercel",
    externals: {
      external: ["@takumi-rs/core"],
      traceInclude: Object.keys(takumiPackageJson.optionalDependencies),
    },
  },
}));
