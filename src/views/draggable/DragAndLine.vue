<!--
 * @Description: 内容拖动和连线
 * @Author: Dong Wei
 * @Date: 2021-03-04 14:44:17
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-03-05 17:30:02
 * @FilePath: \vue2x-playground\src\views\draggable\dragAndLine.vue
-->
<template>
  <div class="wrap">
    <Button @click="setEditStatus">{{drawBtnWord}}</Button>
    <div
      class="canvas-layout"
      @click="handleCanvasClick"
    >
      <!-- 人体图 -->
      <!-- <div class="body-bg">人体图</div> -->
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
          :data-id="item.i"
          @move="handleGridItemMove"
        >
          编号{{item.i}}
        </GridItem>
      </GridLayout>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import VueGridLayout from 'vue-grid-layout';
export default {
  name: 'DragAndLine',
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
      
      isDrawMode: false, // 是否为画线模式
      layoutData: [
        { x: 0, y: 0, w: 2, h: 2, i: 0, isDraggable: false },
        { x: 2, y: 0, w: 2, h: 2, i: 1, isDraggable: true },
        { x: 4, y: 0, w: 2, h: 2, i: 2 }
        // { x: 6, y: 0, w: 2, h: 2, i: 3 },
        // { x: 8, y: 0, w: 2, h: 2, i: 4 },
        // { x: 10, y: 0, w: 2, h: 2, i: 5 }
      ],
      LayoutDataCopy: [],
      customLine: [], // 保存所有用户自定义画线
      tempCoordinate: {}, // 保存当前绘制的线段坐标
      isStart: false // 绘制线段时是否为起点
    };
  },
  computed: {
    drawBtnWord() {
      if (this.isDrawMode) {
        return '退出画线';
      } else {
        return '开始画线';
      }
    }
  },
  mounted() {
    // this.cloneLayoutData();
    this.setCanvasStyle();
  },
  methods: {
    // 复制数据用于计算(暂时废弃)
    cloneLayoutData() {
      this.LayoutDataCopy = _.cloneDeep(this.layoutData);
    },
    // 设置画布宽高并获取一些初始值
    setCanvasStyle() {
      const canvasDOM = document.getElementById('canvasPart');
      const width = canvasDOM.offsetWidth;
      const height = canvasDOM.offsetHeight;
      canvasDOM.width = width;
      canvasDOM.height = height;
      this.gridConfig.colWidth = (width - 10) / this.gridConfig.colNum - 10;
    },
    // 设置画线状态
    setEditStatus() {
      this.isDrawMode = !this.isDrawMode;
      if (!this.isDrawMode) {
        this.isStart = false;
        this.tempCoordinate = {};
        this.gridConfig.isDraggable = true;
        this.gridConfig.isResizable = true;
      } else {
        this.gridConfig.isDraggable = false;
        this.gridConfig.isResizable = false;
      }
    },
    // 处理画线
    handleCanvasClick(e) {
      if (this.isDrawMode) {
        const canvasDOM = document.getElementById('canvasPart');
        const ctx = canvasDOM.getContext('2d');
        const canvasBox = canvasDOM.getBoundingClientRect();
        this.isStart = !this.isStart;
        let x = e.clientX  - canvasBox.left;
        let y = e.clientY  - canvasBox.top;
        // 点击到矩形(将点坐标重置为矩形中心点)
        if (e.target.className.includes('vue-grid-item')) {
          const id = e.target.dataset.id;
          const currentRect = this.layoutData.filter(v => v.i == id)[0];
          [x, y] = this.calcRectCoordinate(currentRect);
        }
        // 画线
        if (this.isStart) {
          ctx.beginPath();
          Object.assign(this.tempCoordinate, { start: [x, y] });
          ctx.moveTo(x, y);
        } else {
          Object.assign(this.tempCoordinate, { end: [x, y] });
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    },
    // 处理拖动(重绘当前矩形连接的线条)
    handleGridItemMove(i, newX, newY){},
    // 计算矩形中心点坐标
    calcRectCoordinate(item) {
      const { colWidth, rowHeight } = this.gridConfig;
      let endX = 10 + item.w * colWidth + item.x * colWidth;
      if (item.x > 0){
        endX += 10;
      }
      const centerX = endX - item.w * colWidth / 2;
      let endY = 10 + item.h * rowHeight + item.y * rowHeight;
      if (item.y > 0){
        endY += 10;
      }
      const centerY = endY - item.w * rowHeight / 2;
      return [centerX, centerY];
    }
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
  // background-color: #ccc;
  #canvasPart{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: skyblue;
    border: 1px solid #000;
  }
  .body-bg{
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    width: 200px;
    transform: translateX(-50%);
    border: 1px solid #000;
    z-index: 2;
  }
  .grid-layout{
    height: 100%!important;
  }
  ::v-deep .vue-grid-item{
    background-color: #fff;
    border: 1px solid #000;
    // 避免控制台提示
    touch-action: none;
  }
}
</style>