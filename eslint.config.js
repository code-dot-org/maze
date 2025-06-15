import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import love from "eslint-config-love";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ...love,
    files: ["src/*.{js,mjs,cjs,ts}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: ["dist/*", "eslint.config.js", "esbuild.bundle.js"],
  },
  {
    languageOptions: { globals: globals.browser }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
