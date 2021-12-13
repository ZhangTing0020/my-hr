<template>
  <div class="upload-box">
    <el-upload
      :on-preview="preview"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :http-request="handleRequest"
      :before-upload="beforeUpload"
      :class="hidePlus"
      list-type="picture-card"
      action="#"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog width="600px" top="8vh" title="图片预览" :visible.sync="showDialog">
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>

export default ({
  // 这里如果不写name属性,在全局注册组件的时候,取其name属性,就会报错,Cannot read properties of undefined (reading ‘toLowerCase‘)
  name: 'ImageUpload',
  data() {
    return {
      fileList: [
        {
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      showDialog: false, // 控制显示弹层
      imgUrl: ''
    }
  },
  computed: {

  },
  methods: {
    // 上传前的类型以及大小的验证
    beforeUpload(file) {
      console.log('beforeUpload', file)
      if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
        // 这里是要终止代码的执行,需要return false
        this.$message.error('仅仅支持png/jpeg/gif')
        return false
      }
      if (file.size / 1024 / 1024 > 1) {
        this.$message.error('文件大小不能超过1M')
        return false
      }
      // 验证通过
      console.log('验证通过')
      return
    },
    // 手动提交
    handleRequest(params) {
      console.log('handleRequest', params)
    },
    //
    handleChange(file, fileList) {
      // file.raw.uid  file.size   file.name
      console.log('handleChange', file, fileList)
    },
    // 成功做的处理
    handleSuccess() {

    },
    // 移除图片
    handleRemove(file, fileList) {
      console.log('handleRemove', file, fileList)
    },
    // 预览图片
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    }
  }
})
</script>

<style scoped lang="scss">
// el-upload--picture-card 是动态生成的
.upload-box {
  .hidePlus{

  }
}
</style>
