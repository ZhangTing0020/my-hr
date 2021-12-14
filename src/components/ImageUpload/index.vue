<template>
  <div class="upload-box">
    <!-- 怎么动态绑定类名??????????????? -->
    <!-- 三种方法 1.直接绑定   2.三元表达式绑定   3.对象绑定    下边的class就是用的对象绑定 -->
    <!-- 下边这几个属性触发的时机,谁先谁后呢????????? -->
    <el-upload
      :on-preview="preview"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :http-request="handleRequest"
      :before-upload="beforeUpload"
      :class="{ hidePlus: isLen }"
      list-type="picture-card"
      action="#"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog
      width="600px"
      top="8vh"
      title="图片预览"
      :visible.sync="showDialog"
    >
      <img width="100%" :src="imgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 导入腾讯云的包(sdk)
const cos = new COS({
  SecretId: 'AKIDtb2C6j5AyWnnWzB6kDPKyLRGn33nG8k5', // 身份识别 ID
  SecretKey: '5tQhhPq1vYu0oNfgRv84k9H7hz3qMccL' // 身份密钥
})
export default {
  // 这里如果不写name属性,在全局注册组件的时候,取其name属性,就会报错,Cannot read properties of undefined (reading ‘toLowerCase‘)
  name: 'ImageUpload',
  props: {
    // 从父组件传过来的数据,是数组包字符串,但是
    defaultImage: {
      type: [Array, String],
      required: true
    },
    limit: {
      type: Number,
      required: true
    }
  },
  data() {
    return {

      fileList: [
        {
          // url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          // 这里没有了默认值,为什么没有图片的时候,页面中会显示一个空白图片,并且右上角有绿色对勾
        }
      ],
      showDialog: false, // 控制显示弹层
      imgUrl: ''
    }
  },
  computed: {
    isLen() {
      // 这里会返回true 或者false 在上边动态绑定类名的时候,就根据true或者false来判断类名是否生效
      return this.fileList.length >= this.limit
    }
  },
  watch: {
    // 父组件传过来得数据是数组包字符串
    // 这里需要得是数组包对象
    // 怎么确定哪里需要得数据类型是什么呢????????????????
    // 因为腾讯云返回的每一张图片的数据都是一个对象,要保存在vue变量的fileList中,所以需要的就是数组包对象嘛?所以在这里需要转化一下
    // defaultImage(urls) {
    //   this.fileList = urls.map((url) => {
    //     return {
    //       url: url
    //     }
    //   })
    // }

    defaultImage(urls) {
      // Array.isArray(urls)   isArray 判断类型是不是数组,是的话就返回true  否则返回false
      // typeof判断类型的时候,所得到的值都是小写字母,并且是字符串
      // if (typeof (urls) === Object) {
      //   this.fileList = urls.map((url) => {
      //     return {
      //       url: url
      //     }
      //   })
      // }
      // // 下边这是为了判断如果父组件传来的是字符串,就将字符串变成数组包对象
      // if (typeof (urls) === String) {
      //   // 将字符串变成数组包对象
      //   this.fileList = [{ url: urls }]
      // }
      // }

      if (typeof (urls) === 'object') {
        this.fileList = urls.map((url) => {
          return {
            url: url
          }
        })
      }
      // 下边这是为了判断如果父组件传来的是字符串,就将字符串变成数组包对象
      if (typeof (urls) === 'string') {
        // 将字符串变成数组包对象
        this.fileList = [{ url: urls }]
      }
    }
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
      // console.log('验证通过')
      return
    },
    // 手动提交
    handleRequest(params) {
      console.log('handleRequest', params.file)
      // 在手动提交的时候,要将图片提交到第三方平台(腾讯云),再将腾讯云返回的地址传递给后台

      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: 'my-hr-1308732703' /* 存储桶名称 */,
            Region: 'ap-beijing' /* 存储桶所在地域，必须字段 */,
            Key: params.file.name /* 文件名 */,
            StorageClass: 'STANDARD', // 上传模式, 标准模式（默认即可）
            Body: params.file, // 上传文件对象
            onProgress: (progressData) => {
              console.log(JSON.stringify(progressData))
            }
          },
          (err, data) => {
            console.log(err, data)
            // 上传的结果：如果err有值，证明上传失败了，如果err是null表示上传成功
            // data表示上传成功后，腾讯云返回的图片地址,Location
            // 在vue变量fileList中和腾讯云返回的图片信息中对比,是不是同一张,是同一张的话,就能确定是已经在腾讯云上传成功,并且返回了blob地址(本地预览地址),但是并不能把这恶地址发给后台,发给后台的地址需要自己进行拼接,因为
            if (err) {
              this.$message.error('图片上传失败')
              return
            }
            // 图片上传成功 data不为空
            if (data.statusCode === 200) {
              // 在vue变量fileList中和腾讯云返回的图片信息中对比,是不是同一张,是同一张的话,就能确定是已经在腾讯云上传成功
              // 找到了的话,就给找到数据的status赋值为success,也就是给右上角显示绿色的对勾
              // 数组常见方法 find filter some
              const fileInfo = this.fileList.find((item) => {
                console.log(item.uid, params.file.uid)
                // 如果此处不return的话,,fileInfo就是undefined  只有定义,没有赋值
                // 箭头函数,如果函数体只有一行的话,是可以省略{} 和return的,默认是会return的
                return item.uid === params.file.uid
              })
              // console.log(fileInfo)
              if (fileInfo) {
                // 之前action自动上传的时候,当文件上传成功之后,,,图片右上角会有一个绿色的对勾,,,这里涉及到一个状态   on-change这个属性上绑定的函数的参数file中 status: "ready"  当图片上传成功之后,会将状态置为success
                // 如果fileInfo非空,并且是上传到腾讯云是成功的,就将status
                // find返回的是满足条件的第一个元素,,,现在是数组包对象,所以fileInfo是一个对象,不是数组
                // fileInfo[0].status = 'success'
                fileInfo.status = 'success'
                // 将腾讯云返回的图片地址赋值给vue变量fileList 传递给后端
                // 最终最终最终 vue变量fileList中url存的值是这个,用的是这个地址去给后端
                // 所以在父组件中,应该要拿到这个url地址,在父组件ImageUpload上绑定ref属性,然后
                // this.$refs.XXX.fileList就能拿到这个值了
                // *************************************
                // this.fileList.url = 'https://' + data.Location 这里为什么不是给this.fileList.url赋值,而是给fileInfo.url赋值   而fileInfo.url又是怎么和fileList.url产生联系的??????是watch监听函数嘛?????
                fileInfo.url = 'https://' + data.Location
                console.log(this.fileList.url) // undefined
              }
            } else {
              this.$message.error('图片上传失败')
            }
          }
        )
      }
    },
    //
    handleChange(file, fileList) {
      // file.raw.uid  file.size   file.name
      console.log('handleChange', file, fileList)

      this.fileList = fileList
    },
    // 移除图片
    handleRemove(file, fileList) {
      // console.log('handleRemove', file, fileList)

      this.fileList = fileList
    },
    // 预览图片
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    }
  }
}
</script>

