import { downloadBlob } from "@tiny-svg/utils";
import type { SvgItem } from "@/ui/store";

/**
 * Export multiple SVGs as a ZIP file
 */
export async function exportAsZip(items: SvgItem[]): Promise<void> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  for (const item of items) {
    const svg = item.compressedSvg || item.originalSvg;
    zip.file(`${item.name}.svg`, svg);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `svgs-${Date.now()}.zip`);
}

const SVG_MATCHER = /<svg[^>]*>([\s\S]*)<\/svg>/;

/**
 * Export SVGs as a sprite sheet (single SVG with symbols + JSON metadata)
 */
export async function exportAsSpriteSheet(items: SvgItem[]): Promise<void> {
  const { default: JSZip } = await import("jszip");

  // Generate sprite sheet SVG
  const symbols = items
    .map((item, index) => {
      const svg = item.compressedSvg || item.originalSvg;
      // Extract SVG content (remove <svg> wrapper)
      const match = svg.match(SVG_MATCHER);
      const content = match ? match[1] : svg;

      return `  <symbol id="icon-${index}" viewBox="0 0 24 24">
${content}
  </symbol>`;
    })
    .join("\n");

  const spriteSheet = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
${symbols}
</svg>`;

  // Generate metadata JSON
  const metadata = items.map((item, index) => ({
    id: `icon-${index}`,
    name: item.name,
    originalSize: item.originalSize,
    compressedSize: item.compressedSize || item.originalSize,
  }));

  // Create ZIP with sprite sheet + metadata
  const zip = new JSZip();
  zip.file("sprite.svg", spriteSheet);
  zip.file("metadata.json", JSON.stringify(metadata, null, 2));

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `sprite-${Date.now()}.zip`);
}

/**
 * Sanitize icon name for use in icon fonts
 */
export function sanitizeIconName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\s+/g, "-") // spaces to hyphens
      .replace(/[^a-z0-9-_]/g, "") // remove special chars
      .replace(/^-+|-+$/g, "") // trim hyphens
      .replace(/-+/g, "-") || "icon" // collapse multiple hyphens, fallback
  );
}

/**
 * Icon fonts configuration
 */
export interface IconFontsConfig {
  fontName: string;
  fileName: string;
  cssPrefix: string;
}

/**
 * Export SVGs as icon fonts (TTF, WOFF, EOT, SVG) with CSS and demo HTML
 * Uses @tiny-svg/svg-packer in non-WASM mode (Figma doesn't support WebAssembly)
 */
export async function exportAsIconFonts(
  items: SvgItem[],
  selectedIds: string[],
  iconNames: Record<string, string>,
  config: IconFontsConfig
): Promise<Blob> {
  // Validate config
  if (!config.fontName.trim()) {
    throw new Error("Font name is required");
  }
  if (!config.fileName.trim()) {
    throw new Error("File name is required");
  }
  if (!config.cssPrefix.trim()) {
    throw new Error("CSS prefix is required");
  }

  // Filter selected items
  const selectedItems = items.filter((item) => selectedIds.includes(item.id));

  if (selectedItems.length === 0) {
    throw new Error("No icons selected");
  }

  // Transform to SvgPacker format
  const icons = selectedItems.map((item) => ({
    name: iconNames[item.id] || sanitizeIconName(item.name),
    svg: item.compressedSvg || item.originalSvg,
  }));

  try {
    // Lazy-load SvgPacker only when needed (reduces initial bundle size ~200KB)
    const { SvgPacker } = await import("@tiny-svg/svg-packer");

    // Generate icon fonts using SvgPacker
    // CRITICAL: enableWOFF2 must be false because Figma doesn't support WebAssembly
    const result = await SvgPacker({
      fontName: config.fontName.trim(),
      fileName: config.fileName.trim(),
      cssPrefix: config.cssPrefix.trim(),
      enableWOFF2: false, // No WASM in Figma
      icons,
    });

    return result.zip.blob;
  } catch (error) {
    console.error("Failed to generate icon fonts:", error);
    throw new Error(
      error instanceof Error
        ? `Icon font generation failed: ${error.message}`
        : "Failed to generate icon fonts"
    );
  }
}
