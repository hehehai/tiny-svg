import { Button } from "@tiny-svg/ui/components/button";
import { Checkbox } from "@tiny-svg/ui/components/checkbox";
import type { ImageFormat } from "@/ui/store";
import { usePluginStore } from "@/ui/store";

export function ImageTabFooter() {
  const { selectedImageFormats, toggleImageFormat, items, isExporting } =
    usePluginStore();

  const handleExportAll = async () => {
    // TODO: Implement export all logic
    // Placeholder to avoid empty block warning
  };

  const hasItems = items.length > 0;
  const hasFormats = selectedImageFormats.length > 0;

  const formats: ImageFormat[] = ["png", "jpeg", "webp", "ico"];

  return (
    <>
      <div className="flex gap-2">
        {formats.map((format) => (
          <label
            className="flex cursor-pointer items-center gap-1 font-medium text-xs"
            htmlFor={format}
            key={format}
          >
            <Checkbox
              checked={selectedImageFormats.includes(format)}
              id={format}
              onCheckedChange={() => toggleImageFormat(format)}
            />
            <span>{format.toUpperCase()}</span>
          </label>
        ))}
      </div>

      <Button
        disabled={!(hasItems && hasFormats) || isExporting}
        onClick={handleExportAll}
      >
        {isExporting ? "Exporting..." : "Export All"}
      </Button>
    </>
  );
}
