import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
import storybook from "eslint-plugin-storybook";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  ...storybook.configs["flat/recommended"],
];

export default eslintConfig;
