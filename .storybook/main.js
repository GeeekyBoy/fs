module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["../src/public"],
  core: {
    builder: "webpack5",
  },
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "storybook-addon-breakpoints",
    "storybook-addon-performance/register"
  ]
};
