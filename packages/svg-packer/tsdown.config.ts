import * as fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import stdLibBrowser from "node-stdlib-browser";
import plugin from "node-stdlib-browser/helpers/esbuild/plugin";
import { defineConfig } from "tsdown/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  entry: ["src/index.ts"],
  platform: "browser",
  format: "esm",
  target: "node16",
  dts: true,
  outExtensions() {
    return {
      js: ".mjs",
      dts: ".d.mts",
    };
  },
  hooks: {
    async "build:done"() {
      // Bundle everything into a single browser-compatible ESM file
      await build({
        entryPoints: [path.resolve(root, "./dist/index.mjs")],
        outfile: path.resolve(root, "./dist/index.browser.js"),
        bundle: true,
        format: "esm",
        target: "es2020",
        inject: [
          path.resolve(
            root,
            "node_modules/node-stdlib-browser/helpers/esbuild/shim"
          ),
        ],
        define: {
          global: "globalThis",
          process: "process",
          Buffer: "Buffer",
        },
        plugins: [plugin(stdLibBrowser)],
      });

      // Clean up the intermediate .mjs file as we only need the browser build
      await fsp.unlink(path.resolve(root, "./dist/index.mjs")).catch(() => {
        // Ignore error if file doesn't exist
      });
    },
  },
});
