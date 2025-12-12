import { Button } from "@tiny-svg/ui/components/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@tiny-svg/ui/components/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tiny-svg/ui/components/tooltip";
import { useState } from "react";
import { useIntlayer } from "react-intlayer";
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
  onCopy?: () => void;
  onDownload?: () => void;
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

type CanvasMenuProps = {
  zoom: number;
  minZoom: number;
  maxZoom: number;
  backgroundStyle: BackgroundStyle;
  onCycleBackground: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onZoomReset: () => void;
};

function CanvasContextMenu({
  zoom,
  minZoom,
  maxZoom,
  backgroundStyle,
  onCycleBackground,
  onZoomOut,
  onZoomIn,
  onZoomReset,
}: CanvasMenuProps) {
  const { preview } = useIntlayer("optimize");

  return (
    <>
      <ContextMenuItem onClick={onCycleBackground}>
        <i className={cn(BACKGROUND_STYLES[backgroundStyle].icon, "size-4")} />
        {preview.toggleBackground}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem disabled={zoom <= minZoom} onClick={onZoomOut}>
        <i className="i-hugeicons-zoom-out-area size-4" />
        {preview.zoomOut}
      </ContextMenuItem>
      <ContextMenuItem disabled={zoom >= maxZoom} onClick={onZoomIn}>
        <i className="i-hugeicons-zoom-in-area size-4" />
        {preview.zoomIn}
      </ContextMenuItem>
      <ContextMenuItem onClick={onZoomReset}>
        <i className="i-hugeicons-image-actual-size size-4" />
        {preview.resetZoom}
      </ContextMenuItem>
    </>
  );
}

type SvgMenuProps = {
  showViewBoxOutline: boolean;
  onCopy?: () => void;
  onDownload?: () => void;
  onRotate: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onToggleOutline: () => void;
};

function SvgContextMenu({
  showViewBoxOutline,
  onCopy,
  onDownload,
  onRotate,
  onFlipHorizontal,
  onFlipVertical,
  onToggleOutline,
}: SvgMenuProps) {
  const { preview } = useIntlayer("optimize");

  return (
    <>
      <ContextMenuItem disabled={!onCopy} onClick={onCopy}>
        <i className="i-hugeicons-copy-01 size-4" />
        {preview.copy}
      </ContextMenuItem>
      <ContextMenuItem disabled={!onDownload} onClick={onDownload}>
        <i className="i-hugeicons-download-01 size-4" />
        {preview.download}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={onRotate}>
        <i className="i-hugeicons-rotate-clockwise size-4" />
        {preview.rotate}
      </ContextMenuItem>
      <ContextMenuItem onClick={onFlipHorizontal}>
        <i className="i-hugeicons-image-flip-horizontal size-4" />
        {preview.flipHorizontal}
      </ContextMenuItem>
      <ContextMenuItem onClick={onFlipVertical}>
        <i className="i-hugeicons-image-flip-vertical size-4" />
        {preview.flipVertical}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={onToggleOutline}>
        <i
          className={cn(
            "size-4",
            showViewBoxOutline
              ? "i-hugeicons-border-none-01"
              : "i-hugeicons-border-none-02"
          )}
        />
        {showViewBoxOutline
          ? preview.hideOutlineShort
          : preview.showOutlineShort}
      </ContextMenuItem>
    </>
  );
}

