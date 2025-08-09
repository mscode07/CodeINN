import { Code } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { SignUpForm } from "./SignUpForm";
import { Logo } from "./Logo";

// import { getUser, getSession } from "@/lib/auth";

export const NavBarComp = () => {
  //   const { user } = getUser();
  //   const { session } = getSession();
  return (
    <header className="relative z-10 w-full py-6 px-6 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-white/10">
      <Logo />
      <div className="flex items-center space-x-3">
        <ThemeSwitcher />
        <div className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-purple-300 border border-purple-500/30">
          <Dialog>
            <DialogTrigger className="text-black bg-white px-4 py-2 rounded-full">
              Get Started
            </DialogTrigger>
            <DialogContent className="flex items-center justify-center">
              <DialogHeader>
                <DialogTitle className="px-3 py-2">
                  <Logo />
                </DialogTitle>
                <DialogDescription>
                  <SignUpForm />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {/* <div>
            
            <Button asChild size="lg" variant={"outline"}>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild size="lg" variant={"default"}>
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </div> */}
        </div>
      </div>
    </header>
  );
};
