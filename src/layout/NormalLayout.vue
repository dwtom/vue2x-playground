<!--
 * @Description: 常规布局
 * @Author: Dong Wei
 * @Date: 2020-12-22 15:51:31
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-23 09:38:39
 * @FilePath: \vue2x-playground\src\layout\NormalLayout.vue
-->
<template>
    <div class="main">
      <div class="top-bar">
        <Button icon="ios-arrow-back" @click="backHome">首页</Button>
        <h5 class="title">{{pageTitle}}</h5>
      </div>
      <router-view />
    </div>
</template>

<script>
export default {
  name: 'NormalLayout',
  data() {
    return {};
  },
  computed: {
    pageTitle() {
      return this.$route.query.title;
    }
  },
  methods: {
    backHome() {
      this.$router.push('/');
    }
  }
};
</script>
<style scoped>
.main{
  padding: 0 16px;
}
.top-bar{
  display: flex;
  align-items: center;
  margin: 16px 0;
}
.title{
  margin-left: 12px;
  font-size: 22px;
}
</style>