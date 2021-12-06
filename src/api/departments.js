import request from '@/utils/request'

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

export {
  getDepartmentsAPI,
  delDepartmentsAPI
}
