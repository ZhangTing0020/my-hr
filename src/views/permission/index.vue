<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="handleAdd(1, '0')">添加权限</el-button>
        </div>
        <!-- 给 table 表格添加 row-key 属性（不要添加冒号），table的列表数据必须包含children属性 -->
        <!-- 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。 -->
        <!-- row-key中的id就是list中的属性,和下边的prop的用法一样 -->
        <!-- el-table表格
          el-table-column

         -->
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{row}">
              <el-button size="small" type="text" @click="handleAdd(2, row.id)">添加权限点</el-button>
              <el-button size="small" type="text" @click="toEdit(row.id)">查看</el-button>
              <el-button size="small" type="text" @click="handleDelete(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 添加权限的弹窗 -->
    <el-dialog :visible="showDialog" :title=" formData ? '查看':'添加权限点'" @close="showDialog = false">
      <!-- 表单内容 -->
      <!-- 表单验证的步骤
      1. 在el-form-item上绑定ref  :rules :model
      2. 在el-form-item上绑定prop
      3. 在el-input上绑定v-model
       -->
      <el-form ref="addRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <!-- el-switch 组件的用法 active-value="0" 表示选中的值 inactive-value="1" 表示禁用的值-->
          <!-- 可以使用active-color属性与inactive-color属性来设置开关的背景色 -->
          <!-- 设置active-value和inactive-value属性，接受Boolean, String或Number类型的值。 -->
          <el-switch v-model="formData.enVisible" active-value="0" inactive-value="1" active-text="启用" inactive-text="禁用" active-color="#13ce66" inactive-color="#eee" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right;">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 在权限管理页面中，我们设置了一个标识， 这个标识可以和我们的路由模块进行关联，
// 如果用户拥有这个标识，那么用户就可以 拥有这个路由模块，如果没有这个标识，就不能访问路由模块
// 如果用户拥有权限点标识，那么用户就可以操作对应的按钮，否则不可以。

// 1. 建立用户和权限的关联关系（通过角色间接建立）
// 2. 如何利用用户的权限关系控制访问操作：路由（一级权限）；功能按钮（二级权限）

import { reqGetPermissionList, reqAddPermission, reqDelPermission, reqGetPermissionDetail } from '@/api/permission'
import { translateListToTreeData } from '@/utils/index.js'
export default {
  name: 'Permission',
  data () {
    return {
      // 控制添加权限的弹窗
      showDialog: false,
      // 权限列表
      list: [], // 树形数据
      // 添加权限的表单数据
      formData: {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型(一级权限或者二级权限)
        pid: '' // 添加到哪个节点下
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: '权限点名称不能为空', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '权限点编码不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.loadPermissionList()
  },
  methods: {
    // 编辑
    async toEdit(id) {
      const ret = await reqGetPermissionDetail(id)
      this.formData = ret.data
      // 点编辑,,打开弹窗,回填表单数据
      this.showDialog = true
      // 先去请求数据
    },

    // 删除权限
    async handleDelete(id) {
      // 调接口,拿数据,铺页面
      // 这里最好给一个提示,,,是否要删除
      try {
        // 这里是需要异步等待
        const ret = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 点击了取消按钮
        if (ret === 'cancel') return

        const result = await reqDelPermission(id)
        if (result.code === 10000) {
          // 刷新页面
          this.loadPermissionList()
          this.$message.success('删除权限成功')
        } else {
          this.$message.error('删除失败')
        }
      } catch {
        this.$message.error('删除失败')
      }
    },
    closeDialog() {
      // 关闭弹窗
      this.showDialog = false
      // 重置表单
      this.$refs.addRef.resetFields()
      this.formData = this.$options.data().formData
    },
    // 添加权限弹窗控制
    handleAdd (type, pid) {
      // 权限级别
      this.formData.type = type
      // 权限的父id
      this.formData.pid = pid
      // 显示弹窗
      this.showDialog = true
    },
    // 添加权限提交表单
    handleSubmit () {
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          try {
            const ret = await reqAddPermission(this.formData)
            if (ret.code === 10000) {
              // 添加权限成功，关闭弹窗，刷新列表
              this.showDialog = false
              // 刷新列表*************************88
              this.loadPermissionList()
              // 重置表单
              this.$refs.addRef.resetFields()
              this.formData = this.$options.data().formData
            }
          } catch {
            this.$message.error('添加权限失败')
          }
        }
      })
    },
    // 加载权限列表数据
    async loadPermissionList () {
      try {
        const ret = await reqGetPermissionList()
        // 后端返回的数据是普通数组的形式,并不是树状结构,所以需要对这个数据进行处理
        if (ret.success) {
          // 把列表数据转换为树形数据
          this.list = translateListToTreeData(ret.data, '0')
          console.log(this.list)
        } else {
          this.$message.error('获取权限列表失败')
        }
      } catch {
        this.$message.error('获取权限列表失败')
      }
    }
  }
}
</script>
