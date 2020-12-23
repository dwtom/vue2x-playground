<!--
 * @Description: tab切换组件1
 * @Author: Dong Wei
 * @Date: 2020-12-23 14:00:46
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-23 16:30:46
 * @FilePath: \vue2x-playground\src\views\axios\components\TabSwitchOne.vue
-->
<template>
    <div class="tab1 pos-rel">
      当前温度：{{weather?weather.temperature : ''}}℃&nbsp;{{weather?weather.info : ''}}&nbsp;{{weather?weather.direct : ''}}
      <Spin size="large" fix v-if="status.loading" />
    </div>
</template>

<script>
export default {
  name: 'TabSwitchOne',
  props: {
    weather: {
      type: Object,
      default: () => {}
    },
    status: {
      type: Object,
      default: () => {
        return {
          loading: false
        };
      }
    }
  },
  data() {
    return {
    };
  },
  methods: {}
};
</script>
<style scoped>

</style>