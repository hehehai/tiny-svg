import { Button } from "@tiny-svg/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@tiny-svg/ui/components/dialog";
import { Input } from "@tiny-svg/ui/components/input";
import { Label } from "@tiny-svg/ui/components/label";
import { ScrollArea } from "@tiny-svg/ui/components/scroll-area";
import { Separator } from "@tiny-svg/ui/components/separator";
import { Switch } from "@tiny-svg/ui/components/switch";
import { Textarea } from "@tiny-svg/ui/components/textarea";
import { useEffect, useState } from "react";
import { useIntlayer } from "react-intlayer";
import {
  defaultPresetGlobalSettings,
  validatePreset,
} from "@/lib/preset-utils";
import { allSvgoPlugins, type SvgoPluginConfig } from "@/lib/svgo-plugins";
import { usePresetsStore } from "@/store/presets-store";
import type { PresetGlobalSettings } from "@/types/preset";

export function PresetEditorDialog() {
  const { presets: t } = useIntlayer("presets");
  const pluginLabels = useIntlayer("plugins");

  const {
    isEditorOpen,
    editorMode,
    editingPresetId,
    sourcePresetId,
    presets,
    closeEditor,
    addPreset,
    updatePreset,
    getPresetById,
  } = usePresetsStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [plugins, setPlugins] = useState<SvgoPluginConfig[]>(allSvgoPlugins);
  const [globalSettings, setGlobalSettings] = useState<PresetGlobalSettings>(
    defaultPresetGlobalSettings
  );
  const [errors, setErrors] = useState<string[]>([]);

  // Load preset data when dialog opens
  useEffect(() => {
    if (!isEditorOpen) {
      return;
    }

    if (editorMode === "edit" && editingPresetId) {
      const preset = getPresetById(editingPresetId);
      if (preset) {
        setName(preset.name);
        setDescription(preset.description);
        setPlugins(preset.plugins);
        setGlobalSettings(preset.globalSettings);
      }
    } else if (sourcePresetId) {
      // Duplicating
      const source = getPresetById(sourcePresetId);
      if (source) {
        setName(`${source.name} (Copy)`);
        setDescription(source.description);
        setPlugins(source.plugins);
        setGlobalSettings(source.globalSettings);
      }
    } else {
      // New preset with defaults
      setName("");
      setDescription("");
      setPlugins(allSvgoPlugins);
      setGlobalSettings(defaultPresetGlobalSettings);
    }
    setErrors([]);
  }, [
    isEditorOpen,
    editorMode,
    editingPresetId,
    sourcePresetId,
    getPresetById,
  ]);

  const handlePluginToggle = (pluginName: string) => {
    setPlugins((prev) =>
      prev.map((p) =>
        p.name === pluginName ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  const handleResetPlugins = () => {
    setPlugins(allSvgoPlugins);
  };

  const handleSave = () => {
    const validation = validatePreset(
      { id: editingPresetId || undefined, name },
      presets
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (editorMode === "edit" && editingPresetId) {
      updatePreset(editingPresetId, {
        name,
        description,
        plugins,
        globalSettings,
      });
    } else {
      addPreset({
        name,
        description,
        plugins,
        globalSettings,
      });
    }

    closeEditor();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeEditor();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isEditorOpen}>
      <DialogContent className="max-h-[80vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editorMode === "edit" ? t.editor.titleEdit : t.editor.titleCreate}
          </DialogTitle>
          <DialogDescription>{t.editor.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preset-name">{t.editor.name}</Label>
                <Input
                  id="preset-name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder={String(t.editor.namePlaceholder)}
                  value={name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preset-description">
                  {t.editor.descriptionLabel}
                </Label>
                <Textarea
                  id="preset-description"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={String(t.editor.descriptionPlaceholder)}
                  rows={2}
                  value={description}
                />
              </div>
            </div>

            {errors.length > 0 && (
              <div className="text-destructive text-sm">
                {errors.map((err) => (
                  <p key={err}>{err}</p>
                ))}
              </div>
            )}

            <Separator />

            {/* Global Settings */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">{t.editor.globalSettings}</h4>

              <div className="flex items-center justify-between">
                <Label htmlFor="multipass">{t.editor.multipass}</Label>
                <Switch
                  checked={globalSettings.multipass}
                  id="multipass"
                  onCheckedChange={(checked) =>
                    setGlobalSettings({ ...globalSettings, multipass: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="float-precision">
                  {t.editor.floatPrecision}
                </Label>
                <Input
                  className="h-8 w-20"
                  id="float-precision"
                  max={10}
                  min={0}
                  onChange={(e) =>
                    setGlobalSettings({
                      ...globalSettings,
                      floatPrecision: Number.parseInt(e.target.value, 10),
                    })
                  }
                  type="number"
                  value={globalSettings.floatPrecision}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="transform-precision">
                  {t.editor.transformPrecision}
                </Label>
                <Input
                  className="h-8 w-20"
                  id="transform-precision"
                  max={10}
                  min={0}
                  onChange={(e) =>
                    setGlobalSettings({
                      ...globalSettings,
                      transformPrecision: Number.parseInt(e.target.value, 10),
                    })
                  }
                  type="number"
                  value={globalSettings.transformPrecision}
                />
              </div>
            </div>

            <Separator />

            {/* Plugins */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{t.editor.plugins}</h4>
                <Button
                  onClick={handleResetPlugins}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  {t.editor.resetPlugins}
                </Button>
              </div>

              <div className="space-y-2">
                {plugins.map((plugin) => (
                  <div
                    className="flex items-center justify-between py-1"
                    key={plugin.name}
                  >
                    <Label
                      className="cursor-pointer text-sm"
                      htmlFor={plugin.name}
                    >
                      {(pluginLabels as Record<string, string>)[plugin.name] ||
                        plugin.name}
                    </Label>
                    <Switch
                      checked={plugin.enabled}
                      id={plugin.name}
                      onCheckedChange={() => handlePluginToggle(plugin.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={closeEditor} type="button" variant="outline">
            {t.editor.cancel}
          </Button>
          <Button onClick={handleSave} type="button">
            {t.editor.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
