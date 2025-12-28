import { create } from "zustand";
import {
  deletePresetFromStorage,
  loadPresets,
  savePresets,
} from "@/lib/preset-storage";
import {
  buildSvgoConfig,
  createPresetId,
  getDefaultPresets,
  sortPresets,
} from "@/lib/preset-utils";
import type { Preset, PresetCreateInput } from "@/types/preset";

type EditorMode = "create" | "edit";

type PresetsState = {
  presets: Preset[];
  activePresetId: string;
  isEditorOpen: boolean;
  editorMode: EditorMode;
  editingPresetId: string | null;
  sourcePresetId: string | null; // For duplication
  deleteDialogPresetId: string | null;
};

type PresetsActions = {
  initializePresets: () => void;
  addPreset: (input: PresetCreateInput) => Preset;
  updatePreset: (id: string, input: PresetCreateInput) => void;
  deletePreset: (id: string) => void;
  pinPreset: (id: string) => void;
  setActivePreset: (id: string) => void;
  openEditor: (mode: EditorMode, presetId?: string, sourceId?: string) => void;
  closeEditor: () => void;
  openDeleteDialog: (presetId: string) => void;
  closeDeleteDialog: () => void;
  getPresetById: (id: string) => Preset | undefined;
  getSortedPresets: () => Preset[];
};

const initialState: PresetsState = {
  presets: [],
  activePresetId: "default",
  isEditorOpen: false,
  editorMode: "create",
  editingPresetId: null,
  sourcePresetId: null,
  deleteDialogPresetId: null,
};

export const usePresetsStore = create<PresetsState & PresetsActions>(
  (set, get) => ({
    ...initialState,

    initializePresets: () => {
      const defaultPresets = getDefaultPresets();
      const customPresets = loadPresets();
      set({ presets: [...defaultPresets, ...customPresets] });
    },

    addPreset: (input: PresetCreateInput) => {
      const now = Date.now();
      const svgoConfig = buildSvgoConfig(input.plugins, input.globalSettings);
      const newPreset: Preset = {
        id: createPresetId(input.name),
        name: input.name.trim(),
        description: input.description || "",
        icon: input.icon,
        isDefault: false,
        plugins: input.plugins,
        globalSettings: input.globalSettings,
        svgoConfig,
        createdAt: now,
        updatedAt: now,
      };

      set((state) => {
        const updated = [...state.presets, newPreset];
        savePresets(updated);
        return { presets: updated };
      });

      return newPreset;
    },

    updatePreset: (id: string, input: PresetCreateInput) => {
      set((state) => {
        const svgoConfig = buildSvgoConfig(input.plugins, input.globalSettings);
        const updated = state.presets.map((p) =>
          p.id === id
            ? {
                ...p,
                name: input.name.trim(),
                description: input.description || "",
                icon: input.icon,
                plugins: input.plugins,
                globalSettings: input.globalSettings,
                svgoConfig,
                updatedAt: Date.now(),
              }
            : p
        );
        savePresets(updated);
        return { presets: updated };
      });
    },

    deletePreset: (id: string) => {
      set((state) => {
        const updated = state.presets.filter((p) => p.id !== id);
        deletePresetFromStorage(id);
        return {
          presets: updated,
          activePresetId:
            state.activePresetId === id ? "default" : state.activePresetId,
          deleteDialogPresetId: null,
        };
      });
    },

    pinPreset: (id: string) => {
      set((state) => {
        const updated = state.presets.map((p) =>
          p.id === id ? { ...p, pinned: !p.pinned, updatedAt: Date.now() } : p
        );
        savePresets(updated);
        return { presets: updated };
      });
    },

    setActivePreset: (id: string) => {
      set({ activePresetId: id });
    },

    openEditor: (mode: EditorMode, presetId?: string, sourceId?: string) => {
      set({
        isEditorOpen: true,
        editorMode: mode,
        editingPresetId: presetId || null,
        sourcePresetId: sourceId || null,
      });
    },

    closeEditor: () => {
      set({
        isEditorOpen: false,
        editingPresetId: null,
        sourcePresetId: null,
      });
    },

    openDeleteDialog: (presetId: string) => {
      set({ deleteDialogPresetId: presetId });
    },

    closeDeleteDialog: () => {
      set({ deleteDialogPresetId: null });
    },

    getPresetById: (id: string) => get().presets.find((p) => p.id === id),

    getSortedPresets: () => sortPresets(get().presets),
  })
);
