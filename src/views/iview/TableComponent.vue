<!--
 * @Description: 封装table组件 (使用inheritAttrs)
 * @Author: Dong Wei
 * @Date: 2021-11-22 15:45:51
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-11-22 16:54:33
 * @FilePath: \vue2x-playground\src\views\iview\TableComponent.vue
-->
<template>
  <div>
    <BaseTable
      :data="table.data"
      :config="table.config"
      :status="table.status"
      @on-row-click="handleRowClick"
    >
      <template #action="{action: obj}">
        <a @click="handleRowCheck(obj)">编辑</a>
      </template>
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from '@/components/Base/BaseTable.vue';
export default {
  name: 'TableComponent',
  components: {
    BaseTable
  },
  data() {
    return {
      table: {
        data: [
          {
            name: 'aaa',
            id: '001',
            age: 10
          },
          {
            name: 'b',
            id: '002',
            age: 12
          }
        ],
        config: {
          tableProps: {
            columns: [
              {
                title: '姓名',
                key: 'name'
              },
              {
                title: '编号',
                key: 'id'
              },
              {
                title: '年龄',
                key: 'age'
              },
              {
                title: '操作',
                slot: 'action',
              }
            ],
            stripe: true,
          }
        },
        status: {
          loading: false
        }
      }
    };
  },
  methods: {
    handleRowClick(row) {
      // console.log(row);
    },
    handleRowCheck(row) {
      console.log(row);
    }
  }
};
</script>
<style scoped>

</style>
