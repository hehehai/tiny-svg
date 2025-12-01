import type { ParseOptions } from "../components/diff/utils/parse";

/**
 * Generate unified diff format from two strings
 * Used for code diff visualization
 */
export function generateUnifiedDiff(
  original: string,
  modified: string
): string {
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

/**
 * Default parse options for diff display
 * Optimized for code diff visualization
 */
export const DEFAULT_DIFF_PARSE_OPTIONS: Partial<ParseOptions> = {
  mergeModifiedLines: true,
  maxChangeRatio: 0.45,
  maxDiffDistance: 30,
  inlineMaxCharEdits: 2,
};
