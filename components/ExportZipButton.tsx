"use client";

import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { downloadProjectAsZip } from "@/lib/downloadZip";

export default function ExportZipButton() {
    const { root } = useFileSystemStore();

    const handleDownload = () => {
        downloadProjectAsZip(root);
    };

    return (
        <button
            onClick={handleDownload}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
            Export Project as ZIP
        </button>
    )
}