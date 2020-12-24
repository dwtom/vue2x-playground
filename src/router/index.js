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
        path: 'dragreRelationship',
        name: 'DragreRelationship',
        component: () => import(/* webpackChunkName: "DragreRelationship" */ '@/views/g6/DragreRelationship')
      }
    ]
  }
  
];

const router = new VueRouter({
  routes
});

export default router;
