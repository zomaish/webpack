const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const DIST_FOLDER = "../dist";

module.exports = {
  entry: {
    "index": path.resolve(__dirname, "../src/app.js"),
  },
  watch: false,
  devtool: "source-map",
  mode: "production",
  output: {
    path: path.resolve(__dirname, DIST_FOLDER),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].chunk.[contenthash].js",
    publicPath: "/dist/"
  },
  optimization: {
    splitChunks: {
      chunks: "initial",
    },
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
        exclude: /\/excludes/,
        sourceMap: true,
        extractComments: true,
        terserOptions: {
          ie8: false,
          safari10: false
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
  },
  resolve: {
    extensions: [".js"],
    alias: {
      '$saas': path.resolve(__dirname, '../src/saas')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true
          }
        }
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: false,
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new Dotenv({
      path: './env/.env.staging', // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: false, // hide any errors
      defaults: false // load '.env.defaults' as the default values if empty.
    }),
    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname, "../"),
      verbose: true,
      dry: false
    }),
    new MiniCssExtractPlugin({
      filename: "style.[contenthash].css",
      chunkFilename: "[id].style.[contenthash].css"
    }),
    new CopyWebpackPlugin([
      { from: './static/images', to: 'images' }
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.template.html"),
      filename: path.resolve(__dirname, "../src/index.html")
    })
  ]
};
