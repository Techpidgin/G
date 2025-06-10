"use client";
import { usePrivy } from "@privy-io/react-auth";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const PersistAuth = ({ children }: { children: React.ReactNode }) => {
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      return redirect("/");
    }
  }, [ready, authenticated]);

  return children;
};

export default PersistAuth;
