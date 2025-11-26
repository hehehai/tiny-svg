import type { PluginConfig } from "svgo";
import { defaultGlobalSettings, defaultSvgoPlugins } from "./default-config.js";
import type { CompressionPreset, PluginOverride, SvgoPreset } from "./types.js";

export const compressionPresets: CompressionPreset[] = [
  {
    id: "default",
    name: "Default",
    description: "Balanced compression with good compatibility",
    plugins: ["preset-default"],
    icon: "⚖️",
  },
  {
    id: "aggressive",
    name: "Aggressive",
    description: "Maximum compression, may remove some attributes",
    plugins: [
      "preset-default",
      "removeAttrs",
      "removeElementsByAttr",
      "removeScriptElement",
      "removeStyleElement",
    ],
    icon: "🚀",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Safe compression, preserves all functionality",
    plugins: [
      "cleanupAttrs",
      "cleanupEnableBackground",
      "cleanupIDs",
      "cleanupNumericValues",
      "collapseGroups",
      "convertColors",
      "convertPathData",
      "convertShapeToPath",
      "convertStyleToAttrs",
      "convertTransform",
      "mergePaths",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "removeComments",
      "removeDesc",
      "removeDoctype",
      "removeEditorsNSData",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "removeEmptyText",
      "removeHiddenElems",
      "removeMetadata",
      "removeNonInheritableGroupAttrs",
      "removeRasterImages",
      "removeTitle",
      "removeUnknownsAndDefaults",
      "removeUnusedNS",
      "removeUselessDefs",
      "removeUselessStrokeAndFill",
      "removeXMLProcInst",
      "sortAttrs",
    ],
    icon: "🔧",
  },
  {
    id: "preserve-styles",
    name: "Preserve Styles",
    description: "Keeps styles and classes for web use",
    plugins: [
      "preset-default",
      {
        name: "removeStyleElement",
        active: false,
      },
      {
        name: "convertStyleToAttrs",
        active: false,
      },
    ],
    icon: "🎨",
  },
];

function isPluginOverride(
  plugin: string | PluginOverride
): plugin is PluginOverride {
  return typeof plugin === "object" && "name" in plugin;
}

function getPluginName(plugin: string | PluginOverride): string {
  return isPluginOverride(plugin) ? plugin.name : plugin;
}

function convertToSvgoPlugins(
  plugins: (string | PluginOverride)[]
): PluginConfig[] {
  return plugins.map((plugin) => {
    if (isPluginOverride(plugin)) {
      return {
        name: plugin.name,
        active: plugin.active,
      } as PluginConfig;
    }
    return plugin as PluginConfig;
  });
}

export function getPresetConfig(presetId: string): SvgoPreset | undefined {
  const preset = compressionPresets.find((p) => p.id === presetId);
  if (!preset) {
    return;
  }

  const pluginNames = preset.plugins.map(getPluginName);

  const plugins = defaultSvgoPlugins.map((plugin) => ({
    ...plugin,
    enabled: pluginNames.includes(plugin.name),
  }));

  return {
    name: preset.name,
    description: preset.description,
    config: {
      multipass: defaultGlobalSettings.multipass,
      plugins: convertToSvgoPlugins(preset.plugins),
    },
    plugins,
  };
}
