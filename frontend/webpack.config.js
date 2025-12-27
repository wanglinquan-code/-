const path = require('path');

module.exports = {
  entry: './src/main.js', // 前端入口文件（必须和你的文件对应）
  output: {
    filename: 'bundle.js',
    // 修正1：输出路径改为 public 目录（而非public/dist），避免嵌套目录导致404
    path: path.resolve(__dirname, 'public'),
    // 修正2：publicPath设为根目录，确保浏览器从正确路径请求bundle.js
    publicPath: '/'
  },
  mode: 'development',
  devServer: {
    // 修正3：静态文件目录指向public（webpack-dev-server会从这里提供文件）
    static: {
      directory: path.resolve(__dirname, 'public'),
      publicPath: '/'
    },
    port: 8080,
    open: true,
    hot: true,
    // 跨域代理（保留原有）
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    },
    // 新增：解决404时的路由回退（可选，但能避免后续问题）
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};