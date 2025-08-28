import js from "@eslint/js";
import pluginJest from "eslint-plugin-jest";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["dist/"],
  },
  {
    files: ["src/**/*.{js,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  tseslint.configs.recommended,
  {
    files: ["tests/**/*.{js,ts}"],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
  {
    extends: ["plugin:prettier/recommended"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "prettier/prettier": ["error", {}],
    },
  },
  eslintPluginPrettierRecommended,
]);
