import { cn } from "@/lib/utils";
import { Brain, Terminal, Zap } from "lucide-react";

export default function FeaturesComp() {
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
  return (
    <div>
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
    </div>
  );
}
