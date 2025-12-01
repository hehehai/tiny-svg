import { Button } from "@tiny-svg/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tiny-svg/ui/components/select";
import { Tabs, TabsList, TabsTrigger } from "@tiny-svg/ui/components/tabs";
import { useTranslation } from "@/i18n/hooks";
import { type TabType, usePluginStore } from "@/ui/store";

export function Header() {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    globalPreset,
    presets,
    setGlobalPreset,
    toggleSettings,
  } = usePluginStore();

  return (
    <div className="flex items-center justify-between border-b px-3 py-2">
      <Tabs
        onValueChange={(value) => setActiveTab(value as TabType)}
        value={activeTab}
      >
        <TabsList className="h-7 p-0.5">
          <TabsTrigger className="px-2 py-1" value="svg">
            {t("header.svg")}
          </TabsTrigger>
          <TabsTrigger className="px-2 py-1" value="image">
            {t("header.image")}
          </TabsTrigger>
          <TabsTrigger className="px-2 py-1" value="code">
            {t("header.code")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <Select onValueChange={setGlobalPreset} value={globalPreset}>
          <SelectTrigger className="w-[120px] rounded-lg px-2 py-1" size="xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-[120px] rounded-lg">
            {presets.map((preset) => (
              <SelectItem
                className="rounded-md py-1 pr-4 pl-1 text-xs"
                key={preset.id}
                value={preset.id}
              >
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          aria-label={t("header.settingsButton")}
          className="size-7 rounded-lg hover:border-accent"
          onClick={toggleSettings}
          size="icon"
          title={t("header.settingsButton")}
          variant="outline"
        >
          <span className="i-hugeicons-settings-02 size-4" />
        </Button>
      </div>
    </div>
  );
}
