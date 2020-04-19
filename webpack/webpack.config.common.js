const path = require("path");
const webpackMerge = require("webpack-merge");

module.exports = webpackMerge(
  {},
  {
    entry: {
      main: path.resolve(__dirname, "../src/index.tsx"),
    },
    output: {
      path: path.resolve(__dirname, "../dist"),
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
    },
  }
);
