<template>
  <div id="app">
    <!-- 一级路由组件填充位 -->
    <!-- 要么是登录页；要么是主页；404 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
