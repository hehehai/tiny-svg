import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tiny-svg/ui/components/select";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "@/i18n/hooks";
import { ItemSizeDisplay } from "@/ui/components/items/item-size-display";
import { generateThumbnail } from "@/ui/lib/thumbnail";
import { thumbnailCache } from "@/ui/lib/thumbnail-cache";
import type { SvgItem } from "@/ui/store";
import { usePluginStore } from "@/ui/store";

interface BaseItemProps {
  item: SvgItem;
  showPresetSelector?: boolean;
  sizeDisplayMode?: "full" | "compression-only";
  actions: ReactNode;
  onThumbnailClick?: () => void;
}

export function BaseItem({
  item,
  showPresetSelector = true,
  sizeDisplayMode = "full",
  actions,
  onThumbnailClick,
}: BaseItemProps) {
  const { t } = useTranslation();
  const [thumbnail, setThumbnail] = useState<string>();
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(true);

  const { presets, updateItem } = usePluginStore();

  // Generate thumbnail
  useEffect(() => {
    const cached = thumbnailCache.get(item.id);
    if (cached) {
      setThumbnail(cached);
      setIsLoadingThumbnail(false);
    } else {
      setIsLoadingThumbnail(true);
      const svg = item.compressedSvg || item.originalSvg;
      generateThumbnail(svg, 48)
        .then((url) => {
          thumbnailCache.set(item.id, url);
          setThumbnail(url);
        })
        .catch((error) => {
          console.error("Failed to generate thumbnail:", error);
        })
        .finally(() => {
          setIsLoadingThumbnail(false);
        });
    }
  }, [item.id, item.compressedSvg, item.originalSvg]);

  const handlePresetChange = (presetId: string) => {
    updateItem(item.id, { preset: presetId });
  };

  const renderThumbnail = () => {
    if (isLoadingThumbnail) {
      return <div className="size-full animate-pulse bg-muted" />;
    }
    if (thumbnail) {
      return (
        <img
          alt={item.name}
          className="size-full object-contain"
          height={120}
          src={thumbnail}
          width={120}
        />
      );
    }
    return (
      <div className="flex size-full items-center justify-center bg-muted text-2xl text-muted-foreground/30">
        ?
      </div>
    );
  };

  return (
    <div className="flex gap-2 rounded-lg border border-border bg-background p-2">
      <button
        aria-label={t("preview.ariaLabels.previewButton").replace(
          "{name}",
          item.name
        )}
        className="size-[60px] shrink-0 cursor-pointer overflow-hidden rounded bg-foreground/10 p-1 transition-colors hover:border-ring"
        onClick={onThumbnailClick}
        type="button"
      >
        {renderThumbnail()}
      </button>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
        <div className="truncate text-sm" title={item.name}>
          {item.name}
        </div>

        <div className="flex items-center gap-1.5">
          {showPresetSelector && (
            <Select onValueChange={handlePresetChange} value={item.preset}>
              <SelectTrigger
                className="w-[72px] rounded-lg px-1.5 py-0"
                onClick={(e) => e.stopPropagation()}
                size="xxs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-[72px] rounded-lg">
                <SelectItem
                  className="rounded-md py-1 pr-4 pl-1 text-xs"
                  value="inherit"
                >
                  {t("common.inherit")}
                </SelectItem>
                {presets.map((preset) => (
                  <SelectItem
                    className="rounded-md py-1 pr-4 pl-1 text-xs"
                    key={preset.id}
                    value={preset.id}
                  >
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="text-muted-foreground text-xs">
            <ItemSizeDisplay
              compressedSize={item.compressedSize}
              compressionRatio={item.compressionRatio}
              mode={sizeDisplayMode}
              originalSize={item.originalSize}
            />
          </div>
        </div>
      </div>

      {actions}
    </div>
  );
}
