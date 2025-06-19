"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Market } from "@prisma/client";
import { Label } from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { getMarketPrices } from "@/helpers/get-market-price";
import { formatCents } from "@/helpers/format-cents";
import { Button } from "../ui/button";

const TradingPanel = ({ selectedMarket }: { selectedMarket: Market }) => {
  const [selectedOutcome, setSelectedOutcome] = useState("yes");
  const { yesPrice, noPrice } = getMarketPrices(
    selectedMarket.yesVolume,
    selectedMarket.noVolume
  );
  return (
    <Tabs
      value={selectedOutcome}
      onValueChange={(value) => setSelectedOutcome(value as "yes" | "no")}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="yes" className="text-green-700">
          Yes {formatCents(yesPrice)}¢
        </TabsTrigger>
        <TabsTrigger value="no" className="text-red-700">
          No {formatCents(noPrice)}¢
        </TabsTrigger>
      </TabsList>

      <TabsContent value="yes" className="space-y-4">
        <div className="space-y-2">
          {/* <Label>Amount ($)</Label> */}
          <Input
            id="yes-amount"
            type="number"
            placeholder="0.00"
            // value={tradeAmount}
            // onChange={(e) => setTradeAmount(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          You'll receive ~{/* {calculatePayout().toFixed(2)}  */}
          shares
        </div>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          Buy Yes for {formatCents(yesPrice)}
        </Button>
      </TabsContent>

      <TabsContent value="no" className="space-y-4">
        <div className="space-y-2">
          {/* <Label>Amount ($)</Label> */}
          <Input
            id="no-amount"
            type="number"
            placeholder="0.00"
            // value={tradeAmount}
            // onChange={(e) => setTradeAmount(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          You'll receive ~{/* {calculatePayout().toFixed(2)} */}
          shares
        </div>
        <Button className="w-full bg-red-600 hover:bg-red-700">
          Buy No for {formatCents(noPrice)}
        </Button>
      </TabsContent>
    </Tabs>
  );
};

export default TradingPanel;
