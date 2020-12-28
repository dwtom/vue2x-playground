/*
 * @Description: 首页数据
 * @Author: Dong Wei
 * @Date: 2020-12-19 16:45:59
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-28 10:20:25
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
  }
];
