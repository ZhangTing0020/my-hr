<template>
  <el-dialog title="新增员工" :visible="showDialog">
    <!-- 表单 -->
    <el-form ref="refForm" label-width="120px" :rules="addEmRules" :model="addEmForm">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="addEmForm.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addEmForm.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="formOfEmployment">
        <el-date-picker v-model="addEmForm.formOfEmployment" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="workNumber">
        <el-select v-model="addEmForm.workNumber" style="width:50%" placeholder="请选择">
          <!-- item.value 是正式还是非正式   item.id 是唯一id 给后台提供的 -->
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="departmentName">
        <el-input v-model="addEmForm.departmentName" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="timeOfEntry">
        <el-input v-model="addEmForm.timeOfEntry" style="width:50%" placeholder="请选择部门" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="addEmForm.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Types from '@/api/constant/employees.js'
import { reqAddEmployeeAPI } from '@/api/employees.js'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hireType: Types.hireType,
      addEmForm: {
        username: '',
        mobile: '',
        formOfEmployment: -1,
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      addEmRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: ['blur'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      }

    }
  },
  methods: {
    // 这里没做兜底校验*****************************
    async handleSubmit() {
      try {
        // 点击确定,调用接口,提交表单, 清空表单,关闭弹窗
        const ret = await reqAddEmployeeAPI(this.addEmForm)
        console.log(ret)
        if (ret.code === 10000) {
          this.$message.success('员工信息提交成功')
          this.closeDialog()
        } else {
          console.log('else*********')
          // this.$message.error('员工信息提交失败111')
        }
      } catch {
        console.log('catch**************8')
        // this.$message.error('员工信息提交失败222')
      }
    },
    closeDialog() {
      // 点击取消,关闭弹窗,清空表单
      // this.showDialog = false
      this.$refs.refForm.resetFields()
      this.$options.data().form
      // 改变父组件中的控制dialog显示与隐藏的变量
      this.$emit('closeDialog', false)
    }
  }
}
</script>

<style>

</style>
