<!--
 * @Description: 表格展开的内容
 * @Author: Dong Wei
 * @Date: 2021-02-23 10:19:34
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-02-23 10:26:50
 * @FilePath: \vue2x-playground\src\views\iview\components\TableExpandContent.vue
-->
<template>
  <div>
    <ul>
      <li
        v-for="(item, index) in row.list"
        :key="`tableExpandList-${index}`"
      >{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TableExpandContent',
  props: {
    row: Object
  }
};
</script>
<style scoped>

</style>