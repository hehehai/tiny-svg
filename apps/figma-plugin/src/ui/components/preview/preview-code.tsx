import { Diff, Hunk } from "@tiny-svg/ui";
import { parseDiff } from "@tiny-svg/ui/components/diff/utils";
import {
  DEFAULT_DIFF_PARSE_OPTIONS,
  generateUnifiedDiff,
} from "@tiny-svg/ui/lib/diff-utils";
import { highlight } from "@tiny-svg/ui/lib/syntax-highlight";
import React, { useEffect, useState } from "react";
import { useCodeViewer } from "@/ui/hooks/preview/use-code-viewer";
import { useDiffViewer } from "@/ui/hooks/preview/use-diff-viewer";
import { usePluginStore } from "@/ui/store";

interface PreviewCodeProps {
  originalSvg: string;
  compressedSvg: string | undefined;
  onCodeDataChange?: (data: any) => void;
  wrapLines?: boolean;
  maxLineWidth?: number | "auto";
}

interface CodeViewerProps {
  code: string;
  canPrettify: boolean;
  onDataChange?: (data: {
    displayCode: string;
    isPrettified: boolean;
    onPrettify: () => Promise<void>;
    onCopy: () => void;
  }) => void;
  wrapLines?: boolean;
}

function CodeViewer({
  code,
  canPrettify,
  onDataChange,
  wrapLines = true,
}: CodeViewerProps) {
  const { displayCode, isPrettified, handlePrettify, handleCopy } =
    useCodeViewer(code, canPrettify);

  const [highlightedLines, setHighlightedLines] = useState<
    Map<number, React.ReactNode[]>
  >(new Map());

  // Highlight code lines asynchronously
  useEffect(() => {
    const codeLines = displayCode.split("\n");
    const highlightPromises = codeLines.map(async (line, index) => {
      const nodes = await highlight(line || " ", "xml");
      return { index, nodes };
    });

    Promise.all(highlightPromises).then((results) => {
      const newMap = new Map<number, React.ReactNode[]>();
      for (const { index, nodes } of results) {
        newMap.set(index, nodes);
      }
      setHighlightedLines(newMap);
    });
  }, [displayCode]);

  // Notify parent of data changes
  useEffect(() => {
    onDataChange?.({
      displayCode,
      isPrettified,
      onPrettify: handlePrettify,
      onCopy: handleCopy,
    });
  }, [displayCode, isPrettified, onDataChange, handleCopy, handlePrettify]);

  const codeLines = displayCode.split("\n");
  const LINE_KEY_PREVIEW_LENGTH = 20;

  return (
    <div className="flex-1 overflow-auto py-1.5">
      <table className="m-0 w-full border-separate border-spacing-0 overflow-x-auto border-0 font-mono text-[0.8rem]">
        <tbody className="box-border w-full">
          {codeLines.map((line, index) => {
            const lineKey = `line-${index}-${line.slice(0, LINE_KEY_PREVIEW_LENGTH)}`;
            const highlightedNodes = highlightedLines.get(index) || [
              line || " ",
            ];

            return (
              <tr
                className="box-border h-5 min-h-5 whitespace-pre-wrap border-none"
                key={lineKey}
              >
                <td className="w-1 border-transparent border-l-3" />
                <td className="select-none px-2 text-center text-xs tabular-nums opacity-50">
                  {index + 1}
                </td>
                <td
                  className={wrapLines ? "break-all pr-6" : "text-nowrap pr-6"}
                >
                  <span
                    className={
                      wrapLines ? "whitespace-pre-wrap" : "whitespace-pre"
                    }
                  >
                    {highlightedNodes.map((node, idx) => {
                      const nodeKey = `${lineKey}-node-${idx}`;
                      return (
                        <React.Fragment key={nodeKey}>{node}</React.Fragment>
                      );
                    })}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface DiffViewerProps {
  original: string;
  modified: string;
  onDataChange?: (data: { onCopy: () => void }) => void;
  wrapLines?: boolean;
  maxLineWidth?: number | "auto";
}

function DiffViewer({
  original,
  modified,
  onDataChange,
  wrapLines = true,
  maxLineWidth = "auto",
}: DiffViewerProps) {
  const { handleCopy } = useDiffViewer(modified);

  const patch = generateUnifiedDiff(original, modified);
  const [file] = parseDiff(patch, DEFAULT_DIFF_PARSE_OPTIONS);

  // Notify parent of data changes
  useEffect(() => {
    onDataChange?.({
      onCopy: handleCopy,
    });
  }, [onDataChange, handleCopy]);

  if (!file) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        No diff to display
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto py-1.5">
      <Diff
        fileName="diff"
        hunks={file.hunks}
        language="xml"
        maxLineWidth={maxLineWidth}
        type={file.type}
        wrapLines={wrapLines}
      >
        {file.hunks.map((hunk: ReturnType<typeof parseDiff>[0]["hunks"][0]) => (
          <Hunk hunk={hunk} key={hunk.content} />
        ))}
      </Diff>
    </div>
  );
}

export function PreviewCode({
  originalSvg,
  compressedSvg,
  onCodeDataChange,
  wrapLines = true,
  maxLineWidth = "auto",
}: PreviewCodeProps) {
  const { previewModal } = usePluginStore();
  const viewMode = previewModal.codeViewMode;

  // Show message if no compressed version for diff/optimized views
  if (!compressedSvg && (viewMode === "diff" || viewMode === "optimized")) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>No compressed version available</p>
          <p className="text-sm">
            Compress the SVG to see{" "}
            {viewMode === "diff" ? "diff" : "optimized code"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {viewMode === "diff" && compressedSvg && (
        <DiffViewer
          maxLineWidth={maxLineWidth}
          modified={compressedSvg}
          onDataChange={onCodeDataChange}
          original={originalSvg}
          wrapLines={wrapLines}
        />
      )}
      {viewMode === "origin" && (
        <CodeViewer
          canPrettify
          code={originalSvg}
          onDataChange={onCodeDataChange}
          wrapLines={wrapLines}
        />
      )}
      {viewMode === "optimized" && compressedSvg && (
        <CodeViewer
          canPrettify
          code={compressedSvg}
          onDataChange={onCodeDataChange}
          wrapLines={wrapLines}
        />
      )}
    </div>
  );
}
