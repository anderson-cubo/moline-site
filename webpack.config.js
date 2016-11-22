var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'public/dist/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
      { test: /\.html$/, loader: 'raw!html-minify' },
      {test: /\.json$/, loader: 'json-loader'}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'URL_API': JSON.stringify(process.env.URL_API || 'http://localhost:9700')
      }
    }),
    new ExtractTextPlugin('public/css/style.css', { allChunks: false })
  ]
}
