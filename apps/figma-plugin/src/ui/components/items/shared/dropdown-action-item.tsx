import { Button } from "@tiny-svg/ui/components/button";
import { memo } from "react";

interface DropdownActionItemProps {
  label: string;
  onDownload: () => void;
  onCopy: () => void;
  isLoading?: boolean;
}

/**
 * Reusable dropdown action item with inline download/copy buttons
 */
export const DropdownActionItem = memo(function DropdownActionItemComponent({
  label,
  onDownload,
  onCopy,
  isLoading = false,
}: DropdownActionItemProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5">
      <span className="shrink-0 text-xs">{label}</span>
      <div className="flex gap-1">
        <Button
          aria-label={`Download ${label}`}
          className="size-5 rounded"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          size="icon"
          title={`Download ${label}`}
          type="button"
          variant="ghost"
        >
          <span className="i-hugeicons-download-01 size-3" />
        </Button>
        <Button
          aria-label={`Copy ${label}`}
          className="size-5 rounded"
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
            onCopy();
          }}
          size="icon"
          title={`Copy ${label}`}
          type="button"
          variant="ghost"
        >
          <span className="i-hugeicons-copy-01 size-3" />
        </Button>
      </div>
    </div>
  );
});
