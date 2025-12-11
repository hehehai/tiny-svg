import { Button } from "@tiny-svg/ui/components/button";
import { lazy, Suspense } from "react";
import { Toaster } from "sonner";
import { EmptyState } from "@/ui/components/empty-state";
import { Footer } from "@/ui/components/footer";
import { Header } from "@/ui/components/Header";
import { CodeItem } from "@/ui/components/items/code-item";
import { ImageItem } from "@/ui/components/items/image-item";
import { SvgItem } from "@/ui/components/items/svg-item";
import { PluginLayout } from "@/ui/components/layout/plugin-layout";
import { useFigmaMessages } from "@/ui/hooks/use-figma-messages";
import { usePluginStore } from "@/ui/store";

// Lazy load heavy components that are not always needed
const PresetEditorDrawer = lazy(
  () => import("@/ui/components/preset/preset-editor-drawer")
);
const PreviewDrawer = lazy(
  () => import("@/ui/components/preview/preview-drawer")
);
const SettingsDrawer = lazy(
  () => import("@/ui/components/settings/settings-drawer")
);
const IconFontsDrawer = lazy(
  () => import("@/ui/components/icon-fonts/icon-fonts-drawer")
);

export function PluginApp() {
  const {
    items,
    error,
    isCompressing,
    compressionProgress,
    clearError,
    openPreview,
    activeTab,
  } = usePluginStore();

  useFigmaMessages();

  const hasItems = items.length > 0;

  return (
    <>
      <PluginLayout footer={<Footer />} header={<Header />}>
        {error && (
          <div className="mb-3 flex gap-2 rounded border border-destructive/30 bg-destructive/10 p-3 text-destructive">
            <span className="shrink-0 text-base">⚠️</span>
            <div className="flex flex-1 flex-col gap-1">
              <div className="font-medium text-sm">{error.message}</div>
              {error.details && (
                <div className="font-mono text-xs opacity-80">
                  {error.details}
                </div>
              )}
            </div>
            <Button
              className="text-destructive hover:text-destructive"
              onClick={clearError}
              size="icon-sm"
              variant="ghost"
            >
              ✕
            </Button>
          </div>
        )}

        {isCompressing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex min-w-[200px] flex-col items-center gap-4 rounded-lg border border-border bg-card p-6 shadow-lg">
              <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
              <div className="text-center text-muted-foreground text-sm">
                Compressing SVGs... {Math.round(compressionProgress)}%
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${compressionProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {hasItems ? (
          <div className="flex flex-col gap-2">
            {items.map((item) => {
              let ItemComponent:
                | typeof SvgItem
                | typeof ImageItem
                | typeof CodeItem;
              if (activeTab === "svg") {
                ItemComponent = SvgItem;
              } else if (activeTab === "image") {
                ItemComponent = ImageItem;
              } else {
                ItemComponent = CodeItem;
              }

              return (
                <ItemComponent
                  item={item}
                  key={item.id}
                  onPreview={() => {
                    openPreview(item.id);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState />
        )}
      </PluginLayout>

      <Suspense fallback={null}>
        <SettingsDrawer />
        <PresetEditorDrawer />
        <PreviewDrawer />
        <IconFontsDrawer />
      </Suspense>
      <Toaster
        position="top-center"
        toastOptions={{ classNames: { toast: "p-2.5! rounded-lg!" } }}
      />
    </>
  );
}
