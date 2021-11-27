<template>
  <div id="app">
    <!-- 一级路由 填充位,一级路由组件映射到这个位置 -->
    <!-- 这个位置,要么是登录页,要么是主页,要么是404,三者是互斥关系 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
