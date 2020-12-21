<!--
 * @Description: echarts点击事件
 * @Author: Dong Wei
 * @Date: 2020-12-19 17:02:20
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-21 17:00:44
 * @FilePath: \vue2x-playground\src\views\echarts\clickEvent.vue
-->
<template>
  <div>
    <v-chart
      ref="chart"
      :options="chartOptions"
      autoresize
      @click="handleChartClick"
      @zr:click="handleZrClick"
    />
  </div>
</template>

<script>
export default {
  name: 'EchartsClick',
  data() {
    return {
      chartOptions: {
        xAxis: {
          data: ['Mon', 'Tue', 'Wed']
        },
        yAxis: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器
            type: 'shadow'
          }
        },
        series: {
          type: 'bar',
          data: [
            {
              name: 'a',
              number: 11,
              value: 10
            },
            {
              name: 'b',
              number: 12,
              value: 200
            },
            {
              name: 'c',
              number: 13,
              value: 1000
            }
          ]
        }
      }
    };
  },
  methods: {
    handleChartClick(data) {
      // console.log('chartclick', data);
    },
    // 柱状图点击阴影部分获取当前选中项(避免数据太小点不到图)
    handleZrClick(params) {
      const chart = this.$refs.chart.chart;
      const pointInPixel = [params.offsetX, params.offsetY];
      let xIndex;
      if (chart.containPixel('grid', pointInPixel)) {
        xIndex = chart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0];
      }
      // 点击到图表其他区域不操作
      if (typeof xIndex !== 'number') {
        return;
      }
      const dataArr = chart.getOption().series[0].data;
      // 当前选中项
      const currentSelectedData = dataArr[xIndex];
      console.log(currentSelectedData);
    }
  }
};
</script>
<style scoped>
.echarts {
  width: 1000px;
  height: 500px;
}
</style>
