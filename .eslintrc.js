module.exports = {
  root: true,
  plugins: ['jsx-a11y', 'react', 'import'],
  parser: '@typescript-eslint/parser',
  extends: [
    '@react-native',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'eslint:recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};
