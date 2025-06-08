"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const filters = [
  "All",
  "Breaking News",
  "Elections",
  "Sports Finals",
  "Geopolitics",
  "Trade War",
  "Courts",
  "AI",
];

export function FilterBar() {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter, index) => (
        <Badge
          key={filter}
          variant={index === 0 ? "default" : "secondary"}
          className="cursor-pointer hover:bg-primary/80"
        >
          {filter}
          {index !== 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 ml-1">
              <X className="h-3 w-3" />
            </Button>
          )}
        </Badge>
      ))}
    </div>
  );
}
