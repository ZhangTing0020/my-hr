import request from '@/utils/request'
/**
 * 获取角色列表
 * ***/
// get请求用params,其他的请求都能用data来传参,没有做加工以前
export function reqGetRoleListAPI(options) {
  return request({
    method: 'get',
    url: '/sys/role',
    data: options
  })
}

// 删除角色功能
export function reqDeleteRoleAPI(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 新增角色
export function reqAddRoleAPI(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
