import { useI18n } from "./context";

export function useTranslation() {
  const { translations, locale, isLoading } = useI18n();

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: unknown = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        console.warn(`Missing translation: ${key} [${locale}]`);
        return key; // Return key as fallback
      }
    }

    if (typeof value === "string") {
      return value;
    }

    console.warn(`Translation value is not a string: ${key} [${locale}]`);
    return key;
  };

  return { t, locale, isLoading, translations };
}
