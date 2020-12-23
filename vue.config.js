const webpack = require('webpack');
const isPrduction = process.env.NODE_ENV === 'production';
module.exports = {
  transpileDependencies: [
    // 引入vue-echart
    'vue-echarts',
    'resize-detector'
  ],
  // 生产环境去除map文件
  productionSourceMap: false,
  // 开发环境打开css路径显示
  css: {
    sourceMap: !isPrduction
  },
  devServer: {
    open: true,
    port: 4751,
    // 接口代理
    proxy: {
      '/juhe': {
        target: 'http://v.juhe.cn',
        changOrigin: true,
        pathRewrite: {
          '^/juhe': ''
        }
      },
      '/oldjuhe': {
        target: 'http://apis.juhe.cn',
        changOrigin: true,
        pathRewrite: {
          '^/oldjuhe': ''
        }
      }
    }
  },
  configureWebpack: config => {
    const plugins = [];
    if (isPrduction) {
      // 生产环境去除console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      plugins.push(new webpack.DefinePlugin({
        '_JUHE_': JSON.stringify('http://v.juhe.cn'), // 需要服务端进行相关配置
        '_JUHEOLD_': JSON.stringify('http://apis.juhe.cn')
      }));
    } else {
      plugins.push(new webpack.DefinePlugin({
        '_JUHE_': JSON.stringify('/juhe'),
        '_JUHEOLD_': JSON.stringify('/oldjuhe')
      }));
    }
    config.plugins = [...config.plugins, ...plugins];
  }
};
