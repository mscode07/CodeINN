import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsCurrencyDollar } from "react-icons/bs";
import { Logo } from "./Logo";

export const NavBarComp = () => {
  const { data: session, status } = useSession();
  console.log("NavBarComp", session, status);
  const handleLogout = async () => {
    signOut();
  };
  return (
    <header className="relative z-10 w-full py-6 px-6 flex justify-between items-center backdrop-blur-sm bg-white/5 border-b border-white/10">
      <Logo />
      <div className="flex items-center space-x-3">
        <div className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-purple-300 border border-purple-500/30">
          <Link href="/supportUs">
            <BsCurrencyDollar className="text-2xl" />
          </Link>
        </div>
        <div className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-purple-300 border border-purple-500/30">
          <Link
            href={status === "authenticated" ? "/" : "/auth/signup"}
            className="text-white px-4 py-2 rounded-full"
          >
            {status === "authenticated" ? (
              <button onClick={handleLogout}>
                <LogOut />
              </button>
            ) : (
              <button>
                <User />
              </button>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
