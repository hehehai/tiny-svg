import { Button } from "@tiny-svg/ui/components/button";
import { Toaster } from "sonner";
import { EmptyState } from "@/ui/components/empty-state";
import { Footer } from "@/ui/components/footer";
import { Header } from "@/ui/components/header";
import { SvgItem } from "@/ui/components/items/svg-item";
import { PluginLayout } from "@/ui/components/layout/plugin-layout";
import { PresetEditorDrawer } from "@/ui/components/preset/preset-editor-drawer";
import { PreviewDrawer } from "@/ui/components/preview/preview-drawer";
import { SettingsDrawer } from "@/ui/components/settings/settings-drawer";
import { useFigmaMessages } from "@/ui/hooks/use-figma-messages";
import { usePluginStore } from "@/ui/store";

export function PluginApp() {
  const {
    items,
    error,
    isCompressing,
    compressionProgress,
    clearError,
    openPreview,
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
            {items.map((item) => (
              <SvgItem
                item={item}
                key={item.id}
                onPreview={() => {
                  openPreview(item.id);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </PluginLayout>

      <SettingsDrawer />
      <PresetEditorDrawer />
      <PreviewDrawer />
      <Toaster position="bottom-center" />
    </>
  );
}
