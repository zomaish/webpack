const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const DIST_FOLDER = "../dist";

module.exports = {
  entry: {
    "index": path.resolve(__dirname, "../src/app.js"),
  },
  watch: true,
  mode: "development",
  output: {
    path: path.resolve(__dirname, DIST_FOLDER),
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    publicPath: '/dist/'
  },
  resolve: {
    extensions: [".js"],
    alias: {
      '$saas': path.resolve(__dirname, '../src/saas'),
      'modules': path.resolve(__dirname, '../src/modules')
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
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/dist/'
            }
          },
          {
            loader: "css-loader",
            options: {
              modules: false,
              sourceMap: true,
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        use: [
          'file-loader',
        ]
      }
    ]
  },
  plugins: [
    new Dotenv({
      path: './env/.env.dev', // load this now instead of the ones in '.env'
      safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      defaults: false // load '.env.defaults' as the default values if empty.
    }),
    new CopyWebpackPlugin([
      { from: "./static/images", to: "images" }
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.template.html"),
      filename: path.resolve(__dirname, "../dist/index.html")
    }),
    new MiniCssExtractPlugin({
      filename: "style.css",
      chunkFilename: "[id].style.css"
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    compress: true,
    port: 8080,
    historyApiFallback: {
      index: "/dist/index.html"
    }
  }
};