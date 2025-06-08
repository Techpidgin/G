"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface Market {
  id: string;
  title: string;
  category: string;
  image: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
  endDate: string;
  status: "open" | "closed" | "resolved";
}

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const [hoveredOption, setHoveredOption] = useState<"yes" | "no" | null>(null);

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    }
    return `$${(volume / 1000).toFixed(0)}K`;
  };

  const yesPercentage = Math.round(market.yesPrice * 100);
  const noPercentage = Math.round(market.noPrice * 100);

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Image
            src={market.image || "/placeholder.svg"}
            alt={market.title}
            width={48}
            height={48}
            className="rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="mb-2">
              {market.category}
            </Badge>
            <Link href={`/market/${market.id}`}>
              <h3 className="font-semibold text-sm leading-tight hover:text-primary transition-colors">
                {market.title}
              </h3>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{formatVolume(market.volume)} Vol.</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs">Daily</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={hoveredOption === "yes" ? "default" : "outline"}
              size="sm"
              className="flex flex-col h-auto py-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800"
              onMouseEnter={() => setHoveredOption("yes")}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <span className="text-xs font-medium">Buy Yes</span>
              <span className="text-lg font-bold">{yesPercentage}¢</span>
            </Button>

            <Button
              variant={hoveredOption === "no" ? "default" : "outline"}
              size="sm"
              className="flex flex-col h-auto py-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800"
              onMouseEnter={() => setHoveredOption("no")}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <span className="text-xs font-medium">Buy No</span>
              <span className="text-lg font-bold">{noPercentage}¢</span>
            </Button>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{yesPercentage}% chance</span>
            <span>{noPercentage}% chance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
