<template>
  <div id="app">
    <main-nav/>
    <router-view/>
  </div>
</template>
<script>
import MainNav from '@/components/MainNav.vue'

export default {
  name: 'drew-app',
  components: {
    MainNav
  }
}
</script>

<style lang="stylus">
</style>
