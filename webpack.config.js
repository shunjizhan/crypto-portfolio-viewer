const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'crypto-portfolio-viwer.bundle.js',
  },
  resolve: {
    // our code can resolve 'xxx' instead of writing 'xxx.jsx'
    extensions: ['*', '.js'],
  },
  module: {
    // For every file that match regex in 'test', webpack pipes the code through to loaders
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new BundleAnalyzerPlugin(),
  ],
};
