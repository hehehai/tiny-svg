import { expect, it } from "vitest";
import { SvgPacker } from "../src";
import { options } from "./shared";

it("svg-packer in Node (WASM mode)", async () => {
  const result = await SvgPacker(options);
  expect(result.files).toBeTruthy();
  expect(
    Array.from(Object.values(result.files)).map((m) => m.name)
  ).toMatchInlineSnapshot(`
    [
      "maf.svg",
      "maf.ttf",
      "maf.eot",
      "maf.woff",
      "maf.woff2",
      "maf.css",
      "_demo.html",
    ]
  `);
  const css = result.files.css;
  expect(css).toBeTruthy();
  expect(css.blob).toBeTruthy();
  expect(css.blob.size).toBeGreaterThan(0);
  const cssContent = await css.blob.text();
  expect(cssContent).toContain("My Awesome Font");
  expect(cssContent).toContain("maf.woff2");
  expect(result.files.woff2).toBeTruthy();
});

it("svg-packer in Node (non-WASM mode)", async () => {
  const result = await SvgPacker({ ...options, enableWOFF2: false });
  expect(result.files).toBeTruthy();
  expect(
    Array.from(Object.values(result.files)).map((m) => m.name)
  ).toMatchInlineSnapshot(`
    [
      "maf.svg",
      "maf.ttf",
      "maf.eot",
      "maf.woff",
      "maf.css",
      "_demo.html",
    ]
  `);
  // WOFF2 should not be generated
  expect(result.files.woff2).toBeUndefined();

  const css = result.files.css;
  expect(css).toBeTruthy();
  expect(css.blob).toBeTruthy();
  expect(css.blob.size).toBeGreaterThan(0);
  const cssContent = await css.blob.text();
  expect(cssContent).toContain("My Awesome Font");
  // CSS should not reference WOFF2
  expect(cssContent).not.toContain("maf.woff2");
  expect(cssContent).not.toContain('format("woff2")');
});
