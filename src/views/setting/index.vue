<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 左侧 -->
          <el-tab-pane label="角色管理">
            <!-- 按钮 -->
            <!-- 新增角色,点击新增角色的按钮,出现弹窗,需要用一个状态位,来控制弹窗的显示与关闭 -->
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="isShowAddBox=true"
            >新增角色</el-button>
            <!-- 表格 -->
            <!-- v-loading 是el-table中的自定义指令,需要绑定一个布尔值 -->
            <el-table v-loading="loading" :data="list">
              <!-- type="index" :index="handleIndex" 是ElementUI提供的 修改每一条数据的序号 只是:index中的方法名有所变化 -->
              <el-table-column type="index" :index="handleIndex" label="序号" width="100" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <!-- 这里是作用域插槽
                以前学的作用域插槽都是自己写的,现在用的都是插件写好的,,作用域插槽是父组件为了用子组件中的数据,
                所以有v-slot
                   <MyTreeTest :data="list">
                     <template v-slot="scope">
                         《{{ scope.data.name }}》
                     </template>
                   </MyTreeTest>
                   上边这个就是之前的用法
                 -->
                <template v-slot="scope">
                  <el-button size="small" type="success" @click="openPermission(scope.row.id)">分配权限</el-button>
                  <el-button size="small" type="primary">编辑</el-button>
                  <!-- 删除角色的时候,需要传入一个实参id,这个id的来源是要用到作用域插槽
                通过子组件传给父组件的id,来删除角色 -->
                  <el-button
                    size="small"
                    type="danger"
                    @click="reqDeleteRole(scope.row.id)"
                  >删除</el-button>
                </template>

              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
              layout="total,sizes, jumper,prev, pager, next"
              :page-sizes="[2, 10, 20, 30, 40, 50, 100]"
              :total="total"
              :current-page="queryData.page"
              :page-size="queryData.pagesize"
              @size-change="changeSize"
              @current-change="changePage"
            />
          </el-tab-pane>

          <el-tab-pane label="公司信息">
            <!-- 公司信息 -->
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 添加角色的弹出框,没有单独写在一个组件中 -->
    <el-dialog
      title="提示"
      :visible.sync="isShowAddBox"
      width="30%"
    >
      <!-- *************************** 这一段用的是el-form组件********************************************* -->
      <el-form ref="roleForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>
      <!-- ************************************************************************ -->

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm(form)">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 在员工管理页面里边,给每一个员工分配角色
    这里的角色就相当于一个职位,每一个职位的权限不同
    分配权限的弹层 -->
    <!-- loadPermissionList 打开弹窗时调用,获取所有的权限列表数据 -->
    <el-dialog title="分配权限" :visible.sync="showAuthDialog" @open="loadPermissionList">
      <div>权限列表</div>
      <!-- default-expanded-keys和default-checked-keys设置默认展开和默认选中的节点,需要注意的是，此时必须设置node-key，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的 -->
      <!-- 在弹窗的中间将数据展示成一个树状结构 -->
      <!-- props 根据后端返回的字段名称来修改对应关系 -->
      <el-tree
        ref="tree"
        :data="permissionData"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defaultAuth"
        :props="defaultProps"
      />
      <!-- - data 表示树的所有数据
           - props 设置节点显示的数据名称
           - show-checkbox 显示选择框
           - node-key 设置数据节点的唯一表示的属性
           - :default-checked-keys="[5, 10]"表示id是5的节点被选中
           - show-checkbox 表示是否显示复选框
           - default-expand-all 默认展开
           - check-strictly  设置true, 可以关闭父子关联(父级节点可以单独选择)
 -->
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="showAuthDialog=false">取消</el-button>
          <el-button type="primary" @click="handAuth">确定</el-button>

        </div>
      </template>
    </el-dialog>
    -->
  </div>
</template>

