import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { build, defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { viteSingleFile } from "vite-plugin-singlefile";

// Plugin to build the Figma sandbox code (plugin.ts) after UI build
function buildPluginCode() {
  return {
    name: "build-plugin-code",
    closeBundle: async () => {
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
    nodePolyfills({
      protocolImports: true,
    }),
    viteSingleFile(),
    buildPluginCode(),
  ],
  optimizeDeps: {
    include: [
      "@tiny-svg/svg-packer",
      "svgo/browser",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tabs",
      "prettier/standalone",
      "prettier/plugins/html",
    ],
  },
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
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
