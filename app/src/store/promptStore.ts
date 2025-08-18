import { create } from "zustand";

interface Prompt {
  text: string;
  timestamp: Date;
}

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content: string;
  language?: string;
  children?: FileNode[];
  path: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  code?: string;
}

interface PromptState {
  prompt: Prompt | null;
  fileStructure: FileNode[];
  // currentFile: FileNode | null;
  steps: Step[];
  openFiles: FileNode[];
  activeFile: FileNode | null;
  currentStepId: number | null;
  isGenerating: boolean;
  streamedResponse: string | null;
  panelContent: string | null;

  setPanelContent: (content: string | null) => void;
  setStreamedResponse: (response: string | null) => void;

  setPrompt: (text: string) => void;
  setFileStructure: (files: FileNode[]) => void;
  // setCurrentFile: (file: FileNode | null) => void;
  setSteps: (steps: Step[]) => void;
  setCurrentStepId: (id: number | null) => void;
  updateFileContent: (id: string, content: string) => void;
  addFile: (parentPath: string, file: Omit<FileNode, "id">) => void;
  deleteFile: (id: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  completeStep: (id: number) => void;
  openFile: (file: FileNode) => void;
  setActiveFile: (file: FileNode | null) => void;
  closeFile: (fileId: string) => void;
  reset: () => void;
}

const FileStructure: FileNode[] = [];

const Steps: Step[] = [];

export const usePromptStore = create<PromptState>((set) => ({
  prompt: null,
  fileStructure: FileStructure,
  // currentFile: null,
  steps: Steps,
  openFiles: [],
  activeFile: null,
  currentStepId: 2,
  isGenerating: false,
  streamedResponse: null,
  panelContent: null,

  setPrompt: (text: string) =>
    set({
      prompt: { text, timestamp: new Date() },
      isGenerating: true,
    }),

  setFileStructure: (files: FileNode[]) => set({ fileStructure: files }),

  // setCurrentFile: (file: FileNode | null) => set({ currentFile: file }),

  setSteps: (steps: Step[]) => set({ steps }),

  openFile: (file) => {
    set((state) => {
      const isAlreadyOpen = state.openFiles.some((f) => f.id === file.id);
      return {
        openFiles: isAlreadyOpen ? state.openFiles : [...state.openFiles, file],
        activeFile: file,
      };
    });
  },
  setActiveFile: (file) => set({ activeFile: file }),
  closeFile: (fileId) => {
    set((state) => {
      const newOpenFiles = state.openFiles.filter((f) => f.id !== fileId);
      let newActiveFile = state.activeFile;
      if (state.activeFile?.id === fileId) {
        // If closing the active file, set activeFile to the last open file or null
        newActiveFile =
          newOpenFiles.length > 0
            ? newOpenFiles[newOpenFiles.length - 1]
            : null;
      }
      return {
        openFiles: newOpenFiles,
        activeFile: newActiveFile,
      };
    });
  },
  setCurrentStepId: (id: number | null) => set({ currentStepId: id }),

  updateFileContent: (fileId, content) => {
    const updateFile = (nodes: FileNode[]): FileNode[] =>
      nodes.map((node) => {
        if (node.id === fileId) {
          return { ...node, content };
        }
        if (node.children) {
          return { ...node, children: updateFile(node.children) };
        }
        return node;
      });

    set((state) => ({
      fileStructure: updateFile(state.fileStructure),
      openFiles: state.openFiles.map((file) =>
        file.id === fileId ? { ...file, content } : file
      ),
      activeFile:
        state.activeFile?.id === fileId
          ? { ...state.activeFile, content }
          : state.activeFile,
    }));
  },

  addFile: (parentPath: string, newFile: Omit<FileNode, "id">) =>
    set((state) => {
      const fileId = Math.random().toString(36).substring(2, 9);
      const newNode: FileNode = { ...newFile, id: fileId };

      // If adding to root
      if (parentPath === "/") {
        return { fileStructure: [...state.fileStructure, newNode] };
      }

      const addToFolder = (files: FileNode[]): FileNode[] => {
        return files.map((file) => {
          if (file.type === "folder" && file.path === parentPath) {
            return {
              ...file,
              children: [...(file.children || []), newNode],
            };
          }
          if (file.children) {
            return { ...file, children: addToFolder(file.children) };
          }
          return file;
        });
      };

      return { fileStructure: addToFolder(state.fileStructure) };
    }),

  deleteFile: (id: string) =>
    set((state) => {
      // Helper to recursively remove a file
      const removeFile = (files: FileNode[]): FileNode[] => {
        return files.filter((file) => {
          if (file.id === id) return false;
          if (file.children) {
            return { ...file, children: removeFile(file.children) };
          }
          return true;
        });
      };

      return {
        fileStructure: removeFile(state.fileStructure),
        currentFile: state.activeFile?.id === id ? null : state.activeFile,
      };
    }),

  setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
  setStreamedResponse: (streamedResponse) => set({ streamedResponse }),
  setPanelContent: (panelContent) => set({ panelContent }),

  completeStep: (id: number) =>
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === id ? { ...step, status: "completed" } : step
      ),
      currentStepId:
        id < Math.max(...state.steps.map((s) => s.id)) ? id + 1 : id,
    })),

  reset: () =>
    set({
      prompt: null,
      activeFile: null,
      currentStepId: null,
      isGenerating: false,
    }),
}));
