module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard-with-typescript', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['no-only-tests'],
  ignorePatterns: [
    'src',
    'wwwroot',
    'node_modules/**',
    'mochawesome-report/assets/*',
    'cypress/_examples/*',
    '.eslintrc.js',
  ],
  plugins: ['eslint-plugin-prettier', 'no-only-tests'],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'no-only-tests/no-only-tests': 'error',
    'prettier/prettier': 'error',
  },
};
