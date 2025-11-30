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
  } = usePluginStore();

  const handleExportAll = async () => {
    if (items.length === 0) {
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
        onValueChange={(value) => setSvgExportFormat(value as "zip" | "sprite")}
        value={selectedSvgExportFormat}
      >
        <SelectTrigger className="w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="zip">Zip</SelectItem>
          <SelectItem value="sprite">Sprite Sheet</SelectItem>
        </SelectContent>
      </Select>

      <Button disabled={!hasItems || isExporting} onClick={handleExportAll}>
        {isExporting ? "Exporting..." : "Export All"}
      </Button>
    </>
  );
}
