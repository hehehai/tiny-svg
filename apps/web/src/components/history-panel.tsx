import { Badge } from "@tiny-svg/ui/components/badge";
import { Button } from "@tiny-svg/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@tiny-svg/ui/components/sheet";
import { useIntlayer } from "react-intlayer";
import { getStaggerDelay } from "@/lib/animation-utils";
import { formatFileSize, formatTimestamp } from "@/lib/svg-utils";
import { cn } from "@/lib/utils";
import type { HistoryEntry } from "@/types/history";
import { SvgThumbnail } from "./svg-thumbnail";

type HistoryPanelProps = {
  entries: HistoryEntry[];
  isOpen: boolean;
  onClose: () => void;
  onSelectEntry: (entry: HistoryEntry) => void;
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
};

export function HistoryPanel({
  entries,
  isOpen,
  onClose,
  onSelectEntry,
  onDeleteEntry,
  onClearAll,
}: HistoryPanelProps) {
  const { history } = useIntlayer("optimize");
  return (
    <Sheet onOpenChange={onClose} open={isOpen}>
      <SheetContent className="w-full sm:max-w-xl" hideDefaultClose side="left">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>{history.title}</SheetTitle>
            <div className="flex items-center gap-2">
              {entries.length > 0 && (
                <Button
                  onClick={onClearAll}
                  size="sm"
                  type="button"
                  variant="destructive"
                >
                  {history.clearAll}
                </Button>
              )}
              <SheetClose asChild>
                <Button size="sm" type="button" variant="outline">
                  <span className="i-hugeicons-cancel-01 mr-1.5 size-4" />
                  {history.close}
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 h-[calc(100vh-8rem)] overflow-y-auto">
          {entries.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="i-hugeicons-file-not-found mb-4 size-20 text-muted-foreground" />
              <p className="font-medium text-lg text-muted-foreground">
                {history.empty}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {entries.map((entry, index) => (
                <div
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-lg border bg-card text-left transition-all hover:border-primary hover:shadow-md",
                    "fade-in slide-in-from-left animate-in"
                  )}
                  key={entry.id}
                  onClick={() => onSelectEntry(entry)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectEntry(entry);
                    }
                  }}
                  role="button"
                  style={{
                    animationDelay: getStaggerDelay(index),
                  }}
                  tabIndex={0}
                >
                  <div className="relative aspect-square overflow-hidden bg-muted p-2">
                    {entry.originalSize && entry.compressedSize && (
                      <Badge
                        className="absolute top-1 left-1 z-10 bg-green-300 text-black/80 dark:bg-green-400"
                        variant="secondary"
                      >
                        -
                        {Math.round(
                          ((entry.originalSize - entry.compressedSize) /
                            entry.originalSize) *
                            100
                        )}
                        %
                      </Badge>
                    )}
                    <SvgThumbnail svg={entry.compressedSvg} variant="fill" />
                  </div>
                  <div className="p-2">
                    <p
                      className="truncate font-medium text-sm"
                      title={entry.fileName}
                    >
                      {entry.fileName}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-muted-foreground text-xs">
                      <span>{formatTimestamp(entry.timestamp)}</span>
                      <span>{formatFileSize(entry.compressedSize)}</span>
                    </div>
                  </div>
                  <Button
                    aria-label={String(history.delete)}
                    className="absolute top-1 right-1 size-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEntry(entry.id);
                    }}
                    size="icon"
                    title={String(history.delete)}
                    type="button"
                    variant="destructive"
                  >
                    <span className="i-hugeicons-delete-02 size-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
