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
  const items = usePluginStore((state) => state.items);
  const iconFontsDrawer = usePluginStore((state) => state.iconFontsDrawer);
  const setIconFontsGenerating = usePluginStore(
    (state) => state.setIconFontsGenerating
  );
  const setIconFontsGenerated = usePluginStore(
    (state) => state.setIconFontsGenerated
  );
  const setIconFormErrors = usePluginStore((state) => state.setIconFormErrors);

  const selectedCount = iconFontsDrawer.selectedIconIds.length;
  const hasSelection = selectedCount > 0;

  const validateConfig = () => {
    const newErrors: {
      fontName?: string;
      fileName?: string;
      cssPrefix?: string;
    } = {};

    if (!iconFontsDrawer.fontName.trim()) {
      newErrors.fontName = "Font name is required";
    }

    if (!iconFontsDrawer.fileName.trim()) {
      newErrors.fileName = "File name is required";
    } else if (!FILE_NAME_REGEX.test(iconFontsDrawer.fileName)) {
      newErrors.fileName = "Only letters, numbers, hyphens and underscores";
    }

    if (!iconFontsDrawer.cssPrefix.trim()) {
      newErrors.cssPrefix = "CSS prefix is required";
    } else if (!CSS_PREFIX_REGEX.test(iconFontsDrawer.cssPrefix)) {
      newErrors.cssPrefix = "Must start with letter";
    }

    return newErrors;
  };

  const handleGenerate = async () => {
    // Validate form
    const newErrors = validateConfig();

    if (Object.keys(newErrors).length > 0) {
      setIconFormErrors(newErrors);
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
        fontName: iconFontsDrawer.fontName.trim(),
        fileName: iconFontsDrawer.fileName.trim(),
        cssPrefix: iconFontsDrawer.cssPrefix.trim(),
      };

      const blob = await exportAsIconFonts(
        items,
        iconFontsDrawer.selectedIconIds,
        iconFontsDrawer.iconNames,
        fontConfig
      );

      setIconFontsGenerated(blob);
      toast.success(
        "Icon fonts generated! Package includes TTF, WOFF, EOT, SVG, CSS, and demo HTML"
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

    downloadBlob(
      iconFontsDrawer.generatedBlob,
      `${iconFontsDrawer.fileName}-iconfonts-${Date.now()}.zip`
    );
    toast.success("Icon fonts downloaded successfully");
  };

  const getGenerateButtonText = () => {
    if (iconFontsDrawer.isGenerating) {
      return "Generating...";
    }
    if (iconFontsDrawer.hasGenerated) {
      return "Regenerate Fonts";
    }
    return "Generate Fonts";
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
