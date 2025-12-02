import { useCallback, useState } from "react";
import { usePluginStore } from "@/ui/store";

/**
 * Hook for preview header logic
 */
export function usePreviewHeader(itemId: string, initialName: string) {
  const { updateItem, setPreviewPreset, compressSingleItem } = usePluginStore();
  const [itemName, setItemName] = useState(initialName);

  const handleNameChange = useCallback((name: string) => {
    setItemName(name);
  }, []);

  const handleNameBlur = useCallback(() => {
    if (itemName.trim() && itemName !== initialName) {
      updateItem(itemId, { name: itemName.trim() });
    } else if (!itemName.trim()) {
      setItemName(initialName);
    }
  }, [itemName, initialName, itemId, updateItem]);

  const handlePresetChange = useCallback(
    async (presetId: string) => {
      setPreviewPreset(itemId, presetId);
      await compressSingleItem(itemId);
    },
    [itemId, setPreviewPreset, compressSingleItem]
  );

  return {
    itemName,
    handleNameChange,
    handleNameBlur,
    handlePresetChange,
  };
}
