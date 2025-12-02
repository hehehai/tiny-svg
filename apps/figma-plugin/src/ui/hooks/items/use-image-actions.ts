import { copyToClipboard, downloadBlob } from "@tiny-svg/utils";
import { useCallback } from "react";
import {
  convertSvgToImageBlob,
  getImageExtension,
  IMAGE_FORMAT_LABELS,
  type ImageFormat,
} from "@/ui/lib/format-converters";
import { useActionHandler } from "../use-action-handler";

const SVG_EXTENSION_REGEX = /\.svg$/i;

/**
 * Copy image blob as base64 data URL to clipboard
 */
async function copyImageAsDataUrl(blob: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64data = reader.result as string;
        await copyToClipboard(base64data);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Hook for image conversion actions
 */
export function useImageActions(svg: string, filename: string) {
  const onDownload = useCallback(
    async (format: ImageFormat) => {
      const blob = await convertSvgToImageBlob(svg, format);
      const extension = getImageExtension(format);
      const newFilename = filename.replace(SVG_EXTENSION_REGEX, extension);
      downloadBlob(blob, newFilename);
    },
    [svg, filename]
  );

  const onCopy = useCallback(
    async (format: ImageFormat) => {
      const blob = await convertSvgToImageBlob(svg, format);
      await copyImageAsDataUrl(blob);
    },
    [svg]
  );

  const actionHandler = useActionHandler<ImageFormat>({
    onDownload,
    onCopy,
    getSuccessMessage: (action, format) =>
      action === "download"
        ? `Downloaded as ${IMAGE_FORMAT_LABELS[format]}`
        : `${IMAGE_FORMAT_LABELS[format]} copied to clipboard as data URL`,
    getErrorMessage: (action, format) =>
      action === "download"
        ? `Failed to download ${IMAGE_FORMAT_LABELS[format]}`
        : `Failed to copy ${IMAGE_FORMAT_LABELS[format]}`,
  });

  return actionHandler;
}
