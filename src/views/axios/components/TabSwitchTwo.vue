<!--
 * @Description: tab切换组件2
 * @Author: Dong Wei
 * @Date: 2020-12-23 14:00:46
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-23 15:29:37
 * @FilePath: \vue2x-playground\src\views\axios\components\TabSwitchTwo.vue
-->
<template>
    <div class="pos-rel">
      <ul>
        <li
          v-for="(item, index) in list"
          :key="`news-${index}`"
          class="news-item"
        >
          <a :href="item.url" target="blank">{{item.title}}</a>
        </li>
      </ul>
      <Spin size="large" fix v-if="status.loading" />
    </div>
</template>

<script>
export default {
  name: 'TabSwitchTwo',
  props: {
    list: {
      type: Array,
      default: () => []
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
<style scoped lang="less">
.news-item{
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
}
</style>