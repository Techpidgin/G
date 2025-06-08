import { MarketGrid } from "@/components/markets/marketgrid";
import { CategoryTabs } from "@/components/ui/layouts/category-tabs";
import { FilterBar } from "@/components/ui/layouts/filter-bar";
import { Header } from "@/components/ui/layouts/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <CategoryTabs />
        <FilterBar />
        <MarketGrid />
      </main>
    </div>
  );
}
