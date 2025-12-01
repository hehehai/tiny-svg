const PLUGIN_DATA_KEY = "tiny-svg-language";
const DEFAULT_LOCALE = "en";

/**
 * Load language preference from Figma Plugin Data
 */
export function loadLanguage(): string {
  const data = figma.root.getPluginData(PLUGIN_DATA_KEY);
  return data || DEFAULT_LOCALE;
}

/**
 * Save language preference to Figma Plugin Data
 */
export function saveLanguage(locale: string): void {
  figma.root.setPluginData(PLUGIN_DATA_KEY, locale);
}
