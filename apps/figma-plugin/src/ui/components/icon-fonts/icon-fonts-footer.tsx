import { Button } from "@tiny-svg/ui/components/button";
import { downloadBlob } from "@tiny-svg/utils";
import { memo } from "react";
import { toast } from "sonner";
import type { IconFontsConfig } from "@/ui/lib/svg-export";
import { exportAsIconFonts } from "@/ui/lib/svg-export";
import { usePluginStore } from "@/ui/store";

const FILE_NAME_REGEX = /^[a-z0-9-_]+$/i;
const CSS_PREFIX_REGEX = /^[a-z][a-z0-9-_]*$/i;

export const IconFontsFooter = memo(function IconFontsFooterComponent() {
  const {
    items,
    iconFontsDrawer,
    setIconFontsGenerating,
    setIconFontsGenerated,
  } = usePluginStore();

  const selectedCount = iconFontsDrawer.selectedIconIds.length;
  const hasSelection = selectedCount > 0;

  const validateConfig = (config: any) => {
    const newErrors: any = {};

    if (!config.fontName.trim()) {
      newErrors.fontName = "Font name is required";
    }

    if (!config.fileName.trim()) {
      newErrors.fileName = "File name is required";
    } else if (!FILE_NAME_REGEX.test(config.fileName)) {
      newErrors.fileName = "Only letters, numbers, hyphens and underscores";
    }

    if (!config.cssPrefix.trim()) {
      newErrors.cssPrefix = "CSS prefix is required";
    } else if (!CSS_PREFIX_REGEX.test(config.cssPrefix)) {
      newErrors.cssPrefix = "Must start with letter";
    }

    return newErrors;
  };

  const handleGenerate = async () => {
    // Get form values from window (set by IconFontsContent)
    const config = (window as any).__iconFontsConfig;

    // Validate
    const newErrors = validateConfig(config);

    if (Object.keys(newErrors).length > 0) {
      config.setErrors(newErrors);
      toast.error("Please fix validation errors");
      return;
    }

    if (!hasSelection) {
      toast.error("Please select at least one icon");
      return;
    }

    setIconFontsGenerating(true);

    try {
      const fontConfig: IconFontsConfig = {
        fontName: config.fontName.trim(),
        fileName: config.fileName.trim(),
        cssPrefix: config.cssPrefix.trim(),
      };

      const blob = await exportAsIconFonts(
        items,
        iconFontsDrawer.selectedIconIds,
        iconFontsDrawer.iconNames,
        fontConfig
      );

      setIconFontsGenerated(blob);
      toast.success(
        "Icon fonts package ready! Check the README for conversion instructions"
      );
    } catch (error) {
      console.error("Failed to generate icon fonts package:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate icon fonts package"
      );
      setIconFontsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!iconFontsDrawer.generatedBlob) {
      return;
    }

    const config = (window as any).__iconFontsConfig;
    downloadBlob(
      iconFontsDrawer.generatedBlob,
      `${config.fileName}-iconfonts-${Date.now()}.zip`
    );
    toast.success("Icon fonts package downloaded successfully");
  };

  const getGenerateButtonText = () => {
    if (iconFontsDrawer.isGenerating) {
      return "Preparing...";
    }
    if (iconFontsDrawer.hasGenerated) {
      return "Regenerate Package";
    }
    return "Generate Package";
  };

  return (
    <div className="flex items-center justify-end gap-2 border-t px-3 py-2">
      {iconFontsDrawer.hasGenerated && iconFontsDrawer.generatedBlob && (
        <Button
          className="h-7 gap-1.5 rounded-lg px-3 py-1"
          onClick={handleDownload}
          type="button"
          variant="outline"
        >
          <span className="i-hugeicons-download-01 size-4" />
          Download
        </Button>
      )}
      <Button
        className="h-7 rounded-lg px-3 py-1"
        disabled={!hasSelection || iconFontsDrawer.isGenerating}
        onClick={handleGenerate}
        type="button"
      >
        {getGenerateButtonText()}
      </Button>
    </div>
  );
});
