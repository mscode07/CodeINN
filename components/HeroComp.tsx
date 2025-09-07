import { Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

export const HeroComp = () => {
  const { data: session, status } = useSession();
  console.log("Welcome User:", session?.user?.email || "Guest");
  return (
    <div>
      {status === "authenticated" ? (
        <div>
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
                Welcome,
              </span>

              {session.user?.name || "Guest"}
            </h1>

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
        </div>
      ) : status === "unauthenticated" ? (
        <div>
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
        </div>
      ) : (
        status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-6 py-16">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-spin"></div>
            </div>
            <p className="text-lg sm:text-xl text-gray-300 animate-pulse">
              Loading your experience...
            </p>
          </div>
        )
      )}
    </div>
  );
};
