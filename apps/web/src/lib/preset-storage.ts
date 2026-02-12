import type { Preset } from "@/types/preset";

const STORAGE_KEY = "tiny-svg-presets";

/**
 * Load custom presets from localStorage
 * System presets are not stored, only custom presets
 */
export function loadPresets(): Preset[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save custom presets to localStorage
 * Filters out system presets (isDefault: true)
 */
export function savePresets(presets: Preset[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const customPresets = presets.filter((p) => !p.isDefault);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
}

/**
 * Save a single preset to localStorage
 * Handles both new presets and updates
 */
export function savePreset(preset: Preset): void {
  if (preset.isDefault) {
    return; // Don't persist system presets
  }

  const presets = loadPresets();
  const index = presets.findIndex((p) => p.id === preset.id);

  if (index >= 0) {
    presets[index] = preset;
  } else {
    presets.push(preset);
  }

  savePresets(presets);
}

/**
 * Delete a preset from localStorage by ID
 */
export function deletePresetFromStorage(id: string): void {
  const presets = loadPresets().filter((p) => p.id !== id);
  savePresets(presets);
}
