<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="handleClose" @open="loadAllRoles">
    <!-- 角色列表 -->
    <el-checkbox-group v-model="roleIds" v-loading="loading">
      <el-checkbox v-for="item in allRoles" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>

    <template #footer>
      <el-button type="primary" size="small" @click="assignRole">确定</el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { reqGetRoleListAPI } from '@/api/settings.js'
import { getDetailInfo } from '@/api/user'
import { reqAssignRoles } from '@/api/employees.js'
export default {
  name: 'AssignRole',
  props: {
    // 用户id
    userId: {
      type: String,
      required: true
    },
    // 控制弹窗
    showRoleDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // 接口调用的加载状态
      loading: false,
      // 选中的角色列表
      roleIds: [],
      // 所有的角色列表
      allRoles: []
    }
  },
  methods: {
    // 给用户分配新的角色表单提交
    async assignRole () {
      // 看后台接口文档,需要的参数是什么?????????
      const ret = await reqAssignRoles({
        id: this.userId,
        roleIds: this.roleIds
      })
      if (ret.code === 10000) {
        // 分配角色成功，提示一下，关闭弹窗
        this.$message.success('分配角色成功')
        this.handleClose()
      }
    },

    // 获取所有的角色列表
    // async loadAllRoles() {
    //   try {
    //     // 获取该用户默认拥有的角色
    //     const info = await getDetailInfo(this.userId)
    //     console.log('获取该用户默认拥有的角色', info)
    //     this.roleIds = info.data.roleIds
    //     // 获取所有的角色列表数据
    //     const ret = await reqGetRoleListAPI({ page: 1, pagesize: 10000 })
    //     console.log('获取所有的角色列表数据', ret)
    //     if (ret.code === 10000) {
    //       this.allRoles = ret.data.rows
    //     }
    //   } catch {
    //     this.$message.error('获取角色列表失败')
    //   }
    // },

    // 上边的这段代码是可以优化的,因为调用两个api是没有顺序的,没有必要等一个返回结果后另一个才去发请求,两个await修饰api  是串行的,一个执行完了之后才去执行下一个

    // 可以进行以下优化,用的是promise.all这个方法,,,等到全部执行完毕之后,再去执行后边的代码
    // 类似的方法还有promise.race,,,取的值是返回的最快的返回值,,,

    // 获取所有的角色列表
    loadAllRoles() {
      this.loading = true
      // 获取该用户默认拥有的角色
      const info = getDetailInfo(this.userId)

      // 获取所有的角色列表数据
      const ret = reqGetRoleListAPI({ page: 1, pagesize: 10000 })

      Promise.all([info, ret]).then(values => {
        this.roleIds = values[0].data.roleIds
        this.allRoles = values[1].data.rows
      }).catch(() => {
        this.$message.error('获取角色列表失败')
      }).finally(() => {
        this.loading = false
      })
    },
    handleClose () {
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
