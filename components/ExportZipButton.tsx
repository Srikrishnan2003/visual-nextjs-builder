"use client";

import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { exportNextProject } from "@/lib/exportNextProject";
import { dummyPackageJson } from "@/lib/dummyPackageJson";
import { Download } from "lucide-react";
import { Button } from "./ui/button";


export default function ExportZipButton() {
  const { root } = useFileSystemStore();

  const handleExport = async () => {
    const { dependencies, devDependencies } = dummyPackageJson;
    await exportNextProject(root, dependencies, devDependencies);
  };

  return (
    <Button
      onClick={handleExport}
      className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
    >
      <Download className="mr-2 h-5 w-5" />
      Export Project
    </Button>
  );
}