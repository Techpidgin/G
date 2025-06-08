import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-css-tags": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-sync-scripts": "off",
      //typescript
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/await-thenable": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/type-annotation-spacing": "error",
    },
  },
];

export default eslintConfig;
