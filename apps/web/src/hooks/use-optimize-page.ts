import { useCallback, useEffect, useMemo } from "react";
import { useIntlayer } from "react-intlayer";
import { toast } from "sonner";
import { useAutoCompress } from "@/hooks/use-auto-compress";
import { useAutoTabSwitch } from "@/hooks/use-auto-tab-switch";
import { useCodeGeneration } from "@/hooks/use-code-generation";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop";
import { usePasteHandler } from "@/hooks/use-paste-handler";
import { usePrettifiedSvg } from "@/hooks/use-prettified-svg";
import { useSvgHistory } from "@/hooks/use-svg-history";
import { copyToClipboard, downloadSvg, readFileAsText } from "@/lib/file-utils";
import type { HistoryEntry } from "@/lib/svg-history-storage";
import { getComponentName } from "@/lib/svg-to-code";
import { calculateCompressionRate } from "@/lib/svgo-config";
import { useSvgStore } from "@/store/svg-store";
import { useUiStore } from "@/store/ui-store";

const defaultGlobalSettings = {
  showOriginal: false,
  compareGzipped: false,
  prettifyMarkup: true,
  multipass: true,
  floatPrecision: 2,
  transformPrecision: 4,
};

export function useOptimizePage() {
  const {
    originalSvg,
    compressedSvg,
    fileName,
    plugins,
    globalSettings,
    svgoConfig,
    setOriginalSvg,
    setCompressedSvg,
    setHistoryEntry,
  } = useSvgStore();

  const {
    activeTab,
    isCollapsed,
    isMobileSettingsOpen,
    isHistoryPanelOpen,
    setActiveTab,
    toggleCollapsed,
    toggleMobileSettings,
    toggleHistoryPanel,
  } = useUiStore();

  const {
    entries: historyEntries,
    recentEntries,
    count: historyCount,
    saveEntry,
    deleteEntry,
    clearAll,
  } = useSvgHistory();

  const { messages, ui } = useIntlayer("optimize");

  // Ensure globalSettings has default values for SSR
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

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(compressedSvg);
      toast.success(messages?.copySuccess || "Copied to clipboard!");
    } catch {
      toast.error(messages?.copyError || "Failed to copy to clipboard");
    }
  }, [compressedSvg, messages?.copySuccess, messages?.copyError]);

  const handleDownload = useCallback(() => {
    try {
      const newFileName = fileName.replace(".svg", ".optimized.svg");
      downloadSvg(compressedSvg, newFileName);
      toast.success(messages?.downloadSuccess || "Downloaded successfully!");
    } catch {
      toast.error(messages?.downloadError || "Failed to download file");
    }
  }, [
    compressedSvg,
    fileName,
    messages?.downloadSuccess,
    messages?.downloadError,
  ]);

  const originalSize = originalSvg ? new Blob([originalSvg]).size : 0;
  const compressedSize = compressedSvg ? new Blob([compressedSvg]).size : 0;
  const compressionRate = originalSvg
    ? calculateCompressionRate(originalSvg, compressedSvg)
    : 0;

  // Auto-save to history when compression is complete
  useEffect(() => {
    if (
      originalSvg &&
      compressedSvg &&
      fileName &&
      originalSize &&
      compressedSize
    ) {
      saveEntry({
        fileName,
        originalSvg,
        compressedSvg,
        thumbnail: "", // Not used, we render SVG directly
        config: svgoConfig,
        originalSize,
        compressedSize,
      });
    }
  }, [
    compressedSvg,
    fileName,
    originalSvg,
    originalSize,
    compressedSize,
    svgoConfig,
    saveEntry,
  ]);

  const handleSelectHistoryEntry = useCallback(
    (entry: HistoryEntry) => {
      setHistoryEntry({
        compressedSvg: entry.compressedSvg,
        fileName: entry.fileName,
        originalSvg: entry.originalSvg,
      });
      toggleHistoryPanel();
      setHasAutoSwitchedTab(false);
    },
    [setHistoryEntry, toggleHistoryPanel, setHasAutoSwitchedTab]
  );

  const handleDeleteHistoryEntry = useCallback(
    async (id: string) => {
      await deleteEntry(id);
    },
    [deleteEntry]
  );

  const handleClearHistory = useCallback(async () => {
    await clearAll();
  }, [clearAll]);

  return {
    // SVG state
    originalSvg,
    compressedSvg,
    fileName,
    prettifiedOriginal,
    prettifiedCompressed,
    componentName,
    generatedCodes,

    // UI state
    activeTab,
    isCollapsed,
    isMobileSettingsOpen,
    isHistoryPanelOpen,
    isDragging,

    // History
    historyEntries,
    recentEntries,
    historyCount,

    // Settings
    safeGlobalSettings,

    // Metrics
    originalSize,
    compressedSize,
    compressionRate,

    // i18n
    ui,

    // Handlers
    onFileUpload: handleFileUpload,
    onCopy: handleCopy,
    onDownload: handleDownload,
    onTabChange: setActiveTab,
    onToggleSettings: toggleCollapsed,
    onToggleMobileSettings: toggleMobileSettings,
    onToggleHistoryPanel: toggleHistoryPanel,
    onSelectHistoryEntry: handleSelectHistoryEntry,
    onDeleteHistoryEntry: handleDeleteHistoryEntry,
    onClearHistory: handleClearHistory,
  };
}
