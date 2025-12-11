import * as buffer from "node:buffer";
import * as process from "node:process";
import type { BufferLike, InputWithSizeMeta } from "client-zip";
import { downloadZip } from "client-zip";
import svg2ttf from "svg2ttf";
import ttf2eot from "ttf2eot";
import ttf2woff from "ttf2woff";
import type { FileExtension } from "./utils";

export type { FileExtension } from "./utils";
export { FileExtensions } from "./utils";

// Regex patterns for SVG parsing (top-level for performance)
const PATH_D_REGEX = /<path[^>]+d="([^"]+)"/;
const SVG_CONTENT_REGEX = /<svg[^>]*>([\s\S]*)<\/svg>/i;

export interface SvgPackerOptions {
  /**
   * @default 'iconfont'
   */
  fontName?: string;
  /**
   * @default 'iconfont'
   */
  cssPrefix?: string;
  /**
   * @default 'iconfont'
   */
  fileName?: string;
  /**
   * @default 0xE001
   */
  startCodepoint?: number;
  /**
   * @default 1000
   */
  fontHeight?: number;
  /**
   * @default 0
   */
  descent?: number;
  /**
   * @default false
   */
  fixedWidth?: boolean;
  /**
   * Enable WOFF2 format generation (requires WebAssembly)
   * @default true
   */
  enableWOFF2?: boolean;
  icons: {
    svg: string;
    name: string;
    unicode?: number;
  }[];
}

export interface SvgPackerResult {
  files: Record<
    FileExtension,
    {
      name: string;
      blob: Blob;
      url?: string;
    }
  >;
  zip: {
    name: string;
    blob: Blob;
    url?: string;
  };
}

export async function SvgPacker({
  icons,
  ...options
}: SvgPackerOptions): Promise<SvgPackerResult> {
  const {
    fontName = "iconfont",
    cssPrefix = "iconfont",
    fileName = "iconfont",
    startCodepoint = 0xe0_01,
    fontHeight = 1000,
    descent = 0,
    fixedWidth = false,
    enableWOFF2 = true,
  } = options ?? {};

  const parsedIcons = icons.map(({ svg, name, unicode }, i) => ({
    svg,
    name,
    unicode: unicode ?? startCodepoint + i,
  }));

  const files = {} as SvgPackerResult["files"];

  const zip = await downloadZip(
    generateZipEntries(
      parsedIcons,
      {
        fontName,
        cssPrefix,
        fileName,
        startCodepoint,
        fontHeight,
        descent,
        fixedWidth,
        enableWOFF2,
        icons: parsedIcons,
      },
      files
    )
  ).blob();

  return {
    files,
    zip: {
      name: `${fileName}.zip`,
      blob: zip,
      url: makeUrl(zip),
    },
  };
}

function addFile(
  files: SvgPackerResult["files"],
  filename: string,
  ext: FileExtension,
  data: BufferLike,
  mime = "text/plain"
) {
  const blob = new Blob([data as BlobPart], { type: mime });
  files[ext] = {
    name: filename,
    blob,
    url: makeUrl(blob),
  };
  return {
    name: filename,
    input: blob,
    url: makeUrl(blob),
  } satisfies InputWithSizeMeta & { url?: string };
}

function makeUrl(blob: Blob | MediaSource): string | undefined {
  if (
    typeof window === "undefined" ||
    !window.URL ||
    !window.URL.createObjectURL
  ) {
    return;
  }
  return window.URL.createObjectURL(blob);
}

