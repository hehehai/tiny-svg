import { Button } from "@tiny-svg/ui/components/button";
import { memo } from "react";
import { BaseItem } from "@/ui/components/items/base-item";
import { useSvgActions } from "@/ui/hooks/items/use-svg-actions";
import type { SvgItem as SvgItemType } from "@/ui/store";

interface SvgItemProps {
  item: SvgItemType;
  onPreview: () => void;
}

export const SvgItem = memo(function SvgItemComponent({
  item,
  onPreview,
}: SvgItemProps) {
  const svg = item.compressedSvg || item.originalSvg;
  const { handleCopy, handleDownload } = useSvgActions(svg, item.name);

  const actions = (
    <div className="flex gap-1">
      <Button
        aria-label="Copy SVG"
        className="size-6 rounded-lg"
        onClick={handleCopy}
        size="icon"
        title="Copy SVG"
        type="button"
        variant="ghost"
      >
        <span className="i-hugeicons-copy-01 size-3.5" />
      </Button>
      <Button
        aria-label="Download SVG"
        className="size-6 rounded-lg"
        onClick={handleDownload}
        size="icon"
        title="Download SVG"
        type="button"
        variant="ghost"
      >
        <span className="i-hugeicons-download-01 size-3.5" />
      </Button>
    </div>
  );

  return (
    <BaseItem
      actions={actions}
      item={item}
      onThumbnailClick={onPreview}
      showPresetSelector
    />
  );
});
