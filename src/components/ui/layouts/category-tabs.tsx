"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react";

const categories = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "new", label: "New" },
  { id: "politics", label: "Politics" },
  { id: "sports", label: "Sports" },
  { id: "crypto", label: "Crypto" },
  { id: "tech", label: "Tech" },
  { id: "culture", label: "Culture" },
  { id: "world", label: "World" },
  { id: "economy", label: "Economy" },
];

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState("trending");

  return (
    <div className="mb-6">
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-9 lg:w-auto lg:grid-cols-none lg:flex">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center space-x-1"
            >
              {category.icon && <category.icon className="h-4 w-4" />}
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
