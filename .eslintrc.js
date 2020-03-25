module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react", "prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        printWidth: 80,
        trailingComma: "es5",
        semi: true,
        jsxSingleQuote: true,
        singleQuote: true,
        tabWidth: 2,
        arrowParens: "avoid"
      }
    ]
  }
};