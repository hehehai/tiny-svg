import { emit } from "@create-figma-plugin/utilities";
import type { LanguageLoadedHandler } from "@/types/messages";
import { loadLanguage, saveLanguage } from "../utils/language-storage";

/**
 * Load and send language preference to UI
 */
export async function handleGetLanguage(): Promise<void> {
  const locale = loadLanguage();
  emit<LanguageLoadedHandler>("LANGUAGE_LOADED", locale);
}

/**
 * Save language preference
 */
export async function handleSaveLanguage(locale: string): Promise<void> {
  saveLanguage(locale);
  emit<LanguageLoadedHandler>("LANGUAGE_LOADED", locale);
}
