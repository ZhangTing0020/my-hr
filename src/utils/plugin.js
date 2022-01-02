// 定义一个组件
// plugin中导入自己的组件并全局注册

import PageTools from '@/components/PageTools'
import moment from 'moment'
import store from '@/store'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import { Message } from 'element-ui'
const myImgerror = {
  install(Vue, options) {
    // console.log('111111', options)
    Vue.directive('imgerror', {
      inserted(el, bindings) {
        // 处理图片路劲是null的情况
        if (!el.src) el.src = bindings.value || options.default

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
      },
      // 如果img的src的属性值是null,那么不会发送请求，也不会触发onerror事件
      // componentUpdated触发的条件：绑定指令的标签依赖的数据发生变更时
      componentUpdated (el, bindings) {
        // console.log('----------------------------')
        // console.log(options)
        el.setAttribute('src', el.src || bindings.value || options.default)
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

    // 扩展一个实例方法:用于判断按钮的操作权限
    Vue.prototype.$isOk = (authPoint) => {
      // authPoint表示此时判断的是哪一个按钮的标志  判断authPoint在不在points中
      // 先获取所有的points 从store中获取所有的权限点
      // const allPoints = store.state.user.userInfo.roles.points // 这里的代码太长,于是放在了getters中
      const allPoints = store.getters.points
      if (allPoints.includes(authPoint)) {
        // 有权限，返回true
        return true
      } else {
        Message.error('没有该操作权限')
        return false
      }
    }
  }
}

export default myImgerror

