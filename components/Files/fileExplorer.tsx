"use client";
import { Plus, FileText } from "lucide-react";
import { FileNode, usePromptStore } from "@/app/src/store/promptStore";

interface FileExplorerProps {
  files: FileNode[];
  activeFileId?: string;
}

export default function FileExplorer({
  files,
  activeFileId,
}: FileExplorerProps) {
  const { openFile } = usePromptStore();

  const renderFileTree = (nodes: FileNode[]) => {
    return nodes.map((node) => (
      <div key={node.id} className="ml-4">
        {node.type === "folder" ? (
          <div className="flex items-center">
            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">
              {node.name}
            </span>
            {node.children && renderFileTree(node.children)}
          </div>
        ) : (
          <div
            className={`cursor-pointer p-1 ${
              node.id === activeFileId
                ? "bg-gray-600 dark:bg-dark-100 "
                : "text-gray-800 dark:text-gray-400"
            } flex items-center gap-2`}
            onClick={() => openFile(node)}
          >
            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">
              {node.name}
            </span>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="w-60 dark:bg-dark-300 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="h-9 px-4 flex items-center justify-between dark:bg-dark-200 border-b border-gray-200 dark:border-gray-800">
        <span className="text-sm font-medium">Explorer</span>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {files.length > 0 ? (
          <div className="py-2 dark:bg-dark-100">{renderFileTree(files)}</div>
        ) : (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center italic">
            No files yet
          </div>
        )}
      </div>
    </div>
  );
}
