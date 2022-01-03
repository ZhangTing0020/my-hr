<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <!-- 1. 在这个匿名插槽中,可以省略了template 直接写span,因为page-tools这个组件中,除了具名插槽,剩下的就是匿名插槽了
        2. 也可以把template加上,在tamplate标签上不写任何东西
        3. 也可以在template标签上写 v-slot:default ,匿名插槽的名字是默认名字,即为default
        4. v-slot:  可以简写成#
        -->
        <template v-slot:default>
          <span>本月最新新闻</span>
        </template>
        <!-- <span>本月最新新闻</span> -->
        <template v-slot:right>
          <el-button @click="$router.push('/import')">导入</el-button>
          <el-button @click="handleExport()">导出</el-button>
          <el-button @click="openDialog()">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 员工列表信息 -->
      <el-card style="margin-top: 10px">
        <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据，用label属性来定义表格的列名。可以使用width属性来定义列宽。 -->
        <el-table border :data="list">
          <el-table-column
            label="序号"
            type="index"
            sortable=""
            :index="handleIndex"
          />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="工号" prop="workNumber" sortable="" />

          <!-- 添加一列  显示头像 -->
          <el-table-column label="头像" sortable="">
            <!-- 这里要用到作用域插槽???为什么 什么时候要用作用域插槽,什么时候不用 -->
            <!-- 要用到子组件内的数据,这里是需要一个staffPhoto -->
            <template v-slot="scope">
              <!-- <button @click="ceshiScope(scope)" /> -->
              <!-- 自定义指令v-imgerror,如果赋值给src的值是null，那么不会触发请求，那么也不会触发onerror事件 -->
              <!-- 图片标签是img  不是image 因为写成了image 图像不显示 -->
              <img
                v-imgerror
                :src="scope.row.staffPhoto"
                style="width: 50px; height: 50px; border-radius: 25px"
                alt=""
                @click="showCodeBox(scope.row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <!-- 方法3 - 基于element UI中的 formatter属性-->

          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            sortable=""
            :formatter="formatterHireType"
          >
            <!-- 因为后端聘用形式是数字,展示在页面上的时候不能显示成数字,所以要用枚举的形式
            在api/component/employees.js中写了枚举文件,根据id获取到枚举文件中的value -->

            <!-- 方法1 ---过滤器-------------------------------------------- -->
            <!-- <template v-slot="scope">
              <span @click="ceshi(scope)">{{ scope.row.formOfEmployment| formatType }}</span>
            </template> -->
            <!-- <template v-slot="scope">
              {{ scope.row.formOfEmployment| formatType }}
            </template> -->
            <!-- --------------------------------------------------------- -->

            <!-- 方法2 -作用域插槽------------------------------------ -->
            <!-- <template v-slot="scope">
              {{ formatHireType(scope.row.formOfEmployment) }}
            </template> -->
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
            <!-- 作用域插槽处理时间 -->
            <template v-slot="scope">
              <!-- 用的是过滤器 -->
              {{ scope.row.timeOfEntry | formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable="">
            <!-- 这里只展示后台返回的数据,不进行操作,接口文档中没有接口 -->
            <!-- v-model作用在组件上,是实现父子组件之间数据的双向传输,但是这里不用双向传输 -->
            <!-- v-model的原理   就是 :value   @input的结合 -->
            <!-- v-model作用在原生DOM标签上 -->
            <!-- 详见@/views/my-test -->
            <!-- <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949">
           </el-switch> 因为父子组件中现在不要进行双向数据传输,所以不用v-model,,,而是要了解v-model的原理,然后进行拆分,只需要父组件将数据传给子组件,,,但是子组件不能给父组件派发时间来修改父组件的数据 -->
            <template v-slot="scope">
              <div>
                <!-- 可以使用active-color属性与inactive-color属性来设置开关的背景色。 -->
                <!-- 设置active-value和inactive-value属性，接受Boolean, String或Number类型的值。 -->
                <el-switch
                  :inactive-value="0"
                  :active-value="1"
                  :value="scope.row.enableState"
                  active-color="green"
                  inactive-color="lightgrey"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push('/employees/detail/' + row.id)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="handleRole(row.id)"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="reqDelEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 el-pagination-->
        <div style="height: 60px; margin-top: 10px">
          <el-pagination
            :total="total"
            :current-page="queryData.page"
            :page-size="queryData.size"
            :page-sizes="[2, 10, 20, 30, 40]"
            layout="total,sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 弹窗组件 新增员工的dialog-->
    <add-employee :show-dialog.sync="isShow" @closeDialog="closeDialog" />

    <!-- 二维码弹窗 -->
    <el-dialog
      title="二维码"
      :visible="showCodeDialog"
      @close="showCodeDialog = false"
    >
      <el-row type="flex" justify="center">
        <!-- 绘制二维码的画布 -->
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 分配角色弹窗 -->
    <AssignRole :user-id="userId" :show-role-dialog.sync="showRoleDialog" />
  </div>
</template>

<script>
// 第二次犯这个错误了, 按需导出的时候,没有按需导入,导致给后端的请求发不出去
// 导出的时候有default,就是默认导出,没有default就是按需导出
import { reqGetEmployeeListAPI, reqDelEmployeeAPI } from '@/api/employees.js'
import AddEmployee from './components/AddEmployee'
import typeEnum from '@/api/constant/employees.js'
import moment from 'moment'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue'
export default {
  name: 'Employees',
  // 局部注册,用的是filters 全局注册用的是Vue.filter
  components: {
    AddEmployee,
    AssignRole
  },
  filters: {
    formatType(value) {
      console.log(typeEnum)
      // find方法返回的是数组中符合条件的元素
      const obj = typeEnum.hireType.find((item) => {
        return item.id === value
      })
      return obj.value
    }
  },
  data() {
    return {
      isShow: false, // 控制dialog的显示与隐藏
      queryData: {
        page: 1,
        size: 10
      },
      total: 0,
      list: [],
      // 当前分配角色的用户id
      userId: '',
      // 控制分配角色弹窗
      showRoleDialog: false,
      // 二维码弹窗标志位
      showCodeDialog: false,
      defaultImg:
        'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2146034403,1504718527&fm=26&gp=0.jpg'
    }
  },
  created() {
    this.reqGetEmployeeList()
  },
  methods: {
    ceshiScope(scope) {
      console.log(scope)
    },
    // ??????????????????????????????????????????????????????????
    showCodeBox(url) {
      if (!url) return
      // 数据变成true之后，此时弹窗是否已经显示了？没有
      // 必须保证弹窗打开后，才去获取DOM元素
      this.showCodeDialog = true
      this.$nextTick(() => {
        // 保证前面的数据更新的页面完成渲染后触发回调
        // 生成当前头像的url地址的二维码，渲染到弹窗里面
        const dom = this.$refs.myCanvas
        QrCode.toCanvas(dom, url)
      })
    },
    // 给用户分配角色
    handleRole(id) {
      this.userId = id
      this.showRoleDialog = true
    },
    getExportData(headers, list) {
      // 根据对应关系,获取转换之后的数据
      const result = []
      list.forEach((item) => {
        const row = [] // 产生一行数据
        // 如果这里来遍历item对象,获取到的中文名有的就是undefined
        // 因为headers数组中,并不是导出所有的值,headers中有几项数据,就在后端返回的数中,挑出这几个数据展示在execl中
        // 所以必须来遍历headers对象
        //   for (const key in item) {
        //     // 取中文属性名
        //     const cnKey = headers[key]
        //     // 获取到属性值
        //     const value = item[key]
        //     console.log(cnKey, value)
        //     row.push(value)
        //   }
        //   result.push(row)
        // })

        for (const key in headers) {
          // 取英文属性名
          const enKey = headers[key]
          // 获取到属性值
          let value = item[enKey]
          // console.log(enKey, value)
          // 判断入职时间  转正时间,将其转化成yyyy-MM-DD
          if (['timeOfEntry', 'correctionTime'].includes(enKey)) {
            try {
              // row.push(value.moment(item[enKey]).format('yyyy-MM-DD'))
              value = moment(item[enKey]).format('yyyy-MM-DD')
            } catch {
              value = '无效日期'
            }
          }
          // // 判断聘用方式   是正式还是非正式
          if (['formOfEmployment'].includes(enKey)) {
            // 1 正式  2  非正式    typeEnum
            if (item[enKey] === 1) value = '正式'
            else value = '非正式'
          }
          row.push(value)
        }
        result.push(row)
      })

      return result
    },
    async handleExport() {
      // 导出的数据列表表头
      // const headers = {
      //   'username': '姓名',
      //   'mobile': '手机号',
      //   'timeOfEntry': '入职日期',
      //   'formOfEmployment': '聘用形式',
      //   'correctionTime': '转正日期',
      //   'workNumber': '工号',
      //   'departmentName': '部门'
      // }
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // reqGetEmployeeListAPI获取员工列表数据
      const rawData = await reqGetEmployeeListAPI({
        page: 1,
        size: 50
      })
      // 根据对应关系,获取转换之后的数据
      const list = await this.getExportData(headers, rawData.data.rows)

      // Object.keys 是ES6提供的函数用于获取对象的所有的key，最终形成数组
      const title = Object.keys(headers)
      // 也就是说,路由懒加载的返回值是一个promise实例
      import('@/vendor/Export2Excel').then((excel) => {
        excel.export_json_to_excel({
          // 这里暂时是假数据,需要做一个数据转换,才能导出,这里写的就是转换之后的数据
          // data中需要的是二维数组
          // header: ['姓名', '工资'], // 表头 必填
          // data: [
          //   ['刘备', 100],
          //   ['关羽', 500]
          // ], // 具体数据 必填
          header: title, // 表头 必填
          data: list, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    closeDialog(status) {
      console.log(status)
      this.isShow = status
    },
    openDialog() {
      console.log('打开弹窗')
      this.isShow = true
      // return this.isShow
    },
    async reqDelEmployee(id) {
      console.log(id)
      try {
        const ret = await this.$confirm('确定删除该员工信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch((err) => err)

        if (ret === 'cancel') return
        const result = await reqDelEmployeeAPI(id)
        console.log(result)
        if (result.code === 10000) {
          this.$message.success('删除信息成功')
          this.reqGetEmployeeList()
        } else {
          // console.log('11111111111111111')
          this.$message.error('删除信息失败')
        }
      } catch {
        // console.log('222222222222222222222')
        this.$message.error('删除信息失败')
      }
    },
    // ********************************************************
    formatterHireType(row) {
      const obj = typeEnum.hireType.find(
        (item) => item.id === row.formOfEmployment
      )
      return obj ? obj.value : ''
    },
    // 讲后端返回的数字,配合枚举文件,得到响应的文字
    // 配合方法2使用 ---作用域插槽
    formatHireType(value) {
      const obj = typeEnum.hireType.find((item) => item.id === value)
      return obj ? obj.value : ''
    },
    // 这里是为了验证el-table-column组件传来的参数scope,但是在实参中需要传入scope,,
    // 但是形参中可以写参数,也可以不写参数,因为函数内部打印的是动态参数
    // 配合方法1使用
    ceshi() {
      console.log(arguments)
    },
    // ********************************************************

    handleIndex(index) {
      return this.queryData.size * (this.queryData.page - 1) + index + 1
    },
    handleSizeChange(size) {
      this.queryData.size = size
      this.reqGetEmployeeList()
    },
    handleCurrentChange(page) {
      this.queryData.page = page
      this.reqGetEmployeeList()
    },
    async reqGetEmployeeList() {
      try {
        const ret = await reqGetEmployeeListAPI(this.queryData)
        // console.log(ret)
        if (ret.code === 10000) {
          this.list = ret.data.rows
          this.total = ret.data.total
          return this.list
        } else {
          this.$message.error('获取员工列表失败')
        }
      } catch {
        this.$message.error('获取员工列表失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.employees-container {
  .staff {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
}
</style>
