"use client";
import { parseBoltArtifact } from "@/app/src/store/ParseResponse";
import { usePromptStore } from "@/app/src/store/promptStore";
import { cn } from "@/lib/utils";
import { ArrowRight, Rocket } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const UserInputComp = () => {
  const [promptText, setPromptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [streamingStatus, setStreamingStatus] = useState("");
  const [detectedTech, setDetectedTech] = useState("");

  const examples = [
    "Create a modern portfolio website with dark mode",
    "Build a landing page for a SaaS product with pricing",
    "Design a restaurant website with online menu",
    "Make a blog website with responsive design",
  ];

  const {
    setPrompt,
    setFileStructure,
    setSteps,
    setIsGenerating,
    setStreamedResponse,
    setPanelContent,
  } = usePromptStore();
  const { data: session } = useSession();

  const router = useRouter();

  const handlePromptSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!promptText.trim()) return;

    setIsLoading(true);
    setIsGenerating(true);
    setStreamedResponse("");
    setStreamingStatus("Initializing...");
    setDetectedTech("");

    let accumulatedResponse = "";

    try {
      const response = await fetch("/api/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream");

      setStreamingStatus("Connected - Analyzing your request...");
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const parsedData = JSON.parse(line.slice(6));
            switch (parsedData.type) {
              case "tech":
                setDetectedTech(parsedData.data);
                setStreamingStatus(
                  `Detected: ${parsedData.data} project - Generating code...`
                );
                break;
              case "code":
                accumulatedResponse += parsedData.data;
                setStreamedResponse(accumulatedResponse);
                const fileMatch = accumulatedResponse.match(
                  /<boltAction[^>]*type="file"[^>]*>([\s\S]*?)<\/boltAction>/i
                );
                if (fileMatch) {
                  const fileContent =
                    fileMatch[1]?.replace(/<!\[CDATA\[|\]\]>/g, "") || "";
                  setPanelContent(fileContent.trim());
                }
                setStreamingStatus("Generating code...");
                break;
              case "error":
                console.error("Streaming error:", parsedData.data);
                setStreamingStatus(`Error: ${parsedData.data}`);
                break;
            }
          } else if (line.startsWith("event: end")) {
            setStreamingStatus("Finalizing...");
            const artifactMatch = accumulatedResponse.match(
              /<boltArtifact[^>]*>[\s\S]*<\/boltArtifact>/
            );
            if (artifactMatch) {
              const cleanedArtifactString = artifactMatch[0];
              try {
                const { files, steps } = parseBoltArtifact(
                  cleanedArtifactString
                );
                setPrompt(promptText);
                setFileStructure(files);
                setSteps(steps);
                router.push("/editor", {
                  state: {
                    promptText,
                    code: { generatedCode: accumulatedResponse },
                    detectedTech,
                  },
                });
              } catch (parseError) {
                console.error("Failed to parse bolt artifact:", parseError);
                setStreamingStatus("Error: Failed to process generated code");
              }
            } else {
              console.error("No bolt artifact found in response");
              setStreamingStatus("Error: Invalid response format");
            }
            setIsLoading(false);
            setIsGenerating(false);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error starting stream:", error);
      setStreamingStatus("Failed to start generation. Please try again.");
      setIsLoading(false);
      setIsGenerating(false);
    }
  };
  return (
    <div>
      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <div className="relative">
          <textarea
            className={cn(
              "w-full min-h-32 p-6 text-lg bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300",
              isLoading && "opacity-70"
            )}
            placeholder="✨Describe your dream website... (e.g., 'Create a modern portfolio for a Developer')"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (promptText.trim() && !isLoading) {
                  handlePromptSubmit();
                }
              }
            }}
            disabled={isLoading}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPromptText(example)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex space-x-1 mr-3">
                  <span className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></span>
                  <span
                    className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
                <span className="text-sm text-purple-300">
                  {streamingStatus}
                </span>
              </div>
              {detectedTech && (
                <div className="px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300 border border-purple-500/30">
                  {detectedTech}
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handlePromptSubmit}
          disabled={isLoading || !promptText.trim()}
          className={cn(
            "mt-6 w-full py-4 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center text-lg shadow-2xl",
            isLoading && "animate-pulse"
          )}
        >
          {isLoading ? (
            <>
              <div className="flex items-center">
                <div className="mr-3">🎨 Crafting your website</div>
                <div className="flex space-x-1">
                  <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
                  <span
                    className="h-2 w-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="h-2 w-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </>
          ) : (
            <>
              <Rocket className="mr-3 h-6 w-6" />
              Generate My Website
              <ArrowRight className="ml-3 h-6 w-6" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
