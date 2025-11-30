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

interface DeleteConfirmationDialogProps {
  open: boolean;
  presetName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  open,
  presetName,
  onOpenChange,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除预设？</AlertDialogTitle>
          <AlertDialogDescription>
            删除预设 "{presetName}" 后无法恢复。
            <br />
            正在使用此预设的项目将自动切换到默认预设。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="flex-1" type="button">
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex-1"
            onClick={onConfirm}
            variant="destructive"
          >
            重置
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
