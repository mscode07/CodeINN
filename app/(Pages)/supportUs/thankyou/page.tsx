import { Suspense } from "react";
import ThankYouPage from "./ThankYouPage";

//export const dynamic = 'force-dynamic'


function ThankYouLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
    </div>
  );
}

export default function ThankYouPageWrapper() {
  return (
    <Suspense fallback={<ThankYouLoading />}>
      <ThankYouPage />
    </Suspense>
  );
}

export const metadata = {
  title: "Thank You - CodeINN",
  description: "Thank you for supporting CodeINN! Your contribution helps us continue building amazing AI-powered tools.",
};