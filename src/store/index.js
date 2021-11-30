import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import global from './modules/global'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 局部模块
  modules: {
    app,
    settings,
    user
  },
  // 全局模块
  ...global
})

export default store
