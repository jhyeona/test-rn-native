import someConfig from "some-other-config-you-use";
import eslintConfigPrettier from "eslint-config-prettier";
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

export default [
  someConfig,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
];
