import { Badge } from "@tiny-svg/ui/components/badge";
import { Button } from "@tiny-svg/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@tiny-svg/ui/components/tooltip";
import { cn } from "@tiny-svg/ui/lib/utils";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@tiny-svg/ui/shared/item";
import { useState } from "react";
import type { Preset } from "@/types/messages";
import { DeleteConfirmationDialog } from "@/ui/components/preset/delete-confirmation-dialog";
import { usePluginStore } from "@/ui/store";

interface PresetListItemProps {
  preset: Preset;
  usageCount?: number;
  isSelected?: boolean;
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor(diff / 60_000);

  if (days > 0) {
    return `${days} 天前`;
  }
  if (hours > 0) {
    return `${hours} 小时前`;
  }
  if (minutes > 0) {
    return `${minutes} 分钟前`;
  }
  return "刚刚";
}

export function PresetListItem({
  preset,
  usageCount = 0,
  isSelected = false,
}: PresetListItemProps) {
  const { openPresetEditor, deletePreset, pinPreset } = usePluginStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = () => {
    openPresetEditor("edit", { presetId: preset.id });
  };

  const handleDuplicate = () => {
    openPresetEditor("create", { sourcePresetId: preset.id });
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deletePreset(preset.id);
    setShowDeleteDialog(false);
  };

  const handlePin = () => {
    pinPreset(preset.id);
  };

  return (
    <>
      <Item
        className={cn(isSelected && "border-primary")}
        size="sm"
        variant="outline"
      >
        <ItemContent>
          <ItemTitle>
            {preset.name}
            {preset.isDefault && (
              <Badge className="text-xs" variant="secondary">
                系统
              </Badge>
            )}
          </ItemTitle>
          <div className="text-muted-foreground text-xs">
            使用 {usageCount} 次 • {formatRelativeTime(preset.updatedAt)}
          </div>
        </ItemContent>

        <ItemActions>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label={preset.pinned ? "取消置顶" : "置顶"}
                  onClick={handlePin}
                  size="icon-sm"
                  title={preset.pinned ? "取消置顶" : "置顶"}
                  variant="ghost"
                >
                  <span
                    className={
                      preset.pinned
                        ? "i-hugeicons-pin size-4 text-primary"
                        : "i-hugeicons-pin size-4"
                    }
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {preset.pinned ? "取消置顶" : "置顶"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="编辑"
                  onClick={handleEdit}
                  size="icon-sm"
                  title="编辑"
                  variant="ghost"
                >
                  <span className="i-hugeicons-pencil-edit-01 size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>编辑</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="复制"
                  onClick={handleDuplicate}
                  size="icon-sm"
                  title="复制"
                  variant="ghost"
                >
                  <span className="i-hugeicons-copy-01 size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>复制</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="删除"
                  disabled={preset.isDefault}
                  onClick={handleDelete}
                  size="icon-sm"
                  title="删除"
                  variant="ghost"
                >
                  <span className="i-hugeicons-delete-02 size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {preset.isDefault ? "默认预设不能删除" : "删除"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ItemActions>
      </Item>

      <DeleteConfirmationDialog
        onConfirm={handleConfirmDelete}
        onOpenChange={setShowDeleteDialog}
        open={showDeleteDialog}
        presetName={preset.name}
      />
    </>
  );
}