export function SvgPreview({
  svg,
  title,
  className,
  onCopy,
  onDownload,
}: SvgPreviewProps) {
  const { preview } = useIntlayer("optimize");
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
  const [contextMenuTarget, setContextMenuTarget] = useState<"canvas" | "svg">(
    "canvas"
  );
  const { applyTransformation, originalSvg, compressedSvg } = useSvgStore();

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
    const rotatedOriginal = rotateSvg(originalSvg);
    const rotatedCompressed = rotateSvg(compressedSvg);
    applyTransformation(rotatedOriginal, rotatedCompressed);
  };

  const handleFlipHorizontal = () => {
    const flippedOriginal = flipHorizontal(originalSvg);
    const flippedCompressed = flipHorizontal(compressedSvg);
    applyTransformation(flippedOriginal, flippedCompressed);
  };

  const handleFlipVertical = () => {
    const flippedOriginal = flipVertical(originalSvg);
    const flippedCompressed = flipVertical(compressedSvg);
    applyTransformation(flippedOriginal, flippedCompressed);
  };

  const handleResize = (newWidth: number, newHeight: number) => {
    const resizedOriginal = resizeSvg(originalSvg, newWidth, newHeight);
    const resizedCompressed = resizeSvg(compressedSvg, newWidth, newHeight);
    applyTransformation(resizedOriginal, resizedCompressed);
    setShowSizeAdjuster(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    const button = e.currentTarget as HTMLElement;
    const svgContainer = button.querySelector(".svg-preview-container > div");

    if (svgContainer) {
      const svgRect = svgContainer.getBoundingClientRect();
      const isWithinSvg =
        e.clientX >= svgRect.left &&
        e.clientX <= svgRect.right &&
        e.clientY >= svgRect.top &&
        e.clientY <= svgRect.bottom;

      setContextMenuTarget(isWithinSvg ? "svg" : "canvas");
    } else {
      setContextMenuTarget("canvas");
    }
  };

  if (!svg) {
    return (
      <div className={cn("flex h-full flex-col", className)}>
        <div className="flex items-center justify-between border-b p-2">
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          {preview.noSvg}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center justify-between border-b bg-muted/30 p-2">
        <h3 className="font-medium text-sm">{title}</h3>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleRotate}
                size="sm"
                type="button"
                variant="outline"
              >
                <i className="i-hugeicons-rotate-clockwise size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{preview.rotate}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleFlipHorizontal}
                size="sm"
                type="button"
                variant="outline"
              >
                <i className="i-hugeicons-image-flip-horizontal size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{preview.flipHorizontal}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleFlipVertical}
                size="sm"
                type="button"
                variant="outline"
              >
                <i className="i-hugeicons-image-flip-vertical size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{preview.flipVertical}</TooltipContent>
          </Tooltip>
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowSizeAdjuster(!showSizeAdjuster)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <i className="i-hugeicons-resize-01 size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{preview.adjustSize}</TooltipContent>
            </Tooltip>
            {showSizeAdjuster && (
              <SvgSizeAdjuster
                onApply={handleResize}
                onCancel={() => setShowSizeAdjuster(false)}
                svg={svg}
              />
            )}
          </div>
          <div className="mx-1 h-4 w-px bg-border" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setShowViewBoxOutline(!showViewBoxOutline)}
                size="sm"
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
            </TooltipTrigger>
            <TooltipContent>
              {showViewBoxOutline ? preview.hideOutline : preview.showOutline}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={cycleBackground}
                size="sm"
                type="button"
                variant="outline"
              >
                <i
                  className={cn(
                    BACKGROUND_STYLES[backgroundStyle].icon,
                    "size-4"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {BACKGROUND_STYLES[backgroundStyle].label}
            </TooltipContent>
          </Tooltip>
          <div className="mx-1 h-4 w-px bg-border" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={zoom <= minZoom}
                {...zoomOutLongPress}
                size="sm"
                type="button"
                variant="outline"
              >
                <i className="i-hugeicons-zoom-out-area size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{preview.zoomOut}</TooltipContent>
          </Tooltip>
          <span className="w-16 px-2 text-center font-mono text-muted-foreground text-xs">
            {zoom}%
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={zoom >= maxZoom}
                {...zoomInLongPress}
                size="sm"
                type="button"
                variant="outline"
              >
                <i className="i-hugeicons-zoom-in-area size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{preview.zoomIn}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleZoomReset}
                size="sm"
                type="button"
                variant="outline"
              >
                <i className="i-hugeicons-image-actual-size size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{preview.resetZoom}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <button
            aria-label={String(preview.canvasAriaLabel)}
            className={cn(
              "relative flex-1 overflow-hidden border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring",
              BACKGROUND_STYLES[backgroundStyle].className,
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            onContextMenu={handleContextMenu}
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
        </ContextMenuTrigger>
        <ContextMenuContent>
          {contextMenuTarget === "canvas" ? (
            <CanvasContextMenu
              backgroundStyle={backgroundStyle}
              maxZoom={maxZoom}
              minZoom={minZoom}
              onCycleBackground={cycleBackground}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onZoomReset={handleZoomReset}
              zoom={zoom}
            />
          ) : (
            <SvgContextMenu
              onCopy={onCopy}
              onDownload={onDownload}
              onFlipHorizontal={handleFlipHorizontal}
              onFlipVertical={handleFlipVertical}
              onRotate={handleRotate}
              onToggleOutline={() => setShowViewBoxOutline(!showViewBoxOutline)}
              showViewBoxOutline={showViewBoxOutline}
            />
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
