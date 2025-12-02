import { memo, useCallback, useMemo } from "react";
import { BaseItem } from "@/ui/components/items/base-item";
import { ActionButton } from "@/ui/components/items/shared/action-button";
import { useImageActions } from "@/ui/hooks/items/use-image-actions";
import {
  IMAGE_FORMAT_LABELS,
  type ImageFormat,
} from "@/ui/lib/format-converters";
import type { SvgItem as SvgItemType } from "@/ui/store";

interface ImageItemProps {
  item: SvgItemType;
  onPreview: () => void;
}

const IMAGE_FORMATS: ImageFormat[] = ["png", "jpeg", "webp", "ico"];

export const ImageItem = memo(function ImageItemComponent({
  item,
  onPreview,
}: ImageItemProps) {
  const svg = item.compressedSvg || item.originalSvg;
  const { isLoading, handleDownload, handleCopy } = useImageActions(
    svg,
    item.name
  );

  const FormatButton = useCallback(
    ({ format }: { format: ImageFormat }) => {
      const loading =
        isLoading(format, "download") || isLoading(format, "copy");

      return (
        <ActionButton
          buttonClassName="h-6 rounded-lg"
          isLoading={loading}
          label={IMAGE_FORMAT_LABELS[format]}
          onCopy={() => handleCopy(format)}
          onDownload={() => handleDownload(format)}
        />
      );
    },
    [isLoading, handleDownload, handleCopy]
  );

  const actions = useMemo(
    () => (
      <div className="grid w-32 grid-cols-2 gap-1">
        {IMAGE_FORMATS.map((format) => (
          <FormatButton format={format} key={format} />
        ))}
      </div>
    ),
    [FormatButton]
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
});
