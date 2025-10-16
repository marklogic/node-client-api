/*
* Copyright (c) 2015-2025 Progress Software Corporation and/or its subsidiaries or affiliates. All Rights Reserved.
*/

// ESLint 9+ flat config
const globals = require("globals");

module.exports = [
  {
    // Base configuration for all JS files
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs", // Node.js uses CommonJS
      globals: {
        ...globals.commonjs,
        ...globals.node,
        ...globals.browser,  // Add browser globals like setTimeout
        structuredClone: "readonly",
        // Legacy globals from old config
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
      }
    },
    rules: {
      // Spacing and formatting
      "indent": "off", // TODO: Fix indentation in separate PR
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"],

      // Modern best practices
      "eqeqeq": "error",
      "curly": ["error", "all"], // Require braces for all control structures
      "no-unused-vars": "error",
      "no-undef": "error",

      // Spacing rules (disabled for initial setup - TODO: Fix in separate PR)
      "arrow-spacing": "off",
      "space-before-blocks": "off",
      "space-before-function-paren": "off",
      "space-in-parens": "off",
      "object-curly-spacing": "off",
      "keyword-spacing": "off",
      "comma-spacing": "off",
      "key-spacing": "off",
      "space-infix-ops": "off",

      // Style rules (disabled for initial setup - TODO: Fix in separate PR)
      "array-bracket-spacing": "off",
      "block-spacing": "off",
      "brace-style": "off",
      "func-call-spacing": "off",
      "no-trailing-spaces": "off",

      // Disable console errors for this project
      "no-console": "off",

      // Bracket notation preference
      "dot-notation": "error"
    }
  },
  {
    // Ignore patterns
    ignores: [
      "**/data/*.js",
      "node_modules/**",
      "coverage/**"
    ]
  }
];
