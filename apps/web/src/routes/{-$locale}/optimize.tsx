import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { useIntlayer } from "react-intlayer";
import { toast } from "sonner";
import { CodeDiffViewerLazy } from "@/components/lazy/code-diff-viewer-lazy";
import { ConfigPanelLazy } from "@/components/lazy/config-panel-lazy";
import { CodeTabContent } from "@/components/optimize/code-tab-content";
import { DataUriTabContent } from "@/components/optimize/data-uri-tab-content";
import { OptimizeHeader } from "@/components/optimize/optimize-header";
import { SvgPreview } from "@/components/svg-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadBox } from "@/components/upload-box";
import { useAutoCompress } from "@/hooks/use-auto-compress";
import { useAutoTabSwitch } from "@/hooks/use-auto-tab-switch";
import { useCodeGeneration } from "@/hooks/use-code-generation";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop";
import { usePasteHandler } from "@/hooks/use-paste-handler";
import { usePrettifiedSvg } from "@/hooks/use-prettified-svg";
import { copyToClipboard, downloadSvg, readFileAsText } from "@/lib/file-utils";
import { getComponentName } from "@/lib/svg-to-code";
import { calculateCompressionRate } from "@/lib/svgo-config";
import type { SvgoGlobalSettings } from "@/lib/svgo-plugins";
import { useSvgStore } from "@/store/svg-store";

export const Route = createFileRoute("/{-$locale}/optimize")({
  component: OptimizeComponent,
});

interface OptimizeLayoutProps {
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
}

function OptimizeLayout({
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
    <div className="flex h-[calc(100vh-4rem)] w-screen flex-col md:flex-row">
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
            onToggleCollapse={() => onToggleMobileSettings()}
          />
        </div>
      )}
    </div>
  );
}

interface OptimizeTabsProps {
  activeTab: string;
  safeGlobalSettings: SvgoGlobalSettings;
  originalSvg: string;
  compressedSvg: string;
  prettifiedOriginal: string;
  prettifiedCompressed: string;
  componentName: string;
  generatedCodes: Map<string, string>;
  ui: any;
  onTabChange: (tab: string) => void;
}

