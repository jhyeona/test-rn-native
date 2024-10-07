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
    'import/parsers': {
      '@typescript-eslint/parser': ['*.ts', '*.tsx'],
    },
    'import/resolver': {
      typescript: './tsconfig.json',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'off',
    '@typescript-eslint/no-unused-vars': 1,
    'react-refresh/only-export-components': 0,
    'react-hooks/exhaustive-deps': 0,
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['sibling', 'parent', 'index'],
          'type',
          'unknown',
        ],
        pathGroups: [
          {
            pattern: '{react*,react*/**}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '{@/**}',
            group: 'unknown',
            position: 'before',
          },
          {
            pattern: './**',
            group: 'unknown',
            position: 'after',
          },
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
      },
    ],
  },
};
