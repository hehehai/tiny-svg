import { Sheet, SheetContent } from "@tiny-svg/ui/components/sheet";
import { memo } from "react";
import { usePluginStore } from "@/ui/store";
import { IconFontsContent } from "./icon-fonts-content";
import { IconFontsFooter } from "./icon-fonts-footer";
import { IconFontsHeader } from "./icon-fonts-header";

export const IconFontsDrawer = memo(function IconFontsDrawerComponent() {
  const { iconFontsDrawer, closeIconFontsDrawer } = usePluginStore();

  return (
    <Sheet
      onOpenChange={(open) => !open && closeIconFontsDrawer()}
      open={iconFontsDrawer.isOpen}
    >
      <SheetContent
        className="flex h-screen w-full flex-col gap-0 p-0 sm:max-w-full"
        hideDefaultClose={true}
        side="left"
      >
        <IconFontsHeader />
        <IconFontsContent />
        <IconFontsFooter />
      </SheetContent>
    </Sheet>
  );
});

export default IconFontsDrawer;
