import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatBytes, svgToDataUri } from "@/lib/data-uri-utils";
import { copyToClipboard } from "@/lib/file-utils";

interface DataUriTabContentProps {
  compressedSvg: string;
}

export function DataUriTabContent({ compressedSvg }: DataUriTabContentProps) {
  const [hasConverted, setHasConverted] = useState(false);

  // Lazy conversion - only convert when user has viewed the tab
  const dataUriResult = useMemo(() => {
    if (!(hasConverted && compressedSvg)) {
      return null;
    }
    return svgToDataUri(compressedSvg);
  }, [compressedSvg, hasConverted]);

  // Trigger conversion on first render
  if (!hasConverted && compressedSvg) {
    setHasConverted(true);
  }

  const handleCopy = async (content: string, label: string) => {
    try {
      await copyToClipboard(content);
      toast.success(`${label} copied to clipboard!`);
    } catch {
      toast.error(`Failed to copy ${label}`);
    }
  };

  if (!compressedSvg) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No optimized SVG available. Please optimize your SVG first.
      </div>
    );
  }

  if (!dataUriResult) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Converting to Data URI formats...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      {/* Minified Data URI Card */}
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle>Minified Data URI</CardTitle>
          <CardDescription>
            Optimized for CSS background-image (
            {formatBytes(dataUriResult.minifiedSize)})
          </CardDescription>
          <CardAction>
            <Button
              onClick={() =>
                handleCopy(dataUriResult.minified, "Minified Data URI")
              }
              size="sm"
              type="button"
              variant="outline"
            >
              <span className="i-hugeicons-copy-01" />
              Copy
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="max-h-32 overflow-auto rounded-md bg-muted p-3">
            <code className="break-all font-mono text-xs">
              {dataUriResult.minified}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Base64 Data URI Card */}
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle>Base64 Data URI</CardTitle>
          <CardDescription>
            Base64 encoded format ({formatBytes(dataUriResult.base64Size)})
          </CardDescription>
          <CardAction>
            <Button
              onClick={() =>
                handleCopy(dataUriResult.base64, "Base64 Data URI")
              }
              size="sm"
              type="button"
              variant="outline"
            >
              <span className="i-hugeicons-copy-01" />
              Copy
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="max-h-32 overflow-auto rounded-md bg-muted p-3">
            <code className="break-all font-mono text-xs">
              {dataUriResult.base64}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* URL Encoded Data URI Card */}
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle>URL Encoded Data URI</CardTitle>
          <CardDescription>
            Full URL encoded format ({formatBytes(dataUriResult.urlEncodedSize)}
            )
          </CardDescription>
          <CardAction>
            <Button
              onClick={() =>
                handleCopy(dataUriResult.urlEncoded, "URL Encoded Data URI")
              }
              size="sm"
              type="button"
              variant="outline"
            >
              <span className="i-hugeicons-copy-01" />
              Copy
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="max-h-32 overflow-auto rounded-md bg-muted p-3">
            <code className="break-all font-mono text-xs">
              {dataUriResult.urlEncoded}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
