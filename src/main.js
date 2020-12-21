import Vue from 'vue';
import App from './App.vue';
import router from './router';

// 全局样式
import '@/style/index.js';

// 插件
import '@/plugins';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
