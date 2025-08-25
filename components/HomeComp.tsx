"use client";
import {
  Globe,
  Palette,
  Play
} from "lucide-react";
import { useState } from "react";
// import Link from "next/link";
// import { Button } from "../components/ui/button";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { parseBoltArtifact } from "@/app/src/store/ParseResponse";
// import { AuthButton } from "./auth-button";
import FeaturesComp from "./FeaturesComp";
import FooterComp from "./FooterComp";
import { HeroComp } from "./HeroComp";
import { NavBarComp } from "./NavBarComp";
import { UserInputComp } from "./userInputComp";

export default function HomeComp() {
  // const [promptText, setPromptText] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const [theme, setTheme] = useState("dark");
  // const [streamingStatus, setStreamingStatus] = useState("");
  // const [detectedTech, setDetectedTech] = useState("");

  // const {
  //   setPrompt,
  //   setFileStructure,
  //   setSteps,
  //   setIsGenerating,
  //   setStreamedResponse,
  //   setPanelContent,
  // } = usePromptStore();

  // const toggleTheme = () => {
  //   setTheme(theme === "dark" ? "light" : "dark");
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
