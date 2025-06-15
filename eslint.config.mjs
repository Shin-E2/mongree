import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin"; // 플러그인 import
import parserTypeScript from "@typescript-eslint/parser"; // TypeScript 파서 import
import pluginReact from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next"; // Next.js 플러그인 import

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], // 린트 대상 파일
    languageOptions: {
      globals: {
        ...globals.browser,
        // Node.js globals를 추가하여 process, Buffer 등 인식
        ...globals.node,
      },
      parser: parserTypeScript, // import한 파서 모듈 사용
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest", // 최신 ECMAScript 버전 사용
        sourceType: "module", // ES 모듈 사용
        jsxRuntime: "automatic", // React 17+에서 JSX 런타임을 자동으로 처리하도록 설정
      },
    },
    plugins: {
      "@typescript-eslint": tseslint, // 플러그인 등록
      react: pluginReact, // 'react' 플러그인 등록
      "@next/next": nextPlugin, // Next.js 플러그인 등록
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // JavaScript 추천 규칙 포함
      ...tseslint.configs.recommended.rules, // TypeScript 추천 규칙 포함
      ...pluginReact.configs.flat.recommended.rules, // React 추천 규칙 포함
      ...nextPlugin.configs["core-web-vitals"].rules, // Next.js 핵심 웹 바이탈 규칙 추가
      "@typescript-eslint/no-empty-object-type": "off", // 해당 규칙 비활성화
      // react/react-in-jsx-scope 규칙 비활성화
      "react/react-in-jsx-scope": "off",
      // React 버전 설정을 추가하여 경고 제거
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "off",
      // Component definition is missing display name 규칙 비활성화 - Next.js 컴포넌트에서 자주 발생
      "react/display-name": "off",
      // @typescript-eslint/no-explicit-any 규칙을 warn으로 설정하여 개발 편의성을 높임
      "@typescript-eslint/no-explicit-any": "warn",
      // 불필요한 escape character 경고 해제
      "no-useless-escape": "off",
      // Optional chain expressions can return undefined by design - using a non-null assertion is unsafe and wrong. 해결
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      // 사용되지 않는 변수 경고
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "no-undef": "warn", // no-undef 오류를 경고로 낮춰 다른 문제 해결에 집중
    },
    settings: {
      react: {
        version: "detect", // 설치된 React 버전 자동 감지
      },
    },
  },
];
