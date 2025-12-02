import { Button } from "@tiny-svg/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tiny-svg/ui/components/dropdown-menu";
import { memo, useCallback, useMemo } from "react";
import { BaseItem } from "@/ui/components/items/base-item";
import { ActionButton } from "@/ui/components/items/shared/action-button";
import { DropdownActionItem } from "@/ui/components/items/shared/dropdown-action-item";
import { useCodeActions } from "@/ui/hooks/items/use-code-actions";
import {
  CODE_FORMAT_LABELS,
  type CodeFormat,
} from "@/ui/lib/format-converters";
import type { SvgItem as SvgItemType } from "@/ui/store";

interface CodeItemProps {
  item: SvgItemType;
  onPreview: () => void;
}

const QUICK_FORMATS: CodeFormat[] = ["base64", "react-tsx", "react-jsx"];
const DROPDOWN_FORMATS: CodeFormat[] = [
  "data-url",
  "vue",
  "svelte",
  "react-native",
  "flutter",
];

export const CodeItem = memo(function CodeItemComponent({
  item,
  onPreview,
}: CodeItemProps) {
  const svg = item.compressedSvg || item.originalSvg;
  const { isLoading, handleDownload, handleCopy } = useCodeActions(
    svg,
    item.name
  );

  const QuickActionButton = useCallback(
    ({ format }: { format: CodeFormat }) => {
      const loading =
        isLoading(format, "download") || isLoading(format, "copy");

      return (
        <ActionButton
          isLoading={loading}
          label={CODE_FORMAT_LABELS[format]}
          onCopy={() => handleCopy(format)}
          onDownload={() => handleDownload(format)}
        />
      );
    },
    [isLoading, handleDownload, handleCopy]
  );

  const DropdownFormatItem = useCallback(
    ({ format }: { format: CodeFormat }) => {
      const loading =
        isLoading(format, "download") || isLoading(format, "copy");

      return (
        <DropdownActionItem
          isLoading={loading}
          label={CODE_FORMAT_LABELS[format]}
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
        {QUICK_FORMATS.map((format) => (
          <QuickActionButton format={format} key={format} />
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="More code formats"
              className="h-7 w-full rounded-lg pr-1 pl-2"
              size="sm"
              title="More code formats"
              type="button"
              variant="outline"
            >
              <span className="font-medium text-xs">More</span>
              <span className="i-hugeicons-arrow-down-01 size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-28 space-y-1 rounded-lg p-1.5"
          >
            {DROPDOWN_FORMATS.map((format) => (
              <DropdownMenuItem
                className="cursor-default p-0 hover:bg-accent focus:bg-transparent"
                key={format}
                onSelect={(e) => e.preventDefault()}
              >
                <DropdownFormatItem format={format} />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    [QuickActionButton, DropdownFormatItem]
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
