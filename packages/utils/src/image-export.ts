/**
 * Image export utilities
 */

const SVG_BLOB_TYPE = "image/svg+xml;charset=utf-8";
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const PNG_MIME_TYPE = "image/png";
const JPEG_MIME_TYPE = "image/jpeg";
const WEBP_MIME_TYPE = "image/webp";
const ICO_MIME_TYPE = "image/x-icon";
const SVG_EXTENSION = ".svg";

const DEFAULT_DIMENSION = 512;
const MIN_EXPORT_DIMENSION = 16;
const DEFAULT_JPEG_QUALITY = 0.9;
const DEFAULT_WEBP_QUALITY = 0.9;
const DEFAULT_ICO_SIZES = [16, 32, 48, 64];
const VIEWBOX_SPLIT_PATTERN = /[\s,]+/;
const VIEWBOX_VALUES_COUNT = 4;

import { downloadBlob } from "./download";

export const addXmlnsToSvg = (svg: string): string => {
  const xmlnsAttr = `xmlns="${SVG_NAMESPACE}"`;
  if (svg.includes(xmlnsAttr)) {
    return svg;
  }
  return svg.replace("<svg", `<svg ${xmlnsAttr}`);
};

export const getSvgDimensions = (
  svg: string
): { width: number; height: number } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    return { width: DEFAULT_DIMENSION, height: DEFAULT_DIMENSION };
  }

  let width: string | null = svgElement.getAttribute("width");
  let height: string | null = svgElement.getAttribute("height");

  if (!(width && height)) {
    const viewBox = svgElement.getAttribute("viewBox");
    if (viewBox) {
      const values = viewBox.split(VIEWBOX_SPLIT_PATTERN);
      if (values.length === VIEWBOX_VALUES_COUNT) {
        width = values[2] ?? null;
        height = values[3] ?? null;
      }
    }
  }

  const parseSize = (size: string | null): number => {
    if (!size) {
      return DEFAULT_DIMENSION;
    }
    const parsed = Number.parseFloat(size);
    return Number.isNaN(parsed) ? DEFAULT_DIMENSION : parsed;
  };

  const parsedWidth = parseSize(width);
  const parsedHeight = parseSize(height);

  const scale = Math.max(
    1,
    MIN_EXPORT_DIMENSION / Math.max(parsedWidth, parsedHeight)
  );

  return {
    width: Math.round(parsedWidth * scale),
    height: Math.round(parsedHeight * scale),
  };
};

export const createCanvasFromSvg = async (
  svg: string,
  width: number,
  height: number,
  options: {
    backgroundColor?: string;
    centered?: boolean;
    canvasSize?: number;
  } = {}
): Promise<HTMLCanvasElement> => {
  const { backgroundColor, centered = false, canvasSize } = options;
  const finalCanvasWidth = canvasSize || width;
  const finalCanvasHeight = canvasSize || height;

  const canvas = document.createElement("canvas");
  canvas.width = finalCanvasWidth;
  canvas.height = finalCanvasHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, finalCanvasWidth, finalCanvasHeight);
  }

  const svgWithNamespace = addXmlnsToSvg(svg);
  const img = new Image();
  const svgBlob = new Blob([svgWithNamespace], { type: SVG_BLOB_TYPE });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.addEventListener("load", () => {
      const offsetX = centered ? (finalCanvasWidth - width) / 2 : 0;
      const offsetY = centered ? (finalCanvasHeight - height) / 2 : 0;
      ctx.drawImage(img, offsetX, offsetY, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    });

    img.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    });

    img.src = url;
  });
};

const canvasToBlobAndDownload = async (
  canvas: HTMLCanvasElement,
  fileName: string,
  mimeType: string,
  quality?: number
): Promise<void> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          downloadBlob(blob, fileName);
          resolve();
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      mimeType,
      quality
    );
  });

export const canvasToBlob = async (
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Canvas.toBlob only supports image/png, image/jpeg, and image/webp
          // If a different MIME type is requested (e.g., image/x-icon),
          // we need to manually create a new Blob with the correct type
          if (blob.type !== mimeType) {
            blob.arrayBuffer().then((buffer) => {
              const newBlob = new Blob([buffer], { type: mimeType });
              resolve(newBlob);
            });
          } else {
            resolve(blob);
          }
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      mimeType,
      quality
    );
  });

