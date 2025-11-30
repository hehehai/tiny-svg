"use client";

import { Button } from "@tiny-svg/ui/components/button";
import { Check, Copy } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const COPY_FEEDBACK_TIMEOUT_MS = 2000;

export const CopyButton = ({
  value,
  className,
  ...props
}: {
  value: string;
  className?: string;
} & React.ComponentProps<"button">) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!value) {
      return;
    }
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, COPY_FEEDBACK_TIMEOUT_MS);
  };

  return (
    <Button
      data-state={copied ? "copied" : "not-copied"}
      size="icon"
      variant="ghost"
      {...props}
      className={cn("relative shrink-0 transition-opacity", className)}
      onClick={handleCopy}
    >
      <span className="sr-only">Copy</span>
      <Check
        aria-label="Copied"
        className={cn(
          "absolute inset-0 m-auto h-4 w-4 transition-all duration-200",
          copied ? "scale-100 opacity-100 blur-0" : "scale-75 opacity-0 blur-sm"
        )}
      />
      <Copy
        aria-label="Copy"
        className={cn(
          "absolute inset-0 m-auto h-4 w-4 transition-all duration-200",
          copied ? "scale-75 opacity-0 blur-sm" : "scale-100 opacity-100 blur-0"
        )}
      />
    </Button>
  );
};
