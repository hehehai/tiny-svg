import type { EventHandler } from "@create-figma-plugin/utilities";
import type { Config } from "svgo";

// ============================================================================
// Figma Node Data
// ============================================================================

export interface FigmaNodeData {
  id: string;
  nodeId: string;
  name: string;
  svg: string;
}

// ============================================================================
// Preset Types
// ============================================================================

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isDefault: boolean;
  pinned?: boolean;
  svgoConfig: Config;
  createdAt: number;
  updatedAt: number;
}

export interface PresetCreateInput {
  name: string;
  description: string;
  icon?: string;
  svgoConfig: Config;
}

export interface PresetUpdateInput extends PresetCreateInput {
  id: string;
}

// ============================================================================
// Item Compression Types
// ============================================================================

export interface ItemCompressRequest {
  id: string;
  svg: string;
  presetId: string;
}

export interface ItemCompressResult {
  id: string;
  compressedSvg: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

// ============================================================================
// Event Handlers (Plugin ↔ UI Communication)
// ============================================================================

export interface InitHandler extends EventHandler {
  name: "INIT";
  handler: () => void;
}

export interface GetSelectionHandler extends EventHandler {
  name: "GET_SELECTION";
  handler: () => void;
}

export interface SelectionChangedHandler extends EventHandler {
  name: "SELECTION_CHANGED";
  handler: (items: FigmaNodeData[]) => void;
}

export interface GetPresetsHandler extends EventHandler {
  name: "GET_PRESETS";
  handler: () => void;
}

export interface PresetsLoadedHandler extends EventHandler {
  name: "PRESETS_LOADED";
  handler: (presets: Preset[]) => void;
}

export interface SavePresetHandler extends EventHandler {
  name: "SAVE_PRESET";
  handler: (preset: Preset) => void;
}

export interface PresetSavedHandler extends EventHandler {
  name: "PRESET_SAVED";
  handler: (preset: Preset) => void;
}

export interface DeletePresetHandler extends EventHandler {
  name: "DELETE_PRESET";
  handler: (id: string) => void;
}

export interface PresetDeletedHandler extends EventHandler {
  name: "PRESET_DELETED";
  handler: (id: string) => void;
}

export interface ResetPresetsHandler extends EventHandler {
  name: "RESET_PRESETS";
  handler: () => void;
}

export interface PresetsResetHandler extends EventHandler {
  name: "PRESETS_RESET";
  handler: () => void;
}

export interface ErrorHandler extends EventHandler {
  name: "ERROR";
  handler: (message: string, details?: string) => void;
}

export interface SaveLanguageHandler extends EventHandler {
  name: "SAVE_LANGUAGE";
  handler: (locale: string) => void;
}

export interface LanguageLoadedHandler extends EventHandler {
  name: "LANGUAGE_LOADED";
  handler: (locale: string) => void;
}

export interface CloseHandler extends EventHandler {
  name: "CLOSE";
  handler: () => void;
}

// ============================================================================
// Helper Types
// ============================================================================

export interface PluginDataKeys {
  PRESETS: "tiny-svg-presets";
}

export const PLUGIN_DATA_KEYS: PluginDataKeys = {
  PRESETS: "tiny-svg-presets",
};
