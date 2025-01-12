import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin"; // 플러그인 import
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], // 린트 대상 파일
    languageOptions: {
      globals: globals.browser,
      parser: "@typescript-eslint/parser", // TypeScript 파서 설정
    },
    plugins: {
      "@typescript-eslint": tseslint, // 플러그인 등록
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // JavaScript 추천 규칙 포함
      ...tseslint.configs.recommended.rules, // TypeScript 추천 규칙 포함
      ...pluginReact.configs.flat.recommended.rules, // React 추천 규칙 포함
      "@typescript-eslint/no-empty-object-type": "off", // 해당 규칙 비활성화
    },
  },
];
