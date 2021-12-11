// 员工管理模块
import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工管理', icon: 'people' }
    },
    {
      path: 'detail/:id', // 动态路由参数
      component: () => import('@/views/employees/detail'),
      hidden: true,
      props: true, // 动态路由参数的获取方式：1、$route.params.id；
      // 2、利用路由映射的props:true 配置，组件中通过props获取即可
      meta: {
        title: '员工详情'
      }
    }
  ]
}
