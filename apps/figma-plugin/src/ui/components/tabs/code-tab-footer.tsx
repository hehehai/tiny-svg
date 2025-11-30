import { Button } from "@tiny-svg/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tiny-svg/ui/components/select";
import type { CodeFormat } from "@/ui/store";
import { usePluginStore } from "@/ui/store";

export function CodeTabFooter() {
  const { selectedCodeFormat, setCodeFormat, items, isExporting } =
    usePluginStore();

  const handleExportAll = async () => {
    // TODO: Implement export all logic
    // Placeholder to avoid empty block warning
  };

  const hasItems = items.length > 0;

  const formats: Array<{ value: CodeFormat; label: string }> = [
    { value: "react-jsx", label: "React JSX" },
    { value: "react-tsx", label: "React TSX" },
    { value: "vue", label: "Vue" },
    { value: "svelte", label: "Svelte" },
    { value: "react-native", label: "React Native" },
    { value: "flutter", label: "Flutter" },
    { value: "data-uri", label: "Data URI" },
    { value: "base64", label: "Base64" },
  ];

  return (
    <>
      <Select
        onValueChange={(value) => setCodeFormat(value as CodeFormat)}
        value={selectedCodeFormat}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {formats.map((format) => (
            <SelectItem key={format.value} value={format.value}>
              {format.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button disabled={!hasItems || isExporting} onClick={handleExportAll}>
        {isExporting ? "Exporting..." : "Export All"}
      </Button>
    </>
  );
}
