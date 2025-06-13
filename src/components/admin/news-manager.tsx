"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Calendar,
  ImageIcon,
  X,
  Save,
  LinkIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import NewsForm from "./news-form";

// Mock tags data based on the provided sample
const mockTags = [
  { id: "2", label: "Politics", slug: "politics" },
  { id: "180", label: "Israel", slug: "israel" },
  { id: "100265", label: "Geopolitics", slug: "geopolitics" },
  { id: "61", label: "Gaza", slug: "gaza" },
  { id: "101970", label: "World", slug: "world" },
  { id: "366", label: "World Affairs", slug: "world-affairs" },
  { id: "3", label: "Sports", slug: "sports" },
  { id: "4", label: "Tech", slug: "tech" },
  { id: "5", label: "Economy", slug: "economy" },
  { id: "6", label: "Crypto", slug: "crypto" },
];

// Mock news data
const mockNews = [
  {
    id: "1",
    ticker: "federal-reserve-interest-rate-decision",
    slug: "federal-reserve-interest-rate-decision",
    title: "Federal Reserve Announces Interest Rate Decision",
    description:
      "The Fed is expected to announce their latest interest rate decision this week.",
    resolutionSource: "https://www.federalreserve.gov/",
    startDate: "2024-06-15T00:00:00Z",
    creationDate: "2024-06-10T00:00:00Z",
    endDate: "2024-06-20T00:00:00Z",
    image:
      "https://polymarket-upload.s3.us-east-2.amazonaws.com/federal-reserve-interest-rate-decision.jpg",
    icon: "https://polymarket-upload.s3.us-east-2.amazonaws.com/federal-reserve-interest-rate-decision-icon.jpg",
    active: true,
    closed: false,
    archived: false,
    new: true,
    featured: false,
    restricted: false,
    tags: [{ id: "5", label: "Economy", slug: "economy" }],
    hasMarket: false,
  },
  {
    id: "2",
    ticker: "tech-giants-q4-earnings",
    slug: "tech-giants-q4-earnings",
    title: "Tech Giants Report Q4 Earnings",
    description:
      "Major technology companies are set to report their quarterly earnings.",
    resolutionSource: "https://www.nasdaq.com/market-activity/earnings",
    startDate: "2024-06-05T00:00:00Z",
    creationDate: "2024-06-01T00:00:00Z",
    endDate: "2024-07-15T00:00:00Z",
    image:
      "https://polymarket-upload.s3.us-east-2.amazonaws.com/tech-giants-q4-earnings.jpg",
    icon: "https://polymarket-upload.s3.us-east-2.amazonaws.com/tech-giants-q4-earnings-icon.jpg",
    active: true,
    closed: false,
    archived: false,
    new: false,
    featured: true,
    restricted: false,
    tags: [{ id: "4", label: "Tech", slug: "tech" }],
    hasMarket: true,
    markets: [
      {
        id: "101",
        question: "Will Apple beat earnings expectations?",
        outcomes: ["Yes", "No"],
        outcomePrices: ["0.65", "0.35"],
        volume: "15000",
      },
    ],
  },
];

// Initial state for a new news post
const initialNewsState = {
  id: "",
  ticker: "",
  slug: "",
  title: "",
  description: "",
  resolutionSource: "",
  startDate: new Date().toISOString().split("T")[0],
  creationDate: new Date().toISOString(),
  endDate: "",
  image: "",
  icon: "",
  active: true,
  closed: false,
  archived: false,
  new: true,
  featured: false,
  restricted: false,
  tags: [],
  hasMarket: false,
};

// Initial state for a new market
const initialMarketState = {
  question: "",
  outcomes: ["Yes", "No"],
  outcomePrices: ["0.5", "0.5"],
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  liquidity: "1000",
  enableOrderBook: true,
  automaticallyActive: true,
};

