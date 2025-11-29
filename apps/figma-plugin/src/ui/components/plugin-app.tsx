import { Toaster } from "sonner";
import { Button } from "@/ui/components/base/button";
import { EmptyState } from "@/ui/components/empty-state";
import { Footer } from "@/ui/components/footer";
import { Header } from "@/ui/components/header";
import { SvgItem } from "@/ui/components/items/svg-item";
import { PluginLayout } from "@/ui/components/layout/plugin-layout";
import { useFigmaMessages } from "@/ui/hooks/use-figma-messages";
import { usePluginStore } from "@/ui/store/plugin-store";

export function PluginApp() {
  const { items, error, isCompressing, compressionProgress, clearError } =
    usePluginStore();

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
          <div className="compression-overlay">
            <div className="compression-card">
              <div className="spinner" />
              <div className="compression-text">
                Compressing SVGs... {Math.round(compressionProgress)}%
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${compressionProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {hasItems ? (
          <div className="flex flex-col">
            {items.map((item) => (
              <SvgItem
                item={item}
                key={item.id}
                onPreview={() => {
                  // TODO: Open preview modal
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </PluginLayout>

      <Toaster position="bottom-center" />
    </>
  );
}
