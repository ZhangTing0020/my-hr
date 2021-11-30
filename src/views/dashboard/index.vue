<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ uname }}</div>
    <svg-icon class-name="abc" icon-class="tree" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'uname'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.abc {
  color: red;
}
</style>
