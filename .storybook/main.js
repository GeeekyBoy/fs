const { mergeConfig } = require('vite');
const svgr = require('vite-plugin-svgr');

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["../src/public"],
  core: {
    builder: "@storybook/builder-vite",
  },
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  async viteFinal(config) {
    return mergeConfig(config, {
      define: {
        global: "window",
      },
      plugins: [svgr({ svgrOptions: { ref: true } })],
    });
  },
};
