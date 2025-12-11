import { Button } from "@tiny-svg/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tiny-svg/ui/components/select";
import { toast } from "sonner";
import { exportAsSpriteSheet, exportAsZip } from "@/ui/lib/svg-export";
import { usePluginStore } from "@/ui/store";

export function SvgTabFooter() {
  const {
    selectedSvgExportFormat,
    setSvgExportFormat,
    items,
    isExporting,
    setExporting,
    openIconFontsDrawer,
  } = usePluginStore();

  const handleExportAll = async () => {
    if (items.length === 0) {
      return;
    }

    // Open icon fonts drawer for iconfonts format
    if (selectedSvgExportFormat === "iconfonts") {
      openIconFontsDrawer();
      return;
    }

    try {
      setExporting(true);

      if (selectedSvgExportFormat === "zip") {
        await exportAsZip(items);
        toast.success("SVG ZIP exported successfully");
      } else {
        await exportAsSpriteSheet(items);
        toast.success("Sprite sheet exported successfully");
      }
    } catch (error) {
      console.error("Failed to export:", error);
      toast.error("Failed to export");
    } finally {
      setExporting(false);
    }
  };

  const hasItems = items.length > 0;

  return (
    <>
      <Select
        onValueChange={(value) =>
          setSvgExportFormat(value as "zip" | "sprite" | "iconfonts")
        }
        value={selectedSvgExportFormat}
      >
        <SelectTrigger className="w-28 rounded-lg px-2 py-1" size="xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-lg">
          <SelectItem className="rounded-md py-1 pr-4 pl-1 text-xs" value="zip">
            Zip
          </SelectItem>
          <SelectItem
            className="rounded-md py-1 pr-4 pl-1 text-xs"
            value="sprite"
          >
            Sprite Sheet
          </SelectItem>
          <SelectItem
            className="rounded-md py-1 pr-4 pl-1 text-xs"
            value="iconfonts"
          >
            Icon Fonts
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        className="h-7 rounded-lg px-3 py-1"
        disabled={!hasItems || isExporting}
        onClick={handleExportAll}
      >
        {isExporting ? "Exporting..." : "Export All"}
      </Button>
    </>
  );
}
