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
export type SvgExportFormat = "zip" | "sprite" | "iconfonts";

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

interface IconFontsDrawerState {
  isOpen: boolean;
  isGenerating: boolean;
  hasGenerated: boolean;
  generatedBlob: Blob | null;
  selectedIconIds: string[];
  iconNames: Record<string, string>;
  // Form configuration
  fontName: string;
  fileName: string;
  cssPrefix: string;
  formErrors: {
    fontName?: string;
    fileName?: string;
    cssPrefix?: string;
  };
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

  // Icon fonts drawer
  iconFontsDrawer: IconFontsDrawerState;

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

  // Icon fonts drawer
  openIconFontsDrawer: () => void;
  closeIconFontsDrawer: () => void;
  setIconFontsGenerating: (isGenerating: boolean) => void;
  setIconFontsGenerated: (blob: Blob) => void;
  toggleIconSelection: (id: string) => void;
  selectAllIcons: () => void;
  deselectAllIcons: () => void;
  updateIconName: (id: string, name: string) => void;
  setIconFontName: (fontName: string) => void;
  setIconFileName: (fileName: string) => void;
  setIconCssPrefix: (cssPrefix: string) => void;
  setIconFormErrors: (errors: {
    fontName?: string;
    fileName?: string;
    cssPrefix?: string;
  }) => void;

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
  iconFontsDrawer: {
    isOpen: false,
    isGenerating: false,
    hasGenerated: false,
    generatedBlob: null,
    selectedIconIds: [],
    iconNames: {},
    fontName: "My Icon Font",
    fileName: "my-icon-font",
    cssPrefix: "icon",
    formErrors: {},
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

  // Icon fonts drawer
  openIconFontsDrawer: () => {
    const items = (get() as any).items || [];
    const sanitizeIconName = (name: string): string =>
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-") || "icon";

    const iconNames: Record<string, string> = {};
    for (const item of items) {
      iconNames[item.id] = sanitizeIconName(item.name);
    }

    set({
      iconFontsDrawer: {
        isOpen: true,
        isGenerating: false,
        hasGenerated: false,
        generatedBlob: null,
        selectedIconIds: items.map((item: any) => item.id),
        iconNames,
        fontName: "My Icon Font",
        fileName: "my-icon-font",
        cssPrefix: "icon",
        formErrors: {},
      },
    });
  },

  closeIconFontsDrawer: () => {
    set({
      iconFontsDrawer: {
        isOpen: false,
        isGenerating: false,
        hasGenerated: false,
        generatedBlob: null,
        selectedIconIds: [],
        iconNames: {},
        fontName: "My Icon Font",
        fileName: "my-icon-font",
        cssPrefix: "icon",
        formErrors: {},
      },
    });
  },

  setIconFontsGenerating: (isGenerating) => {
    set((state) => ({
      iconFontsDrawer: {
        ...state.iconFontsDrawer,
        isGenerating,
      },
    }));
  },

  setIconFontsGenerated: (blob) => {
    set((state) => ({
      iconFontsDrawer: {
        ...state.iconFontsDrawer,
        isGenerating: false,
        hasGenerated: true,
        generatedBlob: blob,
      },
    }));
  },

  toggleIconSelection: (id) => {
    set((state) => ({
      iconFontsDrawer: {
        ...state.iconFontsDrawer,
        selectedIconIds: state.iconFontsDrawer.selectedIconIds.includes(id)
          ? state.iconFontsDrawer.selectedIconIds.filter((i) => i !== id)
          : [...state.iconFontsDrawer.selectedIconIds, id],
      },
    }));
  },

  selectAllIcons: () => {
    const items = (get() as any).items || [];
    set((state) => ({
      iconFontsDrawer: {
        ...state.iconFontsDrawer,
        selectedIconIds: items.map((item: any) => item.id),
      },
    }));
  },

  deselectAllIcons: () => {
    set((state) => ({
      iconFontsDrawer: {
        ...state.iconFontsDrawer,
        selectedIconIds: [],
      },
    }));
  },

  updateIconName: (id, name) => {
    set((state) => ({
      iconFontsDrawer: {
        ...state.iconFontsDrawer,
        iconNames: {
          ...state.iconFontsDrawer.iconNames,
          [id]: name,
        },
      },
    }));
  },

  setIconFontName: (fontName) => {
    set((state) => ({
      iconFontsDrawer: {
        ...state.iconFontsDrawer,
        fontName,
      },
    }));
  },

  setIconFileName: (fileName) => {
    set((state) => ({
      iconFontsDrawer: {
        ...state.iconFontsDrawer,
        fileName,
      },
    }));
  },

  setIconCssPrefix: (cssPrefix) => {
    set((state) => ({
      iconFontsDrawer: {
        ...state.iconFontsDrawer,
        cssPrefix,
      },
    }));
  },

  setIconFormErrors: (errors) => {
    set((state) => ({
      iconFontsDrawer: {
        ...state.iconFontsDrawer,
        formErrors: errors,
      },
    }));
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
