import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "../button";
import { User, Wallet } from "lucide-react";
import { Badge } from "../badge";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

const Controls = () => {
  //   const { user } = usePrivy();
  //   user?.wallet?.address

  // const {ad} = useAccoun
  const { logout, user } = usePrivy();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          {/* <span className="hidden md:inline">{user.email}</span> */}
          <Badge variant="secondary" className="ml-2">
            <Wallet className="h-3 w-3 mr-1" />$
            {/* {user.balance.toFixed(2)} */}0
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
        {user?.customMetadata?.role === "admin" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin">Admin Panel</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Controls;
