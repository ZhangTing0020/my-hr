<template>
  <div>
    <div class="dashboard-container">
      <el-card class="tree-card">
        <!-- tree-tools 子组件通知父组件打开弹窗 -->
        <TreeTools
          :node-data="titleData"
          @on-open="toggleAddDept"
          @edit-dept="handleOpen"
        />
        <!-- 树形菜单 -->
        <el-tree :data="departs" :props="defaultProps">
          <!-- 中间的代码就是插槽内容，用于定制每一行的布局效果 -->
          <!-- 通过作用域插槽定制每一行的布局 -->

          <template v-slot="scope">
            <!-- 打印作用域插槽传过来的数据 -->
            <!-- <tree-tools
              :node-data="scope.data"
              @on-success="onSuccess"
              @on-open="toggleAddDept"
              @edit-dept="handleOpen"
            >{{ displayScope(scope) }} </tree-tools> -->

            <TreeTools
              :node-data="scope.data"
              @on-success="onSuccess"
              @on-open="toggleAddDept"
              @edit-dept="handleOpen"
            />
          </template>
        </el-tree>
      </el-card>

      <!-- 添加部门 -->
    </div>
    <!-- add-dept子组件通知父组件关闭弹窗 -->
    <!-- <add-dept :dept-id="currentDeptId" :dlist="dlist" :is-show-dept="isShowDept" @on-close="toggleAddDept" /> -->
    <!-- .sync修饰符作用：实现父子传值的双向绑定 -->
    <AddDept
      :dept-id="currentDeptId"
      :dlist="dlist"
      :is-show-dept.sync="isShowDept"
      :plist="plist"
      @on-success="onSuccess"
    />
  </div>
</template>

<script>
import TreeTools from './components/TreeTools.vue'
import AddDept from './components/AddDept.vue'
import { getDepartmentsAPI, editDepartmentAPI } from '@/api/departments.js'
import { translateListToTreeData } from '@/utils/index.js'
export default {
  name: 'Departments',
  components: { TreeTools, AddDept },
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
      // 当前点击的部门id,添加部门的时候需要用
      currentDeptId: '-1',
      // 控制添加部门弹窗的显示和隐藏
      isShowDept: false,
      // 后台返回的原始数据,departs也是原始数据,但是后来给转成了二叉树了,
      // 需要重新定义一个数组,来接收原始数据
      dlist: [],
      departs: [],
      plist: null, // 根据id获得的部门信息
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
        root: true,
        id: ''
      },
      arr: []
    }
  },
  created() {
    this.loadDepartmentsList()
    // this.ceshi()
    //
  },
  methods: {
    async handleOpen(id) {
      console.log(arguments)
      try {
        const ret = await editDepartmentAPI(id)
        console.log(ret)
        if (ret.code === 10000) {
          this.plist = ret.data
          console.log(this.plist)
          this.isShowDept = true
          this.currentDeptId = id
        }
      } catch {
        this.$message.error('编辑失败')
      }
    },
    onSuccess() {
      this.loadDepartmentsList()
    },
    // 测试用的函数,为了看el-tree组件返回的scope数据
    displayScope(scope) {
      console.log('el-tree返回的数据', scope)
    },
    // 将这个方法设置成工具方法,,,导入直接调用即可
    // // 把普通数组转化为树形结构的数据
    // translateListToTreeData(list, id) {
    //   const result = [] //传来的是数组,返回的也是数组,不过是一个二维数组
    //   list.forEach((item) => {
    //     /* 递归跳出条件,最后一次循环时,item.pid 与 id不等,于是不进入这个if条件,
    //     也就不再执行translateListToTreeData
    //     */
    //     if (item.pid === id) {
    //       const children = this.translateListToTreeData(list, item.id)
    //       if (children && children.length > 0) {
    //         item.children = children
    //       }
    //       result.push(item)
    //     }
    //   })

    //   // 传来的是数组,返回的是数组
    //   // 把一级部门当作是数组的一个元素,二级部门的所有数据当作是一级部门的一个属性children
    //   return result
    // },
    async loadDepartmentsList() {
      try {
        const ret = await getDepartmentsAPI()
        // console.log(ret.data.depts)
        if (ret.code === 10000) {
          // this.departs = ret.data.depts
          // ret.data.depts就是后台返回的所有数据(包括所有的一级部门,二级部门),
          /* 在translateListToTreeData中,区分一级部门还是二级部门, 一级部门的pid为空
          区分的条件是:一级部门的id 是二级部门的pid ,这两者相等的话,就是从属关系
          所以,传给在translateListToTreeData中的实参1就是整个数组,实参2是判断条件需要的id
          */
          this.dlist = ret.data.depts
          console.log(ret.data.depts)
          this.departs = translateListToTreeData(ret.data.depts, '')
          this.titleData.name = ret.data.companyName
        }
      } catch {
        console.log('getDepartmentsAPI 出错了')
        this.$message.error('获取部门列表数据失败')
      }
    },
    toggleAddDept(id) {
      this.currentDeptId = id
      this.isShowDept = true
    }
    // ceshi() {
    //   this.arr.forEach = (item) => {
    //     console.log('空数组能调用forEach')
    //   }
    //   console.log('空数组不能调用空数组') // 打印这个
    // }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 30px;
  font-size: 14px;
}
</style>
