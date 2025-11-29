import {
  compressionPresets,
  getPresetConfig as getSharedPresetConfig,
} from "@tiny-svg/svgo-plugins";
import type { Config } from "svgo";
import type { Preset } from "@/types/messages";

// Re-export Config type for convenience
export type { Config as SvgoConfig } from "svgo";

// ============================================================================
// Default Presets
// ============================================================================

export function getDefaultPresets(): Preset[] {
  return compressionPresets.map((preset, index) => {
    const config = getSharedPresetConfig(preset.id);
    return {
      id: preset.id,
      name: preset.name,
      description: preset.description,
      icon: preset.icon,
      isDefault: true,
      svgoConfig: config?.config || { plugins: [] },
      createdAt: Date.now() - index * 1000, // Ensure consistent ordering
      updatedAt: Date.now() - index * 1000,
    };
  });
}

// ============================================================================
// Preset Conversion
// ============================================================================

/**
 * Convert preset to SVGO Config
 * Ensures multipass is enabled for better optimization
 */
export function getPresetConfig(preset: Preset): Config {
  return {
    ...preset.svgoConfig,
    multipass: true,
  };
}

// ============================================================================
// Validation
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePreset(
  preset: Partial<Preset>,
  existingPresets: Preset[]
): ValidationResult {
  const errors: string[] = [];

  // Name validation
  if (!preset.name || preset.name.trim().length === 0) {
    errors.push("Preset name is required");
  } else if (preset.name.trim().length > 50) {
    errors.push("Preset name must be 50 characters or less");
  }

  // Check for duplicate names (excluding current preset if editing)
  if (preset.name) {
    const duplicate = existingPresets.find(
      (p) => p.id !== preset.id && p.name === preset.name
    );
    if (duplicate) {
      errors.push(`A preset named "${preset.name}" already exists`);
    }
  }

  // Description validation (optional)
  if (preset.description && preset.description.length > 200) {
    errors.push("Preset description must be 200 characters or less");
  }

  // SVGO config validation
  if (!preset.svgoConfig) {
    errors.push("SVGO configuration is required");
  } else if (
    !preset.svgoConfig.plugins ||
    preset.svgoConfig.plugins.length === 0
  ) {
    errors.push("At least one SVGO plugin must be enabled");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Preset Helpers
// ============================================================================

export function createPresetId(name: string): string {
  const timestamp = Date.now();
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${timestamp}`;
}

export function duplicatePreset(preset: Preset): Preset {
  return {
    ...preset,
    id: createPresetId(`${preset.name} Copy`),
    name: `${preset.name} (Copy)`,
    isDefault: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function canDeletePreset(preset: Preset): boolean {
  return !preset.isDefault;
}

// ============================================================================
// Preset Sorting
// ============================================================================

export function sortPresets(presets: Preset[]): Preset[] {
  return [...presets].sort((a, b) => {
    // Default presets first
    if (a.isDefault && !b.isDefault) {
      return -1;
    }
    if (!a.isDefault && b.isDefault) {
      return 1;
    }

    // Then by creation date (newest first for custom presets)
    if (!(a.isDefault || b.isDefault)) {
      return b.createdAt - a.createdAt;
    }

    // Default presets maintain original order
    return 0;
  });
}

// ============================================================================
// Preset Statistics
// ============================================================================

export function getPresetPluginCount(preset: Preset): number {
  return preset.svgoConfig.plugins?.length ?? 0;
}

export function isPresetModified(preset: Preset): boolean {
  return preset.createdAt !== preset.updatedAt;
}
