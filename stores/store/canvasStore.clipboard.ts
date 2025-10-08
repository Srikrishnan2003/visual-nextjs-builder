// stores/canvasStore.clipboard.ts
import { ComponentNode } from "@/types/component-nodes";
import { cloneComponentWithNewIds, addNodeToParent, findNodeById } from "./canvasStore.helpers";
import { useFileSystemStore } from "../useFileSystemStore";

/**
 * Copy a component to clipboard
 * @param id - Component ID to copy
 * @param canvasTree - Current canvas tree
 * @returns The component that was copied, or null if not found
 */
export function copyComponent(
  id: string,
  canvasTree: ComponentNode[]
): ComponentNode | null {
  const componentToCopy = findNodeById(canvasTree, id);
  if (componentToCopy) {
    console.log(`✓ Copied ${componentToCopy.type}`);
    return componentToCopy;
  }
  console.warn(`✗ Component with id ${id} not found`);
  return null;
}

/**
 * Paste a component from clipboard
 * @param clipboard - The component in clipboard
 * @param canvasTree - Current canvas tree
 * @param selectedFileId - Current file ID
 * @param setWithHistory - Function to update tree with history
 * @returns Object with updated tree and new component ID, or null if clipboard empty
 */
export function pasteComponent(
  clipboard: ComponentNode | null,
  canvasTree: ComponentNode[],
  selectedFileId: string | null,
  setWithHistory: (tree: ComponentNode[]) => void
): { updatedTree: ComponentNode[]; newComponentId: string } | null {
  if (!clipboard) {
    console.warn('✗ Clipboard is empty');
    return null;
  }

  const { updateFileCanvasTree } = useFileSystemStore.getState();

  // Clone with new IDs to avoid conflicts
  const clonedComponent = cloneComponentWithNewIds(clipboard);

  // Offset position slightly so it's visible
  clonedComponent.x = (clipboard.x || 0) + 20;
  clonedComponent.y = (clipboard.y || 0) + 20;
  clonedComponent.parentId = undefined; // Make it top-level

  const updatedTree = [...canvasTree, clonedComponent];

  if (selectedFileId) {
    updateFileCanvasTree(selectedFileId, updatedTree);
  }
  setWithHistory(updatedTree);

  console.log(`✓ Pasted ${clipboard.type} as new component`);
  return { updatedTree, newComponentId: clonedComponent.id };
}

/**
 * Duplicate a component (copy + paste in one action)
 * @param id - Component ID to duplicate
 * @param canvasTree - Current canvas tree
 * @param selectedFileId - Current file ID
 * @param setWithHistory - Function to update tree with history
 * @returns The new component ID, or null if component not found
 */
export function duplicateComponent(
  id: string,
  canvasTree: ComponentNode[],
  selectedFileId: string | null,
  setWithHistory: (tree: ComponentNode[]) => void
): string | null {
  const componentToDuplicate = findNodeById(canvasTree, id);
  if (!componentToDuplicate) {
    console.warn(`✗ Component with id ${id} not found`);
    return null;
  }

  const { updateFileCanvasTree } = useFileSystemStore.getState();

  // Clone with new IDs
  const clonedComponent = cloneComponentWithNewIds(componentToDuplicate);

  // Position it slightly offset
  clonedComponent.x = (componentToDuplicate.x || 0) + 20;
  clonedComponent.y = (componentToDuplicate.y || 0) + 20;
  clonedComponent.parentId = componentToDuplicate.parentId;

  let updatedTree: ComponentNode[];

  if (componentToDuplicate.parentId) {
    // If it has a parent, add it to the parent's children
    updatedTree = addNodeToParent(canvasTree, componentToDuplicate.parentId, clonedComponent);
  } else {
    // If it's top-level, add to root
    updatedTree = [...canvasTree, clonedComponent];
  }

  if (selectedFileId) {
    updateFileCanvasTree(selectedFileId, updatedTree);
  }
  setWithHistory(updatedTree);

  console.log(`✓ Duplicated ${componentToDuplicate.type}`);
  return clonedComponent.id;
}