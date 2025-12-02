import { Button } from "@tiny-svg/ui/components/button";
import { ButtonGroup } from "@tiny-svg/ui/components/button-group";
import {
  copyToClipboard,
  downloadBlob,
  svgToIcoBlob,
  svgToJpegBlob,
  svgToPngBlob,
  svgToWebpBlob,
} from "@tiny-svg/utils";
import { useState } from "react";
import { toast } from "sonner";
import { BaseItem } from "@/ui/components/items/base-item";
import type { SvgItem as SvgItemType } from "@/ui/store";

interface ImageItemProps {
  item: SvgItemType;
  onPreview: () => void;
}

type ImageFormat = "png" | "jpeg" | "webp" | "ico";

// Regex constant for file extension replacement
const SVG_EXTENSION_REGEX = /\.svg$/i;

/**
 * Copy image blob as base64 data URL to clipboard
 * Figma plugin environment doesn't support ClipboardItem API
 */
async function copyImageToClipboard(blob: Blob): Promise<void> {
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

export function ImageItem({ item, onPreview }: ImageItemProps) {
  const [loadingFormat, setLoadingFormat] = useState<string | null>(null);

  const svg = item.compressedSvg || item.originalSvg;

  const handleDownload = async (format: ImageFormat) => {
    try {
      setLoadingFormat(`${format}-download`);

      let blob: Blob;
      let extension: string;

      switch (format) {
        case "png":
          blob = await svgToPngBlob(svg);
          extension = ".png";
          break;
        case "jpeg":
          blob = await svgToJpegBlob(svg);
          extension = ".jpg";
          break;
        case "webp":
          blob = await svgToWebpBlob(svg);
          extension = ".webp";
          break;
        case "ico":
          blob = await svgToIcoBlob(svg);
          extension = ".ico";
          break;
        default:
          throw new Error(`Unknown format: ${format}`);
      }

      const fileName = item.name.replace(SVG_EXTENSION_REGEX, extension);
      downloadBlob(blob, fileName);
      toast.success(`Downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Failed to download ${format}:`, error);
      toast.error(`Failed to download ${format.toUpperCase()}`);
    } finally {
      setLoadingFormat(null);
    }
  };

  const handleCopy = async (format: ImageFormat) => {
    try {
      setLoadingFormat(`${format}-copy`);

      let blob: Blob;

      switch (format) {
        case "png":
          blob = await svgToPngBlob(svg);
          break;
        case "jpeg":
          blob = await svgToJpegBlob(svg);
          break;
        case "webp":
          blob = await svgToWebpBlob(svg);
          break;
        case "ico":
          blob = await svgToIcoBlob(svg);
          break;
        default:
          throw new Error(`Unknown format: ${format}`);
      }

      await copyImageToClipboard(blob);
      toast.success(`${format.toUpperCase()} copied to clipboard as data URL`);
    } catch (error) {
      console.error(`Failed to copy ${format}:`, error);
      toast.error(`Failed to copy ${format.toUpperCase()}`);
    } finally {
      setLoadingFormat(null);
    }
  };

  const FormatButton = ({ format }: { format: ImageFormat }) => {
    const isDownloadLoading = loadingFormat === `${format}-download`;
    const isCopyLoading = loadingFormat === `${format}-copy`;
    const isLoading = isDownloadLoading || isCopyLoading;

    return (
      <div className="group relative w-full">
        <Button
          className="h-7 w-full font-medium text-xs group-hover:text-transparent"
          size="sm"
          type="button"
          variant="outline"
        >
          {format.toUpperCase()}
        </Button>
        <ButtonGroup className="absolute inset-0 hidden h-full w-full group-hover:flex">
          <Button
            aria-label={`Download ${format}`}
            className="h-7 grow p-0"
            disabled={isLoading}
            onClick={() => handleDownload(format)}
            title={`Download ${format}`}
            type="button"
            variant="outline"
          >
            <span className="i-hugeicons-download-01 size-4" />
          </Button>
          <Button
            aria-label={`Copy ${format}`}
            className="h-7 grow p-0"
            disabled={isLoading}
            onClick={() => handleCopy(format)}
            title={`Copy ${format}`}
            type="button"
            variant="outline"
          >
            <span className="i-hugeicons-copy-01 size-4" />
          </Button>
        </ButtonGroup>
      </div>
    );
  };

  const actions = (
    <div className="grid w-32 grid-cols-2 gap-1">
      <FormatButton format="png" />
      <FormatButton format="jpeg" />
      <FormatButton format="webp" />
      <FormatButton format="ico" />
    </div>
  );

  return (
    <BaseItem
      actions={actions}
      item={item}
      onThumbnailClick={onPreview}
      showPresetSelector
      sizeDisplayMode="compression-only"
    />
  );
}
