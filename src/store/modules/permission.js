// 管理所有的路由映射
import { constantRoutes, dynamicRouters } from '@/router'

const state = {
  // 路由表, 标记当前用户所拥有的所有路由
  routes: constantRoutes // 默认静态路由表
}

const mutations = {
  // otherRoutes登录成功后, 需要添加的新路由
  setRoutes(state, otherRoutes) {
    // 静态路由基础上, 累加其他权限路由
    state.routes = [...constantRoutes, ...otherRoutes]
  }
}

const actions = {
  // 根据用户的权限过滤动态路由映射信息
  filterDynamicRoutes (context) {
    // console.log(context)
    // 获取用户的路由权限
    const menus = context.rootState.user.userInfo.roles.menus
    // 从所有的动态路由中筛选出该用户所拥有的动态路由信息
    const myAuth = dynamicRouters.filter(item => {
      return menus.includes(item.children[0].name)
    })
    // 把动态合并到state里面
    context.commit('setRoutes', myAuth)
    // 把筛选出的动态路由返回
    return myAuth
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
