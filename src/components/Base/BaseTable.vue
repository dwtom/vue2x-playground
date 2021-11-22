<!--
 * @Description: table组件封装(分子级组件)
 * @Author: Dong Wei
 * @Date: 2021-11-22 15:50:31
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-11-22 16:53:02
 * @FilePath: \vue2x-playground\src\components\Base\BaseTable.vue
-->
<template>
  <Table
    :data="data"
    :loading="status.loading"
    v-bind="customAttrs"
    v-on="$listeners"
  >
    <!-- 自定义列模板 -->
    <template
      v-for="(item,ind) in customColumnTemplates"
      :slot="item.slot"
      slot-scope="{row, index}"
    >
      <div :key="`tablecustom-${ind}`">
        <slot
          :name="item.slot"
          :[item.slot]="{row, index}"
        ></slot>
      </div>
    </template>
  </Table>
</template>

<script>
export default {
  name: 'BaseTable',
  inheritAttrs: false,
  props: {
    data: {
      type: Array,
      default: () => []
    },
    // table的props 以及其它自定义属性
    config: {
      type: Object,
      default: () => {
        return {
          tableProps: {}, // iview-table的属性放入此对象（剔除了data和一些状态属性如loading）
        };
      }
    },
    status: {
      type: Object,
      default: () => {
        return {
          loading: false
        };
      }
    }
  },
  data() {
    return {
    };
  },
  computed: {
    // 获取从父组件直接传入iview的属性
    customAttrs() {
      return {
        ...this.config.tableProps
      };
    },
    // 从config.tableProps.columns中过滤出自定义列
    customColumnTemplates() {
      const columns = this.config?.tableProps?.columns || [];
      return columns.filter(val => Object.hasOwnProperty.call(val, 'slot'));
    }
  },
  methods: {}
};
</script>
<style scoped>

</style>
