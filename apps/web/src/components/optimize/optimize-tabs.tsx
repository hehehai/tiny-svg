import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tiny-svg/ui/components/tabs";
import { CodeDiffViewerLazy } from "@/components/lazy/code-diff-viewer-lazy";
import { ReactTabContentLazy } from "@/components/lazy/react-tab-content-lazy";
import { CodeTabContent } from "@/components/optimize/code-tab-content";
import { DataUriTabContent } from "@/components/optimize/data-uri-tab-content";
import { SvgPreview } from "@/components/svg-preview";
import type { SvgoGlobalSettings } from "@/lib/svgo-plugins";

type OptimizeTabsProps = {
  activeTab: string;
  safeGlobalSettings: SvgoGlobalSettings;
  originalSvg: string;
  compressedSvg: string;
  prettifiedOriginal: string;
  prettifiedCompressed: string;
  componentName: string;
  generatedCodes: Map<string, string>;
  ui: any;
  onTabChange: (tab: string) => void;
};

export function OptimizeTabs({
  activeTab,
  safeGlobalSettings,
  originalSvg,
  compressedSvg,
  prettifiedOriginal,
  prettifiedCompressed,
  componentName,
  generatedCodes,
  ui,
  onTabChange,
}: OptimizeTabsProps) {
  return (
    <Tabs
      className="flex h-full flex-col"
      onValueChange={onTabChange}
      value={activeTab}
    >
      <TabsList>
        {safeGlobalSettings.showOriginal && (
          <TabsTrigger value="original">
            {ui?.originalTab || "Original"}
          </TabsTrigger>
        )}
        <TabsTrigger value="optimized">
          {ui?.optimizedTab || "Optimized"}
        </TabsTrigger>
        <TabsTrigger value="code">{ui?.codeTab || "Code"}</TabsTrigger>
        <TabsTrigger disabled={!compressedSvg} value="data-uri">
          {ui?.dataUriTab || "Data URI"}
        </TabsTrigger>
        <TabsTrigger value="react">React</TabsTrigger>
        <TabsTrigger value="vue">Vue</TabsTrigger>
        <TabsTrigger value="svelte">Svelte</TabsTrigger>
        <TabsTrigger value="react-native">React Native</TabsTrigger>
        <TabsTrigger value="flutter">Flutter</TabsTrigger>
      </TabsList>

      {safeGlobalSettings.showOriginal && (
        <TabsContent
          className="mt-4 flex-1 data-[state=active]:flex"
          value="original"
        >
          <SvgPreview
            className="flex-1"
            svg={originalSvg}
            title="Original SVG"
          />
        </TabsContent>
      )}

      <TabsContent
        className="mt-4 flex-1 data-[state=active]:flex"
        value="optimized"
      >
        {compressedSvg ? (
          <SvgPreview
            className="flex-1"
            svg={compressedSvg}
            title="Optimized SVG"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {ui?.clickToCompress || 'Click "Compress SVG" to optimize'}
          </div>
        )}
      </TabsContent>

      <TabsContent className="mt-4 flex-1 overflow-hidden" value="code">
        {compressedSvg ? (
          <CodeDiffViewerLazy
            language="html"
            modified={prettifiedCompressed}
            original={prettifiedOriginal}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {ui?.noOptimizedCode || "No optimized code yet"}
          </div>
        )}
      </TabsContent>

      <TabsContent className="mt-4 flex-1 overflow-hidden" value="data-uri">
        <DataUriTabContent compressedSvg={compressedSvg} />
      </TabsContent>

      <TabsContent className="mt-4 flex-1 overflow-hidden" value="react">
        <ReactTabContentLazy
          componentName={componentName}
          generatedCodes={generatedCodes}
        />
      </TabsContent>

      {["vue", "svelte", "react-native", "flutter"].map((tab) => (
        <TabsContent
          className="mt-4 flex-1 overflow-hidden"
          key={tab}
          value={tab}
        >
          <CodeTabContent
            activeTab={tab}
            componentName={componentName}
            generatedCodes={generatedCodes}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
