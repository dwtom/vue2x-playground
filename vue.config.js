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
    port: 4751
  },
  configureWebpack: config => {
    if (isPrduction) {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }
  }
};
