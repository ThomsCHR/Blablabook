export default [
    js.configs.recommended,
    {
      languageOptions: {
        globals: { ...globals.browser, ...globals.node },
      },
      rules: {
        "semi": "error",
        "indent": ["error", 2],
        "quotes": ["error", "double"],
        "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      }
    }
  ];
  