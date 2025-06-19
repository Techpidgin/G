"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Loader, Newspaper, Plus } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import EmptyStateCard from "../empty-state-card";
import NewsForm from "./news-form";
import NewsCard from "./news-card";
import { listNews } from "@/actions/news";
import { Market, News } from "@prisma/client";

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

type NewsType = News & { markets: Market[] };

export function NewsManager() {
  const [news, setNews] = useState<NewsType[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMarketDialog, setShowMarketDialog] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsType | null | undefined>(
    undefined
  );
  const [currentMarket, setCurrentMarket] = useState(initialMarketState);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTag, setSearchTag] = useState("");
  const [isPending, startTransition] = useTransition();

  const fetchNews = useCallback(() => {
    startTransition(async () => {
      const response = await listNews();
      setNews(response);
    });
  }, []);

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

  // Delete news post
  const handleDeleteNews = (id: string) => {
    setNews(news.filter((item) => item.id !== id));
    toast("News deleted", {
      description: "The news post has been deleted.",
    });
  };

  // Edit news post
  const handleEditNews = (newsItem: NewsType) => {
    console.log(newsItem);
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
    setCurrentNews(null);
    setCurrentMarket(initialMarketState);
    setSelectedTags([]);
    // setFormTab("basic");
  };

  useEffect(() => {
    fetchNews();
  }, []);

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
            initialState={currentNews}
          />
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isPending ? (
          <Loader className="animate-spin" />
        ) : news.length ? (
          news.map((newsItem) => (
            <NewsCard
              key={newsItem.id}
              handleEditNews={handleEditNews}
              handleDeleteNews={handleDeleteNews}
              newsItem={newsItem}
            />
          ))
        ) : (
          <EmptyStateCard
            icon={Newspaper}
            title="No News Posts Yet"
            description="Start building your prediction market platform by creating news posts. These posts can later be converted into tradable markets for your users."
            actionLabel="Create Your First News Post"
            onAction={() => setShowCreateDialog(true)}
          />
        )}
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
          initialState={currentNews}
        />
      </Dialog>
    </div>
  );
}
