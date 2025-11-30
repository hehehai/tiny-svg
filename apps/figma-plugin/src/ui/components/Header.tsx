import { Button } from "@tiny-svg/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tiny-svg/ui/components/select";
import { Tabs, TabsList, TabsTrigger } from "@tiny-svg/ui/components/tabs";
import { type TabType, usePluginStore } from "@/ui/store";

export function Header() {
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
        <TabsList>
          <TabsTrigger value="svg">SVG</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <Select onValueChange={setGlobalPreset} value={globalPreset}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          aria-label="Settings"
          onClick={toggleSettings}
          size="icon"
          title="Settings"
          variant="outline"
        >
          <span className="i-hugeicons-settings-02 size-4" />
        </Button>
      </div>
    </div>
  );
}
