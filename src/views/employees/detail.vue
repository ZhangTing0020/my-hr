<template>
  <div class="employees-detail-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账号设置">
            <!-- 放置表单 -->
            <el-form
              ref="pwdForm"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
              :rules="rules"
              :model="pwdInfo"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="pwdInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password">
                <el-input
                  v-model="pwdInfo.password"
                  style="width: 300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleUpdate">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 放置个人详情 -->
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- 内容 -->
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getDetailInfo } from '@/api/user.js'
import { reqSaveUserDetailById } from '@/api/employees.js'
import UserInfo from './components/UserInfo.vue'
import JobInfo from './components/JobInfo.vue'
export default {
  name: 'EmployeesDetail',
  components: { UserInfo, JobInfo },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      pwdInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '密码不可以为空', trigger: ['blur', 'change'] },
          { min: 6, max: 9, message: '密码必须是6-9位', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    // 加载用户名和密码
    async loadUserInfo () {
      const ret = await getDetailInfo(this.id)
      console.log(ret)
      this.pwdInfo.username = ret.data.username
      this.pwdInfo.password = ret.data.password
    },
    // 重置密码
    handleUpdate () {
      this.$refs.pwdForm.validate(async valid => {
        if (!valid) return
        // 调用接口更新
        console.log('123123')
        const ret = await reqSaveUserDetailById({
          ...this.pwdInfo,
          id: this.id
        })
        console.log(ret)
        if (ret.code === 10000) {
          this.$message.success(ret.message)
        } else {
          this.$message.error('更新信息失败')
        }
      })
    }
  }
}

</script>
