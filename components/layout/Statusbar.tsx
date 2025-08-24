import { FileNode } from "@/app/src/store/promptStore";

interface Step {
  id: number;
  title: string;
  status: "pending" | "in-progress" | "completed";
}

interface StatusbarProps {
  activeFile: FileNode | null;
  currentStep: Step | null;
}

export default function Statusbar({ activeFile, currentStep }: StatusbarProps) {
  return (
    <div className="h-6  dark:bg-dark-100 border-t border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center space-x-4">
        {activeFile && (
          <div className="flex items-center space-x-1">
            <span className="font-medium">File:</span>
            <span>{activeFile.path}</span>
          </div>
        )}

        {currentStep && (
          <div className="flex items-center space-x-1">
            <span className="font-medium">Step:</span>
            <span>{currentStep.title}</span>
            <span
              className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] leading-none"
              style={{
                backgroundColor:
                  currentStep.status === "completed"
                    ? "rgba(34, 197, 94, 0.2)"
                    : currentStep.status === "in-progress"
                    ? "rgba(59, 130, 246, 0.2)"
                    : "rgba(100, 116, 139, 0.2)",
                color:
                  currentStep.status === "completed"
                    ? "rgb(22, 163, 74)"
                    : currentStep.status === "in-progress"
                    ? "rgb(37, 99, 235)"
                    : "rgb(71, 85, 105)",
              }}
            >
              {currentStep.status}
            </span>
          </div>
        )}
      </div>

      <div>WebCraft v0.1.0</div>
    </div>
  );
}
