import {
  login,
  getInfo,
  getDetailInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    // 从缓存中读取原有的token
    token: getToken(),
    name: '',
    avatar: '',
    // 用户信息
    userInfo: null
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 这里是在定义方法,mutations中的方法
  // mutations 方法的第一个参数是state
  // 更新用户信息
  updateInfo(state, payload) {
    if (state.userInfo) {
      // 之前已经有数据了
      state.userInfo = {
        ...state.userInfo,
        ...payload
      }
    } else {
      // 之前是默认数据null
      state.userInfo = payload
    }
  },
  removeInfo(state, Info) {
    state.userInfo = null
  }
}

const actions = {
  // action的返回值是Promise实例对象
  async login({ commit }, userInfo) {
    const {
      username,
      password
    } = userInfo
    const ret = await login({
      mobile: username.trim(),
      password: password
    })
    if (ret.code === 10000) {
      // console.log(ret)
      // 登录成功
      commit('SET_TOKEN', ret.data)
      // 缓存token(存到Cookie中)
      setToken(ret.data)
      return Promise.resolve(true)
    } else {
      // 登录失败
      return Promise.reject(false)
    }
  },

  logout({ commit }) {
    // 删除vuex中的token
    commit('SET_TOKEN', '')
    // 删除本地存储中的token
    removeToken()
    // 删除用户信息
    commit('removeInfo', '')
  },

  // 获取用户信息 ,这里是从layout下的components/Navbar调过来的
  // 这个getInfo是 actions的属性,actions是异步修改数据,
  // 在严格模式下,修改数据只能通过mutations修改

  // actions中方法的第一个参数是store
  async getInfo({
    commit,
    state
  }) {
    const ret = await getInfo() // 这个getInfo 是api下的接口
    // console.log(ret)
    if (ret.code === 10000) {
      // 在严格模式下,修改数据只能通过mutations修改
      // 触发mutations更新用户信息
      // 如果形参中不把对象结构,,,,直接写成store,这里就要写成 store.commit('updateInfo', ret.data)
      commit('updateInfo', ret.data)
    }
  },

  // 获取包括头像的详细数据
  async getDetailInfo(context, id) {
    const ret = await getDetailInfo(id)
    // console.log(ret)
    if (ret.code === 10000) {
      context.commit('updateInfo', ret.data)
    }
  },

  // // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       removeToken() // must remove  token  first
  //       resetRouter()
  //       commit('RESET_STATE')
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
