# Cloudinary Setup Instructions

## 1. Create a Cloudinary Account

- Go to https://cloudinary.com and sign up for a free account
- Note your Cloud Name from the dashboard

## 2. Create an Upload Preset

1. Go to Settings > Upload in your Cloudinary dashboard
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Set the following:
   - Preset name: `predictmarket_uploads`
   - Signing Mode: `Unsigned`
   - Folder: `predictmarket/news` (optional)
   - Allowed formats: `jpg,png,gif,webp`
   - Max file size: `10000000` (10MB)
   - Max image width: `2000`
   - Max image height: `2000`
5. Save the preset

## 3. Update Environment Variables

Replace the values in `.env.local`:

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your actual cloud name
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Should be `predictmarket_uploads`

## 4. Update the Upload Function

In `components/admin/news-manager.tsx`, replace:

- `your_cloud_name` with your actual Cloudinary cloud name
- The upload preset should already be set to `predictmarket_uploads`

## 5. Optional: Add Transformations

You can add automatic transformations in the upload function:

- For main images: `f_auto,q_auto,w_800,h_600,c_fill`
- For icons: `f_auto,q_auto,w_100,h_100,c_fill`

This will automatically optimize images and create consistent sizes.
