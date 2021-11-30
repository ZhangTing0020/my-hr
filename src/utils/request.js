import { config } from '@vue/test-utils'
import axios from 'axios'
import store from '../store'
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
    config.headers.Authorization = 'Bearer ' + token
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

// import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// // create an axios instance
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // request timeout
// })

// // request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// // response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service
