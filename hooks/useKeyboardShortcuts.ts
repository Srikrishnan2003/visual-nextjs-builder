import { useEffect } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

export function useKeyboardShortcuts() {
  const { 
    undo, 
    redo, 
    selectedId, 
    selectedComponent,
    removeComponent,
    copyComponent,
    pasteComponent,
    duplicateComponent,
  } = useCanvasStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName) || 
                       target.contentEditable === 'true';

      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && !isTyping) {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || 
          ((e.ctrlKey || e.metaKey) && e.key === 'y') && !isTyping) {
        e.preventDefault();
        redo();
        return;
      }

      // Delete/Backspace: Remove selected component
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !isTyping) {
        e.preventDefault();
        const selected = selectedComponent();
        if (selected && !selected.parentId) { // Only delete top-level components
          if (confirm(`Delete ${selected.type}?`)) {
            removeComponent(selectedId);
          }
        }
        return;
      }

      // Escape: Deselect component
      if (e.key === 'Escape' && selectedId) {
        e.preventDefault();
        useCanvasStore.setState({ selectedId: null, expandedParentId: null });
        return;
      }

      // Arrow keys: Move component (if selected and top-level)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedId && !isTyping) {
        const selected = selectedComponent();
        if (selected && !selected.parentId) { // Only move top-level components
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1; // Hold Shift for bigger steps
          
          let newX = selected.x;
          let newY = selected.y;
          
          if (e.key === 'ArrowUp') newY -= step;
          if (e.key === 'ArrowDown') newY += step;
          if (e.key === 'ArrowLeft') newX -= step;
          if (e.key === 'ArrowRight') newX += step;
          
          useCanvasStore.getState().moveComponent(selectedId, newX, newY);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedId, removeComponent, selectedComponent]);
}