import request from '@/utils/request'
// 获取所有的部门
const getDepartmentsAPI = () => {
  // return request({
  //   url: '/company/department',
  //   timeout: 30000
  // })
  return request({
    url: '/company/department'
  })
}

// 根据id删除部门
const delDepartmentsAPI = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 提交表单
// 添加部门提交表单
const reqAddDepartmentsAPI = (data) => {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 编辑部门资料
const editDepartmentAPI = (id) => {
  return request({
    url: `/company/department/${id}`
    // method: 'put'
  })
}
export {
  getDepartmentsAPI,
  delDepartmentsAPI,
  reqAddDepartmentsAPI,
  editDepartmentAPI
}