<style scoped lang="scss">
// el-upload--picture-card 是动态生成的,所以要用 深度选择器来穿透
// scss中的深度选择器需要使用 ::v-deep  /deep/
.upload-box {
  // hidePlus限制+ 号,只允许上传一张照片
  // 但是这个组件是允许上传多张图片的,到时候,允许上传的图片张数由父组件传过来
  // 当加上这个类之后,就可以隐藏 + 号,但是当把原有的一张图片删除时候,就应该将 + 显示出来
  //  文件列表移除文件时的钩子 on-remove 上绑定的方法 handleRemove 第二个参数是删除文件之后的文件列表
  // 将删除之后的 文件列表赋值给vue变量fileList,当vue变量fileList变化之后,就会触发计算属性,,,
  // 所以,hidePlus这个类就不会生效

  // 当删除了原来的照片之后,再自行添加照片,也就是手动提交照片,会触发http-request,
  // 在http-request上绑定了函数handleRequest有一个参数,这个参数有一个属性file,file里边有uid name size type  不知道handleRequest带的形参有什么,可以打印argumens,,绑定一个点击事件
  // 要将这个照片的地址放在vue变量的fileList中去,不然后边没办法将数据提交给后台
  ::v-deep .hidePlus {
    .el-upload--picture-card {
      display: none;
    }
  }
}
</style>
