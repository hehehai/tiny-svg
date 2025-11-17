import { ConfigPanelLazy } from "@/components/lazy/config-panel-lazy";
import { OptimizeHeader } from "@/components/optimize/optimize-header";
import { OptimizeTabs } from "@/components/optimize/optimize-tabs";
import { UploadBox } from "@/components/upload-box";
import type { SvgoGlobalSettings } from "@/lib/svgo-plugins";

type OptimizeLayoutProps = {
  originalSvg: string;
  compressedSvg: string;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  compressionRate: number;
  isCollapsed: boolean;
  isMobileSettingsOpen: boolean;
  activeTab: string;
  safeGlobalSettings: SvgoGlobalSettings;
  prettifiedOriginal: string;
  prettifiedCompressed: string;
  componentName: string;
  generatedCodes: Map<string, string>;
  isDragging: boolean;
  ui: any;
  onFileUpload: (file: File) => Promise<void>;
  onCopy: () => Promise<void>;
  onDownload: () => void;
  onToggleSettings: () => void;
  onToggleMobileSettings: () => void;
  onTabChange: (tab: string) => void;
};

export function OptimizeLayout({
  originalSvg,
  compressedSvg,
  fileName,
  originalSize,
  compressedSize,
  compressionRate,
  isCollapsed,
  isMobileSettingsOpen,
  activeTab,
  safeGlobalSettings,
  prettifiedOriginal,
  prettifiedCompressed,
  componentName,
  generatedCodes,
  isDragging,
  ui,
  onFileUpload,
  onCopy,
  onDownload,
  onToggleSettings,
  onToggleMobileSettings,
  onTabChange,
}: OptimizeLayoutProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col md:flex-row">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Settings Toggle Button */}
        {!originalSvg && (
          <button
            className="flex items-center justify-between border-b px-4 py-3 transition-colors hover:bg-accent md:hidden"
            onClick={onToggleMobileSettings}
            type="button"
          >
            <span className="font-semibold">{ui?.settings || "Settings"}</span>
            <span
              className={`i-hugeicons-arrow-down-01 size-5 transition-transform ${isMobileSettingsOpen ? "rotate-180" : ""}`}
            />
          </button>
        )}

        {originalSvg && (
          <OptimizeHeader
            compressedSize={compressedSize}
            compressedSvg={compressedSvg}
            compressionRate={compressionRate}
            fileName={fileName}
            isSettingsCollapsed={isCollapsed}
            onCopy={onCopy}
            onDownload={onDownload}
            onFileUpload={onFileUpload}
            onToggleSettings={onToggleSettings}
            originalSize={originalSize}
          />
        )}

        <div className="flex-1 overflow-hidden p-4">
          {originalSvg ? (
            <OptimizeTabs
              activeTab={activeTab}
              componentName={componentName}
              compressedSvg={compressedSvg}
              generatedCodes={generatedCodes}
              onTabChange={onTabChange}
              originalSvg={originalSvg}
              prettifiedCompressed={prettifiedCompressed}
              prettifiedOriginal={prettifiedOriginal}
              safeGlobalSettings={safeGlobalSettings}
              ui={ui}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <UploadBox
                className="max-w-2xl"
                isHighlighted={isDragging}
                onUpload={onFileUpload}
              />
            </div>
          )}
        </div>
      </div>

      {/* Desktop Settings Panel */}
      {!isCollapsed && (
        <div className="hidden w-80 border-l md:block">
          <ConfigPanelLazy
            className="h-full p-4"
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleSettings}
          />
        </div>
      )}

      {/* Mobile Settings Panel */}
      {isMobileSettingsOpen && (
        <div className="border-t md:hidden">
          <ConfigPanelLazy
            className="w-full p-4"
            isCollapsed={false}
            onToggleCollapse={onToggleMobileSettings}
          />
        </div>
      )}
    </div>
  );
}
