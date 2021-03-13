<!--
 * @Description: 内容拖动和连线-使用fabric.js
 * @Author: Dong Wei
 * @Date: 2021-03-04 14:44:17
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-03-13 13:54:30
 * @FilePath: \vue2x-playground\src\views\draggable\DragAndLineNew.vue
-->
<template>
  <div class="wrap">
    <Button @click="lockDrag">锁定位置</Button>
    <Button @click="lockResize">锁定尺寸</Button>
    <p>点选模块，位置可拖动调整，大小可通过拉伸边界来调整；模块侧边框连接点可拖拉连线至人体图任意部位。</p>
    <div
      class="canvas-layout"
      id="canvasLayout"
      @click="endDrawLine"
      @keydown="handleKeyDown"
    >
      <!-- 点击线条弹出的菜单 -->
      <div
        class="menu"
        id="canvasMenu"
        v-show="isMenuShow"
        @click="handleLineDelete"
      >删除</div>
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
          @resize="handleGridItemResize"
        >
          <div
            class="grid-item-inner"
            :class="{'grid-item-selected': item.selected}"
            :data-id="item.i"
            @mousedown="handleGridItemSelected(item)"
          >
            <div
              class="circle circle-left"
              :class="{'grid-item-selected': item.selected}"
              @click.stop="startDrawLine($event, item, 'left')"
            ></div>
            <div
              class="circle circle-right"
              :class="{'grid-item-selected': item.selected}"
              @click.stop="startDrawLine($event, item, 'right')"
            ></div>
            编号{{item.i}}
          </div>
        </GridItem>
      </GridLayout>
    </div>
    <Button @click="openPreview">效果预览</Button>
    <img
      v-show="false"
      id="bodyImg"
      src="@/assets/imgs/body.png"
      alt=""
    />
    <Modal
      v-model="showPreview"
      class="preview-modal"
      title="预览"
      width="100%"
      footer-hide
      :transfer="false"
    >
      <PreviewContent
        ref="previewContent"
        :layout-data="layoutShowData"
        :lines="customLines"
        :edit-attrs="editAttrs"
      />
    </Modal>
  </div>
</template>

<script>
import _ from 'lodash';
import VueGridLayout from 'vue-grid-layout';
import Fabric from 'fabric';

