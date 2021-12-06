<template>
  <div class="dashboard-container">
    <el-card class="tree-card">
      <tree-tools :node-data="titleData" />
      <!-- 树形菜单 -->
      <el-tree :data="departs" :props="defaultProps">
        <!-- 中间的代码就是插槽内容，用于定制每一行的布局效果 -->
        <template v-slot="scope">
          <tree-tools :node-data="scope.data" />
        </template>
      </el-tree>
    </el-card>
  </div>
</template>

<script>
import TreeTools from './components/TreeTools.vue'
import { getDepartmentsAPI } from '@/api/departments.js'
export default {
  name: 'Departments',
  components: { TreeTools },
  data() {
    // return {
    //   list: [
    //     {
    //       label: '企业部',
    //       children: [
    //         { label: '策划部' },
    //         { label: '游戏部' }
    //       ]
    //     },
    //     { label: '事件部' },
    //     { label: '小卖部' }
    //   ]
    // }
    // 万一后台给的树形数据, 不是label 和 children 字段名呢 ?通过 props 修改默认配置
    return {
      departs: [
        {
          name: '总裁办',
          manager: '曹操',
          children: [{ name: '董事会', manager: '曹丕' }]
        },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }
      ],
      defaultProps: {
        // 万一后台给的树形数据, 不是label 和 children 字段名呢 ?通过 props 修改默认配置
        // label	指定节点标签为节点对象的某个属性值
        // children	指定子树为节点对象的某个属性值
        // label  children 是子组件规定好的名字,如果附件中不是叫这两个名字,就通过 props 修改默认配置
        // 上边的manager
        label: 'name',
        children: 'children'
      },
      // 标题的数据
      titleData: {
        name: '江苏传智播客教育科技股份有限公司',
        manager: '负责人',
        root: true
      },
      arr: []
    }
  },
  created() {
    this.loadDepartmentsList()
    this.ceshi()
  },
  methods: {
    // 测试用的函数,为了看el-tree返回的数据
    displayScope(scope) {
      console.log('el-tree返回的数据', scope)
    },
    // 把普通数组转化为树形结构的数据
    translateListToTreeData (list, id) {
      const result = []
      list.forEach(item => {
        /* 递归跳出条件,最后一次循环时,item.pid 与 id不等,于是不进入这个if条件,
        也就不再执行translateListToTreeData
        */
        if (item.pid === id) {
          const children = this.translateListToTreeData(list, item.id)
          if (children && children.length > 0) {
            item.children = children
          }
          result.push(item)
        }
      })

      // 传来的是数组,返回的是数组
      // 把一级部门当作是数组的一个元素,二级部门的所有数据当作是一级部门的一个属性children
      return result
    },
    async loadDepartmentsList() {
      try {
        const ret = await getDepartmentsAPI()
        console.log(ret)
        if (ret.code === 10000) {
          // this.departs = ret.data.depts
          // ret.data.depts就是后台返回的所有数据(包括所有的一级部门,二级部门),
          /* 在translateListToTreeData中,区分一级部门还是二级部门, 一级部门的pid为空
          区分的条件是:一级部门的id 是二级部门的pid ,这两者相等的话,就是从属关系
          所以,传给在translateListToTreeData中的实参1就是整个数组,实参2是判断条件需要的id
          */
          this.departs = this.translateListToTreeData(ret.data.depts, '')
          this.titleData.name = ret.data.companyName
        }
      } catch {
        console.log('getDepartmentsAPI 出错了')
        this.$message.error('获取部门列表数据失败')
      }
    },
    ceshi() {
      this.arr.forEach = (item) => {
        console.log('空数组能调用forEach')
      }
      console.log('空数组不能调用空数组') // 打印这个
    }

  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 30px;
  font-size: 14px;
}
</style>
