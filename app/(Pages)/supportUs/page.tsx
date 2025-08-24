"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Heart, Mail } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

function CheckoutForm({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false); 

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/create_payment_intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });
        if (!response.ok) throw new Error("Failed to fetch client secret");
        const { clientSecret } = await response.json();
        console.log("Client Secret fetched:", clientSecret); 
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };
    fetchClientSecret();
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      console.log("Stripe, elements, or client secret not available");
      return;
    }
    setIsProcessing(true);
    
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        console.log("Payment Failed", error.message); 
      } else if (paymentIntent?.status === "succeeded") {
        console.log("Payment Succeeded", paymentIntent);
        onSuccess(); 
      }
    } catch (error) {
      console.error("Payment processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  }; 
  
  const handleCardChange = (event: any) => {
    setCardComplete(event.complete); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{
          style: {
            base: {
              color: "#ffffff", 
              fontSize: "16px",
              "::placeholder": {
                color: "#d1d5db",  
              },
            },
            invalid: {
              color: "#ef4444",   
            },
          },
        }}
        onChange={handleCardChange}
        className="p-3 bg-white/10 rounded-lg border border-gray-300 dark:border-gray-600"
      />
      <Button
        type="submit"
        disabled={!stripe || !clientSecret || isProcessing || !cardComplete}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white"
      >
        {isProcessing ? "Processing..." : `Pay $${amount}`}
      </Button>
    </form>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", description: "" });
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const handlePaymentSuccess = () => {
    setPaymentAmount(selectedAmount || 0);
    setShowThankYouDialog(true);
    
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  const handleThankYouClose = () => {
    setShowThankYouDialog(false);
    router.push("/");
  };

  return (
    <ToastProvider>
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
                        onClick={() => setSelectedAmount(amount)} 
                        className={`bg-${amount === 5 ? "green" : amount === 10 ? "blue" : "purple"}-500/10 hover:bg-${amount === 5 ? "green" : amount === 10 ? "blue" : "purple"}-500/20 text-${amount === 5 ? "green" : amount === 10 ? "blue" : "purple"}-400`}
                      >
                        ${amount}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Confirm Support
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Enter your payment details to support ${amount}.
                        </DialogDescription>
                      </DialogHeader>
                      <Elements stripe={stripePromise}>
                        <CheckoutForm amount={amount} onSuccess={handlePaymentSuccess} />
                      </Elements>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Questions? or share your feedback{" "}
                <Link href="mailto:codeinn@mscodee.com" className="text-blue-400 underline">
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
      </div>

      <ToastViewport className="fixed bottom-0 right-0 p-4 flex flex-col gap-2 max-w-xs" />
      <Toast open={openToast} onOpenChange={setOpenToast}>
        <ToastTitle>{toastMessage.title}</ToastTitle>
        <ToastDescription>{toastMessage.description}</ToastDescription>
        <ToastClose />
      </Toast>

      <AlertDialog open={showThankYouDialog} onOpenChange={setShowThankYouDialog}>
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
    </ToastProvider>
  );
}