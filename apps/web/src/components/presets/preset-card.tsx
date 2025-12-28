import { Badge } from "@tiny-svg/ui/components/badge";
import { Button } from "@tiny-svg/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tiny-svg/ui/components/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@tiny-svg/ui/components/tooltip";
import { cn } from "@tiny-svg/ui/lib/utils";
import { useIntlayer } from "react-intlayer";
import type { Preset } from "@/types/preset";

type PresetCardProps = {
  preset: Preset;
  isActive: boolean;
  onApply: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onPin: () => void;
};

export function PresetCard({
  preset,
  isActive,
  onApply,
  onEdit,
  onDuplicate,
  onDelete,
  onPin,
}: PresetCardProps) {
  const { presets: t } = useIntlayer("presets");

  return (
    <Card
      className={cn(
        "transition-colors",
        isActive && "border-primary ring-1 ring-primary"
      )}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {preset.icon && <span className="text-lg">{preset.icon}</span>}
            <CardTitle className="text-sm">{preset.name}</CardTitle>
            {preset.isDefault && (
              <Badge className="text-xs" variant="secondary">
                {t.systemBadge}
              </Badge>
            )}
            {preset.pinned && (
              <span className="i-hugeicons-pin size-3 text-primary" />
            )}
          </div>
        </div>
        {preset.description && (
          <CardDescription className="mt-1 text-xs">
            {preset.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex items-center justify-between">
          <Button
            disabled={isActive}
            onClick={onApply}
            size="sm"
            type="button"
            variant={isActive ? "secondary" : "default"}
          >
            {isActive ? t.applied : t.apply}
          </Button>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="size-7"
                    onClick={onPin}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <span
                      className={cn(
                        "i-hugeicons-pin size-4",
                        preset.pinned && "text-primary"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {preset.pinned ? t.unpin : t.pin}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="size-7"
                    onClick={onEdit}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <span className="i-hugeicons-pencil-edit-01 size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.edit}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="size-7"
                    onClick={onDuplicate}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <span className="i-hugeicons-copy-01 size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.duplicate}</TooltipContent>
              </Tooltip>

              {!preset.isDefault && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="size-7 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={onDelete}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <span className="i-hugeicons-delete-02 size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t.delete}</TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
