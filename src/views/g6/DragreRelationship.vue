<!--
 * @Description: 层次布局隐藏节点之后关系重新计算
 * @Author: Dong Wei
 * @Date: 2020-12-24 10:19:06
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-24 10:44:51
 * @FilePath: \vue2x-playground\src\views\g6\DragreRelationship.vue
-->
<template>
    <div>
      <Button type="primary" @click="toggleNodes">切换节点</Button>
      <div id="mountNode"></div>
    </div>
</template>

<script>
import G6 from '@antv/g6';
import _ from 'lodash';
export default {
  name: 'DragreRelationship',
  data() {
    return {
      isShow: true, // 是否显示隐藏节点
      g6data: {
        // 点集
        nodes: [
          {
            id: 'node1',
            label: 'n1',
            type: 'normal'
          },
          {
            id: 'node2',
            label: 'n2',
            type: 'normal'
          },
          {
            id: 'node3',
            label: 'n3',
            type: 'normal'
          },
          {
            id: 'node4',
            label: 'n4',
            type: 'normal'
          },
          {
            id: 'hide1',
            label: 'h1',
            style: {
              fill: 'red'
            },
            type: 'hide'
          },
          {
            id: 'hide2',
            label: 'h2',
            style: {
              fill: 'red'
            },
            type: 'hide'
          }
        ],
        // 边集
        edges: [
          {
            source: 'node1',
            target: 'hide1'
          },
          {
            source: 'node2',
            target: 'hide1'
          },
          {
            source: 'hide1',
            target: 'hide2'
          },
          {
            source: 'hide2',
            target: 'node3'
          },
          {
            source: 'hide2',
            target: 'node4'
          }
        ]
      },
      g6graph: null
    };
  },
  mounted() {
    this.initDefault();
  },
  methods: {
    // 初始化g6实例
    initDefault() {
      const graph = new G6.Graph({
        container: 'mountNode',
        width: 800,
        height: 500,
        layout: {
          type: 'dagre',
          rankdir: 'LR'
        }
      });
      graph.data(this.g6data);
      graph.render();
      this.g6graph = graph;
    },
    // 切换节点显示隐藏
    toggleNodes() {
      this.isShow = !this.isShow;
      if (this.isShow) {
        this.g6graph.data(this.g6data);
        this.g6graph.render();
        return;
      }
      // 需要隐藏的节点的id集合
      const hideNodes = this.g6data.nodes.filter(v => v.type === 'hide').map(v => v.id);
      // 剩余正常显示的节点
      const restNodes = this.g6data.nodes.filter(v => v.type !== 'hide');
      // 旧的节点关系(过滤无关属性方便去重)
      const oldEdges = this.g6data.edges.map(v => {
        return {
          target: v.target,
          source: v.source
        };
      });
      // 新的节点关系
      let newEdges = [];
      // 无需改变的节点关系
      const noChanges = oldEdges.filter(v => {
        return !hideNodes.includes(v.target) && !hideNodes.includes(v.source);
      });
      hideNodes.forEach(hideItem => {
        // 被隐藏节点的下游节点
        const targetArr = this.getTargetOrSource('target', oldEdges, hideItem, hideNodes);
        // 被隐藏节点的上游节点
        const sourceArr = this.getTargetOrSource('source', oldEdges, hideItem, hideNodes);
        for (const target of targetArr) {
          for (const source of sourceArr) {
            noChanges.push({ source, target });
          }
        }
        newEdges.push(...noChanges);
        // 去重
        newEdges = _.uniqWith(newEdges, _.isEqual);
      });
      const newData = {
        nodes: restNodes,
        edges: newEdges
      };
      this.g6graph.data(newData);
      this.g6graph.render();
    },
    /**
     * @description: 根据已有条件获取被隐藏节点的上游或下游节点
     * @param {String} type source/target
     * @param {*} oldEdges 根据上下文获取的旧的节点关系
     * @param {*} hideItem 当前遍历的需要隐藏的点
     * @param {*} hideNodes 所有需要隐藏的点的id的集合
     * @return {Array}
     */
    getTargetOrSource(type, oldEdges, hideItem, hideNodes) {
      const result = [];
      const typeJudged = type === 'source' ? 'target' : 'source';
      oldEdges.forEach(v => {
        if (v[typeJudged] === hideItem) {
          if (hideNodes.includes(v[type])){
            const currentItem = v[type];
            const restHideNodes = _.without(hideNodes, v[type]); // 当前值从隐藏节点数组中去掉
            const res = this.getTargetOrSource(type, oldEdges, currentItem, restHideNodes);
            result.push(...res);
          } else {
            result.push(v[type]);
          }
        }
      });
      return result;
    }
  }
};
</script>
<style scoped>

</style>