function makeSVG(
  icons: Array<{ svg: string; name: string; unicode: number }>,
  options: Omit<SvgPackerOptions, "icons">
): string {
  const {
    fontName = "iconfont",
    fontHeight = 1000,
    descent = 0,
    fixedWidth = false,
  } = options;

  // Calculate the ascent (fontHeight - descent)
  const ascent = fontHeight - descent;

  // Extract path data from each SVG icon
  const glyphs = icons.map(({ svg, name, unicode }) => {
    // Extract the path 'd' attribute from the SVG
    // This is a simple extraction - may need enhancement for complex SVGs
    const pathMatch = svg.match(PATH_D_REGEX);
    const pathData = pathMatch ? pathMatch[1] : "";

    // If no path found, try to extract from the entire SVG body
    let glyphData = pathData;
    if (!glyphData) {
      // Remove svg wrapper and extract inner content
      const innerMatch = svg.match(SVG_CONTENT_REGEX);
      glyphData = innerMatch ? innerMatch[1].trim() : svg;
    }

    return {
      name,
      unicode: String.fromCharCode(unicode),
      unicodeHex: unicode.toString(16),
      d: pathData,
      content: glyphData,
    };
  });

  // Calculate horizontal advance (default width)
  const horizAdvX = fixedWidth ? fontHeight : fontHeight;

  // Generate SVG font XML
  const svgFont = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg">
<defs>
<font id="${fontName}" horiz-adv-x="${horizAdvX}">
<font-face
  font-family="${fontName}"
  font-weight="400"
  font-stretch="normal"
  units-per-em="${fontHeight}"
  ascent="${ascent}"
  descent="${descent}"
/>
<missing-glyph horiz-adv-x="${horizAdvX}" />
${glyphs
  .map(
    (glyph) =>
      `<glyph
  glyph-name="${glyph.name}"
  unicode="${glyph.unicode}"
  horiz-adv-x="${horizAdvX}"
  d="${glyph.d}"
/>`
  )
  .join("\n")}
</font>
</defs>
</svg>`;

  return svgFont;
}

function makeTTF(svgFont: BufferLike) {
  let svgFontString: string;
  if (typeof svgFont === "string") {
    svgFontString = svgFont;
  } else if (svgFont instanceof Blob) {
    throw new Error("Blob type not supported for SVG font conversion");
  } else {
    svgFontString = new TextDecoder().decode(svgFont as BufferSource);
  }
  const ttfFontBuffer: Uint8Array = svg2ttf(svgFontString).buffer;

  return ttfFontBuffer;
}

function makeEOT(ttfFontBuffer: Uint8Array) {
  const eotFontBuffer = new Uint8Array(ttf2eot(ttfFontBuffer).buffer);

  return eotFontBuffer;
}

function makeWOFF(ttfFontBuffer: Uint8Array) {
  const woffFontBuffer = new Uint8Array(
    ttf2woff(new Uint8Array(ttfFontBuffer.buffer)).buffer
  );
  return woffFontBuffer;
}

async function browserPromise() {
  const [{ wasmUrl }, { initWasmBrowser, ttf2woff2 }] = await Promise.all([
    import("./ttf2woff2.wasm.js"),
    import("./wasm.js"),
  ]);

  await initWasmBrowser(wasmUrl);
  return ttf2woff2;
}

async function preloadWasm() {
  const isNode: boolean =
    typeof process < "u" &&
    typeof process.stdout < "u" &&
    !process.versions?.deno &&
    !globalThis.window;

  return isNode
    ? await import("ttf2woff2/jssrc/index.js")
        .then((m) => m.default || m)
        .catch((e) => {
          console.error("ERROR", e);
          return Promise.reject(e);
        })
    : await browserPromise();
}

async function makeWOFF2(ttfFontBuffer: Uint8Array) {
  const fontBuffer = new Uint8Array(ttfFontBuffer);
  let buf = buffer.Buffer.alloc(fontBuffer.length);
  for (let i = 0, j = fontBuffer.length; i < j; i++) {
    buf.writeUInt8(fontBuffer[i], i);
  }

  const ttf2woff2 = await preloadWasm();

  if (!(ttf2woff2 && typeof ttf2woff2 === "function")) {
    throw new Error("ttf2woff2 not found");
  }

  if (ttf2woff2 instanceof Error) {
    throw ttf2woff2;
  }

  buf = ttf2woff2(buf) as buffer.Buffer<ArrayBuffer>;
  const woff2FontBuffer = new Uint8Array(buf.length);
  for (let i = 0, j = buf.length; i < j; i++) {
    woff2FontBuffer[i] = buf.readUInt8(i);
  }

  return woff2FontBuffer;
}

function makeCSS(
  { icons, fontName, fileName, cssPrefix }: SvgPackerOptions,
  files: SvgPackerResult["files"]
) {
  // Generate @font-face src with only available formats
  const formats: string[] = [];
  if (files.eot) {
    formats.push(`url("./${fileName}.eot") format("embedded-opentype")`);
  }
  if (files.ttf) {
    formats.push(`url("./${fileName}.ttf") format("truetype")`);
  }
  if (files.woff) {
    formats.push(`url("./${fileName}.woff") format("woff")`);
  }
  if (files.woff2) {
    formats.push(`url("./${fileName}.woff2") format("woff2")`);
  }
  if (files.svg) {
    formats.push(`url("./${fileName}.svg") format("svg")`);
  }

  const css = `
@font-face {
  font-family: "${fontName}";
  src: url("./${fileName}.eot");
  src: ${formats.join(",\n       ")};
  font-weight: normal;
  font-style: normal;
}

.${cssPrefix} {
  font-family: "${fontName}" !important;
  font-size: 1em;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

${icons
  .map(
    ({ name, unicode }) => `
.${cssPrefix}.${name.replace(/:/g, "\\:")}:before {
content: "\\${unicode?.toString(16) ?? ""}";
}
`
  )
  .join("")}
`;

  return css;
}

function makeDemoHTML({
  icons,
  fontName,
  fileName,
  cssPrefix,
}: SvgPackerOptions) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${fontName} Demo</title>
  <link rel="stylesheet" href="./${fileName}.css">
  <style>
html {
  font-size: 1.2em;
}
i {
  padding: 5px;
  color: #717171;
  display: inline-block;
}
  </style>
</head>
<body>
${icons.map(({ name }) => `<i class="${cssPrefix} ${name}"></i>`).join("")}
<!-- Generated by SVG Pack (https://github.com/antfu/svg-packer) -->
</body>
`;
}

async function* generateZipEntries(
  icons: Array<{ svg: string; name: string; unicode: number }>,
  options: SvgPackerOptions,
  files: SvgPackerResult["files"]
): AsyncGenerator<{
  name: string;
  input: Blob;
  url?: string;
}> {
  const content = makeSVG(icons, options) as BufferLike;
  yield addFile(
    files,
    `${options.fileName}.svg`,
    "svg",
    content,
    "image/svg+xml"
  );
  const ttfFontBuffer = makeTTF(content);
  yield addFile(
    files,
    `${options.fileName}.ttf`,
    "ttf",
    ttfFontBuffer,
    "application/octet-stream"
  );
  yield addFile(
    files,
    `${options.fileName}.eot`,
    "eot",
    makeEOT(ttfFontBuffer),
    "application/octet-stream"
  );
  yield addFile(
    files,
    `${options.fileName}.woff`,
    "woff",
    makeWOFF(ttfFontBuffer),
    "application/octet-stream"
  );

  // Only generate WOFF2 if enabled
  if (options.enableWOFF2 !== false) {
    yield addFile(
      files,
      `${options.fileName}.woff2`,
      "woff2",
      await makeWOFF2(ttfFontBuffer),
      "application/octet-stream"
    );
  }

  yield addFile(
    files,
    `${options.fileName}.css`,
    "css",
    makeCSS(options, files),
    "text/css"
  );
  yield addFile(
    files,
    "_demo.html",
    "demoHTML",
    makeDemoHTML(options),
    "text/html"
  );
}

if (typeof window !== "undefined") {
  window.SvgPacker = SvgPacker;
}
if (typeof self !== "undefined") {
  self.SvgPacker = SvgPacker;
}
if (typeof globalThis !== "undefined") {
  globalThis.SvgPacker = SvgPacker;
}
