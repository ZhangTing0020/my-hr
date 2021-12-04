<template>
  <!-- 这里的component是动态组件  is属性中写的是组件名称,这里的type是由计算属性计算得到的-->
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      // 判断to的值是否是一个标准的url地址
      return isExternal(this.to)
    },
    type() {
      if (this.isExternal) {
        // 如果to的值是网址,那么就生成a标签
        // 因为想要支持a标签,所以才没有直接写成router-link,而是封装成app-link
        return 'a'
      }
      // 不是网址,就生成router-link标签
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        // 如果to的值是一个标准的网址
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }

      // to的值不是网址,而是路由的路径
      return {
        to: to
      }
    }
  }
}
</script>
