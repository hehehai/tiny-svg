import type { TranslationFile } from "@/i18n/types";

export function getPluginLabel(
  name: string,
  translations: TranslationFile | undefined
): string {
  if (!translations?.presets?.pluginLabels) {
    return name;
  }
  const pluginLabels = translations.presets.pluginLabels as Record<
    string,
    string
  >;
  return pluginLabels[name] || name;
}

export function getAllPluginLabels(
  translations: TranslationFile | undefined
): Array<{ name: string; label: string }> {
  if (!translations?.presets?.pluginLabels) {
    return [];
  }
  const pluginLabels = translations.presets.pluginLabels as Record<
    string,
    string
  >;
  return Object.entries(pluginLabels).map(([name, label]) => ({
    name,
    label,
  }));
}
