
import { useState } from "react";
import { createClient } from "./supabase/server";

export function useAuth() {
  const supabase = createClient();
  process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const clearError = () => setError(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      const { error } = await (
        await supabase
      ).auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      console.log("✅ User logged in:", email);
    } catch (error: any) {
      console.error("❌ Error logging in:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    clearError();
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await (
        await supabase
      ).auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) setError(error.message);
      console.log("✅ User signed up:", email);
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    try {
      (await supabase).auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing in with Google:", error);
    }
  };
  const handleGithubSignIn = async () => {
    clearError();
    try {
      (await supabase).auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing in with Google:", error);
    }
  };

  const signOut = async () => {
    try {
      await (await supabase).auth.signOut();
      setSession(null);
      setIsLoggedIn(false);
      setEmail("");
      setPassword("");
      window.localStorage.removeItem("supabase.auth.token");
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing out:", error);
    }
  };

  return {
    session,
    email,
    password,
    isLoggedIn,
    isLoading,
    error,
    handleLogin,
    handleSignUp,
    handleGoogleSignIn,
    handleGithubSignIn,
    clearError,
    signOut,
  };
}
