/**
 * Image export utilities for Figma plugin
 * Reuses logic from @tiny-svg/export-utils
 */

import { copyToClipboard } from "@tiny-svg/export-utils";

// Re-export the shared functions using export from
export {
  exportAsIco,
  exportAsJpeg,
  exportAsPng,
  exportAsWebp,
  svgToIcoBlob,
  svgToJpegBlob,
  svgToPngBlob,
  svgToWebpBlob,
} from "@tiny-svg/export-utils";

// Copy image to clipboard (convert blob to clipboard item)
export async function copyImageToClipboard(
  blob: Blob,
  mimeType: string
): Promise<void> {
  try {
    const item = new ClipboardItem({
      [mimeType]: blob,
    });
    await navigator.clipboard.write([item]);
  } catch {
    // Fallback: copy as data URL
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      await copyToClipboard(dataUrl);
    };
    reader.readAsDataURL(blob);
  }
}
