import { usePromptStore } from "@/app/src/store/promptStore";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, CircleDot } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
}

interface StepsSidebarProps {
  steps: Step[];
  currentStepId: number | null;
  isLoading: boolean;
}

export default function StepsSidebar({
  steps,
  currentStepId,
  isLoading,
}: StepsSidebarProps) {
  const { setCurrentStepId, completeStep } = usePromptStore();

  const handleStepClick = (step: Step) => {
    if (step.status !== "pending") {
      setCurrentStepId(step.id);
    }
  };

  return (
    <div className="w-72 dark:bg-dark-300 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="h-9 px-4 flex items-center dark:bg-dark-200 border-b dark:border-gray-800">
        <span className="text-sm font-medium">Steps</span>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Processing your request...
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-1">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "relative pl-8 pr-4 py-3 rounded-md cursor-pointer transition-colors",
                  step.status === "pending"
                    ? "opacity-50 cursor-not-allowed"
                    : "",
                  step.id === currentStepId
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                    : "hover:bg-gray-500 dark:hover:bg-dark-100"
                )}
                onClick={() => handleStepClick(step)}
              >
                <div className="absolute left-2 top-3">
                  {step.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-success-500" />
                  ) : step.status === "in-progress" ? (
                    <CircleDot className="h-4 w-4 text-primary-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium">{step.title}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {step.description}
                  </span>
                </div>

                {step.status === "in-progress" && (
                  <button
                    className="mt-2 text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      completeStep(step.id);
                    }}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
