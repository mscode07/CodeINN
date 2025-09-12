"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Heart, Home, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ThankYouPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const id = searchParams.get("checkout_id");
    setCheckoutId(id);
    
    // Trigger confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams, router]);

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles 
                className={`w-4 h-4 text-${['purple', 'violet', 'indigo', 'yellow'][Math.floor(Math.random() * 4)]}-400`} 
              />
            </div>
          ))}
        </div>
      )}

      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl relative z-10">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/50">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Heart className="h-8 w-8 text-red-400 animate-bounce" />
              </div>
            </div>
          </div>
          
          <CardTitle className="text-4xl font-bold text-white mb-2">
            Payment Successful! 🎉
          </CardTitle>
          <CardDescription className="text-xl text-purple-200">
            Thank you for supporting CodeINN!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Success message */}
          <div className="text-center space-y-4">
            <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-6">
              <p className="text-white text-lg font-medium mb-2">
                Your contribution means the world to us! 💖
              </p>
              <p className="text-purple-200 text-base">
                Your support helps us continue building amazing AI-powered tools 
                and keeping CodeINN free for everyone to use.
              </p>
            </div>

            {checkoutId && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-sm text-gray-300 mb-1">Transaction ID:</p>
                <p className="text-xs text-purple-400 font-mono break-all">
                  {checkoutId}
                </p>
              </div>
            )}
          </div>

          {/* Features unlocked message */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-medium">Keep Building</span>
              </div>
              <p className="text-gray-300 text-sm">
                Continue creating amazing websites with our AI-powered tools
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-5 w-5 text-red-400" />
                <span className="text-white font-medium">Community</span>
              </div>
              <p className="text-gray-300 text-sm">
                You&apos;re now part of our amazing supporter community
              </p>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleGoHome}
              className="flex-1 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-medium py-3 transition-all duration-200 transform hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              Continue Building
            </Button>
            
            <Button
              variant="outline"
              className="flex-1 border-purple-400/30 text-purple-400 hover:bg-purple-400/10 py-3 transition-all duration-200"
              asChild
            >
              <Link href="mailto:codeinn@mscodee.com">
                <Heart className="w-4 h-4 mr-2" />
                Share Feedback
              </Link>
            </Button>
          </div>

          {/* Auto redirect notice */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Automatically redirecting to home in{" "}
              <span className="text-purple-400 font-bold">{countdown}</span>{" "}
              seconds...
            </p>
            <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-400 to-violet-500 h-1 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Social proof */}
          <div className="text-center text-gray-400 text-sm">
            <p>
              Join thousands of creators who trust CodeINN to bring their ideas to life ✨
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}