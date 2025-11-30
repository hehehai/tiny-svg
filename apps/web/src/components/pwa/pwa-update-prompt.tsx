/**
 * PWA Update Prompt Component
 * Shows a notification when a new version of the app is available
 */

import { Button } from "@tiny-svg/ui/components/button";
import { X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { usePWA } from "@/lib/pwa-utils";

export function PWAUpdatePrompt() {
  const { needRefresh, updateServiceWorker, closePrompt } = usePWA();

  useEffect(() => {
    if (needRefresh) {
      // Show a toast notification for updates
      toast(
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm">Update Available</p>
            <p className="text-muted-foreground text-xs">
              A new version of Tiny SVG is ready to install
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                await updateServiceWorker();
                toast.dismiss();
              }}
              size="sm"
            >
              Update
            </Button>
            <Button
              onClick={() => {
                closePrompt();
                toast.dismiss();
              }}
              size="sm"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>,
        {
          duration: Number.POSITIVE_INFINITY, // Keep toast visible until user acts
          closeButton: false,
        }
      );
    }
  }, [needRefresh, updateServiceWorker, closePrompt]);

  return null; // This component renders via toast
}
