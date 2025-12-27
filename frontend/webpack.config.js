const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: '/'
  },
  mode: 'development',
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 8080,
    open: true,
    hot: true,
    // 跨域代理（前端请求/api自动转发到后端3001端口）
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
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
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};