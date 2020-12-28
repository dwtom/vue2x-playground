<!--
 * @Description: tab切换时接口请求取消
 * @Author: Dong Wei
 * @Date: 2020-12-23 09:30:44
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-24 15:23:29
 * @FilePath: \vue2x-playground\src\views\axios\TabSwitch.vue
-->
<template>
  <div>
    <Tabs v-model="tabValue">
      <TabPane
        label="天气预报"
        name="weatherForecast"
      >
        <TabSwitchOne
          :weather="realtimeWeather"
          :status="status"
        />
      </TabPane>
      <TabPane
        label="头条新闻列表"
        name="news"
      >
        <TabSwitchTwo
          :list="newsList"
          :status="status"
        />
      </TabPane>
      <TabPane
        label="标签三"
        name="name3"
      >标签三的内容</TabPane>
    </Tabs>
  </div>
</template>

<script>
import * as Api from '@/api';
import TabSwitchOne from './components/TabSwitchOne';
import TabSwitchTwo from './components/TabSwitchTwo';
export default {
  name: 'TabSwitch',
  components: {
    TabSwitchOne,
    TabSwitchTwo
  },
  data() {
    return {
      tabValue: 'weatherForecast',
      newsList: [],
      realtimeWeather: {},
      status: {
        loading: false
      }
    };
  },
  watch: {
    tabValue: {
      handler(newVal) {
        switch (newVal) {
        case 'news':{
          this.getNewsTop10();
          break;
        }
        case 'weatherForecast':{
          this.getWather();
          break;
        }
        default:
          break;
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取新闻头条
    getNewsTop10() {
      if (typeof (Api.cancelRequest) === 'function') {
        Api.cancelRequest();
      }
      this.status.loading = true;
      setTimeout(async () => {
        try {
          const res = await Api.getTopNewsData();
          if (res.data.result?.data) {
            this.newsList = res.data.result.data.slice(0, 10);
          }
        } catch (error) {
          console.log(error);
        }
        this.status.loading = false;
      }, 0);
      
    },
    // 获取天气
    getWather() {
      if (typeof (Api.cancelRequest) === 'function') {
        Api.cancelRequest();
      }
      this.status.loading = true;
      setTimeout(async() => {
        try {
          const res = await Api.getWeaterForcastData({ city: '杭州' });
          if (res.data.result?.realtime) {
            this.realtimeWeather = res.data.result.realtime;
          }
        } catch (error) {
          console.log(error);
        }
        this.status.loading = false;
      }, 0);
      
    }
  }
};
</script>
<style scoped lang="less">
.news-item{
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
}
</style>