export function NewsManager() {
  const [news, setNews] = useState(mockNews);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMarketDialog, setShowMarketDialog] = useState(false);
  const [currentNews, setCurrentNews] = useState(initialNewsState);
  const [currentMarket, setCurrentMarket] = useState(initialMarketState);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTag, setSearchTag] = useState("");

  // Filter tags based on search
  const filteredTags = mockTags.filter((tag) =>
    tag.label.toLowerCase().includes(searchTag.toLowerCase())
  );

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    const ticker = slug;

    setCurrentNews({
      ...currentNews,
      title,
      slug,
      ticker,
    });
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentNews({
      ...currentNews,
      [name]: value,
    });
  };

  // Handle checkbox/switch changes
  const handleToggleChange = (name: string, checked: boolean) => {
    setCurrentNews({
      ...currentNews,
      [name]: checked,
    });
  };

  // Create or update news post
  const handleSaveNews = () => {
    const selectedTagObjects = mockTags.filter((tag) =>
      selectedTags.includes(tag.id)
    );

    const updatedNews = {
      ...currentNews,
      tags: selectedTagObjects,
      creationDate: new Date().toISOString(),
    };

    if (currentNews.id) {
      // Update existing news
      setNews(
        news.map((item) => (item.id === currentNews.id ? updatedNews : item))
      );
      toast("News updated", {
        description: "The news post has been updated successfully.",
      });
    } else {
      // Create new news
      const newId = Date.now().toString();
      setNews([...news, { ...updatedNews, id: newId }]);
      toast("News created", {
        description: "The news post has been created successfully.",
      });
    }

    setShowCreateDialog(false);
    setShowEditDialog(false);
    resetForm();
  };

  // Create market from news
  const handleCreateMarket = () => {
    const updatedNews = {
      ...currentNews,
      hasMarket: true,
      markets: [
        {
          id: Date.now().toString(),
          question: currentMarket.question,
          outcomes: currentMarket.outcomes,
          outcomePrices: currentMarket.outcomePrices,
          volume: "0",
        },
      ],
    };

    setNews(
      news.map((item) => (item.id === currentNews.id ? updatedNews : item))
    );
    setShowMarketDialog(false);

    toast("Market created", {
      description: "A new market has been created from this news post.",
    });
  };

  // Delete news post
  const handleDeleteNews = (id: string) => {
    setNews(news.filter((item) => item.id !== id));
    toast("News deleted", {
      description: "The news post has been deleted.",
    });
  };

  // Edit news post
  const handleEditNews = (newsItem: any) => {
    setCurrentNews(newsItem);
    setSelectedTags(newsItem.tags.map((tag: any) => tag.id));
    setShowEditDialog(true);
  };

  // Prepare to create market from news
  const handlePrepareMarket = (newsItem: any) => {
    setCurrentNews(newsItem);
    setCurrentMarket({
      ...initialMarketState,
      question: newsItem.title,
      startDate: new Date().toISOString().split("T")[0],
      endDate: newsItem.endDate
        ? new Date(newsItem.endDate).toISOString().split("T")[0]
        : "",
    });
    setShowMarketDialog(true);
  };

  // Reset form state
  const resetForm = () => {
    setCurrentNews(initialNewsState);
    setCurrentMarket(initialMarketState);
    setSelectedTags([]);
    // setFormTab("basic");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row  justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">News Management</h2>
          <p className="text-muted-foreground">
            Create and manage news posts that can become tradable markets
          </p>
        </div>
        <Dialog
          open={showCreateDialog}
          onOpenChange={(open) => {
            setShowCreateDialog(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create News Post
            </Button>
          </DialogTrigger>
          <NewsForm
            showEditDialog={showEditDialog}
            setShowEditDialog={setShowEditDialog}
          />
        </Dialog>
      </div>

      <div className="grid gap-4">
        {news.map((newsItem) => (
          <Card key={newsItem.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {newsItem.tags.map((tag: any) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.label}
                      </Badge>
                    ))}
                    {newsItem.new && (
                      <Badge
                        variant="default"
                        className="bg-blue-100 text-blue-800"
                      >
                        New
                      </Badge>
                    )}
                    {newsItem.featured && (
                      <Badge
                        variant="default"
                        className="bg-purple-100 text-purple-800"
                      >
                        Featured
                      </Badge>
                    )}
                    {newsItem.hasMarket && (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Market Active
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{newsItem.title}</CardTitle>
                  <CardDescription>{newsItem.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditNews(newsItem)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteNews(newsItem.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Start:</span>
                    <span>{formatDate(newsItem.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">End:</span>
                    <span>{formatDate(newsItem.endDate)}</span>
                  </div>
                  {newsItem.image && (
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Image:</span>
                      <span className="truncate max-w-[100px]">Available</span>
                    </div>
                  )}
                  {newsItem.resolutionSource && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Source:</span>
                      <a
                        href={newsItem.resolutionSource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate max-w-[100px] text-primary hover:underline"
                      >
                        Link
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Created: {formatDate(newsItem.creationDate)}
                  </span>
                  {!newsItem.hasMarket && (
                    <Dialog
                      open={showMarketDialog && currentNews.id === newsItem.id}
                      onOpenChange={(open) => {
                        setShowMarketDialog(open);
                        if (!open) resetForm();
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => handlePrepareMarket(newsItem)}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Create Market
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create Market from News</DialogTitle>
                          <DialogDescription>
                            Convert this news post into a tradable prediction
                            market.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="market-question">
                              Market Question
                            </Label>
                            <Input
                              id="market-question"
                              placeholder="Will this event happen?"
                              value={currentMarket.question}
                              onChange={(e) =>
                                setCurrentMarket({
                                  ...currentMarket,
                                  question: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="market-start-date">
                                Start Date
                              </Label>
                              <Input
                                id="market-start-date"
                                type="date"
                                value={currentMarket.startDate}
                                onChange={(e) =>
                                  setCurrentMarket({
                                    ...currentMarket,
                                    startDate: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="market-end-date">End Date</Label>
                              <Input
                                id="market-end-date"
                                type="date"
                                value={currentMarket.endDate}
                                onChange={(e) =>
                                  setCurrentMarket({
                                    ...currentMarket,
                                    endDate: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="initial-liquidity">
                              Initial Liquidity ($)
                            </Label>
                            <Input
                              id="initial-liquidity"
                              type="number"
                              placeholder="1000"
                              value={currentMarket.liquidity}
                              onChange={(e) =>
                                setCurrentMarket({
                                  ...currentMarket,
                                  liquidity: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Outcomes</Label>
                            <div className="grid grid-cols-2 gap-4">
                              {currentMarket.outcomes.map((outcome, index) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor={`outcome-${index}`}>
                                      {outcome}
                                    </Label>
                                    <Label htmlFor={`price-${index}`}>
                                      Initial Price
                                    </Label>
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      id={`outcome-${index}`}
                                      value={outcome}
                                      onChange={(e) => {
                                        const newOutcomes = [
                                          ...currentMarket.outcomes,
                                        ];
                                        newOutcomes[index] = e.target.value;
                                        setCurrentMarket({
                                          ...currentMarket,
                                          outcomes: newOutcomes,
                                        });
                                      }}
                                      disabled={index < 2} // Don't allow changing Yes/No for basic markets
                                    />
                                    <Input
                                      id={`price-${index}`}
                                      type="number"
                                      min="0"
                                      max="1"
                                      step="0.01"
                                      value={currentMarket.outcomePrices[index]}
                                      onChange={(e) => {
                                        const newPrices = [
                                          ...currentMarket.outcomePrices,
                                        ];
                                        newPrices[index] = e.target.value;
                                        setCurrentMarket({
                                          ...currentMarket,
                                          outcomePrices: newPrices,
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Prices should sum to 1.00 (currently:{" "}
                              {currentMarket.outcomePrices
                                .reduce(
                                  (sum, price) =>
                                    sum + Number.parseFloat(price),
                                  0
                                )
                                .toFixed(2)}
                              )
                            </p>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="enableOrderBook">
                                  Enable Order Book
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Allow limit orders on this market
                                </p>
                              </div>
                              <Switch
                                id="enableOrderBook"
                                checked={currentMarket.enableOrderBook}
                                onCheckedChange={(checked) =>
                                  setCurrentMarket({
                                    ...currentMarket,
                                    enableOrderBook: checked,
                                  })
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="automaticallyActive">
                                  Automatically Active
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Market becomes active immediately
                                </p>
                              </div>
                              <Switch
                                id="automaticallyActive"
                                checked={currentMarket.automaticallyActive}
                                onCheckedChange={(checked) =>
                                  setCurrentMarket({
                                    ...currentMarket,
                                    automaticallyActive: checked,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setShowMarketDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleCreateMarket}>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Create Market
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          // if (!open) resetForm();
        }}
      >
        <NewsForm
          showEditDialog={showEditDialog}
          setShowEditDialog={setShowEditDialog}
        />
      </Dialog>
    </div>
  );
}
