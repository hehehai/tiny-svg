import { emit, on } from "@create-figma-plugin/utilities";
import { useCallback, useEffect } from "react";
import type {
  ErrorHandler,
  FigmaNodeData,
  InitHandler,
  PresetDeletedHandler,
  PresetSavedHandler,
  PresetsLoadedHandler,
  PresetsResetHandler,
  SelectionChangedHandler,
} from "@/types/messages";
import { optimizeSvgBatch } from "@/ui/lib/svgo-optimizer";
import type { SvgItem } from "@/ui/store";
import { usePluginStore } from "@/ui/store";

export function useFigmaMessages() {
  const {
    setItems,
    setPresets,
    _syncPreset,
    _syncDeletePreset,
    setError,
    setCompressing,
    setCompressionProgress,
    updateItem,
    presets,
    globalPreset,
  } = usePluginStore();

  // Auto-compression function wrapped in useCallback
  const compressItems = useCallback(
    async (itemsToCompress: SvgItem[]) => {
      try {
        setCompressing(true);
        setCompressionProgress(0);

        const results = await optimizeSvgBatch(
          itemsToCompress,
          presets,
          globalPreset,
          (current: number, total: number) => {
            setCompressionProgress((current / total) * 100);
          }
        );

        // Update items with compression results
        for (const result of results) {
          updateItem(result.id, {
            compressedSvg: result.compressedSvg,
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            compressionRatio: result.compressionRatio,
          });
        }
      } catch (error) {
        console.error("Compression failed:", error);
        setError(
          error instanceof Error
            ? `Compression failed: ${error.message}`
            : "Compression failed"
        );
      } finally {
        setCompressing(false);
        setCompressionProgress(0);
      }
    },
    [
      presets,
      globalPreset,
      setCompressing,
      setCompressionProgress,
      updateItem,
      setError,
    ]
  );

  // Handle selection changed message
  const handleSelectionChanged = useCallback(
    async (figmaItems: FigmaNodeData[]) => {
      const svgItems: SvgItem[] = figmaItems.map((node: FigmaNodeData) => ({
        id: node.id,
        nodeId: node.nodeId,
        name: node.name,
        originalSvg: node.svg,
        preset: "inherit",
        originalSize: new Blob([node.svg]).size,
      }));

      setItems(svgItems);

      if (svgItems.length > 0) {
        await compressItems(svgItems);
      }
    },
    [setItems, compressItems]
  );

  // Register event listeners
  useEffect(() => {
    const unsubscribeSelection = on<SelectionChangedHandler>(
      "SELECTION_CHANGED",
      handleSelectionChanged
    );

    const unsubscribePresets = on<PresetsLoadedHandler>(
      "PRESETS_LOADED",
      (loadedPresets) => {
        setPresets(loadedPresets);
      }
    );

    const unsubscribePresetSaved = on<PresetSavedHandler>(
      "PRESET_SAVED",
      (preset) => {
        _syncPreset(preset);
      }
    );

    const unsubscribePresetDeleted = on<PresetDeletedHandler>(
      "PRESET_DELETED",
      (id) => {
        _syncDeletePreset(id);
      }
    );

    const unsubscribePresetsReset = on<PresetsResetHandler>(
      "PRESETS_RESET",
      () => {
        // Presets will be reloaded via PRESETS_LOADED message
        // This handler is just for acknowledgment
      }
    );

    const unsubscribeError = on<ErrorHandler>(
      "ERROR",
      (message: string, details?: string) => {
        setError(message, details);
      }
    );

    // Cleanup
    return () => {
      unsubscribeSelection();
      unsubscribePresets();
      unsubscribePresetSaved();
      unsubscribePresetDeleted();
      unsubscribePresetsReset();
      unsubscribeError();
    };
  }, [
    handleSelectionChanged,
    setPresets,
    _syncPreset,
    _syncDeletePreset,
    setError,
  ]);

  // Request initial data
  useEffect(() => {
    emit<InitHandler>("INIT");
  }, []);

  return {
    sendToPlugin: emit,
    compressItems,
  };
}
