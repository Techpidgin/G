import { Header } from "@/components/ui/layouts/header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
