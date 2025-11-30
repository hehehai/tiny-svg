import { Button } from "@tiny-svg/ui/components/button";
import { copyToClipboard, downloadSvg } from "@tiny-svg/utils";
import { toast } from "sonner";
import { BaseItem } from "@/ui/components/items/base-item";
import type { SvgItem as SvgItemType } from "@/ui/store";

interface SvgItemProps {
  item: SvgItemType;
  onPreview: () => void;
}

export function SvgItem({ item, onPreview }: SvgItemProps) {
  const handleCopy = async () => {
    try {
      const svg = item.compressedSvg || item.originalSvg;
      await copyToClipboard(svg);
      toast.success("SVG copied to clipboard");
    } catch (error) {
      console.error("Failed to copy SVG:", error);
      toast.error("Failed to copy SVG");
    }
  };

  const handleDownload = () => {
    try {
      const svg = item.compressedSvg || item.originalSvg;
      downloadSvg(svg, `${item.name}.svg`);
      toast.success("SVG downloaded");
    } catch (error) {
      console.error("Failed to download SVG:", error);
      toast.error("Failed to download SVG");
    }
  };

  const actions = (
    <div className="flex gap-1">
      <Button
        aria-label="Copy SVG"
        onClick={handleCopy}
        size="icon"
        title="Copy SVG"
        variant="ghost"
      >
        <span className="i-hugeicons-copy-01 size-4" />
      </Button>
      <Button
        aria-label="Download SVG"
        onClick={handleDownload}
        size="icon"
        title="Download SVG"
        variant="ghost"
      >
        <span className="i-hugeicons-download-01 size-4" />
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
}
