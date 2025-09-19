import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
   baseDirectory: __dirname,
});

const eslintConfig = [
   ...compat.extends("next/core-web-vitals", "next/typescript"),
   // Disable ESLint rules that conflict with Prettier formatting
   eslintConfigPrettier,
   // Run Prettier as an ESLint rule (surface formatting issues in `eslint` output)
   {
      plugins: {
         prettier: pluginPrettier,
         "no-relative-import-paths": noRelativeImportPaths,
      },
   },
   {
      ignores: [
         "node_modules/**",
         ".next/**",
         "out/**",
         "build/**",
         "next-env.d.ts",
         "public/registry/**",
         "src/generated/**",
         "prisma/**",
      ],
   },
];

export default eslintConfig;