<script>
import { reqGetRoleListAPI, reqDeleteRoleAPI, reqAddRoleAPI, reqGetRoleDetail } from '@/api/settings.js'
import { reqGetPermissionList } from '@/api/permission.js'
import { translateListToTreeData } from '@/utils/index.js'
import { reqAssignPerm } from '@/api/settings'
export default {
  data() {
    return {
      // 下边分页中用到的数据
      queryData: {
        page: 1,
        pagesize: 10
      },
      // 角色列表
      list: [],
      total: 0,
      loading: true,
      isShowAddBox: false, //  控制添加角色弹出框的显示与关闭
      showAuthDialog: false, // 给角色分配权限
      roleId: '', // 记录正在操作的角色
      permissionData: [], // 存储权限数据,所有的权限列表数据 ,调接口获取的
      // 角色默认拥有的权限
      defaultAuth: [],
      // 设置树的显示格式, 后端给的数据不一定是label,所以要改变对应关系
      defaultProps: {
        label: 'name'
      },
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.reqGetRoleList()
  },
  methods: {
    // 点击确定之后,提交数据,调接口
    async handAuth() {
      try {
        const ret = await reqAssignPerm({
          id: this.roleId,
          // 当前树结构复选框所有选中的
          permIds: this.$refs.tree.getCheckedKeys()
          // permIds: this.defaultAuth
        })
        console.log(ret)
        if (ret.code === 10000) {
          this.showAuthDialog = false
          this.$refs.tree.setCheckedKeys([])
          this.permissionData = []
        }
      } catch {
        this.$message.error('提交失败')
      }
    },
    loadPermissionList() {
      // Dialog 打开的回调 open上绑定的方法
      // 在这个方法中,获取所有的权限,也就是permission/index.vue中的,获取所有的权限,调取同样的接口
      const ret1 = reqGetPermissionList()

      // 获取当前角色的权限,,,他本身就具有的权限
      const ret2 = reqGetRoleDetail(this.roleId)
      // 因为获取所有的权限列表以及获取当前角色的权限,没有先后顺序,所以不用顺序异步等待
      // 因为调用两个api是没有顺序的,没有必要等一个返回结果后另一个才去发请求,两个await修饰api  是串行的,一个执行完了之后才去执行下一个
      console.log(ret1, ret2)
      Promise.all([ret1, ret2]).then(values => {
        // permissionData用来接收后台返回的原始数据,后边根据原始数据转换成树形数据
        // 一级节点的pid都是 '0'
        // **************************************************************
        // 如果第一个参数传不对的话,只会显示复选框,没有name,开发的过程中遇到过
        this.permissionData = translateListToTreeData(values[0].data, '0')
        // **************************************************************

        // this.$nextTick(() => {
        // 角色默认拥有的权限
        this.defaultAuth = values[1].data.permIds
        // })
        // console.log(this.permissionData)
        // console.log(this.defaultAuth)
        // 控制节点的选中有两种方案
        // 1.直接用el-tree中的属性 :default-checked-keys 将返回的值放在数组中,然后赋值给这个属性
        // 2.给这个el-tree中绑定ref属性,然后通过this.$refs.tree.setCheckedKeys 设置

        //  const defaultAuth = values[1].data.permIds
        // setCheckedKeys 通过 key 设置
        // this.$refs.tree.setCheckedKeys(defaultAuth)
      }).catch(() => {
        this.$message.error('获取权限失败')
      })
    },
    // 分配权限,点击打开
    openPermission(id) {
      this.showAuthDialog = true
      // 打开dialog之后,将后台返回的数据,展示成树状结构
      this.roleId = id
    },
    // 提交表单
    async submitForm(form) {
      try {
        // 提交表单,关闭弹窗,清空表单
        const ret = await reqAddRoleAPI(form)
        if (ret.code === 10000) {
          // console.log(ret)
          // 关闭弹窗 清空表单,重新渲染页面
          this.isShowAddBox = false
          // 重置表单,可以用this.$refs.roleForm.resetFields() 这个和prop有关系,只有加了prop属性的数据才能重置,没有加prop属性的数据并不能重置
          // 也可以用this.$options.data().form,这个能重置所有的数据,但是并不会重置校验规则,上一次校验不通过报的红字,下一次点进去还在
          // this.$options
          // 所以可以结合上边的两种一起使用
          this.$refs.roleForm.resetFields()
          this.reqGetRoleList()
          this.$message.success('添加角色成功')
        } else {
          this.$message.error('添加角色失败')
        }
      } catch {
        this.$message.error('添加角色失败')
      }
    },
    handleClose() {
      this.isShowAddBox = false
      // 关闭弹窗 清空表单
      this.$refs.roleForm.resetFields()
    },
    // 删除角色
    async reqDeleteRole(id) {
      console.log(arguments) // 从这里能看到子组件中都有哪些数据,row下边有id
      try {
        const ret = this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (ret === 'cancle') return
        // 下边是点击确定的情况
        const result = await reqDeleteRoleAPI(id)
        if (result.code === 10000) {
          console.log('111')
          // 重新渲染页面
          this.reqGetRoleList()
        } else {
          this.$message.error('删除角色失败')
        }
      } catch {
        this.$message.error('删除角色失败')
      }
    },
    // 切换每页的条数
    changeSize(size) {
      // 这个形参,是Vue底层传过来的,点击哪个传哪个
      // console.log(arguments) // 动态参数,来确认调用这个函数的@函数有几个形参
      // console.log(size)
      this.queryData.pagesize = size
      // 重新渲染页面
      this.reqGetRoleList()
    },
    // 切换页码的变化
    changePage(page) {
      // console.log(arguments)
      console.log(page)

      this.queryData.page = page
      // 重新渲染页面
      this.reqGetRoleList()
    },
    // 处理分页后的序号问题 ,这个序号问题,是在el-table组件上的,不是Pagination 分页上的属性
    handleIndex(index) {
      return this.queryData.pagesize * (this.queryData.page - 1) + index + 1
    },
    // 获取角色列表信息
    async reqGetRoleList() {
      try {
        const ret = await reqGetRoleListAPI(this.queryData)
        if (ret.code === 10000) {
          // console.log(ret.code)
          this.list = ret.data.rows
          // 在分页管理中,左右箭头中的数字不变化,是因为这里没有给total赋值,total为0 ,
          // 所以没办法给总页码进行分页
          this.total = ret.data.total
        }
      } catch {
        this.$message.error('获取所有角色列表失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
