import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tiny-svg/ui/components/select";
import { type ReactNode, useEffect, useState } from "react";
import { generateThumbnail } from "@/ui/lib/thumbnail";
import { thumbnailCache } from "@/ui/lib/thumbnail-cache";
import type { SvgItem } from "@/ui/store";
import { usePluginStore } from "@/ui/store";

interface BaseItemProps {
  item: SvgItem;
  showPresetSelector?: boolean;
  actions: ReactNode;
  onThumbnailClick?: () => void;
}

export function BaseItem({
  item,
  showPresetSelector = true,
  actions,
  onThumbnailClick,
}: BaseItemProps) {
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

  const formatSize = (bytes: number | undefined): string => {
    if (!bytes) {
      return "-";
    }
    if (bytes < 1024) {
      return `${bytes}B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)}KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const formatCompressionRatio = (ratio: number | undefined): string => {
    if (!ratio) {
      return "";
    }
    return `(-${Math.round(ratio * 100)}%)`;
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
        aria-label={`Preview ${item.name}`}
        className="size-12 shrink-0 cursor-pointer overflow-hidden rounded bg-foreground/10 p-1 transition-colors hover:border-ring"
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
                className="w-fit rounded-lg px-2 py-0"
                onClick={(e) => e.stopPropagation()}
                size="xxs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem
                  className="rounded-md py-1 pr-4 pl-1 text-xs"
                  value="inherit"
                >
                  Inherit
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
            {item.compressedSize ? (
              <>
                <span className="line-through opacity-70">
                  {formatSize(item.originalSize)}
                </span>
                {" → "}
                <span className="font-medium text-foreground">
                  {formatSize(item.compressedSize)}
                </span>{" "}
                <span className="font-semibold text-success">
                  {formatCompressionRatio(item.compressionRatio)}
                </span>
              </>
            ) : (
              <span>{formatSize(item.originalSize)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-1">{actions}</div>
    </div>
  );
}
