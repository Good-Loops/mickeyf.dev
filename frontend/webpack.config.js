const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: ["./public/src/index.ts"],
    circleAnim: ["./public/src/circleAnim.ts"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public", "dist"),
  },
};