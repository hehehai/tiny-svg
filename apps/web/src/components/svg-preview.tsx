import { Button } from "@tiny-svg/ui/components/button";
import { useState } from "react";
import { SvgSizeAdjuster } from "@/components/svg-size-adjuster";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useLongPress } from "@/hooks/use-long-press";
import { useSvgPanZoom } from "@/hooks/use-svg-pan-zoom";
import {
  flipHorizontal,
  flipVertical,
  resizeSvg,
  rotateSvg,
} from "@/lib/svg-transform";
import { cn } from "@/lib/utils";
import { useSvgStore } from "@/store/svg-store";

type SvgPreviewProps = {
  svg: string;
  title: string;
  className?: string;
};

const ZOOM_SCALE_DIVISOR = 100;

type BackgroundStyle =
  | "transparent-light"
  | "transparent-dark"
  | "solid-light"
  | "solid-dark";

const BACKGROUND_STYLES: Record<
  BackgroundStyle,
  { label: string; className: string; icon: string }
> = {
  "transparent-light": {
    label: "Transparent Light",
    className:
      "bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]",
    icon: "i-hugeicons-grid",
  },
  "transparent-dark": {
    label: "Transparent Dark",
    className:
      "bg-[linear-gradient(45deg,#333_25%,transparent_25%,transparent_75%,#333_75%,#333),linear-gradient(45deg,#333_25%,transparent_25%,transparent_75%,#333_75%,#333)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] bg-gray-900",
    icon: "i-hugeicons-grid",
  },
  "solid-light": {
    label: "Solid Light",
    className: "bg-white",
    icon: "i-hugeicons-sun-03",
  },
  "solid-dark": {
    label: "Solid Dark",
    className: "bg-gray-900",
    icon: "i-hugeicons-moon-02",
  },
};

export function SvgPreview({ svg, title, className }: SvgPreviewProps) {
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

  const [backgroundStyle, setBackgroundStyle] =
    useLocalStorage<BackgroundStyle>(
      "svg-preview-background",
      "transparent-light"
    );

  const [showSizeAdjuster, setShowSizeAdjuster] = useState(false);
  const [showViewBoxOutline, setShowViewBoxOutline] = useLocalStorage(
    "svg-preview-viewbox-outline",
    false
  );
  const { applyTransformation } = useSvgStore();

  const zoomInLongPress = useLongPress({
    onLongPress: handleZoomIn,
    onClick: handleZoomIn,
    disabled: zoom >= maxZoom,
  });

  const zoomOutLongPress = useLongPress({
    onLongPress: handleZoomOut,
    onClick: handleZoomOut,
    disabled: zoom <= minZoom,
  });

  const cycleBackground = () => {
    const styles: BackgroundStyle[] = [
      "transparent-light",
      "transparent-dark",
      "solid-light",
      "solid-dark",
    ];
    const currentIndex = styles.indexOf(backgroundStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    if (styles[nextIndex]) {
      setBackgroundStyle(styles[nextIndex]);
    }
  };

  const handleRotate = () => {
    const rotated = rotateSvg(svg);
    applyTransformation(rotated);
  };

  const handleFlipHorizontal = () => {
    const flipped = flipHorizontal(svg);
    applyTransformation(flipped);
  };

  const handleFlipVertical = () => {
    const flipped = flipVertical(svg);
    applyTransformation(flipped);
  };

  const handleResize = (newWidth: number, newHeight: number) => {
    const resized = resizeSvg(svg, newWidth, newHeight);
    applyTransformation(resized);
    setShowSizeAdjuster(false);
  };

  if (!svg) {
    return (
      <div className={cn("flex h-full flex-col", className)}>
        <div className="flex items-center justify-between border-b p-2">
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          No SVG to preview
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center justify-between border-b bg-muted/30 p-2">
        <h3 className="font-medium text-sm">{title}</h3>
        <div className="flex items-center gap-1">
          <Button
            onClick={handleRotate}
            size="sm"
            title="Rotate 90°"
            type="button"
            variant="outline"
          >
            <i className="i-hugeicons-rotate-clockwise size-4" />
          </Button>
          <Button
            onClick={handleFlipHorizontal}
            size="sm"
            title="Flip horizontal"
            type="button"
            variant="outline"
          >
            <i className="i-hugeicons-image-flip-horizontal size-4" />
          </Button>
          <Button
            onClick={handleFlipVertical}
            size="sm"
            title="Flip vertical"
            type="button"
            variant="outline"
          >
            <i className="i-hugeicons-image-flip-vertical size-4" />
          </Button>
          <div className="relative">
            <Button
              onClick={() => setShowSizeAdjuster(!showSizeAdjuster)}
              size="sm"
              title="Adjust size"
              type="button"
              variant="outline"
            >
              <i className="i-hugeicons-resize-01 size-4" />
            </Button>
            {showSizeAdjuster && (
              <SvgSizeAdjuster
                onApply={handleResize}
                onCancel={() => setShowSizeAdjuster(false)}
                svg={svg}
              />
            )}
          </div>
          <div className="mx-1 h-4 w-px bg-border" />
          <Button
            onClick={() => setShowViewBoxOutline(!showViewBoxOutline)}
            size="sm"
            title="Show viewBox outline"
            type="button"
            variant="outline"
          >
            <i
              className={cn(
                "size-4",
                showViewBoxOutline
                  ? "i-hugeicons-border-none-01"
                  : "i-hugeicons-border-none-02"
              )}
            />
          </Button>
          <Button
            onClick={cycleBackground}
            size="sm"
            title={BACKGROUND_STYLES[backgroundStyle].label}
            type="button"
            variant="outline"
          >
            <i
              className={cn(BACKGROUND_STYLES[backgroundStyle].icon, "size-4")}
            />
          </Button>
          <div className="mx-1 h-4 w-px bg-border" />
          <Button
            disabled={zoom <= minZoom}
            {...zoomOutLongPress}
            size="sm"
            title="Zoom out (hold for continuous zoom)"
            type="button"
            variant="outline"
          >
            <i className="i-hugeicons-zoom-out-area size-4" />
          </Button>
          <span className="w-16 px-2 text-center font-mono text-muted-foreground text-xs">
            {zoom}%
          </span>
          <Button
            disabled={zoom >= maxZoom}
            {...zoomInLongPress}
            size="sm"
            title="Zoom in (hold for continuous zoom)"
            type="button"
            variant="outline"
          >
            <i className="i-hugeicons-zoom-in-area size-4" />
          </Button>
          <Button
            onClick={handleZoomReset}
            size="sm"
            title="Reset zoom"
            type="button"
            variant="outline"
          >
            <i className="i-hugeicons-image-actual-size size-4" />
          </Button>
        </div>
      </div>
      <button
        aria-label="SVG preview canvas - use mouse wheel to zoom, click and drag to pan"
        className={cn(
          "relative flex-1 overflow-hidden border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring",
          BACKGROUND_STYLES[backgroundStyle].className,
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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
    </div>
  );
}
