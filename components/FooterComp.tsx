import { Code } from "lucide-react";

export default function FooterComp() {
  return (
    <footer className="relative z-10 py-8 px-6 border-t border-white/10 backdrop-blur-sm text-center">
      <div className="flex justify-center items-center space-x-2 mb-4">
        <Code className="h-5 w-5 text-purple-400" />
        <span
          className="text-lg font-semibold"
          style={{
            background: "linear-gradient(to right, white, rgb(209, 213, 219))",
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
  );
}
