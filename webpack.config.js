const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/playground.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: "babel-loader",
    }]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  devServer: { inline: true }
};
