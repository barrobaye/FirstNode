const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/app.ts', // Adjust if your entry point is different
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "url": require.resolve("url/"),
      "vm": require.resolve("vm-browserify"),
      "assert": require.resolve("assert/"),
      "tty": require.resolve("tty-browserify"),
      "net": require.resolve("net-browserify"),
      "fs": false,
      "child_process": false,
      "fs/promises": false,
      "util": require.resolve("util/"),
      "zlib": require.resolve("browserify-zlib"),
      "querystring": require.resolve("querystring-es3"),
      "async_hooks": false,
    },
  },
};
