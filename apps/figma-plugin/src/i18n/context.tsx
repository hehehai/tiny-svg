import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import de from "./locales/de";
import en from "./locales/en";
import fr from "./locales/fr";
import ko from "./locales/ko";
import zh from "./locales/zh";
import type { Locale, TranslationFile } from "./types";

// Preload all translations
const translations: Record<Locale, TranslationFile> = {
  en,
  zh,
  ko,
  de,
  fr,
};

interface I18nContextValue {
  locale: Locale;
  translations: TranslationFile;
  isLoading: boolean;
  setLocale: (locale: Locale) => Promise<void>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({
  children,
  initialLocale = "en",
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [currentTranslations, setCurrentTranslations] =
    useState<TranslationFile>(translations[initialLocale]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTranslations = useCallback((newLocale: Locale) => {
    setIsLoading(true);
    // Get translations from preloaded map
    const localeTranslations = translations[newLocale] || translations.en;
    setCurrentTranslations(localeTranslations);
    setIsLoading(false);
  }, []);

  const setLocale = async (newLocale: Locale) => {
    setLocaleState(newLocale);
    loadTranslations(newLocale);
  };

  // Load translations when locale changes
  useEffect(() => {
    loadTranslations(locale);
  }, [locale, loadTranslations]);

  // Sync with external locale changes (from store)
  useEffect(() => {
    if (initialLocale !== locale) {
      setLocaleState(initialLocale);
    }
  }, [initialLocale, locale]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        translations: currentTranslations,
        isLoading,
        setLocale,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
