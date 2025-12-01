import { Diff, Hunk } from "@tiny-svg/ui/components/diff";
import { parseDiff } from "@tiny-svg/ui/components/diff/utils/parse";
import {
  DEFAULT_DIFF_PARSE_OPTIONS,
  generateUnifiedDiff,
} from "@tiny-svg/ui/lib/diff-utils";
import { useEffect, useState } from "react";

type CodeDiffViewerProps = {
  original: string;
  modified: string;
  language?: string;
};

// Debounce delay for content updates (in milliseconds)
const DEBOUNCE_DELAY = 150;

export function CodeDiffViewer({
  original,
  modified,
  language = "html",
}: CodeDiffViewerProps) {
  const [debouncedContent, setDebouncedContent] = useState({
    original,
    modified,
  });

  // Debounce content updates
  useEffect(() => {
    const updateTimer = setTimeout(() => {
      setDebouncedContent({ original, modified });
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(updateTimer);
    };
  }, [original, modified]);

  // Generate unified diff format
  const patch = generateUnifiedDiff(
    debouncedContent.original,
    debouncedContent.modified
  );

  const [file] = parseDiff(patch, DEFAULT_DIFF_PARSE_OPTIONS);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No diff to display
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto rounded-lg border">
      <Diff
        fileName="diff"
        hunks={file.hunks}
        language={language}
        type={file.type}
      >
        {file.hunks.map((hunk) => (
          <Hunk hunk={hunk} key={hunk.content} />
        ))}
      </Diff>
    </div>
  );
}
