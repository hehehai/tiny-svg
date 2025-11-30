/**
 * PWA Install Prompt Component
 * Allows users to install the app to their device
 */

import { Button } from "@tiny-svg/ui/components/button";
import { Download, X } from "lucide-react";
import { useState } from "react";
import { useInstallPrompt } from "@/lib/pwa-utils";
import { cn } from "@/lib/utils";

export function InstallPrompt() {
  const { showInstallButton, promptInstall, dismissInstall } =
    useInstallPrompt();
  const [isVisible, setIsVisible] = useState(true);

  if (!(showInstallButton && isVisible)) {
    return null;
  }

  const handleInstall = async () => {
    const outcome = await promptInstall();
    if (outcome === "accepted") {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    dismissInstall();
    setIsVisible(false);
  };

  return (
    <div className="fade-in slide-in-from-bottom-4 fixed right-4 bottom-4 z-50 max-w-sm animate-in">
      <div className="rounded-lg border bg-background p-4 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Download className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Install Tiny SVG</p>
                <p className="text-muted-foreground text-xs">
                  Quick access from your home screen
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm">
                Install
              </Button>
              <Button onClick={handleDismiss} size="sm" variant="ghost">
                Not now
              </Button>
            </div>
          </div>
          <Button
            className="size-6"
            onClick={handleDismiss}
            size="icon"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline install button for header/toolbar
 */
export function InstallButton({ className }: { className?: string }) {
  const { showInstallButton, promptInstall } = useInstallPrompt();

  if (!showInstallButton) {
    return null;
  }

  return (
    <Button
      className={cn("gap-1.5", className)}
      onClick={() => promptInstall()}
      size="sm"
      variant="outline"
    >
      <Download className="size-4" />
      <span className="hidden sm:inline">Install App</span>
    </Button>
  );
}
