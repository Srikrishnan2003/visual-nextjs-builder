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
        <p className="text-base text-gray-800">Do you want to add <strong>{componentType}</strong> to the canvas?</p>
        <DialogFooter className="mt-6">
          <Button variant="ghost" onClick={onClose} className="rounded-md">
            Cancel
          </Button>
          <Button onClick={handleAdd} className="rounded-md bg-blue-500 hover:bg-blue-600 text-white">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
