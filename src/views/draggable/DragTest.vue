<!--
 * @Description: filename
 * @Author: Dong Wei
 * @Date: 2021-03-09 19:43:15
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-03-09 19:58:03
 * @FilePath: \vue2x-playground\src\views\draggable\DragTest.vue
-->
<template>
  <div class="canvas-layout">
    <canvas id="canvasPart"></canvas>
    <GridLayout
      class="grid-layout"
      :layout.sync="layoutData"
      :col-num="gridConfig.colNum"
      :row-height="gridConfig.rowHeight"
      :is-draggable="gridConfig.isDraggable"
      :is-resizable="gridConfig.isResizable"
      :responsive="gridConfig.responsive"
      :prevent-collision="gridConfig.preventCollision"
      :vertical-compact="gridConfig.verticalCompact"
    >
      <GridItem
        v-for="item in layoutData"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :static="item.static"
        :is-draggable="item.isDraggable"
        :is-resizable="item.isResizable"
        :data-id="item.i"
        @move="handleGridItemMove"
      >
        <div
          class="grid-item-inner"
          :data-id="item.i"
        >
          <div class="circle circle-left"></div>
          <div class="circle circle-right"></div>
          编号{{item.i}}
        </div>
      </GridItem>
    </GridLayout>
  </div>

</template>

<script>
import VueGridLayout from 'vue-grid-layout';
export default {
  name: 'DragTest',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data() {
    return {
      gridConfig: { // grid组件配置
        rowHeight: 30,
        colNum: 12,
        isDraggable: true,
        isResizable: true,
        responsive: false,
        preventCollision: true, // 是否防止碰撞
        verticalCompact: false, // 是否垂直压缩
        colWidth: 0 // 最小栅格宽度(计算用)
      },
      layoutData: [
        { x: 0, y: 0, w: 2, h: 2, i: 0, line: {}},
        { x: 0, y: 2, w: 2, h: 2, i: 1, line: {}},
        { x: 0, y: 4, w: 2, h: 2, i: 2, line: {}},
        { x: 0, y: 6, w: 2, h: 2, i: 3, line: {}},
        { x: 0, y: 8, w: 2, h: 2, i: 4, line: {}}
        // { x: 10, y: 0, w: 2, h: 2, i: 5, line: {}] }
      ],
      fabricObj: null, // fabric对象
      drawingObj: null, // 正在绘制的fabric对象
      ctx: null, // canvas2d对象
      canvasBox: { // 用于计算点击处的坐标
        left: 0,
        top: 0
      },
      customLines: [], // 保存所有用户自定义画线（用于重绘）
      tempCoordinate: {}, // 保存当前绘制的线段坐标
      isStart: false // 是否开始画线
    };
  },
  mounted() {
    this.setCanvasStyle();
  },
  methods: {
    // 设置画布宽高并获取一些初始值
    setCanvasStyle() {
      const canvasDOM = document.getElementById('canvasPart');
      this.ctx = canvasDOM.getContext('2d');
      this.canvasBox = canvasDOM.getBoundingClientRect();
      const width = canvasDOM.offsetWidth;
      const height = canvasDOM.offsetHeight;
      canvasDOM.width = width;
      canvasDOM.height = height;
      this.gridConfig.colWidth = (width - 10) / this.gridConfig.colNum - 10;
    },
    handleGridItemMove(i, newX, newY){}
  }
};
</script>
<style scoped lang="less">
.canvas-layout{
  position: relative;
  margin-top: 10px;
  width: 100%;
  height: 600px;
  overflow: hidden;
  #canvasPart{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: skyblue;
    border: 1px solid #000;
  }
}
.grid-layout{
  height: 100%!important;
  border: 1px solid #000;
}
.grid-item-inner{
  width: 100%;
  height: 100%;
}
::v-deep .vue-grid-item{
  padding: 12px;
  background-color: #fff;
  border: 1px solid #D0D9D9;
  border-radius: 5px;
  box-shadow: 0px 2px 4px 0px rgba(119,140,118,0.08);
  touch-action: none;
  .vue-resizable-handle{
    visibility: hidden;
    padding: 0;
    bottom: -5px;
    right: -5px;
    background: url('~@/assets/imgs/drag_arrow.png');
  }
  .circle{
    visibility: hidden;
    position: absolute;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    border: 1px solid #D0D9D9;
    background-color: #fff;
    cursor: default;
  }
  .circle-left{
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
  }
  .circle-right{
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
  }
  &:hover{
    box-shadow: 0px 8px 12px 0px rgba(118,140,140,0.20), 0px 2px 4px 0px rgba(119,140,118,0.08);
    border: 1px solid #13939e;
    .vue-resizable-handle{
      visibility: visible;
    }
    .circle{
      visibility: visible;
      border-color: #13939e;
    }
  }
}
</style>