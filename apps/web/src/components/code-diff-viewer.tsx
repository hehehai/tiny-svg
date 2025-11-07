import { useEffect, useState } from "react";
import { Diff, Hunk } from "@/components/ui/diff";
import type { ParseOptions } from "@/components/ui/diff/utils/parse";
import { parseDiff } from "@/components/ui/diff/utils/parse";

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

  const parseOptions: Partial<ParseOptions> = {
    mergeModifiedLines: true,
    maxChangeRatio: 0.45,
    maxDiffDistance: 30,
    inlineMaxCharEdits: 2,
  };

  const [file] = parseDiff(patch, parseOptions);

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

// Helper function to generate unified diff format from two strings
function generateUnifiedDiff(original: string, modified: string): string {
  const originalLines = original.split("\n");
  const modifiedLines = modified.split("\n");

  // Simple line-by-line diff
  const diffLines: string[] = [];
  diffLines.push("diff --git a/file b/file");
  diffLines.push("index 0000000..0000000 100644");
  diffLines.push("--- a/file");
  diffLines.push("+++ b/file");
  diffLines.push(`@@ -1,${originalLines.length} +1,${modifiedLines.length} @@`);

  // Track which lines we've processed
  let i = 0;
  let j = 0;

  while (i < originalLines.length || j < modifiedLines.length) {
    if (i < originalLines.length && j < modifiedLines.length) {
      if (originalLines[i] === modifiedLines[j]) {
        diffLines.push(` ${originalLines[i]}`);
        i++;
        j++;
      } else {
        // Lines differ - mark as deletion and addition
        diffLines.push(`-${originalLines[i]}`);
        i++;
        if (j < modifiedLines.length) {
          diffLines.push(`+${modifiedLines[j]}`);
          j++;
        }
      }
    } else if (i < originalLines.length) {
      // Remaining lines from original (deletions)
      diffLines.push(`-${originalLines[i]}`);
      i++;
    } else {
      // Remaining lines from modified (additions)
      diffLines.push(`+${modifiedLines[j]}`);
      j++;
    }
  }

  return diffLines.join("\n");
}
