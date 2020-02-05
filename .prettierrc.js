"use strict";

module.exports = {
  // 一行最多 100 字符
  printWidth: 100,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: "as-needed",
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾不需要逗号
  trailingComma: "all",
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  proseWrap: "never",
  endOfLine: "lf",
  overrides: [
    {
      files: ".prettierrc",
      options: {
        parser: "json"
      }
    }
  ]
};
