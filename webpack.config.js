const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// @ts-ignore
process.traceDeprecation = true;

module.exports = {
  stats: 'minimal',
  externals: {
    "chrome": "chrome"
  },
  devtool: "source-map",
  mode: process.env.NODE_ENV || 'development',
  target: "node-webkit",
  entry: [
    path.resolve(__dirname, 'src/app.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.dist.js'
  },
  plugins: [
    new CleanWebpackPlugin([ path.resolve(__dirname, 'dist') ], {
      exclude: [ '.gitkeep' ],
      verbose: false
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html'
    })
  ]
};