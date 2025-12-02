import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tiny-svg/ui/components/select";
import { memo, type ReactNode, useCallback, useEffect, useState } from "react";
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

const Thumbnail = memo(function ThumbnailComponent({
  itemId,
  svg,
  name,
  onClick,
  ariaLabel,
}: {
  itemId: string;
  svg: string;
  name: string;
  onClick?: () => void;
  ariaLabel: string;
}) {
  const [thumbnail, setThumbnail] = useState<string>();
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(true);

  useEffect(() => {
    const cached = thumbnailCache.get(itemId);
    if (cached) {
      setThumbnail(cached);
      setIsLoadingThumbnail(false);
      return;
    }

    setIsLoadingThumbnail(true);
    try {
      const url = generateThumbnail(svg);
      thumbnailCache.set(itemId, url);
      setThumbnail(url);
    } catch (error) {
      console.error("Failed to generate thumbnail:", error);
    } finally {
      setIsLoadingThumbnail(false);
    }
  }, [itemId, svg]);

  const renderContent = () => {
    if (isLoadingThumbnail) {
      return <div className="size-full animate-pulse bg-muted" />;
    }
    if (thumbnail) {
      return (
        <img
          alt={name}
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
    <button
      aria-label={ariaLabel}
      className="size-[52px] shrink-0 cursor-pointer overflow-hidden rounded bg-foreground/10 p-1 transition-colors hover:border-ring"
      onClick={onClick}
      type="button"
    >
      {renderContent()}
    </button>
  );
});

const PresetSelector = memo(function PresetSelectorComponent({
  value,
  onChange,
  inheritLabel,
  presets,
}: {
  value: string;
  onChange: (value: string) => void;
  inheritLabel: string;
  presets: Array<{ id: string; name: string }>;
}) {
  return (
    <Select onValueChange={onChange} value={value}>
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
          {inheritLabel}
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
  );
});

export const BaseItem = memo(function BaseItemComponent({
  item,
  showPresetSelector = true,
  sizeDisplayMode = "full",
  actions,
  onThumbnailClick,
}: BaseItemProps) {
  const { t } = useTranslation();
  const { presets, updateItem } = usePluginStore();

  const handlePresetChange = useCallback(
    (presetId: string) => {
      updateItem(item.id, { preset: presetId });
    },
    [item.id, updateItem]
  );

  const svg = item.compressedSvg || item.originalSvg;
  const thumbnailAriaLabel = t("preview.ariaLabels.previewButton").replace(
    "{name}",
    item.name
  );

  return (
    <div className="flex gap-2 rounded-lg border border-border bg-background p-2">
      <Thumbnail
        ariaLabel={thumbnailAriaLabel}
        itemId={item.id}
        name={item.name}
        onClick={onThumbnailClick}
        svg={svg}
      />

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
        <div className="truncate text-sm" title={item.name}>
          {item.name}
        </div>

        <div className="flex items-center gap-1.5">
          {showPresetSelector && (
            <PresetSelector
              inheritLabel={t("common.inherit")}
              onChange={handlePresetChange}
              presets={presets}
              value={item.preset}
            />
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
});
