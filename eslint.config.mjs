import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        ...globals.jest,
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          varsIgnorePattern:
            "^(React|Text|View|TouchableOpacity|StatusBar|Modal|PlayerSection|width|height|App)$",
          argsIgnorePattern: "^_",
        },
      ],
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    ignores: ["node_modules/**", ".expo/**", "dist/**", "web/**"],
  },
];
