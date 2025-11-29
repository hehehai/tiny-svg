/**
 * SVGO configuration utilities
 * This file does NOT import 'svgo' to avoid bundling it in the server code
 * SVGO is only used in the worker (svgo.worker.ts)
 */

import type { Config as SvgoConfig } from "svgo";
import type { SvgoGlobalSettings, SvgoPluginConfig } from "@/lib/svgo-plugins";

export const getStandardPreset = (): SvgoConfig => ({
  multipass: true,
  plugins: ["preset-default"] as unknown as SvgoConfig["plugins"],
});

export const buildSvgoConfig = (
  plugins: SvgoPluginConfig[],
  globalSettings: SvgoGlobalSettings
): SvgoConfig => {
  const enabledPlugins = plugins.filter((p) => p.enabled).map((p) => p.name);

  return {
    multipass: globalSettings.multipass,
    floatPrecision: globalSettings.floatPrecision,
    plugins:
      enabledPlugins.length > 0
        ? (enabledPlugins as unknown as SvgoConfig["plugins"])
        : (["preset-default"] as unknown as SvgoConfig["plugins"]),
  };
};

// Re-export from svg-core for backward compatibility
export {
  calculateCompressionRatio as calculateCompressionRate,
  formatSize as formatBytes,
} from "@tiny-svg/svg-core";
