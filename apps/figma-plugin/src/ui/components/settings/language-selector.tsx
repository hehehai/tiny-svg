import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tiny-svg/ui/components/select";
import { useI18n } from "@/i18n/context";
import type { Locale } from "@/i18n/types";
import { usePluginStore } from "@/ui/store";

const LANGUAGES: { value: Locale; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "zh", label: "简体中文", flag: "🇨🇳" },
  { value: "ko", label: "한국어", flag: "🇰🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
];

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  const saveLanguagePreference = usePluginStore(
    (state) => state.saveLanguagePreference
  );

  const handleChange = async (newLocale: Locale) => {
    await setLocale(newLocale); // Load translations
    saveLanguagePreference(newLocale); // Persist to Figma
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.value === locale);

  return (
    <Select onValueChange={(v) => handleChange(v as Locale)} value={locale}>
      <SelectTrigger className="w-full rounded-lg px-2 py-1" size="xs">
        <SelectValue>
          {currentLanguage && (
            <span className="flex items-center gap-2">
              <span>{currentLanguage.flag}</span>
              <span>{currentLanguage.label}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-[140px] rounded-lg">
        {LANGUAGES.map((lang) => (
          <SelectItem
            className="rounded-md py-1 pr-4 pl-1 text-xs"
            key={lang.value}
            value={lang.value}
          >
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
