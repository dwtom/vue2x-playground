<!--
 * @Description: fetch学习
 * @Author: Dong Wei
 * @Date: 2020-12-28 15:49:32
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-29 14:18:59
 * @FilePath: \vue2x-playground\src\views\fetch\BaseFetch.vue
-->
<template>
  <div>
    <pre
      v-for="(item, index) in response"
      :key="`response-${index}`"
    >
      {{item.key}}：{{item.value}}
    </pre>
  </div>
</template>

<script>
import * as tools from '@/utils/tools';
export default {
  name: 'BaseFetch',
  data() {
    return {
      response: []
    };
  },
  created() {
    // this.getTopNews();
  },
  methods: {
    async getTopNews() {
      // 取消fetch请求
      const abortController = new AbortController();
      setTimeout(() => {
        abortController.abort();
      }, 200);
      
      const url = `${_JUHE_}/toutiao/index?key=4aef0910519190988f0c58346007b8b0`;
      // const postUrl = `${_JUHE_}/toutiao/index`;
      // const params = { key: '4aef0910519190988f0c58346007b8b0' };
      try {
        const res = await fetch(url, {
          method: 'get',
          signal: abortController.signal
        });
        console.log(res);
        const resJson = await res.json(); // response对象读取内容的方法都是异步的
        // forof中的res.headers等同于res.headers.entries();返回的是一个键值对数组
        // for (let [key, value] of res.headers) { 
        //   console.log(`${key} : ${value}`);  
        // }
        // console.log(resJson);
        this.response = tools.ObjectToArray(resJson);
      } catch (error) {
        // 如果是请求取消则返回以下字符串： DOMException: The user aborted a request.
        console.log(error);
      }
      
    }
  }
};
</script>
<style scoped>

</style>