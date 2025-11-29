import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  clean: true,
  dts: true,
  sourcemap: true,
  minify: false,
  // No external dependencies for code-generators
});
