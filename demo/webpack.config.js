const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, 'playground.js'),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'demo.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
    }, {
      test: /\.png$/,
      loader: 'file-loader',
    }]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
