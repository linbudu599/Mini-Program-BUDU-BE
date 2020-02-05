'use strict';
module.exports = {
  extends: [
    'prettier',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    page: true,
  },
  rules: {
    'generator-star-spacing': 0,
    'function-paren-newline': 0,
    'import/order': 'warn',
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'off',
    'import/prefer-default-export': 'off',
    'import/no-default-export': [0, 'camel-case'],
    // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    // Use function hoisting to improve code readability
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    // Makes no sense to allow type inferrence for expression parameters, but require typing the response
    '@typescript-eslint/explicit-function-return-type': [
      'off',
      { allowTypedFunctionExpressions: true },
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
    '@typescript-eslint/no-var-requires': 0,
    // Common abbreviations are known and readable
    'unicorn/prevent-abbreviations': 'off',
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    semi: ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 'off',
    'import/no-cycle': 0,
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': 1,
    'object-curly-newline': 0,
    'implicit-arrow-linebreak': 0,
    'operator-linebreak': 0,
    'eslint-comments/no-unlimited-disable': 1,
    'no-param-reassign': 1,
    'space-before-function-paren': 0,
  }
};
