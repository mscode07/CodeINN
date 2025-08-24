import { Code, ArrowLeft, Github, Save } from "lucide-react";
import { ThemeToggle } from "@/components/ToggleComp";
import { useRouter } from "next/navigation";
import { usePromptStore, type FileNode } from "@/app/src/store/promptStore";
import JSZip from "jszip";

interface HeaderProps {
  projectName: string;
  previewVisible: boolean;
  togglePreview: () => void;
}

export default function Header({
  projectName,
  previewVisible,
  togglePreview,
}: HeaderProps) {
  const router = useRouter();
  const { fileStructure, streamedResponse } = usePromptStore();
  console.log("This is the file structure", fileStructure);

  const handleExport = async () => {
    console.log("Exporting");
    const zip = new JSZip();

    const addFilesToZip = (node: FileNode, path = "") => {
      if (node.type === "file") {
        zip.file(path + node.name, node.content);
      } else if (node.type === "folder" && node.children) {
        const folder = zip.folder(path + node.name);
        if (folder) {
          Object.entries(node.children).forEach(([childName, childNode]) => {
            addFilesToZip(childNode, path + node.name + "/");
          });
        }
      }
    };

    if (fileStructure && fileStructure.length > 0) {
      fileStructure.forEach((node) => {
        addFilesToZip(node);
      });
    } else if (streamedResponse) {
      zip.file("generated-code.txt", streamedResponse);
    } else {
      alert("No code to export. Please generate code first.");
      return;
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName || "code-export"}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <header className="h-12 dark:bg-dark-100 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between select-none">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-500 transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">Home</span>
        </button>

        <div className="flex items-center">
          <Code className="h-5 w-5 text-primary-600 mr-2" />
          <span
            className="font-medium truncate max-w-[200px]"
            title={projectName}
          >
            {projectName}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-10 mr-8">
        <button
          onClick={handleExport}
          className="btn btn-outline px-3 py-1 text-sm h-8"
        >
          <Save className="h-3.5 w-3.5 mr-1" />
          Export
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
