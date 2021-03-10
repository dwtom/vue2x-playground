<!--
 * @Description: 内容拖动和连线
 * @Author: Dong Wei
 * @Date: 2021-03-04 14:44:17
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-03-09 19:42:38
 * @FilePath: \vue2x-playground\src\views\draggable\dragAndLine.vue
-->
<template>
  <div class="wrap">
    <!-- <Button @click="setEditStatus">{{drawBtnWord}}</Button> -->
    <Button @click="clearAll">清除所有线段</Button>
    <div
      class="canvas-layout"
      :class="{'crosshair': isDrawMode}"
      @click="endDrawLine"
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
            <div
              class="circle circle-left"
              @click.stop="startDrawLine(item)"
            ></div>
            <div class="circle circle-right"></div>
            编号{{item.i}}
          </div>
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
        { x: 0, y: 0, w: 2, h: 2, i: 0, line: {}},
        { x: 0, y: 2, w: 2, h: 2, i: 1, line: {}},
        { x: 0, y: 4, w: 2, h: 2, i: 2, line: {}},
        { x: 0, y: 6, w: 2, h: 2, i: 3, line: {}},
        { x: 0, y: 8, w: 2, h: 2, i: 4, line: {}}
        // { x: 10, y: 0, w: 2, h: 2, i: 5, line: {}] }
      ],
      LayoutDataCopy: [],
      customLine: [], // 保存所有用户自定义画线（用于重绘）
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
    // 点击圆圈开始画线
    startDrawLine() {
      // console.log(111);
    },
    // 结束画线
    endDrawLine(e) {
      // 只处理点击到画布上的线
      if (e.target.className.includes('vue-grid-layout')){
        // 有起点才能画线
        if (!this.tempCoordinate.start){
          return;
        }
      }
    },
    // 设置画线状态(废弃)
    setEditStatus() {
      this.isDrawMode = !this.isDrawMode;
      if (!this.isDrawMode) {
        this.isStart = false;
        this.tempCoordinate = {};
        this.layoutData.forEach(v => {
          Object.assign(v, { static: false });
        });
      } else { // 进入画线模式则不可操作矩形
        this.layoutData.forEach(v => {
          Object.assign(v, { static: true });
        });
      }
    },
    // 处理画线(废弃)
    handleCanvasClick(e) {
      if (this.isDrawMode) {
        const canvasDOM = document.getElementById('canvasPart');
        const ctx = canvasDOM.getContext('2d');
        const canvasBox = canvasDOM.getBoundingClientRect();
        this.isStart = !this.isStart;
        let x = e.clientX  - canvasBox.left;
        let y = e.clientY  - canvasBox.top;
        // 点击到矩形(将点坐标重置为矩形中心点)
        if (e.target.className.includes('grid-item-inner')) {
          const id = e.target.dataset.id;
          const currentRect = this.layoutData.filter(v => v.i == id)[0];
          [x, y] = this.calcRectCoordinate(currentRect);
          if (this.isStart) {
            currentRect.line.start = [x, y];
          } else {
            currentRect.line.end = [x, y];
          }
        }
        // 画线
        if (this.isStart) {
          Object.assign(this.tempCoordinate, { start: [x, y] });
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          Object.assign(this.tempCoordinate, { end: [x, y] });
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.closePath();
          // 将画好的线保存下来
          this.customLine.push(this.tempCoordinate);
          this.tempCoordinate = {};
        }
      }
    },
    // 处理拖动
    handleGridItemMove(i, newX, newY){
      const currentRect = this.layoutData.filter(v => v.i == i)[0];
      if (currentRect.line) {
        let start = currentRect.line.start;
        let end = currentRect.line.end;
        currentRect.x = newX;
        currentRect.y = newY;
        for (const item of this.customLine) {
          // 重新计算拖动后的中心点
          if (start && _.isEqual(start, item.start)){
            const [newStartX, newStartY] = this.calcRectCoordinate(currentRect);
            item.start = [newStartX, newStartY];
            currentRect.line.start = [newStartX, newStartY];
          }
          if (end && _.isEqual(end, item.end)) {
            const [newEndX, newEndY] = this.calcRectCoordinate(currentRect);
            item.end = [newEndX, newEndY];
            currentRect.line.end = [newEndX, newEndY];
          }
        }
        // 画布重绘
        const canvasDOM = document.getElementById('canvasPart');
        const ctx = canvasDOM.getContext('2d');
        const width = canvasDOM.offsetWidth;
        const height = canvasDOM.offsetHeight;
        ctx.clearRect(0, 0, width, height);
        for (const item of this.customLine) {
          this.drawLine(ctx, item.start, item.end);
        }
      }
    },
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
        endY += 10 * item.y;
      }
      const centerY = endY - item.h * rowHeight / 2;
      return [centerX, centerY];
    },
    /**
     * @description: canvas画线(已知起点终点重绘)
     * @param {object} ctx
     * @param {array} start
     * @param {array} end
     * @return {*}
     */
    drawLine(ctx, start, end) {
      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);
      ctx.lineTo(end[0], end[1]);
      ctx.stroke();
      ctx.closePath();
    },
    // 清除所有线段
    clearAll() {
      const canvasDOM = document.getElementById('canvasPart');
      const ctx = canvasDOM.getContext('2d');
      const width = canvasDOM.offsetWidth;
      const height = canvasDOM.offsetHeight;
      ctx.clearRect(0, 0, width, height);
      this.customLine = [];
      this.layoutData.forEach(v => {
        v.line = {};
      });
    }
  }
};
</script>
<style scoped lang="less">
.crosshair{
  cursor: crosshair;
}
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
    // height: 100%!important;
  }
  ::v-deep .vue-grid-item{
    padding: 12px;
    background-color: #fff;
    border: 1px solid #D0D9D9;
    border-radius: 5px;
    box-shadow: 0px 2px 4px 0px rgba(119,140,118,0.08);
    // 避免控制台提示
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
  .grid-item-inner{
    width: 100%;
    height: 100%;
  }
}
</style>