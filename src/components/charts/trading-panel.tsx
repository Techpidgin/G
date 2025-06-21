"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Market } from "@prisma/client";
import { Input } from "../ui/input";
import { getMarketPrices } from "@/helpers/get-market-price";
import { formatCents } from "@/helpers/format-cents";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { tradeSchema } from "@/schemas/trade";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { placeTrade } from "@/actions/trade";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
// import { getPricesLMSR } from "@/helpers/lmsr";
import { toast } from "sonner";
import { formatCurrency } from "@/helpers/format-currency";

type TradeFormValues = z.infer<typeof tradeSchema>;

const TradingPanel = ({ selectedMarket }: { selectedMarket: Market }) => {
  const router = useRouter();

  const [selectedOutcome, setSelectedOutcome] = useState("yes");
  const { yesPrice, noPrice } = getMarketPrices(
    selectedMarket.yesVolume,
    selectedMarket.noVolume
  );

  const setMaxShares = () => {};

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TradeFormValues>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      side: "buy",
      marketId: selectedMarket.id,
      outcome: "yes",
      shares: 1,
      limitPrice: 0.5,
    },
  });
  const side = watch("side");
  const shares = watch("shares");
  const outcome = watch("outcome");

  const total = useMemo(() => {
    if (!shares) return 0;
    if (outcome === "yes") {
      return yesPrice * shares;
    }
    return shares * noPrice;
  }, [side, shares, outcome]);

  const updateShares = (mode: "add" | "sub", value: number) => {
    if (mode === "add") {
      setValue("shares", shares + value);
    } else if (mode === "sub" && shares - value >= 0) {
      setValue("shares", shares - value);
    }
  };

  const onSubmit = async (data: TradeFormValues) => {
    // Submit to server action or API
    const response = await placeTrade(data);
    if (response.success) {
      toast.success("Trade taken successfully");
      reset();
    }
    router.refresh();
  };

  useEffect(() => {
    if (outcome === "yes") {
      setValue("amount", formatCents(yesPrice));
    } else {
      setValue("amount", formatCents(noPrice));
    }
  }, [outcome, side]);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="">
        <Tabs
          value={watch("side")}
          onValueChange={(value) => setValue("side", value as "buy" | "sell")}
        >
          <TabsList className="">
            <TabsTrigger value="buy" className="">
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="">
              Sell
            </TabsTrigger>
          </TabsList>
          <TabsContent value="buy">
            <Tabs
              value={outcome}
              onValueChange={(value) =>
                setValue("outcome", value as "yes" | "no")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="yes" className="text-green-700">
                  Yes {formatCents(yesPrice)}
                </TabsTrigger>
                <TabsTrigger value="no" className="text-red-700">
                  No {formatCents(noPrice)}
                </TabsTrigger>
              </TabsList>

              {/* <TabsContent value="yes" className="space-y-4"> */}
              <div className="space-y-2">
                <Label htmlFor="yes-amount">Amount ($)</Label>
                <Input
                  id="yes-amount"
                  type="text"
                  readOnly={true}
                  aria-readonly={true}
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0¢"
                  {...register("amount")}
                />
              </div>

              {/* Shares */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Shares</div>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs text-slate-400 p-0 h-auto"
                    onClick={setMaxShares}
                  >
                    Max
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    {...register("shares", { valueAsNumber: true })}
                    className="text-center  text-lg"
                    placeholder="0"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="text-xs"
                      onClick={() => updateShares("sub", 10)}
                    >
                      -10
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="text-xs"
                      onClick={() => updateShares("add", 10)}
                    >
                      +10
                    </Button>
                  </div>
                </div>
              </div>

              {/* Set Expiration */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Set Expiration</span>
                <Switch className="data-[state=checked]:bg-blue-600" />
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total</span>
                  <span className="text-blue-400 font-medium">
                    {formatCurrency(total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center">
                    To Win
                  </span>
                  <span className="text-green-400 font-medium">
                    {formatCurrency(shares ? shares : 0)}
                  </span>
                </div>
              </div>
              {/* <div className="text-sm text-muted-foreground flex justify-between items-center">
                You'll receive{" "}
                <span className="text-green-600 text-lg">
                  {formatCurrency(shares ? shares : 0)}
                </span>
              </div> */}
              <Button
                className={cn("w-full bg-green-600 hover:bg-green-700", {
                  "bg-red-600 hover:bg-red-700": outcome === "no",
                })}
                disabled={isSubmitting}
              >
                Buy {outcome.charAt(0).toUpperCase()}
                {outcome.slice(1)}
                {isSubmitting && <Loader className="animate-spin ml-2" />}
              </Button>
              {/* </TabsContent> */}
              {/* 
              <TabsContent value="no" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="no-amount">Amount ($)</Label>
                  <Input id="no-amount" type="number" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Shares</div>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs text-slate-400 p-0 h-auto"
                      onClick={setMaxShares}
                    >
                      Max
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      {...register("shares")}
                      className="text-center  text-lg"
                      placeholder="0"
                    />
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => adjustShares(-10)}
                      >
                        -10
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => adjustShares(10)}
                      >
                        +10
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Set Expiration</span>
                  <Switch
                    // checked={setExpiration}
                    // onCheckedChange={setSetExpiration}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total</span>
                    <span className="text-blue-400 font-medium"></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 flex items-center">
                      To Win
                      <span className="ml-1 text-green-400">📈</span>
                    </span>
                    <span className="text-green-400 font-medium"></span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  You'll receive ~ shares
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Buy No for {formatCents(noPrice)}
                </Button>
              </TabsContent> */}
            </Tabs>
          </TabsContent>
          <TabsContent value="sell">
            <Tabs
              value={selectedOutcome}
              onValueChange={(value) =>
                setSelectedOutcome(value as "yes" | "no")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="yes" className="text-green-700">
                  Yes {formatCents(yesPrice)}
                </TabsTrigger>
                <TabsTrigger value="no" className="text-red-700">
                  No {formatCents(noPrice)}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="yes" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="yes-amount">Amount ($)</Label>
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
                  <Label htmlFor="no-amount">Amount ($)</Label>
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
          </TabsContent>
        </Tabs>
      </div>
    </form>
  );
};

export default TradingPanel;
