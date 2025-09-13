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
      <DialogContent className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-100 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">Add Component</DialogTitle>
        </DialogHeader>
        <p className="text-md text-slate-700">Do you want to add <strong className="text-blue-600">{componentType}</strong> to the canvas?</p>
        <DialogFooter className="mt-6">
          <Button variant="ghost" onClick={onClose} className="rounded-lg px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100">
            Cancel
          </Button>
          <Button onClick={handleAdd} className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 shadow-md">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
