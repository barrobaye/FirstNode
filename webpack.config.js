const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/server.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      "net": require.resolve("net-browserify"),
      "tty": require.resolve("tty-browserify"),
    }
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
  externals: {
    express: 'commonjs express',  // Exclude express from the bundle
  },
  
};
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  // autres configurations...
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
