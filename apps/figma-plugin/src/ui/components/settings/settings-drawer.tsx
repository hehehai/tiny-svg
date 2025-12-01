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
import { usePluginStore } from "@/ui/store";
import { AboutTab } from "./about-tab";
import { PresetsTab } from "./presets-tab";

export function SettingsDrawer() {
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
                Settings
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                Settings
              </DrawerDescription>

              <TabsList className="h-7 p-0.5">
                <TabsTrigger className="px-2 py-1" value="presets">
                  预设
                </TabsTrigger>
                <TabsTrigger className="px-2 py-1" value="about">
                  关于
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
                  创建
                </Button>
              )}

              <DrawerClose asChild>
                <Button
                  aria-label="关闭"
                  className="size-7 rounded-lg hover:border-accent"
                  size="icon"
                  title="关闭"
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

          <TabsContent className="mt-0 flex-1" value="about">
            <AboutTab />
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}
