import type { SvgItem } from "@/ui/store";
import { usePluginStore } from "@/ui/store";
import { PreviewCanvas } from "./preview-canvas";
import { PreviewCode } from "./preview-code";

interface PreviewContentProps {
  item: SvgItem;
  onZoomDataChange?: (data: any) => void;
  onCodeDataChange?: (data: any) => void;
  wrapLines?: boolean;
  maxLineWidth?: number | "auto";
}

export function PreviewContent({
  item,
  onZoomDataChange,
  onCodeDataChange,
  wrapLines = true,
  maxLineWidth = "auto",
}: PreviewContentProps) {
  const { previewModal } = usePluginStore();
  const activeTab = previewModal.activeTab;

  // Get the SVG to display (prefer compressed if available)
  const svgToPreview = item.compressedSvg || item.originalSvg;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {activeTab === "view" && (
        <PreviewCanvas onZoomDataChange={onZoomDataChange} svg={svgToPreview} />
      )}
      {activeTab === "code" && (
        <PreviewCode
          compressedSvg={item.compressedSvg}
          maxLineWidth={maxLineWidth}
          onCodeDataChange={onCodeDataChange}
          originalSvg={item.originalSvg}
          wrapLines={wrapLines}
        />
      )}
    </div>
  );
}
