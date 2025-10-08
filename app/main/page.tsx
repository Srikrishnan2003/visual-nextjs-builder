"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar";
import CollapsiblePanel from "@/components/CollapsiblePanel";
import ComponentToolbar from "@/components/ComponentToolbar";
import { CustomComponentPanel } from "@/components/CustomComponentPanel";
import Canvas from "@/components/Canvas";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import { FileExplorer } from "@/components/FileExplorer";
import CodeEditor from "@/components/CodeEditor";
import { useCanvasStore } from "@/stores/canvasStore";
import { generateCodeFromTree } from "@/lib/codeGenerator";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { perfMonitor } from "@/lib/performace";

export default function Home() {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [propertiesPanelCollapsed, setPropertiesPanelCollapsed] = useState(false); // New state for Properties Panel
  const [fileExplorerCollapsed, setFileExplorerCollapsed] = useState(false);
  const [codeEditorCollapsed, setCodeEditorCollapsed] = useState(false); // New state for Code Editor

  const { canvasTree } = useCanvasStore();
  const [generatedCode, setGeneratedCode] = useState<string>("");

  useEffect(() => {
    const code = generateCodeFromTree(canvasTree);
    setGeneratedCode(code);
  }, [canvasTree]);

  useKeyboardShortcuts();

  useEffect(() => {
    const interval = setInterval(() => {
      perfMonitor.report();
    }, 30000); // Report every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <Topbar />
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* Left Panel: Component Toolbar + Custom Components */}
          <CollapsiblePanel
            side="left"
            className="border-r border-gray-200 bg-white flex-shrink-0"
            width="w-52"
            collapsed={leftPanelCollapsed}
            setCollapsed={setLeftPanelCollapsed}
          >
            <div className="flex flex-col h-full overflow-y-auto min-h-0">
              <ComponentToolbar />
              <CustomComponentPanel />
            </div>
          </CollapsiblePanel>

          {/* Canvas Center */}
          <div className="flex-1 p-3 bg-gray-50">
            <Canvas />
          </div>

          {/* Right Panels: Properties, File Explorer, Code Editor */}
          {/* Properties Panel */}
          <CollapsiblePanel
            side="right"
            className="border-l border-gray-200 bg-white flex-shrink-0"
            width="w-64" // Adjust width as needed
            collapsed={propertiesPanelCollapsed}
            setCollapsed={setPropertiesPanelCollapsed}
          >
            <PropertiesPanel />
          </CollapsiblePanel>

          {/* File Explorer Panel */}
          <CollapsiblePanel
            side="right" // Collapses from the right
            className="border-l border-gray-200 bg-white overflow-y-auto flex-shrink-0"
            width="w-52" // Adjust width as needed
            collapsed={fileExplorerCollapsed}
            setCollapsed={setFileExplorerCollapsed}
          >
            <FileExplorer />
          </CollapsiblePanel>

          {/* Code Editor Panel */}
          <CollapsiblePanel
            side="right" // Collapses from the right
            className="border-l border-gray-700 bg-gray-900 flex-shrink-0"
            width="w-[35%]" // Adjust width as needed
            collapsed={codeEditorCollapsed}
            setCollapsed={setCodeEditorCollapsed}
          >
            <CodeEditor code={generatedCode} />
          </CollapsiblePanel>

        </div>
      </div>
    </DndProvider>
  );
}
