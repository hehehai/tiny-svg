import JSZip from "jszip";
import type { SvgItem } from "@/ui/store";

/**
 * Export multiple SVGs as a ZIP file
 */
export async function exportAsZip(items: SvgItem[]): Promise<void> {
  const zip = new JSZip();

  for (const item of items) {
    const svg = item.compressedSvg || item.originalSvg;
    zip.file(`${item.name}.svg`, svg);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `svgs-${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const SVG_MATCHER = /<svg[^>]*>([\s\S]*)<\/svg>/;

/**
 * Export SVGs as a sprite sheet (single SVG with symbols + JSON metadata)
 */
export async function exportAsSpriteSheet(items: SvgItem[]): Promise<void> {
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
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sprite-${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
