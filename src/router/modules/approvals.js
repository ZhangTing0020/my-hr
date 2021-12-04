// 审批模块
import Layout from '@/layout'

export default {
  path: '/approvals',
  component: Layout,
  children: [
    {
      // 如果path的值是空，那么默认就显示该二级路由
      path: '',
      name: 'approvals',
      component: () => import('@/views/approvals'),
      meta: { title: '审批', icon: 'tree-table' }
    }
  ]
}
