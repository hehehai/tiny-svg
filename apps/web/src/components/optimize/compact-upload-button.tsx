import { Button } from "@tiny-svg/ui/components/button";
import { useIntlayer } from "react-intlayer";
import { useFilePicker } from "use-file-picker";
import { isSvgFile } from "@/lib/file-utils";

type CompactUploadButtonProps = {
  onUpload: (file: File) => void;
  className?: string;
};

export function CompactUploadButton({
  onUpload,
  className,
}: CompactUploadButtonProps) {
  const { header } = useIntlayer("optimize");

  const { openFilePicker, loading } = useFilePicker({
    accept: ".svg",
    multiple: false,
    onFilesSelected: (data: {
      plainFiles?: File[];
      filesContent?: unknown[];
      errors?: unknown[];
    }) => {
      if (data.plainFiles && data.plainFiles.length > 0) {
        const file = data.plainFiles[0];
        if (file && isSvgFile(file)) {
          onUpload(file);
        }
      }
    },
  });

  return (
    <Button
      className={className}
      disabled={loading}
      onClick={openFilePicker}
      size="sm"
      type="button"
      variant="outline"
    >
      <span className="i-hugeicons-upload-02 mr-1 size-4" />
      {loading ? "Loading..." : header?.reupload || "Reupload"}
    </Button>
  );
}
