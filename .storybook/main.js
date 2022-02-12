const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["../public"],
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
  ],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.map((rule) => {
      if (rule.oneOf) {
        rule.oneOf = rule.oneOf.slice().map((subRule) => {
          if (subRule.test instanceof RegExp && (subRule.test.test(".module.scss") || subRule.test.test(".scss"))) {
            return {
              ...subRule,
              use: [
                ...subRule.use,
                {
                  loader: require.resolve("sass-resources-loader"),
                  options: {
                    resources: [
                      path.resolve(__dirname, "../src/scss/shared.scss"),
                    ],
                  },
                },
              ],
            };
          }
          return subRule;
        });
      }
      return rule;
    });
    return config;
  },
};
