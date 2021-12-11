<template>
  <div class="upload-excel">
    <div class="btn-upload">
      <el-button :loading="loading" size="mini" type="primary" @click="handleUpload">
        点击上传
      </el-button>
    </div>
    <!-- 点击如下的file标签触发弹窗效果 -->
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <i class="el-icon-upload" />
      <span>将文件拖到此处</span>
    </div>
  </div>
</template>
<script>
import XLSX from 'xlsx'
export default {
  name: 'UploadExcel',
  props: {
    // beforeUpload 之前是父组件传给子组件的,在上传文件之前做一些验证,文件大小之类的
    // 现在父组件把这个函数注释了,也没有传过来
    // 父组件是@/views/import/index.vue
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data () {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  methods: {
    // 获取最终的结果
    generateData ({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      // 父组件传递一个函数给子组件，子组件调用该函数并且传递实参
      // 这里是子组件传递实参给父组件??????????????????????????????????????????
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop (e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      // 获取拖拽的文件性信息
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      // 获取这个文件
      const rawFile = files[0] // only use files[0]
      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return
      }
      // 处理文件上传
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover (e) {
      e.stopPropagation()
      e.preventDefault()
      // 在文件悬停到区域之上时，显示复制效果
      e.dataTransfer.dropEffect = 'copy'
    },
    // 显示选择文件的弹窗
    handleUpload () {
      this.$refs['excel-upload-input'].click()
    },
    // 获取选中的文件信息
    handleClick (e) {
      // 获取选中的文件信息
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      // 处理要上传的Excel文件信息
      this.upload(rawFile)
    },
    // 处理文件数据
    upload (rawFile) {
      // 清除选中的文件信息  因为excel-upload-input中有短横线,所以不能用 点  来获取,所以用[]
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      // 做上传文件之前的检测工作：文件大小是否合理；文件类型判断。。。
      // beforeUpload 返回的是一个布尔值
      const before = this.beforeUpload(rawFile)
      if (before) {
        // 真正用于解析文件中Excel数据的操作
        this.readerData(rawFile)
      }
    },
    // 解析Excel数据
    readerData (rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        // 如果读取文件数据成功就触发onload事件
        reader.onload = e => {
          // 此时可以获取读取到的文件数据
          const data = e.target.result
          // 通过XLSX包提供的方法解析Excel格式数据
          const workbook = XLSX.read(data, { type: 'array' })
          // 获取Excel文件的第一个sheet页面的名称
          const firstSheetName = workbook.SheetNames[0]
          // 根据sheet的名称得到sheet的具体信息
          const worksheet = workbook.Sheets[firstSheetName]
          // 得到表格的表头信息
          const header = this.getHeaderRow(worksheet)
          // 获取表格的数据行并且转换为json格式
          const results = XLSX.utils.sheet_to_json(worksheet)
          // 把header和数据拼接到一块，生成最终解析的结果
          this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        // 读取选中的文件数据到内存
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow (sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel (file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>
<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin-top: 100px;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #bbb;
    width: 350px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }
  .drop {
    padding-top: 20px;
    line-height: 80px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
    }
  }
}
</style>
