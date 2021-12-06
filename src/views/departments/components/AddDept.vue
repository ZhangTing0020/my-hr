<template>
  <!-- <el-dialog title="新增部门" :visible.sync="isShowDept" :before-close="handleClose">
    <span>这是一段信息</span>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="isShowDept = false">确 定</el-button>
    </span>
  </el-dialog> -->

  <!-- 表单验证
  1. 双向绑定数据 :model
  2. 验证规则 :rules
  3. 设置prop
  4. 兜底校验 ref,进到页面之后,没有输入任何值,也能登录进去,解决这个问题-->
  <el-dialog title="添加部门" :visible="isShowDept" @close="handleClose">
    <!-- 匿名插槽 -->
    <el-form ref="addRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 表单操作按钮 具名插槽   两个插槽是并列关系 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleAdd">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    isShowDept: {
      type: Boolean,
      required: true
    },
    dlist: {
      type: Array,
      default: () => []
    },
    // depId 是当前点击的Id
    deptId: {
      type: String,
      default: ''
    }
  },
  data() {
    // 验证部门名称,,,同级部门不能有相同的名称
    const checkName = (rule, value, callback) => {
      // 获取到所有的同级部门(条件   :同级部门的pid都相同 )
      // 父级的id等于子级的pid    this.deptId现在指的是父级的id
      const departs = this.dlist.filter(item => item.pid === this.deptId)

      const isOk = departs.some(item => item.name === value)
      if (isOk) {
        callback(new Error('同级部门不可以重名'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: checkName, trigger: ['blur'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },

  methods: {
    handleAdd() {
      // 手动校验表单
      // ref可以操作原生DOM；也可以操作组件实例
      this.$refs.addRef.validate(valid => {
        if (!valid) {
          console.log(this.$refs)
          return
        }
        console.log(this.$refs, 'ok')
      })
    },
    handleClose() {
      // 通知父组件关闭弹窗
      // this.$emit('on-close', false)
      // this.$emit('update:属性名称', false) 配置.sync修饰符用法
      // 子组件如果想修改父组件通过.sync修饰符绑定的属性，必须采用这种方式触发事件
      this.$emit('update:is-show-dept', false)
    }
  }

}
</script>

<style>
</style>
