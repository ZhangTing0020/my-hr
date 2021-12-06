// 定义一个组件
// plugin中导入自己的组件并全局注册

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
  }
}

export default myImgerror

