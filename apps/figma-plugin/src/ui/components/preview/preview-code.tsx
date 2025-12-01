import { Diff, Hunk } from "@tiny-svg/ui";
import { parseDiff } from "@tiny-svg/ui/components/diff/utils";
import {
  DEFAULT_DIFF_PARSE_OPTIONS,
  generateUnifiedDiff,
} from "@tiny-svg/ui/lib/diff-utils";
import { copyToClipboard } from "@tiny-svg/utils";
import React, { useCallback, useEffect, useState } from "react";
import { refractor } from "refractor/all";
import { toast } from "sonner";
import { usePluginStore } from "@/ui/store";

interface PreviewCodeProps {
  originalSvg: string;
  compressedSvg: string | undefined;
  onCodeDataChange?: (data: any) => void;
  wrapLines?: boolean;
  maxLineWidth?: number | "auto";
}

function hastToReact(
  node: ReturnType<typeof refractor.highlight>["children"][number],
  key: string
): React.ReactNode {
  if (node.type === "text") {
    return node.value;
  }
  if (node.type === "element") {
    const { tagName, properties, children } = node;
    return React.createElement(
      tagName,
      {
        key,
        className: (properties.className as string[] | undefined)?.join(" "),
      },
      children.map((c, i) => hastToReact(c, `${key}-${i}`))
    );
  }
  return null;
}

function highlight(code: string, lang: string): React.ReactNode[] {
  try {
    const id = `${lang}:${code}`;
    const tree = refractor.highlight(code, lang);
    const nodes = tree.children.map((c, i) => hastToReact(c, `${id}-${i}`));
    return nodes;
  } catch {
    return [code];
  }
}

function CodeViewer({
  code,
  canPrettify,
  onStateChange,
  onDataChange,
  wrapLines = true,
}: {
  code: string;
  canPrettify: boolean;
  onStateChange?: (canPrettify: boolean, isPrettified: boolean) => void;
  onDataChange?: (data: {
    displayCode: string;
    isPrettified: boolean;
    onPrettify: () => Promise<void>;
    onCopy: () => void;
  }) => void;
  wrapLines?: boolean;
}) {
  const [displayCode, setDisplayCode] = useState(code);
  const [isPrettified, setIsPrettified] = useState(false);

  useEffect(() => {
    setDisplayCode(code);
    setIsPrettified(false);
  }, [code]);

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(canPrettify, isPrettified);
  }, [canPrettify, isPrettified, onStateChange]);

  const handlePrettify = useCallback(async () => {
    if (!canPrettify) {
      return;
    }

    try {
      // Import prettier standalone and html parser
      const [prettier, parserHtml] = await Promise.all([
        import("prettier/standalone"),
        import("prettier/plugins/html"),
      ]);

      const formatted = await prettier.format(displayCode, {
        parser: "html",
        plugins: [parserHtml],
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
      });
      setDisplayCode(formatted);
      setIsPrettified(true);
      toast.success("Code prettified");
    } catch (error) {
      console.error("Prettify error:", error);
      toast.error("Failed to prettify code");
    }
  }, [canPrettify, displayCode]);

  const handleCopy = useCallback(() => {
    copyToClipboard(displayCode);
    toast.success("Code copied to clipboard");
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
    <div className="flex-1 overflow-auto">
      <table className="m-0 w-full border-separate border-spacing-0 overflow-x-auto border-0 font-mono text-[0.8rem]">
        <tbody className="box-border w-full">
          {codeLines.map((line, index) => {
            const lineKey = `line-${index}-${line.slice(0, LINE_KEY_PREVIEW_LENGTH)}`;
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
                  className={wrapLines ? "break-all pr-3" : "text-nowrap pr-6"}
                >
                  <span
                    className={
                      wrapLines ? "whitespace-pre-wrap" : "whitespace-pre"
                    }
                  >
                    {highlight(line || " ", "xml").map((node, idx) => {
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

function DiffViewer({
  original,
  modified,
  onDataChange,
  wrapLines = true,
  maxLineWidth = "auto",
}: {
  original: string;
  modified: string;
  onDataChange?: (data: { onCopy: () => void }) => void;
  wrapLines?: boolean;
  maxLineWidth?: number | "auto";
}) {
  const patch = generateUnifiedDiff(original, modified);
  const [file] = parseDiff(patch, DEFAULT_DIFF_PARSE_OPTIONS);

  const handleCopy = useCallback(() => {
    copyToClipboard(modified);
    toast.success("Optimized code copied to clipboard");
  }, [modified]);

  // Notify parent of data changes
  React.useEffect(() => {
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
    <div className="flex-1 overflow-auto">
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
