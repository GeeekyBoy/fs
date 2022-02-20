const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const sassResourcesLoader = require("craco-sass-resources-loader");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  reactScriptsVersion: "react-scripts",
  plugins: [
    {
      plugin: sassResourcesLoader,
      options: {
        resources: "./src/scss/shared.scss",
      },
    }
  ],
  webpack: {
    configure: {
      plugins: [
        new CompressionPlugin({
          test: process.argv.includes('--no-compression') ? /^$/g : undefined
        }),
        // new BundleAnalyzerPlugin()
      ],
      resolve: {
        alias: {      // Must be below test-utils
          "react/jsx-dev-runtime": "preact/jsx-runtime",     // Must be below test-utils
          "react-dom/jsx-dev-runtime": "preact/jsx-runtime",
          "react": "preact/compat",
          "react-dom/test-utils": "preact/test-utils",
          "react-dom": "preact/compat",     // Must be below test-utils
          "react/jsx-runtime": "preact/jsx-runtime"
        },
        fallback: {
          stream: require.resolve("stream-browserify"),
        },
      },
      module: {
        rules: [
          {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
    },
  },
};
