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
      className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
    >
      Export Project
    </button>
  );
}