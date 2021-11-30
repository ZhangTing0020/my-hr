import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

// 获取token信息
export function getToken() {
  return Cookies.get(TokenKey)
}

// 保存token信息
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除token信息
export function removeToken() {
  return Cookies.remove(TokenKey)
}
