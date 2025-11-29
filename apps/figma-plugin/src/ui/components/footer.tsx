import { CodeTabFooter } from "@/ui/components/tabs/code-tab-footer";
import { ImageTabFooter } from "@/ui/components/tabs/image-tab-footer";
import { SvgTabFooter } from "@/ui/components/tabs/svg-tab-footer";
import { useItemsCount, usePluginStore } from "@/ui/store";

export function Footer() {
  const activeTab = usePluginStore((state) => state.activeTab);
  const itemsCount = useItemsCount();

  return (
    <>
      <div className="text-muted-foreground text-sm">
        <span className="font-medium">
          {itemsCount} {itemsCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {activeTab === "svg" && <SvgTabFooter />}
        {activeTab === "image" && <ImageTabFooter />}
        {activeTab === "code" && <CodeTabFooter />}
      </div>
    </>
  );
}
