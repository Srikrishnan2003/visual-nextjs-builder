"use client";

import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { exportNextProject } from "@/lib/exportNextProject";
import { dummyPackageJson } from "@/lib/dummyPackageJson";


export default function ExportButton() {
  const { root } = useFileSystemStore();

  const handleExport = async () => {
    const { dependencies, devDependencies } = dummyPackageJson;
    await exportNextProject(root, dependencies, devDependencies);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
    >
      Export Project
    </button>
  );
}