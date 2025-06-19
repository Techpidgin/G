import { Header } from "@/components/ui/layouts/header";
import React from "react";
import PersistAuth from "./persist-auth";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PersistAuth>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">{children}</main>
      </div>
    </PersistAuth>
  );
};

export default Layout;
