import Layout from '@/layout'

// 组织架构模块
export default {
  path: '/departments',
  component: Layout,
  children: [
    {
      path: '',
      name: 'departments',
      component: () => import('@/views/departments'),
      meta: { title: '组织架构', icon: 'tree' }
    }
  ]
}
