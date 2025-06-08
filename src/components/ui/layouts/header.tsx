"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Wallet, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { LoginDialog } from "@/components/dialogs/login-dialog";
import Logo from "@/components/Logo/logo";
// import { useAuth } from "@/components/auth-provider";
// import { LoginDialog } from "@/components/login-dialog";

export function Header() {
  // const { theme, setTheme } = useTheme();
  // const { user, logout } = useAuth();
  const { data: session } = useSession();
  const [showLogin, setShowLogin] = useState(false);

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

            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    {/* <span className="hidden md:inline">{user.email}</span> */}
                    <Badge variant="secondary" className="ml-2">
                      <Wallet className="h-3 w-3 mr-1" />$
                      {/* {user.balance.toFixed(2)} */}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/portfolio">Portfolio</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wallet">Wallet</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {session?.user?.role === "ADMIN" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {/* <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => setShowLogin(true)}>
                  Log In
                </Button>
                <Button onClick={() => setShowLogin(true)}>Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <LoginDialog open={showLogin} onOpenChange={setShowLogin} />
    </header>
  );
}
