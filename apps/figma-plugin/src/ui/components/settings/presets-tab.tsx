import { Button } from "@tiny-svg/ui/components/button";
import { ScrollArea } from "@tiny-svg/ui/components/scroll-area";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@tiny-svg/ui/shared/empty";
import { ItemGroup } from "@tiny-svg/ui/shared/item";
import { usePluginStore } from "@/ui/store";
import { PresetListItem } from "./preset-list-item";

export function PresetsTab() {
  const { presets, openPresetEditor, getPresetUsageCount, globalPreset } =
    usePluginStore();

  const handleCreate = () => {
    openPresetEditor("create");
  };

  // Sort presets: pinned first, then by updated time
  const sortedPresets = [...presets].sort((a, b) => {
    if (a.pinned && !b.pinned) {
      return -1;
    }
    if (!a.pinned && b.pinned) {
      return 1;
    }
    return b.updatedAt - a.updatedAt;
  });

  if (presets.length === 0) {
    return (
      <Empty className="min-h-[400px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <span className="i-hugeicons-file-add size-6" />
          </EmptyMedia>
          <EmptyTitle>暂无预设</EmptyTitle>
          <EmptyDescription>
            创建预设以保存常用的优化配置，方便在多个项目中复用。
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={handleCreate} type="button">
            <span className="i-hugeicons-add-01" />
            创建预设
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ScrollArea className="h-full p-3">
      <ItemGroup className="gap-2">
        {sortedPresets.map((preset) => (
          <PresetListItem
            isSelected={globalPreset === preset.id}
            key={preset.id}
            preset={preset}
            usageCount={getPresetUsageCount(preset.id)}
          />
        ))}
      </ItemGroup>
    </ScrollArea>
  );
}
