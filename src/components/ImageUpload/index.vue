<template>
  <div class="upload-box">
    <el-upload
      :on-preview="preview"
      :file-list="fileList"
      list-type="picture-card"
      :limit="1"
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
        { url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ],
      showDialog: false, // 控制显示弹层
      imgUrl: ''
    }
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    }
  }
})
</script>
