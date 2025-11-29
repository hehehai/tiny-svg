/**
 * Thumbnail generation utility
 * Uses shared @tiny-svg/export-utils for canvas operations
 */

import { createCanvasFromSvg, getSvgDimensions } from "@tiny-svg/export-utils";

export async function generateThumbnail(
  svg: string,
  size = 48
): Promise<string> {
  try {
    const dimensions = getSvgDimensions(svg);
    const width = dimensions?.width || size;
    const height = dimensions?.height || size;

    // Calculate aspect-fit dimensions
    const aspectRatio = width / height;
    let thumbWidth = size;
    let thumbHeight = size;

    if (aspectRatio > 1) {
      thumbHeight = size / aspectRatio;
    } else {
      thumbWidth = size * aspectRatio;
    }

    // Use shared canvas creation utility from export-utils
    const canvas = await createCanvasFromSvg(svg, thumbWidth, thumbHeight, {
      centered: true,
      canvasSize: size,
    });

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Failed to generate thumbnail:", error);
    throw error;
  }
}
