module.exports = {
  output: {
    library: {
      type: 'umd'
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
    }]
  },
};
