import { Button } from "@tiny-svg/ui/components/button";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HistoryButtonProps = {
  onClick: () => void;
  count: number;
  label?: ReactNode;
  className?: string;
};

export function HistoryButton({
  onClick,
  count,
  label = "History",
  className,
}: HistoryButtonProps) {
  if (count === 0) {
    return null;
  }

  return (
    <Button
      className={cn("relative", className)}
      onClick={onClick}
      size="sm"
      type="button"
      variant="outline"
    >
      <span className="i-hugeicons-time-04 mr-1 size-4" />
      {label}
      {count > 0 && (
        <span className="ml-1.5 flex size-5 items-center justify-center rounded-full bg-primary font-semibold text-[10px] text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Button>
  );
}
