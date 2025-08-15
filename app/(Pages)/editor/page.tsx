"use client";

import { usePromptStore } from "@/app/src/store/promptStore";
import Editor from "@/components/Editor/Editor";
import FileExplorer from "@/components/Files/fileExplorer";
import Header from "@/components/layout/Header";
import StepsSidebar from "@/components/steps/StepsSidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Statusbar from "@/components/layout/Statusbar";
import { ThemeToggle } from "@/components/ToggleComp";

export default function page() {
  const {
    prompt,
    openFiles,
    activeFile,
    openFile,
    fileStructure,
    steps,
    currentStepId,
    isGenerating,
  } = usePromptStore();

  const router = useRouter();

  const [previewVisible, setPreviewVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  console.log("This is the system theme", theme);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!prompt) {
      router.push("/");
    }
  }, [prompt, router]);

  useEffect(() => {
    if (!openFiles.length && fileStructure.length > 0) {
      const findFirstFile = (
        nodes: typeof fileStructure
      ): typeof activeFile => {
        for (const node of nodes) {
          if (node.type === "file") {
            return node;
          } else if (node.children?.length) {
            const file = findFirstFile(node.children);
            if (file) return file;
          }
        }
        return null;
      };

      const firstFile = findFirstFile(fileStructure);
      if (firstFile) {
        openFile(firstFile);
      }
    }
  }, [fileStructure, openFiles, openFile]);

  const currentStep =
    steps.find((step) => step.id === currentStepId) || steps[0];
  if (!mounted) {
    return (
      <div className="h-screen flex flex-col dark:bg-dark-200">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen flex flex-col dark:bg-dark-200 text-gray-900 dark:text-gray-100">
      <div className="h-screen flex flex-col dark:bg-dark-200 text-gray-900 dark:text-gray-100">
        <Header
          projectName={"Untitled Project"}
          previewVisible={previewVisible}
          togglePreview={() => setPreviewVisible(!previewVisible)}
        />

        <div className="flex-1 flex overflow-hidden">
          <StepsSidebar
            steps={steps}
            currentStepId={currentStepId}
            isLoading={isGenerating}
          />

          <div className="flex-1 flex overflow-hidden">
            <FileExplorer files={fileStructure} activeFileId={activeFile?.id} />

            <div className="flex-1 flex flex-col overflow-hidden relative">
              {activeFile ? (
                <Editor
                  openFiles={openFiles}
                  activeFile={activeFile}
                  theme={theme}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-300">
                  {fileStructure.length > 0 ? (
                    <p>Select a file to edit</p>
                  ) : (
                    <p>No files available yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <Statusbar activeFile={activeFile} currentStep={currentStep} />
        {/* <ThemeToggle /> */}
      </div>
    </div>
  );
}
