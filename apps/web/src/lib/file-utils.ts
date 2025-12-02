/**
 * Web app specific file utilities
 * Generic utilities have been moved to @tiny-svg/utils package
 */

import { createCanvasFromSvg, getSvgDimensions } from "@tiny-svg/utils";
import { PNG_MIME_TYPE, SVG_EXTENSION, SVG_MIME_TYPE } from "./constants";

// Re-export commonly used utilities from @tiny-svg/utils
export {
  addXmlnsToSvg,
  copyToClipboard,
  createCanvasFromSvg,
  downloadBlob,
  downloadFile,
  downloadSvg,
  getSvgDimensions,
} from "@tiny-svg/utils";

/**
 * Check if a file is an SVG file
 */
export const isSvgFile = (file: File): boolean =>
  file.type === SVG_MIME_TYPE || file.name.endsWith(SVG_EXTENSION);

/**
 * Read a file as text
 */
export const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as text"));
      }
    });
    reader.addEventListener("error", () => {
      reject(new Error("Failed to read file"));
    });
    reader.readAsText(file);
  });

/**
 * Check if content is SVG
 */
export const isSvgContent = (content: string): boolean => {
  const trimmed = content.trim();
  return trimmed.startsWith("<svg") || trimmed.includes("<svg");
};

/**
 * Extract SVG from base64 data URI
 */
export const extractSvgFromBase64 = (base64: string): string | null => {
  try {
    const base64Prefix = `data:${SVG_MIME_TYPE};base64,`;
    if (base64.startsWith(base64Prefix)) {
      const svgData = base64.replace(base64Prefix, "");
      return atob(svgData);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Prettify SVG with Prettier
 */
export const prettifySvg = async (svg: string): Promise<string> => {
  try {
    const prettier = await import("prettier");
    const parserHtml = await import("prettier/parser-html");

    return prettier.format(svg, {
      parser: "html",
      plugins: [parserHtml],
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
    });
  } catch (_error) {
    return svg;
  }
};

/**
 * Create data URL from SVG
 */
export const svgToDataUrl = (svg: string): string => {
  const blob = new Blob([svg], { type: SVG_MIME_TYPE });
  return URL.createObjectURL(blob);
};

/**
 * Export SVG as PDF (web app only - requires jsPDF)
 */
export const exportAsPdf = async (
  svg: string,
  fileName: string,
  customWidth?: number,
  customHeight?: number
): Promise<void> => {
  const svgDimensions = getSvgDimensions(svg);
  const width =
    customWidth && customWidth > 0 ? customWidth : svgDimensions.width;
  const height =
    customHeight && customHeight > 0 ? customHeight : svgDimensions.height;

  const canvas = await createCanvasFromSvg(svg, width, height, {
    backgroundColor: "white",
  });

  try {
    const { jsPDF } = await import("jspdf");

    // Calculate PDF dimensions in mm (A4 size constraints)
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const aspectRatio = width / height;

    let imgWidth = pdfWidth - 20; // 10mm margin on each side
    let imgHeight = imgWidth / aspectRatio;

    // If image height exceeds page height, scale down
    if (imgHeight > pdfHeight - 20) {
      imgHeight = pdfHeight - 20;
      imgWidth = imgHeight * aspectRatio;
    }

    const pdf = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL(PNG_MIME_TYPE);
    const xOffset = (pdfWidth - imgWidth) / 2;
    const yOffset = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
    pdf.save(fileName.replace(SVG_EXTENSION, ".pdf"));
  } catch (error) {
    throw new Error(`Failed to generate PDF: ${error}`);
  }
};
