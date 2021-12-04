<template>
  <!-- 一级路由中的hidden,是false就渲染,是true就不渲染 -->
  <div v-if="!item.hidden">
    <!-- 集中控制一组元素的条件渲染,但是template标签本身不会被渲染出来,,,  只是在逻辑层控制一下 -->

    <!-- 判断二级路由中的children,
    1.如果children中有hidden,就不渲染
    2.如果没有hidden属性,就把children这个数组对象赋值给onlyOneChild
    -->
    <!-- hasOneShowingChild(item.children, item) -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <!-- 在路由文件中,children里边有meta属性 -->
      <!-- 因为想要支持a标签,所以才没有直接写成router-link,而是封装成app-link -->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 不需要耳机菜单 -->
    <!-- <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu> -->
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    // this指的就是这个SideBarItem这个对象
    // onlyOneChild这个属性的属性值,可以是任意类型的
    // 此时是数组,存的是二级路由中的符合条件的children
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // 判断路由映射是否有子路由映射,如果有唯一的子路由映射,就显示这个子路由信息作为菜单项
    // 如果没有子路由应摄入,就显示一级路由作为菜单项
    // children = []是默认参数, 传来实参就用实参,没有实参就将children赋值为空
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        //
        if (item.hidden) {
          // 如果hidden是true,排除这项数据
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          // 没有hidden属性,就筛选出这个数据
          this.onlyOneChild = item
          return true
          // filter 这个方法 返回true  就是把筛选的值放在新数组中
        }
      })

      // When there is only one child router, the child router is displayed by default
      // 筛选出来的数组长度是1的话,就返回true,
      if (showingChildren.length === 1) {
        return true
      }

      // 没有hidden属性,onlyOneChild中就有值, showingChildren中就有筛选出来的数据

      // 有hidden属性,onlyOneChild中就没有值,showingChildren中就是空数组,
      // 该子组件隐藏,那就要有显示的子组件
      // Show parent if there are no child router to display
      // 如果筛选数组的长度是0的话,说明二级路由中也没有hidden属性
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      // isExternal是判断routePath是合法的url嘛
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      // 拼接路径（Node.js提供的一个方法 path.resolve用于拼接路径）
      // routePath表示二级路由的路径
      // basePath表示一级路由的路径
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
