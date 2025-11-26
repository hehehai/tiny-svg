import { useState } from "react";
import { usePluginStore } from "../store/plugin-store";

export function CodeExportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState("preview");

  const { selectedFramework, setSelectedFramework } = usePluginStore();

  const frameworks = [
    { id: "react", name: "React", icon: "⚛️" },
    { id: "vue", name: "Vue", icon: "💚" },
    { id: "svelte", name: "Svelte", icon: "🧡" },
    { id: "data-uri", name: "Data URI", icon: "🔗" },
  ];

  const closeModal = () => {
    setIsOpen(false);
    setGeneratedCode("");
    setActiveTab("preview");
  };

  const handleBackdropKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <>
      {isOpen && (
        <div
          aria-modal="true"
          onClick={closeModal}
          onKeyDown={handleBackdropKeyDown}
          role="dialog"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="document"
            style={{
              background: "white",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Export Code</h2>
              <button className="btn btn-sm" onClick={closeModal} type="button">
                ×
              </button>
            </div>

            <div style={{ padding: "16px" }}>
              <div style={{ marginBottom: "16px" }}>
                <h3>Framework</h3>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {frameworks.map((fw) => (
                    <button
                      className={`btn btn-sm ${
                        selectedFramework === fw.id
                          ? "btn-primary"
                          : "btn-secondary"
                      }`}
                      key={fw.id}
                      onClick={() => setSelectedFramework(fw.id)}
                      type="button"
                    >
                      {fw.icon} {fw.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                >
                  <button
                    className={`btn btn-sm ${
                      activeTab === "preview" ? "btn-primary" : "btn-secondary"
                    }`}
                    onClick={() => setActiveTab("preview")}
                    type="button"
                  >
                    Preview
                  </button>
                  <button
                    className={`btn btn-sm ${
                      activeTab === "code" ? "btn-primary" : "btn-secondary"
                    }`}
                    onClick={() => setActiveTab("code")}
                    type="button"
                  >
                    Code
                  </button>
                </div>
              </div>

              <div
                style={{
                  background: "#f5f5f5",
                  padding: "12px",
                  borderRadius: "4px",
                  maxHeight: "300px",
                  overflow: "auto",
                  fontSize: "11px",
                  lineHeight: "1.4",
                  fontFamily: "monospace",
                }}
              >
                {activeTab === "preview" ? (
                  <div>Preview will show here</div>
                ) : (
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                    {generatedCode || "Generate code to see it here"}
                  </pre>
                )}
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={closeModal}
                type="button"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={!generatedCode}
                onClick={copyToClipboard}
                type="button"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
