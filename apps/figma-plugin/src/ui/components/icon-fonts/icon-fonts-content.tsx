import { Input } from "@tiny-svg/ui/components/input";
import { Label } from "@tiny-svg/ui/components/label";
import { ScrollArea } from "@tiny-svg/ui/components/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tiny-svg/ui/components/tooltip";
import { memo, useState } from "react";
import { usePluginStore } from "@/ui/store";
import { IconFontsItem } from "./icon-fonts-item";

const FILE_NAME_REGEX = /^[a-z0-9-_]+$/i;
const CSS_PREFIX_REGEX = /^[a-z][a-z0-9-_]*$/i;

export const IconFontsContent = memo(function IconFontsContentComponent() {
  const { items } = usePluginStore();

  // Form state
  const [fontName, setFontName] = useState("My Icon Font");
  const [fileName, setFileName] = useState("my-icon-font");
  const [cssPrefix, setCssPrefix] = useState("icon");
  const [errors, setErrors] = useState<{
    fontName?: string;
    fileName?: string;
    cssPrefix?: string;
  }>({});

  // Store form values in window for footer to access
  // This is a simple way to share state without prop drilling
  if (typeof window !== "undefined") {
    (window as any).__iconFontsConfig = {
      fontName,
      fileName,
      cssPrefix,
      errors,
      setErrors,
    };
  }

  const validateFileName = (value: string) => {
    if (!value.trim()) {
      return "File name is required";
    }
    if (!FILE_NAME_REGEX.test(value)) {
      return "Only letters, numbers, hyphens and underscores";
    }
    return;
  };

  const validateCssPrefix = (value: string) => {
    if (!value.trim()) {
      return "CSS prefix is required";
    }
    if (!CSS_PREFIX_REGEX.test(value)) {
      return "Must start with letter";
    }
    return;
  };

  const handleFileNameChange = (value: string) => {
    setFileName(value);
    const error = validateFileName(value);
    setErrors((prev) => ({ ...prev, fileName: error }));
  };

  const handleCssPrefixChange = (value: string) => {
    setCssPrefix(value);
    const error = validateCssPrefix(value);
    setErrors((prev) => ({ ...prev, cssPrefix: error }));
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ScrollArea className="flex-3">
        <div className="grid grid-cols-2 gap-2 p-3">
          {items.map((item) => (
            <IconFontsItem item={item} key={item.id} />
          ))}
        </div>
      </ScrollArea>

      <div className="flex-2 space-y-3 border-t p-3">
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-sm">Font Configuration</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="inline-flex text-muted-foreground transition-colors hover:text-foreground"
                type="button"
              >
                <span className="i-hugeicons-information-circle" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Export optimized SVG files ready for icon font conversion tools
                like IcoMoon
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-name">Font Name</Label>
          <Input
            className="h-7 rounded-lg px-2 py-1"
            id="font-name"
            onChange={(e) => setFontName(e.target.value)}
            placeholder="e.g., My Awesome Font"
            value={fontName}
          />
          {errors.fontName && (
            <p className="text-destructive text-xs">{errors.fontName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="file-name">File Name</Label>
          <Input
            className="h-7 rounded-lg px-2 py-1"
            id="file-name"
            onChange={(e) => handleFileNameChange(e.target.value)}
            placeholder="e.g., awesome-font"
            value={fileName}
          />
          {errors.fileName && (
            <p className="text-destructive text-xs">{errors.fileName}</p>
          )}
          <p className="text-muted-foreground text-xs">
            Used for generated file names (no spaces)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="css-prefix">CSS Prefix</Label>
          <Input
            className="h-7 rounded-lg px-2 py-1"
            id="css-prefix"
            onChange={(e) => handleCssPrefixChange(e.target.value)}
            placeholder="e.g., icon"
            value={cssPrefix}
          />
          {errors.cssPrefix && (
            <p className="text-destructive text-xs">{errors.cssPrefix}</p>
          )}
          <p className="text-muted-foreground text-xs">
            CSS class prefix (e.g., "icon" → ".icon-home")
          </p>
        </div>
      </div>
    </div>
  );
});
