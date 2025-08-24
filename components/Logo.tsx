import { Code } from "lucide-react";

export const Logo = () => {
  return (
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
          background: "linear-gradient(to right, white, rgb(209, 213, 219))",
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
  );
};
