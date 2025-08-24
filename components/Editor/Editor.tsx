"use client";

import { useEffect, useState } from "react";
import { FileNode, usePromptStore } from "@/app/src/store/promptStore";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import MonacoEditor from "@monaco-editor/react";

interface EditorProps {
  openFiles: FileNode[];
  activeFile: FileNode | null;
  theme: string | undefined;
}

export default function Editor({ openFiles, activeFile, theme }: EditorProps) {
  const { updateFileContent, setActiveFile, closeFile } = usePromptStore();
  const [value, setValue] = useState(activeFile?.content || "");

  useEffect(() => {
    setValue(activeFile?.content || "");
  }, [activeFile]);

  const getLanguage = (file: FileNode) => {
    if (file.language) return file.language;

    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    switch (extension) {
      case "js":
        return "javascript";
      case "jsx":
        return "javascript";
      case "ts":
        return "typescript";
      case "tsx":
        return "typescript";
      case "html":
        return "html";
      case "css":
        return "css";
      case "json":
        return "json";
      case "md":
        return "markdown";
      default:
        return "plaintext";
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || "";
    setValue(newValue);

    if (activeFile) {
      const timeoutId = setTimeout(() => {
        updateFileContent(activeFile.id, newValue);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  };
  const getMonacoTheme = (themeValue: string | undefined) => {
    if (themeValue === "dark") return "vs-dark";
    if (themeValue === "light") return "light";
    return "light";
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="h-9 dark:bg-dark-100 border-b border-gray-200 dark:border-gray-800 flex items-center overflow-x-auto">
        {openFiles.length === 0 ? (
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
            No files open
          </span>
        ) : (
          openFiles.map((file) => (
            <div
              key={file.id}
              className={cn(
                "flex items-center px-4 h-full text-sm font-medium cursor-pointer border-r dark:border-gray-800",
                file.id === activeFile?.id
                  ? "dark:bg-dark-200 text-gray-900 dark:text-gray-100"
                  : "bg-gray-500 dark:bg-dark-100 text-gray-200 dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-dark-50"
              )}
              onClick={() => setActiveFile(file)}
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.id);
                }}
                className="ml-2 p-1 rounded-full hover:bg-gray-300 dark:hover:bg-dark-300 transition-colors"
                aria-label={`Close ${file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeFile ? (
          <MonacoEditor
            height="100%"
            language={getLanguage(activeFile)}
            value={value}
            theme={getMonacoTheme(theme)}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: "on",
              lineNumbers: "on",
              automaticLayout: true,
              padding: { top: 10 },
              scrollbar: {
                useShadows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>No file selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
