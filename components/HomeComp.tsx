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
import { AuthButton } from "@/components/auth-button";
// import { AuthButton } from "@/components/auth-button";
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
import { Input } from "@/components/ui/input";
import { SignUpForm } from "@/components/sign-up-form";
import { usePromptStore } from "@/app/src/store/promptStore";
import { parseBoltArtifact } from "@/app/src/store/ParseResponse";

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

  const features = [
    {
      title: "AI-Powered Magic",
      description:
        "Advanced AI that understands your vision and transforms ideas into production-ready code instantly",
      icon: <Brain className="h-7 w-7" />,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Lightning Fast",
      description:
        "Generate complete websites in seconds, not hours. Experience the future of web development",
      icon: <Zap className="h-7 w-7" />,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Pro Code Editor",
      description:
        "Built-in professional editor with syntax highlighting, auto-completion, and real-time preview",
      icon: <Terminal className="h-7 w-7" />,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const examples = [
    "Create a modern portfolio website with dark mode",
    "Build a landing page for a SaaS product with pricing",
    "Design a restaurant website with online menu",
    "Make a blog website with responsive design",
  ];

  const cn = (...classes: any) => {
    return classes.filter(Boolean).join(" ");
  };

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

      <header className="relative z-10 w-full py-6 px-6 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Code
              className="h-8 w-8"
              style={{
                background:
                  "linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur opacity-75 animate-pulse"></div>
          </div>
          <span
            className="text-2xl font-bold cursor-pointer"
            style={{
              background:
                "linear-gradient(to right, white, rgb(209, 213, 219))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            codeINN
          </span>
          <div className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-purple-300 border border-purple-500/30">
            AI-Powered
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <ThemeSwitcher />
          <div className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-purple-300 border border-purple-500/30">
            <Dialog>
              <DialogTrigger className="text-black bg-white px-4 py-2 rounded-full">
                {session?.user ? "Profile" : "Get Started"}
              </DialogTrigger>
              <DialogContent className="flex items-center justify-center h-max w-max">
                <DialogHeader>
                  <DialogTitle>
                    <SignUpForm />
                  </DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-6xl w-full space-y-12 text-center">
          <div
            className="space-y-8"
            style={{ animation: "slideUp 0.8s ease-out" }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-purple-300 border border-purple-500/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                Powered by Advanced AI
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Transform Ideas Into
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153), rgb(251, 191, 36))",
                  backgroundSize: "300% 300%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gradient 3s ease infinite",
                }}
              >
                Stunning Websites
              </span>
            </h1>

            <p className="mt-6 text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Skip the complexity, embrace the magic. Describe your vision in
              plain English and watch our AI craft pixel-perfect, responsive
              websites in seconds.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm cursor-pointer">
                  No coding required
                </span>
              </div>
              <div className="flex items-center text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm cursor-pointer">
                  Instant deployment
                </span>
              </div>
              <div className="flex items-center text-purple-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm cursor-pointer">
                  Professional results
                </span>
              </div>
            </div>
          </div>

          <div
            className="mt-16 max-w-4xl mx-auto"
            style={{ animation: "slideUp 0.8s ease-out 0.2s both" }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-pink-800 rounded-2xl blur opacity-75 animate-pulse"></div>
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
          </div>

          <div
            className="mt-20 grid gap-8 sm:grid-cols-3"
            style={{ animation: "fadeIn 1s ease-out 0.4s both" }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div
                    className={cn(
                      "flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r text-white mb-6 mx-auto shadow-lg",
                      `bg-gradient-to-r ${feature.gradient}`
                    )}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

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

      <footer className="relative z-10 py-8 px-6 border-t border-white/10 backdrop-blur-sm text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <Code className="h-5 w-5 text-purple-400" />
          <span
            className="text-lg font-semibold"
            style={{
              background:
                "linear-gradient(to right, white, rgb(209, 213, 219))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CodeINN
          </span>
        </div>
        <p className="text-gray-400 text-sm">
          © 2025 codeINN. Crafting the future of web development with AI.
        </p>
      </footer>

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
