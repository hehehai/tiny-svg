import { emit, on, once } from "@create-figma-plugin/utilities";
import type { Locale } from "@/i18n/types";
import type {
  ErrorHandler,
  FigmaNodeData,
  InitHandler,
  LanguageLoadedHandler,
  PresetDeletedHandler,
  PresetSavedHandler,
  PresetsLoadedHandler,
  PresetsResetHandler,
  SelectionChangedHandler,
} from "@/types/messages";
import { usePluginStore } from "@/ui/store";

/**
 * Initialize event handlers before React renders
 * This ensures handlers are registered before plugin sends initial messages
 */
export function initEventHandlers() {
  // Handle selection changes
  on<SelectionChangedHandler>(
    "SELECTION_CHANGED",
    (figmaItems: FigmaNodeData[]) => {
      const state = usePluginStore.getState();
      const svgItems = figmaItems.map((node: FigmaNodeData) => ({
        id: node.id,
        nodeId: node.nodeId,
        name: node.name,
        originalSvg: node.svg,
        preset: "inherit" as const,
        originalSize: new Blob([node.svg]).size,
      }));

      state.setItems(svgItems);

      // Trigger auto-compression
      if (svgItems.length > 0) {
        import("@/ui/lib/svgo-optimizer").then(({ optimizeSvgBatch }) => {
          const currentState = usePluginStore.getState();
          currentState.setCompressing(true);
          currentState.setCompressionProgress(0);

          optimizeSvgBatch(
            svgItems,
            currentState.presets,
            currentState.globalPreset,
            (current: number, total: number) => {
              usePluginStore
                .getState()
                .setCompressionProgress((current / total) * 100);
            }
          )
            .then((results) => {
              const resultState = usePluginStore.getState();
              for (const result of results) {
                resultState.updateItem(result.id, {
                  compressedSvg: result.compressedSvg,
                  originalSize: result.originalSize,
                  compressedSize: result.compressedSize,
                  compressionRatio: result.compressionRatio,
                });
              }
            })
            .catch((error) => {
              console.error("Compression failed:", error);
              usePluginStore
                .getState()
                .setError(
                  error instanceof Error
                    ? `Compression failed: ${error.message}`
                    : "Compression failed"
                );
            })
            .finally(() => {
              const finalState = usePluginStore.getState();
              finalState.setCompressing(false);
              finalState.setCompressionProgress(0);
            });
        });
      }
    }
  );

  // Handle presets loaded (one-time)
  once<PresetsLoadedHandler>("PRESETS_LOADED", (loadedPresets) => {
    usePluginStore.getState().setPresets(loadedPresets);
  });

  // Handle preset saved
  on<PresetSavedHandler>("PRESET_SAVED", (preset) => {
    usePluginStore.getState()._syncPreset(preset);
  });

  // Handle preset deleted
  on<PresetDeletedHandler>("PRESET_DELETED", (id) => {
    usePluginStore.getState()._syncDeletePreset(id);
  });

  // Handle presets reset
  on<PresetsResetHandler>("PRESETS_RESET", () => {
    // Presets will be reloaded via PRESETS_LOADED message
  });

  // Handle language loaded (one-time)
  once<LanguageLoadedHandler>("LANGUAGE_LOADED", (locale: string) => {
    usePluginStore.getState().setLocale(locale as Locale);
  });

  // Handle errors
  on<ErrorHandler>("ERROR", (message: string, details?: string) => {
    usePluginStore.getState().setError(message, details);
  });

  // All handlers registered, now safe to initialize
  emit<InitHandler>("INIT");
}
