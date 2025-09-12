"use client";
import ComponentToolbar from "@/components/ComponentToolbar";
import Canvas from "@/components/Canvas";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CodeEditor from "@/components/CodeEditor";
import { PropertiesPanel } from "@/components/PropertiesPanel";
import Topbar from "@/components/Topbar";
import { FileExplorer } from "@/components/FileExplorer";
import { CustomComponentPanel } from "@/components/CustomComponentPanel";
import CollapsiblePanel from "@/components/CollapsiblePanel";

export default function Home() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar (Left Panel) */}
          <CollapsiblePanel side="left" className="border-r bg-muted" width="w-60">
            <div className="flex flex-col h-full overflow-y-auto">
              <ComponentToolbar />
              <CustomComponentPanel />
            </div>
          </CollapsiblePanel>

          {/* Canvas Center */}
          <div className="flex-1 p-4 bg-gray-100">
            <Canvas />
          </div>

          {/* Right Side Panel */}
          <div className="w-96 border-l p-4 bg-white">
            <PropertiesPanel />
          </div>

          {/* File Explorer + Code Editor */}
          <div className="w-[40%] border-l flex">
            <CollapsiblePanel side="left" width="w-60" className="border-r bg-gray-50 overflow-y-auto">
              <FileExplorer />
            </CollapsiblePanel>

            <CollapsiblePanel side="right" width="w-full" className="flex-1">
              <CodeEditor />
            </CollapsiblePanel>
          </div>

        </div>
      </div>
    </DndProvider>
  );
}