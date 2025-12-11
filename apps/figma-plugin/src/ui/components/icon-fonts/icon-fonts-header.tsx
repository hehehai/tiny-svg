import { Button } from "@tiny-svg/ui/components/button";
import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@tiny-svg/ui/components/sheet";
import { memo } from "react";
import { usePluginStore } from "@/ui/store";

export const IconFontsHeader = memo(function IconFontsHeaderComponent() {
  const { items, iconFontsDrawer, selectAllIcons, deselectAllIcons } =
    usePluginStore();

  const selectedCount = iconFontsDrawer.selectedIconIds.length;
  const totalCount = items.length;
  const allSelected = selectedCount === totalCount;

  return (
    <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b px-3 py-2">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <SheetTitle className="shrink-0 font-semibold text-base">
          Icon Fonts
        </SheetTitle>
        <SheetDescription className="sr-only">
          Icon Fonts Configuration
        </SheetDescription>
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            {selectedCount} / {totalCount}
          </span>
          <Button
            className="h-7 px-2 py-1 text-xs hover:border-accent"
            onClick={allSelected ? deselectAllIcons : selectAllIcons}
            size="sm"
            type="button"
            variant="outline"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
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
});
