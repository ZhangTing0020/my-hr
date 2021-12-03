// 导入Vue构造函数
import Vue from 'vue'
// 导入重置浏览器差异的样式文件
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// 导入ElementUI插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 软件国际化：多语言支持
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 导入全局样式
import '@/styles/index.scss' // global css
// 导入根组件
import App from './App'
// 导入vuex的store对象
import store from './store'
// 导入vue-router实例对象
import router from './router'
// 导入图标文件svg
import '@/icons' // icon
// 权限控制（控制是否登录的访问权限）
import '@/permission' // permission control

import myPlugin from './utils/plugin.js'
import defaultImg from '@/assets/common/head.jpg'
Vue.use(myPlugin, { default: defaultImg })

// 实现模拟接口的功能（用js代码写的假的临时接口）
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// 配置ElementUI插件并且传递插件的配置选项（用于支持国际化）
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 实例化Vue：把App这个根组件挂载到index.html页面的id是app的div里面
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
