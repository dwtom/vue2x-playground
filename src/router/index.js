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
      }
    ]
  }
  
];

const router = new VueRouter({
  routes
});

export default router;
