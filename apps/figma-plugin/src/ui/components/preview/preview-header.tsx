import { Badge } from "@tiny-svg/ui/components/badge";
import { Button } from "@tiny-svg/ui/components/button";
import { Input } from "@tiny-svg/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tiny-svg/ui/components/select";
import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@tiny-svg/ui/components/sheet";
import { useState } from "react";
import type { SvgItem } from "@/ui/store";
import { usePluginStore } from "@/ui/store";

interface PreviewHeaderProps {
  item: SvgItem;
}

export function PreviewHeader({ item }: PreviewHeaderProps) {
  const { updateItem, setPreviewPreset, compressSingleItem, presets } =
    usePluginStore();
  const [itemName, setItemName] = useState(item.name);

  const handleNameBlur = () => {
    if (itemName.trim() && itemName !== item.name) {
      updateItem(item.id, { name: itemName.trim() });
    } else if (!itemName.trim()) {
      // Revert if empty
      setItemName(item.name);
    }
  };

  const handlePresetChange = async (presetId: string) => {
    // Update preset
    setPreviewPreset(item.id, presetId);

    // Auto-compress since preview is open
    await compressSingleItem(item.id);
  };

  const formatCompressionRatio = (ratio: number | undefined): string => {
    if (!ratio) {
      return "";
    }
    return `-${Math.round(ratio * 100)}%`;
  };

  return (
    <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b px-3 py-2">
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <SheetTitle className="shrink-0 font-semibold text-base">
          预览
        </SheetTitle>
        <SheetDescription className="sr-only">预览</SheetDescription>

        <Input
          className="h-7 max-w-[100px]"
          onBlur={handleNameBlur}
          onChange={(e) => setItemName(e.target.value)}
          title={itemName}
          value={itemName}
        />
      </div>

      <div className="flex items-center gap-1">
        {item.compressedSvg && item.compressionRatio !== undefined && (
          <Badge
            className="bg-success px-1 text-success-foreground text-xs"
            variant="default"
          >
            {formatCompressionRatio(item.compressionRatio)}
          </Badge>
        )}

        <Select onValueChange={handlePresetChange} value={item.preset}>
          <SelectTrigger className="h-7 w-24 rounded-lg px-2 py-1" size="xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-[120px] rounded-lg">
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

        <SheetClose asChild>
          <Button
            aria-label="Close"
            className="size-7 hover:border-accent"
            size="icon"
            title="Close"
            type="button"
            variant="outline"
          >
            <i className="i-hugeicons-cancel-01 size-4" />
          </Button>
        </SheetClose>
      </div>
    </SheetHeader>
  );
}