import PreviewContent from './components/DragAndLinePreview';
export default {
  name: 'DragAndLine',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    PreviewContent
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
      // 编辑页的一些属性(展示页计算用)
      editAttrs: {
        width: 0,
        height: 0,
        imgX: 0,
        imgY: 0
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
      layoutShowData: [], // 用于展示的数据
      fabricObj: null, // fabric对象
      drawingObj: null, // 正在绘制的fabric对象
      deleteObj: null, // 将要删除的fabric对象(线)
      customLines: [], // 保存所有用户自定义画线（start/end: 坐标;lineObj: fabric对象, type: 左侧/右侧）
      tempCoordinate: {}, // 保存当前绘制的线段坐标
      isDrawingLine: false, // 是否开始画线
      isMenuShow: false, // 删除菜单
      showPreview: false // 显示预览
    };
  },
  mounted() {
    this.setCanvasStyle();
    this.initRectCircleCoordinate();
    this.setFabric();
    this.drawBodyImg();
  },
  methods: {
    // 设置矩形左右两侧点击区的中心点坐标
    initRectCircleCoordinate() {
      this.layoutData.forEach(v => {
        const leftCircle = this.calcRectCircleCoord(v).left;
        const rightCircle = this.calcRectCircleCoord(v).right;
        Object.assign(v, { leftCircle, rightCircle });
      });
    },
    // 设置画布宽高并获取一些初始值
    setCanvasStyle() {
      const canvasDOM = document.getElementById('canvasPart');
      const width = canvasDOM.offsetWidth;
      const height = canvasDOM.offsetHeight;
      canvasDOM.width = width;
      canvasDOM.height = height;
      this.gridConfig.colWidth = (width - 10) / this.gridConfig.colNum - 10;
      this.editAttrs.width = width;
      this.editAttrs.height = height;
      const { rowHeight, colWidth } = this.gridConfig;
      this.editAttrs.rowHeight = rowHeight;
      this.editAttrs.colWidth = colWidth;
    },
    // 设置fabric对象并监听事件
    setFabric() {
      this.fabricObj = new Fabric.fabric.Canvas('canvasPart', {
        selection: false, // 不可框选
        skipTargetFind: false // 保留选中操作(在Line中去掉选中样式)
      });
      // 开始画线时，鼠标移动执行重绘
      this.fabricObj.on('mouse:move', e => {
        if (this.isDrawingLine) {
          // 清空上一次画的线
          if (this.drawingObj) {
            this.fabricObj.remove(this.drawingObj);
          }
          const x1 = this.tempCoordinate.start[0];
          const y1 = this.tempCoordinate.start[1];
          const x2 = e.pointer.x;
          const y2 = e.pointer.y;
          this.drawCurve([x1, y1], [x2, y2], '#FAAB0C', this.tempCoordinate.type);
          Object.assign(this.tempCoordinate, { end: [x2, y2] });
        }
      });
      // 监听点击选中
      this.fabricObj.on('mouse:down', option => {
        // 画线结束时的点击不作选中操作,计算点相对于图的坐标用于展示
        if (this.isDrawingLine) {
          return;
        }
        // 点击线-打开菜单
        // 点击其它地方关闭菜单保留线
        // 已经打开菜单的情况下再次点击线则关闭菜单
        if (option.target) {
          const type = option.target.get('type');
          const lineTypes = ['line', 'path'];
          if (lineTypes.includes(type)) {
            if (this.isMenuShow) {
              this.isMenuShow = false;
              this.deleteObj = null;
              return;
            }
            this.deleteObj = option.target;
            const { x, y } = option.pointer;
            const type = option.target.customType;
            let top, left;
            if (type === 'left') {
              left = x - 50 + 'px';
            } else {
              left = x + 10 + 'px';
            }
            top = y - 30 + 'px';
            this.drawMenu(left, top);
          }
        } else { 
          this.deleteObj = null;
          this.isMenuShow = false;
        }
      });
    },
    // 绘制人体背景图
    drawBodyImg() {
      const imgDOM = document.getElementById('bodyImg');
      const canvasDOM = document.getElementById('canvasPart');
      const imgHeightOrigin = 497; // 图片原始尺寸
      const imgWidthOrigin = 186;
      const boxHeight = canvasDOM.height;
      const boxWidth = canvasDOM.width;
      const rate = boxHeight / imgHeightOrigin * 0.8;
      const left = (boxWidth - imgWidthOrigin * rate) / 2;
      const top = (boxHeight - imgHeightOrigin * rate) / 2;
      this.editAttrs.imgX = left;
      this.editAttrs.imgY = top;
      // 即使是已经存在于html中的imgdom对象也需要在onload事件中获取，否则fabric渲染不出来
      imgDOM.onload = () => {
        const imgInstance = new Fabric.fabric.Image(imgDOM, {
          selectable: false, // 去掉选中的效果
          hasControls: false, // 关闭图层控件
          hoverCursor: 'default',
          left,
          top,
          scaleX: rate,
          scaleY: rate
        });
        this.fabricObj.add(imgInstance);
      };
    },
    // 锁定位置
    lockDrag() {
      this.gridConfig.isDraggable = !this.gridConfig.isDraggable;
    },
    // 锁定尺寸
    lockResize() {
      this.gridConfig.isResizable = !this.gridConfig.isResizable;
    },
    // 点到矩形改变样式
    handleGridItemSelected(item) {
      // 菜单开启时使其关闭
      if (this.isMenuShow) {
        this.isMenuShow = false;
        this.deleteObj = null;
      }
      // 改变矩形本身边框颜色
      this.layoutData.forEach(v => {
        if (v.i === item.i) {
          Object.assign(v, { selected: true });
        } else {
          Object.assign(v, { selected: false });
        }
      });
      this.$forceUpdate();
      // 改变线的颜色
      this.customLines.forEach(line => {
        const { start, end, guid, type } = line;
        this.fabricObj.remove(line.lineObj);
        if (line.i === item.i) {
          this.drawCurve(start, end, '#FAAB0C', type, guid);
        } else {
          this.drawCurve(start, end, '#768C8C', type, guid);
        }
        line.lineObj = this.drawingObj;
      });
    },
    // 点击圆圈开始画线
    startDrawLine(e, item, type) {
      this.drawingObj = null;
      this.focusLayout();
      this.isDrawingLine = true;
      let x, y;
      if (type === 'left') {
        x = item.leftCircle[0];
        y = item.leftCircle[1];
      } else {
        x = item.rightCircle[0];
        y = item.rightCircle[1];
      }
      Object.assign(item, { hasLine: true });
      Object.assign(this.tempCoordinate, { i: item.i, start: [x, y], guid: this.setGuid(), type });
    },
    // 结束画线
    endDrawLine(e) {
      if (!this.isDrawingLine){
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
        // 重置状态(鼠标移动时已经画好了线，只需要结束状态即可)
        this.resetDrawStatus();
      } else {
        this.$Message.error('请在正确的位置画线');
      }
    },
    // 处理拖动
    handleGridItemMove(i, newX, newY){
      const currentRect = this.layoutData.filter(v => v.i == i)[0];
      // 复制并更新矩形属性
      const tempRect = _.cloneDeep(currentRect);
      tempRect.x = newX;
      tempRect.y = newY;
      this.handleGridItemChange(tempRect, currentRect);
    },
    // 处理调整大小
    handleGridItemResize(i, newH, newW) {
      const currentRect = this.layoutData.filter(v => v.i == i)[0];
      // 复制并更新矩形属性
      const tempRect = _.cloneDeep(currentRect);
      tempRect.w = newW;
      tempRect.h = newH;
      this.handleGridItemChange(tempRect, currentRect);
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
    },
    /**
     * @description: 拖动和调整大小时重新计算矩形属性以及重绘直线
     * @param {*} tempRect 当前矩形副本
     * @param {*} currentRect 当前矩形实际数据
     * @return {*}
     */
    handleGridItemChange(tempRect, currentRect) {
      // 重新计算左右圆圈坐标
      const newLeft = this.calcRectCircleCoord(tempRect).left;
      const newRight = this.calcRectCircleCoord(tempRect).right;
      // 矩形有画线则执行重绘
      if (tempRect.hasLine) {
        const { i, leftCircle, rightCircle } = tempRect;
        for (const item of this.customLines) {
          if (item.i !== i) {
            continue;
          }
          if (_.isEqual(leftCircle, item.start)) {
            this.fabricObj.remove(item.lineObj);
            this.drawCurve(newLeft, item.end, '#FAAB0C', item.type, item.guid);
            // 更新保存线段的数组对应项
            item.start = newLeft;
            item.lineObj = this.drawingObj;
          }
          if (_.isEqual(rightCircle, item.start)) {
            this.fabricObj.remove(item.lineObj);
            this.drawCurve(newRight, item.end, '#FAAB0C', item.type, item.guid);
            // 更新保存线段的数组对应项
            item.start = newRight;
            item.lineObj = this.drawingObj;
          }
        }
      }
      // 更新矩形坐标
      Object.assign(currentRect, { leftCircle: newLeft, rightCircle: newRight });
    },
    /**
     * @description: 根据已知点画线
     * @param {array} start 起点坐标
     * @param {array} end
     * @param {string} strokeColor 描边颜色
     * @param {string} type 已有边的方向 'left'or'right'
     * @param {string} guid 已有边的guid(拖拽时用)
     * @return {*}
     */
    drawLine(start, end, strokeColor, type = 'left', guid) {
      const x1 = start[0];
      const y1 = start[1];
      const x2 = end[0];
      const y2 = end[1];
      const line = new Fabric.fabric.Line([x1, y1, x2, y2], {
        stroke: strokeColor,
        hoverCursor: 'default',
        hasControls: false, // 关闭图层控件
        selectable: false // 去掉选中的效果
      });
      // 添加自定义属性方便删除操作
      const customId = guid ? guid : this.tempCoordinate.guid;
      const customType = type ? type : this.tempCoordinate.type;
      Object.assign(line, { customId, customType });
      this.drawingObj = line;
      this.fabricObj.add(line);
    },
    // 绘制三次贝塞尔曲线
    drawCurve(start, end, strokeColor, type = 'left', guid) {
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
        hasControls: false, // 关闭图层控件
        selectable: false // 去掉选中的效果
      });
      // 添加自定义属性方便删除操作
      const customId = guid ? guid : this.tempCoordinate.guid;
      const customType = type ? type : this.tempCoordinate.type;
      Object.assign(line, { customId, customType });
      this.drawingObj = line;
      this.fabricObj.add(line);
    },
    // 执行删除
    handleLineDelete() {
      if (!this.deleteObj){
        return;
      }
      const guid = this.deleteObj.customId;
      // 删除保存的数组中对应的线
      const ind = this.customLines.findIndex(v => v.guid === guid);
      this.customLines.splice(ind, 1);
      // 检查griditem状态
      for (const item of this.layoutData) {
        let flag = false;
        for (const line of this.customLines) {
          if (line.i === item.i){
            flag = true;
            break;
          }
        }
        item.hasLine = flag;
      }
      // 删除线
      this.fabricObj.remove(this.deleteObj);
      this.isMenuShow = false;
      this.deleteObj = null;
    },
    // 点击线展示操作菜单
    drawMenu(left, top) {
      const menu = document.getElementById('canvasMenu');
      menu.style.top = top;
      menu.style.left = left;
      this.isMenuShow = true;
    },
    // 重置画线状态
    resetDrawStatus() {
      this.isDrawingLine = false;
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
    },
    // 生成guid
    setGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    /**
     * @description: 已知起点和终点计算三次贝塞尔曲线的控制点
     * @param {Array<number>} start 起点坐标
     * @param {Array<number>} end 终点坐标
     * @param {Number} curvature 曲率
     * @return {Object}
     */
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
    // 打开预览
    openPreview() {
      this.showPreview = true;
      this.layoutShowData = _.cloneDeep(this.layoutData);
      this.$nextTick(() => {
        this.$refs.previewContent.initPage();
      });
    }
  }
};
</script>
<style scoped lang="less">
@import './dragedit.less';
</style>
<style scoped lang="less">
.crosshair{
  cursor: crosshair;
}
.preview-modal{
  ::v-deep .ivu-modal-wrap{
    height: 100vh;
    .ivu-modal{
      top: 0;
      height: 100%;
    }
    .ivu-modal-content{
      height: 100%;
    }
    .ivu-modal-body{
      padding: 0;
      height: calc(100% - 51px);
    }
  }
}
</style>