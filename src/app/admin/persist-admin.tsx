"use client";
import { usePrivy } from "@privy-io/react-auth";
import { notFound, redirect } from "next/navigation";
import React, { useEffect } from "react";

const PersistAdmin = ({ children }: { children: React.ReactNode }) => {
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      return redirect("/");
    }
  }, [ready, authenticated]);

  useEffect(() => {
    if (ready && authenticated && user?.customMetadata?.role !== "admin") {
      return notFound();
    }
  });

  return children;
};

export default PersistAdmin;
