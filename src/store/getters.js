const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo && state.user.userInfo.staffPhoto,
  // 如果前边为真,就取后边的值
  // 如果前边为假,后边就不运行了

  uname: state => state.user.userInfo && state.user.userInfo.username,
  // 因为获取用户头像依赖于 用户id,,,用户id是获取用户名的时候顺便得到的
  userId: state => state.user.userInfo && state.user.userInfo.userId
}
export default getters
