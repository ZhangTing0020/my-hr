import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import global from './modules/global'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 局部模块
  modules: {
    app,
    settings,
    user,
    permission
  },
  // 全局模块
  ...global
})

export default store

// export const myTest = 'vuex测试'