function OptimizeTabs({
  activeTab,
  safeGlobalSettings,
  originalSvg,
  compressedSvg,
  prettifiedOriginal,
  prettifiedCompressed,
  componentName,
  generatedCodes,
  ui,
  onTabChange,
}: OptimizeTabsProps) {
  return (
    <Tabs
      className="flex h-full flex-col"
      onValueChange={onTabChange}
      value={activeTab}
    >
      <TabsList>
        {safeGlobalSettings.showOriginal && (
          <TabsTrigger value="original">
            {ui?.originalTab || "Original"}
          </TabsTrigger>
        )}
        <TabsTrigger value="optimized">
          {ui?.optimizedTab || "Optimized"}
        </TabsTrigger>
        <TabsTrigger value="code">{ui?.codeTab || "Code"}</TabsTrigger>
        <TabsTrigger disabled={!compressedSvg} value="data-uri">
          {ui?.dataUriTab || "Data URI"}
        </TabsTrigger>
        <TabsTrigger value="react-jsx">React JSX</TabsTrigger>
        <TabsTrigger value="react-tsx">React TSX</TabsTrigger>
        <TabsTrigger value="vue">Vue</TabsTrigger>
        <TabsTrigger value="svelte">Svelte</TabsTrigger>
        <TabsTrigger value="react-native">React Native</TabsTrigger>
        <TabsTrigger value="flutter">Flutter</TabsTrigger>
      </TabsList>

      {safeGlobalSettings.showOriginal && (
        <TabsContent
          className="mt-4 flex-1 data-[state=active]:flex"
          value="original"
        >
          <SvgPreview
            className="flex-1"
            svg={originalSvg}
            title="Original SVG"
          />
        </TabsContent>
      )}

      <TabsContent
        className="mt-4 flex-1 data-[state=active]:flex"
        value="optimized"
      >
        {compressedSvg ? (
          <SvgPreview
            className="flex-1"
            svg={compressedSvg}
            title="Optimized SVG"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {ui?.clickToCompress || 'Click "Compress SVG" to optimize'}
          </div>
        )}
      </TabsContent>

      <TabsContent className="mt-4 flex-1 overflow-hidden" value="code">
        {compressedSvg ? (
          <CodeDiffViewerLazy
            language="html"
            modified={prettifiedCompressed}
            original={prettifiedOriginal}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {ui?.noOptimizedCode || "No optimized code yet"}
          </div>
        )}
      </TabsContent>

      <TabsContent className="mt-4 flex-1 overflow-hidden" value="data-uri">
        <DataUriTabContent compressedSvg={compressedSvg} />
      </TabsContent>

      {[
        "react-jsx",
        "react-tsx",
        "vue",
        "svelte",
        "react-native",
        "flutter",
      ].map((tab) => (
        <TabsContent
          className="mt-4 flex-1 overflow-hidden"
          key={tab}
          value={tab}
        >
          <CodeTabContent
            activeTab={tab}
            componentName={componentName}
            generatedCodes={generatedCodes}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

// 默认设置，防止服务器端渲染错误
const defaultGlobalSettings = {
  showOriginal: false,
  compareGzipped: false,
  prettifyMarkup: true,
  multipass: true,
  floatPrecision: 2,
  transformPrecision: 4,
};

function OptimizeComponent() {
  const {
    originalSvg,
    compressedSvg,
    fileName,
    plugins,
    globalSettings,
    setOriginalSvg,
    setCompressedSvg,
  } = useSvgStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("original");
  const { messages, ui } = useIntlayer("optimize");

  // 确保 globalSettings 有默认值，防止服务器端渲染错误
  const safeGlobalSettings = globalSettings || defaultGlobalSettings;

  const [_hasAutoSwitchedTab, setHasAutoSwitchedTab] = useAutoTabSwitch(
    compressedSvg,
    setActiveTab
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      const content = await readFileAsText(file);
      setOriginalSvg(content, file.name);
      setHasAutoSwitchedTab(false);
      toast.success(
        messages?.uploadSuccess || "SVG file uploaded successfully!"
      );
    },
    [setOriginalSvg, setHasAutoSwitchedTab, messages?.uploadSuccess]
  );

  const isDragging = useDragAndDrop();

  usePasteHandler({
    setOriginalSvg,
    setHasAutoSwitchedTab,
  });

  const prettifiedOriginal = usePrettifiedSvg(
    originalSvg,
    safeGlobalSettings.prettifyMarkup
  );
  const prettifiedCompressed = usePrettifiedSvg(
    compressedSvg,
    safeGlobalSettings.prettifyMarkup
  );

  useAutoCompress(originalSvg, plugins, safeGlobalSettings, setCompressedSvg);

  const componentName = useMemo(() => getComponentName(fileName), [fileName]);
  const { generatedCodes } = useCodeGeneration(
    activeTab,
    compressedSvg,
    fileName
  );

  const handleCopy = async () => {
    try {
      await copyToClipboard(compressedSvg);
      toast.success(messages?.copySuccess || "Copied to clipboard!");
    } catch {
      toast.error(messages?.copyError || "Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    try {
      const newFileName = fileName.replace(".svg", ".optimized.svg");
      downloadSvg(compressedSvg, newFileName);
      toast.success(messages?.downloadSuccess || "Downloaded successfully!");
    } catch {
      toast.error(messages?.downloadError || "Failed to download file");
    }
  };

  const originalSize = originalSvg ? new Blob([originalSvg]).size : 0;
  const compressedSize = compressedSvg ? new Blob([compressedSvg]).size : 0;
  const compressionRate = originalSvg
    ? calculateCompressionRate(originalSvg, compressedSvg)
    : 0;

  return (
    <OptimizeLayout
      activeTab={activeTab}
      componentName={componentName}
      compressedSize={compressedSize}
      compressedSvg={compressedSvg}
      compressionRate={compressionRate}
      fileName={fileName}
      generatedCodes={generatedCodes}
      isCollapsed={isCollapsed}
      isDragging={isDragging}
      isMobileSettingsOpen={isMobileSettingsOpen}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onFileUpload={handleFileUpload}
      onTabChange={setActiveTab}
      onToggleMobileSettings={() =>
        setIsMobileSettingsOpen(!isMobileSettingsOpen)
      }
      onToggleSettings={() => setIsCollapsed(!isCollapsed)}
      originalSize={originalSize}
      originalSvg={originalSvg}
      prettifiedCompressed={prettifiedCompressed}
      prettifiedOriginal={prettifiedOriginal}
      safeGlobalSettings={safeGlobalSettings}
      ui={ui}
    />
  );
}
