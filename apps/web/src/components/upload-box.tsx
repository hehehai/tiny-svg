import type { ReactNode } from "react";
import { useCallback } from "react";
import { useIntlayer } from "react-intlayer";
import { toast } from "sonner";
import { useFilePicker } from "use-file-picker";
import { isSvgContent, isSvgFile, readFileAsText } from "@/lib/file-utils";
import { cn } from "@/lib/utils";

type UploadBoxProps = {
  onUpload: (file: File) => void;
  isHighlighted?: boolean;
  className?: string;
};

type SafeMessages = {
  invalidSvgFile: ReactNode;
  fileReadError: ReactNode;
  invalidSvgStructure: ReactNode;
  uploadSuccess: ReactNode;
};

async function validateAndProcessFile(
  file: File,
  onUpload: (f: File) => void,
  safeMessages: SafeMessages
): Promise<void> {
  if (!isSvgFile(file)) {
    toast.error(safeMessages.invalidSvgFile);
    return;
  }

  try {
    const content = await readFileAsText(file);
    if (!isSvgContent(content)) {
      toast.error(safeMessages.invalidSvgStructure);
      return;
    }
    onUpload(file);
  } catch {
    toast.error(safeMessages.fileReadError);
  }
}

export function UploadBox({
  onUpload,
  isHighlighted = false,
  className,
}: UploadBoxProps) {
  const { upload, messages } = useIntlayer("home");

  // 提供默认值，防止服务器端渲染错误
  const safeUpload = upload || {
    dragActive: "Drop your SVG file here",
    dragInactive: "Drag & drop your SVG file here",
    clickToBrowse: "or click to browse files",
    pasteHint:
      "You can also paste SVG code or base64 directly (Ctrl+V / Cmd+V)",
    acceptsOnly: "Accepts .svg and .svg+xml files",
  };

  const safeMessages: SafeMessages = messages || {
    invalidSvgFile: "Invalid file. Please select a valid SVG file (.svg or .svg+xml).",
    fileReadError: "Failed to read file. Please try again.",
    invalidSvgStructure: "The file does not contain valid SVG content.",
    uploadSuccess: "SVG uploaded successfully!",
  };

  const handleFilesSelected = useCallback(
    async (data: {
      plainFiles?: File[];
      filesContent?: unknown[];
      errors?: unknown[];
    }) => {
      if (data.errors && data.errors.length > 0) {
        toast.error(safeMessages.invalidSvgFile);
        return;
      }

      const file = data.plainFiles?.[0];
      if (file) {
        await validateAndProcessFile(file, onUpload, safeMessages);
      }
    },
    [onUpload, safeMessages]
  );

  const { openFilePicker, loading } = useFilePicker({
    accept: ".svg,.svg+xml,image/svg+xml",
    multiple: false,
    onFilesSelected: handleFilesSelected,
  });

  return (
    <button
      className={cn(
        "w-full cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-all",
        isHighlighted
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-accent/50",
        className
      )}
      onClick={openFilePicker}
      type="button"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "flex items-center justify-center rounded-full p-4 transition-colors",
            isHighlighted ? "bg-primary/10" : "bg-accent"
          )}
        >
          <span className="i-hugeicons-upload-02 size-12 text-primary" />
        </div>
        <div className="space-y-2">
          <p className="font-medium text-lg">
            {loading ? "Loading..." : safeUpload.dragInactive}
          </p>
          <p className="text-muted-foreground text-sm">
            {safeUpload.clickToBrowse}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
            <span className="i-hugeicons-file-02 size-4" />
            <span>{safeUpload.acceptsOnly}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
            <span className="i-hugeicons-paste size-4" />
            <span>{safeUpload.pasteHint}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
