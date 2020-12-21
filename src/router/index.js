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
    path: '/chartsClick',
    name: 'ChartsClick',
    component: () => import(/* webpackChunkName: "ChartsClick" */ '@/views/echarts/clickEvent')
  }
];

const router = new VueRouter({
  routes
});

export default router;
