import { MarketGrid } from "@/components/markets/marketgrid";
import { CategoryTabs } from "@/components/ui/layouts/category-tabs";
import { FilterBar } from "@/components/ui/layouts/filter-bar";

export default function Home() {
  return (
    <>
      <CategoryTabs />
      <FilterBar />
      <MarketGrid />
    </>
  );
}
