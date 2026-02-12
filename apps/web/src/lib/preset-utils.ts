import { compressionPresets, getPresetConfig } from "@tiny-svg/svg";
import type { Config as SvgoConfig } from "svgo";
import { allSvgoPlugins, type SvgoPluginConfig } from "@/lib/svgo-plugins";
import type { Preset, PresetGlobalSettings } from "@/types/preset";

/**
 * Default compression-related global settings for presets
 */
export const defaultPresetGlobalSettings: PresetGlobalSettings = {
  multipass: true,
  floatPrecision: 2,
  transformPrecision: 4,
};

/**
 * Get system presets from @tiny-svg/svg package
 */
export function getDefaultPresets(): Preset[] {
  return compressionPresets.map((preset, index) => {
    const config = getPresetConfig(preset.id);
    return {
      id: preset.id,
      name: preset.name,
      description: preset.description,
      icon: preset.icon,
      isDefault: true,
      plugins: config?.plugins || allSvgoPlugins,
      globalSettings: defaultPresetGlobalSettings,
      svgoConfig: (config?.config || { plugins: [] }) as SvgoConfig,
      createdAt: Date.now() - index * 1000,
      updatedAt: Date.now() - index * 1000,
    };
  });
}

/**
 * Generate a unique preset ID from name
 */
export function createPresetId(name: string): string {
  const timestamp = Date.now();
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `custom-${slug}-${timestamp}`;
}

/**
 * Validate preset data
 */
export function validatePreset(
  preset: Partial<Preset>,
  existingPresets: Preset[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!preset.name?.trim()) {
    errors.push("Preset name is required");
  } else if (preset.name.length > 50) {
    errors.push("Preset name must be 50 characters or less");
  }

  // Check for duplicate names (excluding current preset when editing)
  const duplicate = existingPresets.find(
    (p) => p.id !== preset.id && p.name === preset.name?.trim()
  );
  if (duplicate) {
    errors.push(`A preset named "${preset.name}" already exists`);
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Check if preset can be deleted (only custom presets can be deleted)
 */
export function canDeletePreset(preset: Preset): boolean {
  return !preset.isDefault;
}

/**
 * Sort presets: pinned first, then system presets, then by updated time
 */
export function sortPresets(presets: Preset[]): Preset[] {
  return [...presets].sort((a, b) => {
    // Pinned first
    if (a.pinned && !b.pinned) {
      return -1;
    }
    if (!a.pinned && b.pinned) {
      return 1;
    }
    // Then default presets
    if (a.isDefault && !b.isDefault) {
      return -1;
    }
    if (!a.isDefault && b.isDefault) {
      return 1;
    }
    // Then by updated time (newest first)
    return b.updatedAt - a.updatedAt;
  });
}

/**
 * Create a duplicate of a preset
 */
export function duplicatePreset(preset: Preset): Preset {
  return {
    ...preset,
    id: createPresetId(`${preset.name} Copy`),
    name: `${preset.name} (Copy)`,
    isDefault: false,
    pinned: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Build SVGO config from plugins and global settings
 */
export function buildSvgoConfig(
  plugins: SvgoPluginConfig[],
  globalSettings: PresetGlobalSettings
): SvgoConfig {
  const enabledPlugins = plugins
    .filter((p) => p.enabled)
    .map((p) => {
      if (p.params) {
        return { name: p.name, params: p.params };
      }
      return p.name;
    });

  return {
    multipass: globalSettings.multipass,
    floatPrecision: globalSettings.floatPrecision,
    plugins: enabledPlugins,
  } as SvgoConfig;
}

/**
 * Get plugin count from preset
 */
export function getPresetPluginCount(preset: Preset): number {
  return preset.plugins.filter((p) => p.enabled).length;
}
