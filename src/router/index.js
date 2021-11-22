import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    name: 'NormalLayout',
    path: '/article',
    component: () => import(/* webpackChunkName: "NormalLayout" */ '@/layout/NormalLayout'),
    children: [
      {
        path: 'chartsClick',
        name: 'ChartsClick',
        component: () => import(/* webpackChunkName: "ChartsClick" */ '@/views/echarts/ClickEvent')
      },
      {
        path: 'chartsGauge',
        name: 'ChartsGauge',
        component: () => import(/* webpackChunkName: "ChartsGauge" */ '@/views/echarts/Gauge')
      },
      {
        path: 'tabSwitch',
        name: 'TabSwitch',
        component: () => import(/* webpackChunkName: "TabSwitch" */ '@/views/axios/TabSwitch')
      },
      {
        path: 'tableCombine',
        name: 'TableCombine',
        component: () => import(/* webpackChunkName: "TableCombine" */ '@/views/iview/TableCombine')
      },
      {
        path: 'tableExpand',
        name: 'TableExpand',
        component: () => import(/* webpackChunkName: "TableExpand" */ '@/views/iview/TableExpand')
      },
      {
        path: 'dragreRelationship',
        name: 'DragreRelationship',
        component: () => import(/* webpackChunkName: "DragreRelationship" */ '@/views/g6/DragreRelationship')
      },
      {
        path: 'cssGrid',
        name: 'CssGrid',
        component: () => import(/* webpackChunkName: "CssGrid" */ '@/views/css/Grid')
      },
      {
        path: 'ellipsis',
        name: 'Ellipsis',
        component: () => import(/* webpackChunkName: "Ellipsis" */ '@/views/css/Ellipsis')
      },
      {
        path: 'learnFetch',
        name: 'LearnFetch',
        component: () => import(/* webpackChunkName: "LearnFetch" */ '@/views/fetch/BaseFetch')
      },
      {
        path: 'draggableContent',
        name: 'DraggableContent',
        component: () => import(/* webpackChunkName: "draggable" */ '@/views/draggable/DragAndLine')
      },
      {
        path: 'draggableContentByFabric',
        name: 'DraggableContentByFabric',
        component: () => import(/* webpackChunkName: "draggable" */ '@/views/draggable/DragAndLineNew')
      },
      {
        path: 'draggableTest',
        name: 'DraggableTest',
        component: () => import(/* webpackChunkName: "draggable" */ '@/views/draggable/DragTest')
      },
      {
        path: 'tableComponent',
        name: 'TableComponent',
        component: () => import(/* webpackChunkName: "tableComponent" */ '@/views/iview/TableComponent')
      }
    ]
  }

];

const router = new VueRouter({
  routes
});

export default router;