export const exportAsPng = async (
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

  const canvas = await createCanvasFromSvg(svg, width, height);
  await canvasToBlobAndDownload(
    canvas,
    fileName.replace(SVG_EXTENSION, ".png"),
    PNG_MIME_TYPE
  );
};

export const exportAsJpeg = async (
  svg: string,
  fileName: string,
  quality = DEFAULT_JPEG_QUALITY,
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
  await canvasToBlobAndDownload(
    canvas,
    fileName.replace(SVG_EXTENSION, ".jpg"),
    JPEG_MIME_TYPE,
    quality
  );
};

export const exportAsWebp = async (
  svg: string,
  fileName: string,
  quality = DEFAULT_WEBP_QUALITY,
  customWidth?: number,
  customHeight?: number
): Promise<void> => {
  const svgDimensions = getSvgDimensions(svg);
  const width =
    customWidth && customWidth > 0 ? customWidth : svgDimensions.width;
  const height =
    customHeight && customHeight > 0 ? customHeight : svgDimensions.height;

  const canvas = await createCanvasFromSvg(svg, width, height);
  await canvasToBlobAndDownload(
    canvas,
    fileName.replace(SVG_EXTENSION, ".webp"),
    WEBP_MIME_TYPE,
    quality
  );
};

export const exportAsIco = async (
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

  const size = Math.max(width, height, Math.max(...DEFAULT_ICO_SIZES));

  const canvas = await createCanvasFromSvg(svg, width, height, {
    centered: true,
    canvasSize: size,
  });
  // Browser canvas doesn't support true ICO format, but we use ICO_MIME_TYPE
  // to ensure the browser downloads with .ico extension
  await canvasToBlobAndDownload(
    canvas,
    fileName.replace(SVG_EXTENSION, ".ico"),
    ICO_MIME_TYPE
  );
};

export const svgToPngBlob = async (
  svg: string,
  width?: number,
  height?: number
): Promise<Blob> => {
  const dimensions = getSvgDimensions(svg);
  const finalWidth = width || dimensions.width;
  const finalHeight = height || dimensions.height;
  const canvas = await createCanvasFromSvg(svg, finalWidth, finalHeight);
  return canvasToBlob(canvas, PNG_MIME_TYPE);
};

export const svgToJpegBlob = async (
  svg: string,
  quality = DEFAULT_JPEG_QUALITY,
  width?: number,
  height?: number
): Promise<Blob> => {
  const dimensions = getSvgDimensions(svg);
  const finalWidth = width || dimensions.width;
  const finalHeight = height || dimensions.height;
  const canvas = await createCanvasFromSvg(svg, finalWidth, finalHeight, {
    backgroundColor: "white",
  });
  return canvasToBlob(canvas, JPEG_MIME_TYPE, quality);
};

export const svgToWebpBlob = async (
  svg: string,
  quality = DEFAULT_WEBP_QUALITY,
  width?: number,
  height?: number
): Promise<Blob> => {
  const dimensions = getSvgDimensions(svg);
  const finalWidth = width || dimensions.width;
  const finalHeight = height || dimensions.height;
  const canvas = await createCanvasFromSvg(svg, finalWidth, finalHeight);
  return canvasToBlob(canvas, WEBP_MIME_TYPE, quality);
};

export const svgToIcoBlob = async (
  svg: string,
  width?: number,
  height?: number
): Promise<Blob> => {
  const dimensions = getSvgDimensions(svg);
  const finalWidth = width || dimensions.width;
  const finalHeight = height || dimensions.height;
  const size = Math.max(
    finalWidth,
    finalHeight,
    Math.max(...DEFAULT_ICO_SIZES)
  );
  const canvas = await createCanvasFromSvg(svg, finalWidth, finalHeight, {
    centered: true,
    canvasSize: size,
  });
  // Browser canvas doesn't support true ICO format, but we use ICO_MIME_TYPE
  // to ensure the browser downloads with .ico extension
  return canvasToBlob(canvas, ICO_MIME_TYPE);
};
