"use client";
import { usePromptStore } from "@/app/src/store/promptStore";
import { useEffect } from "react";

function EditorHydrator({
  data,
  children,
}: {
  data: { prompt?: string; response?: string };
  children: React.ReactNode;
}) {
  const setPrompt = usePromptStore((s) => s.setPrompt);
  const setFileStructure = usePromptStore((s) => s.setFileStructure);

  useEffect(() => {
    if (data.prompt) setPrompt(data.prompt);
    if (data.response) {
      try {
        const parsed = JSON.parse(data.response);
        setFileStructure(parsed.fileStructure || []);
      } catch {
        console.warn("Response is not JSON, skipping file hydration");
      }
    }
  }, [data, setPrompt, setFileStructure]);

  return <>{children}</>;
}
export default EditorHydrator;
