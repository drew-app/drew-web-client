<template>
  <div id="app">
    <router-view name="header"/>
    <div id="main">
      <router-view name="main"/>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'drew-app',
  components: {
    AppHeader
  }
}
</script>

<style lang="stylus">
  @require '~@/assets/stylesheets/includes'

  #app
    #main
      position: relative;

</style>
