import { useFigmaMessages } from "../hooks/useFigmaMessages";
import { usePluginStore } from "../store/plugin-store";
import { ActionButtons } from "./ActionButtons";
import { CodeExportModal } from "./CodeExportModal";
import { Header } from "./Header";
import { PresetSelector } from "./PresetSelector";
import { SvgList } from "./SvgList";
import "../styles.css";

export function PluginApp() {
  const { isLoading, error } = usePluginStore();

  useFigmaMessages();

  return (
    <div className="plugin-container">
      <Header />

      <div className="plugin-content">
        {error && (
          <div className="card card-header status-error">
            <h3>Error</h3>
            <p className="text-xs">{error}</p>
          </div>
        )}

        <PresetSelector />

        <SvgList />

        {isLoading && (
          <div className="loading">
            <div className="spinner" />
            <span>Processing SVGs...</span>
          </div>
        )}
      </div>

      <div className="plugin-footer">
        <ActionButtons />
      </div>

      <CodeExportModal />
    </div>
  );
}
