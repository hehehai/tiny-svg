"use client";

import React from "react";
import { refractor } from "refractor/all";
import "./theme.css";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type File,
  guessLang,
  type Hunk as HunkType,
  type Line as LineType,
  type SkipBlock,
} from "./utils";

/* -------------------------------------------------------------------------- */
/*                                — Context —                                 */
/* -------------------------------------------------------------------------- */

interface DiffContextValue {
  language: string;
}

const DiffContext = React.createContext<DiffContextValue | null>(null);

function useDiffContext() {
  const context = React.useContext(DiffContext);
  if (!context) {
    throw new Error("useDiffContext must be used within a Diff component");
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/*                                — Helpers —                                 */
/* -------------------------------------------------------------------------- */

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
  const id = `${lang}:${code}`;
  const tree = refractor.highlight(code, lang);
  const nodes = tree.children.map((c, i) => hastToReact(c, `${id}-${i}`));
  return nodes;
}

/* -------------------------------------------------------------------------- */
/*                               — Root —                                     */
/* -------------------------------------------------------------------------- */
export interface DiffSelectionRange {
  startLine: number;
  endLine: number;
}

export interface DiffProps
  extends React.TableHTMLAttributes<HTMLTableElement>,
    Pick<File, "hunks" | "type"> {
  fileName?: string;
  language?: string;
}

const LINE_KEY_PREVIEW_LENGTH = 20;
const HUNK_KEY_PREVIEW_LENGTH = 30;
const SEGMENT_KEY_PREVIEW_LENGTH = 20;

export const Hunk = ({ hunk }: { hunk: HunkType | SkipBlock }) => {
  if (hunk.type === "hunk") {
    return hunk.lines.map((line, index) => {
      const lineKey = `hunk-line-${index}-${line.content
        .map((s) => s.value)
        .join("")
        .slice(0, LINE_KEY_PREVIEW_LENGTH)}`;
      return <Line key={lineKey} line={line} />;
    });
  }
  return <SkipBlockRow content={hunk.content} lines={hunk.count} />;
};

export const Diff: React.FC<DiffProps> = ({
  fileName,
  language = guessLang(fileName),
  hunks,
  className,
  children,
  ...props
}) => (
  <DiffContext.Provider value={{ language }}>
    <table
      {...props}
      className={cn(
        "m-0 w-full border-separate border-spacing-0 overflow-x-auto border-0 font-mono text-[0.8rem] outline-none [--code-added:var(--color-green-500)] [--code-removed:var(--color-orange-600)]",
        className
      )}
    >
      <tbody className="box-border w-full">
        {children ??
          hunks.map((hunk, index) => {
            const hunkKey = `hunk-${index}-${hunk.content.slice(0, HUNK_KEY_PREVIEW_LENGTH)}`;
            return <Hunk hunk={hunk} key={hunkKey} />;
          })}
      </tbody>
    </table>
  </DiffContext.Provider>
);

const SkipBlockRow: React.FC<{
  lines: number;
  content?: string;
}> = ({ lines, content }) => (
  <>
    <tr className="h-4" />
    <tr className={cn("h-10 bg-muted font-mono text-muted-foreground")}>
      <td />
      <td className="select-none opacity-50">
        <ChevronsUpDown className="mx-auto size-4" />
      </td>
      <td>
        <span className="sticky left-2 px-0 italic opacity-50">
          {content || `${lines} lines hidden`}
        </span>
      </td>
    </tr>
    <tr className="h-4" />
  </>
);

const Line: React.FC<{
  line: LineType;
}> = ({ line }) => {
  const { language } = useDiffContext();

  let Tag: "ins" | "del" | "span" = "span";
  if (line.type === "insert") {
    Tag = "ins";
  } else if (line.type === "delete") {
    Tag = "del";
  }

  const lineNumberNew =
    line.type === "normal" ? line.newLineNumber : line.lineNumber;
  const lineNumberOld = line.type === "normal" ? line.oldLineNumber : undefined;

  return (
    <tr
      className={cn("box-border h-5 min-h-5 whitespace-pre-wrap border-none", {
        "bg-[var(--code-added)]/10": line.type === "insert",
        "bg-[var(--code-removed)]/10": line.type === "delete",
      })}
      data-line-kind={line.type}
      data-line-new={lineNumberNew ?? undefined}
      data-line-old={lineNumberOld ?? undefined}
    >
      <td
        className={cn("w-1 border-transparent border-l-3", {
          "border-[color:var(--code-added)]/60": line.type === "insert",
          "border-[color:var(--code-removed)]/80": line.type === "delete",
        })}
      />
      <td className="select-none px-2 text-center text-xs tabular-nums opacity-50">
        {line.type === "delete" ? "–" : lineNumberNew}
      </td>
      <td className="text-nowrap pr-6">
        <Tag>
          {line.content.map((seg, i) => {
            const segKey = `seg-${i}-${seg.value.slice(0, SEGMENT_KEY_PREVIEW_LENGTH)}`;
            return (
              <span
                className={cn({
                  "bg-[var(--code-added)]/20": seg.type === "insert",
                  "bg-[var(--code-removed)]/20": seg.type === "delete",
                })}
                key={segKey}
              >
                {highlight(seg.value, language).map((n, idx) => {
                  const nodeKey = `${segKey}-node-${idx}`;
                  return <React.Fragment key={nodeKey}>{n}</React.Fragment>;
                })}
              </span>
            );
          })}
        </Tag>
      </td>
    </tr>
  );
};
