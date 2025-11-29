import { emit } from "@create-figma-plugin/utilities";
import type { StateCreator } from "zustand";
import type {
  DeletePresetHandler,
  Preset,
  ResetPresetsHandler,
  SavePresetHandler,
} from "@/types/messages";

// ============================================================================
// State Interface
// ============================================================================

export interface PresetsState {
  presets: Preset[];
  globalPreset: string;
}

export interface PresetsActions {
  setPresets: (presets: Preset[]) => void;
  setGlobalPreset: (presetId: string) => void;
  addPreset: (preset: Preset) => void;
  updatePreset: (preset: Preset) => void;
  deletePreset: (id: string) => void;
  resetPresets: () => void;
  pinPreset: (id: string) => void;
  getPresetUsageCount: (id: string) => number;
  // Internal methods (don't emit messages, used by message handlers)
  _syncPreset: (preset: Preset) => void;
  _syncDeletePreset: (id: string) => void;
}

export type PresetsStore = PresetsState & PresetsActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: PresetsState = {
  presets: [],
  globalPreset: "default",
};

// ============================================================================
// Presets Store
// ============================================================================

export const createPresetsStore: StateCreator<
  PresetsStore & { items: Array<{ preset: string }> },
  [],
  [],
  PresetsStore
> = (set, get) => ({
  ...initialState,

  setPresets: (presets) => {
    set({ presets });
  },

  setGlobalPreset: (presetId) => {
    set({ globalPreset: presetId });
  },

  addPreset: (preset) => {
    set((state) => ({
      presets: [...state.presets, preset],
    }));
    // Send message to plugin to persist
    emit<SavePresetHandler>("SAVE_PRESET", preset);
  },

  updatePreset: (preset) => {
    set((state) => ({
      presets: state.presets.map((p) => (p.id === preset.id ? preset : p)),
    }));
    // Send message to plugin to persist
    emit<SavePresetHandler>("SAVE_PRESET", preset);
  },

  deletePreset: (id) => {
    set((state) => ({
      presets: state.presets.filter((p) => p.id !== id),
      // If global preset is deleted, reset to default
      globalPreset: state.globalPreset === id ? "default" : state.globalPreset,
      // If any item uses this preset, reset to inherit
      items: state.items.map((item) =>
        item.preset === id ? { ...item, preset: "inherit" } : item
      ),
    }));
    // Send message to plugin to persist
    emit<DeletePresetHandler>("DELETE_PRESET", id);
  },

  resetPresets: () => {
    // Send message to plugin to reset presets
    emit<ResetPresetsHandler>("RESET_PRESETS");
  },

  pinPreset: (id) => {
    const currentState = get();
    const preset = currentState.presets.find((p) => p.id === id);
    if (!preset) {
      return;
    }

    const updatedPreset = {
      ...preset,
      pinned: !preset.pinned,
      updatedAt: Date.now(),
    };

    set((state) => ({
      presets: state.presets.map((p) => (p.id === id ? updatedPreset : p)),
    }));

    // Send message to plugin to persist
    emit<SavePresetHandler>("SAVE_PRESET", updatedPreset);
  },

  getPresetUsageCount: (id) => {
    const state = get();
    return state.items.filter((item) => item.preset === id).length;
  },

  // Internal sync methods (don't emit, used by message handlers)
  _syncPreset: (preset) => {
    set((state) => {
      const existingIndex = state.presets.findIndex((p) => p.id === preset.id);
      if (existingIndex >= 0) {
        // Update existing
        return {
          presets: state.presets.map((p) => (p.id === preset.id ? preset : p)),
        };
      }
      // Add new
      return {
        presets: [...state.presets, preset],
      };
    });
  },

  _syncDeletePreset: (id) => {
    set((state) => ({
      presets: state.presets.filter((p) => p.id !== id),
      globalPreset: state.globalPreset === id ? "default" : state.globalPreset,
      items: state.items.map((item) =>
        item.preset === id ? { ...item, preset: "inherit" } : item
      ),
    }));
  },
});
