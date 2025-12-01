import { create } from "zustand";
import type { ItemsStore } from "./stores/items-store";
import { createItemsStore } from "./stores/items-store";
import type { PresetsStore } from "./stores/presets-store";
import { createPresetsStore } from "./stores/presets-store";
import type { UiStore } from "./stores/ui-store";
import { createUiStore } from "./stores/ui-store";

// ============================================================================
// Combined Store Type
// ============================================================================

export type PluginStore = ItemsStore &
  PresetsStore &
  UiStore & {
    reset: () => void;
  };

// ============================================================================
// Store Creation
// ============================================================================

export const usePluginStore = create<PluginStore>((set, get, api) => ({
  ...createItemsStore(set as never, get as never, api as never),
  ...createPresetsStore(set as never, get as never, api as never),
  ...createUiStore(set as never, get as never, api as never),

  reset: () => {
    set({
      // Reset items
      items: [],
      selectedItemIds: [],
      isCompressing: false,
      isExporting: false,
      compressionProgress: 0,
      // Reset presets
      presets: [],
      globalPreset: "default",
      // Reset UI
      activeTab: "svg",
      previewModal: {
        isOpen: false,
        itemId: null,
        activeTab: "view",
        codeViewMode: "diff",
        showViewBoxOutline: false,
        backgroundStyle: "transparent-light",
      },
      presetEditor: {
        isOpen: false,
        mode: "create",
        presetId: null,
        sourcePresetId: undefined,
      },
      settingsOpen: false,
      selectedImageFormats: ["png"],
      selectedCodeFormat: "react-jsx",
      selectedSvgExportFormat: "zip",
      error: null,
    });
  },
}));

// ============================================================================
// Re-export types for convenience
// ============================================================================

export type { SvgItem } from "./stores/items-store";
export type {
  CodeFormat,
  ImageFormat,
  PreviewTabType,
  SvgExportFormat,
  TabType,
} from "./stores/ui-store";

// ============================================================================
// Selectors
// ============================================================================

// Get effective preset for an item (resolves 'inherit')
export const getEffectivePreset = (
  item: { preset: string },
  globalPreset: string
): string => (item.preset === "inherit" ? globalPreset : item.preset);

// Get items count
export const useItemsCount = () =>
  usePluginStore((state) => state.items.length);

// Get compressed items count
export const useCompressedItemsCount = () =>
  usePluginStore(
    (state) => state.items.filter((item) => item.compressedSvg).length
  );

// Get total compression saved
export const useTotalCompressionSaved = () =>
  usePluginStore((state) => {
    let totalOriginal = 0;
    let totalCompressed = 0;

    for (const item of state.items) {
      if (item.originalSize && item.compressedSize) {
        totalOriginal += item.originalSize;
        totalCompressed += item.compressedSize;
      }
    }

    return totalOriginal - totalCompressed;
  });
