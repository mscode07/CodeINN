"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const checkoutLinks: Record<number, string> = {
  5: process.env.NEXT_PUBLIC_POLAR_CHECKOUT_5!,
  10: process.env.NEXT_PUBLIC_POLAR_CHECKOUT_10!,
  20: process.env.NEXT_PUBLIC_POLAR_CHECKOUT_20!,
};

export default function SupportPage() {
  const router = useRouter();
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const handleCheckout = (amount: number) => {
    setPaymentAmount(amount);

    window.open(checkoutLinks[amount], "_blank", "noopener,noreferrer");
  };

  const handleThankYouClose = () => {
    setShowThankYouDialog(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Zap className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Support CodeINN
          </CardTitle>
          <CardDescription className="text-gray-300">
            Help us keep the AI magic alive!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-400 leading-relaxed text-center">
            CodeINN is powered by advanced AI to transform your ideas into
            stunning websites. Maintaining and improving this technology
            requires resources. Your support helps us continue delivering
            innovative tools and features. Thank you for considering a
            contribution!
          </p>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white text-center">
              Suggested Support Amounts
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[5, 10, 20].map((amount) => (
                <Dialog key={amount}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => handleCheckout(amount)}
                      className={`bg-${
                        amount === 5
                          ? "green"
                          : amount === 10
                          ? "blue"
                          : "purple"
                      }-500/10 hover:bg-${
                        amount === 5
                          ? "green"
                          : amount === 10
                          ? "blue"
                          : "purple"
                      }-500/20 text-${
                        amount === 5
                          ? "green"
                          : amount === 10
                          ? "blue"
                          : "purple"
                      }-400`}
                    >
                      ${amount}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-white">
                        Redirecting...
                      </DialogTitle>
                      <DialogDescription className="text-gray-300">
                        You’ll be redirected to Polar checkout to complete your
                        ${amount} support.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Questions? or share your feedback{" "}
              <Link
                href="mailto:codeinn@mscodee.com"
                className="text-blue-400 underline"
              >
                Contact US
              </Link>
            </p>
            <Button
              variant="link"
              className="mt-4 text-gray-300 hover:text-white"
              asChild
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={showThankYouDialog}
        onOpenChange={setShowThankYouDialog}
      >
        <AlertDialogContent className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/20">
          <AlertDialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-400 animate-pulse" />
              </div>
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-white">
              Thank You! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 text-lg mt-2">
              Your ${paymentAmount} donation means the world to us!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-center text-gray-400 mb-4">
              Your support helps us continue building amazing AI-powered tools.
              We truly appreciate your generosity!
            </p>
            <div className="text-center text-sm text-gray-500">
              Redirecting to home in 3 seconds...
            </div>
          </div>
          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction
              onClick={handleThankYouClose}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8"
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
