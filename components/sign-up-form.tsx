"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { useAuth } from "@/lib/auth";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  // const { handleGoogleSignIn, handleGithubSignIn } = useAuth();
  // const handleGithubSignIn = async () => {
  //   const { data, error } = await supabase.auth.signInWithOAuth({
  //     provider: "github",
  //   });
  //   if (error) console.log(error.message, "Error while Signing IN");
  //   router.push("/protected");
  // };
  // const handleGoogleSignIn = async () => {
  //   const { data, error } = await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //   });
  //   if (error) console.log(error.message, "Error while Signing IN");
  //   router.push("/protected");
  // };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSignUp");
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) console.log(error.message, "Error while Signing UP");
      setSuccess(true);
      setEmail("");
      setPassword("");
      setRepeatPassword("");
      setTimeout(() => {
        router.push("/auth/sign-up-success");
      }, 3000);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 bg-transparent border border-red-500/20 rounded-2xl",
        className
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating an account..." : "Sign up"}
              </Button>
              {/* {success && (
                <p className="text-sm text-green-500">
                  Account created successfully!
                </p>
              )} */}
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Dialog>
                <DialogTrigger>Sign In</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      <LoginForm />
                    </DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Button
                className="mt-10 px-36 rounded-2xl"
                // onClick={handleGoogleSignIn}
              >
                {" "}
                <FaGoogle /> Sign UP with Google{" "}
              </Button>
              <Button
                className="mt-2 px-36 rounded-2xl font-bold"
                // onClick={handleGithubSignIn}
              >
                {" "}
                <FaGithub /> Sign UP with Github{" "}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
