<!--
 * @Description: filename
 * @Author: Dong Wei
 * @Date: 2021-02-25 16:14:52
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-02-25 16:30:33
 * @FilePath: \vue2x-playground\src\views\finance\fund.vue
-->
<template>
  <div>fund</div>
</template>

<script>
import * as service from './service';
export default {
  name: 'Fund',
  data() {
    return {
    };
  },
  created() {
    this.initRank();
  },
  methods: {
    async initRank() {
      await service.getFundRank();
    }
  }
};
</script>
<style scoped>

</style>