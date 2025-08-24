"use client";
import { useState } from "react";
import {
  Code,
  Sparkles,
  Moon,
  Sun,
  Zap,
  Rocket,
  Brain,
  ArrowRight,
  Play,
  Globe,
  Palette,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { parseBoltArtifact } from "@/app/src/store/ParseResponse";
import { usePromptStore } from "@/app/src/store/promptStore";
import { AuthButton } from "./auth-button";
import FeaturesComp from "./FeaturesComp";
import FooterComp from "./FooterComp";
import { NavBarComp } from "./NavBarComp";
import { HeroComp } from "./HeroComp";
import { UserInputComp } from "./userInputComp";

export default function HomeComp() {
  const [promptText, setPromptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [streamingStatus, setStreamingStatus] = useState("");
  const [detectedTech, setDetectedTech] = useState("");

  const {
    setPrompt,
    setFileStructure,
    setSteps,
    setIsGenerating,
    setStreamedResponse,
    setPanelContent,
  } = usePromptStore();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const { data: session } = useSession();

  const router = useRouter();

  // const handlePromptSubmit = async (e?: React.FormEvent) => {
  //   if (e) e.preventDefault();

  //   if (!promptText.trim()) return;

  //   setIsLoading(true);
  //   setIsGenerating(true);
  //   setStreamedResponse("");
  //   setStreamingStatus("Initializing...");
  //   setDetectedTech("");

  //   let accumulatedResponse = "";

  //   try {
  //     const response = await fetch("/api/template", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ prompt: promptText }),
  //     });

  //     if (!response.ok)
  //       throw new Error(`HTTP error! status: ${response.status}`);

  //     const reader = response.body?.getReader();
  //     if (!reader) throw new Error("No readable stream");

  //     setStreamingStatus("Connected - Analyzing your request...");
  //     const decoder = new TextDecoder();

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;
  //       const chunk = decoder.decode(value);
  //       const lines = chunk.split("\n");
  //       for (const line of lines) {
  //         if (line.startsWith("data: ")) {
  //           const parsedData = JSON.parse(line.slice(6));
  //           switch (parsedData.type) {
  //             case "tech":
  //               setDetectedTech(parsedData.data);
  //               setStreamingStatus(
  //                 `Detected: ${parsedData.data} project - Generating code...`
  //               );
  //               break;
  //             case "code":
  //               accumulatedResponse += parsedData.data;
  //               setStreamedResponse(accumulatedResponse);
  //               const fileMatch = accumulatedResponse.match(
  //                 /<boltAction[^>]*type="file"[^>]*>([\s\S]*?)<\/boltAction>/i
  //               );
  //               if (fileMatch) {
  //                 const fileContent =
  //                   fileMatch[1]?.replace(/<!\[CDATA\[|\]\]>/g, "") || "";
  //                 setPanelContent(fileContent.trim());
  //               }
  //               setStreamingStatus("Generating code...");
  //               break;
  //             case "error":
  //               console.error("Streaming error:", parsedData.data);
  //               setStreamingStatus(`Error: ${parsedData.data}`);
  //               break;
  //           }
  //         } else if (line.startsWith("event: end")) {
  //           setStreamingStatus("Finalizing...");
  //           const artifactMatch = accumulatedResponse.match(
  //             /<boltArtifact[^>]*>[\s\S]*<\/boltArtifact>/
  //           );
  //           if (artifactMatch) {
  //             const cleanedArtifactString = artifactMatch[0];
  //             try {
  //               const { files, steps } = parseBoltArtifact(
  //                 cleanedArtifactString
  //               );
  //               setPrompt(promptText);
  //               setFileStructure(files);
  //               setSteps(steps);
  //               router.push("/editor", {
  //                 state: {
  //                   promptText,
  //                   code: { generatedCode: accumulatedResponse },
  //                   detectedTech,
  //                 },
  //               });
  //             } catch (parseError) {
  //               console.error("Failed to parse bolt artifact:", parseError);
  //               setStreamingStatus("Error: Failed to process generated code");
  //             }
  //           } else {
  //             console.error("No bolt artifact found in response");
  //             setStreamingStatus("Error: Invalid response format");
  //           }
  //           setIsLoading(false);
  //           setIsGenerating(false);
  //           break;
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error starting stream:", error);
  //     setStreamingStatus("Failed to start generation. Please try again.");
  //     setIsLoading(false);
  //     setIsGenerating(false);
  //   }
  // };

  // // const features = [
  // //   {
  // //     title: "AI-Powered Magic",
  // //     description:
  // //       "Advanced AI that understands your vision and transforms ideas into production-ready code instantly",
  // //     icon: <Brain className="h-7 w-7" />,
  // //     gradient: "from-purple-500 to-pink-500",
  // //   },
  // //   {
  // //     title: "Lightning Fast",
  // //     description:
  // //       "Generate complete websites in seconds, not hours. Experience the future of web development",
  // //     icon: <Zap className="h-7 w-7" />,
  // //     gradient: "from-yellow-500 to-orange-500",
  // //   },
  // //   {
  // //     title: "Pro Code Editor",
  // //     description:
  // //       "Built-in professional editor with syntax highlighting, auto-completion, and real-time preview",
  // //     icon: <Terminal className="h-7 w-7" />,
  // //     gradient: "from-green-500 to-emerald-500",
  // //   },
  // // ];

  // const examples = [
  //   "Create a modern portfolio website with dark mode",
  //   "Build a landing page for a SaaS product with pricing",
  //   "Design a restaurant website with online menu",
  //   "Make a blog website with responsive design",
  // ];

  // const cn = (...classes: any) => {
  //   return classes.filter(Boolean).join(" ");
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-32 left-10 text-green-400 font-mono text-sm opacity-30"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          &lt;div className="hero"&gt;
        </div>
        <div
          className="absolute top-64 right-16 text-blue-400 font-mono text-sm opacity-30"
          style={{
            animation: "float 3s ease-in-out infinite",
            animationDelay: "1s",
          }}
        >
          const magic = true;
        </div>
        <div
          className="absolute bottom-40 left-20 text-purple-400 font-mono text-sm opacity-30"
          style={{
            animation: "float 3s ease-in-out infinite",
            animationDelay: "2s",
          }}
        >
          export default App;
        </div>
      </div>

      <NavBarComp />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-6xl w-full space-y-12 text-center">
          <HeroComp />
          <div
            className="mt-16 max-w-4xl mx-auto"
            style={{ animation: "slideUp 0.8s ease-out 0.2s both" }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-pink-800 rounded-2xl blur opacity-75 animate-pulse"></div>
            </div>
          </div>
          <UserInputComp />
          <FeaturesComp />

          <div
            className="mt-20 text-center"
            style={{ animation: "fadeIn 1s ease-out 0.6s both" }}
          >
            <p className="text-gray-400 mb-4">
              Join thousands of creators who've already built amazing websites
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-green-400" />
                <span>10k+ websites created</span>
              </div>
              <div className="flex items-center">
                <Palette className="h-4 w-4 mr-2 text-purple-400" />
                <span>100+ templates</span>
              </div>
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2 text-blue-400" />
                <span>Ready in 30 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-20">
        <FooterComp />
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
