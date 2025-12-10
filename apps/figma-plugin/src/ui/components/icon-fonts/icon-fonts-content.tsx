import { Input } from "@tiny-svg/ui/components/input";
import { Label } from "@tiny-svg/ui/components/label";
import { ScrollArea } from "@tiny-svg/ui/components/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@tiny-svg/ui/components/tooltip";
import { cn } from "@tiny-svg/ui/lib/utils";
import { memo, useState } from "react";
import { usePluginStore } from "@/ui/store";
import { IconFontsItem } from "./icon-fonts-item";

const FILE_NAME_REGEX = /^[a-z0-9-_]+$/i;
const CSS_PREFIX_REGEX = /^[a-z][a-z0-9-_]*$/i;

export const IconFontsContent = memo(function IconFontsContentComponent() {
  const items = usePluginStore((state) => state.items);
  const fontName = usePluginStore((state) => state.iconFontsDrawer.fontName);
  const fileName = usePluginStore((state) => state.iconFontsDrawer.fileName);
  const cssPrefix = usePluginStore((state) => state.iconFontsDrawer.cssPrefix);
  const formErrors = usePluginStore(
    (state) => state.iconFontsDrawer.formErrors
  );
  const setIconFontName = usePluginStore((state) => state.setIconFontName);
  const setIconFileName = usePluginStore((state) => state.setIconFileName);
  const setIconCssPrefix = usePluginStore((state) => state.setIconCssPrefix);
  const setIconFormErrors = usePluginStore((state) => state.setIconFormErrors);

  const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);

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
    setIconFileName(value);
    const error = validateFileName(value);
    if (error !== formErrors.fileName) {
      setIconFormErrors({ ...formErrors, fileName: error });
    }
  };

  const handleCssPrefixChange = (value: string) => {
    setIconCssPrefix(value);
    const error = validateCssPrefix(value);
    if (error !== formErrors.cssPrefix) {
      setIconFormErrors({ ...formErrors, cssPrefix: error });
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ScrollArea
        className={cn(
          "flex-3",
          isConfigCollapsed ? "h-[calc(100vh-130px)]" : "h-[calc(100vh-400px)]"
        )}
      >
        <div className="grid grid-cols-2 gap-2 p-3">
          {items.map((item) => (
            <IconFontsItem item={item} key={item.id} />
          ))}
        </div>
      </ScrollArea>

      <div
        className={cn("space-y-3 border-t p-3", !isConfigCollapsed && "flex-2")}
      >
        <header className="flex items-center gap-1.5">
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
          <div className="flex-1" />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="inline-flex text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsConfigCollapsed(!isConfigCollapsed)}
                type="button"
              >
                <span
                  className={
                    isConfigCollapsed
                      ? "i-hugeicons-arrow-expand-01"
                      : "i-hugeicons-arrow-shrink-01"
                  }
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isConfigCollapsed ? "Expand" : "Collapse"} configuration</p>
            </TooltipContent>
          </Tooltip>
        </header>

        {!isConfigCollapsed && (
          <>
            <div className="space-y-2">
              <Label htmlFor="font-name">Font Name</Label>
              <Input
                className="h-7 rounded-lg px-2 py-1"
                id="font-name"
                onChange={(e) => setIconFontName(e.target.value)}
                placeholder="e.g., My Awesome Font"
                value={fontName}
              />
              {formErrors.fontName && (
                <p className="text-destructive text-xs">
                  {formErrors.fontName}
                </p>
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
              {formErrors.fileName && (
                <p className="text-destructive text-xs">
                  {formErrors.fileName}
                </p>
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
              {formErrors.cssPrefix && (
                <p className="text-destructive text-xs">
                  {formErrors.cssPrefix}
                </p>
              )}
              <p className="text-muted-foreground text-xs">
                CSS class prefix (e.g., "icon" → ".icon-home")
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
