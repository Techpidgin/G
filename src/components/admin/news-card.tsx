import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Market, News } from "@prisma/client";
import { format } from "date-fns";
import {
  Calendar,
  Edit,
  ImageIcon,
  LinkIcon,
  Trash2,
  TrendingUp,
} from "lucide-react";

const NewsCard = ({
  newsItem,
  handleEditNews,
  handleDeleteNews,
}: {
  newsItem: News & { markets: Market[] };
  handleEditNews: (newsItem: any) => void;
  handleDeleteNews: (newsItem: any) => void;
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {newsItem.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {/* {newsItem.new && (
                <Badge variant="default" className="bg-blue-100 text-blue-800">
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
              )} */}
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
              <span>{format(newsItem.startDate, "yyyy-MM-dd")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">End:</span>
              <span>{format(newsItem.endDate, "yyyy-MM-dd")}</span>
            </div>
            {newsItem.image && (
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Image:</span>
                <span className="truncate max-w-[100px]">Available</span>
              </div>
            )}
            {/* {newsItem.resolutionSource && (
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
            )} */}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Created: {format(newsItem.createdAt, "yyyy-MM-dd")}
            </span>
            {/* {!newsItem.hasMarket && (
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
                      Convert this news post into a tradable prediction market.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="market-question">Market Question</Label>
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
                        <Label htmlFor="market-start-date">Start Date</Label>
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
                            (sum, price) => sum + Number.parseFloat(price),
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
            )} */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
