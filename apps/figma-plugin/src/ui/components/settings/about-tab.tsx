import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@tiny-svg/ui/components/alert-dialog";
import { Button } from "@tiny-svg/ui/components/button";
import { ScrollArea } from "@tiny-svg/ui/components/scroll-area";
import { Separator } from "@tiny-svg/ui/components/separator";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@tiny-svg/ui/shared/item";
import { useState } from "react";
import { usePluginStore } from "@/ui/store";

const PLUGIN_INFO = {
  name: "Tiny SVG",
  version: "1.0.0",
  description: "适用于 Figma 的强大 SVG 优化和代码生成工具",
  github: "https://github.com/hehehai/tiny-svg",
  issues: "https://github.com/hehehai/tiny-svg/issues",
};

export function AboutTab() {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const resetPresets = usePluginStore((state) => state.resetPresets);

  const handleReset = () => {
    resetPresets();
    setShowResetDialog(false);
  };

  return (
    <ScrollArea className="flex-1">
      <div className="mx-auto max-w-md space-y-6 p-6">
        {/* Plugin Info Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/60">
            <span className="i-hugeicons-file-validation size-8 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-xl">{PLUGIN_INFO.name}</h3>
            <p className="text-muted-foreground text-sm">
              v{PLUGIN_INFO.version}
            </p>
          </div>
          <p className="text-muted-foreground text-sm">
            {PLUGIN_INFO.description}
          </p>
        </div>

        <Separator />

        {/* Links Section */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">链接</h4>

          <ItemGroup className="gap-2">
            <Item asChild variant="outline">
              <a
                href={PLUGIN_INFO.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ItemMedia
                  className="border-none bg-transparent"
                  variant="icon"
                >
                  <span className="i-hugeicons-github size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="leading-relaxed">GitHub 仓库</ItemTitle>
                </ItemContent>
                <span className="i-hugeicons-arrow-up-right-01 size-4 text-muted-foreground" />
              </a>
            </Item>

            <Item asChild variant="outline">
              <a
                href={PLUGIN_INFO.issues}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ItemMedia
                  className="border-none bg-transparent"
                  variant="icon"
                >
                  <span className="i-hugeicons-alert-circle size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="leading-relaxed">报告问题</ItemTitle>
                </ItemContent>
                <span className="i-hugeicons-arrow-up-right-01 size-4 text-muted-foreground" />
              </a>
            </Item>

            <Item variant="outline">
              <ItemMedia className="border-none bg-transparent" variant="icon">
                <span className="i-hugeicons-alert-diamond size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="leading-relaxed">重置预设</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button
                  onClick={() => setShowResetDialog(true)}
                  variant="outline"
                >
                  重置
                </Button>
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>

        <Separator />

        {/* Credits */}
        <div className="space-y-1 text-center text-muted-foreground text-xs">
          <p>Built with ❤️ by the Tiny SVG Team</p>
          <p>Powered by SVGO</p>
        </div>
      </div>

      <AlertDialog onOpenChange={setShowResetDialog} open={showResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认重置预设</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将删除所有自定义预设，仅保留默认预设。此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="flex-1">取消</AlertDialogCancel>
            <AlertDialogAction
              className="flex-1"
              onClick={handleReset}
              variant="destructive"
            >
              重置
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollArea>
  );
}
