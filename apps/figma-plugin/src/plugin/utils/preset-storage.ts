import { getDefaultPresets } from "@/lib/preset-utils";
import type { Preset } from "@/types/messages";

const PLUGIN_DATA_KEY = "tiny-svg-presets";

// Get default presets from shared configuration
const DEFAULT_PRESETS: Preset[] = getDefaultPresets();

/**
 * Load presets from Figma Plugin Data
 * Always merges with default presets to ensure they're present
 */
export function loadPresets(): Preset[] {
  const data = figma.root.getPluginData(PLUGIN_DATA_KEY);

  if (!data) {
    // No saved presets, return defaults
    return [...DEFAULT_PRESETS];
  }

  try {
    const savedPresets: Preset[] = JSON.parse(data);

    // Merge with defaults (ensure defaults are always present)
    const mergedPresets = [...DEFAULT_PRESETS];

    for (const preset of savedPresets) {
      // Only add non-default presets from storage
      if (!preset.isDefault) {
        mergedPresets.push(preset);
      }
    }

    return mergedPresets;
  } catch (error) {
    console.error("Failed to parse presets:", error);
    return [...DEFAULT_PRESETS];
  }
}

/**
 * Save presets to Figma Plugin Data
 */
export function savePresets(presets: Preset[]): void {
  const data = JSON.stringify(presets);
  figma.root.setPluginData(PLUGIN_DATA_KEY, data);
}

/**
 * Add or update a preset
 */
export function upsertPreset(preset: Preset): Preset[] {
  const presets = loadPresets();
  const existingIndex = presets.findIndex((p) => p.id === preset.id);

  if (existingIndex >= 0) {
    // Update existing preset
    presets[existingIndex] = {
      ...preset,
      updatedAt: Date.now(),
    };
  } else {
    // Add new preset
    presets.push({
      ...preset,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  savePresets(presets);
  return presets;
}

/**
 * Delete a preset by ID
 * @throws Error if attempting to delete a default preset
 */
export function deletePreset(id: string): Preset[] {
  const presets = loadPresets();

  // Prevent deleting default presets
  const preset = presets.find((p) => p.id === id);
  if (preset?.isDefault) {
    throw new Error("Cannot delete default preset");
  }

  const filtered = presets.filter((p) => p.id !== id);
  savePresets(filtered);

  return filtered;
}

/**
 * Reset presets to defaults only
 * Removes all custom presets from storage
 */
export function resetPresets(): Preset[] {
  // Clear storage completely
  figma.root.setPluginData(PLUGIN_DATA_KEY, "");
  // Return only the first default preset (Default)
  return [...DEFAULT_PRESETS];
}
