const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const mode = process.env.MODE;

module.exports = {
  mode,
  target: 'node',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'crypto-portfolio-viwer.bundle.js',
    libraryTarget: 'umd',
    globalObject: 'this',
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
    // new BundleAnalyzerPlugin(),
  ],
};
