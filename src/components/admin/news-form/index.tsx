import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Save } from "lucide-react";
import React, { Dispatch, useEffect, useState } from "react";
import { Button } from "../../ui/button";

import { createMarket } from "@/actions/news";
import { newsFormSchema } from "@/schemas/news";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import NewsBasicForm from "./news-basic-form";
import NewsDetailsForm from "./news-details-form";
import NewsSettingForm from "./news-settings-form";
import { Market, News } from "@prisma/client";
import { format } from "date-fns";

// News form dialog content
const RenderNewsForm = () => {
  const [formTab, setFormTab] = useState("basic");
  //   const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const formContext = useFormContext();

  console.log(formContext.formState.errors);
  return (
    <>
      <Tabs value={formTab} onValueChange={setFormTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details & Dates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <NewsBasicForm />
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-4">
          <NewsDetailsForm />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <NewsSettingForm />
        </TabsContent>
      </Tabs>
    </>
  );
};

const NewsForm = ({
  showEditDialog,
  setShowEditDialog,
  initialState,
}: {
  showEditDialog: boolean;
  setShowEditDialog: Dispatch<React.SetStateAction<boolean>>;
  initialState: (News & { markets: Market[] }) | null | undefined;
}) => {
  const form = useForm({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      ...(initialState
        ? {
            title: initialState.title,
            slug: initialState.slug,
            description: initialState.description ?? "",
            image: initialState.image ?? "",
            icon: initialState.icon ?? "",
            startDate: format(new Date(initialState.startDate), "yyyy-MM-dd"),
            endDate: format(new Date(initialState.endDate), "yyyy-MM-dd"),
            active: initialState.isActive,
            new: initialState.isClosed,
            archived: false, // if you have this field elsewhere
            featured: false, // assume missing in DB
            restricted: initialState.isRestricted,
            tags: initialState.tags ?? [],
            variant: initialState.markets.length > 0,
            markets: initialState.markets.map((m) => ({
              title: m.title,
              question: m.question ?? "",
            })),
          }
        : {
            title: "",
            slug: "",
            description: "",
            image: "",
            icon: "",
            startDate: "",
            endDate: "",
            active: true,
            new: false,
            archived: false,
            featured: false,
            restricted: false,
            tags: [],
            variant: false,
            markets: [],
          }),
    },
  });

  useEffect(() => {
    if (initialState) {
      form.reset();
    }
  }, [initialState, form.reset]);
  const onSubmit = async (values: z.infer<typeof newsFormSchema>) => {
    try {
      const response = await createMarket(values);
      if (response.success === true) {
        toast.success("Added news successfully");
        form.reset();
        setShowEditDialog(false);
      } else if (response.errors) {
        // if (response.errors?._form.length) {
        //   toast.error(response.errors._form[0]);
        // }
      }
    } catch (error) {}
  };

  return (
    <DialogContent className="max-w-3xl max-h-[95vh]">
      <FormProvider {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          className="h-full max-h-[89vh] overflow-scroll scrollbar-hide"
        >
          <DialogHeader className="mb-2">
            <DialogTitle>Edit News Post</DialogTitle>
            <DialogDescription>
              Update the details of this news post.
            </DialogDescription>
          </DialogHeader>
          <RenderNewsForm />
          <DialogFooter className="md:flex-row">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              //  onClick={handleSaveNews}
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
              {form.formState.isSubmitting && (
                <Loader className="animate-spin ml-2" />
              )}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </DialogContent>
  );
};

export default NewsForm;
