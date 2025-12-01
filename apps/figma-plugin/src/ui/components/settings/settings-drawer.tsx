import { Button } from "@tiny-svg/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@tiny-svg/ui/components/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tiny-svg/ui/components/tabs";
import { useState } from "react";
import { useTranslation } from "@/i18n/hooks";
import { usePluginStore } from "@/ui/store";
import { AboutTab } from "./about-tab";
import { PresetsTab } from "./presets-tab";

export function SettingsDrawer() {
  const { t } = useTranslation();
  const { settingsOpen, closeSettings, openPresetEditor } = usePluginStore();
  const [activeTab, setActiveTab] = useState("presets");

  const handleCreatePreset = () => {
    openPresetEditor("create");
  };

  return (
    <Drawer
      direction="left"
      onOpenChange={(open) => {
        if (!open) {
          closeSettings();
        }
      }}
      open={settingsOpen}
    >
      <DrawerContent className="h-screen w-full! max-w-full!">
        {/* Tabs */}
        <Tabs
          className="flex h-full flex-1 flex-col gap-0"
          defaultValue="presets"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          {/* Header with Title and Tabs */}
          <DrawerHeader className="flex items-center justify-between border-b px-4 py-2">
            <div className="flex items-center gap-3">
              <DrawerTitle className="font-semibold text-base">
                {t("settings.title")}
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                {t("settings.title")}
              </DrawerDescription>

              <TabsList className="h-7 p-0.5">
                <TabsTrigger className="px-2 py-1" value="presets">
                  {t("settings.presets")}
                </TabsTrigger>
                <TabsTrigger className="px-2 py-1" value="about">
                  {t("settings.about")}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === "presets" && (
                <Button
                  className="h-7 rounded-lg px-3 py-1"
                  onClick={handleCreatePreset}
                  type="button"
                  variant="default"
                >
                  {t("common.create")}
                </Button>
              )}

              <DrawerClose asChild>
                <Button
                  aria-label={t("common.close")}
                  className="size-7 rounded-lg hover:border-accent"
                  size="icon"
                  title={t("common.close")}
                  type="button"
                  variant="outline"
                >
                  <span className="i-hugeicons-cancel-01 size-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Tabs Content */}
          <TabsContent
            className="mt-0 h-[calc(100dvh-53px)] flex-1"
            value="presets"
          >
            <PresetsTab />
          </TabsContent>

          <TabsContent
            className="mt-0 h-[calc(100dvh-53px)] flex-1"
            value="about"
          >
            <AboutTab />
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}

export default SettingsDrawer;
