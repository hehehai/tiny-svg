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
import { useTranslation } from "@/i18n/hooks";
import { Logo } from "@/ui/components/logo";
import { usePluginStore } from "@/ui/store";
import { LanguageSelector } from "./language-selector";

const PLUGIN_INFO = {
  name: "Tiny SVG",
  version: "1.0.0",
  description: "适用于 Figma 的强大 SVG 优化和代码生成工具",
  github: "https://github.com/hehehai/tiny-svg",
  issues: "https://github.com/hehehai/tiny-svg/issues",
};

export function AboutTab() {
  const { t } = useTranslation();
  const [showResetDialog, setShowResetDialog] = useState(false);
  const resetPresets = usePluginStore((state) => state.resetPresets);

  const handleReset = () => {
    resetPresets();
    setShowResetDialog(false);
  };

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto max-w-md space-y-4 p-4">
        {/* Plugin Info Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60">
            <Logo className="size-10 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-xl">{t("about.pluginName")}</h3>
            <p className="text-muted-foreground text-sm">
              v{PLUGIN_INFO.version}
            </p>
          </div>
          <p className="text-muted-foreground text-sm">
            {t("about.pluginDescription")}
          </p>
        </div>

        {/* Links Section */}
        <div className="space-y-2">
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
                  <ItemTitle className="leading-relaxed">
                    {t("about.githubRepo")}
                  </ItemTitle>
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
                  <ItemTitle className="leading-relaxed">
                    {t("about.reportIssue")}
                  </ItemTitle>
                </ItemContent>
                <span className="i-hugeicons-arrow-up-right-01 size-4 text-muted-foreground" />
              </a>
            </Item>

            <Item variant="outline">
              <ItemMedia className="border-none bg-transparent" variant="icon">
                <span className="i-hugeicons-translate size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="leading-relaxed">
                  {t("settings.language")}
                </ItemTitle>
              </ItemContent>
              <ItemActions className="w-[140px]">
                <LanguageSelector />
              </ItemActions>
            </Item>

            <Item variant="outline">
              <ItemMedia className="border-none bg-transparent" variant="icon">
                <span className="i-hugeicons-alert-diamond size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="leading-relaxed">
                  {t("about.resetPresets")}
                </ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button
                  className="h-7 rounded-lg px-3 py-1 hover:border-accent"
                  onClick={() => setShowResetDialog(true)}
                  variant="outline"
                >
                  {t("about.resetPresetsButton")}
                </Button>
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>

        <Separator />

        {/* Credits */}
        <div className="space-y-1 text-center text-muted-foreground text-xs">
          <p>{t("about.credits")}</p>
          <p>{t("about.poweredBy")}</p>
        </div>
      </div>

      <AlertDialog onOpenChange={setShowResetDialog} open={showResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("about.confirmResetTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("about.confirmResetDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="flex-1">
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1"
              onClick={handleReset}
              variant="destructive"
            >
              {t("common.reset")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollArea>
  );
}
