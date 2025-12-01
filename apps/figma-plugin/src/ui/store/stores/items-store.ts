import type { StateCreator } from "zustand";
import type { Preset } from "@/types/messages";
import { optimizeSvgBatch } from "@/ui/lib/svgo-optimizer";

// ============================================================================
// Types
// ============================================================================

export interface SvgItem {
  id: string;
  nodeId: string;
  name: string;
  originalSvg: string;
  compressedSvg?: string;
  preset: string; // 'inherit' or preset ID
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: number;
  error?: string;
}

// ============================================================================
// State Interface
// ============================================================================

export interface ItemsState {
  items: SvgItem[];
  selectedItemIds: string[];
  isCompressing: boolean;
  isExporting: boolean;
  compressionProgress: number;
}

export interface ItemsActions {
  setItems: (items: SvgItem[]) => void;
  updateItem: (id: string, updates: Partial<SvgItem>) => void;
  clearItems: () => void;
  setSelectedItemIds: (ids: string[]) => void;
  toggleItemSelection: (id: string) => void;
  setCompressing: (isCompressing: boolean) => void;
  setExporting: (isExporting: boolean) => void;
  setCompressionProgress: (progress: number) => void;
  compressSingleItem: (itemId: string) => Promise<void>;
}

export type ItemsStore = ItemsState & ItemsActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: ItemsState = {
  items: [],
  selectedItemIds: [],
  isCompressing: false,
  isExporting: false,
  compressionProgress: 0,
};

// ============================================================================
// Items Store
// ============================================================================

export const createItemsStore: StateCreator<
  ItemsStore & { presets: Preset[]; globalPreset: string },
  [],
  [],
  ItemsStore
> = (set, get) => ({
  ...initialState,

  setItems: (items) => {
    set({
      items: items.map((item) => ({
        ...item,
        preset: item.preset || "inherit",
      })),
    });
  },

  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  clearItems: () => {
    set({ items: [], selectedItemIds: [] });
  },

  setSelectedItemIds: (ids) => {
    set({ selectedItemIds: ids });
  },

  toggleItemSelection: (id) => {
    set((state) => ({
      selectedItemIds: state.selectedItemIds.includes(id)
        ? state.selectedItemIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedItemIds, id],
    }));
  },

  setCompressing: (isCompressing) => {
    set({ isCompressing });
  },

  setExporting: (isExporting) => {
    set({ isExporting });
  },

  setCompressionProgress: (progress) => {
    set({ compressionProgress: progress });
  },

  compressSingleItem: async (itemId) => {
    const state = get();
    const item = state.items.find((i) => i.id === itemId);

    if (!item) {
      console.error(`Item ${itemId} not found`);
      return;
    }

    try {
      // Get effective preset (resolve 'inherit')
      const presetId =
        item.preset === "inherit" ? state.globalPreset : item.preset;
      const presets = state.presets;
      let preset = presets.find((p) => p.id === presetId);

      if (!preset) {
        console.warn(`Preset "${presetId}" not found, using default`);
        preset = presets.find((p) => p.id === "default");
        if (!preset) {
          throw new Error("Default preset not found");
        }
      }

      // Optimize single item (batch of 1)
      const results = await optimizeSvgBatch(
        [item],
        presets,
        state.globalPreset
      );

      if (results[0]) {
        // Update item with compression result
        set((currentState) => ({
          items: currentState.items.map((i) =>
            i.id === itemId
              ? {
                  ...i,
                  compressedSvg: results[0].compressedSvg,
                  originalSize: results[0].originalSize,
                  compressedSize: results[0].compressedSize,
                  compressionRatio: results[0].compressionRatio,
                }
              : i
          ),
        }));
      }
    } catch (error) {
      console.error(`Failed to compress item ${itemId}:`, error);
    }
  },
});
