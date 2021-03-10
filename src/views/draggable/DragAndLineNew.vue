<!--
 * @Description: 内容拖动和连线-使用fabric.js
 * @Author: Dong Wei
 * @Date: 2021-03-04 14:44:17
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-03-10 11:28:41
 * @FilePath: \vue2x-playground\src\views\draggable\DragAndLineNew.vue
-->
<template>
  <div class="wrap">
    <!-- <Button @click="setEditStatus">{{drawBtnWord}}</Button> -->
    <div
      class="canvas-layout"
      id="canvasLayout"
      @click="endDrawLine"
      @keydown="handleKeyDown"
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
          @moved="handleGridItemMoved"
        >
          <div
            class="grid-item-inner"
            :data-id="item.i"
          >
            <div
              class="circle circle-left"
              @click.stop="startDrawLine($event, item, 'left')"
            ></div>
            <div
              class="circle circle-right"
              @click.stop="startDrawLine( $event,item, 'right')"
            ></div>
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
import Fabric from 'fabric';
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
      // grid-layout数据
      // hasLine当前矩形是否有线（便于拖拽时判断）
      layoutData: [
        { x: 0, y: 0, w: 2, h: 2, i: 0, hasLine: false },
        { x: 0, y: 2, w: 2, h: 2, i: 1 },
        { x: 0, y: 4, w: 2, h: 2, i: 2 },
        { x: 0, y: 6, w: 2, h: 2, i: 3 },
        { x: 0, y: 8, w: 2, h: 2, i: 4 }
        // { x: 10, y: 0, w: 2, h: 2, i: 5 }
      ],
      fabricObj: null, // fabric对象
      drawingObj: null, // 正在绘制的fabric对象
      ctx: null, // canvas2d对象TODO:是否无用
      canvasBox: { // 用于计算点击处的坐标TODO:
        left: 0,
        top: 0
      },
      customLines: [], // 保存所有用户自定义画线（start/end: 坐标;lineObj: fabric对象）
      tempCoordinate: {}, // 保存当前绘制的线段坐标
      isStart: false // 是否开始画线
    };
  },
  mounted() {
    this.setCanvasStyle();
    this.initRectClickCoordinate();
    this.setFabric();
  },
  methods: {
    // 设置矩形左右两侧点击区的中心点坐标
    initRectClickCoordinate() {
      this.layoutData.forEach(v => {
        const leftCircle = this.calcRectCircleCoord(v).left;
        const rightCircle = this.calcRectCircleCoord(v).right;
        Object.assign(v, { leftCircle, rightCircle });
      });
    },
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
    // 设置fabric对象并监听事件
    setFabric() {
      this.fabricObj = new Fabric.fabric.Canvas('canvasPart', {
        selectable: false, // 禁止元素出现被选中的样式
        selection: false,
        skipTargetFind: true
      });
      // 开始画线时，鼠标移动执行重绘
      this.fabricObj.on('mouse:move', e => {
        if (this.isStart) {
          // 清空上一次画的线
          if (this.drawingObj) {
            this.fabricObj.remove(this.drawingObj);
          }
          const x1 = this.tempCoordinate.start[0];
          const y1 = this.tempCoordinate.start[1];
          const x2 = e.pointer.x;
          const y2 = e.pointer.y;
          this.drawLine([x1, y1], [x2, y2], '#FAAB0C');
          Object.assign(this.tempCoordinate, { end: [x2, y2] });
        }
      });
    },
    // 计算矩形左右点击区的中心坐标 FIXME:y坐标拖动后的值不正确
    calcRectCircleCoord(item) {
      const { colWidth, rowHeight } = this.gridConfig;
      let leftX = 10 + item.x * colWidth;
      let rightX = 10 + item.x * colWidth + item.w * colWidth;
      if (item.x > 0) {
        leftX += 10 * item.x;
        rightX += 10 * item.x;
      }
      // margin为10,微调
      let y = 12 + item.y * rowHeight + item.h * rowHeight - item.h * rowHeight / 2;
      if (item.y > 0){
        y += 10 * item.y;
      }
      return {
        left: [leftX, y],
        right: [rightX, y]
      };
    },
    // 点击圆圈开始画线
    startDrawLine(e, item, type) {
      this.drawingObj = null;
      this.focusLayout();
      this.isStart = true;
      let x, y;
      if (type === 'left') {
        x = item.leftCircle[0];
        y = item.leftCircle[1];
      } else {
        x = item.rightCircle[0];
        y = item.rightCircle[1];
      }
      Object.assign(item, { hasLine: true });
      Object.assign(this.tempCoordinate, { i: item.i, start: [x, y] });
    },
    // 结束画线
    endDrawLine(e) {
      if (!this.isStart){
        return;
      }
      // 只处理点击到画布上的线
      if (e.target.className.includes('upper-canvas')){
        // 有起点才能画线
        if (!this.tempCoordinate.start){
          return;
        }
        Object.assign(this.tempCoordinate, { lineObj: this.drawingObj });
        // 保存已画好的线
        this.customLines.push(this.tempCoordinate);
        // 重置状态
        this.resetDrawStatus();
      } else {
        this.$Message.error('请在正确的位置画线');
      }
    },
    // 处理拖动
    handleGridItemMove(i, newX, newY){
      const currentRect = this.layoutData.filter(v => v.i == i)[0];
      // 重新计算左右圆圈坐标
      const tempRect = _.cloneDeep(currentRect);
      tempRect.x = newX;
      tempRect.y = newY;
      const newLeft = this.calcRectCircleCoord(tempRect).left;
      const newRight = this.calcRectCircleCoord(tempRect).right;
      // 矩形有画线则执行重绘
      if (tempRect.hasLine) {
        const { leftCircle, rightCircle } = tempRect;
        for (const item of this.customLines) {
          if (item.i !== i) {
            continue;
          }
          if (_.isEqual(leftCircle, item.start)) {
            this.fabricObj.remove(item.lineObj);
            this.drawLine(newLeft, item.end, '#FAAB0C');
            // 更新保存线段的数组对应项
            item.start = newLeft;
            item.lineObj = this.drawingObj;
          }
          if (_.isEqual(rightCircle, item.start)) {
            this.fabricObj.remove(item.lineObj);
            this.drawLine(newRight, item.end, '#FAAB0C');
            // 更新保存线段的数组对应项
            item.start = newRight;
            item.lineObj = this.drawingObj;
          }
        }
      }
      // 更新矩形坐标
      Object.assign(currentRect, { leftCircle: newLeft, rightCircle: newRight });
    },
    handleGridItemMoved(i, newX, newY) {
      // console.log(newY);
      // this.handleGridItemMove(i, newX, newY)
      // const currentRect = this.layoutData.filter(v => v.i == i)[0];
      // const newRight = this.calcRectCircleCoord(currentRect).right;
    },
    /**
     * @description: 根据已知点画线
     * @param {array} start 起点坐标
     * @param {array} end
     * @param {string} strokeColor 描边颜色
     * @return {*}
     */
    drawLine(start, end, strokeColor) {
      const x1 = start[0];
      const y1 = start[1];
      const x2 = end[0];
      const y2 = end[1];
      const line = new Fabric.fabric.Line([x1, y1, x2, y2], {
        stroke: strokeColor
      });
      this.drawingObj = line;
      this.fabricObj.add(line);
    },
    // 重置画线状态
    resetDrawStatus() {
      this.isStart = false;
      this.drawingObj = null;
      this.tempCoordinate = {};
    },
    // 画线时聚焦
    focusLayout() {
      const Box = document.getElementById('canvasLayout');
      Box.setAttribute('tabindex', '0');
      Box.focus();
    },
    // 画布键盘事件
    handleKeyDown(e) {
      const keynum = e.keyCode;
      // esc取消画线
      if (keynum == 27 && this.fabricObj) {
        this.fabricObj.remove(this.drawingObj);
        this.resetDrawStatus();
      }
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
  &:focus{
    outline: none;
  }
  // background-color: #ccc;
  ::v-deep .canvas-container{
    position: absolute!important;
    top: 0;
    left: 0;
    z-index: 10;
  }
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
    padding: 12px;
    background-color: #fff;
    border: 1px solid #D0D9D9;
    border-radius: 5px;
    box-shadow: 0px 2px 4px 0px rgba(119,140,118,0.08);
    z-index: 100;
    // 避免控制台提示
    touch-action: none;
    &.vue-draggable-dragging, &.resizing {
      z-index: 1000;
    }
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