const webpack = require('webpack');

module.exports =   {
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
    },
    entry: {
      index: './functions/src/index.ts',
    },
    output: {
      path: process.cwd() + '/functions',
      filename: '[name].js',
      libraryTarget: "commonjs2"
    },
    resolve: {
      extensions: ['.js', '.ts']
    },
    externals: [
      {
        'firebase-functions': 'firebase-functions',
        'firebase-admin': 'firebase-admin',
        // './database/database': 'firebase-admin/lib/database/database', // for firebase-admin package.
        // './config': 'firebase-functions/lib/config',
      }
    ],
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    module: {
      loaders: [
        {
          test: /\.ts$/,
          loader: "awesome-typescript-loader",
          options: {
            configFileName: './functions/tsconfig.json'
          },
        },
      ],
    },
    // devtool: 'source-map',
  }