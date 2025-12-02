import { Button } from "@tiny-svg/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@tiny-svg/ui/components/drawer";
import { Input } from "@tiny-svg/ui/components/input";
import { ScrollArea } from "@tiny-svg/ui/components/scroll-area";
import { Separator } from "@tiny-svg/ui/components/separator";
import { Switch } from "@tiny-svg/ui/components/switch";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "@/i18n/hooks";
import { getPluginLabel } from "@/ui/lib/plugin-labels";
import {
  allSvgoPlugins,
  defaultGlobalSettings,
  type SvgoGlobalSettings,
  type SvgoPluginConfig,
} from "@/ui/lib/svgo-plugins";
import { usePluginStore } from "@/ui/store";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

// Custom config interface that includes our extensions
interface PresetConfig {
  multipass?: boolean;
  floatPrecision?: number;
  transformPrecision?: number;
  plugins?: Array<string | Record<string, unknown>>;
}

export function PresetEditorDrawer() {
  const {
    presetEditor,
    closePresetEditor,
    presets,
    addPreset,
    updatePreset,
    deletePreset,
  } = usePluginStore();
  const { t, translations } = useTranslation();

  const [name, setName] = useState("");
  const [plugins, setPlugins] = useState<SvgoPluginConfig[]>(allSvgoPlugins);
  const [globalSettings, setGlobalSettings] = useState<SvgoGlobalSettings>(
    defaultGlobalSettings
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  // Extract enabled plugin names from config
  const extractEnabledPlugins = useCallback(
    (configPlugins: PresetConfig["plugins"]): Set<string> => {
      const enabledPluginNames = new Set<string>();
      if (!Array.isArray(configPlugins)) {
        return enabledPluginNames;
      }

      for (const plugin of configPlugins) {
        if (typeof plugin === "string") {
          enabledPluginNames.add(plugin);
        } else if (typeof plugin === "object" && plugin !== null) {
          const pluginName = Object.keys(plugin)[0];
          if (pluginName) {
            enabledPluginNames.add(pluginName);
          }
        }
      }
      return enabledPluginNames;
    },
    []
  );

  // Load Config to component state
  const loadConfigToState = useCallback(
    (config: PresetConfig) => {
      // Load global settings
      setGlobalSettings({
        multipass: config.multipass ?? defaultGlobalSettings.multipass,
        floatPrecision:
          config.floatPrecision ?? defaultGlobalSettings.floatPrecision,
        transformPrecision:
          config.transformPrecision ?? defaultGlobalSettings.transformPrecision,
      });

      // Load plugins
      const enabledPluginNames = extractEnabledPlugins(config.plugins);
      setPlugins(
        allSvgoPlugins.map((p) => ({
          ...p,
          enabled: enabledPluginNames.has(p.name),
        }))
      );
    },
    [extractEnabledPlugins]
  );

  // Load preset data when opening in edit mode or duplicate mode
  useEffect(() => {
    if (!presetEditor.isOpen) {
      return;
    }

    if (presetEditor.mode === "edit" && presetEditor.presetId) {
      const preset = presets.find((p) => p.id === presetEditor.presetId);
      if (preset) {
        setName(preset.name);
        // Load config from preset
        const config = preset.svgoConfig as PresetConfig;
        loadConfigToState(config);
      }
    } else if (presetEditor.sourcePresetId) {
      // Duplicating from existing preset
      const sourcePreset = presets.find(
        (p) => p.id === presetEditor.sourcePresetId
      );
      if (sourcePreset) {
        setName(`${sourcePreset.name} ${t("presets.editor.copySuffix")}`);
        const config = sourcePreset.svgoConfig as PresetConfig;
        loadConfigToState(config);
      }
    } else {
      // Create new with defaults
      setName("");
      setPlugins(allSvgoPlugins);
      setGlobalSettings(defaultGlobalSettings);
    }
    setErrors({});
  }, [
    presetEditor.isOpen,
    presetEditor.mode,
    presetEditor.presetId,
    presetEditor.sourcePresetId,
    presets,
    loadConfigToState,
    t,
  ]);

  // Convert component state to Config
  const stateToConfig = (): any => {
    const enabledPlugins = plugins.filter((p) => p.enabled).map((p) => p.name);

    return {
      multipass: globalSettings.multipass,
      floatPrecision: globalSettings.floatPrecision,
      transformPrecision: globalSettings.transformPrecision,
      plugins: enabledPlugins,
    };
  };

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};

    if (name.trim()) {
      // Check for duplicate name (excluding current preset when editing)
      const isDuplicate = presets.some(
        (p) =>
          p.name === name.trim() &&
          (presetEditor.mode === "create" || p.id !== presetEditor.presetId)
      );
      if (isDuplicate) {
        newErrors.name = t("presets.editor.errors.duplicateName");
      }
    } else {
      newErrors.name = t("presets.editor.errors.emptyName");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const now = Date.now();
    const config = stateToConfig();

    if (presetEditor.mode === "edit" && presetEditor.presetId) {
      const existingPreset = presets.find(
        (p) => p.id === presetEditor.presetId
      );
      if (existingPreset) {
        updatePreset({
          ...existingPreset,
          name: name.trim(),
          svgoConfig: config,
          updatedAt: now,
        });
      }
    } else {
      addPreset({
        id: `preset-${Date.now()}`,
        name: name.trim(),
        description: "",
        isDefault: false,
        svgoConfig: config,
        createdAt: now,
        updatedAt: now,
      });
    }

    closePresetEditor();
  };

  const handleDelete = () => {
    if (presetEditor.presetId) {
      deletePreset(presetEditor.presetId);
      setShowDeleteDialog(false);
      closePresetEditor();
    }
  };

  const handlePluginToggle = (pluginName: string) => {
    setPlugins((prev) =>
      prev.map((p) =>
        p.name === pluginName ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  const currentPreset = presets.find((p) => p.id === presetEditor.presetId);
  const isDefaultPreset = currentPreset?.isDefault;

  return (
    <>
      <Drawer
        direction="left"
        onOpenChange={(open: boolean) => {
          if (!open) {
            closePresetEditor();
          }
        }}
        open={presetEditor.isOpen}
      >
        <DrawerContent className="h-screen w-full! max-w-full!">
          <DrawerHeader className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-1.5">
              <DrawerTitle className="font-semibold text-base">
                {presetEditor.mode === "edit"
                  ? t("presets.editor.title.edit")
                  : t("presets.editor.title.create")}
              </DrawerTitle>
              <DrawerDescription className="sr-only">Preset</DrawerDescription>
              <Input
                className="h-7 max-w-36 rounded-lg px-2 py-1"
                id="preset-name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
                placeholder={t("presets.editor.namePlaceholder")}
                value={name}
              />
              {errors.name && (
                <span className="text-destructive text-xs">{errors.name}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button className="h-7 rounded-lg px-3 py-1" onClick={handleSave}>
                {t("presets.editor.actions.save")}
              </Button>
              {presetEditor.mode === "edit" && !isDefaultPreset && (
                <Button
                  className="h-7 rounded-lg px-3 py-1"
                  onClick={() => {
                    setShowDeleteDialog(true);
                  }}
                  variant="destructive"
                >
                  {t("presets.editor.actions.delete")}
                </Button>
              )}
              <DrawerClose asChild>
                <Button
                  className="size-7 rounded-lg hover:border-accent"
                  size="icon"
                  variant="outline"
                >
                  <span className="i-hugeicons-cancel-01 size-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <ScrollArea className="h-[calc(100dvh-53px)] flex-1">
            <div className="space-y-6 p-4">
              {/* Global Settings */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">
                  {t("presets.editor.globalSettings.title")}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label
                        className="font-medium text-sm"
                        htmlFor="multipass"
                      >
                        {t("presets.editor.globalSettings.multipass.label")}
                      </label>
                      <p className="text-muted-foreground text-xs">
                        {t(
                          "presets.editor.globalSettings.multipass.description"
                        )}
                      </p>
                    </div>
                    <Switch
                      checked={globalSettings.multipass}
                      id="multipass"
                      onCheckedChange={(checked: boolean) => {
                        setGlobalSettings({
                          ...globalSettings,
                          multipass: checked,
                        });
                      }}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-0.5">
                      <label
                        className="font-medium text-sm"
                        htmlFor="float-precision"
                      >
                        {t(
                          "presets.editor.globalSettings.floatPrecision.label"
                        )}
                      </label>
                      <p className="text-muted-foreground text-xs">
                        {t(
                          "presets.editor.globalSettings.floatPrecision.description"
                        )}
                      </p>
                    </div>
                    <Input
                      className="h-7 w-20 rounded-lg px-2 py-1"
                      id="float-precision"
                      max={10}
                      min={0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = Number.parseInt(e.target.value, 10);
                        if (!Number.isNaN(value)) {
                          setGlobalSettings({
                            ...globalSettings,
                            floatPrecision: value,
                          });
                        }
                      }}
                      type="number"
                      value={globalSettings.floatPrecision}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-0.5">
                      <label
                        className="font-medium text-sm"
                        htmlFor="transform-precision"
                      >
                        {t(
                          "presets.editor.globalSettings.transformPrecision.label"
                        )}
                      </label>
                      <p className="text-muted-foreground text-xs">
                        {t(
                          "presets.editor.globalSettings.transformPrecision.description"
                        )}
                      </p>
                    </div>
                    <Input
                      className="h-7 w-20 rounded-lg px-2 py-1"
                      id="transform-precision"
                      max={10}
                      min={0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = Number.parseInt(e.target.value, 10);
                        if (!Number.isNaN(value)) {
                          setGlobalSettings({
                            ...globalSettings,
                            transformPrecision: value,
                          });
                        }
                      }}
                      type="number"
                      value={globalSettings.transformPrecision}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* SVGO Plugins */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">
                  {t("presets.editor.plugins.title")}
                </h3>
                <div className="space-y-2">
                  {plugins.map((plugin) => (
                    <div
                      className="flex items-center justify-between py-1"
                      key={plugin.name}
                    >
                      <label
                        className="cursor-pointer text-sm"
                        htmlFor={plugin.name}
                      >
                        {getPluginLabel(plugin.name, translations)}
                      </label>
                      <Switch
                        checked={plugin.enabled}
                        id={plugin.name}
                        onCheckedChange={() => {
                          handlePluginToggle(plugin.name);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      <DeleteConfirmationDialog
        onConfirm={handleDelete}
        onOpenChange={setShowDeleteDialog}
        open={showDeleteDialog}
        presetName={name}
      />
    </>
  );
}

export default PresetEditorDrawer;
