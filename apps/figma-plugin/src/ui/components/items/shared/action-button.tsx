import { Button } from "@tiny-svg/ui/components/button";
import { ButtonGroup } from "@tiny-svg/ui/components/button-group";
import { memo } from "react";

interface ActionButtonProps {
  label: string;
  onDownload: () => void;
  onCopy: () => void;
  isLoading?: boolean;
  className?: string;
  buttonClassName?: string;
}

/**
 * Reusable action button with hover interaction
 * Shows label by default, reveals download/copy buttons on hover
 */
export const ActionButton = memo(function ActionButtonComponent({
  label,
  onDownload,
  onCopy,
  isLoading = false,
  className = "w-full",
  buttonClassName = "h-7",
}: ActionButtonProps) {
  return (
    <div className={`group relative ${className}`}>
      <Button
        className={`${buttonClassName} w-full font-medium text-xs group-hover:text-transparent`}
        size="sm"
        type="button"
        variant="outline"
      >
        {label}
      </Button>
      <ButtonGroup
        className={`absolute inset-0 hidden ${buttonClassName} w-full group-hover:flex`}
      >
        <Button
          aria-label={`Download ${label}`}
          className={`${buttonClassName} grow p-0`}
          disabled={isLoading}
          onClick={onDownload}
          title={`Download ${label}`}
          type="button"
          variant="outline"
        >
          <span className="i-hugeicons-download-01 size-4" />
        </Button>
        <Button
          aria-label={`Copy ${label}`}
          className={`${buttonClassName} grow p-0`}
          disabled={isLoading}
          onClick={onCopy}
          title={`Copy ${label}`}
          type="button"
          variant="outline"
        >
          <span className="i-hugeicons-copy-01 size-4" />
        </Button>
      </ButtonGroup>
    </div>
  );
});
