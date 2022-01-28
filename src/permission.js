import router from './router'
import store from './store'
// import { dynamicRoutes } from '@/router/index.js'
// 白名单
const whiteList = ['/login', '/404', '/abc']

// 全局导航守卫
// 解决的问题,如果没有登录,跳到首页去登录,设置白名单
router.beforeEach(async (to, from, next) => {
  // 判断是否有token
  const token = store.getters.token
  if (token) {
    // token已经存在
    if (to.path === '/login') {
      // 跳转到登录页面
      next('/')
    } else {
      if (store.getters.userId) {
        next()
      } else {
        // 不是登录页，正常通行
        // 获取用户资料,重点得到用户的权限信息:menus points (触发actions完成)
        // actions下边有一个getInfo 获取用户信息的方法
        // 这里必须手动再次调用如下的getInfo方法，需要确保获取用户信息后，才可以得到menu权限

        await store.dispatch('user/getInfo') // 触发完成之后,已经拿到了menus points
        // // 根据获取的用户的权限信息,动态添加路由
        // // 怎么动态添加路由,,,路由中提供了一个方法叫addRoutes (vue-router提供的)
        // const menus = store.state.user.userInfo.roles.menus
        // // 根据menus的权限列表,筛选动态路由映射(一共有8个动态路由)
        // const myAuth = dynamicRoutes.filter(item => {
        //   // item指的是每一个模块的路由
        //   // item.children[0] 获取children数组中的第0个元素
        //   // 取出其中的name
        //   return menus.includes(item.children[0].name)
        // })

        // filterDynamicRoutes 负责根据用户的权限过滤动态路由，与静态路由合并放到vuex的状态里面
        // 然后返回动态路由，用于添加动态路由
        // 把上边的这段代码挪到了store/modules/permission.js中  然后在这里触发actions
        // 因为actions返回的是Promise对象,所以要异步等待
        const myAuth = await store.dispatch('permission/filterDynamicRoutes')

        // 基于vue-router的API动态添加路由映射
        // router.addRoutes(myAuth) // 需要判断是不是第一次,不然每次都要添加动态路由,每一次都会走这个分支,所以上边需要判断userId中是否有值
        // 添加了404页面,
        router.addRoutes([...myAuth, { path: '*', redirect: '/404', hidden: true }])
        next({
          ...to,
          replace: true // 如果添加了动态路由,那么路由会重新请求一次,所以就是会请求两次,当点击回退按钮的时候,页面不会发生变化,这样会导致同一个路由连接请求两次
          // 那么浏览器回退会多出一个历史记录,体验不好,所以可以使用replace属性,设置为true,覆盖第一次请求
        })
        // next()

        // 此时动态路由已经生效了,但是左侧菜单不显示,可以通过修改url中的路径看到,会跳转页面
        // 因为通过vue-router的this.$router.options.routes 无法获取动态路由映射
        // layout/sidebar/index.vue 中 不再使用this.$router.options.routes来获取路由,而是将路由信息放在vuex中,在store/modules下新增permission.js 在这个文件中专门放置路由信息
        // 文件中包含 state mutations  actions , state中放的是键值对 routes: constantRoutes // 默认静态路由表
        // 在mutations中将静态路由和动态路由拼接起来成为state.route ,这里的动态路由是怎么来的呢,是由actions里边触发commit的时候传参传过来的
        // 在actions中,,,上传动态路由,,,在所有的动态路由中dynamicRouters,筛选出 后台返回的menus中有的动态路由模块
        // 筛选出存在路由,然后 context.commit('setRoutes', myAuth) 传递给mutations,合并路由
        // 然后还要把筛选出的动态路由返回
        // 返回来的动态路由,添加到addRoutes   基于vue-router的API动态添加路由映射
      }
    }
  } else {
    // token不存在
    if (whiteList.includes(to.path)) {
      // 在白名单里面
      next()
    } else {
      // 不在白名单里面
      next('/login')
    }
  }
})

