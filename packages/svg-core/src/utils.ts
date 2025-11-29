import type { SvgState } from "./types.js";

export function calculateCompressionRatio(
  original: string,
  compressed: string
): number {
  const originalSize = new Blob([original]).size;
  const compressedSize = new Blob([compressed]).size;

  if (originalSize === 0) {
    return 0;
  }

  return Number(
    (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
  );
}

export function calculateSize(svg: string): number {
  return new Blob([svg]).size;
}

export function formatSize(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }

  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

export function validateSvg(svg: string): boolean {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    const parseError = doc.querySelector("parsererror");
    return !parseError;
  } catch {
    return false;
  }
}

export function createSvgState(
  originalSvg: string,
  fileName = "untitled"
): SvgState {
  const originalSize = calculateSize(originalSvg);

  return {
    originalSvg,
    compressedSvg: "",
    fileName,
    svgoConfig: {
      multipass: true,
      plugins: ["preset-default"],
    },
    originalSize,
    compressedSize: 0,
    compressionRatio: 0,
  };
}

export function updateCompressionResult(
  state: SvgState,
  compressedSvg: string
): SvgState {
  const compressedSize = calculateSize(compressedSvg);
  const compressionRatio = calculateCompressionRatio(
    state.originalSvg,
    compressedSvg
  );

  return {
    ...state,
    compressedSvg,
    compressedSize,
    compressionRatio,
  };
}
