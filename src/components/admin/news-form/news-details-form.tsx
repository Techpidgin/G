import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Loader2, Upload, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const NewsDetailsForm = () => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  // Cloudinary upload function

  const newsForm = useFormContext();

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            {...newsForm.register("startDate")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" type="date" {...newsForm.register("endDate")} />
        </div>
      </div>

      <ImageUploadField type="image" form={newsForm} />
      <ImageUploadField type="icon" form={newsForm} />

      {/* <div className="space-y-2">
        <Label>Main Image</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            uploadingImage
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDrop={(e) => handleDrop(e, "image")}
          onDragOver={handleDragOver}
        >
          {currentNews.image ? (
            <div className="space-y-2">
              <div className="relative inline-block">
                <img
                  src={currentNews.image || "/placeholder.svg"}
                  alt="Uploaded image"
                  className="max-w-full max-h-32 rounded-lg object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => removeImage("image")}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Image uploaded successfully
              </p>
            </div>
          ) : uploadingImage ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">
                Uploading image...
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Drop your image here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                className="hidden"
                id="image-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={uploadingImage}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Icon Image</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            uploadingIcon
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDrop={(e) => handleDrop(e, "icon")}
          onDragOver={handleDragOver}
        >
          {currentNews.icon ? (
            <div className="space-y-2">
              <div className="relative inline-block">
                <img
                  src={currentNews.icon || "/placeholder.svg"}
                  alt="Uploaded icon"
                  className="max-w-full max-h-16 rounded-lg object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => removeImage("icon")}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Icon uploaded successfully
              </p>
            </div>
          ) : uploadingIcon ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Uploading icon...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Drop your icon here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 5MB (square recommended)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "icon")}
                className="hidden"
                id="icon-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("icon-upload")?.click()}
                disabled={uploadingIcon}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Icon
              </Button>
            </div>
          )}
        </div>
      </div> */}
    </>
  );
};

// Image upload component
const ImageUploadField = ({
  type,
  form,
}: {
  type: "image" | "icon";
  form: any;
}) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const currentValue = form.watch(type);
  const isUploading = type === "image" ? uploadingImage : uploadingIcon;

  // Cloudinary upload function
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "predictmarket_uploads");
    formData.append("cloud_name", "your_cloud_name");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File, type: "image" | "icon") => {
    if (type === "image") {
      setUploadingImage(true);
    } else {
      setUploadingIcon(true);
    }

    try {
      const url = await uploadToCloudinary(file);
      form.setValue(type, url);

      toast("Upload successful", {
        description: `${
          type === "image" ? "Image" : "Icon"
        } uploaded successfully.`,
      });
    } catch (error) {
      toast.error("Upload failed", {
        description: `Failed to upload ${type}. Please try again.`,
      });
    } finally {
      if (type === "image") {
        setUploadingImage(false);
      } else {
        setUploadingIcon(false);
      }
    }
  };

  // Handle drag and drop
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: "image" | "icon"
  ) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      handleImageUpload(imageFile, type);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle file input change
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "icon"
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file, type);
    }
  };

  // Remove uploaded image
  const removeImage = (type: "image" | "icon") => {
    form.setValue(type, "");
  };

  return (
    <FormField
      control={form.control}
      name={type}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {type === "image" ? "Main Image" : "Icon Image"}
          </FormLabel>
          <FormControl>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isUploading
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDrop={(e) => handleDrop(e, type)}
              onDragOver={handleDragOver}
            >
              {currentValue ? (
                <div className="space-y-2">
                  <div className="relative inline-block">
                    <img
                      src={currentValue || "/placeholder.svg"}
                      alt={`Uploaded ${type}`}
                      className={`max-w-full rounded-lg object-cover ${
                        type === "image" ? "max-h-32" : "max-h-16"
                      }`}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(type)}
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {type} uploaded successfully
                  </p>
                </div>
              ) : isUploading ? (
                <div className="space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Uploading {type}...
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Drop your {type} here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to {type === "image" ? "10MB" : "5MB"}
                      {type === "icon" && " (square recommended)"}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, type)}
                    className="hidden"
                    id={`${type}-upload`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById(`${type}-upload`)?.click()
                    }
                    disabled={isUploading}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Choose {type}
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NewsDetailsForm;
