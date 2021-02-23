<!--
 * @Description: 自定义样式的仪表盘
 * @Author: Dong Wei
 * @Date: 2021-01-07 16:59:42
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-01-07 17:22:03
 * @FilePath: \vue2x-playground\src\views\echarts\Gauge.vue
-->
<template>
  <div>
    <v-chart
      ref="chart"
      :options="chartOptions"
      autoresize
    />
  </div>
</template>

<script>
export default {
  name: 'EchartsGauge',
  data() {
    return {
      chartOptions: {
        series: [
          {
            name: 'test',
            type: 'gauge',
            center: ['50%', '45%'],
            radius: '70%',
            min: 0,
            max: 100,
            data: [{ value: 50, name: 'a' }],
            axisLine: {
              show: true,
              lineStyle: { // 属性lineStyle控制线条样式
                shadowColor: '#ccc',
                shadowBlur: 10,
                width: 15
              }
            },
            pointer: { // 指针样式
              length: '60%',
              color: '#4A90E2'
            }
          }
        ]
      }
    };
  },
  methods: {}
};
</script>
<style scoped>
.echarts {
  width: 1000px;
  height: 500px;
}
</style>