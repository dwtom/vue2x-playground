<!--
 * @Description: iview表格内容合并
 * @Author: Dong Wei
 * @Date: 2020-12-24 09:53:58
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-02-23 10:04:04
 * @FilePath: \vue2x-playground\src\views\iview\TableCombine.vue
-->
<template>
  <div>
    <Table
      :columns="columns"
      :data="tableData3"
      class="table"
      width="1000"
      border
      :span-method="handleSpan"
    >
      <template slot="action">
        <a>编辑</a>
        <Divider type="vertical" />
        <a>删除</a>
      </template>
    </Table>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'TableCombine',
  data() {
    return {
      columns: [
        {
          title: '班级',
          align: 'center',
          key: 'class'
        },
        {
          title: '情况',
          align: 'center',
          children: [
            {
              title: '姓名',
              key: 'name',
              align: 'center'
            },
            {
              title: '年龄',
              key: 'age',
              align: 'center'
            }
          ]
        },
        {
          title: '操作',
          align: 'center',
          slot: 'action'
        }
      ],
      tableData: [
        {
          name: '张一',
          class: '1',
          age: 15
        },
        {
          name: '张二',
          class: '1',
          age: 14
        },
        {
          name: '王一',
          class: '2',
          age: 16
        },
        {
          name: '王二',
          class: '2',
          age: 15
        }
      ],
      tableData2: [
        [
          {
            name: '张一',
            class: '1',
            age: 15
          },
          {
            name: '张二',
            class: '1',
            age: 14
          }
        ],
        [
          {
            name: '王一',
            class: '2',
            age: 16
          },
          {
            name: '王二',
            class: '2',
            age: 15
          }
        ]
      ],
      tableData3: []
    };
  },
  created() {
    const groupTemp = this.groupTableData(this.tableData);
    this.tableData3 = this.setTableData(groupTemp);
  },
  methods: {
    handleSpan({ row, column, rowIndex, columnIndex }) {
      // console.log(row);
      // if(rowIndex === 0 && columnIndex === 0) {
      //   return [2, 1];
      // } else if (rowIndex === 1 && columnIndex === 0) {
      //   return [0, 0];
      // }
      // if(rowIndex === 2 && columnIndex === 0) {
      //   return [2, 1];
      // } else if (rowIndex === 3 && columnIndex === 0) {
      //   return [0, 0];
      // }
      if (columnIndex === 0 || columnIndex === 3) {
        const rowSpan = row.rowSpan;
        const columnSpan = row.columnSpan;
        return [rowSpan, columnSpan];
      }
    },
    // 将原始一维数据按照特定条件分组
    groupTableData(arr) {
      const classNames = [];
      arr.forEach(v => {
        if (!classNames.includes(v.class)){
          classNames.push(v.class);
        }
      });
      const resArr = [];
      classNames.forEach(className => {
        const groupItem = [];
        arr.forEach(v => {
          if (v.class === className){
            groupItem.push(v);
          }
        });
        resArr.push(groupItem);
      });
      return resArr;
    },
    // 将分组后的数据转化为table组件需要的一维数组
    setTableData(arr) {
      const resArr = _.cloneDeep(arr);
      resArr.forEach(classItem => {
        // 遍历每一个分组
        classItem.forEach((val, ind) => {
          if (ind === 0) {
            Object.assign(val, { rowSpan: classItem.length, colSpan: 1 });
          } else {
            Object.assign(val, { rowSpan: 0, colSpan: 0 });
          }
        });
      });
      // 多维数组扁平化
      return _.flattenDeep(resArr);
    }
  }
};
</script>
<style scoped>

</style>