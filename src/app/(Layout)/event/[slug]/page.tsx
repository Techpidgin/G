import { getNewsBySlug } from "@/actions/news";
import MarketLineChart from "@/components/charts/market-line-chart";
import TradingPanel from "@/components/charts/trading-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MarketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) {
    return notFound();
  }
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          {/* <Badge variant="secondary" className="mb-2">
            {market.category}
          </Badge> */}
          <h1 className="text-2xl font-bold">{news.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Price Chart
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>24h</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarketLineChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About this market</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{news.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TradingPanel selectedMarket={news.markets[0]} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-medium">
                  ${(news.volume / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Shares</span>
                {/* <span className="font-medium">
                  {(news.totalShares / 1000000).toFixed(1)}M
                </span> */}
              </div>
              {/* <div className="flex justify-between">
                <span className="text-muted-foreground">Yes Holders</span>
                <span className="font-medium">
                  {Math.round((news.yesShares / news.totalShares) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">No Holders</span>
                <span className="font-medium">
                  {Math.round((news.noShares / news.totalShares) * 100)}%
                </span>
              </div> */}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ends</span>
                <span className="font-medium">
                  {new Date(news.endDate).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
