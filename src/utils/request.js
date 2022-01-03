// import { config } from '@vue/test-utils'
import axios from 'axios'
import store from '../store'

import router from '../router'
import { removeToken } from './auth'
import { resetRouter } from '@/router'
// 基准路径(node.js中提供了获取环境变量的API: process.env.环境变量的名称)
const baseURL = process.env.VUE_APP_BASE_API
// const baseURL = 'http://localhost:9528/dev-api'

// 创建axios实例对象
const service = axios.create({
  baseURL: baseURL
})

// 添加请求拦截器
service.interceptors.request.use(config => {
  // 统一添加请求头,如果有token,就添加请求头Authorization
  const token = store.getters.token
  if (token) {
    // config.headers.Authorization = 'Bearer ' + token
    config.headers = {
      Authorization: 'Bearer ' + token
    }
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

// 添加响应拦截器
service.interceptors.response.use(res => {
  // res表示axios包装后的数据
  return res.data
}, (err) => {
// 处理token失效的问题
  if (err.response.status === 401 && err.response.data.code === 10002) {
    // 退出时重置路由
    // 1、清空token
    // 2、清空用户信息
    // 3、重置路由为静态路由
    // 4、清除vuex中动态路由
    // 5、跳转到登录页面

    // 删除vuex中的token
    store.commit('user/SET_TOKEN', '')
    // 删除本地存储中的token
    removeToken()
    // 删除用户信息
    store.commit('user/removeInfo', '')
    // 3、重置路由为静态路由 (清除动态路由映射信息)
    resetRouter()
    // 4、清除vuex中动态路由
    // 在局部模块中默认只能触发当前模块的mutation，如果想触发全局或者其他模块的mutation
    // 需要添加第三个参数 { root: true }
    store.commit('permission/setRoutes', [], { root: true })
    // 跳转到登录页面
    router.push('/login')

    // token已经失效；删除vuex中的token；删除本地缓存中的token，删除用户信息；跳转到登录页面
    // store.commit('user/SET_TOKEN', '')
    // // 删除本地缓存的token
    // removeToken()
    // // 删除用户信息
    // store.commit('user/clearInfo')
    // // 跳转到登录页面
    // router.push('/login')
  }

  return Promise.reject(err)
})

// 自定义函数封装通用调用接口的方法：支持固定的data传参
// 1. 传输传递；返回值
// 2. 参数如何使用，具体的发送请求的过程，与axios有关
export default (options) => {
  // 支持默认请求方式为GET（调用接口的时候不传递method属性）
  let key = ''
  if (options.method) {
    // 如果method传递了，那么GET请求使用params;其他请求使用data
    key = options.method.toUpperCase() === 'GET' ? 'params' : 'data'
  } else {
    // 如果没有传递method属性，那么默认使用GET请求；此时使用params传递参数
    key = 'params'
  }
  return service({
    url: options.url,
    // 默认请求方式是GET
    method: options.method || 'GET',
    // 如果请求方式是GET就是有params属性传递参数，其他方式使用data属性传递参数
    // ES6的规则：对象的键key可以是动态的
    [key]: options.data
  })
}

