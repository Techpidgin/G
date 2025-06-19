"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import EmptyStateCard from "../empty-state-card";

const mockMarkets = [
  {
    id: "1",
    title: "Will Trump win the 2024 election?",
    category: "Politics",
    status: "open",
    volume: 2100000,
    yesPrice: 0.52,
    endDate: "2024-11-05",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    title: "Will Bitcoin reach $100k by end of 2024?",
    category: "Crypto",
    status: "open",
    volume: 850000,
    yesPrice: 0.34,
    endDate: "2024-12-31",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    title: "Will there be a US recession in 2024?",
    category: "Economy",
    status: "closed",
    volume: 1200000,
    yesPrice: 0.28,
    endDate: "2024-12-31",
    createdAt: "2024-01-10",
  },
];

export function MarketManager() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-green-100 text-green-800">Open</Badge>;
      case "closed":
        return <Badge className="bg-yellow-100 text-yellow-800">Closed</Badge>;
      case "resolved":
        return <Badge className="bg-blue-100 text-blue-800">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    }
    return `$${(volume / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Market Management</h2>
          <p className="text-muted-foreground">
            Manage all prediction markets on the platform
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter markets by status and category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="politics">Politics</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Search markets..." className="flex-1" />
          </div>
        </CardContent>
      </Card>

      <EmptyStateCard
        icon={TrendingUp}
        title="No Markets Created Yet"
        description="Markets are created from news posts. Start by creating news posts in the News tab, then convert them into tradable prediction markets."
        actionLabel="Go to News Management"
        onAction={() => {
          // In a real app, this would navigate to the news tab
          console.log("Navigate to news tab");
        }}
      />

      {/* <Card>
        <CardHeader>
          <CardTitle>Markets</CardTitle>
          <CardDescription>
            All prediction markets on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Market</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Yes Price</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMarkets.map((market) => (
                <TableRow key={market.id}>
                  <TableCell>
                    <div className="font-medium">{market.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(market.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{market.category}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(market.status)}</TableCell>
                  <TableCell>{formatVolume(market.volume)}</TableCell>
                  <TableCell>{Math.round(market.yesPrice * 100)}¢</TableCell>
                  <TableCell>
                    {new Date(market.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {market.status === "open" && (
                          <DropdownMenuItem>
                            <Pause className="h-4 w-4 mr-2" />
                            Close Market
                          </DropdownMenuItem>
                        )}
                        {market.status === "closed" && (
                          <>
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Reopen Market
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Resolve Yes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <XCircle className="h-4 w-4 mr-2" />
                              Resolve No
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card> */}
    </div>
  );
}
