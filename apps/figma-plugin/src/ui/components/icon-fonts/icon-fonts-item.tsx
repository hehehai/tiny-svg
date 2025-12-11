import { Input } from "@tiny-svg/ui/components/input";
import { memo, useEffect, useState } from "react";
import { generateThumbnail } from "@/ui/lib/thumbnail";
import { thumbnailCache } from "@/ui/lib/thumbnail-cache";
import { cn } from "@/ui/lib/utils";
import type { SvgItem } from "@/ui/store";
import { usePluginStore } from "@/ui/store";

interface IconFontsItemProps {
  item: SvgItem;
}

export const IconFontsItem = memo(function IconFontsItemComponent({
  item,
}: IconFontsItemProps) {
  const { iconFontsDrawer, toggleIconSelection, updateIconName } =
    usePluginStore();
  const [thumbnail, setThumbnail] = useState<string>();
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(true);

  const isSelected = iconFontsDrawer.selectedIconIds.includes(item.id);
  const iconName = iconFontsDrawer.iconNames[item.id] || "";
  const svg = item.compressedSvg || item.originalSvg;

  useEffect(() => {
    const cached = thumbnailCache.get(item.id);
    if (cached) {
      setThumbnail(cached);
      setIsLoadingThumbnail(false);
      return;
    }

    setIsLoadingThumbnail(true);
    try {
      const url = generateThumbnail(svg);
      thumbnailCache.set(item.id, url);
      setThumbnail(url);
    } catch (error) {
      console.error("Failed to generate thumbnail:", error);
    } finally {
      setIsLoadingThumbnail(false);
    }
  }, [item.id, svg]);

  const renderThumbnail = () => {
    if (isLoadingThumbnail) {
      return <div className="size-full animate-pulse bg-muted" />;
    }
    if (thumbnail) {
      return (
        <img
          alt={item.name}
          className="size-full object-contain"
          height={80}
          src={thumbnail}
          width={80}
        />
      );
    }
    return (
      <div className="flex size-full items-center justify-center bg-muted text-2xl text-muted-foreground/30">
        ?
      </div>
    );
  };

  const handleItemClick = () => {
    toggleIconSelection(item.id);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    // Prevent item click when interacting with input
    e.stopPropagation();
  };

  const handleInputFocus = (e: React.FocusEvent) => {
    // Prevent item click when focusing input
    e.stopPropagation();
  };

  return (
    <button
      className={cn(
        "relative flex w-full cursor-pointer gap-2 rounded-lg border p-2 text-left transition-colors hover:border-accent",
        isSelected ? "border-accent" : ""
      )}
      onClick={handleItemClick}
      type="button"
    >
      {isSelected && (
        <div className="absolute top-0.5 left-0.5 flex size-3 items-center justify-center rounded-full bg-primary">
          <i className="i-hugeicons-tick-02 size-2 text-primary-foreground" />
        </div>
      )}

      <div className="flex items-start gap-2">
        <div className="relative flex-1">
          <div className="relative size-12 overflow-hidden rounded bg-foreground/10 p-2">
            {renderThumbnail()}
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col justify-between">
        <div className="text-muted-foreground text-xs">{item.name}</div>
        <Input
          className="h-6 px-2 py-1 text-xs"
          id={`name-${item.id}`}
          onChange={(e) => updateIconName(item.id, e.target.value)}
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          placeholder="icon-name"
          value={iconName}
        />
      </div>
    </button>
  );
});
