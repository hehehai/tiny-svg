import { emit } from "@create-figma-plugin/utilities";
import type {
  Preset,
  PresetDeletedHandler,
  PresetSavedHandler,
  PresetsLoadedHandler,
  PresetsResetHandler,
} from "@/types/messages";
import { handleAsyncError, sendSuccess } from "../utils/notifications";
import {
  deletePreset as deletePresetFromStorage,
  loadPresets,
  resetPresets,
  upsertPreset,
} from "../utils/preset-storage";

/**
 * Load and send presets to UI
 */
export async function handleGetPresets(): Promise<void> {
  await handleAsyncError(async () => {
    const presets = loadPresets();
    emit<PresetsLoadedHandler>("PRESETS_LOADED", presets);
  }, "Failed to load presets");
}

/**
 * Save or update a preset
 */
export async function handleSavePreset(preset: Preset): Promise<void> {
  await handleAsyncError(async () => {
    upsertPreset(preset);
    emit<PresetSavedHandler>("PRESET_SAVED", preset);
    sendSuccess("Preset saved successfully");
  }, "Failed to save preset");
}

/**
 * Delete a preset by ID
 */
export async function handleDeletePreset(id: string): Promise<void> {
  await handleAsyncError(async () => {
    deletePresetFromStorage(id);
    emit<PresetDeletedHandler>("PRESET_DELETED", id);
    sendSuccess("Preset deleted successfully");
  }, "Failed to delete preset");
}

/**
 * Reset all presets to defaults only
 */
export async function handleResetPresets(): Promise<void> {
  await handleAsyncError(async () => {
    const presets = resetPresets();
    emit<PresetsResetHandler>("PRESETS_RESET");
    emit<PresetsLoadedHandler>("PRESETS_LOADED", presets);
    sendSuccess("Presets reset to defaults");
  }, "Failed to reset presets");
}
