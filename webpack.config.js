const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// @ts-ignore
process.traceDeprecation = true;

const mode = process.env.NODE_ENV || 'development';
const isInDevMode = mode === 'development';

module.exports = {
  stats: 'minimal',
  externals: {
    chrome: 'chrome'
  },
  devtool: 'source-map',
  mode,
  target: 'node-webkit',
  entry: (() => {
    const entries = [];
    if (isInDevMode) {
      entries.push(
        'webpack-dev-server/client?http://127.0.0.1:8080',
        'webpack/hot/only-dev-server'
      );
    }
    entries.push(path.resolve(__dirname, 'src/app.js'));
    return entries;
  })(),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.dist.js'
  },
  plugins: (() => {
    const plugins = [
      new CleanWebpackPlugin([ path.resolve(__dirname, 'dist') ], {
        exclude: [ '.gitkeep' ],
        verbose: false
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
        filename: 'index.html'
      }),
      new CopyWebpackPlugin([
        path.resolve(__dirname, 'src/icon.png')
      ])
    ];
    if (isInDevMode) {
      plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
      );
    }
    return plugins;
  })(),
  ...(() => {
    if (isInDevMode) {
      return {
        devServer: {
          historyApiFallback: true,
          hot: true,
          stats: 'minimal',
          watchContentBase: true,
          contentBase: path.join(__dirname, 'src')
        }
      };
    }
    return {};
  })()
};
