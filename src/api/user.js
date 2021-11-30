import request from '@/utils/request'

// 传递参数时，不区分参数传递方式
// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    data: { token }
  })
}

// 退出
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
