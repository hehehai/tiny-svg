import { Button } from "@tiny-svg/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tiny-svg/ui/components/select";
import { Tabs, TabsList, TabsTrigger } from "@tiny-svg/ui/components/tabs";
import { cn } from "@tiny-svg/ui/lib/utils";
import { BACKGROUND_STYLES } from "@/ui/lib/svg-preview-helpers";
import { usePluginStore } from "@/ui/store";
import type { CodeViewMode, PreviewTabType } from "@/ui/store/stores/ui-store";

interface PreviewFooterProps {
  // View tab props
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  // Code tab props
  canPrettify?: boolean;
  isPrettified?: boolean;
  onPrettify?: () => void;
  onCopy?: () => void;
}

export function PreviewFooter({
  zoom,
  minZoom,
  maxZoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  canPrettify,
  isPrettified,
  onPrettify,
  onCopy,
}: PreviewFooterProps) {
  const {
    previewModal,
    setPreviewTab,
    togglePreviewViewBoxOutline,
    cyclePreviewBackground,
    setPreviewCodeViewMode,
  } = usePluginStore();

  const activeTab = previewModal.activeTab;
  const showViewBoxOutline = previewModal.showViewBoxOutline;
  const backgroundStyle = previewModal.backgroundStyle;
  const codeViewMode = previewModal.codeViewMode;

  const currentBgStyle = BACKGROUND_STYLES[backgroundStyle];

  const handleTabChange = (tab: string) => {
    setPreviewTab(tab as PreviewTabType);
  };

  const handleViewModeChange = (mode: string) => {
    setPreviewCodeViewMode(mode as CodeViewMode);
  };

  return (
    <div className="flex items-center justify-between border-t px-3 py-2">
      {/* Left: Tab Switcher */}
      <Tabs onValueChange={handleTabChange} value={activeTab}>
        <TabsList className="h-7 p-0.5">
          <TabsTrigger className="px-3 py-1 text-xs" value="view">
            View
          </TabsTrigger>
          <TabsTrigger className="px-3 py-1 text-xs" value="code">
            Code
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Right: Action Buttons based on active tab */}
      <div className="flex items-center gap-1">
        {activeTab === "view" && (
          <>
            <Button
              className="size-7 rounded-lg p-1"
              onClick={togglePreviewViewBoxOutline}
              size="sm"
              title={showViewBoxOutline ? "Hide outline" : "Show outline"}
              type="button"
              variant="ghost"
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
              className="size-7 rounded-lg p-1"
              onClick={cyclePreviewBackground}
              size="sm"
              title={currentBgStyle.label}
              type="button"
              variant="ghost"
            >
              <i className={cn(currentBgStyle.icon, "size-4")} />
            </Button>
            <div className="mx-1 h-4 w-px bg-border" />
            <Button
              className="size-7 rounded-lg p-1"
              disabled={zoom ? zoom <= (minZoom ?? 20) : true}
              onClick={onZoomOut}
              size="sm"
              title="Zoom out"
              type="button"
              variant="ghost"
            >
              <i className="i-hugeicons-zoom-out-area size-4" />
            </Button>
            <span className="w-11 text-center font-mono text-muted-foreground text-xs">
              {zoom ?? 100}%
            </span>
            <Button
              className="size-7 rounded-lg p-1"
              disabled={zoom ? zoom >= (maxZoom ?? 800) : true}
              onClick={onZoomIn}
              size="sm"
              title="Zoom in"
              type="button"
              variant="ghost"
            >
              <i className="i-hugeicons-zoom-in-area size-4" />
            </Button>
            <Button
              className="size-7 rounded-lg p-1"
              onClick={onZoomReset}
              size="sm"
              title="Reset zoom"
              type="button"
              variant="ghost"
            >
              <i className="i-hugeicons-image-actual-size size-4" />
            </Button>
          </>
        )}

        {activeTab === "code" && (
          <>
            <Select onValueChange={handleViewModeChange} value={codeViewMode}>
              <SelectTrigger className="w-28 rounded-lg px-2 py-1" size="xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-28 rounded-lg">
                <SelectItem
                  className="rounded-md py-1 pr-4 pl-1 text-xs"
                  value="diff"
                >
                  Diff
                </SelectItem>
                <SelectItem
                  className="rounded-md py-1 pr-4 pl-1 text-xs"
                  value="origin"
                >
                  Origin
                </SelectItem>
                <SelectItem
                  className="rounded-md py-1 pr-4 pl-1 text-xs"
                  value="optimized"
                >
                  Optimized
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="mx-1 h-4 w-px bg-border" />
            <Button
              className="size-7 rounded-lg p-1"
              disabled={codeViewMode === "diff" || !canPrettify || isPrettified}
              onClick={onPrettify}
              size="sm"
              title="Prettify code"
              type="button"
              variant="ghost"
            >
              <i className="i-hugeicons-magic-wand-01 size-4" />
            </Button>
            <Button
              className="size-7 rounded-lg p-1"
              onClick={onCopy}
              size="sm"
              title="Copy code"
              type="button"
              variant="ghost"
            >
              <i className="i-hugeicons-copy-01 size-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
