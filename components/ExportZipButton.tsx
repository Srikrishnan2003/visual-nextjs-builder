"use client";

import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { exportNextProject } from "@/lib/exportNextProject";

export default function ExportButton() {
  const { root } = useFileSystemStore();

  const handleExport = async () => {
    await exportNextProject(root);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Export Project
    </button>
  );
}
