import { createRoot } from "react-dom/client";
import { I18nProvider } from "@/i18n/context";
import { PluginApp } from "./components/plugin-app";
import { initEventHandlers } from "./init-event-handlers";
import { usePluginStore } from "./store";
import "./style.css";

// Initialize event handlers before React renders
initEventHandlers();

function App() {
  const locale = usePluginStore((state) => state.locale);

  return (
    <I18nProvider initialLocale={locale}>
      <PluginApp />
    </I18nProvider>
  );
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(<App />);
