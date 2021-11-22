/*
 * @Description: 首页数据
 * @Author: Dong Wei
 * @Date: 2020-12-19 16:45:59
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-11-22 15:49:57
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
    desc: 'tab栏切换时取消上一个tab执行的axios请求，如果是v-for渲染的tab项会出现重复渲染，如有需要可以配合v-if使用',
    url: 'tabSwitch'
  },
  {
    title: 'iview-Table组件行/列合并',
    createDate: '2020-12-24',
    LastEditDate: '',
    desc: '使用iview的table组件的span-method方法进行行列合并，接口返回的数据需要预先处理',
    url: 'tableCombine'
  },
  {
    title: 'g6关系图隐藏节点的计算',
    createDate: '2020-12-24',
    LastEditDate: '',
    desc: '使用antv/g6的dagre布局，隐藏部分节点后对剩下的节点进行关系的重新计算，节点间的新关系需要所有的排列组合',
    url: 'dragreRelationship'
  },
  {
    title: 'grid布局学习',
    createDate: '2020-12-24',
    LastEditDate: '',
    desc: '',
    url: 'cssGrid'
  },
  {
    title: '动态设置n行文本末尾省略号',
    createDate: '2020-12-25',
    LastEditDate: '',
    desc: '利用clamp.js实现',
    url: 'ellipsis'
  },
  {
    title: 'fetch学习',
    createDate: '2020-12-28',
    LastEditDate: '',
    desc: 'fetch基本用法以及取消请求',
    url: 'learnFetch'
  },
  {
    title: 'echarts自定义样式仪表盘',
    createDate: '2021-01-07',
    LastEditDate: '',
    desc: '',
    url: 'chartsGauge'
  },
  {
    title: 'iview表格内容展开',
    createDate: '2021-02-23',
    LastEditDate: '',
    desc: '展开的内容通过组件引入',
    url: 'tableExpand'
  },
  {
    title: 'dom元素拖拽缩放加canvas连线',
    createDate: '2021-03-04',
    LastEditDate: '',
    desc: '基于vue-grid-layout',
    url: 'draggableContent'
  },
  {
    title: 'dom元素拖拽缩放加canvas连线（fabric.js实现）',
    createDate: '2021-03-09',
    LastEditDate: '',
    desc: 'canvas使用fabric.js',
    url: 'draggableContentByFabric'
  },
  {
    title: 'vue-grid-layout测试',
    createDate: '2021-03-09',
    LastEditDate: '',
    desc: 'vue-grid-layout测试',
    url: 'draggableTest'
  },
  {
    title: '封装iview的table组件',
    createDate: '2021-11-22',
    LastEditDate: '',
    desc: '"BaseTable"组件的封装优化，不需要默认值的属性直接从应用层“穿透传入”iview的table组件中，基于inheritAttrs以及v-bind实现',
    url: 'tableComponent'
  }
];
