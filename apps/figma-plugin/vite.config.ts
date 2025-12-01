import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { build, defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Plugin to build the Figma sandbox code (plugin.ts) after UI build
function buildPluginCode() {
  return {
    name: "build-plugin-code",
    closeBundle: async () => {
      // Copy icon assets to dist directory
      const distDir = resolve(__dirname, "dist");
      const assetsDir = resolve(__dirname, "assets");

      try {
        copyFileSync(
          resolve(assetsDir, "icon.svg"),
          resolve(distDir, "icon.svg")
        );
        copyFileSync(
          resolve(assetsDir, "icon.png"),
          resolve(distDir, "icon.png")
        );
      } catch (error) {
        console.warn("Failed to copy icon assets:", error);
      }

      await build({
        configFile: false,
        resolve: {
          alias: {
            "@": resolve(__dirname, "src"),
          },
        },
        build: {
          outDir: resolve(__dirname, "dist"),
          emptyOutDir: false,
          sourcemap: false,
          target: "es2017",
          lib: {
            entry: resolve(__dirname, "src/plugin.ts"),
            formats: ["iife"],
            name: "plugin",
            fileName: () => "plugin.js",
          },
          rollupOptions: {
            output: {
              extend: false,
              footer: "plugin();",
            },
          },
        },
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
    viteSingleFile(),
    buildPluginCode(),
  ],
  root: resolve(__dirname, "src/ui"),
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    sourcemap: false,
    target: "es2020",
    rollupOptions: {
      input: resolve(__dirname, "src/ui/index.html"),
      output: {
        entryFileNames: "ui.js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
