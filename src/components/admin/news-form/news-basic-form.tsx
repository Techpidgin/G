import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import slugify from "@/helpers/slugify";
import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

// Category options
const categoryOptions = [
  { value: "politics", label: "Politics" },
  { value: "sports", label: "Sports" },
  { value: "tech", label: "Tech" },
  { value: "economy", label: "Economy" },
  { value: "crypto", label: "Crypto" },
  { value: "culture", label: "Culture" },
  { value: "world", label: "World" },
  { value: "geopolitics", label: "Geopolitics" },
  { value: "entertainment", label: "Entertainment" },
  { value: "science", label: "Science" },
];

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

const NewsBasicForm = () => {
  const formContext = useFormContext();
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [searchTag, setSearchTag] = useState("");

  // Handle tag selection
  const handleTagSelect = (tagId: string, currentTags: string[]) => {
    if (currentTags.includes(tagId)) {
      return currentTags.filter((id) => id !== tagId);
    } else {
      return [...currentTags, tagId];
    }
  };

  // Filter tags based on search
  const filteredTags = mockTags.filter((tag) =>
    tag.label.toLowerCase().includes(searchTag.toLowerCase())
  );

  const {
    fields: selectedTags,
    append,
    remove,
  } = useFieldArray({
    control: formContext.control,
    name: "tags",
  });

  const title = formContext.watch("title");

  // Auto-generate slug when title changes unless manually edited
  useEffect(() => {
    if (!isSlugEdited && title) {
      const generatedSlug = slugify(title);
      formContext.setValue("slug", generatedSlug);
    }
  }, [title, isSlugEdited, formContext.setValue]);

  const isSelected = (tagId: string) =>
    selectedTags.some((tag: any) => tag.tagId === tagId);
  return (
    <>
      <FormField
        control={formContext.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter news title..."
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL-friendly identifier)</Label>
        <Input
          id="slug"
          {...formContext.register("slug")}
          placeholder="auto-generated-slug"
          disabled={true}
          readOnly={true}
        />
        <p className="text-xs text-muted-foreground">
          Auto-generated from title, but can be edited
        </p>
      </div>

      <FormField
        control={formContext.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter news description..."
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* <FormField
        control={formContext.control}
        name="outcomes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Possible Outcomes</FormLabel>
            <FormControl>
              <div className="space-y-2">
                {field.value.map((outcome: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder={`Outcome ${index + 1}`}
                      value={outcome}
                      onChange={(e) => {
                        const newOutcomes = [...field.value];
                        newOutcomes[index] = e.target.value;
                        field.onChange(newOutcomes);
                      }}
                    />
                    {field.value.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newOutcomes = field.value.filter(
                            (_: string, i: number) => i !== index
                          );
                          field.onChange(newOutcomes);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {field.value.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      field.onChange([...field.value, ""]);
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Outcome
                  </Button>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Define the possible outcomes for this event (minimum 2, maximum
              10)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      /> */}

      <FormField
        control={formContext.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {field.value.map((tagId: string) => {
                    const tag = mockTags.find((t) => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag.label}
                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(handleTagSelect(tag.id, field.value))
                          }
                          className="rounded-full hover:bg-muted p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <Input
                  placeholder="Search tags..."
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                />
                <ScrollArea className="h-32 border rounded-md p-2">
                  <div className="space-y-2">
                    {filteredTags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={field.value.includes(tag.id)}
                          onCheckedChange={() =>
                            field.onChange(handleTagSelect(tag.id, field.value))
                          }
                        />
                        <Label
                          htmlFor={`tag-${tag.id}`}
                          className="cursor-pointer"
                        >
                          {tag.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default NewsBasicForm;
