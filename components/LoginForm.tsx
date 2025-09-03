"use client";

import type React from "react";
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
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Logo } from "./Logo";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIN = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      console.log("Attempting sign in with: ", email);
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log("Sign in response", response);

      if (response?.error) {
        setError(response.error);
        console.log("Sign in error:", response.error);
      } else if (response?.ok) {
        setTimeout(async () => {
          const session = await getSession();
          console.log("Session after Sign In: ", session);

          if (session) {
            router.push("/");
          } else {
            setError("Session creation failed. Please try again.");
          }
        }, 100);
      } else {
        setError("Sign in Failed. Please check your credentials");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted/30">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <Logo />
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <UserPlus className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl text-purple-400 hover:text-purple-500">
                Welcome Back
              </CardTitle>
              <CardDescription>Welcome back to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIN}>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2"></div>
                    <div className="grid gap-2"></div>
                  </div>
                  <div className="grid gap-2"></div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-11"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log in"}
                  </Button>
                </div>
                <div className="mt-6 text-center text-sm">
                  Don&apos;t have an account?
                  <Link
                    href="/auth/signup"
                    className="text-purple-400 hover:text-purple-500 font-medium ml-1"
                  >
                    Sign up{" "}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
