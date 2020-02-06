'use strict';
module.exports = {
  extends: ['prettier', 'prettier/@typescript-eslint'],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    page: true,
  },
  rules: {},
};
