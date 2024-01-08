module.exports = {
  root: true,
  plugins: [
    "jsx-a11y",
    "react",
    "import"
  ],
  parser: "@typescript-eslint/parser",
  extends: [
    "@react-native",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:import/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "eslint:recommended",
    "some-other-config-you-use",
    "prettier",
  ],
  rules: {
    "jsx-a11y/rule-name": 2,
    "indent:": "error",
  },
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    }
  }
};
