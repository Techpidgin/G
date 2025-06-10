"use client";

import { privyConfig } from "@/helpers/config";
import constans from "@/helpers/constants";
import { PrivyProvider } from "@privy-io/react-auth";

import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider appId={constans.privyAppId} config={privyConfig}>
      {children}
    </PrivyProvider>
  );
};

export default Providers;
