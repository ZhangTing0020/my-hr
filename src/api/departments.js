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

export {
  getDepartmentsAPI
}
