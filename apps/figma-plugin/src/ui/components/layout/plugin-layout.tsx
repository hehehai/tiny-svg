import type { ReactNode } from "react";

interface PluginLayoutProps {
  header: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

export function PluginLayout({ header, children, footer }: PluginLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header>{header}</header>

      <main className="flex-1 overflow-y-auto p-3">{children}</main>

      <footer className="flex items-center justify-between border-t bg-secondary px-3 py-2">
        {footer}
      </footer>
    </div>
  );
}
