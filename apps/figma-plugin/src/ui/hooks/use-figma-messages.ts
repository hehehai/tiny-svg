import { emit } from "@create-figma-plugin/utilities";
import { useCallback } from "react";
import { optimizeSvgBatch } from "@/ui/lib/svgo-optimizer";
import type { SvgItem } from "@/ui/store";
import { usePluginStore } from "@/ui/store";

/**
 * Hook for interacting with Figma plugin
 * Event handlers are registered globally in init-event-handlers.ts
 */
export function useFigmaMessages() {
  const {
    setCompressing,
    setCompressionProgress,
    updateItem,
    presets,
    globalPreset,
    setError,
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

  return {
    sendToPlugin: emit,
    compressItems,
  };
}
