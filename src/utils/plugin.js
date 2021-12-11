// 定义一个组件
// plugin中导入自己的组件并全局注册

import PageTools from '@/components/PageTools'
import moment from 'moment'

import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
const myImgerror = {
  install(Vue, options) {
    // console.log('111111', options)
    Vue.directive('imgerror', {
      inserted(el, bindings) {
        // console.log(el)
        // el表示绑定该指令的DOM元素
        // bindings表示指令相关的信息 bindings.value
        // 如何判断图片加载失败了？基于img标签的onerror事件
        // 只有图片加载失败了,才会触发onerror事件
        el.onerror = () => {
          // console.log(el.src)
          // console.log('图片加载失败了')
          // 如果图片加载失败,就要给src属性重新赋值
          el.setAttribute('src', bindings.value || options.default)
        }
      }
    })

    // 全局注册组件\
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel) // 注册导入excel组件
    Vue.component(ImageUpload.name, ImageUpload) // 注册导入上传组件

    // 全局注册过滤器
    // 参数1:过滤器名 ,参数2:回调函数
    Vue.filter('formatTime', (value) => {
      // value 原数据流
      return moment(value).format('yyyy-MM-DD')
    })

    // Vue.component('PageTools', PageTools) // 注册工具栏组件
  }
}

export default myImgerror

