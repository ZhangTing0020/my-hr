// 员工管理
import request from '@/utils/request'

// 获取员工的简单列表
export function getEmployeeSimpleAPI() {
  return request({
    //   一般以simple结尾的路径,都是下拉菜单
    url: '/sys/user/simple'
  })
}

// 这个接口是在 员工管理页面下的el-card中使用的
// 获取员工列表数据
export function reqGetEmployeeListAPI(options) {
  return request({
    methods: 'get',
    url: '/sys/user',
    data: options
  })
}
// 删除员工
export function reqDelEmployeeAPI(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}

// 新增员工
export function reqAddEmployeeAPI(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

// 更新username 及密码
export function reqSaveUserDetailById(data) {
  return request({
    method: 'put',
    url: `/sys/user/${data.id}`,
    data
  })
}

/** *
 *  读取用户详情的基础信息 (个人详情-下面的接口)
 * **/
export function reqGetPersonalDetail(id) {
  return request({
    method: 'get',
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息 (个人详情-下面的接口)
 * **/
export function reqUpdatePersonal(data) {
  return request({
    method: 'put',
    url: `/employees/${data.userId}/personalInfo`,
    data
  })
}

/** **
 * 获取用户的岗位信息  (岗位信息)
 * ****/
export function reqGetJobDetail(id) {
  return request({
    method: 'get',
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息  (岗位信息)
 * ****/
export function reqUpdateJob(data) {
  return request({
    method: 'put',
    url: `/employees/${data.userId}/jobs`,
    data
  })
}

// 批量导入员工
export function reqImportEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

// 分配角色给用户
export function reqAssignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
