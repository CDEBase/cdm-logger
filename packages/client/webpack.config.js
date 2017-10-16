var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');

const libPath = function (name) {
  if (undefined === name) {
    return path.join('dist');
  }

  return path.join('lib', name);
};
var webpack_opts = {
  entry: './src/index.ts',
  target: 'node',
  output: {
    filename: libPath('index.js'),
    libraryTarget: 'commonjs2',
    library: '@cdm-logger/client',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'src',
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.ts$/,
        ts: {
          compiler: 'typescript',
          configFileName: 'tsconfig.json'
        },
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    })
  ],
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader'
    }]
  },
  externals: [nodeExternals({ modulesDir: "../../node_modules", whitelist: "bunyan" }),
  { "@cdm-logger/core": "@cdm-logger/core" }]
};

module.exports = webpack_opts;