// 员工管理
import request from '@/utils/request'

// 获取员工的简单列表
export function getEmployeeSimpleAPI() {
  return request({
    //   一般以simple结尾的路径,都是下拉菜单
    url: '/sys/user/simple'
  })
}
