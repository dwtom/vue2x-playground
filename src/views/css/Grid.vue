<!--
 * @Description: grid布局
 * @Author: Dong Wei
 * @Date: 2020-12-24 14:47:38
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-28 15:36:36
 * @FilePath: \vue2x-playground\src\views\css\Grid.vue
-->
<template>
  <Tabs value="tab1">
    <TabPane
      label="圣杯布局"
      name="tab1"
    >
      <div class="tab1-wrap">
        <div class="left"></div>
        <div class="center"></div>
        <div class="right"></div>
      </div>
    </TabPane>
    <!-- 实现类似flex的常规布局 -->
    <TabPane
      label="常规布局"
      name="tab2"
    >
      <ul class="flex-to-grid">
        <li
          v-for="(item, index) in gridarrs"
          :key="index"
          class="tab2-item"
        >
          {{item}}
        </li>
      </ul>
    </TabPane>
    <!-- iview的栅格布局 -->
    <TabPane
      label="iview栅格布局"
      name="tab3"
    >
      <Row :gutter="16">
        <i-col
          v-for="(item, index) in gridarrs"
          :key="index"
          span="6"
          class="icol-item"
        >
          {{item}}
        </i-col>
      </Row>
    </TabPane>
  </Tabs>
</template>

<script>
export default {
  name: 'LearnGridLayout',
  data() {
    return {
      gridarrs: [1, 2, 3, 4, 5, 6]
    };
  },
  methods: {}
};
</script>
<style scoped lang="less">
.tab1-wrap{
  display: grid;
  grid-template-columns: 100px auto 100px;
  &:nth-child(n) {
    height: 100%
  }
}
.left{
  background-color: navy;
}
.center{
  border: 1px solid #000;
}
.right{
  background-color: skyblue;
}
.flex-to-grid{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 16px;
  row-gap: 12px;
}
.tab2-item{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  border: 1px solid #000;
}
.icol-item{
  height: 200px;
  // border: 1px solid #000;
  background: steelblue;
  margin-bottom: 12px;
  &:not(:last-of-type) {
    margin-right: 12px;
  }
}
</style>