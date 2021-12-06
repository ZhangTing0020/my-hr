<template>
  <!-- 用了一个行列布局 -->
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col :span="20">
      <span> {{ nodeData.name }} </span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col> {{ nodeData.manager }} </el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <!-- elementUI中,下拉菜单的指令事件 点击菜单项后会触发事件，
          用户可以通过相应的菜单项 key 进行不同的操作 -->
          <el-dropdown @command="handleAction">
            <span style="cursor: pointer">
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <!-- <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>添加子部门</el-dropdown-item>
              <template v-if="!nodeData.root">
                <el-dropdown-item>编辑部分</el-dropdown-item>
                <el-dropdown-item @click.native="delDepartments(nodeData.id)">删除部门</el-dropdown-item>
              </template>
            </el-dropdown-menu> -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <template v-if="!nodeData.root">
                <el-dropdown-item command="edit">编辑部分</el-dropdown-item>
                <el-dropdown-item command="del">删除部门</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartmentsAPI } from '@/api/departments.js'
export default {
  name: 'TreeTools',
  props: {
    nodeData: {
      type: Object,
      default: () => {}
    }
  },
  // created() {
  //   console.log(this.nodeData)
  // },
  // .sync修饰符可以实现子组件与父组件的双向绑定，并且可以实现子组件同步修改父组件的值。
  methods: {
    handleAction(type) {
      if (type === 'add') {
        this.addDept()
        console.log('add')
      } else if (type === 'edit') {
        console.log('edit')
      } else if (type === 'del') {
        this.delDepartments(this.nodeData.id)
      }
    },
    // 删除部门
    async delDepartments(id) {
      const ret = await this.$confirm('删除该部门嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)

      if (ret === 'cancel') return

      const delMessage = await delDepartmentsAPI(id)
      console.log(delMessage)
      if (delMessage.code === 10000) {
        // 删除成功，提示一下，刷新列表
        this.$message.success('删除成功')
        this.$emit('on-success')
      }
    },
    addDept() {
      // 通知父组件打开弹窗
      this.$emit('on-open', this.nodeData.id)
    }
  }
}
</script>

<style>
</style>
