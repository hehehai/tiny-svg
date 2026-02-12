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
import {
  addXmlnsToSvg,
  copyToClipboard,
  downloadSvg,
  isSvgContent,
  isSvgFile,
  readFileAsText,
} from "@/lib/file-utils";
import { PASTED_FILENAME } from "@/lib/constants";
import type { HistoryEntry } from "@/lib/svg-history-storage";
import { getComponentName } from "@/lib/svg-to-code";
import { calculateCompressionRate } from "@/lib/svgo-config";
import { usePresetsStore } from "@/store/presets-store";
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

  const { initializePresets } = usePresetsStore();

  const { messages, ui } = useIntlayer("optimize");

  // Initialize presets store on mount
  useEffect(() => {
    initializePresets();
  }, [initializePresets]);

  // Ensure globalSettings has default values for SSR
  const safeGlobalSettings = globalSettings || defaultGlobalSettings;

  const [_hasAutoSwitchedTab, setHasAutoSwitchedTab] = useAutoTabSwitch(
    compressedSvg,
    setActiveTab
  );

  const safeMessages = useMemo(
    () => ({
      uploadSuccess:
        messages?.uploadSuccess || "SVG file uploaded successfully!",
      invalidSvgFile:
        messages?.invalidSvgFile ||
        "Invalid file. Please select a valid SVG file (.svg or .svg+xml).",
      fileReadError:
        messages?.fileReadError || "Failed to read file. Please try again.",
      invalidSvgStructure:
        messages?.invalidSvgStructure ||
        "The file does not contain valid SVG content.",
    }),
    [
      messages?.uploadSuccess,
      messages?.invalidSvgFile,
      messages?.fileReadError,
      messages?.invalidSvgStructure,
    ]
  );

  const handleFileUpload = useCallback(
    async (file: File) => {
      const content = await readFileAsText(file);
      setOriginalSvg(content, file.name);
      setHasAutoSwitchedTab(false);
      toast.success(safeMessages.uploadSuccess);
    },
    [setOriginalSvg, setHasAutoSwitchedTab, safeMessages.uploadSuccess]
  );

  // Handle drag and drop with file validation
  const handleFileDrop = useCallback(
    async (file: File) => {
      // Validate file type
      if (!isSvgFile(file)) {
        toast.error(safeMessages.invalidSvgFile);
        return;
      }

      // Read and validate content
      try {
        const content = await readFileAsText(file);
        if (!isSvgContent(content)) {
          toast.error(safeMessages.invalidSvgStructure);
          return;
        }
        setOriginalSvg(content, file.name);
        setHasAutoSwitchedTab(false);
        toast.success(safeMessages.uploadSuccess);
      } catch {
        toast.error(safeMessages.fileReadError);
      }
    },
    [setOriginalSvg, setHasAutoSwitchedTab, safeMessages]
  );

  const dragDropOptions = useMemo(
    () => ({ onFileDrop: handleFileDrop }),
    [handleFileDrop]
  );

  const isDragging = useDragAndDrop(dragDropOptions);

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
  const normalizedFileName = useMemo(() => {
    const trimmedName = fileName?.trim();
    const baseName = trimmedName && trimmedName.length > 0 ? trimmedName : PASTED_FILENAME;
    const normalized = baseName.replace(/\.svg(\+xml)?$/i, ".svg");
    return normalized.endsWith(".svg") ? normalized : `${normalized}.svg`;
  }, [fileName]);

  const handleCopyOriginal = useCallback(async () => {
    try {
      await copyToClipboard(originalSvg);
      toast.success(messages?.copySuccess || "Copied to clipboard!");
    } catch {
      toast.error(messages?.copyError || "Failed to copy to clipboard");
    }
  }, [originalSvg, messages?.copySuccess, messages?.copyError]);

  const handleDownloadOriginal = useCallback(() => {
    try {
      const svgWithNamespace = addXmlnsToSvg(originalSvg);
      downloadSvg(svgWithNamespace, normalizedFileName);
      toast.success(messages?.downloadSuccess || "Downloaded successfully!");
    } catch {
      toast.error(messages?.downloadError || "Failed to download file");
    }
  }, [
    originalSvg,
    normalizedFileName,
    messages?.downloadSuccess,
    messages?.downloadError,
  ]);

  const handleCopyCompressed = useCallback(async () => {
    try {
      await copyToClipboard(compressedSvg);
      toast.success(messages?.copySuccess || "Copied to clipboard!");
    } catch {
      toast.error(messages?.copyError || "Failed to copy to clipboard");
    }
  }, [compressedSvg, messages?.copySuccess, messages?.copyError]);

  const handleDownloadCompressed = useCallback(() => {
    try {
      const newFileName = normalizedFileName.replace(/\.svg$/i, ".optimized.svg");
      const svgWithNamespace = addXmlnsToSvg(compressedSvg);
      downloadSvg(svgWithNamespace, newFileName);
      toast.success(messages?.downloadSuccess || "Downloaded successfully!");
    } catch {
      toast.error(messages?.downloadError || "Failed to download file");
    }
  }, [
    compressedSvg,
    normalizedFileName,
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
    onCopy: handleCopyCompressed,
    onDownload: handleDownloadCompressed,
    onCopyOriginal: handleCopyOriginal,
    onDownloadOriginal: handleDownloadOriginal,
    onCopyCompressed: handleCopyCompressed,
    onDownloadCompressed: handleDownloadCompressed,
    onTabChange: setActiveTab,
    onToggleSettings: toggleCollapsed,
    onToggleMobileSettings: toggleMobileSettings,
    onToggleHistoryPanel: toggleHistoryPanel,
    onSelectHistoryEntry: handleSelectHistoryEntry,
    onDeleteHistoryEntry: handleDeleteHistoryEntry,
    onClearHistory: handleClearHistory,
  };
}
