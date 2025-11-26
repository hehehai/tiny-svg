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
      await build({
        configFile: false,
        build: {
          outDir: resolve(__dirname, "dist"),
          emptyOutDir: false,
          sourcemap: false,
          target: "es2015",
          lib: {
            entry: resolve(__dirname, "src/plugin.ts"),
            formats: ["iife"],
            name: "plugin",
            fileName: () => "plugin.js",
          },
          rollupOptions: {
            output: {
              extend: true,
            },
          },
        },
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), buildPluginCode()],
  root: resolve(__dirname, "src/ui"),
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
