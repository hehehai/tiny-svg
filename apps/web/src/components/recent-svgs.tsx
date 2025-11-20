import { useRouter } from "@tanstack/react-router";
import { useCallback } from "react";
import { getCardRotation, getStaggerDelay } from "@/lib/animation-utils";
import { HISTORY_CONSTANTS } from "@/lib/constants/history";
import { cn } from "@/lib/utils";
import { useSvgStore } from "@/store/svg-store";
import type { HistoryEntry } from "@/types/history";
import { SvgThumbnail } from "./svg-thumbnail";

type RecentSvgsProps = {
  entries: HistoryEntry[];
  className?: string;
};

export function RecentSvgs({ entries, className }: RecentSvgsProps) {
  const router = useRouter();
  const { setHistoryEntry } = useSvgStore();

  const handleSelectEntry = useCallback(
    (entry: HistoryEntry) => {
      setHistoryEntry({
        compressedSvg: entry.compressedSvg,
        fileName: entry.fileName,
        originalSvg: entry.originalSvg,
      });
      router.navigate({ to: "/{-$locale}/optimize" });
    },
    [router, setHistoryEntry]
  );

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative flex gap-2", className)}>
      {entries.map((entry, index) => (
        <button
          className={cn(
            "group relative size-16 cursor-pointer overflow-hidden rounded-lg border-2 border-border bg-background shadow-sm transition-all duration-300",
            "hover:z-10 hover:scale-110 hover:border-primary hover:shadow-lg",
            "fade-in slide-in-from-top-2 animate-in"
          )}
          key={entry.id}
          onClick={() => handleSelectEntry(entry)}
          style={{
            transform: `rotate(${getCardRotation(index)}deg)`,
            animationDelay: getStaggerDelay(
              index,
              HISTORY_CONSTANTS.ANIMATION_RECENT_MS
            ),
          }}
          title={entry.fileName}
          type="button"
        >
          <SvgThumbnail
            className="p-2"
            svg={entry.compressedSvg}
            variant="contain"
          />
          <div className="absolute inset-0 bg-primary/0 transition-colors group-hover:bg-primary/5" />
        </button>
      ))}
    </div>
  );
}
