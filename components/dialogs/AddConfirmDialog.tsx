import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCanvasStore } from "@/stores/canvasStore";

interface Props {
  componentType: string | null;
  onClose: () => void;
}

export default function AddConfirmDialog({ componentType, onClose }: Props) {
  const addComponent = useCanvasStore((state) => state.addComponent);

  const handleAdd = () => {
    if (componentType) {
      addComponent(componentType);
      onClose();
    }
  };

  return (
    <Dialog open={!!componentType} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add component</DialogTitle> {/* ✅ Required */}
        </DialogHeader>
        <p className="text-sm">Do you want to add <strong>{componentType}</strong> to the canvas?</p>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
