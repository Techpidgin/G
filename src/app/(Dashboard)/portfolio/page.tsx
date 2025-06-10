"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Eye,
} from "lucide-react";
import Link from "next/link";

const mockPositions = [
  {
    id: "1",
    marketTitle: "Will Trump win the 2024 election?",
    outcome: "Yes",
    shares: 100,
    avgPrice: 0.48,
    currentPrice: 0.52,
    value: 52,
    pnl: 4,
    status: "open",
  },
  {
    id: "2",
    marketTitle: "Will Bitcoin reach $100k by end of 2024?",
    outcome: "No",
    shares: 75,
    avgPrice: 0.7,
    currentPrice: 0.66,
    value: 49.5,
    pnl: -3,
    status: "open",
  },
];

const mockTradeHistory = [
  {
    id: "1",
    marketTitle: "Will Trump win the 2024 election?",
    outcome: "Yes",
    type: "Buy",
    shares: 50,
    price: 0.48,
    total: 24,
    date: "2024-01-15",
  },
  {
    id: "2",
    marketTitle: "Will Bitcoin reach $100k by end of 2024?",
    outcome: "No",
    type: "Buy",
    shares: 75,
    price: 0.7,
    total: 52.5,
    date: "2024-01-14",
  },
];

export default function PortfolioDashboard() {
  const totalValue = mockPositions.reduce((sum, pos) => sum + pos.value, 0);
  const totalPnL = mockPositions.reduce((sum, pos) => sum + pos.pnl, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">
          Track your positions and trading performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Current market value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            {totalPnL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                totalPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Unrealized gains/losses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Positions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPositions.length}</div>
            <p className="text-xs text-muted-foreground">
              Open market positions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
              <CardDescription>Your current market positions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Market</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Avg Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPositions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell>
                        <div className="font-medium max-w-xs truncate">
                          {position.marketTitle}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            position.outcome === "Yes" ? "default" : "secondary"
                          }
                          className={
                            position.outcome === "Yes"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {position.outcome}
                        </Badge>
                      </TableCell>
                      <TableCell>{position.shares}</TableCell>
                      <TableCell>
                        {Math.round(position.avgPrice * 100)}¢
                      </TableCell>
                      <TableCell>
                        {Math.round(position.currentPrice * 100)}¢
                      </TableCell>
                      <TableCell>${position.value.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            position.pnl >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {position.pnl >= 0 ? "+" : ""}$
                          {position.pnl.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/market/${position.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>Your past trading activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTradeHistory.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        {new Date(trade.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium max-w-xs truncate">
                          {trade.marketTitle}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            trade.type === "Buy" ? "default" : "secondary"
                          }
                        >
                          {trade.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            trade.outcome === "Yes" ? "default" : "secondary"
                          }
                          className={
                            trade.outcome === "Yes"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {trade.outcome}
                        </Badge>
                      </TableCell>
                      <TableCell>{trade.shares}</TableCell>
                      <TableCell>{Math.round(trade.price * 100)}¢</TableCell>
                      <TableCell>${trade.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
