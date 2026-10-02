import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    ".next-editor/**",
    "out/**",
    "build/**",
    "node_modules-corrupt/**",
    "node_modules-partial*/**",
    "next-env.d.ts",
  ]),
]);
