export default function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word chars with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}
