<template>
  <!-- 作用：选中一个Excel文件，解析里面的数据，传递到当前组件 -->
  <upload-excel :on-success="onSuccess" />
</template>

<script>
import { reqImportEmployee } from '@/api/employees.js'
export default {
  name: 'Import',
  methods: {
    // 判断选择文件的合理性
    // beforeUpload (file) {
    //   // file表示选中的文件
    //   // 判断文件的大小
    //   if (file.size > 8 * 1024) {
    //     this.$message.error('文件不可以超过8k')
    //     return false
    //   }
    //   return true
    // },

    // js读取excel数据后的时间格式转换
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    },

    async onSuccess (data) {
      // 参数data表示解析Excel之后的数据
      // console.log(data.header, data.results)
      // const ret = this.translateData(data.results)
      // console.log(ret)
      const list = this.translateData(data.results)
      if (list && list.length > 0) {
        try {
          const ret = await reqImportEmployee(list)
          if (ret.code === 10000) {
            // 批量导入成功
            this.$router.push('/employees')
            this.$message.success('导入成功')
          }
        } catch {
          this.$message.error('批量导入失败')
        }
      }
    },
    // 需求：需要把data.header和data.results转换成数组结构的数据
    //
    /* execl表格中得数据
    [
      {入职日期:43353,姓名:"张飞",工号:88088,手机号:18888888888,转正日期:56609},
      {入职日期:43353,姓名:"关于",工号:88089,手机号:18888888888,转正日期:56609}
    ]
    */
    /**  需要传递给后台得数据
      result = [
        { timeOfEntry: '2021-11-10', mobile: 123123123, username: '李四', correctionTime: '2021-11-10', workNumber: 8888},
        { timeOfEntry: '2021-11-10', mobile: 123123123, username: '李四', correctionTime: '2021-11-10', workNumber: 8888},
        { timeOfEntry: '2021-11-10', mobile: 123123123, username: '李四', correctionTime: '2021-11-10', workNumber: 8888},
      ]
    */
    translateData (list) {
      // 参数header表示Excel表头信息；list表示Excel中的数据
      // 对应关系
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const result = []
      // list是list表示Excel中的数据  item是每一条数据
      list.forEach(item => { // item表示数组中包裹得每一个对象
        // 单行数据
        const row = {}
        for (const key in item) { // 因为数组中包裹得每一个元素都是对象,所以要用for in遍历
          // 根据中文的key获取英文的key
          const enKey = userRelations[key] // 这里的key就是 "入职日期" "手机号" userRelations[key]就是timeOfEntry mobile

          const value = item[key] // item[key] 就是execl表格中传过来元素中的属性值

          // 日期的值需要转换格式
          //* ******************下边是 将数据进行拼接,传递给后台 row[enKey] = value **************************************8 */
          if (['timeOfEntry', 'correctionTime'].includes(enKey)) {
            // 这个属性是时间，需要把数字转换为年月日格式
            row[enKey] = this.formatDate(value)
          } else {
            // 向对象中放入一个键值对
            row[enKey] = value
          }
        }
        // 添加一个人的信息到数组里面
        result.push(row)
      })
      return result
    }
  }
}

</script>

<style>
</style>
