import { Tabs, TabsList, TabsTrigger } from "@tiny-svg/ui/components/tabs";
import React, { useEffect, useState } from "react";
import { refractor } from "refractor/all";
import { CodeActionsToolbar } from "@/components/ui/code-actions-toolbar";
import type { SupportedLanguage } from "@/lib/worker-utils/prettier-worker-client";
import "@/components/ui/diff/theme.css";

type ReactSubTab = "jsx" | "tsx";

type ReactTabContentProps = {
  generatedCodes: Map<string, string>;
  componentName: string;
};

type SubTabConfig = {
  ext: string;
  language: SupportedLanguage;
  originalTabName: string;
};

const subTabConfig: Record<ReactSubTab, SubTabConfig> = {
  jsx: { ext: "jsx", language: "javascript", originalTabName: "react-jsx" },
  tsx: { ext: "tsx", language: "typescript", originalTabName: "react-tsx" },
};

// Map supported languages to refractor language IDs
const languageMap: Record<SupportedLanguage, string> = {
  javascript: "javascript",
  typescript: "typescript",
  html: "html",
  dart: "dart",
  svg: "xml",
};

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
    // Fallback to plain text if language is not supported
    return [code];
  }
}

export function ReactTabContent({
  generatedCodes,
  componentName,
}: ReactTabContentProps) {
  const [activeSubTab, setActiveSubTab] = useState<ReactSubTab>("jsx");
  const [displayCode, setDisplayCode] = useState("");
  const [isPrettified, setIsPrettified] = useState(false);

  const config = subTabConfig[activeSubTab];
  const code = generatedCodes.get(config.originalTabName) || "";

  // Update displayCode when code changes
  useEffect(() => {
    setDisplayCode(code);
    setIsPrettified(false);
  }, [code]);

  if (!code) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Generating code...
      </div>
    );
  }

  const refractorLang = languageMap[config.language] || "javascript";
  const codeLines = displayCode.split("\n");
  const LINE_KEY_PREVIEW_LENGTH = 20;

  return (
    <div className="relative flex h-full flex-col">
      {/* Header with sub-tabs and operations */}
      <div className="mb-3 flex items-center justify-between">
        {/* Left: Sub-tabs */}
        <Tabs
          onValueChange={(value) => setActiveSubTab(value as ReactSubTab)}
          value={activeSubTab}
        >
          <TabsList className="h-8">
            <TabsTrigger className="py-0.5" value="jsx">
              JSX
            </TabsTrigger>
            <TabsTrigger className="py-0.5" value="tsx">
              TSX
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Right: Operations */}
        <CodeActionsToolbar
          code={displayCode}
          fileName={`${componentName}.${config.ext}`}
          isPrettified={isPrettified}
          language={config.language}
          onCodeChange={setDisplayCode}
          onPrettifyStateChange={setIsPrettified}
        />
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-auto rounded-lg border">
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
                  <td className="text-nowrap pr-6">
                    <span>
                      {highlight(line || " ", refractorLang).map(
                        (node, idx) => {
                          const nodeKey = `${lineKey}-node-${idx}`;
                          return (
                            <React.Fragment key={nodeKey}>
                              {node}
                            </React.Fragment>
                          );
                        }
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
