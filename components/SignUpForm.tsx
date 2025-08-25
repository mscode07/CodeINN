"use client";

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
import { cn } from "@/lib/utils";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error] = useState<string | null>(null);
  const [isLoading] = useState(false);
  // const router = useRouter();

  const handleGoogleSignUp = async () => {
    await signIn("google");
  };

  const handleGithubSignUp = async () => {
    await signIn("github");
  };

  const handleCredentialSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Signing up");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/home",
      });
      console.log("Result", result);
    } catch (error) {
      console.log("Error", error);
      return;
    }
  };
  // const handleSignUp = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const supabase = createClient();
  //   setIsLoading(true);
  //   setError(null);

  //   if (password !== repeatPassword) {
  //     setError("Passwords do not match");
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     const { error } = await supabase.auth.signUp({
  //       email,
  //       password,
  //       options: {
  //         emailRedirectTo: `${window.location.origin}/protected`,
  //       },
  //     });
  //     if (error) throw error;
  //     router.push("/auth/sign-up-success");
  //   } catch (error: unknown) {
  //     setError(error instanceof Error ? error.message : "An error occurred");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div
      className={cn("flex flex-col gap-6 w-[500px] border-none", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCredentialSignUp}>
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
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
          <div className="flex gap-2 justify-center py-2 text-4xl">
            <div className="bg-white text-black p-2 rounded-full cursor-pointer">
              <button
                onClick={handleGoogleSignUp}
                className="bg-white text-black p-2 rounded-full cursor-pointer"
              >
                <FcGoogle />
              </button>
            </div>
            <div className="bg-white text-black px-2 py-1 flex justify-center items-center rounded-full cursor-pointer">
              <button
                onClick={handleGithubSignUp}
                className="bg-white text-black p-2 rounded-full cursor-pointer"
              >
                <FaGithub />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
