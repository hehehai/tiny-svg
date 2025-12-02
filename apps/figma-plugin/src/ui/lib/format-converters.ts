import {
  generateFlutterCode,
  generateReactCode,
  generateReactNativeCode,
  generateSvelteCode,
  generateVueCode,
} from "@tiny-svg/code-generators";
import {
  svgToIcoBlob,
  svgToJpegBlob,
  svgToPngBlob,
  svgToWebpBlob,
} from "@tiny-svg/utils";
import { svgToDataUri } from "./data-uri-utils";

// Image formats
export type ImageFormat = "png" | "jpeg" | "webp" | "ico";

export const IMAGE_FORMAT_LABELS: Record<ImageFormat, string> = {
  png: "PNG",
  jpeg: "JPEG",
  webp: "WEBP",
  ico: "ICO",
};

const IMAGE_FORMAT_EXTENSIONS: Record<ImageFormat, string> = {
  png: ".png",
  jpeg: ".jpg",
  webp: ".webp",
  ico: ".ico",
};

/**
 * Convert SVG to image blob
 */
export async function convertSvgToImageBlob(
  svg: string,
  format: ImageFormat
): Promise<Blob> {
  switch (format) {
    case "png":
      return svgToPngBlob(svg);
    case "jpeg":
      return svgToJpegBlob(svg);
    case "webp":
      return svgToWebpBlob(svg);
    case "ico":
      return svgToIcoBlob(svg);
    default:
      throw new Error(`Unknown format: ${format}`);
  }
}

/**
 * Get image file extension
 */
export function getImageExtension(format: ImageFormat): string {
  return IMAGE_FORMAT_EXTENSIONS[format];
}

// Code formats
export type CodeFormat =
  | "base64"
  | "data-url"
  | "react-tsx"
  | "react-jsx"
  | "vue"
  | "svelte"
  | "react-native"
  | "flutter";

export const CODE_FORMAT_LABELS: Record<CodeFormat, string> = {
  base64: "Base64",
  "data-url": "Data URL",
  "react-tsx": "TSX",
  "react-jsx": "JSX",
  vue: "Vue",
  svelte: "Svelte",
  "react-native": "RNative",
  flutter: "Flutter",
};

const SVG_EXTENSION_REGEX = /\.svg$/i;
const SPECIAL_CHARS_REGEX = /[^a-zA-Z0-9\s]/g;
const WHITESPACE_REGEX = /\s+/;

/**
 * Sanitize component name from filename
 */
export function sanitizeComponentName(name: string): string {
  let cleaned = name.replace(SVG_EXTENSION_REGEX, "");
  cleaned = cleaned.replace(SPECIAL_CHARS_REGEX, "");
  const pascalCase = cleaned
    .split(WHITESPACE_REGEX)
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
  return pascalCase || "SvgIcon";
}

/**
 * Generate code from SVG
 */
export function generateCodeFromSvg(
  svg: string,
  format: CodeFormat,
  componentName: string
): { code: string; filename: string } {
  switch (format) {
    case "base64": {
      const { base64 } = svgToDataUri(svg);
      return { code: base64, filename: "base64.txt" };
    }
    case "data-url": {
      const { minified } = svgToDataUri(svg);
      return { code: minified, filename: "dataurl.txt" };
    }
    case "react-tsx": {
      const result = generateReactCode(svg, {
        framework: "react",
        componentName,
        typescript: true,
      });
      return { code: result.code, filename: result.filename };
    }
    case "react-jsx": {
      const result = generateReactCode(svg, {
        framework: "react",
        componentName,
        typescript: false,
      });
      return { code: result.code, filename: result.filename };
    }
    case "vue": {
      const result = generateVueCode(svg, {
        framework: "vue",
        componentName,
        typescript: false,
      });
      return { code: result.code, filename: result.filename };
    }
    case "svelte": {
      const result = generateSvelteCode(svg, {
        framework: "svelte",
        componentName,
        typescript: false,
      });
      return { code: result.code, filename: result.filename };
    }
    case "react-native": {
      const result = generateReactNativeCode(svg, {
        framework: "react-native",
        componentName,
        typescript: false,
      });
      return { code: result.code, filename: result.filename };
    }
    case "flutter": {
      const result = generateFlutterCode(svg, {
        framework: "flutter",
        componentName,
        typescript: false,
      });
      return { code: result.code, filename: result.filename };
    }
    default:
      throw new Error(`Unknown format: ${format}`);
  }
}
