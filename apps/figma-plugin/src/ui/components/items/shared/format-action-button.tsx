import { Button } from "@tiny-svg/ui/components/button";
import { ButtonGroup } from "@tiny-svg/ui/components/button-group";

interface FormatActionButtonProps {
  label: string;
  onDownload: () => void;
  onCopy: () => void;
  isLoading?: boolean;
  downloadLabel?: string;
  copyLabel?: string;
}

/**
 * Shared action button component with hover interaction
 * Shows label by default, reveals download/copy buttons on hover
 */
export function FormatActionButton({
  label,
  onDownload,
  onCopy,
  isLoading = false,
  downloadLabel,
  copyLabel,
}: FormatActionButtonProps) {
  return (
    <div className="group relative w-full">
      <Button
        className="w-full font-medium text-xs"
        size="sm"
        type="button"
        variant="outline"
      >
        {label}
      </Button>
      <ButtonGroup className="absolute inset-0 hidden group-hover:flex">
        <Button
          aria-label={downloadLabel || `Download ${label}`}
          className="size-full flex-1"
          disabled={isLoading}
          onClick={onDownload}
          title={downloadLabel || `Download ${label}`}
          type="button"
          variant="outline"
        >
          <span className="i-hugeicons-download-01 size-4" />
        </Button>
        <Button
          aria-label={copyLabel || `Copy ${label}`}
          className="size-full flex-1"
          disabled={isLoading}
          onClick={onCopy}
          title={copyLabel || `Copy ${label}`}
          type="button"
          variant="outline"
        >
          <span className="i-hugeicons-copy-01 size-4" />
        </Button>
      </ButtonGroup>
    </div>
  );
}
