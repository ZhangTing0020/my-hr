<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- sidebar-item是自定义组件,routes是下边的计算属性  -->
        <!-- item 父传子,传给了子组件SidebarItem -->
        <!-- 在index.vue中的routes是怎么来的呢  是通过下边的计算属性 return this.$router.options.routes-->
        <!--  this.$router.options.routes  -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar', 'routes']),
    // routes() {
    //   // console.log('000000000', this.$route)
    //   // console.log('11111111111111', this.$router)
    //   // 因为通过vue-router的this.$router.options.routes 无法获取动态路由映射(仅仅可以获取静态路由)
    //   // 所以就将所有的路由放在vuex中管理
    //   // 所以就在store/modules/加了permission.js
    //   // return this.$router.options.routes
    //   return this.$store.state.permission.routes
    //  这里还有更简单的写法,在store/getters下边加上 routes: state => state.permission.routes
    //  ...mapGetters(['sidebar']), 但是这里需要将getters中的routes映射过来 ,这样的话,模板也不用发生变化
    // },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
