import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X } from "lucide-react";
import React, { Dispatch, useState } from "react";
import { Button } from "../ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

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

// News form dialog content
const RenderNewsForm = () => {
  const [formTab, setFormTab] = useState("basic");
  //   const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTag, setSearchTag] = useState("");

  // Filter tags based on search
  const filteredTags = mockTags.filter((tag) =>
    tag.label.toLowerCase().includes(searchTag.toLowerCase())
  );
  const formContext = useFormContext();
  const {
    fields: selectedTags,
    append,
    remove,
  } = useFieldArray({
    control: formContext.control,
    name: "tags",
  });

  // Handle tag selection
  const handleTagSelect = (tagId: string) => {
    const index = selectedTags.findIndex((tag: any) => tag.tagId === tagId);

    if (index !== -1) {
      remove(index);
    } else {
      append({ tagId });
    }
    // if (selectedTags.includes(tagId)) {
    //   //   setSelectedTags(selectedTags.filter((id) => id !== tagId));
    //   //   append(tagId);
    //   //   remove(tagId);
    // } else {
    //   //   setSelectedTags([...selectedTags, tagId]);
    //   //   append(tagId);
    // }
  };

  const isSelected = (tagId: string) =>
    selectedTags.some((tag: any) => tag.tagId === tagId);

  return (
    <>
      <Tabs value={formTab} onValueChange={setFormTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details & Dates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              //   name="title"
              //   value={currentNews.title}
              //   onChange={handleTitleChange}
              //   value={getValues("title")}
              //   onChange={(e) => setValue("title", e.target.value)}
              {...formContext.register("title")}
              placeholder="Enter news title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL-friendly identifier)</Label>
            <Input
              id="slug"
              name="slug"
              //   value={currentNews.slug}
              //   onChange={handleInputChange}
              placeholder="auto-generated-slug"
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from title, but can be edited
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              //   name="description"
              //   value={currentNews.description}
              //   onChange={handleInputChange}
              //   value={getValues("description")}
              //   onChange={(e) => setValue("description", e.target.value)}
              {...formContext.register("description")}
              placeholder="Enter news description..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tagId) => {
                const tag = mockTags.find((t) => t.id === tagId.id);
                if (!tag) return null;
                return (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag.label}
                    <button
                      //   onClick={() => handleTagSelect(tag.id)}
                      className="rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search tags..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
              />
            </div>
            <ScrollArea className="h-32 border rounded-md p-2">
              <div className="space-y-2">
                {filteredTags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={isSelected(tag.id)}
                      onCheckedChange={() => handleTagSelect(tag.id)}
                    />
                    <Label htmlFor={`tag-${tag.id}`} className="cursor-pointer">
                      {tag.label}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="resolutionSource">Resolution Source URL</Label>
            <Input
              id="resolutionSource"
              name="resolutionSource"
              //   value={currentNews.resolutionSource}
              //   onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                // value={currentNews.startDate}
                // onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                // value={currentNews.endDate}
                // onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              //   value={currentNews.image}
              //   onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon URL</Label>
            <Input
              id="icon"
              name="icon"
              //   value={currentNews.icon}
              //   onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active</Label>
                <p className="text-sm text-muted-foreground">
                  Make this news post visible to users
                </p>
              </div>
              <Switch
                id="active"
                // checked={currentNews.active}
                // onCheckedChange={(checked) =>
                //   handleToggleChange("active", checked)
                // }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new">Mark as New</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight this as a new post
                </p>
              </div>
              <Switch
                id="new"
                // checked={currentNews.new}
                // onCheckedChange={(checked) =>
                //   handleToggleChange("new", checked)
                // }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="featured">Featured</Label>
                <p className="text-sm text-muted-foreground">
                  Show this post in featured sections
                </p>
              </div>
              <Switch
                id="featured"
                // checked={currentNews.featured}
                // onCheckedChange={(checked) =>
                //   handleToggleChange("featured", checked)
                // }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="restricted">Restricted</Label>
                <p className="text-sm text-muted-foreground">
                  Limit access to this post
                </p>
              </div>
              <Switch
                id="restricted"
                // checked={currentNews.restricted}
                // onCheckedChange={(checked) =>
                //   handleToggleChange("restricted", checked)
                // }
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

const NewsForm = ({
  showEditDialog,
  setShowEditDialog,
}: {
  showEditDialog: boolean;
  setShowEditDialog: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      startDate: "",
      endDate: "",
      active: false,
      featured: false,
      new: false,
      archived: false,
      restrict: false,
    },
  });
  const onSubmit = (values: any) => {
    console.log(values);
    toast.success("Added news successfully");
  };
  return (
    <DialogContent className="max-w-3xl">
      <FormProvider {...form}>
        <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit News Post</DialogTitle>
            <DialogDescription>
              Update the details of this news post.
            </DialogDescription>
          </DialogHeader>
          {/* {renderNewsForm()} */}
          <RenderNewsForm />
          <DialogFooter className="md:flex-row">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              //  onClick={handleSaveNews}
              type="submit"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </DialogContent>
  );
};

export default NewsForm;
