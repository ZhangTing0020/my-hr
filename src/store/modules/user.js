import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

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
  updateInfo(state, payload) {
    state.userInfo = payload
  }
}

const actions = {
  // action的返回值是Promise实例对象
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const ret = await login({ mobile: username.trim(), password: password })
    if (ret.code === 10000) {
      console.log(ret)
      // 登录成功
      commit('SET_TOKEN', ret.data)
      // 缓存token(存到Cookie中)
      setToken(ret.data)
      return Promise.resolve(true)
    } else {
      // 登录失败
      return Promise.reject(false)
    }
    // return new Promise((resolve, reject) => {
    //   login({ mobile: username.trim(), password: password })
    //     .then(response => {
    //       const { data } = response
    //       commit('SET_TOKEN', data.token)
    //       setToken(data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    // })
  },

  // // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response

  //       if (!data) {
  //         return reject('Verification failed, please Login again.')
  //       }

  //       const { name, avatar } = data

  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // 获取用户信息
  async getInfo({ commit, state }) {
    const ret = await getInfo()
    if (ret.code === 10000) {
      // 触发mutations更新用户信息
      commit('updateInfo', ret.data)
    }
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
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
