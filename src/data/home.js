/*
 * @Description: 首页数据
 * @Author: Dong Wei
 * @Date: 2020-12-19 16:45:59
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-23 16:26:28
 * @FilePath: \vue2x-playground\src\data\home.js
 */

export const homeList = [
  {
    title: 'echarts图形点击事件',
    createDate: '2020-12-19',
    LastEditDate: '',
    desc: '柱状图点击坐标轴指示器阴影部分获取到该列的信息',
    url: 'chartsClick'
  },
  {
    title: 'tab栏切换取消请求',
    createDate: '2020-12-23',
    LastEditDate: '',
    desc: 'tab栏切换时取消上一个tab执行的axios请求,如果是v-for渲染的tab项会出现重复渲染,如有需要可以配合v-if使用',
    url: 'tabSwitch'
  }
];
