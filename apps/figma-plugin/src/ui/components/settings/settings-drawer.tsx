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
          <DrawerHeader className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <DrawerTitle className="font-semibold">Settings</DrawerTitle>
              <DrawerDescription className="sr-only">
                Settings
              </DrawerDescription>

              <TabsList>
                <TabsTrigger value="presets">预设</TabsTrigger>
                <TabsTrigger value="about">关于</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === "presets" && (
                <Button
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
          <TabsContent className="h-[calc(100dvh-53px)] flex-1" value="presets">
            <PresetsTab />
          </TabsContent>

          <TabsContent className="flex-1" value="about">
            <AboutTab />
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}
