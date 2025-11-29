import type { StateCreator } from "zustand";

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

export const createItemsStore: StateCreator<ItemsStore> = (set) => ({
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
});
