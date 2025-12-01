import { emit } from "@create-figma-plugin/utilities";
import type { StateCreator } from "zustand";
import type { Locale } from "@/i18n/types";
import type { SaveLanguageHandler } from "@/types/messages";

// ============================================================================
// Types
// ============================================================================

export type TabType = "svg" | "image" | "code";
export type PreviewTabType = "view" | "code";
export type CodeViewMode = "diff" | "origin" | "optimized";
export type BackgroundStyle =
  | "transparent-light"
  | "transparent-dark"
  | "solid-light"
  | "solid-dark";
export type ImageFormat = "png" | "jpeg" | "webp" | "ico";
export type CodeFormat =
  | "react-jsx"
  | "react-tsx"
  | "vue"
  | "svelte"
  | "react-native"
  | "flutter"
  | "data-uri"
  | "base64";
export type SvgExportFormat = "zip" | "sprite";

interface PreviewModalState {
  isOpen: boolean;
  itemId: string | null;
  activeTab: PreviewTabType;
  codeViewMode: CodeViewMode;
  showViewBoxOutline: boolean;
  backgroundStyle: BackgroundStyle;
}

interface PresetEditorState {
  isOpen: boolean;
  mode: "create" | "edit";
  presetId: string | null;
  sourcePresetId?: string; // For duplicating
}

// ============================================================================
// State Interface
// ============================================================================

export interface UiState {
  // Tabs
  activeTab: TabType;

  // Language
  locale: Locale;

  // Preview modal
  previewModal: PreviewModalState;

  // Preset editor
  presetEditor: PresetEditorState;

  // Settings
  settingsOpen: boolean;

  // Export options
  selectedImageFormats: ImageFormat[];
  selectedCodeFormat: CodeFormat;
  selectedSvgExportFormat: SvgExportFormat;

  // Error state
  error: {
    message: string;
    details?: string;
  } | null;
}

export interface UiActions {
  // Tabs
  setActiveTab: (tab: TabType) => void;

  // Language
  setLocale: (locale: Locale) => void;
  saveLanguagePreference: (locale: Locale) => void;

  // Preview modal
  openPreview: (itemId: string, tab?: PreviewTabType) => void;
  closePreview: () => void;
  setPreviewTab: (tab: PreviewTabType) => void;
  setPreviewPreset: (itemId: string, presetId: string) => void;
  setPreviewCodeViewMode: (mode: CodeViewMode) => void;
  togglePreviewViewBoxOutline: () => void;
  cyclePreviewBackground: () => void;

  // Preset editor
  openPresetEditor: (
    mode: "create" | "edit",
    options?: { presetId?: string; sourcePresetId?: string }
  ) => void;
  closePresetEditor: () => void;

  // Settings
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;

  // Export options
  setImageFormats: (formats: ImageFormat[]) => void;
  toggleImageFormat: (format: ImageFormat) => void;
  setCodeFormat: (format: CodeFormat) => void;
  setSvgExportFormat: (format: SvgExportFormat) => void;

  // Error
  setError: (message: string, details?: string) => void;
  clearError: () => void;
}

export type UiStore = UiState & UiActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: UiState = {
  activeTab: "svg",
  locale: "en",
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
};

// ============================================================================
// UI Store
// ============================================================================

export const createUiStore: StateCreator<
  UiStore & { updateItem: (id: string, updates: { preset: string }) => void },
  [],
  [],
  UiStore
> = (set, get) => ({
  ...initialState,

  // Tabs
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  // Language
  setLocale: (locale) => {
    set({ locale });
  },

  saveLanguagePreference: (locale) => {
    set({ locale });
    emit<SaveLanguageHandler>("SAVE_LANGUAGE", locale);
  },

  // Preview modal
  openPreview: (itemId, tab = "view") => {
    set({
      previewModal: {
        isOpen: true,
        itemId,
        activeTab: tab,
        codeViewMode: "diff",
        showViewBoxOutline: false,
        backgroundStyle: "transparent-light",
      },
    });
  },

  closePreview: () => {
    set({
      previewModal: {
        isOpen: false,
        itemId: null,
        activeTab: "view",
        codeViewMode: "diff",
        showViewBoxOutline: false,
        backgroundStyle: "transparent-light",
      },
    });
  },

  setPreviewTab: (tab) => {
    set((state) => ({
      previewModal: {
        ...state.previewModal,
        activeTab: tab,
      },
    }));
  },

  setPreviewPreset: (itemId, presetId) => {
    // Update the item's preset in the main list
    get().updateItem(itemId, { preset: presetId });
  },

  setPreviewCodeViewMode: (mode) => {
    set((state) => ({
      previewModal: {
        ...state.previewModal,
        codeViewMode: mode,
      },
    }));
  },

  togglePreviewViewBoxOutline: () => {
    set((state) => ({
      previewModal: {
        ...state.previewModal,
        showViewBoxOutline: !state.previewModal.showViewBoxOutline,
      },
    }));
  },

  cyclePreviewBackground: () => {
    set((state) => {
      const styles: BackgroundStyle[] = [
        "transparent-light",
        "transparent-dark",
        "solid-light",
        "solid-dark",
      ];
      const currentIndex = styles.indexOf(state.previewModal.backgroundStyle);
      const nextIndex = (currentIndex + 1) % styles.length;
      const nextStyle = styles[nextIndex];
      return {
        previewModal: {
          ...state.previewModal,
          backgroundStyle: nextStyle || "transparent-light",
        },
      };
    });
  },

  // Preset editor
  openPresetEditor: (mode, options = {}) => {
    set({
      presetEditor: {
        isOpen: true,
        mode,
        presetId: options.presetId || null,
        sourcePresetId: options.sourcePresetId,
      },
    });
  },

  closePresetEditor: () => {
    set({
      presetEditor: {
        isOpen: false,
        mode: "create",
        presetId: null,
        sourcePresetId: undefined,
      },
    });
  },

  // Settings
  openSettings: () => {
    set({ settingsOpen: true });
  },

  closeSettings: () => {
    set({ settingsOpen: false });
  },

  toggleSettings: () => {
    set((state) => ({ settingsOpen: !state.settingsOpen }));
  },

  // Export options
  setImageFormats: (formats) => {
    set({ selectedImageFormats: formats });
  },

  toggleImageFormat: (format) => {
    set((state) => ({
      selectedImageFormats: state.selectedImageFormats.includes(format)
        ? state.selectedImageFormats.filter((f) => f !== format)
        : [...state.selectedImageFormats, format],
    }));
  },

  setCodeFormat: (format) => {
    set({ selectedCodeFormat: format });
  },

  setSvgExportFormat: (format) => {
    set({ selectedSvgExportFormat: format });
  },

  // Error
  setError: (message, details) => {
    set({ error: { message, details } });
  },

  clearError: () => {
    set({ error: null });
  },
});
