"use client";

import { MarketCard } from "@/components/markets/market-card";

// Mock data - in real app, this would come from API
const mockMarkets = [
  {
    id: "1",
    title: "Will Trump win the 2024 election?",
    category: "Politics",
    image: "/placeholder.svg?height=60&width=60",
    yesPrice: 0.52,
    noPrice: 0.48,
    volume: 2100000,
    endDate: "2024-11-05",
    status: "open" as const,
  },
  {
    id: "2",
    title: "Will Bitcoin reach $100k by end of 2024?",
    category: "Crypto",
    image: "/placeholder.svg?height=60&width=60",
    yesPrice: 0.34,
    noPrice: 0.66,
    volume: 850000,
    endDate: "2024-12-31",
    status: "open" as const,
  },
  {
    id: "3",
    title: "Will there be a US recession in 2024?",
    category: "Economy",
    image: "/placeholder.svg?height=60&width=60",
    yesPrice: 0.28,
    noPrice: 0.72,
    volume: 1200000,
    endDate: "2024-12-31",
    status: "open" as const,
  },
  {
    id: "4",
    title: "Lakers vs Warriors - Who wins?",
    category: "Sports",
    image: "/placeholder.svg?height=60&width=60",
    yesPrice: 0.45,
    noPrice: 0.55,
    volume: 450000,
    endDate: "2024-03-15",
    status: "open" as const,
  },
];

export function MarketGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {mockMarkets.map((market) => (
        <MarketCard key={market.id} market={market} />
      ))}
    </div>
  );
}
