import { server } from "@vitest/browser/context";
import { isCI } from "std-env";
import { expect, it } from "vitest";
import type { SvgPackerResult } from "../src";
import {
  appendIconsToTheDomBody,
  expectedFontName,
  options,
  replaceCssFontUrls,
} from "./shared";

// this test shouldn't run when using the preview provider and running the test in the CI
it.skipIf(isCI && server.provider === "preview")(
  "svg-packer in the browser",
  async () => {
    expect("SvgPacker" in globalThis).toBeTruthy();
    const result: SvgPackerResult = await globalThis.SvgPacker(options);
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
    const cssFile = result.files.css;
    expect(cssFile).toBeTruthy();
    expect(cssFile.blob).toBeTruthy();
    expect(cssFile.blob.size).toBeGreaterThan(0);
    let cssContent = await cssFile.blob.text();
    expect(cssContent).toContain("My Awesome Font");
    expect(cssContent).toContain("maf.woff2");

    cssContent = replaceCssFontUrls(cssContent, result);
    const style = globalThis.document.createElement("style");
    style.textContent = `${cssContent}
i {
  padding: 5px;
  color: #717171;
  display: inline-block;
  font-size: 1.2em;
}
`;
    globalThis.document.head.append(style);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const iconDeclarations = await appendIconsToTheDomBody();
    const fontName = expectedFontName(options);
    for (const { css } of iconDeclarations) {
      expect(css).toBeTruthy();
      expect(css.content).toBeTruthy();
      expect(css.fontFamily).toBe(fontName);
      expect(css.fontStyle).toBe("normal");
    }
  }
);
