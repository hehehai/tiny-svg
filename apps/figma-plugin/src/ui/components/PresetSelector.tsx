import { compressionPresets } from "@tiny-svg/svgo-plugins";
import { usePluginStore } from "../store/plugin-store";

export function PresetSelector() {
  const { selectedPreset, setSelectedPreset } = usePluginStore();

  return (
    <div className="card">
      <div className="card-header">
        <h3>Compression Preset</h3>
      </div>
      <div className="card-content">
        <select
          className="select"
          onChange={(e) => setSelectedPreset(e.target.value)}
          value={selectedPreset}
        >
          {compressionPresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.icon} {preset.name}
            </option>
          ))}
        </select>
        <p className="text-tertiary text-xs">
          {compressionPresets.find((p) => p.id === selectedPreset)?.description}
        </p>
      </div>
    </div>
  );
}
