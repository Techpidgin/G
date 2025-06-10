"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// import { useTheme } from "next-themes";
import { LoginDialog } from "@/components/dialogs/login-dialog";
import Logo from "@/components/Logo/logo";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSession } from "next-auth/react";
import Controls from "./controls";
import { Skeleton } from "../skeleton";
// import { useAuth } from "@/components/auth-provider";
// import { LoginDialog } from "@/components/login-dialog";

export function Header() {
  // const { theme, setTheme } = useTheme();
  // const { user, logout } = useAuth();
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const { ready, login, authenticated } = usePrivy();
  // const { wallets,  } = useWallets();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              {/* <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  PM
                </span>
                </div> */}
              <Logo width={40} />
              <span className="font-bold text-lg md:text-xl">PolyMarket</span>
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search markets..." className="pl-10" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button> */}

            {ready ? (
              authenticated ? (
                <Controls />
              ) : (
                <Button onClick={login}>Connect Wallet</Button>
              )
            ) : (
              <Skeleton className="h-8 w-24" />
            )}
          </div>
        </div>
      </div>
      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </header>
  );
}
