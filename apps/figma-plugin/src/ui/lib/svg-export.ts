import { downloadBlob } from "@tiny-svg/utils";
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
  downloadBlob(blob, `svgs-${Date.now()}.zip`);
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
 * Export SVGs as a ZIP package ready for icon font conversion tools (like IcoMoon)
 * Includes optimized SVGs and a JSON manifest file
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

  const zip = new JSZip();

  // Create a folder for the SVG files
  const svgFolder = zip.folder("svg-icons");

  if (!svgFolder) {
    throw new Error("Failed to create ZIP folder");
  }

  // Add each SVG file
  for (const item of selectedItems) {
    const iconName = iconNames[item.id] || sanitizeIconName(item.name);
    const svg = item.compressedSvg || item.originalSvg;
    svgFolder.file(`${iconName}.svg`, svg);
  }

  // Create manifest file with font configuration
  const manifest = {
    fontName: config.fontName.trim(),
    fileName: config.fileName.trim(),
    cssPrefix: config.cssPrefix.trim(),
    icons: selectedItems.map((item) => ({
      name: iconNames[item.id] || sanitizeIconName(item.name),
      originalName: item.name,
      size: item.compressedSize || item.originalSize,
    })),
    exportedAt: new Date().toISOString(),
    instructions: {
      message:
        "Upload the SVG files to IcoMoon (https://icomoon.io/app) to generate icon fonts",
      steps: [
        "1. Visit https://icomoon.io/app",
        "2. Click 'Import Icons' and select all SVG files from the 'svg-icons' folder",
        "3. Select all imported icons",
        "4. Click 'Generate Font' at the bottom",
        "5. Set the font name and CSS prefix in the preferences",
        "6. Download the font package",
      ],
    },
  };

  zip.file("manifest.json", JSON.stringify(manifest, null, 2));

  // Create a README file with instructions
  const readme = `# ${config.fontName} - Icon Font Package

## Contents
- **svg-icons/**: Optimized SVG files ready for icon font conversion
- **manifest.json**: Font configuration and icon metadata

## How to Generate Icon Fonts

This package contains ${selectedItems.length} optimized SVG icon${selectedItems.length > 1 ? "s" : ""}.

### Option 1: IcoMoon (Recommended)
1. Visit https://icomoon.io/app
2. Click "Import Icons" button
3. Select all SVG files from the \`svg-icons\` folder
4. Select all imported icons in the IcoMoon interface
5. Click "Generate Font" at the bottom
6. In preferences, set:
   - Font Name: ${config.fontName}
   - Class Prefix: ${config.cssPrefix}-
7. Click "Download" to get your font package (TTF, WOFF, WOFF2, EOT, SVG + CSS)

### Option 2: Fontello
1. Visit https://fontello.com
2. Drag and drop all SVG files from the \`svg-icons\` folder
3. Select the imported icons
4. Click "Download webfont"

### Option 3: Command Line (Node.js)
\`\`\`bash
npm install -g svgtofont
svgtofont --sources ./svg-icons --output ./fonts --fontName "${config.fontName}"
\`\`\`

## Font Configuration
- **Font Name**: ${config.fontName}
- **File Name**: ${config.fileName}
- **CSS Prefix**: ${config.cssPrefix}
- **Icons**: ${selectedItems.length}

## Usage Example (After Conversion)
\`\`\`html
<link rel="stylesheet" href="${config.fileName}.css">
<i class="${config.cssPrefix}-icon-name"></i>
\`\`\`

---
Exported from Tiny SVG Figma Plugin
${new Date().toLocaleString()}
`;

  zip.file("README.md", readme);

  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
}
