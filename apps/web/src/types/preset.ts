import type { Config as SvgoConfig } from "svgo";
import type { SvgoPluginConfig } from "@/lib/svgo-plugins";

/**
 * Compression-related global settings that are stored in presets
 * (Display settings like showOriginal, compareGzipped are kept in ui-store)
 */
export type PresetGlobalSettings = {
  multipass: boolean;
  floatPrecision: number;
  transformPrecision: number;
};

export type Preset = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isDefault: boolean; // true = system preset from @tiny-svg/svg
  pinned?: boolean;
  svgoConfig: SvgoConfig;
  plugins: SvgoPluginConfig[];
  globalSettings: PresetGlobalSettings;
  createdAt: number;
  updatedAt: number;
};

export type PresetCreateInput = {
  name: string;
  description?: string;
  icon?: string;
  plugins: SvgoPluginConfig[];
  globalSettings: PresetGlobalSettings;
};

export type PresetUpdateInput = PresetCreateInput & {
  id: string;
};
