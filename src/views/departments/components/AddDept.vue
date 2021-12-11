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
  <el-dialog
    :title="getTitle"
    :visible="isShowDept"
    @close="handleClose"
    @open="getEmployeeSimple"
  >
    <!-- 匿名插槽 -->
    <el-form ref="addRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="form.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="form.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="form.manager"
          style="width: 80%"
          placeholder="请选择"
        >
          <!-- dialog对话框一出现,就向后台请求负责人列表 -->
          <el-option
            v-for="item in mlist"
            :key="item.username"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="form.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
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
import { getEmployeeSimpleAPI } from '@/api/employees.js'
import { reqAddDepartmentsAPI } from '@/api/departments.js'
export default {
  props: {
    isShowDept: {
      type: Boolean,
      required: true
    },
    dlist: {
      type: Array,
      default: () => ([])
    },
    // depId 是当前点击的Id
    deptId: {
      type: String,
      default: ''
    },
    // 编辑的资料
    plist: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 验证部门名称,,,同级部门不能有相同的名称
    const checkName = (rule, value, callback) => {
      // 获取到所有的同级部门(条件   :同级部门的pid都相同 )
      // 父级的id等于子级的pid    this.deptId现在指的是父级的id
      const departs = this.dlist.filter((item) => item.pid === this.deptId)

      const isOk = departs.some((item) => item.name === value)
      if (isOk) {
        callback(new Error('同级部门不可以重名'))
      } else {
        callback()
      }
    }
    // 验证部门编码是否有重复
    const checkCode = (rule, value, callback) => {
      // 在这里需要区分一下是添加部门 还是 编辑部门
      const isOk = this.dlist.some((item) => {
        // 添加部门,value是传过来的id,和全部的id比较,有一个重复的就返回false,并报错
        if (this.plist === null) item.id === value
        else {
          // 编辑部门

        }
      })
      if (isOk) {
        callback(new Error('部门编码有重复'))
      } else {
        callback()
      }
    }
    return {
      // managerList 负责人
      mlist: [],
      form: {
        id: '',
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空',
            trigger: ['blur', 'change']
          },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: ['blur', 'change']
          },
          { validator: checkName, trigger: ['blur'] }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空',
            trigger: ['blur', 'change']
          },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: ['blur', 'change']
          },
          { validator: checkCode, trigger: ['blur'] }
        ],
        manager: [
          {
            required: true,
            message: '部门负责人不能为空',
            trigger: ['blur', 'change']
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空',
            trigger: ['blur', 'change']
          },
          {
            min: 1,
            max: 300,
            message: '部门介绍要求1-300个字符',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  computed: {
    getTitle() {
      if (this.plist !== null) {
        // 计算属性只要单纯的运算，依赖某些值，得到某个值。不要做其他的操作，赋值，修改dom等。真的需要操作就放到watch里面。
        // this.form = { ...this.plist }

        // this.form.name = this.plist.name
        // this.form.id = this.plist.id
        // this.form.code = this.plist.code
        // this.form.manager = this.plist.manager
        // this.form.introduce = this.plist.introduce
        console.log('123', this.form)
        this.getEmployeeSimple()
      }
      // 如果plist为null的话,就是添加部门
      return this.plist === null ? '添加部门' : '编辑部门'
    }
  },

  methods: {
    async reqAddDepartments() {
      // 因为接口文档中要求加上pid,刚好再AddDept这个组件中接收了父组件传来的deptId(也就是父组件的id)
      // 因为父组件的id等于子组件的pid
      try {
        const ret = await reqAddDepartmentsAPI({
          ...this.form,
          pid: this.deptId
        })
        // console.log(ret)
        // 调接口,关闭弹窗,清空表单,重新渲染数据
        if (ret.code === 10000) {
          this.handleClose()
          this.$refs.addRef.resetFields()
          this.$emit('on-success')
        }
      } catch {
        // 清空表单
        this.$refs.addRef.resetFields()
        this.$message.error('添加部门失败')
      }
    },
    async getEmployeeSimple() {
      try {
        const ret = await getEmployeeSimpleAPI()
        if (ret.code === 10000) {
          // console.log(ret)
          this.mlist = ret.data
        }
      } catch {
        this.$message.error('获取管理员列表失败')
      }
    },
    handleAdd() {
      // 手动校验表单
      // ref可以操作原生DOM；也可以操作组件实例
      this.$refs.addRef.validate((valid) => {
        if (!valid) {
          console.log(this.$refs)
          return
        }
        // 点击确定之后,提交表单
        this.reqAddDepartments()
        // console.log(this.$refs, 'ok')
      })
    },
    handleClose() {
      // 通知父组件关闭弹窗
      // this.$emit('on-close', false)
      // this.$emit('update:属性名称', false) 配置.sync修饰符用法
      // 子组件如果想修改父组件通过.sync修饰符绑定的属性，必须采用这种方式触发事件
      this.$emit('update:is-show-dept', false)
      // 点击取消,关闭弹窗,清空表单
      this.$refs.addRef.resetFields()
    }

  }
}
</script>

<style>
</style>
