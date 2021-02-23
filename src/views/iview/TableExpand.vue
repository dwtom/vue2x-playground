<!--
 * @Description: iview 表格展开
 * @Author: Dong Wei
 * @Date: 2021-02-23 10:04:24
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-02-23 10:25:03
 * @FilePath: \vue2x-playground\src\views\iview\TableExpand.vue
-->
<template>
  <Table
    :columns="tableColumns"
    :data="tableData"
  ></Table>
</template>

<script>
import ExpandContent from './components/TableExpandContent';
export default {
  name: 'TableExpand',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ExpandContent
  },
  data() {
    return {
      tableColumns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h ( ExpandContent, {
              props: {
                row: params.row
              }
            });
          }
        },
        {
          title: 'name',
          key: 'name'
        },
        {
          title: 'address',
          key: 'address'
        }
      ],
      tableData: [
        {
          name: 'aaa',
          address: '1234567',
          list: [
            {
              name: 'a1'
            },
            {
              name: 'a2'
            }
          ]
        }
      ]
    };
  },
  methods: {}
};
</script>
<style scoped>

</style>