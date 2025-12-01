import { cn } from "@tiny-svg/ui/lib/utils";
import React from "react";
import { useSvgPanZoom } from "@/ui/hooks/use-svg-pan-zoom";
import {
  BACKGROUND_STYLES,
  ZOOM_SCALE_DIVISOR,
} from "@/ui/lib/svg-preview-helpers";
import { usePluginStore } from "@/ui/store";

interface PreviewCanvasProps {
  svg: string;
  onZoomDataChange?: (data: {
    zoom: number;
    minZoom: number;
    maxZoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomReset: () => void;
  }) => void;
}

export function PreviewCanvas({ svg, onZoomDataChange }: PreviewCanvasProps) {
  const { previewModal } = usePluginStore();

  const {
    zoom,
    pan,
    isDragging,
    containerRef,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    minZoom,
    maxZoom,
  } = useSvgPanZoom();

  // Notify parent of zoom data changes
  React.useEffect(() => {
    onZoomDataChange?.({
      zoom,
      minZoom,
      maxZoom,
      onZoomIn: handleZoomIn,
      onZoomOut: handleZoomOut,
      onZoomReset: handleZoomReset,
    });
  }, [
    zoom,
    minZoom,
    maxZoom,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    onZoomDataChange,
  ]);

  const backgroundStyle = previewModal.backgroundStyle;
  const showViewBoxOutline = previewModal.showViewBoxOutline;

  if (!svg) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        No SVG to preview
      </div>
    );
  }

  const currentBgStyle = BACKGROUND_STYLES[backgroundStyle];

  // Wrap handlers to prevent event propagation to Sheet
  const handleMouseDownWithStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleMouseDown(e);
  };

  const handleMouseMoveWithStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleMouseMove(e);
  };

  const handleMouseUpWithStop = () => {
    handleMouseUp();
  };

  const handleMouseLeaveWithStop = () => {
    handleMouseLeave();
  };

  return (
    <button
      aria-label="SVG preview canvas - use mouse wheel to zoom, click and drag to pan"
      className={cn(
        "relative flex-1 overflow-hidden border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring",
        currentBgStyle.className,
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      onMouseDown={handleMouseDownWithStop}
      onMouseLeave={handleMouseLeaveWithStop}
      onMouseMove={handleMouseMoveWithStop}
      onMouseUp={handleMouseUpWithStop}
      ref={containerRef}
      type="button"
    >
      <div
        className="svg-preview-container absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
          transition: isDragging ? "none" : "transform 0.1s ease-out",
        }}
      >
        <div
          className={cn(
            "pointer-events-none relative select-none",
            showViewBoxOutline && "svg-view-outline"
          )}
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{
            transform: `scale(${zoom / ZOOM_SCALE_DIVISOR})`,
            transition: "transform 0.2s ease-out",
          }}
        />
      </div>
    </button>
  );
}
