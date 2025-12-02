import { Sheet, SheetContent } from "@tiny-svg/ui/components/sheet";
import { memo, useEffect, useState } from "react";
import { usePluginStore } from "@/ui/store";
import { PreviewContent } from "./preview-content";
import { PreviewFooter } from "./preview-footer";
import { PreviewHeader } from "./preview-header";

export const PreviewDrawer = memo(function PreviewDrawerComponent() {
  const { previewModal, closePreview, items } = usePluginStore();
  const { isOpen, itemId, codeViewMode } = previewModal;

  const item = items.find((i) => i.id === itemId);

  // View tab state
  const [zoomData, setZoomData] = useState<{
    zoom: number;
    minZoom: number;
    maxZoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
  } | null>(null);

  // Code tab state
  const [codeData, setCodeData] = useState<any>(null);

  // Reset code data when switching code view mode
  // biome-ignore lint/correctness/useExhaustiveDependencies: We intentionally reset on codeViewMode change
  useEffect(() => {
    setCodeData(null);
  }, [codeViewMode]);

  // Auto-close if item is deleted
  useEffect(() => {
    if (isOpen && !item) {
      closePreview();
    }
  }, [isOpen, item, closePreview]);

  if (!item) {
    return null;
  }

  return (
    <Sheet onOpenChange={(open) => !open && closePreview()} open={isOpen}>
      <SheetContent
        className="flex h-screen w-full flex-col gap-0 p-0 sm:max-w-full"
        hideDefaultClose={true}
        side="left"
      >
        <PreviewHeader item={item} />
        <PreviewContent
          item={item}
          onCodeDataChange={setCodeData}
          onZoomDataChange={setZoomData}
        />
        <PreviewFooter
          canPrettify={
            codeData?.isPrettified === false && codeViewMode !== "diff"
          }
          isPrettified={codeData?.isPrettified}
          maxZoom={zoomData?.maxZoom}
          minZoom={zoomData?.minZoom}
          onCopy={codeData?.onCopy}
          onPrettify={codeData?.onPrettify}
          onZoomIn={zoomData?.onZoomIn}
          onZoomOut={zoomData?.onZoomOut}
          onZoomReset={zoomData?.onZoomReset}
          zoom={zoomData?.zoom}
        />
      </SheetContent>
    </Sheet>
  );
});

export default PreviewDrawer;
