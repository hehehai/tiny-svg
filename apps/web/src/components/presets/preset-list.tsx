import { Button } from "@tiny-svg/ui/components/button";
import { ScrollArea } from "@tiny-svg/ui/components/scroll-area";
import { useIntlayer } from "react-intlayer";
import { usePresetsStore } from "@/store/presets-store";
import { useSvgStore } from "@/store/svg-store";
import type { Preset } from "@/types/preset";
import { PresetCard } from "./preset-card";

export function PresetList() {
  const { presets: t } = useIntlayer("presets");
  const {
    getSortedPresets,
    activePresetId,
    setActivePreset,
    openEditor,
    pinPreset,
    openDeleteDialog,
  } = usePresetsStore();
  const { applyPreset } = useSvgStore();

  const sortedPresets = getSortedPresets();

  const handleApply = (preset: Preset) => {
    setActivePreset(preset.id);
    applyPreset(preset.plugins, preset.globalSettings);
  };

  const handleEdit = (preset: Preset) => {
    openEditor("edit", preset.id);
  };

  const handleDuplicate = (preset: Preset) => {
    openEditor("create", undefined, preset.id);
  };

  const handleDelete = (presetId: string) => {
    openDeleteDialog(presetId);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">{t.title}</h3>
        <Button
          onClick={() => openEditor("create")}
          size="sm"
          type="button"
          variant="outline"
        >
          <span className="i-hugeicons-add-01 mr-1 size-4" />
          {t.addNew}
        </Button>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-2">
          {sortedPresets.map((preset) => (
            <PresetCard
              isActive={activePresetId === preset.id}
              key={preset.id}
              onApply={() => handleApply(preset)}
              onDelete={() => handleDelete(preset.id)}
              onDuplicate={() => handleDuplicate(preset)}
              onEdit={() => handleEdit(preset)}
              onPin={() => pinPreset(preset.id)}
              preset={preset}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
