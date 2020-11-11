// Webpack uses this to work with directories
const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const FALLBACK_EMAIL = 'mobilna.online@gmail.com';

// This is the main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {

  // Path to your entry point. From this file Webpack will begin his work
  entry: './src/index.js',

  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'assets/js/bundle.js'
  },

  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on final bundle. For now we don't need production's JavaScript 
  // minifying and other thing so let's set mode to development
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.FALLBACK_EMAIL': JSON.stringify(Buffer.from(FALLBACK_EMAIL).toString('base64'))
    }),
    new CopyPlugin({
      patterns: [
        { from: 'static' },
      ],
    })
  ],
};
