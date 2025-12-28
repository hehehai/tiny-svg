import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@tiny-svg/ui/components/alert-dialog";
import { useIntlayer } from "react-intlayer";
import { usePresetsStore } from "@/store/presets-store";

export function DeletePresetDialog() {
  const { presets: t } = useIntlayer("presets");
  const {
    deleteDialogPresetId,
    closeDeleteDialog,
    deletePreset,
    getPresetById,
  } = usePresetsStore();

  const preset = deleteDialogPresetId
    ? getPresetById(deleteDialogPresetId)
    : null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeDeleteDialog();
    }
  };

  const handleConfirm = () => {
    if (deleteDialogPresetId) {
      deletePreset(deleteDialogPresetId);
    }
  };

  return (
    <AlertDialog
      onOpenChange={handleOpenChange}
      open={deleteDialogPresetId !== null}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.deleteDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {String(t.deleteDialog.description).replace(
              "{name}",
              preset?.name || ""
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel type="button">
            {t.deleteDialog.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleConfirm}
            type="button"
          >
            {t.deleteDialog.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
