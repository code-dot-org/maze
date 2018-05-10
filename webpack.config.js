const path = require("path");
const name = "maze";

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: name + ".js",
    library: name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  target: 'node',
  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
    }]
  },
  resolve: {
    extensions: [".js"],
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  devServer: { inline: true }
};
