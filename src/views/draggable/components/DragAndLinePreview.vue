<!--
 * @Description: 拖动绘图保存预览展示
 * @Author: Dong Wei
 * @Date: 2021-03-11 18:41:21
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-03-13 14:25:36
 * @FilePath: \vue2x-playground\src\views\draggable\components\DragAndLinePreview.vue
-->
<template>
  <div
    class="canvas-layout-show"
    id="canvasShowLayout"
  >
    <canvas id="canvasShowPart"></canvas>
    <GridLayout
      class="grid-layout"
      :layout.sync="layoutShowData"
      :col-num="gridConfig.colNum"
      :row-height="gridConfig.rowHeight"
      :responsive="gridConfig.responsive"
      :prevent-collision="gridConfig.preventCollision"
      :vertical-compact="gridConfig.verticalCompact"
      :is-draggable="false"
      :is-resizable="false"
    >
      <GridItem
        v-for="item in layoutShowData"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :data-id="item.i"
      >
        <div
          class="grid-item-inner"
          :data-id="item.i"
        >
          编号{{item.i}}
        </div>
      </GridItem>
    </GridLayout>
    <img
      v-show="false"
      id="bodyImg"
      src="@/assets/imgs/body.png"
      alt=""
    />
  </div>
</template>

<script>
import _ from 'lodash';
import VueGridLayout from 'vue-grid-layout';
import Fabric from 'fabric';
export default {
  name: 'DragAndLinePreview',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  props: {
    // grid-layout数据
    layoutData: {
      type: Array,
      default: () => []
    },
    // 编辑时的一些属性(用于按比例计算展示图形)
    editAttrs: {
      type: Object,
      default: () => {
        return {
          width: 0, // 容器宽度和高度
          height: 0,
          imgX: 0, // 编辑时图的起点坐标
          imgY: 0,
          rowHeight: 0, // 最小栅格宽和高
          colWidth: 0
        };
      }
    },
    // 已绘制的线的集合
    lines: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      gridConfig: { // grid组件配置
        rowHeight: 30,
        colNum: 24,
        isDraggable: true,
        isResizable: true,
        responsive: false,
        preventCollision: true, // 是否防止碰撞
        verticalCompact: false, // 是否垂直压缩
        colWidth: 0 // 最小栅格宽度(计算用)
      },
      layoutShowData: [], // 重新计算得到实际使用的layoutdata
      fabricObj: null,
      imgWidthOrigin: 186,
      imgHeightOrigin: 497
    };
  },
  methods: {
    initPage() {
      this.setCanvasStyle();
      this.cloneLayoutData();
      this.initRectCircleCoordinate();
      this.setFabric();
      this.drawBodyImg();
      this.drawLines();
    },
    // 数据拷贝
    cloneLayoutData() {
      this.layoutShowData = _.cloneDeep(this.layoutData);
    },
    // 设置画布宽高并获取一些初始值
    setCanvasStyle() {
      const boxDOM = document.getElementById('canvasShowLayout');
      const canvasDOM = document.getElementById('canvasShowPart');
      const width = boxDOM.offsetWidth;
      const height = boxDOM.offsetHeight;
      canvasDOM.width = width;
      canvasDOM.height = height;
      this.gridConfig.colWidth = (width - 10) / this.gridConfig.colNum - 10;
      this.gridConfig.rowHeight = height * this.editAttrs.rowHeight / this.editAttrs.height;
    },
    // 计算矩形左右两侧连接点的坐标
    initRectCircleCoordinate() {
      const tempArr = _.cloneDeep(this.layoutShowData);
      tempArr.forEach(v => {
        const leftCircle = this.calcRectCircleCoord(v).left;
        const rightCircle = this.calcRectCircleCoord(v).right;
        Object.assign(v, { leftCircle, rightCircle });
      });
      this.layoutShowData = tempArr;
    },
    // 初始化fabric实例
    setFabric() {
      this.fabricObj = new Fabric.fabric.Canvas('canvasShowPart', {
        selection: false, // 不可框选
        selectable: false, // 去除选中样式
        skipTargetFind: false
      });
    },
    // 绘制人体背景图
    drawBodyImg() {
      const { rate, left, top } = this.calcBodyAttrs(this.imgWidthOrigin, this.imgHeightOrigin);
      const imgDOM = document.getElementById('bodyImg');
      const imgInstance = new Fabric.fabric.Image(imgDOM, {
        hasControls: false, // 关闭图层控件
        hoverCursor: 'default',
        left,
        top,
        scaleX: rate,
        scaleY: rate
      });
      this.fabricObj.add(imgInstance);
    },
    // 批量画线
    drawLines() {
      this.lines.forEach(v => {
        const start = this.calcStartCoordinate(v);
        const end = this.calcEndCoordinate(v.end);
        this.drawCurve(start, end);
      });
    },
    // 绘制三次贝塞尔曲线
    drawCurve(start, end, strokeColor = '#768C8C') {
      const x1 = start[0];
      const y1 = start[1];
      const x2 = end[0];
      const y2 = end[1];
      const c1 = this.calcControlPoint(start, end).c1;
      const c2 = this.calcControlPoint(start, end).c2;
      const line = new Fabric.fabric.Path(`M ${x1} ${y1}C${c1[0]},${c1[1]},${c2[0]},${c2[1]},${x2},${y2}`, {
        stroke: strokeColor,
        hoverCursor: 'default',
        fill: false,
        hasControls: false // 关闭图层控件
      });
      this.fabricObj.add(line);
    },
    // 计算贝塞尔曲线控制点
    calcControlPoint(start, end, curvature = 0.1) {
      const x1 = start[0];
      const y1 = start[1];
      const x2 = end[0];
      const y2 = end[1];
      const cx1 = x1 + (x2 - x1) / 3 + (y2 - y1) * curvature;
      const cy1 = y1 + (y2 - y1) / 3 + (x1 - x2) * curvature;
      const cx2 = x1 + (x2 - x1) * 2 / 3 + (y1 - y2) * curvature;
      const cy2 = y1 + (y2 - y1) * 2 / 3 + (x2 - x1) * curvature;
      return {
        c1: [Math.abs(cx1), Math.abs(cy1)],
        c2: [Math.abs(cx2), Math.abs(cy2)]
      };
    },
    // 重新计算画布内线的起点坐标
    calcStartCoordinate(lineItem) {
      let coor = [];
      for (const girdItem of this.layoutShowData) {
        if (lineItem.i === girdItem.i) {
          const type = lineItem.type;
          if (type === 'left') {
            coor = girdItem.leftCircle;
          } else {
            coor = girdItem.rightCircle;
          }
          break;
        }
      }
      return coor;
    },
    // 重新计算画布内线的终点坐标
    calcEndCoordinate(oldCoor) {
      const { left, top, rate } = this.calcBodyAttrs(this.imgWidthOrigin, this.imgHeightOrigin);
      const oldX = this.editAttrs.imgX;
      const oldY = this.editAttrs.imgY;
      const distance = oldCoor[0] - oldX;
      const hRate = top / oldY;
      const newDistance = distance * rate + 5; // 增加偏移量微调
      const x = left + newDistance;
      const y = oldCoor[1] * hRate;
      return [x, y];
    },
    // 计算人体图片的属性
    calcBodyAttrs(originW, originH) {
      const canvasDOM = document.getElementById('canvasShowPart');
      const imgHeightOrigin = originH; // 图片原始尺寸
      const imgWidthOrigin = originW;
      const boxHeight = canvasDOM.height;
      const boxWidth = canvasDOM.width;
      const rate = boxHeight / imgHeightOrigin * 0.8;
      const left = (boxWidth - imgWidthOrigin * rate) / 2;
      const top = (boxHeight - imgHeightOrigin * rate) / 2;
      return {
        rate, left, top
      };
    },
    // 计算矩形左右点击区的中心坐标
    calcRectCircleCoord(item) {
      const { colWidth, rowHeight } = this.gridConfig;
      let leftX = 10 + item.x * colWidth;
      let rightX = 10 + item.x * colWidth + item.w * colWidth + (item.w - 1) * 10;
      if (item.x > 0) {
        leftX += 10 * item.x;
        rightX += 10 * item.x;
      }
      let y = 10 + item.y * rowHeight + (item.h * rowHeight + (item.h - 1) * 10) / 2;
      if (item.y > 0){
        y += 10 * item.y;
      }
      return {
        left: [leftX, y],
        right: [rightX, y]
      };
    }
  }
};
</script>
<style scoped lang="less">
.canvas-layout-show{
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  ::v-deep .canvas-container{
    position: absolute!important;
    top: 0;
    left: 0;
    z-index: 10;
  }
  #canvasShowPart{
    position: absolute;
    top: 0;
    left: 0;
  }
  .grid-layout{
    height: 100%!important;
  }
  ::v-deep .vue-grid-item{
    z-index: 100;
    // 避免控制台提示
    touch-action: none;
    &.vue-grid-placeholder{
      background: transparent;
    }
    &.vue-draggable-dragging, &.resizing {
      z-index: 1000;
    }
  }
  .grid-item-inner{
    padding: 12px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #D0D9D9;
    border-radius: 5px;
    box-shadow: 0px 2px 4px 0px rgba(119,140,118,0.08);
    &:hover{
      box-shadow: 0px 8px 12px 0px rgba(118,140,140,0.20), 0px 2px 4px 0px rgba(119,140,118,0.08);
      border: 1px solid #13939e;
    }
  }
}
</style>