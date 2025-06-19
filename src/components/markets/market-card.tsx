"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Market, News } from "@prisma/client";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface MarketCardProps {
  news: News & { markets: Market[] };
}

export function MarketCard({ news }: MarketCardProps) {
  const [hoveredOption, setHoveredOption] = useState<"yes" | "no" | null>(null);

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    }
    return `$${(volume / 1000).toFixed(0)}K`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Image
            src={news.image || "/placeholder.svg"}
            alt={news.title}
            width={48}
            height={48}
            className="rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            {news.tags.slice(0, 3).map((tag) => (
              <Badge variant="secondary" className="mb-2">
                {tag}
              </Badge>
            ))}
            <Link href={`/event/${news.slug}`}>
              <h3 className="font-semibold text-sm leading-tight hover:text-primary transition-colors">
                {news.title}
              </h3>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{formatVolume(news.volume)} Vol.</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs">Daily</span>
            </div>
          </div>

          {news.markets.length === 1 &&
            (() => {
              const market = news.markets[0];
              const yesVolume = market.yesVolume || 0;
              const noVolume = market.noVolume || 0;
              const total = yesVolume + noVolume;
              const yesPercentage =
                total > 0 ? ((yesVolume / total) * 100).toFixed(1) : "50";
              const noPercentage =
                total > 0 ? ((noVolume / total) * 100).toFixed(1) : "50";

              return (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={hoveredOption === "yes" ? "default" : "outline"}
                    size="sm"
                    className="flex flex-col h-auto py-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800"
                    onMouseEnter={() => setHoveredOption("yes")}
                    onMouseLeave={() => setHoveredOption(null)}
                  >
                    <span className="text-xs font-medium">
                      Buy {news.markets[0].outcomes[0]}
                    </span>
                    <span className="text-lg font-bold">{yesPercentage}%</span>
                  </Button>

                  <Button
                    variant={hoveredOption === "no" ? "default" : "outline"}
                    size="sm"
                    className="flex flex-col h-auto py-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800"
                    onMouseEnter={() => setHoveredOption("no")}
                    onMouseLeave={() => setHoveredOption(null)}
                  >
                    <span className="text-xs font-medium">
                      Buy {news.markets[0].outcomes[1]}
                    </span>
                    <span className="text-lg font-bold">{noPercentage}%</span>
                  </Button>
                </div>
              );
            })()}

          {/* <div className="flex justify-between text-xs text-muted-foreground">
            <span>{yesPercentage}% chance</span>
            <span>{noPercentage}% chance</span>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
