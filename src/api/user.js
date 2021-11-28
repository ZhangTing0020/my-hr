import request from '@/utils/request'
// axios  get请求用params   post请求用data
// 需求:传递参数时,不区分参数传递方式
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
